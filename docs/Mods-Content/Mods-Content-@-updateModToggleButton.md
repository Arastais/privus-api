```ts
void updateModToggleButton(modIds: string[], modHandle: integer);
```

<hr>

Updates the enable/disable button for a given mod.

### Parameters

`modIds`    &ndash; array containing mod ID strings of mods that have previously called this function <br>
`modHandle` &ndash; handle value of the mod to use for updating the enable/disable button <br>


### Example

```js
updateModToggleButton(modIds, modHandle) {
    if (!modHandle) return;
    
    // Get mod info to determine the new enabled state
    const modHandles = [modHandle];
    const modInfo = Modding.getModInfo(modHandle);

    const canToggle = modInfo.enabled ? Modding.canDisableMods(modHandles) : Modding.canEnableMods(modHandles, true);
    const allowToggle = canToggle.status == 0;
    const toggleEnableButton = MustGetElement('.toggle-enable');
    toggleEnableButton.setAttribute('disabled', allowToggle ? 'false' : 'true');
    toggleEnableButton.setAttribute('caption', "LOC_ADVANCED_OPTIONS_" + (modInfo.enabled ? "DISABLE" : "ENABLE"));
}
```

