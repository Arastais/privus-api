"use strict";

class PrivusModManager {
    constructor() {
        this._privusMods = {};
        this._privusDefaults = {};
        console.error("OOGA CHAKER");
    }

    definePrivusDefaultClass(category, defaultClass) {
        this._privusDefaults[category] = new defaultClass();
    }
    
    definePrivusClass(modId, category, componentClass) {
        console.error("[PRIVUS] IM BATU KHAN");
        if(!this._privusMods[category])
            this._privusMods[category] = [];
        this._privusMods[category].push([new componentClass(), modId]);
    }

    privusFn(category, functionName, ...funcArgs) {
        let modIds = [];
        let rets = [];
        if(Object.hasOwn(this._privusMods, category)){
        	this._privusMods[category].forEach(componentPair => {
        		if (typeof componentPair[0][functionName] !== "function") return;

        		rets.push(componentPair[0][functionName](modIds, ...funcArgs));
        	});
        }

        if(modIds.length === 0)
            rets.push(this.defaultFnInstance(category, functionName)(...funcArgs));

        return rets;
    }

    //TODO?
    //privusProperty(...)

    defaultFnInstance(category, functionName) {
        if(!this._privusDefaults[category])
            throw new Error(`No default function '${functionName}' for category '${category}'!`);
        if (typeof this._privusDefaults[category][functionName] !== "function") 
            throw new Error(`Default function '${functionName}' for category '${category}' isn't actually a function!`);

        return this._privusDefaults[category][functionName];
    }
}

const PrivusMods = new PrivusModManager();
export { PrivusMods as default };