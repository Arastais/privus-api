```ts
void onSaveComplete(modIds: string[]);
```

<hr>

Executes functionality whenever a game save is completed

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>

### Notes

This is an event function that is automatically called whenever the game finishes saving


### Example

```js
onSaveComplete(modIds) {
    //Enable all pause menu buttons when saving
    const buttons = this._root.querySelectorAll('fxs-button')
    if(!buttons) return;
    buttons.forEach(function (button, idx, buttonsList){
        button.classList.remove('disabled');
    });
}
```

