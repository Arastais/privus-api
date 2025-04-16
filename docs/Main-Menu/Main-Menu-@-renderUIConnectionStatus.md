```ts
void renderUIConnectionStatus(modIds: string[], connectionStatus: HTMLElement);
```

Renders the connection status section of the main menu UI

### Parameters

`modIds`           &ndash; array containing mod ID strings of mods that have previously called this function <br>
`connectionStatus` &ndash; element representing the connection status section <br>

### Example

```js
renderUIConnectionStatus(modIds, connectionStatus) {
    connectionStatus.role = "status";
    connectionStatus.classList.value = "connection-status hidden absolute flex bottom-8 left-32";
}
```

