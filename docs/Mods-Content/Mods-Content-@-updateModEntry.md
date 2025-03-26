```ts
void updateModEntry(modIds: string[], modHandle: integer, entry: HTMLElement);
```

<hr>

Updates the enable/disable button for a given mod.

### Parameters

`modIds`    &ndash; array containing mod ID strings of mods that have previously called this function <br>
`modHandle` &ndash; handle value of the corresponding mod <br>
`entry`     &ndash; element representing the mod's entry in the mod list <br>

### Example

```js
updateModEntry(modIds, modHandle, entry) {
    if(!modHandle) throw new Error(`Invalid mod handle '${modHandle}'`);
    const modInfo = Modding.getModInfo(modHandle);
    if(!entry) throw new Error(`Invalid entry for mod ${modInfo.name}`);

    const nameElement = entry.querySelector(".mod-text-name");
    if(nameElement) nameElement.textContent = modInfo.name;

    const enabledElement = entry.querySelector(".mod-text-enabled");
    if(enabledElement)
        enabledElement.setAttribute('data-l10n-id', "LOC_UI_" + (modInfo.enabled ? "ENABLED" : "DISABLED"));
}
```

