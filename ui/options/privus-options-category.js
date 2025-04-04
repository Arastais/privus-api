import { GetGroupLocKey } from '/core/ui/options/options-helpers.js';
import { FxsVSlot } from '/core/ui/components/fxs-slot.js';

const OptionsCategoryCategory = 'screen-options-category';


class PrivusOptionsCategory extends FxsVSlot {
    constructor() {
        super(...arguments);
        this.groupHeaders = {};
    }
    //No actual API yet
}

class DefaultOptionsCategory {
    createGroupHeader(group) {
        const groupTitle = document.createElement('fxs-header');
        if(!group.startsWith("mod-"))
            groupTitle.setAttribute('title', GetGroupLocKey(group));
        else {
            const modId = group.slice(4);
            const mod = Modding.getInstalledMods().find((m => m.id === modId));
            if(!mod) throw new Error(`[PRIVUS] Cannot find installed mod with id '${modId}'`);
            groupTitle.setAttribute('title', mod.name);
        }
        groupTitle.setAttribute('data-group', group);
        return this.Root.appendChild(groupTitle);
    }
}


Privus.define(OptionsCategoryCategory, {
    createInstance: PrivusOptionsCategory,
    createDefaultInstance: DefaultOptionsCategory,
    extend: true,
    attributes: [{name: 'disable-focus-allowed', description: 'Determines if focus is allowed to occur on disabled items.'},],
    tabIndex: -1
});