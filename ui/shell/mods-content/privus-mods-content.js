import Panel from '/core/ui/panel-support.js';
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import ActionHandler from '/core/ui/input/action-handler.js';

const ModsContentCategory = 'mods-content';

class PrivusModsContent extends Panel {
    constructor(root) {
        super(root);
        
        this.selectedHandle = null;
        this.showNotOwnedContent = false;
        this.selectedMod = Modding.getInstalledMods().find(
            (mod) => (!mod.official || mod.allowance == ModAllowance.Full) && Modding.getModProperty(mod.handle, "ShowInBrowser") != "0");
        
        this.modToggledActivateListener = this.onModToggled.bind(this);
        this.onModActivateListener      = this.onModClicked.bind(this);
        this.onModFocusListener         = this.onModFocused.bind(this);
        //Not needed as we automatically add the listeners, not the mods
        //this.onModListeners = Object.freeze({
        //    onModToggled: this.modToggledActivateListener,
        //    onModClicked: this.onModActivateListener,
        //    onModFocused: this.onModFocusListener
        //});
        
        this.focusListener       = PrivusControls.defaultFn(ModsContentCategory, "onFocus"      ).bind(this);
        this.engineInputListener = PrivusControls.defaultFn(ModsContentCategory, "onEngineInput").bind(this);
    }


    renderUIModList(initialModHandle, root) { return PrivusControls.privusFn(ModsContentCategory, "renderUIModList", initialModHandle, root); }

    updateModDetails(modHandle)      { return PrivusControls.privusFn(ModsContentCategory, "updateModDetails",      modHandle); }
    updateModToggleButton(modHandle) { return PrivusControls.privusFn(ModsContentCategory, "updateModToggleButton", modHandle); }
    updateModEntry(modHandle, entry) { return PrivusControls.privusFn(ModsContentCategory, "updateModEntry",        modHandle, entry); }

    onModToggled(event) { return PrivusControls.privusFn(ModsContentCategory, "onModToggled", event); }
    onModClicked(event) { return PrivusControls.privusFn(ModsContentCategory, "onModClicked", event); }
    onModFocused(event) { return PrivusControls.privusFn(ModsContentCategory, "onModFocused", event); }

    get selectedModHandle() { return this.selectedHandle; }
    set selectedModHandle(value) {
        this.selectedHandle = value;
        this.selectedMod = Modding.getModInfo(this.selectedHandle);
    }
    
    get modEntries() { return this.entries; }


    onInitialize() {
        super.onInitialize();
        this.Root.innerHTML = PrivusControls.defaultFn(ModsContentCategory, "getContent").call(this);

        this.mainSlot               = MustGetElement(".additional-content-mods", this.Root);
        this.modNameHeader          = MustGetElement('.selected-mod-name',       this.Root);
        this.modDateText            = MustGetElement('.mod-date',                this.Root);
        this.modDescriptionText     = MustGetElement('.mod-description',         this.Root);
        this.modDependenciesContent = MustGetElement('.mod-dependencies',        this.Root);

        this.selectedMod ??= Modding.getInstalledMods()[0];
        this.selectedHandle ??= this.selectedMod.handle;

        const modActivatables = this.renderUIModList(this.selectedModHandle, this.Root, this.onModListeners);
        this.entries = this.Root.querySelectorAll(".mod-entry");
        MustGetElement('.toggle-enable').addEventListener("action-activate", this.modToggledActivateListener);
        modActivatables.forEach(activatable => {
            activatable.addEventListener('action-activate', this.onModActivateListener);
            activatable.addEventListener('focus', this.onModFocusListener);
        })
        console.info(...Array.from(this.modEntries, (e) => e.getAttribute('mod-handle')));
    }

    onAttach() {
        super.onAttach();
        this.Root.addEventListener("focus", this.focusListener);
        this.Root.addEventListener("engine-input", this.engineInputListener);
        this.updateModDetails(this.selectedModHandle);
    }
}



class DefaultModsContent extends Panel {
    constructor(root) { super(root); }

    renderUIModList(initialModHandle, root, listeners) {
        return PrivusControls.defaultFn(ModsContentCategory, "renderModListContent").call(this);
    }


    updateModDetails(modHandle) {
        if(!modHandle) throw new Error(`[PRIVUS-DEFAULT]: Invalid mod handle '${modHandle}'`);
        const modInfo = Modding.getModInfo(modHandle);

        this.modNameHeader.setAttribute('title', modInfo.name);
        this.modDescriptionText.setAttribute('data-l10n-id', modInfo.description);
        if (modInfo.created)
            this.modDateText.textContent = Locale.compose("LOC_UI_MOD_DATE", modInfo.created);

        if (!modInfo.dependsOn) {
            this.updateModToggleButton(modHandle);
            return;
        }
        this.modDependenciesContent.classList.remove('hidden');
        modInfo.dependsOn.forEach(dependecy => {
            const depElement = document.createElement('div');
            depElement.classList.add("mod-dependency", "relative");
            depElement.setAttribute('data-l10n-id', dependecy);
            this.modDependenciesContent.appendChild(depElement);
        });

        this.updateModToggleButton(modHandle);
    }

    updateModToggleButton(modHandle) {
        if(!modHandle) throw new Error(`[PRIVUS-DEFAULT]: Invalid mod handle '${modHandle}'`);
        this.selectedModHandle = modHandle;
        PrivusControls.defaultFn(ModsContentCategory, "determineEnableButtonState").call(this);
    }

    updateModEntry(modHandle, entry) {
        if(!modHandle) throw new Error(`[PRIVUS-DEFAULT] Invalid mod handle '${modHandle}'`);
        const modInfo = Modding.getModInfo(modHandle);
        if(!entry) throw new Error(`[PRIVUS-DEFAULT] Cannot find entry for mod ${modInfo.name}`);

        const nameElement = entry.querySelector(".mod-text-name");
        if(nameElement) nameElement.textContent = modInfo.name;
        const enabledElement = entry.querySelector(".mod-text-enabled");
        if(enabledElement)
            enabledElement.setAttribute('data-l10n-id', "LOC_UI_" + (modInfo.enabled ? "ENABLED" : "DISABLED"));
    }


    onModToggled(event) {
        if (!(event.target instanceof HTMLElement)) return;
        if (!this.selectedModHandle) throw new Error(`[PRIVUS-DEFAULT] Invalid mod handle '${this.selectedModHandle}'`);
        
        const modHandles = [this.selectedModHandle];
        const modInfo = this.selectedMod;
        if (modInfo.enabled && Modding.canDisableMods(modHandles).status == 0) 
            Modding.disableMods(modHandles);
        else if (!modInfo.enabled && Modding.canEnableMods(modHandles, true).status == 0)
            Modding.enableMods(modHandles, true);
            
        event.target.setAttribute('disabled', 'true');


        const entry = Array.from(this.modEntries).find(elem => elem.getAttribute('mod-handle') === this.selectedModHandle.toString());
        this.updateModDetails(this.selectedModHandle);
        this.updateModEntry(this.selectedModHandle, entry);
        this.updateModToggleButton(this.selectedModHandle);
        PrivusControls.defaultFn(ModsContentCategory, "updateNavTray").call(this);
    }

    onModClicked(event) {
        if (!(event.target instanceof HTMLElement)) return;
        
        this.selectedModHandle = parseInt(event.target.getAttribute('mod-handle') ?? "");
        if (ActionHandler.isGamepadActive) {
            Audio.playSound("data-audio-primary-button-press");
            this.onModToggled(this.selectedModHandle, event);
            return;
        }

        this.updateModDetails(this.selectedModHandle);
    }

    onModFocused(event) {
        if (!(event.target instanceof HTMLElement)) return;

        this.selectedModHandle = parseInt(event.target.getAttribute('mod-handle') ?? "");
        this.updateModDetails(this.selectedModHandle);
        PrivusControls.defaultFn(ModsContentCategory, "updateNavTray").call(this);
    }


    /* Base function overrides */
    updateModListContent() {
        this.renderUIModList(this.selectedModHandle, this.Root, this.onModListeners);
        this.modEntries = this.Root.querySelectorAll(".mod-entry");
    }

    handleSelection(modHandle, index) {
        this.selectedModHandle = modHandle;
        PrivusControls.defaultFn(ModsContentCategory, "setSelectedModHandle").call(this, modHandle);
        this.updateModDetails(modHandle);
    }

    onEngineInput(event) {}
}

PrivusControls.define(ModsContentCategory, {
    createInstance: PrivusModsContent,
    createDefaultInstance: DefaultModsContent,
    description: 'Mods List',
    classNames: [ModsContentCategory],
    attributes: [{name: "show-not-owned-content", description: "should content not owned (default: false)"}],
    tabIndex: -1
});

export {ModsContentCategory as default};