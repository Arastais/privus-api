```ts
void renderUIMapSeed(modIds: string[], mapSeedInfo: Element);
```

<hr>

Renders the map seed information section of the pause menu UI.

### Parameters

`modIds`      &ndash; array containing mod ID strings of mods that have previously called this function <br>
`mapSeedInfo` &ndash; element containing the map seed info text <br>

### Notes

`mapSeedInfo` may be undefined within the function, in which case changes should not be made to the map seed info.


### Example

```js
renderUIMapSeed(modIds, mapSeedInfo) {
    if (!mapSeedInfo) return;

    //Get the map seed from the config
    const mapSeed = Configuration.getMap().mapSeed.toString();
    
    //Set the map seed text
    const mapSeedText =  "Map seed is " + Locale.compose(mapSeed);
    if (!mapSeedText) return;
    mapSeedInfo.textContent = mapSeedText;
}
```

