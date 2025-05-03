PauseMenuCategory defined in `/privus-api/ui/pause-menu/privus-pause-menu.js`
<hr>

```js
Privus.defineModClass(`<mod-id>`, PauseMenuCategory, <ModClass>);
```
<hr>
Describes the in-game pause menu UI

### Functions

[`(constructor)`](Pause-Menu-@-constructor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Constructs the component

|UI Initialization||
|:--|:--|
|[`renderUIPlayerInfo`](Pause-Menu-@-renderUIPlayerInfo)       | Renders the player info section |
|[`renderUIButtons`](Pause-Menu-@-renderUIButtons)             | Renders the buttons |
|[`renderUIHeader`](Pause-Menu-@-renderUIHeader)               | Renders the header section |
|[`renderUIGameInfo`](Pause-Menu-@-renderUIGameInfo)           | Renders the game info text |
|[`renderUIMapSeed`](Pause-Menu-@-renderUIMapSeed)             | Renders the map seed text |
|[`renderUIGameBuildInfo`](Pause-Menu-@-renderUIGameBuildInfo) | Renders the map seed text |

|Player Turn||
|:--|:--|
|[`onLocalPlayerTurnBegin`](Pause-Menu-@-onLocalPlayerTurnBegin) | Called when the player's turn begins |
|[`onLocalPlayerTurnEnd`](Pause-Menu-@-onLocalPlayerTurnEnd)     | Called when the player's turn ends |

|Saving||
|:--|:--|
|[`onStartSaveRequest`](Pause-Menu-@-onStartSaveRequest) | Called when the game saving process begins |
|[`onSaveComplete`](Pause-Menu-@-onSaveComplete)         | Called when the game saving process completes |

|Focus||
|:--|:--|
|[`onRecieveFocus`](Pause-Menu-@-onRecieveFocus) | Called when element is focused |
|[`onLoseFocus`](Pause-Menu-@-onLoseFocus)       | Called when element is un-focused |

### Example

```js
import PauseMenuCategory from '/privus-api/ui/pause-menu/privus-pause-menu.js';

class MyPauseMenu {
    constructor(root) {
        this._root = root;
    }

    renderUIMapSeed(modIds, mapSeedInfo) {
        console.info(`[MY-PAUSE-MENU] Mods that have already overriden the map seed ui: ${modIds}`);
        
        if (!mapSeedInfo) throw new Error('Could not find map seed element!');
        mapSeedInfo.textContent = `<My Map Seed>`;
    }
}


Privus.defineModClass('my-mod', PauseMenuCategory, MyPauseMenu);
```
