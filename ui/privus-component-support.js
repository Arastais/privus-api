"use strict";

const baseDefineFn = ComponentManager.prototype.define;

class PrivusComponentManager {
    constructor() {
        this._privusMods = {};
        this._defaultTypes = {};
        this._privusDefs = {};
        this._privusInstances = {};
        this._privusModInstances = {};
        console.info(`[PRIVUS] Privus API initiated`);
    }
    
    /**
     * Sets the class for the default functionality of a component
     * @param {string} category Category string
     * @param {class} type Class with default functionality of the component
     */
    defineDefaultType(category, type) {
        this._defaultTypes[category] = type;
    }

    /**
     * Defines a Privus API component
     * @param {string} category Category string
     * @param {object} definition Component definition
     */
    define(category, definition) {
        this._privusDefs[category] = definition;
        baseDefineFn.call(Controls, category, definition);
        console.info(`[PRIVUS] Registered ${category} with ${definition.createDefaultInstance.name || 'base game class'} as default class for ${definition.createInstance.name}`);
    }

    /**
     * Gets the class for the default functionality of a component
     * @param {string} category Category string
     */
    getDefaultType(category) {
        return this._defaultTypes[category];
    }

    /**
     * Gets the definition of a Privus API component
     * @param {string} category Category string
     */
    getDefinition(category) {
        return this._privusDefs[category];
    }


    /**
     * Creates the objects for each privus mod class
     * @param {string} category Category string
     * @param {ComponentRoot} root Root component
     */
    createModInstances(category, root) {
        if(!Object.hasOwn(this._privusMods, category)) return;

        if(!this._privusModInstances[category])
            this._privusModInstances[category] = {};

        let modsInitialized = [];
        this._privusMods[category].forEach(componentPair => {
            this._privusModInstances[category][componentPair[1]] = new componentPair[0](root);
            modsInitialized.push(componentPair[1])
        });
        console.info(`[PRIVUS] Initialized '${category}' of mods: ${modsInitialized.join(', ')}`);
    }


    /**
     * Sets the object of a Privus API class
     * @param {string} category Category string
     * @param {object} obj Default component object instance
     */
    setInstance(category, obj) {
        this._privusInstances[category] = obj;
    }

    /**
     * Gets the object of a Privus API class
     * @param {string} category Category string
     */
    getInstance(category) {
        return this._privusInstances[category];
    }


    /**
     * Sets a public API member of a Privus API class
     * @param {string} category Category string
     * @param {string} memberName Name of the API member, as a string
     * @param {*} value New value of the member
     */
    setMember(category, memberName, value) {
        this.getInstance(category)[memberName] = value;
    }

    /**
     * Gets a public API member of a Privus API class
     * @param {string} category Category string
     * @param {string} memberName Name of the API member, as a string
     */
    getMember(category, memberName) {
        return this.getInstance(category)[memberName];
    }
    

    /**
     * Calls the Privus API function of each mod, of the default if no mods implement it
     * @param {string} category Category string
     * @param {string} functionName Name of the function to call
     * @param {...any} funcArgs Any arguments to pass to the API function
     * @returns An array that contains the return value of each function
     */
    privusFn(category, functionName, ...funcArgs) {
        let modIds = [];
        let rets = [];
        if(this._privusMods[category]){
        	this._privusMods[category].forEach(componentPair => {
        		if (typeof componentPair[0].prototype[functionName] !== "function") return;
        		rets.push(componentPair[0].prototype[functionName].call(this._privusModInstances[category][componentPair[1]], modIds, ...funcArgs));
                modIds.push(componentPair[1]);
        	});
        }

        if(modIds.length === 0)
            rets.push(this.defaultFn(category, functionName).call(this._privusInstances[category], ...funcArgs));

        return rets.flat(1);
    }

    //TODO?
    //privusProperty(...)


    /**
     * Calls the default/base game functionality of a Privus API function
     * @param {string} category Category string
     * @param {string} functionName Name of the function to call
     * @returns The unbounded function
     */
    defaultFn(category, functionName) {
        if(!this._privusDefs[category].createDefaultInstance.prototype[functionName])
            throw new Error(`No default function '${functionName}' for category '${category}'!`);
        if (typeof this._privusDefs[category].createDefaultInstance.prototype[functionName] !== "function") 
            throw new Error(`Default function '${functionName}' for category '${category}' isn't actually a function!`);

        return this._privusDefs[category].createDefaultInstance.prototype[functionName];
    }
    

    /**
     * Defines a Privus API function class for a mod
     * @param {string} category Id of the mod
     * @param {string} category Category string
     * @param {string} componentClass Class with implmented API functions
     * @returns The unbounded function
     */
    defineModClass(modId, category, componentClass) {
        if(!this._privusMods[category])
            this._privusMods[category] = [];
        this._privusMods[category].push([componentClass, modId]);
        console.info(`[PRIVUS] Registered mod '${modId}' class ${componentClass.name}`);
    }
}

const Privus = new PrivusComponentManager();

ComponentRoot.prototype.initialize = function() {
    if(this._isInitialized) return;
    if(this.fxsInDatabindAnchor){
        this._isMutator = true;
        this._isInitialized = true;
        return;
    }

    console.debug('[PRIVUS] Initializing root component');

    Privus.createModInstances(this.typeName, this);
    
    const baseType = Privus.getDefaultType(this.typeName);
    const def = Controls.getDefinition(this.typeName);
    if(!def) return;
    if(!def.createDefaultInstance || def.createDefaultInstance === null)
        def.createDefaultInstance = baseType;
    else if(baseType.name !== def.createDefaultInstance.name)
        for(let propName of Object.getOwnPropertyNames(baseType.prototype))
            if(typeof baseType.prototype[propName] === "function" && !def.createDefaultInstance.prototype[propName])
                def.createDefaultInstance.prototype[propName] = baseType.prototype[propName];


    const classNames = def.classNames;
    if (classNames && classNames.length > 0) 
        this.classList.add(...classNames);
    

    if (def.contentTemplates) {
        for (const t of def.contentTemplates) 
            this.appendChild(t.content.cloneNode(true));
    }
    else console.trace(`[PRIVUS] ${this.typeName} has no content`);


    if (def.tabIndex != undefined && !this.hasAttribute("tabindex")) 
        this.setAttribute("tabindex", def.tabIndex.toString());
    
    if(def.createInstance.name !== def.createDefaultInstance.name) 
        console.info(`[PRIVUS] Initializing Privus API Class ${def.createInstance.name} with ${def.createDefaultInstance.name} as default`);
    else 
        console.debug(`[PRIVUS] Initialized ${this.typeName} using default class ${def.createInstance.name}`);
    
    if(def.extend === true)
        for(let propName of Object.getOwnPropertyNames(def.createDefaultInstance.prototype))
            if(typeof def.createDefaultInstance.prototype[propName] === "function" && (!def.createInstance.prototype[propName] || (def.override && def.override.includes(propName))))
                def.createInstance.prototype[propName] = def.createDefaultInstance.prototype[propName];
    const component = new def.createInstance(this);
    Privus.setInstance(this.typeName, component);
    this._component = component;
    

    
    const decorators = Controls.getDecoratorProviders(this.typeName);
    for (let i = 0; i < decorators.length; ++i)
        this._decorators.push(decorators[i](component));


    if (this.whenCreatedListeners) {
        for (let listeners of this.whenCreatedListeners)
            listeners(component);
        this.whenCreatedListeners = undefined;
    }

    component.onInitialize();
    this._isInitialized = true;
    this.doAttach();
};

ComponentManager.prototype.define = function (name, definition) {
    Privus.defineDefaultType(name, definition.createInstance);
    const privusDef = Privus.getDefinition(name);
    baseDefineFn.call(this, name, privusDef ?? definition);
};
