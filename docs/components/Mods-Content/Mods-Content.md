ModsContentCategory defined in `/privus-api/ui/shell/mods-content/privus-mods-content.js`
<hr>

```js
PrivusControls.defineModClass(`<mod-id>`, ModsContentCategory, <ModClass>);
```
<hr>
Describes the in-game mods/add-ons panel UI

### Functions

[`(constructor)`](Mods-Content-@-constructor) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Constructs the component


|UI Initialization||
|:--|:--|
|[`renderUIModList`](Mods-Content-@-renderUIModList) | Renders the mod list and its entries |

|UI Data||
|:--|:--|
|[`updateModDetails`](Mods-Content-@-updateModDetails)           | Updates the details of a given mod |
|[`updateModToggleButton`](Mods-Content-@-updateModToggleButton) | Updates the enable/disable button of a given mod |
|[`updateModEntry`](Mods-Content-@-updateModEntry) | Updates the content of a given mod's entry in the mod list |

|UI Events||
|:--|:--|
|[`onModToggled`](Mods-Content-@-onModToggled) | Called when a mod is to be toggled enabled/disabled |
|[`onModClicked`](Mods-Content-@-onModClicked) | Called when a mod in the mod list is clicked |
|[`onModFocused`](Mods-Content-@-onModFocused) | Called when a mod in the mod list is focused |


|Data Members||
|:--|:--|
|`selectedModHandle` [get; set] | The handle of the currently selected mod |
|`modEntries` [get] | An array containing the `HTMLElement` of each mod list entry |

### Example

```js
import ModsContentCategory from '/privus-api/ui/shell/mods-content/privus-mods-content.js';

//Change the basic "ENABLED"/"DISABLED" text to our own custom localization
class MyModsContent {
    constructor(root) { 
        this._root = root;
    }

    updateModEntry(modIds, modHandle, entry) {
        if(!modHandle) throw new Error(`[MY-MOD] Invalid mod handle '${modHandle}'`);
        const modInfo = Modding.getModInfo(modHandle);
        if(!entry) throw new Error(`[MY-MOD] Invalid entry for mod ${modInfo.name}`);

        const nameElement = entry.querySelector(".mod-text-name");
        if(nameElement) nameElement.textContent = modInfo.name;
        const enabledElement = entry.querySelector(".mod-text-enabled");
        //Note how the localization id is different
        if(enabledElement)
            enabledElement.setAttribute('data-l10n-id', "LOC_EXAMPLE_MOD_UI_" + (modInfo.enabled ? "ENABLED" : "DISABLED"));
    }
}

PrivusControls.defineModClass('my-mod', ModsContentCategory, MyModsContent);
```
