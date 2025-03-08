```ts
Element[] renderUIButtons(modIds: string[], slot: HTMLElement, functionDefs: Object);
```

<hr>

Renders the main buttons of the main menu UI.

### Parameters

`modIds`         &ndash; array containing mod ID strings of mods that have previously called this function <br>
`slot`           &ndash; element represeting the container for the main menu buttons <br>
`functionDefs`   &ndash; read-only object containing the function for each button based on its name <br>

### Return Value

Returns an array containing the button elements to render

### Notes

`sectionQueries` is always defined as:
```js
{
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
```
where `Privus.defaultFn(...)` calls the default function use by the base game.

### Example

```js
//Render just the new game button
renderUIButtons(modIds, slot, functionDefs) {
    const button = document.createElement('fxs-text-button');
    const name = 'create-game';
    button.setAttribute("type", "big");
    button.setAttribute("highlight-style", "decorative");
    button.setAttribute("caption", Locale.stylize('LOC_MAIN_MENU_NEW_GAME').toUpperCase());
    button.setAttribute("data-tooltip-style", "none"); //no tooltip
    button.setAttribute("data-audio-group-ref", "main-menu-audio");
    button.setAttribute("data-audio-activate-ref", "data-audio-clicked-" + name);
    button.classList.add('create-game-item');

    button.addEventListener('action-activate', () => { if (this.canPerformInputs()) functionDefs[name].call(this); }, {});
    slot.appendChild(button);

    //Add a fancy separator below the new game button
    const separator = document.createElement("div");
    separator.classList.add("main-menu-filigree-divider", "h-4", "mt-1", "min-w-96", "bg-center", "bg-contain", "bg-no-repeat", "self-center", "min-w-96");
    slot.appendChild(separator);

    return [button];
}
```

