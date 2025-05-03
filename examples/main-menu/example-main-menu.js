//Get the main menu category from Privus API
import MainMenuCategory from '/privus-api/ui/shell/main-menu/privus-main-menu.js';

class ExampleMainMenu {
    constructor(root) {
        this._root = root;

        //Set the show and hide online ui functions to do nothing
        //Ideally these functions would be part of the API but this is a easy temporary workaround
        const defaultClass = PrivusControls.getDefinition(MainMenuCategory).createDefaultInstance;
        defaultClass.prototype.showOnlineFeaturesUI = function() {};
        defaultClass.prototype.hideOnlineFeaturesUI = function() {};
    }

    //Completly hide the carousel
    renderUICarousel(modIds, carouselMain) {
        console.info(`[EXAMPLE-MAIN-MENU] Mods that have already overriden the carousel: ${modIds}`);
        
        //Render the ui carousel normally
        PrivusControls.defaultFn(MainMenuCategory, "renderUICarousel").call(PrivusControls.getInstance(MainMenuCategory), carouselMain);
        
        //Then hide it by hiding all its direct children
        for(const child of carouselMain.children)
            child.classList.add('hidden');
        carouselMain.classList.add('hidden');
    }

    //Render account and connection info but make them all hidden
    renderUIProfileHeader(modIds, profileHeader)                       { this.renderThenHide("profileHeader",    profileHeader);                       return; }
    renderUIMotd(modIds, motd)                                         { this.renderThenHide("motd",             motd);                                return; }
    renderUIBuildInfo(modIds, buildInfo)                               { this.renderThenHide("buildInfo",        buildInfo);                           return; }
    renderUIConnectionIcon(modIds, connectionIcon)                     { this.renderThenHide("connectionIcon",   connectionIcon);                      return; }
    renderUIAccountIcon(modIds, accountIcon, activatable)              { this.renderThenHide("accountIcon",      accountIcon, activatable);            return; }
    renderUIConnectionStatus(modIds, connectionStatus)                 { this.renderThenHide("connectionStatus", connectionStatus);                    return; }
    renderUIAccountStatus(modIds, accountStatus, accountIcon, navHelp) { this.renderThenHide("accountStatus",    accountStatus, accountIcon, navHelp); return; }


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
                onClickedFn = functionDefs[buttonDef.name].bind(PrivusControls.getInstance(MainMenuCategory));
            //Otherwise choose the function based on its text key
            else {
                switch(buttonDef.caption) {
                case 'LOC_UI_MP_SOCIAL_BUTTON_LABEL':
                    onClickedFn = this.showSocialPage.bind(this);
                    break;
                case 'LOC_MAIN_MENU_META_PROGRESSION':
                    onClickedFn = PrivusControls.defaultFn(MainMenuCategory, "showProfilePage").bind(PrivusControls.getInstance(MainMenuCategory));
                    break;
                case 'LOC_UI_CONTENT_MGR_TITLE':
                    onClickedFn = PrivusControls.defaultFn(MainMenuCategory, "openExtras").bind(PrivusControls.getInstance(MainMenuCategory));
                    break;
                case 'LOC_UI_LINK_ACCOUNT_SUBTITLE':
                    onClickedFn = PrivusControls.defaultFn(MainMenuCategory, "onClickedAccount").bind(PrivusControls.getInstance(MainMenuCategory));
                    break;
                default:
                    throw new Error(buttonDef.caption);
                }
            }
            
            button.addEventListener('action-activate', () => { 
                if (PrivusControls.defaultFn(MainMenuCategory, "canPerformInputs").call(PrivusControls.getInstance(MainMenuCategory))) 
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


    /* Event functions */
    onReturnedToMainMenu(modIds) {
        PrivusControls.defaultFn(MainMenuCategory, "onReturnedToMainMenu").call(PrivusControls.getInstance(MainMenuCategory));
        PrivusControls.getInstance(MainMenuCategory).buildInfo.classList.add("hidden");
    }


    /* Non-API event functions */
    showSocialPage() {
        Animations.cancelAllChainedAnimations();
        ContextManager.push('screen-mp-friends', { singleton: true, createMouseGuard: true });
    }


    /* Non-API shortcut functions */
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

    renderThenHide(elementName, ...args) {
        //Render normally
        const renderFnName = "renderUI" + String(elementName[0]).toUpperCase() + String(elementName).slice(1);
        PrivusControls.defaultFn(MainMenuCategory, renderFnName).call(PrivusControls.getInstance(MainMenuCategory), ...args);
        
        //Hide and disable the main element
        const element = args[0];
        element.classList.add('hidden');
    }
}

// Register our class as this mod's changes to the pause menu
PrivusControls.defineModClass('example', MainMenuCategory, ExampleMainMenu);