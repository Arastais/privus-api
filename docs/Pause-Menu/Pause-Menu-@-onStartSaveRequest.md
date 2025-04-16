```ts
void onStartSaveRequest(modIds: string[]);
```

Executes functionality whenever a game save is requested

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>

### Notes

This is an event function that is automatically called whenever the player requests saving the game


### Example

```js
onStartSaveRequest(modIds) {
    //Disable all pause menu buttons when saving
    const buttons = this._root.querySelectorAll('fxs-button')
    if(!buttons) return;
    buttons.forEach(function (button, idx, buttonsList){
        button.classList.add('disabled');
    });
}
```

