import { CategoryData } from '/core/ui/options/options-helpers.js';
import Panel from '/core/ui/panel-support.js';
import { displayRequestUniqueId } from '/core/ui/context-manager/display-handler.js';
import { Options } from '/core/ui/options/model-options.js';
import { MainMenuReturnEvent } from '/core/ui/events/shell-events.js';
import DialogManager, { DialogBoxAction } from '/core/ui/dialog-box/manager-dialog-box.js';
import ModOptions from '/privus-api/privus-options-manager.js';
import '/privus-api/ui/options/privus-options-category.js';

const OptionsCategory = 'screen-options';

class PrivusOptions extends Panel {
    constructor(root) {
        super(root);
        this.panels = [];
        this.tabData = [];
        this.slotGroup = document.createElement('fxs-slot-group');
        this.dialogId = displayRequestUniqueId();
        this.categoryData = Object.assign(CategoryData, { mods: {
            title: "LOC_UI_MP_HEADER_MODS",
            description: "LOC_OPTIONS_REMAP_KBM_TEXT" //temp
        }});
    }

    //No actual API yet
    onDefaultOptions(event) { Privus.privusFn(OptionsCategory, "onDefaultOptions", event); }
    onConfirmOptions(event) { Privus.privusFn(OptionsCategory, "onConfirmOptions", event); }
    onCancelOptions(event)  { Privus.privusFn(OptionsCategory, "onCancelOptions",  event); }

    onOptionsTabSelected(event) { Privus.privusFn(OptionsCategory, "onOptionsTabSelected", event); }

    onEngineInput(event) { Privus.privusFn(OptionsCategory, "onEngineInput", event); }
}

class DefaultOptions {
    getOrCreateCategoryTab(categoryId) {
        const elementId = `category-table-${categoryId}`;
        let categoryPanel = this.panels.find(panel => panel.id === elementId);
        if (categoryPanel) return categoryPanel;

        const { title, description } = this.categoryData[categoryId];

        categoryPanel = document.createElement("screen-options-category");
        categoryPanel.classList.add(elementId, 'flex', 'flex-col');
        categoryPanel.id = elementId;
        categoryPanel.setAttribute('description', description);
        //Make sure the mods tab is always last
        const modsIndex = this.tabData.findIndex(tab => tab.category === 'mods');
        const newTab = {
            id: elementId,
            category: categoryId,
            label: title,
        };
        if(categoryId === 'mods' || modsIndex === -1) {
            this.panels.push(categoryPanel);
            this.tabData.push(newTab);
        } else {
            this.panels.splice(modsIndex, 0, categoryPanel);
            this.tabData.splice(modsIndex, 0, newTab);
        }

        return categoryPanel;
    }


    onDefaultOptions(event) {
        DialogManager.createDialog_ConfirmCancel({
            body: "LOC_OPTIONS_ARE_YOU_SURE_DEFAULT",
            title: "LOC_OPTIONS_DEFAULT",
            canClose: false,
            displayQueue: "SystemMessage",
            addToFront: true,
            callback: (e) => {
                if(e !== DialogBoxAction.Confirm) return;
                Options.resetOptionsToDefault();
                VisualRemaps.resetToDefaults();
                window.dispatchEvent(new MainMenuReturnEvent());
                this.close();
            }
        });
    }

    onConfirmOptions(event) {
        if (Options.isUIReloadRequired() && UI.isInGame()) {
            ShowReloadUIPrompt(this.close.bind(this));
            return;
        }
        if (Options.isRestartRequired()) {
            ShowRestartGamePrompt(this.close.bind(this));
            return;
        }

        Options.commitOptions();
        VisualRemaps.saveConfiguration();
        engine.trigger('update-tutorial-level');
        engine.trigger('UIFontScaleChanged');
        engine.trigger('UIGlobalScaleChanged');
        window.dispatchEvent(new MainMenuReturnEvent());
        this.close();
    }

    onCancelOptions(event) {
        if (!Options.hasChanges() && !VisualRemaps.hasUnsavedChanges()) {
            window.dispatchEvent(new MainMenuReturnEvent());
            this.close();
            return;
        }

        DialogManager.createDialog_ConfirmCancel({
            dialogId: this.dialogId,
            body: "LOC_OPTIONS_REVERT_DESCRIPTION",
            title: "LOC_OPTIONS_CANCEL_CHANGES",
            canClose: false,
            displayQueue: "SystemMessage",
            addToFront: true,
            callback: (e) => {
                if(e !== DialogBoxAction.Confirm) return;
                Options.restore();
                VisualRemaps.revertUnsavedChanges();
                window.dispatchEvent(new MainMenuReturnEvent());
                this.close();
            }
        });
    }


    onOptionsTabSelected(event) {
        event.stopPropagation();
        const { index } = event.detail;
        const slotId = this.panels[index].id;
        this.slotGroup.setAttribute('selected-slot', slotId);
    }


    onEngineInput(event) {
        if (event.detail.status != InputActionStatuses.FINISH)
            return;
        
        if (event.isCancelInput()) {
            this.onCancelOptions();
            event.preventDefault();
            event.stopPropagation();
        }
    
        switch (event.detail.name) {
        default:
            return;
        case 'shell-action-1':
            this.onConfirmOptions();
            break;
        case 'shell-action-2':
            this.onDefaultOptions();
            break;
        }
        event.preventDefault();
        event.stopPropagation();
    }
}


Privus.define(OptionsCategory, {
    createInstance: PrivusOptions,
    createDefaultInstance: DefaultOptions,
    description: 'Game options',
    extend: true,
    override: ['onAttach', 'onDetach', 'onInitialize', 'onLoseFocus', 'onReceiveFocus'],
    styles: ['fs://game/core/ui/options/screen-options.css'],
    tabIndex: -1,
}); 
