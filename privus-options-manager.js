import { Options, OptionType } from '/core/ui/options/model-options.js';

class PrivusOptionsManager {
    constructor() {
        
        this.onUiAutoScaleInit = (optionInfo) => {
            console.info('INIT GANG');
            const value = Configuration.getUser().uiAutoScale;
            optionInfo.currentValue = value;
        };
        this.onUiAutoScaleUpdate = (optionInfo, value) => {
            console.info('AUTO_SCALE: value');
            Configuration.getUser().setUiAutoScale(value);
            optionInfo.currentValue = Configuration.getUser().uiAutoScale;
        };
    }

    option(modId, key) { 
        return Options.data.get(`mod-${modId}-${key}`);
        // switch (o.type) {
        // case OptionType.Dropdown:
        //     return o.selectedItemIndex;
        // default:
        //     return o.currentValue;
        // }
    }

    addOption(modId, key, optionType, labelKey, descriptionKey, defaultVal, additionalProperties = {}) {
        Options.addInitCallback(() => {
            Options.addOption(Object.assign({
                category: 'mods',
                group: `mod-${modId}`, 
                type: optionType, 
                id: `mod-${modId}-${key}`, 
                label: labelKey, 
                description: descriptionKey, 
                defaultValue: defaultVal,
                initListener: undefined, //(updateInfo) => { console.info("OI"); },
                updateListener: (updateInfo, value) => { updateInfo.currentValue = value; }
            }, additionalProperties));
        });
    }


    loadAll() {
        const modKeys = [...Options.data.keys()].filter(id => id.startsWith('mod-'));
        for(const key of modKeys)
            Options.data.set(key, Object.assign(JSON.parse(localStorage.getItem(key)), Options.data.get(key)));
        console.info(`[PRIVUS][OPTIONS] Loaded mod settings from storage`);
    }

    revertAll() {
        const modKeys = [...Options.data.keys()].filter(id => id.startsWith('mod-'));
        for(const key of modKeys)
            Options.data.set(key, Object.assign(Options.data.get(key), JSON.parse(localStorage.getItem(key))));
        console.info(`[PRIVUS][OPTIONS] Reverted mod settings to their values from storage`);
    }

    commitAll() {
        const modOptions = [...Options.data.values()].filter(def => def.id.startsWith('mod-'));
        for(const def of modOptions)
            localStorage.setItem(def.id, JSON.stringify(def));
        console.info(`[PRIVUS][OPTIONS] Saved and commited all mod settings`);
    }

    resetAll() {
        const modOptions = [...Options.data.values()].filter(def => def.id.startsWith('mod-'));
        for(const def of modOptions) {
            Object.assign(def, { currentValue: def.defaultValue});
            localStorage.setItem(def.id, JSON.stringify(def));
        }
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
    baseInitFn.call(this);
    ModOptions.loadAll();
}