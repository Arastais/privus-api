import Panel, { AnchorType } from '/core/ui/panel-support.js';
import { getPlayerCardInfo } from '/core/ui/utilities/utilities-liveops.js';
import { Icon } from '/core/ui/utilities/utilities-image.js';
import { displayRequestUniqueId } from '/core/ui/context-manager/display-handler.js';
import DialogManager, { DialogSource } from '/core/ui/dialog-box/manager-dialog-box.js';
import { InputEngineEventName } from '/core/ui/input/input-support.js';
import { LowerCalloutEvent } from '/base-standard/ui/tutorial/tutorial-events.js';

const PauseMenuCategory = 'screen-pause-menu';
var Group;
(function (Group) {
    Group[Group["Primary"] = 0] = "Primary";
    Group[Group["Secondary"] = 1] = "Secondary";
})(Group || (Group = {}));

class PrivusPauseMenu extends Panel {
    constructor(root) {
        super(root);
        this.Root.setAttribute("data-audio-group-ref", "pause-menu");
        this.buttonListener = (_) => {};

        this.progressionListener = Privus.defaultFn(PauseMenuCategory, "onClickedProgression").bind(this);
        this.engineInputListener = Privus.defaultFn(PauseMenuCategory, "onEngineInput").bind(this);
        
        this.buttons = new Set();
        this.slot = null;
        this.quickSaveButton = null;
        this.saveButton = null;
        this.loadButton = null;
        this.restartButton = null;
        this.currentLeft = null;
        this.currentRight = null;
        this.dialogId = displayRequestUniqueId();
        this.animateInType = this.animateOutType = AnchorType.RelativeToRight;
        this.enableOpenSound = true;
        this.enableCloseSound = true;
        
        this.styleGroup = Object.freeze({
            Primary:         0,
            Secondary:       1,
        });

        this.buttonFns = Object.freeze({
            close:         this.close.bind(this),
            noMoreTurns:   this.onNoMoreTurnsButton.bind(this),
            retire:        this.onRetireButton.bind(this),
            eventRules:    this.onEventRules.bind(this),
            joinCode:      this.onJoinCodeButton.bind(this),
            restart:       this.onRestartGame.bind(this),
            quickSave:     this.onQuickSaveGameButton.bind(this),
            save:          this.onSaveGameButton.bind(this),
            load:          this.onLoadGameButton.bind(this),
            options:       this.onOptionsButton.bind(this),
            challenges:    this.onChallenges.bind(this),
            social:        this.onSocialButton.bind(this),
            exitToMenu:    this.onExitToMainMenuButton.bind(this),
            exitToDesktop: this.onExitToDesktopButton.bind(this),
        });

        this.buttonUpdateFns = Object.freeze({
            retire:  this.updateRetireButton.bind(this),
            restart: this.updateRestartButton.bind(this),
        });
    }

    renderUIPlayerInfo(playerInfo)                                                    { return Privus.privusFn(PauseMenuCategory, "renderUIPlayerInfo",    playerInfo); }
    renderUIButtons(leftCol, rightCol, outerParent, listenerFns, updateFns, newRowFn) { return Privus.privusFn(PauseMenuCategory, "renderUIButtons",       leftCol, rightCol, outerParent, listenerFns, updateFns, newRowFn); }
    renderUIHeader(header)                                                            { return Privus.privusFn(PauseMenuCategory, "renderUIHeader",        header); }
    renderUIGameInfo(gameInfo)                                                        { return Privus.privusFn(PauseMenuCategory, "renderUIGameInfo",      gameInfo); }
    renderUIMapSeed(mapSeedInfo)                                                      { return Privus.privusFn(PauseMenuCategory, "renderUIMapSeed",       mapSeedInfo); }
    renderUIGameBuildInfo(buildInfo)                                                  { return Privus.privusFn(PauseMenuCategory, "renderUIGameBuildInfo", buildInfo); }

    onLocalPlayerTurnBegin(retireButton) { return Privus.privusFn(PauseMenuCategory, "onLocalPlayerTurnBegin", retireButton); }
    onLocalPlayerTurnEnd(retireButton)   { return Privus.privusFn(PauseMenuCategory, "onLocalPlayerTurnEnd",   retireButton); }
    onStartSaveRequest()                 { return Privus.privusFn(PauseMenuCategory, "onStartSaveRequest"      ); }
    onSaveComplete()                     { return Privus.privusFn(PauseMenuCategory, "onSaveComplete"          ); }


    /* Component functions */
    onRecieveFocus() { return Privus.privusFn(PauseMenuCategory, "onRecieveFocus"); }
    onLoseFocus()    { return Privus.privusFn(PauseMenuCategory, "onLoseFocus"); }

    onAttach() {
        super.onAttach();
        //Enable the save and turn end/begin listeners
        engine.on('LocalPlayerTurnBegin', this.onLocalPlayerTurnBegin, this);
        engine.on('LocalPlayerTurnEnd',   this.onLocalPlayerTurnEnd,   this);
        engine.on('StartSaveRequest',     this.onStartSaveRequest,     this);
        engine.on("SaveComplete",         this.onSaveComplete,         this);

        //Initialize all the pause menu ui (including the buttons)
        this.renderUIPlayerInfo(this.Root.querySelector(".pause-menu__player-info"));
        
        this.Root.addEventListener(InputEngineEventName, this.engineInputListener);
        this.slot = this.Root.querySelector(".pauselist");

        this.buttons = new Set(this.renderUIButtons(this.currentLeft, this.currentRight, this.slot, this.buttonFns, this.buttonUpdateFns, this.addRow.bind(this)));
        console.info(Array.from(this.buttons).map(b => b.getAttribute('caption')));

        this.renderUIHeader(document.getElementById("pause-top"));
        this.renderUIGameInfo(this.Root.querySelector(".pause-menu__game-info"));
        this.renderUIMapSeed(this.Root.querySelector(".pause-menu__game-info-map-seed"));
        this.renderUIGameBuildInfo(document.querySelector('.build-info'));
        
        //Signal a tutorial event to the window
        window.dispatchEvent(new LowerCalloutEvent({closed: false}));
        //Unlock the cursor if it's locked
        if (UI.isCursorLocked()) UI.lockCursor(false);
        //Signal to only show shell-scoped dialog boxes
        DialogManager.setSource(DialogSource.Shell);
        //Sync up all the button widths to their max
        waitForLayout(() => {
            if (!this.Root.isConnected) return;
            
            
            const widths = Array.from(this.buttons).map(b => b.getBoundingClientRect().width);
            const width = Math.max(350, ...widths);
            for (let button of this.buttons)
                button.style.widthPX = width;
        });
    }
}



class DefaultPauseMenu {
    constructor() {}


    renderUIPlayerInfo(playerInfo) {
        if(!playerInfo) return;

        if(!Network.supportsSSO()) {
            playerInfo.style.display = "none";
            return;
        }
        playerInfo.setAttribute("data-player-info", JSON.stringify(getPlayerCardInfo()));
        playerInfo.addEventListener("action-activate", this.progressionListener);
    }
    renderUIButtons(leftCol, rightCol, outerParent, listenerFns, updateFns, newRowFn) {
        const multiplayer = Configuration.getGame().isNetworkMultiplayer;

        this.addRow();

        ///Resume
        this.addButton("LOC_GENERIC_RESUME", this.close.bind(this), this.styleGroup.Primary, "none");

        if (Game.turn > 1) {
            //If there are no more turns, replace the retire button with a button that says so.
            const playerDefeated = Game.VictoryManager.getLatestPlayerDefeat(GameContext.localPlayerID) != DefeatTypes.NO_DEFEAT;
            if (Game.AgeProgressManager.isAgeOver || playerDefeated)
                this.addButton("LOC_PAUSE_MENU_NOMORETURNS", this.onNoMoreTurnsButton, this.styleGroup.Secondary);
            else if(!multiplayer) {
                ///Retire (only in singleplayer)
                const retireButton = this.addButton("LOC_PAUSE_MENU_RETIRE", this.onRetireButton, this.styleGroup.Secondary);
                retireButton.classList.add("pause-retire-button");

                //Disable the retire button if it isn't the player's turn
                const player = Players.get(GameContext.localPlayerID);
                if (player && !player.isTurnActive)
                    this.updateRetireButton(retireButton, false);
            }
        }

        
        this.adjustItems();
        this.addDivider();
        this.addRow();

        ///Event Rules
        if (Online.Metaprogression.isPlayingActiveEvent())
            this.addButton("LOC_PAUSE_MENU_EVENT_RULES", this.onEventRules, this.styleGroup.Primary);

        //Join Code/Restart (in multiplayer and singleplayer, respectively)
        if (multiplayer) {
            this.addButton(Locale.compose("LOC_PAUSE_MENU_COPY_JOIN_CODE", Network.getJoinCode()), this.onJoinCodeButton, this.styleGroup.Secondary);
        } else {
            this.restartButton = this.addButton("LOC_PAUSE_MENU_RESTART", this.onRestartGame, this.styleGroup.Secondary);
            this.updateRestartButton(this.restartButton);
        }

        this.adjustItems();
        this.addDivider();
        this.addRow();

        ///Quick Save
        this.quickSaveButton = this.addButton("LOC_PAUSE_MENU_QUICK_SAVE", this.onQuickSaveGameButton, this.styleGroup.Secondary);
        
        ///Save
        this.saveButton = this.addButton("LOC_PAUSE_MENU_SAVE", this.onSaveGameButton, this.styleGroup.Primary, "none");

        this.adjustItems();
        this.addRow();

        ///Load (only in singleplayer)
        if(!multiplayer)
            this.loadButton = this.addButton("LOC_PAUSE_MENU_LOAD", this.onLoadGameButton, this.styleGroup.Primary, "none");

        ///Options
        this.addButton("LOC_PAUSE_MENU_OPTIONS", this.onOptionsButton, this.styleGroup.Secondary, "data-audio-options-activate");

        this.adjustItems();
        this.addDivider();
        
        if (Network.isMetagamingAvailable() || Network.supportsSSO()) {
            this.addRow(); 
            ///Challenges
            if (Network.isMetagamingAvailable())
                this.addButton("LOC_PROFILE_TAB_CHALLENGES", this.onChallenges, this.styleGroup.Primary);

            ///Social
            if (Network.supportsSSO())
                this.addButton("LOC_UI_MP_SOCIAL_BUTTON_LABEL", this.onSocialButton, this.styleGroup.Secondary, "data-audio-social-activate");
            
            this.addDivider();
        }
        
        this.adjustItems();
        this.addRow();

        ///Quit to Menu
        this.addButton("LOC_PAUSE_MENU_QUIT_TO_MENU", this.onExitToMainMenuButton, this.styleGroup.Primary);

        //Exit to Desktop
        if (UI.canExitToDesktop())
            this.addButton("LOC_PAUSE_MENU_QUIT_TO_DESKTOP", this.onExitToDesktopButton, this.styleGroup.Secondary);

        this.addDivider();
        
        return Array.from(this.buttons);
    }
    renderUIHeader(header) {        
        //Set header background
        if (!header) return;
        header.setAttribute("headerimage", Icon.getPlayerBackgroundImage(GameContext.localPlayerID));
    }
    renderUIGameInfo(gameInfo) {
        if(!gameInfo) return;

        const config = Configuration.getGame();
        const details = [];

        //Turn count
        const turnCountStr = (Game.maxTurns > 0) ? 'LOC_ACTION_PANEL_CURRENT_TURN_OVER_MAX_TURNS' : 'LOC_ACTION_PANEL_CURRENT_TURN';
        details.push(Locale.compose(turnCountStr, Game.turn, Game.maxTurns));
        
        //Age
        const age = GameInfo.Ages.lookup(config.startAgeType)?.Name;
        if (age) 
            details.push(Locale.compose(age));

        //Game speed
        const gameSpeed = GameInfo.GameSpeeds.lookup(config.gameSpeedType)?.Name;
        if (gameSpeed)
            details.push(Locale.compose(gameSpeed));

        //Difficulty
        const difficulty = GameInfo.Difficulties.lookup(config.difficultyType)?.Name;
        if (difficulty)
            details.push(Locale.compose(difficulty));


        //Join game info details together with " | "
        gameInfo.textContent = details.join(" | ");
    }
    renderUIMapSeed(mapSeedInfo) {        
        if (!mapSeedInfo) return;

        //Get the map seed from the config
        const mapSeed = Configuration.getMap().mapSeed.toString();
        
        //Set the map seed text to the map seed
        const mapSeedText = Locale.compose("LOC_MAPSEED_NAME") + " " + Locale.compose(mapSeed);
        if (!mapSeedText) return;
        mapSeedInfo.textContent = mapSeedText;
    }
    renderUIGameBuildInfo(buildInfo) {
        this.realizeBuildInfoString();
    }

    onLocalPlayerTurnBegin(retireButton) {
        //Enable retire button
        if (!retireButton) return;
        this.updateRetireButton(retireButton, true);
    }
    onLocalPlayerTurnEnd(retireButton) {
        //Disable retire button
        if (!retireButton) return;
        this.updateRetireButton(retireButton, false);
    }
    
    onStartSaveRequest() {
        //Disable save, load, and quick save (since we're in the middle of saving)
        this.quickSaveButton?.classList.add(this.disableClass);
        this.saveButton?.classList.add(this.disableClass);
        this.loadButton?.classList.add(this.disableClass);
    }
    onSaveComplete() {
        //Re-enable save, load, and quick save (since we're done saving)
        this.quickSaveButton?.classList.remove(this.disableClass);
        this.saveButton?.classList.remove(this.disableClass);
        this.loadButton?.classList.remove(this.disableClass);
    }
}

Privus.define(PauseMenuCategory, {
    createInstance: PrivusPauseMenu,
    createDefaultInstance: DefaultPauseMenu,
    extend: true,
    description: 'Pause menu',
    classNames: ['pause-menu'],
    styles: ['fs://game/base-standard/ui/pause-menu/screen-pause-menu.css'],
    content: ['fs://game/base-standard/ui/pause-menu/screen-pause-menu.html']
});

export {PauseMenuCategory as default};