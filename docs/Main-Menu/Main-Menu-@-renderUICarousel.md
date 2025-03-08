```ts
void renderUICarousel(modIds: string[], carouselMain: HTMLElement);
```

<hr>

Renders the promotion carousel of the main menu UI

### Parameters

`modIds`       &ndash; array containing mod ID strings of mods that have previously called this function <br>
`carouselMain` &ndash; element representing the root of the carousel <br>


### Example

```js
renderUICarousel(modIds, carouselMain) {
    carouselMain.classList.value = "carousel absolute hidden text-accent-2 self-center";
    carouselMain.setAttribute("tabindex", "-1");
    carouselMain.innerHTML = `...`;
}
```

