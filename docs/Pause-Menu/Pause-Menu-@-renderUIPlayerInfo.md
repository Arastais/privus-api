```ts
void renderUIPlayerInfo(modIds: string[], playerInfo: Element);
```

Renders the player info section of the pause menu UI.

### Parameters

`modIds`     &ndash; array containing mod ID strings of mods that have previously called this function <br>
`playerInfo` &ndash; element containing the player info text <br>

### Notes

`playerInfo` may be undefined within the function, in which case changes should not be made to the player info.

### Example

```js
renderUIPlayerInfo(modIds, playerInfo) {
    if(!playerInfo) return;
    playerInfo.setAttribute("data-player-info", JSON.stringify(getPlayerCardInfo()));
}
```

