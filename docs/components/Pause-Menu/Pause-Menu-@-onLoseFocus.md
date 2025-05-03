```ts
void onLoseFocus(modIds: string[]);
```

Executes functionality whenever a component other than this one becomes the active gamepad UI component.

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>

### Notes

This is an event function that is automatically called whenever the pause menu becomes inactive or whenever another component is selected using a gamepad

This function is only relevant with gamepad/controller input.


### Example

```js
import NavTray from '/core/ui/navigation-tray/model-navigation-tray.js';

onLoseFocus(modIds) {
    //Hide the navigation tray
    NavTray.clear();
    this._root.classList.remove('trigger-nav-help');
}
```

