```ts
void renderUIConnectionIcon(modIds: string[], connectionIcon: HTMLElement);
```

<hr>

Renders the connection status icon of the main menu UI

### Parameters

`modIds`         &ndash; array containing mod ID strings of mods that have previously called this function <br>
`connectionIcon` &ndash; element representing the connection status icon <br>


### Example

```js
renderUIConnectionIcon(modIds, connectionIcon) {
    const connected = Network.isConnectedToNetwork() && Network.isConnectedToSSO() || Network.isAuthenticated();
    connectionIcon.classList.add("connection-icon-img", "pointer-events-auto", "flex", "relative", "flex-col", "justify-center");
    connectionIcon.classList.add("align-center", "bg-contain", "bg-center", "bg-no-repeat", "w-18", "h-18");
    connectionIcon.style.backgroundImage = "url('fs://game/core/ui/themes/default/img/mp_" + (connected ? "dis" : "") + "connected.png')";
    connectionIcon.setAttribute("data-tooltip-content", "LOC_UI_CONNECTION_" + (connected ? "OK" : "FAILED"));
}
```

