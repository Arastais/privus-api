"use strict";

const baseDefineFn = ComponentManager.prototype.define;

class PrivusComponentManager {
    constructor() {
        //super();
        this._privusMods = {};
        this._defaultTypes = {};
        this._privusDefs = {};
        this._privusDefaultInstances = {};
        this._privusInstances = {};
        //Loading.runWhenLoaded(() => { this.registerControls(); });
        console.info(`[PRIVUS] Privus API initiated`);
    }
    

    defineDefaultType(category, type) {
        this._defaultTypes[category] = type;
    }

    define(category, definition) {
        this._privusDefs[category] = definition;
        baseDefineFn.call(Controls, category, definition);
        console.info(`[PRIVUS] Registered ${category} with ${definition.createDefaultInstance.name || 'base game class'} as default class for ${definition.createInstance.name}`);
    }

    
    getDefaultType(category) {
        return this._defaultTypes[category];
    }

    getDefinition(category) {
        return this._privusDefs[category];
    }

    createModInstances(category, root) {
        if(!Object.hasOwn(this._privusMods, category)) return;

        if(!this._privusInstances[category])
            this._privusInstances[category] = {};

        let modsInitialized = [];
        this._privusMods[category].forEach(componentPair => {
            this._privusInstances[category][componentPair[1]] = new componentPair[0](root);
            modsInitialized.push(componentPair[1])
        });
        console.info(`[PRIVUS] Initialized '${category}' of mods: ${modsInitialized.join(', ')}`);
    }

    setDefaultInstance(category, obj) {
        this._privusDefaultInstances[category] = obj;
    }

    
    privusFn(category, functionName, ...funcArgs) {
        let modIds = [];
        let rets = [];
        if(this._privusMods[category]){
        	this._privusMods[category].forEach(componentPair => {
        		if (typeof componentPair[0].prototype[functionName] !== "function") return;
        		rets.push(componentPair[0].prototype[functionName].call(this._privusInstances[category][componentPair[1]], modIds, ...funcArgs));
                modIds.push(componentPair[1]);
        	});
        }

        if(modIds.length === 0)
            rets.push(this.defaultFn(category, functionName).call(this._privusDefaultInstances[category], ...funcArgs));

        return rets;
    }

    //TODO?
    //privusProperty(...)

    defaultFn(category, functionName) {
        if(!this._privusDefaultInstances[category][functionName])
            throw new Error(`No default function '${functionName}' for category '${category}'!`);
        if (typeof this._privusDefaultInstances[category][functionName] !== "function") 
            throw new Error(`Default function '${functionName}' for category '${category}' isn't actually a function!`);

        return this._privusDefaultInstances[category][functionName];
    }
    

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
    
    const def = Controls.getDefinition(this.typeName);
    if(!def) return;
    if(!def.createDefaultInstance || def.createDefaultInstance === null)
        def.createDefaultInstance = Privus.getDefaultType(this.typeName);


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
    
    if(def.createInstance.name !== def.createDefaultInstance.name) {
        const defaultComponent = new def.createDefaultInstance(this);
        Privus.setDefaultInstance(this.typeName, defaultComponent);
        console.info(`[PRIVUS] Initializing Privus API Class ${def.createInstance.name} with ${def.createDefaultInstance.name} as default`);
    } 
    else 
        console.debug(`[PRIVUS] Initialized ${this.typeName} using default class ${def.createInstance.name}`);
    const component = new def.createInstance(this);
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
