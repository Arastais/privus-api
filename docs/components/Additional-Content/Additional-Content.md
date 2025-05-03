AdditionalContentCategory defined in `/privus-api/ui/shell/extras/privus-additional-content.js`
<hr>

```js
PrivusControls.defineModClass(`<mod-id>`, MainMenuCategory, <ModClass>);
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


PrivusControls.defineModClass('my-mod', MainMenuCategory, MyMainMenu);
```
