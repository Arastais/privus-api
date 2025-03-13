//Get the additional content category from Privus API
import ContextManager from '/core/ui/context-manager/context-manager.js';
import AdditionalContentCategory from '/privus-api/ui/shell/extras/privus-additional-content.js';
import DialogManager from '/core/ui/dialog-box/manager-dialog-box.js';
import * as Animations from '/core/ui/utilities/animations.js';



class ExampleAdditionalContent {
    constructor(root) {
        this._root = root;
    }

    renderUIButtons(modIds, makeButtonFn) {
        const divider = document.createElement('div');
        divider.classList.add("main-menu-filigree-divider", "h-4", "mt-1", "min-w-96", "bg-center", "bg-contain", "bg-no-repeat", "self-center", "min-w-96");


        const buttons = [];
        
        if(UI.supportsDLC())
            buttons.push(makeButtonFn('mods', 'LOC_UI_CONTENT_MGR_SUBTITLE', Privus.defaultFn(AdditionalContentCategory, "onAdditionalContentButtonPressed")));
        
        buttons.push(divider);
        
        buttons.push(   makeButtonFn('store',   'LOC_UI_STORE_LAUNCHER_TITLE', this.onStore,   false));
        const giftbox = makeButtonFn('giftbox', 'LOC_REWARD_RECEIVED',         this.onGiftbox, false);
        giftbox.classList.add('hidden');
        buttons.push(giftbox);
        buttons.push(makeButtonFn('credits', 'LOC_MAIN_MENU_CREDITS', Privus.defaultFn(AdditionalContentCategory, "onCredits")));
        buttons.push(makeButtonFn('legal',   'LOC_UI_LEGAL_TITLE',    Privus.defaultFn(AdditionalContentCategory, "onLegal"  )));

        buttons.push(divider.cloneNode());

        if(!UI.shouldDisplayBenchmarkingTools()) return buttons;
        buttons.push(makeButtonFn('benchmark-graphics', 'LOC_MAIN_MENU_BENCHMARK_GRAPHICS', Privus.defaultFn(AdditionalContentCategory, "onGraphicsBenchmark").bind(Privus.getInstance(AdditionalContentCategory))));
        buttons.push(makeButtonFn('benchmark-ai',       'LOC_MAIN_MENU_BENCHMARK_AI',       Privus.defaultFn(AdditionalContentCategory, "onAiBenchmark"      ).bind(Privus.getInstance(AdditionalContentCategory))));
        return buttons;
    }


    onStore(event) {
        if (!(event.target instanceof HTMLElement)) return;

        const isUserInput = true;
        const result = Network.triggerNetworkCheck(isUserInput);
        if (result.wasErrorDisplayedOnFirstParty) return;
        if (result.networkResult == NetworkResult.NETWORKRESULT_NO_NETWORK) {
            DialogManager.createDialog_Confirm({ body: Locale.compose("LOC_UI_CONNECTION_FAILED"), title: Locale.compose("LOC_UI_OFFLINE_ACCOUNT_TITLE") });
            return;
        }

        ContextManager.popUntil("main-menu");
        Animations.cancelAllChainedAnimations();
        ContextManager.push("screen-store-launcher", { singleton: true, createMouseGuard: true });
    }
    
    onGiftbox(event) {
        if (!(event.target instanceof HTMLElement)) return;
        Animations.cancelAllChainedAnimations();
        ContextManager.push('screen-giftbox-popup', { singleton: true, createMouseGuard: true });
    }
}

// Register our class as this mod's changes to the pause menu
Privus.defineModClass('example', AdditionalContentCategory, ExampleAdditionalContent);