```ts
void onModClicked(modIds: string[], event: Event);
```

<hr>

Called when a mod in the mod list is clicked

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>
`event`  &ndash; an object (based on the Event type) describing the event that occured <br>

### Notes

This is an event function that is automatically called whenever the user clicks on a mod within the mod list.

This function is also partially responsible for setting the selected mod.

### Example

```js
onModClicked(modIds, event) {
    if (!(event.target instanceof HTMLElement)) return;
    
    const selectedHandle = parseInt(event.target.getAttribute('mod-handle') ?? "");
    Privus.setMember(ModsContentCategory, "selectedModHandle", selectedHandle);
    
    if (ActionHandler.isGamepadActive) {
        Audio.playSound("data-audio-primary-button-press");
        Privus.defaultFn(ModsContentCategory, "onModToggled").call(Privus.getInstance(ModsContentCateogry), selectedHandle, event);
        return;
    }

    Privus.defaultFn(ModsContentCategory, "updateModDetails").call(Privus.getInstance(ModsContentCateogry), selectedHandle);
}
```

