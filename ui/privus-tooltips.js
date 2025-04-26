import TooltipManager from '/core/ui/tooltips/tooltip-manager.js';

const TooltipManagerProto = Object.getPrototypeOf(TooltipManager);
const baseRegisterFn = TooltipManagerProto.registerPlotType;

class PrivusTooltipManager {
    constructor() {
        this._defaultInstances = {};
        this._privusSectionNames = {};
        this._privusSectionFns = {};
        this._privusClasses = {};
        this._privusInstances = {};
        this._priorities = {};
        this._modSectionFns = {};
        this._appendDivider = {};
        this._modList = {};
        this._modInstances = {};
        this._tooltipTypes = new Set();
        this._sectionOrders = {};
    }

    registerDefaultInstance(tooltipTypeName, instance, priority) {
        //this._tooltipTypes.add(tooltipTypeName);
        this._priorities[tooltipTypeName] = priority;
        this._defaultInstances[tooltipTypeName] = instance;
        console.info(`[PRIVUS][TOOLTIP] Registered default tooltip type ${instance.constructor.name} for '${tooltipTypeName}'`);
        if(this._privusClasses[tooltipTypeName])
            PrivusTooltips.initPrivusSections(tooltipTypeName);
        else 
            baseRegisterFn.call(TooltipManager, tooltipTypeName, priority, instance);
    }

    registerPrivusType(tooltipTypeName, type) {
        this._tooltipTypes.add(tooltipTypeName);
        this._privusClasses[tooltipTypeName] = type;
        //baseRegisterFn.call(TooltipManager, tooltipTypeName, +lowPriority, instance);
        console.info(`[PRIVUS][TOOLTIP] Registered privus tooltip type ${type.name}  for '${tooltipTypeName}'`);
        if(this._defaultInstances[tooltipTypeName])
            PrivusTooltips.initPrivusSections(tooltipTypeName);
    }

    getPrivusClass(tooltipTypeName) {
        if(!this._privusClasses[tooltipTypeName]) throw new Error(`[PRIVUS][TOOLTIP] Tooltip type '${tooltipTypeName}' has not been implemented in the Privus API yet!`);
        return this._privusClasses[tooltipTypeName];
    }

    getDefaultPrototype(tooltipTypeName) {
        if(!this._defaultInstances[tooltipTypeName]) throw new Error(`[PRIVUS][TOOLTIP] Tooltip type '${tooltipTypeName}' does not exist within the base game!`);
        return Object.getPrototypeOf(this._defaultInstances[tooltipTypeName]);
    }


    get tooltipTypes() {
        return Array.from(this._tooltipTypes);
    }

    getInstance(tooltipTypeName) {
        if(!this._privusInstances[tooltipTypeName])
            throw new Error(`[PRIVUS][TOOLTIP] Instance for tooltip '${tooltipTypeName}' does not exist. Has it been registered?`);
        return this._privusInstances[tooltipTypeName];
    }
    
    defaultFn(tooltipTypeName, fnName) {
        const proto = Object.getPrototypeOf(this.getInstance(tooltipTypeName));
        if (typeof proto[fnName] !== "function") throw new Error(`[PRIVUS][TOOLTIP] No default function '${fnName}' in '${proto.constructor.name}'. It only contains: ${Object.getOwnPropertyNames(proto)}`);
        return proto[fnName];
    }

    baseFn(tooltipTypeName, fnName) {
        const proto = this.getDefaultPrototype(tooltipTypeName);
        if (typeof proto[fnName] !== "function") throw new Error(`[PRIVUS][TOOLTIP][INTERNAL] No base function '${fnName}' in '${proto.constructor.name}'. It only contains: ${Object.getOwnPropertyNames(proto)}`);
        return proto[fnName];
    }


    getSectionFns(tooltipTypeName) {
        if(!this._modSectionFns[tooltipTypeName])
            this._modSectionFns[tooltipTypeName] = [];
        const sectionFns = [...this._modSectionFns[tooltipTypeName]];

        for(const sectionFn of this._privusSectionFns[tooltipTypeName])
            if(!sectionFns.find((fn) => fn.name === sectionFn.name))
                sectionFns.push(sectionFn);
    
        sectionFns.sort((a, b) => this._sectionOrders[tooltipTypeName][a.name.substring(6)] - this._sectionOrders[tooltipTypeName][b.name.substring(6)]);
        return sectionFns;
    }

    getModIds(tooltipTypeName, sectionFunctionName) {
        if(!this._modList[tooltipTypeName])
            this._modList[tooltipTypeName] = {};
        if(!this._modList[tooltipTypeName][sectionFunctionName])
            this._modList[tooltipTypeName][sectionFunctionName] = [];
        return this._modList[tooltipTypeName][sectionFunctionName];
    }

    getShouldAppendDivider(tooltipTypeName, sectionFunctionName) {
        if(!this._appendDivider[tooltipTypeName])
            this._appendDivider[tooltipTypeName] = {};
        if(!this._appendDivider[tooltipTypeName][sectionFunctionName])
            this._appendDivider[tooltipTypeName][sectionFunctionName] = false;
        return this._appendDivider[tooltipTypeName][sectionFunctionName];
    }

    initPrivusSections(tooltipTypeName) {
        if(!this._privusSectionFns[tooltipTypeName])
            this._privusSectionFns[tooltipTypeName] = [];

        const privusType = this.getPrivusClass(tooltipTypeName);
        const defaultTypeProto = this.getDefaultPrototype(tooltipTypeName);
        console.info(`[PRIVUS][TOOLTIP] Initializing Privus API Tooltip Class ${privusType.name} with ${defaultTypeProto.constructor.name} as default`);
        for(let propName of Object.getOwnPropertyNames(defaultTypeProto))
            if(typeof defaultTypeProto[propName] === "function" && !privusType.prototype[propName]) 
                privusType.prototype[propName] = defaultTypeProto[propName];

        this._privusInstances[tooltipTypeName] = new privusType();
        baseRegisterFn.call(TooltipManager, tooltipTypeName, this._priorities[tooltipTypeName], this._privusInstances[tooltipTypeName]);
        
        for(const [i, sectionFnName] of this._privusSectionNames[tooltipTypeName].entries()) {
            this._privusSectionFns[tooltipTypeName].push(privusType.prototype[sectionFnName].bind(this._privusInstances[tooltipTypeName]));
            if(!this._sectionOrders[tooltipTypeName])
                this._sectionOrders[tooltipTypeName] = {};
            if(!this._sectionOrders[tooltipTypeName][sectionFnName])
                this._sectionOrders[tooltipTypeName][sectionFnName] = (i + 1) * 2;
        }
        console.info(`[PRIVUS][TOOLTIP] Registered '${tooltipTypeName}' tooltip section functions: ${this._privusSectionNames[tooltipTypeName]}`);
    }

    registerPrivusSections(tooltipTypeName, ...sectionFunctionNames) {
        if(!this._privusSectionNames[tooltipTypeName])
            this._privusSectionNames[tooltipTypeName] = [];
        this._privusSectionNames[tooltipTypeName].push(...sectionFunctionNames);
    }

    registerModdedSections(tooltipTypeName, modId, modClass, ...sectionFunctionNames) {
        if(!this._modInstances[modClass.name])
            this._modInstances[modClass.name] = new modClass();
        if(!this._modSectionFns[tooltipTypeName])
            this._modSectionFns[tooltipTypeName] = [];
        if(!this._modList[tooltipTypeName])
            this._modList[tooltipTypeName] = {};

        for(const sectionFnName of sectionFunctionNames) {
            if(typeof modClass.prototype[sectionFnName] !== 'function')
                throw new Error(`[PRIVUS][TOOLTIP] ${modClass.name} does not contain a function '${sectionFnName}'. It only contains: ${Object.getOwnPropertyNames(modClass.prototype)}`);
            this._modSectionFns[tooltipTypeName].push(modClass.prototype[sectionFnName].bind(this._modInstances[modClass.name]));
            if(!this._modList[tooltipTypeName][sectionFnName])
                this._modList[tooltipTypeName][sectionFnName] = [];
            this._modList[tooltipTypeName][sectionFnName].push(modId);
            if(!this._sectionOrders[tooltipTypeName])
                this._sectionOrders[tooltipTypeName] = {};
            if(!this._sectionOrders[tooltipTypeName][sectionFnName])
                this._sectionOrders[tooltipTypeName][sectionFnName] = 0;
        }

        this._modSectionFns[tooltipTypeName].sort((a, b) => this._sectionOrders[tooltipTypeName][a.name.substring(6)] - this._sectionOrders[tooltipTypeName][b.name.substring(6)]);
    }

    setSectionOrders(tooltipTypeName, sectionFunctionOrders) {
        if(!this._sectionOrders[tooltipTypeName])
            this._sectionOrders[tooltipTypeName] = {};
        Object.assign(this._sectionOrders[tooltipTypeName], sectionFunctionOrders);
        
        this._modSectionFns[tooltipTypeName].sort((a, b) => this._sectionOrders[tooltipTypeName][a.name.substring(6)] - this._sectionOrders[tooltipTypeName][b.name.substring(6)]);
    }

    setAppendDivider(tooltipTypeName, sectionFunctionName, value = true) {
        if(!this._appendDivider[tooltipTypeName])
            this._appendDivider[tooltipTypeName] = {};
        this._appendDivider[tooltipTypeName][sectionFunctionName] = value;
    }
}

const PrivusTooltips = new PrivusTooltipManager();
export {PrivusTooltips as default};


Loading.runWhenInitialized(() => {
    TooltipManagerProto.registerPlotType = function (type, priority, instance) {
        PrivusTooltips.registerDefaultInstance(type, instance, priority);
        //baseRegisterFn.call(this, type, priority, instance);
    };
    console.info(`[PRIVUS][TOOLTIP] Initialized Privus Tooltip API`);
});


const baseOnUpdateFn = TooltipManagerProto.onUpdate;
TooltipManagerProto.onUpdate = function() {
    if(typeof Camera === 'undefined') return;
    baseOnUpdateFn.call(this);
}

