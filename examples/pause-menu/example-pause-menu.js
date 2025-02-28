//Get the pause menu category from Privus API
import PauseMenuCategory from '/privus-api/ui/pause-menu/privus-pause-menu.js';

class ExamplePauseMenu {
    constructor(root) {
        this._root = root;
    }

    //Change the map seed info text
    initUIMapSeed(modIds, mapSeedInfo) {
        console.info(`[EXAMPLE-PAUSE-MENU] Mods that have already overriden the map seed ui: ${modIds}`);
        
        if (!mapSeedInfo) throw new Error('Could not find map seed element!');
        mapSeedInfo.textContent = `<Example Map Seed>`;
    }

    //Change the game info text
    initUIGameInfo(modIds, gameInfo) {
        console.info(`[EXAMPLE-PAUSE-MENU] Mods that have already overriden the build info ui: ${modIds}`);

        if(!gameInfo) throw new Error('Could not find game info element!');
        gameInfo.textContent = `<Example Game Info>`;
    }
}

// Register our class as this mod's changes to the pause menu
Privus.defineModClass('example', PauseMenuCategory, ExamplePauseMenu);