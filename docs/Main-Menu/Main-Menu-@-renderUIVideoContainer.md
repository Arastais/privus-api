```ts
void renderUIVideoContainer(modIds: string[], container: HTMLElement);
```

Renders the introduction video container of the main menu UI

### Parameters

`modIds`    &ndash; array containing mod ID strings of mods that have previously called this function <br>
`container` &ndash; element representing the intro video container <br>


### Example

```js
renderUIVideoContainer(modIds, container) {
    container.classList.value = "movie-container pointer-events-none absolute inset-0";
}
```

