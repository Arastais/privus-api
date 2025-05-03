```ts
void onLocalPlayerTurnEnd(modIds: string[], retireButton: object);
```

Executes functionality whenever the player ends their turn

### Parameters

`modIds`       &ndash; array containing mod ID strings of mods that have previously called this function <br>
`retireButton` &ndash; element for the 'retire' button <br>

### Notes

This is an event function that is automatically called whenever the player ends their turn

`retireButton` may be undefined within the function, in which case the retire button element should not be modified.


### Example

```js
onLocalPlayerTurnEnd(modIds, retireButton) {
    //Disable retire button when the player ends their turn
    if (!retireButton) return;
    retireButton.classList.toggle("disabled", true);
    retireButton.setAttribute("data-tooltip-content", "LOC_PAUSE_MENU_RETIRE_DISABLED");
}
```

