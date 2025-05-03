```ts
void onModToggled(modIds: string[], event: Event);
```

Called when a mod is to be toggled enabled/disabled.

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>
`event`  &ndash; an object (based on the Event type) describing the event that occured <br>

### Notes

This is an event function that is automatically called whenever the user requests to toggle (enable/disable) a mod.

This function is also responsible for enabling or disabling the mod itself.

### Example

```js
onModToggled(modIds, event) {
    if (!(event.target instanceof HTMLElement)) return;
    
    const selectedHandle = PrivusControls.getMember(ModsContentCategory, "selectedModHandle");
    if (!selectedHandle) throw new Error(`[PRIVUS-DEFAULT] Invalid mod handle '${selectedHandle}'`);
    
    const modHandles = [selectedHandle];
    const modInfo = Modding.getModInfo(selectedHandle);
    if (modInfo.enabled && Modding.canDisableMods(modHandles).status == 0) 
        Modding.disableMods(modHandles);
    else if (!modInfo.enabled && Modding.canEnableMods(modHandles, true).status == 0)
        Modding.enableMods(modHandles, true);
        
    event.target.setAttribute('disabled', 'true');

    const entries = PrivusControls.getMember(ModsContentCategory, "modEntries");
    const entry = Array.from(entries).find(elem => elem.getAttribute('mod-handle') === selectedHandle.toString());
    PrivusControls.defaultFn(ModsContentCategory, "updateModDetails").call(PrivusControls.getInstance(ModsContentCateogry), selectedHandle);
    PrivusControls.defaultFn(ModsContentCategory, "updateModEntry").call(PrivusControls.getInstance(ModsContentCateogry), selectedHandle, entry);
    PrivusControls.defaultFn(ModsContentCategory, "updateModToggleButton").call(PrivusControls.getInstance(ModsContentCateogry), selectedHandle);
    PrivusControls.defaultFn(ModsContentCategory, "updateNavTray").call(PrivusControls.getInstance(ModsContentCategory));
}
```

