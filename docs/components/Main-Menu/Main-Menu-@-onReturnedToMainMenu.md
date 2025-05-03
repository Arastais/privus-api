```ts
void onReturnedToMainMenu(modIds: string[]);
```

Executes functionality once an overlaying panel is exited and thus the user returns to the main menu.

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>

### Notes

This is an event function that is automatically called after a panel within the main menu (e.g. the credits screen) is clsoed by the user.

### Example

```js
onReturnedToMainMenu(modIds) {
    //Render the main menu normally
    PrivusControls.defaultFn(MainMenuCategory, "onReturnedToMainMenu").call(PrivusControls.getInstance(MainMenuCategory));
    //Make sure the build info stays hidden
    PrivusControls.getInstance(MainMenuCategory).buildInfo.classList.add("hidden");
}
```

