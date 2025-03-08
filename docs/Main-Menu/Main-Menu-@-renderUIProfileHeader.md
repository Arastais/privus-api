```ts
void renderUIProfileHeader(modIds: string[], profileHeader: HTMLElement);
```

<hr>

Renders the player profile info section of the main menu UI

### Parameters

`modIds`        &ndash; array containing mod ID strings of mods that have previously called this function <br>
`profileHeader` &ndash; element representing the player profile section <br>


### Example

```js
renderUIProfileHeader(modIds, profileHeader) {
    profileHeader.classList.add("absolute", "top-20", "right-20", "w-auto", "main-menu__profile-header");
    profileHeader.setAttribute("profile-for", "main-menu");
}
```

