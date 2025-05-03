> `PrivusControls` does not require an import

## Registering a Component Class
Every component class of a mod that is using the Privus API and wants to be included in the game needs to be registered using this function.

### Definition
```ts
void PrivusControls.defineModClass(modId : string, category : string, componentClass : object);
```
Register a class of your mod with the Privus API using the mod's ID, the category, and the class itself.

> The `modId` *should* be the exact mod id in your modinfo file, although (unlike with [`ModOptions`](Global#mod-options)), it does not have to be - it only needs to be consistent throughout your mod.

### Example
```js
// Register our class as this mod's changes to the pause menu
PrivusControls.defineModClass('my-example-mod', MainMenuCategory, ExampleMainMenu);
```


## Data Members
Some components within the API have public data members which are accessible by the modder. Note that not all data members have both a set and get available; The availablility of a setter and/or getter for a data member will be listed under the API reference for the data member.

### Definitions
```ts
any PrivusControls.getMember(category : string, memberName : string)
```
```ts
void PrivusControls.setMember(category : string, memberName : string, value : any)
```

### Example
```js
//I want to get/set the handle of the currently selected mod
this.selectedHandle = PrivusControls.getMember(ModsContentCategory, "selectedModHandle");
PrivusControls.setMember(ModsContentCategory, "selectedModHandle", 0);
```


## Default Functions
Each API function has a default functionality, so it is possible to retrieve the associated default function, but it will not be binded to any instance.

### Definition
```ts
function PrivusControls.defaultFn(category : string, functionName : string);
```
Get the unbounded default function for a given category

> Note that the default functions for components **do not** have `modIds` as a first parameter. Thus, the signature is the same minus the first argument. See the [instances example](#instances) for an example of this. 

### Example
You can get the default/base game functionality at any time with `PrivusControls.defaultFn(...)`
```js
//I want to get the base game's `onEngineInput()` function
this.engineInputFn = PrivusControls.defaultFn(PauseMenuCategory, "onEngineInput");
```


## Instances
Each component category has an API instance which contains all the API members and functions. The default instance is mainly used in mods when calling default functionality.

### Definition
```ts
object PrivusControls.getInstance(category : string);
```
Get the asssociated API instance

### Example
```js
renderUIMapSeed(modIds, mapSeedInfo) {
    //I want to call the default functionality for the `renderUIMapSeed(...)` function
    //(Note the lack of the modIds argument)
    PrivusControls.defaultFn(PauseMenuCategory, 'renderUIMapSeed').call(PrivusControls.getInstance(PauseMenuCategory), mapSeedInfo);
}
```


## Component Categories (API Reference)
[**Main Menu**](Main-Menu) <br/>
&nbsp;&nbsp;&nbsp;&nbsp;[**Additional Content**](Additional-Content) <br/>
&nbsp;&nbsp;&nbsp;&nbsp;[**Mods Content**](Mods-Content) <br/>
[**Pause Menu**](Pause-Menu)