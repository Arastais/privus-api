```ts
void renderUIMotd(modIds: string[], motd: HTMLElement);
```

Renders the motd strip of the main menu UI

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>
`motd`   &ndash; element representing the motd section <br>


### Example

```js
renderUIMotd(modIds, motd) {
    motd.role = "paragraph";
    motd.classList.value = "motd-box absolute flex bottom-0 l-0 w-full justify-center font-body-sm text-accent-2 text-center"; 
}
```

