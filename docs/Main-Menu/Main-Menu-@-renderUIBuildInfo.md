```ts
void renderUIBuildInfo(modIds: string[], buildInfo: HTMLElement);
```

<hr>

Renders the build information text of the main menu UI

### Parameters

`modIds`    &ndash; array containing mod ID strings of mods that have previously called this function <br>
`buildInfo` &ndash; element representing the build info text container <br>


### Example

```js
renderUIBuildInfo(modIds, buildInfo) {
    buildInfo.role = "paragraph";
    buildInfo.classList.value = "main-menu-build-info absolute font-body-sm text-accent-2";
    buildInfo.innerHTML = Locale.compose('LOC_SHELL_BUILD_INFO', BuildInfo.version.display);
}
```

