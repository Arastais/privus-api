```ts
Set<Element> renderUIButtons(modIds: string[], sectionQueries: object);
```

Renders the buttons of the pause menu UI.

### Parameters

`modIds`         &ndash; array containing mod ID strings of mods that have previously called this function <br>
`sectionQueries` &ndash; read-only object containing the query selector string of each button section<br>

### Return Value

Returns a Set containing the button elements to render

### Notes

`sectionQueries` is always defined as:
```js
Object.freeze({
    PrimaryHeader:   '.pause-menu__header-buttons>.pauselist',
    SecondaryHeader: '.pause-menu__header-buttons>.morelist',
    Primary:         '.pause-menu__main-buttons>.pauselist',
    Secondary:       '.pause-menu__main-buttons>.morelist',
    PrimaryFooter:   '.pause-menu__footer-buttons>.pauselist',
    SecondaryFooter: '.pause-menu__footer-buttons>.morelist'
});
```

### Example

```js
renderUIButtons(modIds, sectionQueries) {
    //Create the button element
    const button = document.createElement('fxs-button');
    //Add classes and attributes
    button.classList.add('pause-menu-button', 'mb-1\\.5');
    button.setAttribute('caption', Locale.compose('LOC_MY_MOD_BUTTON'));
    
    //Find the section for the button and add it to the section if it exists
    const primarySection = this._root.querySelector(sectionQueries.Primary);
    if(primarySection)
        primarySection.appendChild(button);

    //Return the buttons we made
    return [button];
}
```

