```ts
void renderUIAccountStatus(modIds: string[], accountStatus: HTMLElement, accountIcon: HTMLElement, navHelp, HTMLElement);
```

<hr>

Renders the 2K account status section of the main menu UI

### Parameters

`modIds`        &ndash; array containing mod ID strings of mods that have previously called this function <br>
`accountStatus` &ndash; element representing the 2K account status section <br>
`accountIcon`   &ndash; element representing the 2K icon image <br>
`navHelp`       &ndash; element representing the navigation helper for the account status <br>

### Notes

`renderUIAccountIcon` will have already been called with `accountIcon` by the time this function is called. <br>

`accountIcon` and `navHelp` will automatically be appended to `accountStatus` right after this function is called.

### Example

```js
renderUIAccountStatus(modIds, accountStatus, accountIcon, navHelp) {
    accountStatus.classList.value = "account-status hidden absolute flex left-10 bottom-3";
    navHelp.setAttribute("action-key", "inline-shell-action-2");
    navHelp.classList.add("absolute", "top-2", "left-2");
    navHelp.classList.toggle("hidden", Network.isWaitingForValidHeartbeat());
}
```

