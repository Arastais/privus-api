//Get the mods content category from Privus API
import ModsContentCategory from '/privus-api/ui/shell/mods-content/privus-mods-content.js';

import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import FocusManager from '/core/ui/input/focus-manager.js';
import ModOptions from '/privus-api/privus-options-manager.js';
import { OptionType } from '/core/ui/options/model-options.js';

class ExampleModsContent {
    constructor(root) { 
        this._root = root;
        this.mods = Modding.getInstalledMods();
        this.mods.sort((a, b) => Locale.compare(a.name, b.name));
        //this.mods.sort((a, b) => +b.official - +a.official || Locale.compare(a.name, b.name));
    }

    renderUIModList(modIds, modHandle, root) {

        const modListScrollable = MustGetElement('.mod-list-scrollable', root);
        const modsAvailable = modListScrollable.parentNode;
        modsAvailable.removeChild(modListScrollable);
        modsAvailable.insertAdjacentElement('afterbegin', this.getScrollableNode(false));
        modsAvailable.insertAdjacentElement('afterbegin', this.getScrollableNode(true));
        
        const modDetailsScrollable = MustGetElement('.mod-details-scrollable', root);
        const rightPanel = modDetailsScrollable.parentNode;
        rightPanel.innerHTML = `
        <fxs-header filigree-style="none"
					class="mod-details-header relative flex justify-center font-title text-2xl uppercase text-secondary mb-3"
					title="LOC_EXAMPLE_MOD_UI_DETAILS_HEADER"></fxs-header>
		<fxs-scrollable class="mod-details-scrollable flex-auto m-6">
			<fxs-header class="selected-mod-name relative flex justify-center font-title text-xl uppercase mb-3"></fxs-header>
			<p class="mod-author relative"></p>
			<p class="mod-thanks hidden relative"></p>
			<fxs-header filigree-style="none"
						class="mod-description-header relative flex text-lg uppercase mb-1 mt-6"
						title="LOC_EXAMPLE_MOD_UI_DESCRIPTION_HEADER"></fxs-header>
			<p class="mod-description mb-6"></p>
			<fxs-vslot class="mod-gated hidden">
				<fxs-header filigree-style="none"
							class="mod-gated-header relative flex text-lg uppercase mb-1"
							title="LOC_EXAMPLE_MOD_UI_GATED_HEADER"></fxs-header>
				<p class="mod-gated-description relative mb-6"></p>
			</fxs-vslot>
			<fxs-header filigree-style="none"
						class="mod-description-header relative flex text-lg uppercase mb-1"
						title="LOC_EXAMPLE_MOD_UI_PROPERTIES_HEADER"></fxs-header>
			<fxs-hslot class="justify-between">
				<div class="relative w-2\\/2">
					<span class="mod-url hidden"></span>
					<p class="mod-version hidden"></p>
					<p class="mod-date hidden"></p>
					<p class="mod-affects-saved-game hidden"></p>
					<p class="mod-id wrap"></p>
				</div>
				<div class="relative justify-end pl-1 mr-1 w-1\\/2">
					<p class="mod-official hidden"></p>
					<p class="mod-unofficial hidden"></p>
					<p class="mod-compatibility hidden"></p>
				</div>
			</fxs-hslot>
		</fxs-scrollable>
        <fxs-hslot class="justify-center items-center" data-bind-class-toggle="hidden:{{g_NavTray.isTrayRequired}}">
			<fxs-button class="toggle-enable disabled" caption="LOC_ADVANCED_OPTIONS_ENABLE" tabindex="-1"></fxs-button>
		</fxs-hslot>
        `

        if(this.mods.length === 0) return;
        modHandle ??= this.mods[0].handle;


        //Clear the mod list. Shouldn't have to remove the event listeners.
        const unofficialModList = MustGetElement('.mod-list-unofficial', root);
        const officialModList = MustGetElement('.mod-list-official', root);
        while (unofficialModList.lastChild) unofficialModList.removeChild(unofficialModList.lastChild);
        while (officialModList.lastChild) officialModList.removeChild(officialModList.lastChild);
        

        //Set enable/disable button listeners
		//const modToggleButton = MustGetElement('.toggle-enable', root);
        //modToggleButton.addEventListener("action-activate", listeners.onModToggled);
        MustGetElement('.enable-all-official'   ).addEventListener("action-activate", this.onAllModsToggled.bind(this, modIds, true,  true ));
        MustGetElement('.disable-all-official'  ).addEventListener("action-activate", this.onAllModsToggled.bind(this, modIds, true,  false));
        MustGetElement('.enable-all-unofficial' ).addEventListener("action-activate", this.onAllModsToggled.bind(this, modIds, false, true ));
        MustGetElement('.disable-all-unofficial').addEventListener("action-activate", this.onAllModsToggled.bind(this, modIds, false, false));

        const officialModCount = this.mods.filter(mod => mod.official && this.show(mod.handle)).length;
        const index = {official: 0, unofficial: 0};
        const activatables = [];
        for(const mod of this.mods) {
            if (!this.show(mod.handle)) continue;
            const entryIndex = mod.official ? index.official++ : index.unofficial++;

            const modActivatable = document.createElement('fxs-activatable');
            modActivatable.classList.add('mod-entry', 'group', 'relative', 'flex', 'w-full', 'grow', 'm-1');
            modActivatable.classList.add(entryIndex % 2 === 0 ? '' : 'bg-primary-5');
            modActivatable.setAttribute('tabindex', '-1');
            modActivatable.setAttribute('index', `${entryIndex + mod.official ? 0 : officialModCount}`);
            modActivatable.setAttribute('mod-handle', mod.handle.toString());
            //modActivatable.addEventListener('action-activate', listeners.onModActivated);
            //modActivatable.addEventListener('focus', listeners.onModSelected);
            if (modHandle == mod.handle) FocusManager.setFocus(modActivatable);
            const modList = mod.official ? officialModList : unofficialModList;
            modList.appendChild(modActivatable);
            activatables.push(modActivatable);

            const modHoverOverlay = document.createElement('div');
            modHoverOverlay.classList.add('img-mod-hover-overlay', 'absolute', 'inset-0', 'opacity-0', "group-hover\\:opacity-100", "group-focus\\:opacity-100", "group-active\\:opacity-100");
            modActivatable.appendChild(modHoverOverlay);
            
            const modTextContainer = document.createElement('div');
            modTextContainer.classList.add('mod-text-container', 'relative', 'flex', 'pointer-events-none', 'w-full', 'grow', 'p-1');
            modActivatable.appendChild(modTextContainer);
            
            const modName = document.createElement('div');
            modName.classList.add('mod-text-name', 'relative', 'flex', 'grow', 'text-lg', 'max-w-76');
            modName.textContent = mod.name;
            modTextContainer.appendChild(modName);
            
            const modEnabled = document.createElement('div');
            let enabledLocSuffix = mod.enabled ? "ENABLED" : "DISABLED";
            if(mod.official && mod.allowance != ModAllowance.Full) enabledLocSuffix = "GATED";
            else if(mod.official && Modding.getModProperty(mod.handle, "ShowInBrowser") == 0) enabledLocSuffix = "CORE";
            modEnabled.setAttribute('data-l10n-id', "LOC_EXAMPLE_MOD_UI_" + enabledLocSuffix);
            modEnabled.classList.add('mod-text-enabled', 'relative', 'flex', 'grow', 'justify-end', 'uppercase', 'text-lg', 'font-title');
            modTextContainer.appendChild(modEnabled);
        }

        return activatables;
    }


    updateModDetails(modIds, modHandle) {
        if (!modHandle) throw new Error(`[PRIVUS-EXAMPLE] Invalid mod handle '${modHandle}'`);
		const modInfo = Modding.getModInfo(modHandle);

        const gated = modInfo.allowance != ModAllowance.Full;
        
		// Disable Toggle Button for locked or hidden content
		const modToggleButton = MustGetElement('.toggle-enable');
        modToggleButton.classList.toggle('disabled', Modding.getModProperty(modInfo.handle, "ShowInBrowser") == 0 || (modInfo.official && gated));
		
		// Mod name
        const modNameHeader = MustGetElement('.selected-mod-name', this._root);
	    modNameHeader.setAttribute('title', modInfo.name);
		
		// Version (hidden if not present)
		// Currently only supports a custom Version property
		const version = Modding.getModProperty(modInfo.handle, 'Version');
        const modVersionText  = MustGetElement('.mod-version', this._root);
        if (version) modVersionText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_VERSION", version));
		modVersionText.classList.toggle('hidden', !version);
        
		// Author
        const author = Modding.getModProperty(modInfo.handle, 'Authors');
        const modAuthorText = MustGetElement('.mod-author', this._root);
        if (author) 
            modAuthorText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_AUTHOR", Locale.compose(author)));
		
		// Special Thanks (hidden if not present)
        const thanks = Modding.getModProperty(modInfo.handle, 'SpecialThanks');
		const modThanksText = MustGetElement('.mod-thanks', this._root);
        if (thanks) modThanksText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_SPECIAL_THANKS", thanks));
		modThanksText.classList.toggle('hidden', !thanks);
		
		// Description
        const modDescriptionText = MustGetElement('.mod-description', this._root);
        modDescriptionText.setAttribute('data-l10n-id', modInfo.description);
		
		// Gated
        const modGatedContent = MustGetElement('.mod-gated', this._root);
		const modGatedText = MustGetElement('.mod-gated-description', this._root);
		if (gated) modGatedText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_DLC_PACKAGE", Locale.compose("LOC_EXAMPLE_MOD_UI_DLC_" + this.getPackageKeySuffix(modInfo))));
		modGatedContent.classList.toggle('hidden', !gated);
		
		// Created date
        const modDateText = MustGetElement('.mod-date', this._root);
        if (modInfo.created) 
			modDateText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_DATE_CREATED", modInfo.created));
		
		// Affects Save Games
		const affectsSaveGames = Modding.getModProperty(modInfo.handle, 'AffectsSavedGames');
		const modAffectsSaveGamesText = MustGetElement('.mod-affects-saved-game', this._root);
		if (affectsSaveGames == 1) modAffectsSaveGamesText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_AFFECTS_SAVE_GAMES"));
        modAffectsSaveGamesText.classList.toggle('hidden', affectsSaveGames != 1);
		
		// Mod Id
        const modId = MustGetElement('.mod-id', this._root);
		if (modInfo.id)
			modId.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_MOD_ID", modInfo.id));
		
		// Official content?
        const modOfficialText = MustGetElement('.mod-official', this._root);
		const modUnofficialText = MustGetElement('.mod-unofficial', this._root);
        const toHide = modInfo.official ? modUnofficialText : modOfficialText;
        const toShow = modInfo.official ? modOfficialText : modUnofficialText;
        const officialTextKeySuffix = (modInfo.official ? "" : "UN") + "OFFICIAL";
        toHide.classList.add('hidden');
        toShow.classList.remove('hidden');
        toShow.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_" + officialTextKeySuffix));
		
		// Compatibility
		const compatibility = Modding.getModProperty(modInfo.handle, 'Compatibility');
        const modCompatibilityText = MustGetElement('.mod-compatibility', this._root);
        if (compatibility) modCompatibilityText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_COMPATIBILITY", compatibility));
        modCompatibilityText.classList.toggle('hidden', !compatibility);
		
		// URL
		const modUrl = Modding.getModProperty(modInfo.handle, 'URL');
        const modUrlText = MustGetElement('.mod-url', this._root);
        modUrlText.classList.toggle('hidden', !modUrl);
        if (!modUrl) {
            Privus.defaultFn(ModsContentCategory, "updateModToggleButton").call(Privus.getInstance(ModsContentCategory), modHandle);
            return;
        }
		modUrlText.setAttribute('data-l10n-id', Locale.stylize("LOC_EXAMPLE_MOD_UI_MOD_URL"));
		modUrlText.setAttribute('data-tooltip-content', Locale.compose("LOC_EXAMPLE_MOD_UI_MOD_URL_TOOLTIP"));
		modUrlText.addEventListener('click', () => {
			UI.setClipboardText(Locale.compose(modUrl));
			modUrlText.setAttribute('data-tooltip-content', Locale.compose("LOC_EXAMPLE_MOD_UI_MOD_URL_TOOLTIP_COPIED"));
        });

        Privus.defaultFn(ModsContentCategory, "updateModToggleButton").call(Privus.getInstance(ModsContentCategory), modHandle);
    }

    updateModEntry(modIds, modHandle, entry) {
        if(!modHandle) throw new Error(`[PRIVUS-EXAMPLE] Invalid mod handle '${modHandle}'`);
        const modInfo = Modding.getModInfo(modHandle);
        if(!entry) throw new Error(`[PRIVUS-EXAMPLE] Cannot find entry for mod ${modInfo.name}`);

        const nameElement = entry.querySelector(".mod-text-name");
        if(nameElement) nameElement.textContent = modInfo.name;
        const enabledElement = entry.querySelector(".mod-text-enabled");
        if(enabledElement)
            enabledElement.setAttribute('data-l10n-id', "LOC_EXAMPLE_MOD_UI_" + (modInfo.enabled ? "ENABLED" : "DISABLED"));
    }



    /* Non-API functions */
    onAllModsToggled(modIds, official, enable, event) {
        const selectedHandle = Privus.getMember(ModsContentCategory, "selectedModHandle");

        this.mods.forEach((mod, index) => {
            if(!this.show(mod.handle)) return;
            if(mod.official && (mod.allowance != ModAllowance.Full)) return;
            if(mod.official != official) return;
            if(enable === mod.enabled) return;

            if (mod.enabled && Modding.canDisableMods([mod.handle]).status == 0) 
                Modding.disableMods([mod.handle]);
            else if (!mod.enabled && Modding.canEnableMods([mod.handle], true).status == 0)
                Modding.enableMods([mod.handle], true);
            else return;

            const entry = Array.from(Privus.getMember(ModsContentCategory, "modEntries")).find(elem => elem.getAttribute('mod-handle') === mod.handle.toString());
            if(mod.handle === selectedHandle) this.updateModDetails(modIds, mod.handle);
            this.updateModEntry(modIds, mod.handle, entry);
            Privus.defaultFn(ModsContentCategory, "updateNavTray").call(Privus.getInstance(ModsContentCategory));
        
            //We need to "re-sync" the mod info in Modding with our mod info
            this.mods[index] = Modding.getModInfo(mod.handle);
        });
    }


    getScrollableNode(official) {
        const officialStr = (official ? "" : "un") + "official";

        const slot = document.createElement('fxs-vslot');
        slot.classList.add(`w-1\\/4`);
        slot.innerHTML = `
        <fxs-header filigree-style="none" 
                    class="mod-list-${officialStr}-header relative flex justify-center font-title text-2xl uppercase text-secondary mb-3"
                    title="LOC_EXAMPLE_MOD_UI_${officialStr.toUpperCase()}_HEADER"></fxs-header>
        <fxs-scrollable class="mod-list-scrollable flex-auto" handle-gamepad-pan="true">    
            <fxs-vslot class="mod-list-${officialStr} flex mb-8 m-6"></fxs-vslot>
        </fxs-scrollable>
        <fxs-hslot class="justify-around pt-2" data-bind-class-toggle="hidden:{{g_NavTray.isTrayRequired}}">
            <fxs-button class="enable-all-${officialStr} min-w-px" 
                        caption="LOC_EXAMPLE_MOD_UI_ENABLE_ALL"
                        tabindex="-1"></fxs-button>
            <fxs-button class="disable-all-${officialStr} min-w-px" 
                        caption="LOC_EXAMPLE_MOD_UI_DISABLE_ALL"
                        tabindex="-1"></fxs-button>
        </fxs-hslot>`;
        return slot;
    }

    getPackageKeySuffix(mod) {
		const pkg = Modding.getModProperty(mod.handle, 'Package');
		if (pkg == 'Carlisle') return "CROSSROADS_CONTENT";
        switch(mod.id) {
        case 'friedrich-xerxes-alt': return "DELUXE_CONTENT";
        case 'ashoka-himiko-alt':    return "FOUNDERS_CONTENT";
        case 'shawnee-tecumseh':     return "SHAWNEE_CONTENT";
        case 'napoleon':             return "NAPOLEON_CONTENT";
        case 'napoleon-alt':         return "NAPOLEON_ALT_CONTENT";
        default:                     return "ADDITIONAL"
        }
	}

    show(modHandle) {
        return ModOptions.option('example-mods-content', 'show-core')?.currentValue || Modding.getModProperty(modHandle, "ShowInBrowser") != 0;
    }
}

ModOptions.addOption('example-mods-content', 'show-core', OptionType.Checkbox, "LOC_EXAMPLE_MOD_OPTIONS_SHOW_CORE", "LOC_EXAMPLE_MOD_OPTIONS_SHOW_CORE_DESC", false);
// Register our class as this mod's changes to the pause menu
Privus.defineModClass('example', ModsContentCategory, ExampleModsContent);