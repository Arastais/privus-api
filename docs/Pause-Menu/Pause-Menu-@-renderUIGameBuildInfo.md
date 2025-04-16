```ts
void renderUIGameBuildInfo(modIds: string[], mapSeedInfo: Element);
```

Renders the build info section of the pause menu UI.

### Parameters

`modIds`    &ndash; array containing mod ID strings of mods that have previously called this function <br>
`buildInfo` &ndash; element containing the build info text <br>

### Notes

`buildInfo` may be undefined within the function, in which case changes should not be made to the game's build info.


### Example

```js
renderUIGameBuildInfo(modIds, buildInfo) {
    if (!buildInfo) return;

    buildInfo.innerHTML = Locale.compose('LOC_PAUSE_MENU_BUILD_INFO', BuildInfo.version.display);
}
```

