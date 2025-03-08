MainMenuCategory defined in `/privus-api/ui/shell/main-menu/privus-main-menu.js`
<hr>

```js
Privus.defineModClass(`<mod-id>`, MainMenuCategory, <ModClass>);
```
<hr>
Describes the in-game main menu UI

### Functions

[`(constructor)`](Main-Menu-@-constructor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Constructs the component

|UI Initialization||
|:--|:--|
|[`renderUICarousel`](Main-Menu-@-renderUICarousel)                 | Renders the promotion carousel |
|[`renderUIConnectionStatus`](Main-Menu-@-renderUIConnectionStatus) | Renders the connection status section |
|[`renderUIProfileHeader`](Main-Menu-@-renderUIProfileHeader)       | Renders the profile header section |
|[`renderUIMotd`](Main-Menu-@-renderUIMotd)                         | Renders the motd section |
|[`renderUIBuildInfo`](Main-Menu-@-renderUIBuildInfo)               | Renders the build info text |
|[`renderUIVideoContainer`](Main-Menu-@-renderUIVideoContainer)     | Renders the intro video container |
|[`renderUIConnectionIcon`](Main-Menu-@-renderUIConnectionIcon)     | Renders the connection status icon |
|[`renderUIAccountIcon`](Main-Menu-@-renderUIAccountIcon)           | Renders the account status icon |
|[`renderUIAccountStatus`](Main-Menu-@-renderUIAccountStatus)       | Renders the account status section |

|UI Data||
|:--|:--|
|[`updateMotd`](Main-Menu-@-updateMotd) | Updates the MOTD text |

|UI Events||
|:--|:--|
|[`onPostAppend`](Main-Menu-@-onPostAppend) | Called when all UI elements have been appended to the root element |

|Focus||
|:--|:--|
|[`onRecieveFocus`](Main-Menu-@-onRecieveFocus) | Called when element is focused |
|[`onLoseFocus`](Main-Menu-@-onLoseFocus)       | Called when element is un-focused |

### Example

```js
import MainMenuCategory from '/privus-api/ui/shell/main-menu/privus-main-menu.js';

class MyMainMenu {
    constructor(root) {
        this._root = root;
    }

    renderUIMotd(modIds, motd) {
        motd.role = "paragraph";
        motd.classList.value = "motd-box absolute flex bottom-0 l-0 w-full justify-center font-body-sm text-accent-2 text-center";    
    }
    
    updateMotd(modIds, motd) {
        if (!Network.supportsSSO()) return;
        const titles = Online.MOTD.getAllMOTDHeaders();
        const firstMotd = Online.MOTD.getMOTD(titles[0]);
        if(!firstMotd) return;
        motd.innerHTML = firstMotd;
    }
}


Privus.defineModClass('my-mod', MainMenuCategory, MyMainMenu);
```
