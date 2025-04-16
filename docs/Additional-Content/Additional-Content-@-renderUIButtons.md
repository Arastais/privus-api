```ts
Element[] renderUIButtons(modIds: string[], makeButtonFn: (id: string, caption: string, onClickFn: () => void, tooltip: boolean) => HTMLElement);
```

Renders the main buttons of the main menu UI.

### Parameters

`modIds`         &ndash; array containing mod ID strings of mods that have previously called this function <br>
`makeButtonFn`   &ndash; read-only bounded helper function that creates a button element using the default additional content panel style <br>

### Return Value

Returns an array containing the elements to render

### Notes

`makeButtonFn` is defined as:
```js
makeButtonFn(id, caption, onClickFn, tooltip = true) {
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
```
where `this` is equivalent to `Privus.getInstance(AdditionalContentCategory)`.

### Example

```js
//Render the default buttons along with a 'collection' button and some dividers
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
```

