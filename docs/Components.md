> `PrivusControls` does not require an import

## Default Functions
Each API function has a default functionality, so it is possible to retrieve the associated default function, but it will not be binded to any instance.

### Definition
```ts
function Privus.defaultFn(category : string, functionName : string);
```

### Example
You can get the default/base game functionality at any time with `Privus.defaultFn(...)`
```js
//I want to use the base game's `onEngineInput()` function
this.engineInputFn = Privus.defaultFn(PauseMenuCategory, "onEngineInput");
```

## Instances
Each component category has an API instance which contains all the API members and functions. The default instance is mainly used in mods when calling default functionality.

### Definition
```ts
object Privus.getInstance(category : string);
```
Get the asssociated API instance

### Example
```js
//I want to call the default functionality for the `onRecieveFocus()` function
Privus.defaultFn(PauseMenuCategory, "onRecieveFocus").call(Privus.getInstance(PauseMenuCategory));
```

## Data Members
Some components within the API have public data members which are accessible by the modder. Note that not all data members have both a set and get available; The availablility of a setter and/or getter for a data member will be listed under the API reference for the data member.

### Definitions
```ts
any Privus.getMember(category : string, memberName : string)
```
```ts
void Privus.setMember(category : string, memberName : string, value : any)
```

### Example
```js
//I want to get/set the handle of the currently selected mod
this.selectedHandle = Privus.getMember(ModsContentCategory, "selectedModHandle");
Privus.setMember(ModsContentCategory, "selectedModHandle", 0);
```
