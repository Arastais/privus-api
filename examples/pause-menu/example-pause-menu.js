//Get the pause menu category from Privus API
import PauseMenuCategory from '/privus-api/ui/pause-menu/privus-pause-menu.js';

class ExamplePauseMenu {
    constructor(root) {
        this._root = root;
    }

    /* Non-API helper functions */
    addContainer(parent) {
        const buttonRow = document.createElement("div");
        buttonRow.classList.add("flex", "flex-row", "pause-menu__main-buttons", "justify-center", "mb-1\\.5");
        
        const buttonCol = document.createElement("div");
        buttonCol.classList.add("flex", "flex-col", "pauselist");

        buttonRow.appendChild(buttonCol);
        parent.appendChild(buttonRow);
        return buttonCol;
    }

    addDivider(parent) {
        const divider = document.createElement("div");
        divider.classList.add("pause-menu_button-divider-filigree", "flex", "h-4", "self-center", "mb-6");
        parent.appendChild(divider);
    }

    addButton(caption, listenerFn, container, activateSound = "data-audio-pause-menu-activate") {
        const button = document.createElement('fxs-button');
        button.classList.add('pause-menu-button', 'mb-1\\.5', 'mx-1');
        button.setAttribute('caption', Locale.compose(caption));
        button.setAttribute("data-audio-group-ref", "pause-menu");
        button.setAttribute("data-audio-focus-ref", "data-audio-pause-menu-focus");
        button.setAttribute("data-audio-activate-ref", activateSound);
        button.addEventListener('action-activate', (event) => {
            event.preventDefault();
            event.stopPropagation();
            listenerFn(event);
        });
        container.appendChild(button);
        return button;
    }

    
    /* API functions */
    renderUIButtons(modIds, leftCol, rightCol, outerParent, listenerFns, updateFns, newRowFn) {
        const multiplayer = Configuration.getGame().isNetworkMultiplayer;
        const ret = [];

        let container = this.addContainer(outerParent);
        //Resume
        ret.push(this.addButton("LOC_GENERIC_RESUME", listenerFns.close, container));
        
        //Restart OR Copy join code
        if(!multiplayer) {
            const restartButton = this.addButton("LOC_PAUSE_MENU_RESTART", listenerFns.restart, container);
            updateFns.restart.call(undefined, restartButton);
            ret.push(restartButton);
        } 
        else 
            ret.push(this.addButton(Locale.compose("LOC_PAUSE_MENU_COPY_JOIN_CODE", Network.getJoinCode()), listenerFns.joinCode, container));

        //No More Turns OR Retire
        const playerDefeated = Game.VictoryManager.getLatestPlayerDefeat(GameContext.localPlayerID) != DefeatTypes.NO_DEFEAT;
        if(Game.turn > 1 && Game.AgeProgressManager.isAgeOver || playerDefeated)
            ret.push(this.addButton("LOC_PAUSE_MENU_NOMORETURNS", listenerFns.onNoMoreTurns, container));
        else if (!multiplayer) {               
            const retireButton = this.addButton("LOC_PAUSE_MENU_RETIRE", listenerFns.retire, container);
            retireButton.classList.add("pause-retire-button");
            ret.push(retireButton);

            const player = Players.get(GameContext.localPlayerID);
            if (player && !player.isTurnActive)
                updateFns.retire.call(undefined, retireButton, false);
        }

        //Event Rules
        if (Online.Metaprogression.isPlayingActiveEvent())
            ret.push(this.addButton("LOC_PAUSE_MENU_EVENT_RULES", listenerFns.eventRules, container));


        // ---------------
        this.addDivider(outerParent);
        container = this.addContainer(outerParent);

        //Quick save
        ret.push(this.addButton("LOC_PAUSE_MENU_QUICK_SAVE", listenerFns.quickSave, container));
        //Save
        ret.push(this.addButton("LOC_PAUSE_MENU_SAVE",  listenerFns.save, container));
        //Load
        if (!multiplayer)
            ret.push(this.addButton("LOC_PAUSE_MENU_LOAD", listenerFns.load, container));


        // -----------------
        this.addDivider(outerParent);
        container = this.addContainer(outerParent);


        //Social
        if (Network.supportsSSO())
            ret.push(this.addButton("LOC_UI_MP_SOCIAL_BUTTON_LABEL", listenerFns.social, container, "data-audio-social-activate"));

        //Options
        ret.push(this.addButton("LOC_PAUSE_MENU_OPTIONS", listenerFns.options, container, "data-audio-options-activate"));
        //Quit To Menu
        ret.push(this.addButton("LOC_PAUSE_MENU_QUIT_TO_MENU", listenerFns.exitToMenu, container));
        //Quit To Desktop
        if (UI.canExitToDesktop())
            ret.push(this.addButton("LOC_PAUSE_MENU_QUIT_TO_DESKTOP", listenerFns.exitToDesktop, container));
        

        return ret;
    }
    

    //Change the map seed info text
    renderUIMapSeed(modIds, mapSeedInfo) {
        console.info(`[EXAMPLE-PAUSE-MENU] Mods that have already overriden the map seed ui: ${modIds}`);
        
        if (!mapSeedInfo) throw new Error('Could not find map seed element!');
        PrivusControls.defaultFn(PauseMenuCategory, 'renderUIMapSeed').call(PrivusControls.getInstance(PauseMenuCategory), mapSeedInfo);
        //mapSeedInfo.textContent = `<Example Map Seed>`;
    }

    //Change the game info text
    renderUIGameInfo(modIds, gameInfo) {
        console.info(`[EXAMPLE-PAUSE-MENU] Mods that have already overriden the build info ui: ${modIds}`);

        if(!gameInfo) throw new Error('Could not find game info element!');
        PrivusControls.defaultFn(PauseMenuCategory, 'renderUIGameInfo').call(PrivusControls.getInstance(PauseMenuCategory), gameInfo);
        //gameInfo.textContent = `<Example Game Info>`;
    }
}

// Register our class as this mod's changes to the pause menu
PrivusControls.defineModClass('example', PauseMenuCategory, ExamplePauseMenu);