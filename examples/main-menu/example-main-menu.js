//Get the main menu category from Privus API
import MainMenuCategory from '/privus-api/ui/shell/main-menu/privus-main-menu.js';

class ExampleMainMenu {
    constructor(root) {
        this._root = root;
    }

    //Completly hide the carousel
    renderUICarousel(modIds, carouselMain) {
        console.info(`[EXAMPLE-MAIN-MENU] Mods that have already overriden the carousel: ${modIds}`);
        
        //Render the ui carousel normally
        Privus.defaultFn(MainMenuCategory, "renderUICarousel").call(Privus.getInstance(MainMenuCategory), carouselMain);
        
        //Then hide it by hiding all its direct children
        for(const child of carouselMain.children)
            child.classList.add('hidden');
    }

    //Do not render the profile header, the motd, nor the build info
    renderUIProfileHeader(modIds, profileHeader) { this._profileHeader = profileHeader; return; }
    renderUIMotd(modIds, motd) { return; }
    renderUIBuildInfo(modIds, buildInfo) { return; }
    renderUIConnectionIcon(modIds, connectionIcon) { return; }
    renderUIAccountIcon(modIds, accountIcon, activatable) { return; }
    renderUIConnectionStatus(modIds, connectionStatus) { return; }
    renderUIAccountStatus(modIds,  accountStatus, accountIcon, navHelp) { return; }

    onPostAppend(modIds) {
        //Remove the profile header
        //This prevents any functions of the base game from modifying it
        this._profileHeader.remove();
    }


    //Render each button
    renderUIButtons(modIds, slot, functionDefs) {
        const buttonDefs = [];
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_CONTINUE', 'continue', true, 'continue-item', true));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_NEW_GAME', 'create-game', false, 'create-game-item'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_LOAD_GAME', 'load-game'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_MULTIPLAYER', 'multiplayer', true));
        if (Network.isFullAccountLinked()) 
            buttonDefs.push(this.makeButtonDef('LOC_UI_MP_SOCIAL_BUTTON_LABEL', 'additional-content'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_META_PROGRESSION', 'additional-content'));
        buttonDefs.push(this.makeButtonDef('LOC_UI_CONTENT_MGR_TITLE', 'additional-content'));
        buttonDefs.push(this.makeButtonDef('LOC_UI_LINK_ACCOUNT_SUBTITLE', 'additional-content'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_OPTIONS', 'options'));
        if(UI.canExitToDesktop()) 
            buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_EXIT', 'exit'));


        const buttons = [];
        for(let i = 0; i < buttonDefs.length; i++){
            const buttonDef = buttonDefs[i];
            const button = document.createElement('fxs-text-button');

            //Add the default attributes
            button.setAttribute("type", "big");
            button.setAttribute("highlight-style", "decorative");
            button.setAttribute("caption", Locale.stylize(buttonDef.caption).toUpperCase());
            button.setAttribute("data-tooltip-style", "none");
            button.setAttribute("data-audio-group-ref", "main-menu-audio");
            button.setAttribute("data-audio-activate-ref", "data-audio-clicked-" + buttonDef.name);
            if(i === 0) button.classList.add("-mt-4");

            //Set the 'when clicked' function
            let onClickedFn = undefined;
            //Use the default button function if it's not an 'aditional-content' button
            if(buttonDef.name !== 'additional-content')
                onClickedFn = functionDefs[buttonDef.name].bind(Privus.getInstance(MainMenuCategory));
            //Otherwise choose the function based on its text key
            else {
                switch(buttonDef.caption) {
                case 'LOC_UI_MP_SOCIAL_BUTTON_LABEL':
                    onClickedFn = this.showSocialPage.bind(this);
                    break;
                case 'LOC_MAIN_MENU_META_PROGRESSION':
                    onClickedFn = Privus.defaultFn(MainMenuCategory, "showProfilePage").bind(Privus.getInstance(MainMenuCategory));
                    break;
                case 'LOC_UI_CONTENT_MGR_TITLE':
                    onClickedFn = Privus.defaultFn(MainMenuCategory, "openExtras").bind(Privus.getInstance(MainMenuCategory));
                    break;
                case 'LOC_UI_LINK_ACCOUNT_SUBTITLE':
                    onClickedFn = Privus.defaultFn(MainMenuCategory, "onClickedAccount").bind(Privus.getInstance(MainMenuCategory));
                    break;
                default:
                    throw new Error(buttonDef.caption);
                }
            }
            
            button.addEventListener('action-activate', () => { 
                if (Privus.defaultFn(MainMenuCategory, "canPerformInputs").call(Privus.getInstance(MainMenuCategory))) 
                    onClickedFn(); 
            }, {});
            slot.appendChild(button);

            //Add seperator and any extra classes if need be
            if(buttonDef.separator){
                const separator = document.createElement("div");
                separator.classList.add("main-menu-filigree-divider", "h-4", "mt-1", "min-w-96", "bg-center", "bg-contain", "bg-no-repeat", "self-center", "min-w-96");
                slot.appendChild(separator);
            }
            if(buttonDef.disabled) {
                button.classList.add('disabled');
                button.setAttribute("disabled", "true");
            }
            else buttons.push(button);
            if(buttonDef.extraClass !== "")
                button.classList.add(buttonDef.extraClass);
        }

        return buttons;
    }


    showSocialPage() {
        Animations.cancelAllChainedAnimations();
        ContextManager.push('screen-mp-friends', { singleton: true, createMouseGuard: true });
    }


    //Copied from default main menu (see definition in privus-main-menu.js)
    makeButtonDef(text, key, hasSeparator = false, className = "", isDisabled = false) {
        return {
            caption: text,
            name: key,
            extraClass: className,
            disabled: isDisabled,
            separator: hasSeparator
        }
    }
}

// Register our class as this mod's changes to the pause menu
Privus.defineModClass('example', MainMenuCategory, ExampleMainMenu);