```ts
void renderUIGameInfo(modIds: string[], gameInfo: Element);
```

Renders the game information section of the pause menu UI.

### Parameters

`modIds`   &ndash; array containing mod ID strings of mods that have previously called this function <br>
`gameInfo` &ndash; element containing the game info text <br>

### Notes

`gameInfo` may be undefined within the function, in which case changes should not be made to the game info.


### Example

```js
renderUIGameInfo(modIds, gameInfo) {
    if(!gameInfo) return;

    const config = Configuration.getGame();
    const details = [];

    //Age
    const age = GameInfo.Ages.lookup(config.startAgeType)?.Name;
    if (age) 
        details.push(Locale.compose(age));

    //Game speed
    const gameSpeed = GameInfo.GameSpeeds.lookup(config.gameSpeedType)?.Name;
    if (gameSpeed)
        details.push(Locale.compose(gameSpeed));

    //Difficulty
    const difficulty = GameInfo.Difficulties.lookup(config.difficultyType)?.Name;
    if (difficulty)
        details.push(Locale.compose(difficulty));

    //Join game info details together with " | "
    gameInfo.textContent = details.join(" | ");
}
```

