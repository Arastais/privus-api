//import MainMenu from '/core/ui/shell/main-menu/main-menu.js'
import { carouselHTML } from '/privus-api/ui/shell/main-menu/privus-carousel.js';
import ContextManager from '/core/ui/context-manager/context-manager.js';
import DialogManager from '/core/ui/dialog-box/manager-dialog-box.js';
import { InputEngineEventName } from '/core/ui/input/input-support.js';
import { ScreenCreditsOpenedEventName } from '/core/ui/shell/credits/screen-credits.js';
import { LegalDocsAcceptedEventName } from '/core/ui/shell/mp-legal/mp-legal.js';
import MultiplayerShellManager from '/core/ui/shell/mp-shell-logic/mp-shell-logic.js';
import { DEFAULT_SAVE_GAME_INFO } from '/core/ui/save-load/model-save-load.js';
import { GameCreatorOpenedEventName, GameCreatorClosedEventName, StartCampaignEventName } from '/core/ui/events/shell-events.js';
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import { SaveLoadClosedEventName } from '/core/ui/save-load/screen-save-load.js';
import { EditorCalibrateHDROpenedEventName } from '/core/ui/options/editors/index.js';
import { MainMenuReturnEventName } from '/core/ui/events/shell-events.js';


export const MainMenuCategory = "main-menu";

class PrivusMainMenu extends Component {
    constructor(root) {
        super(root);
        this.functionDefs = {
            'continue':           Privus.defaultFn(MainMenuCategory, "goContinue"     ),
            'create-game':        Privus.defaultFn(MainMenuCategory, "openCreateGame" ),
            'load-game':          Privus.defaultFn(MainMenuCategory, "openLoadGame"   ),
            'events':             Privus.defaultFn(MainMenuCategory, "openEvents"     ),
            'multiplayer':        Privus.defaultFn(MainMenuCategory, "openMultiplayer"), 
            'store':              Privus.defaultFn(MainMenuCategory, "openStore"      ), 
            'additional-content': Privus.defaultFn(MainMenuCategory, "openExtras"     ), 
            'options':            Privus.defaultFn(MainMenuCategory, "openOptions"    ), 
            'exit':               Privus.defaultFn(MainMenuCategory, "exitToDesktop"  ), 
        };
        //"Inherited" properties        
        this.areLegalDocsAccepted = false;
        this.bootLoaded = false;
        this.currentAutosave = DEFAULT_SAVE_GAME_INFO;
        this.currentPreloadingAsset = null;
        this.campaignSetupId = null;
        this.campaignSetupTimestamp = 0;
        this.carouselItems = [];
        this.firstLaunchTutorialPending = false;
        this.hasPreloadingBegun = false;
        this.inSubScreen = false;
        this.isUserInitiatedLogout = false;
        this.leaderIndexToPreload = 0;
        this.mainMenuActivated = false;
        this.mainMenuButtons = [];
        this.MainMenuSceneModels = null;
        this.needKickDecision = false;
        this.nextPromoAdded = false;
        this.previousPromoAdded = false;
        this.selectedCarouselItem = 0;
        this.toggleCarouselAdded = false;
        
        
        //Function listeners
        this.engineInputListener                  = Privus.defaultFn(MainMenuCategory, "onEngineInput"              ).bind(this);
        this.carouselEngineInputListener          = Privus.defaultFn(MainMenuCategory, "onCarouselEngineInput"      ).bind(this);
        this.navigateInputListener                = Privus.defaultFn(MainMenuCategory, "onNavigateInput"            ).bind(this);
        this.qrCompletedListener                  = Privus.defaultFn(MainMenuCategory, "onAccountUpdated"           ).bind(this);
        this.accountUpdatedListener               = Privus.defaultFn(MainMenuCategory, "onAccountUpdated"           ).bind(this);
        this.accountLoggedOutListener             = Privus.defaultFn(MainMenuCategory, "onLogoutResults"            ).bind(this);
        this.accountUnlinkedListener              = Privus.defaultFn(MainMenuCategory, "onAccountUpdated"           ).bind(this);
        this.accountIconListener                  = Privus.defaultFn(MainMenuCategory, "onClickedAccount"           ).bind(this);
        this.creditsOpenedListener                = Privus.defaultFn(MainMenuCategory, "onCreditsOpened"            ).bind(this);
        this.creditsClosedListener                = Privus.defaultFn(MainMenuCategory, "onCreditsClosed"            ).bind(this);
        this.returnToMainMenuListener             = Privus.defaultFn(MainMenuCategory, "returnedToMainMenu"         ).bind(this);
        this.calibrateHDROpenedListener           = Privus.defaultFn(MainMenuCategory, "onCalibrateHDROpened"       ).bind(this);
        this.calibrateHDRClosedListener           = Privus.defaultFn(MainMenuCategory, "onCalibrateHDRClosed"       ).bind(this);
        this.eventsGoSinglePlayerListener         = Privus.defaultFn(MainMenuCategory, "onEventsGoSP"               ).bind(this);
        this.eventsGoMultiPlayerListener          = Privus.defaultFn(MainMenuCategory, "onEventsGoMP"               ).bind(this);
        this.eventsGoLoadListener                 = Privus.defaultFn(MainMenuCategory, "onEventsGoLoad"             ).bind(this);
        this.eventsGoContinueListener             = Privus.defaultFn(MainMenuCategory, "onEventsGoContinue"         ).bind(this);
        this.gameCreatorOpenedListener            = Privus.defaultFn(MainMenuCategory, "onGameCreatorOpened"        ).bind(this);
        this.gameCreatorClosedListener            = Privus.defaultFn(MainMenuCategory, "onGameCreatorClosed"        ).bind(this);
        this.startNewCampaignListener             = Privus.defaultFn(MainMenuCategory, "onNewCampaignStart"         ).bind(this);
        this.promosDataReceivedListener           = Privus.defaultFn(MainMenuCategory, "resolvePromoDataReceived"   ).bind(this);
        this.refreshPromosListener                = Privus.defaultFn(MainMenuCategory, "refreshPromos"              ).bind(this);
        this.startGameSectionListener             = Privus.defaultFn(MainMenuCategory, "startSection"               ).bind(this);
        this.spoPCompleteListener                 = Privus.defaultFn(MainMenuCategory, "onSPoPComplete"             ).bind(this);
        this.spoPKickPromptCheckListener          = Privus.defaultFn(MainMenuCategory, "onSPoPKickPromptCheck"      ).bind(this);
        this.spopHeartBeatReceivedListener        = Privus.defaultFn(MainMenuCategory, "onSPoPHeartBeatReceived"    ).bind(this);
        this.onLaunchHostMPGameListener           = Privus.defaultFn(MainMenuCategory, "onLaunchToHostMPGame"       ).bind(this);
        this.queryCompleteListener                = Privus.defaultFn(MainMenuCategory, "onQueryComplete"            ).bind(this);
        this.saveLoadClosedListener               = Privus.defaultFn(MainMenuCategory, "onSaveLoadClosed"           ).bind(this);
        this.connectionStatusChangedListener      = Privus.defaultFn(MainMenuCategory, "onConnectionStatusChanged"  ).bind(this);
        this.liveEventsSettingsChangeListener     = Privus.defaultFn(MainMenuCategory, "onLiveEventsSettingsChanged").bind(this);
        this.motdCompletedListener                = this.updateMotd.bind(this);

        //Function definitions

        this.onCarouselBack            = Privus.defaultFn(MainMenuCategory, "toggleCarouselMode"          ).bind(this);
        this.onCarouselInteract        = Privus.defaultFn(MainMenuCategory, "interactWithSelectedPromo"   ).bind(this);
        this.onActiveDeviceTypeChanged = Privus.defaultFn(MainMenuCategory, "updatePromoButtonsVisibility").bind(this);
        this.onLegalDocsAccepted = (event) => {
            this.areLegalDocsAccepted = event.detail.accepted;
            if (this.areLegalDocsAccepted && this.firstLaunchTutorialPending) {
                this.firstLaunchTutorialPending = false;
                Privus.defaultFn(MainMenuCategory, "updatePromoButtonsVisibility").call(this);
            }
        };
        engine.on("LaunchToHostMPGame", this.onLaunchHostMPGameListener);
    }


    /* API functionns */
    renderUICarousel(carouselMain)             { return Privus.privusFn(MainMenuCategory, "renderUICarousel",         carouselMain); }
    renderUIConnectionStatus(connectionStatus) { return Privus.privusFn(MainMenuCategory, "renderUIConnectionStatus", connectionStatus); }
    renderUIProfileHeader(profileHeader)       { return Privus.privusFn(MainMenuCategory, "renderUIProfileHeader",    profileHeader); }
    renderUIMotd(motd)                         { return Privus.privusFn(MainMenuCategory, "renderUIMotd",             motd); }

    renderUIBuildInfo(buildInfo)      { return Privus.privusFn(MainMenuCategory, "renderUIBuildInfo",      buildInfo); }
    renderUIVideoContainer(container) { return Privus.privusFn(MainMenuCategory, "renderUIVideoContainer", container); }

    renderUIButtons(slot, functionDefs) { return Privus.privusFn(MainMenuCategory, "renderUIButtons", slot, functionDefs); }

    renderUIConnectionIcon(connectionIcon, connectionStatus)   { return Privus.privusFn(MainMenuCategory, "renderUIConnectionIcon", connectionIcon, connectionStatus); }
    renderUIAccountIcon(accountIcon, activateable)             { return Privus.privusFn(MainMenuCategory, "renderUIAccountIcon",    accountIcon, activateable); }
    renderUIAccountStatus(accountStatus, accountIcon, navHelp) { return Privus.privusFn(MainMenuCategory, "renderUIAccountStatus",  accountStatus, accountIcon, navHelp); }

    updateMotd(motd) { return Privus.privusFn(MainMenuCategory, "updateMotd", motd); }

    onPostAppend() { return Privus.privusFn(MainMenuCategory, "onPostAppend"); }

    onReturnedToMainMenu() { return Privus.privusFn(MainMenuCategory, "onReturnedToMainMenu"); }

    onReceiveFocus() { return Privus.privusFn(MainMenuCategory, "onReceiveFocus"); }
    onLoseFocus()    { return Privus.privusFn(MainMenuCategory, "onLoseFocus"); }



    /* Component functions */
    onInitialize() {
        if(Network.supportsSSO()) {
            this.carouselMain = document.createElement("fxs-vslot");
            this.connStatus = document.createElement('div');
            this.profileHeader = document.createElement("profile-header");
            this.motdDisplay = document.createElement("div");

            this.connStatus.role = "status";
            this.connStatus.classList.value = "connection-status hidden absolute flex bottom-8 left-32";
            this.renderUICarousel(this.carouselMain);
            this.renderUIConnectionStatus(this.connStatus);
            this.renderUIProfileHeader(this.profileHeader);
            this.renderUIMotd(this.motdDisplay);
            
            this.carouselMain.addEventListener(InputEngineEventName, this.carouselEngineInputListener);
            this.Root.appendChild(this.carouselMain);
            this.Root.appendChild(this.connStatus);
            this.Root.insertAdjacentElement("afterbegin", this.profileHeader);

            this.carouselBackButton             = MustGetElement(".carousel-back-button",           this.carouselMain);
            this.carouselBaseLayout             = MustGetElement(".carousel-standard-layout",       this.carouselMain);
            this.carouselBaseLayoutImage        = MustGetElement(".carousel-standard-layout-image", this.carouselMain);
            this.carouselBaseLayoutText         = MustGetElement(".carousel-standard-text-content", this.carouselMain);
            this.carouselBreadcrumbs            = MustGetElement(".carousel-breadcrumb-bar",        this.carouselMain);
            this.carouselContent                = MustGetElement(".carousel-content",               this.carouselMain);
            this.carouselContentText            = MustGetElement(".carousel-text-content",          this.carouselMain);
            this.carouselHourGlass              = MustGetElement(".carousel-hour-glass",            this.carouselMain);
            this.carouselImageContainer         = MustGetElement(".carousel-image-container",       this.carouselMain);
            this.carouselInteractButton         = MustGetElement(".carousel-interact-button",       this.carouselMain);
            this.carouselStandardTextScrollable = MustGetElement(".carousel-standard-layout-text",  this.carouselMain);
            this.carouselText                   = MustGetElement(".carousel-text",                  this.carouselMain);
            this.carouselTextScrollable         = MustGetElement(".carousel-text-only-scrollable",  this.carouselMain);

            const closeButton = document.querySelector('.carousel-close-button');
            closeButton?.addEventListener('action-activate', Privus.defaultFn(MainMenuCategory, "toggleCarouselMode").bind(this));
            
        }


        this.buildInfo = document.createElement('div');
        this.movieContainer = document.createElement('div');
        this.shroud = document.createElement('div');

        this.renderUIBuildInfo(this.buildInfo);
        this.renderUIVideoContainer(this.movieContainer);
        this.shroud.classList.value = "menu-shroud pointer-events-none absolute inset-0";

        this.Root.appendChild(this.buildInfo);
        this.Root.appendChild(this.motdDisplay);
        this.Root.appendChild(this.movieContainer);
        this.Root.appendChild(this.shroud);
    }
    
    onAttach() { 
        super.onAttach();
        //Event listeners
        engine.on("SPoPComplete", this.spoPCompleteListener);
        engine.on("AccountUpdated", this.accountUpdatedListener);
        engine.on("SPoPKickPromptCheck", this.spoPKickPromptCheckListener);
        engine.on("LogoutCompleted", this.accountLoggedOutListener);
        engine.on("SPoPHeartbeatReceived", this.spopHeartBeatReceivedListener);
        engine.on("ConnectionStatusChanged", this.connectionStatusChangedListener);
        engine.on("LegalDocumentContentReceived", this.onLegalDocumentContentReceived, this);
        engine.on("StartGameSection", this.startGameSectionListener);
        engine.on("LiveEventActiveUpdated", this.activeLiveEventListener);
        this.Root.addEventListener(InputEngineEventName, this.engineInputListener);
        this.Root.addEventListener('navigate-input', this.navigateInputListener);
        window.addEventListener(GameCreatorOpenedEventName, this.gameCreatorOpenedListener);
        window.addEventListener(GameCreatorClosedEventName, this.gameCreatorClosedListener);
        window.addEventListener(StartCampaignEventName, this.startNewCampaignListener);
        window.addEventListener(LegalDocsAcceptedEventName, this.onLegalDocsAccepted);
        window.addEventListener(SaveLoadClosedEventName, this.saveLoadClosedListener);
        window.addEventListener(ScreenCreditsOpenedEventName, this.creditsOpenedListener);
        window.addEventListener(EditorCalibrateHDROpenedEventName, this.calibrateHDROpenedListener);
        window.addEventListener(MainMenuReturnEventName, this.returnToMainMenuListener);
        
        //get background container
        this.bgContainer = MustGetElement('.main-menu-bg-container', this.Root);

        //Create buttons slot
        this.slot = MustGetElement("#MainMenuSlot");
        this.slot.setAttribute('data-navrule-up', 'wrap');
        this.slot.setAttribute('data-navrule-down', 'wrap');

        //Set focus
        Input.setActiveContext(InputContext.Shell);

        //Create buttons
        this.mainMenuButtons = this.renderUIButtons(this.slot, this.functionDefs);
        
        //Create debug widget
        UI.Debug.registerWidget({
            id: 'toggleTestScene',
            category: 'Shell',
            caption: 'Toggle Test Scene',
            domainType: 'iota',
            value: false
        });
        engine.on('DebugWidgetUpdated', (id, _) => { if (id == 'toggleTestScene') Privus.defaultFn(MainMenuCategory, "build3DScene").call(this); });

        ContextManager.pushElement(this.Root);

        //Show any modding errors
        Privus.defaultFn(MainMenuCategory, "checkForError").call(this);
        
        //Show networking errors
        Network.onExitPremium();
        const lastNetworkError = Network.getLastPremiumError();
        if(lastNetworkError !== '')
            DialogManager.createDialog_Confirm({title: "LOC_MP_CANT_PLAY_ONLINE_ERROR_TITLE", body: lastNetworkError});
        Network.clearPremiumError();
        
        Privus.defaultFn(MainMenuCategory, "updateAreLegalDocsAccepted").call(this);
        if(Network.supportsSSO()) {
            //Render connection and account info
            this.accountStatusNavHelp = document.createElement('fxs-nav-help');
            this.connIcon = document.createElement('div');
            this.accountIcon = document.createElement('div');
            this.accountIconActivatable = document.createElement("fxs-activatable");
            this.accountStatus = document.createElement('div');

            this.renderUIConnectionIcon(this.connIcon, this.connStatus);
            this.renderUIAccountIcon(this.accountIcon, this.accountIconActivatable);
            this.renderUIAccountStatus(this.accountStatus, this.accountIcon, this.accountStatusNavHelp);
            
            this.connStatus.appendChild(this.connIcon);
            this.accountIcon.appendChild(this.accountIconActivatable);
            this.accountStatus.appendChild(this.accountIcon);
            this.accountStatus.appendChild(this.accountStatusNavHelp);
            this.Root.appendChild(this.accountStatus);

            this.onPostAppend();

            //Enable events button
            Privus.defaultFn(MainMenuCategory, "enableMainMenuButtonbyName").call(this, 
                "LOC_MAIN_MENU_EVENTS", Online.LiveEvent.isEventsEnabled(), 
                Privus.defaultFn(MainMenuCategory, "getAccountLinkPromptMsg").call(this)
            );

            //Set event listeners
            if (Network.isConnectedToSSO()) {
                engine.on("QrAccountLinked", this.qrCompletedListener);
                engine.on("AccountUnlinked", this.accountUnlinkedListener);
            }
            this.carouselBackButton.addEventListener("action-activate", this.onCarouselBack);
            this.carouselInteractButton.addEventListener("action-activate", this.onCarouselInteract);
            engine.on("MotDCompleted", this.motdCompletedListener);
            engine.on("PromosRetrievalCompleted", this.promosDataReceivedListener);
            engine.on("PromoRefresh", this.refreshPromosListener);
        }

        //Skip to main menu if the loading video has ended
        Privus.defaultFn(MainMenuCategory, "skipToMainMenu").call(this);

        //Handle age transition
        if(Modding.getTransitionInProgress() === TransitionType.Age) {
            if(Configuration.getGame().isNetworkMultiplayer)
                MultiplayerShellManager.onAgeTransition();
            else {
                this.buildInfo.classList.add("hidden");
                Privus.defaultFn(MainMenuCategory, "hideOnlineFeaturesUI").call(this);
                ContextManager.push("age-transition-civ-select", { singleton: true, createMouseGuard: true });
            }
        }

        //Render 3D scene
        Privus.defaultFn(MainMenuCategory, "build3DScene").call(this);

        //Unlock the cursor and set it to default
        UI.lockCursor(false);
        UI.setCursorByType(UIHTMLCursorTypes.Default);

        //Get the local saved games list
        Privus.defaultFn(MainMenuCategory, "onSaveLoadClosed").call(this);

        //Handle network events
        if (Network.requireSPoPKickPrompt()) {
            if(!Privus.defaultFn(MainMenuCategory, "checkForLegalDocs").call(this))
                Privus.defaultFn(MainMenuCategory, "getKickDecision").call(this);
            else this.needKickDecision = true;
        }
        if (Network.checkAndClearDisplaySPoPLogout())
            DialogManager.createDialog_Confirm({ body: Locale.compose("LOC_UI_SPOP_LOGOUT_ACCOUNT"), title: Locale.compose("LOC_UI_LOGOUT_ACCOUNT_TITLE") });
        if (Network.checkAndClearDisplayParentalPermissionChange())
            DialogManager.createDialog_Confirm({ body: Locale.compose("LOC_UI_PARENTAL_PERMISSION_REVOKED"), title: Locale.compose("LOC_UI_ACCOUNT_TITLE") });
        if (Network.checkAndClearDisplayMPUnlink())
            DialogManager.createDialog_Confirm({ body: Locale.compose("LOC_UI_KICK_MP_UNLINK"), title: Locale.compose("LOC_UI_ACCOUNT_TITLE") });
        if (!Network.isConnectedToNetwork())
            waitForLayout(() => engine.trigger("NetworkDisconnected"));

        //Refresh carousel content (i.e. promos)
        Privus.defaultFn(MainMenuCategory, "refreshPromos").call(this);

        //Hanlde loading the game straight into a multiplayer game
        if(this.Root.getAttribute('data-launch-to-host-MP-game') == 'true')
            Privus.defaultFn(MainMenuCategory, "onLaunchToHostMPGame").call(this);

        //Notify that we're able to accept game invites now
        if (!Network.requireSPoPKickPrompt() && !Network.isWaitingForValidHeartbeat())
            Network.setMainMenuInviteReady(true);

        //Validate the user's name
        Privus.defaultFn(MainMenuCategory, "onNewUserLogin").call(this);
    }
}

class DefaultMainMenu extends Component {
    constructor(root) {
        super(root);
    }

    renderUICarousel(carouselMain) {
        carouselMain.classList.value = "carousel absolute hidden text-accent-2 self-center";
        carouselMain.setAttribute("tabindex", "-1");
        carouselMain.innerHTML = carouselHTML;
    }
    renderUIConnectionStatus(connectionStatus) {
        connectionStatus.role = "status";
        connectionStatus.classList.value = "connection-status hidden absolute flex bottom-8 left-32";
    }
    renderUIProfileHeader(profileHeader) {
        profileHeader.classList.add("absolute", "top-20", "right-20", "w-auto", "main-menu__profile-header");
        profileHeader.setAttribute("profile-for", "main-menu");
    }
    renderUIMotd(motd) {
        motd.role = "paragraph";
        motd.classList.value = "motd-box absolute flex bottom-0 l-0 w-full justify-center font-body-sm text-accent-2 text-center";    
    }

    renderUIBuildInfo(buildInfo) {
        buildInfo.role = "paragraph";
        buildInfo.classList.value = "main-menu-build-info absolute font-body-sm text-accent-2";
        buildInfo.innerHTML = Locale.compose('LOC_SHELL_BUILD_INFO', BuildInfo.version.display);
    }
    renderUIVideoContainer(container) {
        container.classList.value = "movie-container pointer-events-none absolute inset-0";
    }


    renderUIButtons(slot, functionDefs) {
        const buttonDefs = [];

        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_CONTINUE', 'continue', true, 'continue-item', true));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_NEW_GAME', 'create-game', false, 'create-game-item'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_LOAD_GAME', 'load-game'));
        //if(Network.supportsSSO() && Online.LiveEvent.isEventsEnabled())
        //    buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_EVENTS', 'events'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_MULTIPLAYER', 'multiplayer', true));
        if(UI.supportsDLC())
            buttonDefs.push(this.makeButtonDef('LOC_UI_STORE_LAUNCHER_TITLE', 'store'));
        buttonDefs.push(this.makeButtonDef('LOC_UI_CONTENT_MGR_TITLE', 'additional-content'));
        buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_OPTIONS', 'options'));
        if(UI.canExitToDesktop()) 
            buttonDefs.push(this.makeButtonDef('LOC_MAIN_MENU_EXIT', 'exit'));

        const buttons = [];
        for(let i = 0; i < buttonDefs.length; i++){
            const buttonDef = buttonDefs[i];
            const button = document.createElement('fxs-text-button');
            button.setAttribute("type", "big");
            button.setAttribute("highlight-style", "decorative");
            button.setAttribute("caption", Locale.stylize(buttonDef.caption).toUpperCase());
            button.setAttribute("data-tooltip-style", "none");
            button.setAttribute("data-audio-group-ref", "main-menu-audio");
            button.setAttribute("data-audio-activate-ref", "data-audio-clicked-" + buttonDef.name);
            if(i === 0) button.classList.add("-mt-4");

            button.addEventListener('action-activate', () => { if (this.canPerformInputs()) functionDefs[buttonDef.name].call(this); }, {});
            slot.appendChild(button);

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


    renderUIConnectionIcon(connectionIcon) {
        connectionIcon.classList.add("connection-icon-img", "pointer-events-auto", "flex", "relative", "flex-col", "justify-center");
        connectionIcon.classList.add("align-center", "bg-contain", "bg-center", "bg-no-repeat", "w-18", "h-18");
        //Copied from MainMenu's prototype
        this.setConnectionIcon();
    }
    renderUIAccountIcon(accountIcon, activatable) {
        activatable.classList.add("absolute", "inset-6");

        accountIcon.classList.add("account-icon-img", "pointer-events-none", "flex", "relative", "flex-col", "justify-center", "align-center", "bg-contain", "bg-center", "bg-no-repeat", "w-28", "h-28");
        accountIcon.setAttribute("data-audio-press-ref", "data-audio-primary-button-press");
        //Copied from MainMenu's prototype
        this.setAccountIcon(this.isFullAccountLinkedAndConnected());
        
        if (!Network.isWaitingForValidHeartbeat()) {
            activatable.addEventListener('action-activate', this.accountIconListener);
            return;
        }
        accountIcon.style.backgroundImage = "url('fs://game/core/ui/themes/default/img/my2k_connecting.png')";
        accountIcon.setAttribute("data-tooltip-content", Locale.compose("LOC_UI_WAITING_SPOP_HEARTBEAT_OK"));
    }
    renderUIAccountStatus(accountStatus, accountIcon, navHelp) {
        accountStatus.classList.value = "account-status hidden absolute flex left-10 bottom-3";
        navHelp.setAttribute("action-key", "inline-shell-action-2");
        navHelp.classList.add("absolute", "top-2", "left-2");
        navHelp.classList.toggle("hidden", Network.isWaitingForValidHeartbeat());
    }


    updateMotd(motd) {
        return this.gotMOTD();
    }


    onPostAppend() {}

    onReturnedToMainMenu() {
        //Set focus to button slot
        if (ContextManager.getCurrentTarget() == this.Root)
            FocusManager.setFocus(this.slot);

        //Render 3D models
        this.build3DScene();

        //Unhide main UI
        this.bgContainer.classList.remove("create");
        this.Root.classList.remove("hidden");
        this.slot.classList.remove("hidden");
        this.buildInfo.classList.remove("hidden");
        this.Root.classList.add("trigger-nav-help");

        //Update online-related UI (carousel, account, profile, etc.)
        this.onAccountUpdated();
        this.showOnlineFeaturesUI();
        this.updatePromoCarouselVisibility();
        this.updateProfileHeader();
        this.lowerShroud();
        this.inSubScreen = false;
        
        //Signal to sound engine
        Sound.onGameplayEvent(GameplayEvent.MainMenu);
        
        //Handle getting kicked from multiplayer game
        if (this.needKickDecision) {
            this.needKickDecision = false;
            this.getKickDecision();
        }
        
        //Determinme if we can recieve invites
        if (Network.requireSPoPKickPrompt() || Network.isWaitingForValidHeartbeat()) return;
        Network.setMainMenuInviteReady(true);
    }

    
    /* Non-API functions */
    makeButtonDef(text, key, hasSeparator = false, className = "", isDisabled = false) {
        return {
            caption: text,
            name: key,
            extraClass: className,
            disabled: isDisabled,
            separator: hasSeparator
        }
    }
    
    returnedToMainMenu() {
        return this.onReturnedToMainMenu();
    }
}


Privus.define(MainMenuCategory, {
    createInstance: PrivusMainMenu,
    createDefaultInstance: DefaultMainMenu,
    description: 'Main Menu',
    extend: true,
    attributes: [
        { name: 'data-is-first-boot',          description: 'Whether or not this is the first boot.' },
        { name: 'data-launch-to-host-MP-game', description: 'Whether to launch the host MP flow.' }
    ],
    styles:  ['fs://game/core/ui/shell/main-menu/main-menu.css'],
    content: ['fs://game/core/ui/shell/main-menu/main-menu.html'],
    tabIndex: -1,
}); 

export {MainMenuCategory as default};