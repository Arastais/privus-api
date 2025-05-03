```ts
HTMLElement[] renderUIButtons(modIds : string[], leftCol : HTMLDivElement, rightCol : HTMLDivElement, outerParent : HTMLDivElement, listenerFns : object, updateFns : object, newRowFn : function);
```

Renders the buttons of the pause menu UI.

### Parameters

`modIds`         &ndash; array containing mod ID strings of mods that have previously called this function <br>
`leftCol` &ndash; element to optionally be used as the container for the left column buttons<br>
`rightCol` &ndash; element to optionally be used as the container for the right column buttons<br>
`outerParent` &ndash; element representing the parent container for the buttons - also the container for `leftCol` and `rightCol`.
`listenerFns` &ndash; read-only object containing the bounded button listener functions<br>
`updateFns` &ndash; read-only object containing the bounded button update functions<br>
`newRowFn` &ndash; bounded function which creates a new row within `outerParent` and also updates `leftCol` and `rightCol` to be new columns within this row.

### Return Value

Returns an array containing the `fxs-button` elements to render

### Notes

`outerParent` initially contains no columns or row, and `leftCol` and `rightCol` are initially `null`. You must call `newRowFn` if you want `outerParent` to have any rows or columns, and to update `leftCol` and `rightCol`.

`listenerFns` is always defined as:
```js
Object.freeze({
    close:         this.close.bind(this),
    noMoreTurns:   this.onNoMoreTurnsButton.bind(this),
    retire:        this.onRetireButton.bind(this),
    eventRules:    this.onEventRules.bind(this),
    joinCode:      this.onJoinCodeButton.bind(this),
    restart:       this.onRestartGame.bind(this),
    quickSave:     this.onQuickSaveGameButton.bind(this),
    save:          this.onSaveGameButton.bind(this),
    load:          this.onLoadGameButton.bind(this),
    options:       this.onOptionsButton.bind(this),
    challenges:    this.onChallenges.bind(this),
    social:        this.onSocialButton.bind(this),
    exitToMenu:    this.onExitToMainMenuButton.bind(this),
    exitToDesktop: this.onExitToDesktopButton.bind(this),
});
```


`updateFns` is always defined as:
```js
Object.freeze({
    retire:  this.updateRetireButton.bind(this), //Takes the retire button element and if it's enabled as parameters 
    restart: this.updateRestartButton.bind(this), //Takes the restart button element as a parameter
});
```

### Example

```js
renderUIButtons(modIds, leftCol, rightCol, outerParent, listenerFns, updateFns, newRowFn) {
    //Create the button elements
    const buttonL = document.createElement('fxs-button');
    const buttonR = document.createElement('fxs-button');
    //Add classes and attributes
    buttonL.classList.add('pause-menu-button', 'mb-1\\.5');
    buttonL.setAttribute("data-audio-group-ref", "pause-menu");
    buttonL.setAttribute("data-audio-focus-ref", "data-audio-pause-menu-focus");
    buttonL.setAttribute("data-audio-activate-ref", "data-audio-pause-menu-activate");
    buttonL.setAttribute('caption', Locale.compose('LOC_MY_MOD_BUTTON_L'));
    buttonL.addEventListener('action-activate', (event) => {
        event.preventDefault();
        event.stopPropagation();
        listenerFns.close(event);
    });

    buttonR.classList.add('pause-menu-button', 'mb-1\\.5');
    buttonR.setAttribute("data-audio-group-ref", "pause-menu");
    buttonR.setAttribute("data-audio-focus-ref", "data-audio-pause-menu-focus");
    buttonR.setAttribute("data-audio-activate-ref", "data-audio-pause-menu-activate");
    buttonR.setAttribute('caption', Locale.compose('LOC_MY_MOD_BUTTON_R'));
    buttonR.addEventListener('action-activate', (event) => {
        event.preventDefault();
        event.stopPropagation();
        listenerFns.restart(event);
    });
    //We want to update the buttonR since it's acting as a 'restart'
    updateFns.restart(buttonR); 
    
    //Create a new row and its associated 2 new columns
    newRowFn();
    //Add our buttons
    leftCol.appendChild(buttonL);
    rightCol.appendChild(buttonR);

    //Return the buttons we made
    return [buttonL, buttonR];
}
```

