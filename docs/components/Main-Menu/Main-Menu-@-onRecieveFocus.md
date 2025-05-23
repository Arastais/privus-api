```ts
void onRecieveFocus(modIds: string[]);
```

Executes functionality whenever the main menu becomes the active gamepad UI component.

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>

### Notes

This is an event function that is automatically called whenever the main menu is active or is selected using a gamepad

This function is only relevant with gamepad/controller input.

### Example

```js
import NavTray from '/core/ui/navigation-tray/model-navigation-tray.js';

onRecieveFocus(modIds) {
    //Show the Navigation tray
    NavTray.clear();
    NavTray.addOrUpdateGenericBack();
    this._root.classList.add('trigger-nav-help');
}
```

