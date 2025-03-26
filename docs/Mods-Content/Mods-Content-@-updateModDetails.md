```ts
void updateModDetails(modIds: string[], modHandle: integer);
```

<hr>

Updates the details content of a given mod

### Parameters

`modIds`    &ndash; array containing mod ID strings of mods that have previously called this function <br>
`modHandle` &ndash; handle value of the mod to update <br>


### Example

```js
updateModDetails(modIds, modHandle) {
    if(!modHandle) throw new Error(`Invalid mod handle '${modHandle}'`);
    const modInfo = Modding.getModInfo(modHandle);

    const modNameHeader = MustGetElement('.selected-mod-name', this._root);
    modNameHeader.setAttribute('title', modInfo.name);

    const modDescriptionText = MustGetElement('.mod-description', this._root);
    modDescriptionText.setAttribute('data-l10n-id', modInfo.description);

    if (modInfo.created)
        this.modDateText.textContent = Locale.compose("LOC_UI_MOD_DATE", modInfo.created);

    if (!modInfo.dependsOn) {
        Privus.defaultFn(ModsContentCategory, "updateModToggleButton").bind(Privus.getInstance(ModsContentCategory), modHandle);
        return;
    }

    const modDependenciesContent = MustGetElement('.mod-dependencies', this._root);
    modDependenciesContent.classList.remove('hidden');
    modInfo.dependsOn.forEach(dependecy => {
        const depElement = document.createElement('div');
        depElement.classList.add("mod-dependency", "relative");
        depElement.setAttribute('data-l10n-id', dependecy);
        modDependenciesContent.appendChild(depElement);
    });

    Privus.defaultFn(ModsContentCategory, "updateModToggleButton").bind(Privus.getInstance(ModsContentCategory), modHandle);
}
```

