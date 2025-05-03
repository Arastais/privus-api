```ts
void onPostAppend(modIds: string[]);
```

Executes functionality once the all UI elements of the main menu have been appended to the root component.

### Parameters

`modIds` &ndash; array containing mod ID strings of mods that have previously called this function <br>

### Notes

This is an event function that is automatically called after all of the UI components of the main menu have been rendered and appended to the root component (i.e. when all the UI elements have a parent)

### Example

```js
onPostAppend(modIds) {
    //Replace all of root's children with a blank div
    const blankDiv = document.createElement('div');
    this._root.replaceChildren(blankDiv);
}
```

