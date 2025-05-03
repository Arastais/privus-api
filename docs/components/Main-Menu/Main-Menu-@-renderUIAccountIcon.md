```ts
void renderUIAccountIcon(modIds: string[], accountIcon: HTMLElement, activatable: HTMLElement);
```

Renders the 2K account status icon of the main menu UI

### Parameters

`modIds`      &ndash; array containing mod ID strings of mods that have previously called this function <br>
`accountIcon` &ndash; element representing the 2K icon image <br>
`activatable` &ndash; element representing the interactable button of the 2K icon <br>


### Example

```js
renderUIAccountIcon(modIds, accountIcon, activatable) {
    accountIcon.classList.add("account-icon-img", "pointer-events-none", "flex", "relative", "flex-col", "justify-center", "align-center", "bg-contain", "bg-center", "bg-no-repeat", "w-28", "h-28");
    accountIcon.setAttribute("data-audio-press-ref", "data-audio-primary-button-press");
    Privs.defaultFn(MainMenuCategory, "setAccountIcon").call(this, Privs.defaultFn(MainMenuCategory, "isFullAccountLinkedAndConnected").call(this));
    
    activatable.classList.add("absolute", "inset-6");
    if (!Network.isWaitingForValidHeartbeat()) {
        activatable.addEventListener('action-activate', this.accountIconListener);
        return;
    }
    accountIcon.style.backgroundImage = "url('fs://game/core/ui/themes/default/img/my2k_connecting.png')";
    accountIcon.setAttribute("data-tooltip-content", Locale.compose("LOC_UI_WAITING_SPOP_HEARTBEAT_OK"));
}
```

