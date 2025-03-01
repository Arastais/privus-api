# Privus Modding API for Civilization VII
An add-on for Sid Meier's Civilization VII that aims to create a simple and unified modding API in order to signficantly ease the modding development process (especially when it comes to UI) and solve a few major problems with the traditional modding process in Civilization VII:

### Compatibility 
The privus API solves the inherent mod incompatiblity by allowing mods to:
- Implement changes to much more specific aspects of the UI
- Be aware of any other mods (through their mod ids) that have implemented the same changes/functions
- Use the default game functionality as desired
- Not have to replace any original files of the base game

<br>

Traditional UI or other script changes involve replacing the entire script file in the base game of whatever aspect of the UI a mod wants to change, even if the mod makes very little modifications. This means that any other mod wanting to make changes to the same part of the UI will not be compatible, as one of the mods will replace the files of the other. Even mods that do not replace any UI script files have no idea of any changes made by other mods, and will still need to override base game functions that have very broad functionality. 

This API instead breaks down major UI functionality into separate functions for each aspect of the UI.

Additionally, any mods using this API will also not conflict with any traditional mods (i.e. any mods not using this api) for the most part - as long as they don't modify `root-game.html`, `root-shell.html` (which is true for most mods), or the `onAttach()` function of any components that Privus has an API implemented for.


### Complexity
The privus API reduces the complexity and tediousness of mod development by allowing modders to only have to implement the exact changes they want and to not have to reimplement **any** of the base game functionality.

<br>

Traditional methods of changing the game's functionality usually means that modders to have to copy original files of the game and make whatever changes they need inside the copied file. These changes can be small and thus hard to keep track of within the mess of the original script file. If a modder takes the function override approach, then they must either resuse the base gmae's functionality in it's entireity, or none at all. Otheriwse, they are stuck partially re-implementing the base game functionality. 

This API instead allows modders to only have type out whatever changes they want to make in a new file and to more precisely use the base game's functionality.

### Legality
The privus API avoids copyright issues by not copying nor distributing any of the base game's source code; Any default/base game functionality is re-implmeneted using original source code.

<br>

The original script files of the game are copyrighted, and thus all rights are reserved. Copying, modifying, and then distrubting the base game's source code (which has to be done in the traditional modding process), as most mods do, violates copyright. While it is in fact extremely unlikely legal action will actually be pursued, one is still technically commiting copyright infringement by doing this. 

This API instead re-implemnents any base game functionality it needs, which allows modders to not have to use any of the game's source code.

There are modding development techniques to not have to replace the base game's script files (which means copying them is not needed either), but such techniques are neither always possible for every aspect of the UI nor are a perfect solution as they can still require re-implementing base game functionality as stated previously. 


## Quickstart

Add the Privus API as a dependency in your modinfo
```xml
<Dependencies>
    <!-- Other dependencies... -->
	<Mod id="privus-api" title="Privus API"/>
</Dependencies>
```
<br>

Import the category of whatever UI component you wish to modify
```js
//I want to modify the pause menu
import PauseMenuCategory from '/privus-api/ui/pause-menu/privus-pause-menu.js';
```
(The file to import from is listed under the component's [API reference](#api-reference))

<br>

Create a class that implements the API your desired functionality
```js
class MyPauseMenu {
    //Other functions...
    
    //I want to change the game info in the pause menu
    renderUIGameInfo(modIds, gameInfo) {
        //...
    }
}
```
(You can see all the API functions you can implement in the [API reference](#api-reference))

<br>

You can get the default/base game functionality at any time with `Privus.defaultFn(...)`
```js
//I want to use the base game's `onEngineInput()` function
this.engineInputListener = Privus.defaultFn(PauseMenuCategory, "onEngineInput").bind(this);
```

<br>

Register your class with the Privus API using your mod's id
```js
Privus.defineModClass('my-mod', PauseMenuCategory, MyPauseMenu);
```


<br>

Repeat the process for any other UI components you want to modify.


## Example

This single script file changes the map seed text and game info text in the pause menu
```js
import PauseMenuCategory from '/privus-api/ui/pause-menu/privus-pause-menu.js';

class ExamplePauseMenu {
    //'root' is the ComponentRoot of this element
    constructor(root) {
        this._root = root;
    }

    //Change the map seed info text
    renderUIMapSeed(modIds, mapSeedInfo) {
        console.info(`[EXAMPLE-PAUSE-MENU] Mods that have already overriden the map seed ui: ${modIds}`);
        
        //You can also get the map seed info using `this._root.querySelector(...)`
        if (!mapSeedInfo) throw new Error('Could not find map seed element!');
        mapSeedInfo.textContent = `<Example Map Seed>`;
    }

    //Change the game info text
    renderUIGameInfo(modIds, gameInfo) {
        console.info(`[EXAMPLE-PAUSE-MENU] Mods that have already overriden the build info ui: ${modIds}`);

        if(!gameInfo) throw new Error('Could not find game info element!');
        gameInfo.textContent = `<Example Game Info>`;
    }
}

// Register our class as this mod's changes to the pause menu
Privus.defineModClass('example', PauseMenuCategory, ExamplePauseMenu);
```

The full example mod can be seen in [examples/pause-menu](examples/pause-menu/)

## API Reference

> The API is currently a work in progress and thus not fully complete. If you wish to see a part of the UI be implemented in this API, feel free to open an issue.

All current API functions and their details are laid out in the [wiki](https://github.com/Arastais/privus-api/wiki)

## Contributing

If you wish to contibute to the API by adding a component, you need to:
- Determine the category key string, and define a variable exporting it
- Create a set of funcitons to be the API for that function
- Implement the functions in a Privus API class for the compoent
- Implement the functions a default class for the base game functionality of the component
- Register the classes with the Privus API
- Document the API functions in the [API reference](#api-reference), following the templates in the wiki
- Create a PR on github with your changes

A proper example can be seen with the [pause menu class](ui/pause-menu/privus-pause-menu.js)