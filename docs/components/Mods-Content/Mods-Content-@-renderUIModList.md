```ts
Element[] renderUIModList(modIds: string[], initialModHandle: integer, root: HTMLElement);
```

Renders the mod list of the mods panel UI.

### Parameters

`modIds`             &ndash; array containing mod ID strings of mods that have previously called this function <br>
`initialModHandle`   &ndash; handle of the initally selected mod <br>
`root`               &ndash; root component of the mods panel <br>

### Return Value

Returns an array containing the activatable elements of each mod in the list

### Notes

Each activatable element contained within the returned array MUST have a valid `mod-handle` attribute. This attribute should be set to the corresponding mod's handle value represented as a string.

### Example

```js
renderUIModList(modIds, initialModHandle, root) {
    const modList = MustGetElement('.mod-list', root);
    const modsContent = MustGetElement('.mods-available', root);
    const modsContentEmpty = MustGetElement('.no-mods-available', root);
    while (modList.lastChild) modList.removeChild(modList.lastChild);

    const mods = Modding.getInstalledMods().filter(m => (!m.official || m.allowance == ModAllowance.Full) && Modding.getModProperty(m.handle, "ShowInBrowser") != 0);
    mods.sort((a, b) => Locale.compare(a.name, b.name));
    
    modsContent.classList.toggle('hidden', mods.length == 0);
    modsContentEmpty.classList.toggle('hidden', mods.length > 0);

    if (mods.length === 0) return;
    initialModHandle ??= this.mods[0].handle;

    const activatables = [];
    mods.forEach((mod, index) => {
        const modActivatable = document.createElement('fxs-activatable');
        modActivatable.classList.add('mod-entry', 'group', 'relative', 'flex', 'w-full', 'grow', 'm-2');
        modActivatable.classList.add(index % 2 === 0 ? '' : 'bg-primary-5');
        modActivatable.setAttribute('tabindex', '-1');
        modActivatable.setAttribute('index', `${index}`);
        //This is required
        modActivatable.setAttribute('mod-handle', mod.handle.toString());
        modList.appendChild(modActivatable);
        activatables.push(modActivatable);

        if (initialModHandle == mod.handle) FocusManager.setFocus(modActivatable);
        const modHoverOverlay = document.createElement('div');
        modHoverOverlay.classList.add('img-mod-hover-overlay', 'absolute', 'inset-0', 'opacity-0', "group-hover\\:opacity-100", "group-focus\\:opacity-100", "group-active\\:opacity-100");
        modActivatable.appendChild(modHoverOverlay);

        const modTextContainer = document.createElement('div');
        modTextContainer.classList.add('mod-text-container', 'relative', 'flex', 'pointer-events-none', 'w-full', 'grow', 'p-2');
        modActivatable.appendChild(modTextContainer);

        const modName = document.createElement('div');
        modName.classList.add('mod-text-name', 'relative', 'flex', 'grow', 'text-lg', 'max-w-76');
        modName.textContent = mod.name;
        modTextContainer.appendChild(modName);

        const modEnabled = document.createElement('div');
        modEnabled.classList.add('mod-text-enabled', 'relative', 'flex', 'grow', 'justify-end', 'uppercase', 'text-lg', 'font-title');
        modEnabled.setAttribute('data-l10n-id', mod.enabled ? "LOC_UI_ENABLED" : "LOC_UI_DISABLED");
        modTextContainer.appendChild(modEnabled);
    });

    return activatables;
}
```

