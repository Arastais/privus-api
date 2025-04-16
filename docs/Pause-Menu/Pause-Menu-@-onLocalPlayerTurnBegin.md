```ts
void onLocalPlayerTurnBegin(modIds: string[], retireButton: object);
```

Executes functionality whenever the player begins their turn

### Parameters

`modIds`       &ndash; array containing mod ID strings of mods that have previously called this function <br>
`retireButton` &ndash; element for the 'retire' button <br>

### Notes

This is an event function that is automatically called whenever the player begins their turn

`retireButton` may be undefined within the function, in which case the retire button element should not be modified.


### Example

```js
onLocalPlayerTurnBegin(modIds, retireButton) {
    //Enable retire button when the player starts their turn
    if (!retireButton) return;
    retireButton.classList.toggle("disabled", false);
    retireButton.removeAttribute("data-tooltip-content");
}
```

