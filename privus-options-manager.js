import { Options, OptionType } from '/core/ui/options/model-options.js';


class PrivusOptionsManager {
    constructor() {
        this.settingsKey = 'modSettings';
        this.onUiAutoScaleInit = (optionInfo) => {
            const value = Configuration.getUser().uiAutoScale;
            optionInfo.currentValue = value;
        };
        this.onUiAutoScaleUpdate = (optionInfo, value) => {
            Configuration.getUser().setUiAutoScale(value);
            optionInfo.currentValue = Configuration.getUser().uiAutoScale;
        };
    }

    option(modId, key) { 
        if(!Options.data.has(`mod-${modId}-${key}`))
            console.warn(`[PRIVUS][OPTIONS] Option '${key}' does not exist for mod '${modId}'!`)
        return Options.data.get(`mod-${modId}-${key}`);
        // switch (o.type) {
        // case OptionType.Dropdown:
        //     return o.selectedItemIndex;
        // default:
        //     return o.currentValue;
        // }
    }

    addOption(modId, key, optionType, labelKey, descriptionKey, defaultVal, additionalProperties = {}) {
        //Options.addInitCallback(() => {
            Options.addOption(Object.assign({
                category: 'mods',
                group: `mod-${modId}`, 
                type: optionType, 
                id: `mod-${modId}-${key}`, 
                label: labelKey, 
                description: descriptionKey, 
                defaultValue: defaultVal,
                currentValue: this.load(`mod-${modId}-${key}`) ?? defaultVal,
                initListener: (updateInfo) => { updateInfo.currentValue = this.load(updateInfo.id) ?? defaultVal },
                updateListener: (updateInfo, value) => { updateInfo.currentValue = value; }
            }, additionalProperties));
        //});
    }


    

    load(key) {
        const settings = localStorage.getItem(this.settingsKey);
        if(!settings) return undefined;

        const settingsInfo = JSON.parse(settings);
        if(!settingsInfo || !settingsInfo[key]) return undefined;

        console.info(`[PRIVUS][OPTIONS] Loaded '${key}' from storage: ${settingsInfo[key].currentValue}`);
        return settingsInfo[key].currentValue;
    }

    save(entries) {
        const settings = localStorage.getItem(this.settingsKey);
        if(settings) 
            console.info(`[PRIVUS][OPTIONS] Overriding existing mod options!`);
        const settingsInfo = JSON.parse(settings ?? "{}");

        Object.assign(settingsInfo, entries);
        localStorage.setItem(this.settingsKey, JSON.stringify(settingsInfo));
        console.info(`[PRIVUS][OPTIONS] Saved keys to storage: ${Object.entries(entries).map(([key, def]) => [key, def.currentValue])}`);
    }

    loadAll() {
        const modDefs = [...Options.data.values()].filter(def => def.id.startsWith('mod-'));
        for(const def of modDefs) {
            const exisitngDef = Options.data.get(def.id);
            exisitngDef.currentValue = this.load(def.id) ?? exisitngDef.currentValue;
            Options.data.set(def.id, exisitngDef);
        }
        console.info(`[PRIVUS][OPTIONS] Loaded all mod settings from storage`);
    }

    revertAll() {
        const modDefs = [...Options.data.values()].filter(def => def.id.startsWith('mod-'));
        for(const def of modDefs) {
            const exisitngDef = Options.data.get(def.id);
            exisitngDef.currentValue = this.load(def.id) ?? exisitngDef.currentValue;
            Options.data.set(def.id, exisitngDef);
        }
        console.info(`[PRIVUS][OPTIONS] Reverted mod settings to their values from storage`);
    }

    commitAll() {
        const modOptions = [...Options.data.values()].filter(def => def.id.startsWith('mod-'));
        const entries = {};
        for(const def of modOptions)
            entries[def.id] = { currentValue: def.currentValue };
        this.save(entries);
        console.info(`[PRIVUS][OPTIONS] Saved and commited all mod settings`);
    }

    resetAll() {
        const modOptions = [...Options.data.values()].filter(def => def.id.startsWith('mod-'));
        const entries = {};
        for(const def of modOptions) 
            entries[def.id] = { currentValue: def.defaultValue};
        this.save(entries);
        console.info(`[PRIVUS][OPTIONS] Reset all mod settings to their default values`);
    }
}

const ModOptions = new PrivusOptionsManager();
export {ModOptions as default};


const OptionsProto = Object.getPrototypeOf(Options);

const baseCommitFn = OptionsProto.commitOptions;
OptionsProto.commitOptions = function(category) {
    if(!category || cateogry === 'mods')
        ModOptions.commitAll();
    baseCommitFn.call(this, category);
}

const baseRestoreFn = OptionsProto.restore;
OptionsProto.restore = function(category) {
    if(!category || cateogry === 'mods')
        ModOptions.revertAll();
    baseRestoreFn.call(this, category);
}

const baseResetFn = OptionsProto.resetOptionsToDefault;
OptionsProto.resetOptionsToDefault = function() {
    ModOptions.resetAll();
    //baseResetFn.call(this);
}


const baseInitFn = OptionsProto.init;
OptionsProto.init = function() {
    console.warn("INIT"); 
    baseInitFn.call(this);
    ModOptions.loadAll();
}