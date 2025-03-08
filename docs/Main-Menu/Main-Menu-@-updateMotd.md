```ts
void renderUIMotd(modIds: string[], motd: HTMLElement);
```

<hr>

Updates the content of the motd text

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>
`motd`   &ndash; element representing the motd section <br>


### Example

```js
updateMotd(modIds, motd) {
    if (!Network.supportsSSO()) return;
    const titles = Online.MOTD.getAllMOTDHeaders();
    const firstMotd = Online.MOTD.getMOTD(titles[0]);
    if(!firstMotd) return;
    motd.innerHTML = firstMotd;
}
```

