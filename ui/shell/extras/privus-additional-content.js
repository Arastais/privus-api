import Panel from '/core/ui/panel-support.js';
import { MustGetElement } from '/core/ui/utilities/utilities-dom.js';
import ActionHandler, { ActiveDeviceTypeChangedEventName } from '/core/ui/input/action-handler.js';

const AdditionalContentCategory = 'screen-extras';

class PrivusAdditionalContent extends Panel {
    constructor(root) {
        super(root);
        this.onDetach       = PrivusControls.defaultFn(AdditionalContentCategory, "onDetach"      ).bind(this);
        this.onReceiveFocus = PrivusControls.defaultFn(AdditionalContentCategory, "onReceiveFocus").bind(this);
        this.onLoseFocus    = PrivusControls.defaultFn(AdditionalContentCategory, "onLoseFocus"   ).bind(this);
        this.close          = PrivusControls.defaultFn(AdditionalContentCategory, "close"         ).bind(this);

        this.engineInputListener      = PrivusControls.defaultFn(AdditionalContentCategory, "onEngineInput"            ).bind(this);
        this.activeDeviceTypeListener = PrivusControls.defaultFn(AdditionalContentCategory, "onActiveDeviceTypeChanged").bind(this);
        
        this.enableOpenSound = true;
        this.enableCloseSound = true;
        this.title = MustGetElement(".additional-content-header", this.Root);
        this.Root.setAttribute("data-audio-group-ref", "additional-content-audio");
    }
    
    renderUIButtons(makeButtonFn) { return PrivusControls.privusFn(AdditionalContentCategory, "renderUIButtons", makeButtonFn); }


    onAttach() {
        super.onAttach();
        
        this.Root.addEventListener('engine-input', this.engineInputListener);
        window.addEventListener(ActiveDeviceTypeChangedEventName, this.activeDeviceTypeListener, true);


        const closeButton = MustGetElement('.additional-content-back-button', this.Root);
        closeButton.addEventListener('action-activate', this.close);
        if (ActionHandler.isGamepadActive) closeButton.classList.add('hidden');

        const buttons = this.renderUIButtons(this.makeButton.bind(this));
        const buttonParent = MustGetElement('#main > .w-full', this.Root);
        while (buttonParent.firstChild) buttonParent.removeChild(buttonParent.firstChild);
        buttons.forEach((button) => { buttonParent.appendChild(button); });
        
    }

    makeButton(id, caption, onClickFn, tooltip = true) {
        const button = document.createElement('fxs-text-button');
        button.setAttribute('button-id', id);
        button.setAttribute('type', 'big');
        button.classList.add('uppercase', 'extras-item' + id);
        button.setAttribute('caption', caption);
        button.setAttribute('tabindex', '-1');
        if(tooltip)
            button.setAttribute('data-tooltip-content', (caption + '_DESCRIPTION'));
        button.setAttribute('highlight-style', 'decorative');
        button.setAttribute('data-audio-group-ref', 'additional-content-audio');
        button.setAttribute('data-audio-activate-ref', 'data-audio-clicked-credits');
        button.addEventListener("action-activate", onClickFn.bind(this));
        return button;
    }
}

class DefaultAdditionalContent extends Panel {
    constructor(root) {
        super(root);
    }

    renderUIButtons(makeButtonFn) {
        const buttons = [];
        if(UI.supportsDLC())
            buttons.push(makeButtonFn('mods', 'LOC_UI_CONTENT_MGR_SUBTITLE', PrivusControls.defaultFn(AdditionalContentCategory, "onAdditionalContentButtonPressed")));
        if(UI.shouldDisplayBenchmarkingTools()) {
            buttons.push(makeButtonFn('benchmark-graphics', 'LOC_MAIN_MENU_BENCHMARK_GRAPHICS', PrivusControls.defaultFn(AdditionalContentCategory, "onGraphicsBenchmark")));
            buttons.push(makeButtonFn('benchmark-ai',       'LOC_MAIN_MENU_BENCHMARK_AI',       PrivusControls.defaultFn(AdditionalContentCategory, "onAiBenchmark"      )));
        }
        buttons.push(makeButtonFn('credits', 'LOC_MAIN_MENU_CREDITS', PrivusControls.defaultFn(AdditionalContentCategory, "onCredits")));
        buttons.push(makeButtonFn('legal',   'LOC_UI_LEGAL_TITLE',    PrivusControls.defaultFn(AdditionalContentCategory, "onLegal"  )));
        return buttons;
    }
}

PrivusControls.define(AdditionalContentCategory, {
    createInstance: PrivusAdditionalContent,
    createDefaultInstance: DefaultAdditionalContent,
    description: 'Additional content panel of the main menu',
    classNames: [AdditionalContentCategory, 'w-full', 'h-full', 'flex', 'items-center', 'justify-center'],
    styles: ['fs://game/core/ui/shell/extras/screen-extras.css'],
    content: ['fs://game/core/ui/shell/extras/screen-extras.html'],
    attributes: [],
});
export {AdditionalContentCategory as default};
