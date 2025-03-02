PauseMenuCategory defined in `/privus-api/ui/pause-menu/privus-pause-menu.js`
<hr>

```js
Privus.defineModClass(`<mod-id>`, PauseMenuCategory, <ModClass>);
```
<hr>
Describes the in-game pause menu UI

### Functions

[`(constructor)`](constructor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Constructs the component

|UI Initialization||
|:--|:--|
|[`renderUIPlayerInfo`](renderUIPlayerInfo)       | Renders the player info section |
|[`renderUIButtons`](renderUIButtons)             | Renders the buttons |
|[`renderUIHeader`](renderUIHeader)               | Renders the header section |
|[`renderUIGameInfo`](renderUIGameInfo)           | Renders the game info text |
|[`renderUIMapSeed`](renderUIMapSeed)             | Renders the map seed text |
|[`renderUIGameBuildInfo`](renderUIGameBuildInfo) | Renders the map seed text |

|Player Turn||
|:--|:--|
|[`onLocalPlayerTurnBegin`](onLocalPlayerTurnBegin) | Called when the player's turn begins |
|[`onLocalPlayerTurnEnd`](onLocalPlayerTurnEnd)     | Called when the player's turn ends |

|Saving||
|:--|:--|
|[`onStartSaveRequest`](onStartSaveRequest) | Called when the game saving process begins |
|[`onSaveComplete`](onSaveComplete)         | Called when the game saving process completes |

|Focus||
|:--|:--|
|[`onRecieveFocus`](onRecieveFocus) | Called when element is focused |
|[`onLoseFocus`](onLoseFocus)       | Called when element is un-focused |

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
