```ts
void renderUIHeader(modIds: string[], header: Element);
```

<hr>

Renders the header section of the pause menu UI.

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>
`header` &ndash; element containing the header content <br>

### Notes

`header` may be undefined within the function, in which case changes should not be made to the header.


### Example

```js
renderUIHeader(modIds, header) {
    //Set header background
    if (!header) return;
    header.setAttribute("headerimage", Icon.getPlayerBackgroundImage(GameContext.localPlayerID));
}
```

