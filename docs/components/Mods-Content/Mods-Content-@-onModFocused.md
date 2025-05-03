```ts
void onModClicked(modIds: string[], event: Event);
```

Called when a mod in the mod list is focused

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>
`event`  &ndash; an object (based on the Event type) describing the event that occured <br>

### Notes

This is an event function that is automatically called whenever the a mod within the mod list becomes focused.

This function is also partially responsible for setting the selected mod.

### Example

```js
onModClicked(modIds, event) {
    if (!(event.target instanceof HTMLElement)) return;
    
    const selectedHandle = parseInt(event.target.getAttribute('mod-handle') ?? "");
    PrivusControls.setMember(ModsContentCategory, "selectedModHandle", selectedHandle);
    
    PrivusControls.defaultFn(ModsContentCategory, "updateModDetails").call(PrivusControls.getInstance(ModsContentCateogry), selectedHandle);
    PrivusControls.defaultFn(ModsContentCategory, "updateNavTray").call(PrivusControls.getInstance(ModsContentCategory));
}
```

