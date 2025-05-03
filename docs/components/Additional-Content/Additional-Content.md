AdditionalContentCategory defined in `/privus-api/ui/shell/extras/privus-additional-content.js`
<hr>

```js
Privus.defineModClass(`<mod-id>`, MainMenuCategory, <ModClass>);
```
<hr>
Describes the in-game main menu UI

### Functions

[`(constructor)`](Additional-Content-@-constructor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Constructs the component

|UI Initialization||
|:--|:--|
|[`renderUIButtons`](Additional-Content-@-renderUIButtons) | Renders the main buttons |

### Example

```js
import AdditionalContentCategory from '/privus-api/ui/shell/extras/privus-additional-content.js';

class MyAdditionalContent extends Panel {
    constructor(root) {
        super(root);
    }

    renderUIButtons(modIds, makeButtonFn) {
        const buttons = [];
        if(UI.supportsDLC())
            buttons.push(makeButtonFn('mods', 'LOC_UI_CONTENT_MGR_SUBTITLE', Privus.defaultFn(AdditionalContentCategory, "onAdditionalContentButtonPressed")));
        if(UI.shouldDisplayBenchmarkingTools()) {
            buttons.push(makeButtonFn('benchmark-graphics', 'LOC_MAIN_MENU_BENCHMARK_GRAPHICS', Privus.defaultFn(AdditionalContentCategory, "onGraphicsBenchmark")));
            buttons.push(makeButtonFn('benchmark-ai',       'LOC_MAIN_MENU_BENCHMARK_AI',       Privus.defaultFn(AdditionalContentCategory, "onAiBenchmark"      )));
        }
        buttons.push(makeButtonFn('credits', 'LOC_MAIN_MENU_CREDITS', Privus.defaultFn(AdditionalContentCategory, "onCredits")));
        buttons.push(makeButtonFn('legal',   'LOC_UI_LEGAL_TITLE',    Privus.defaultFn(AdditionalContentCategory, "onLegal"  )));
        return buttons;
    }
}


Privus.defineModClass('my-mod', MainMenuCategory, MyMainMenu);
```
