## Mod Options
Each mod can define and access any custom options specific to that mod. Each option defined by a mod will appear in the `Mods` tab of the game's option menu under a section with the mod's name. Hence, all custom mod options will be under the same tab within the game's option menu. Each option must have an input type, a default value, and a localization key for both the option name and the hover tooltip (i.e. the description).

### Notes
- The `Option` type (along with necessary supporting types) is defined under `/core/ui/options/options-helper.ts`. The most relevant parameter is `currentValue`. Most other parameters can be set manually using the `additionalProperties` arguement of `ModOptions.addOption`.
- Possible values for the an OptionType argument are `OptionType.Editor`, `OptionType.Checkbox`, `OptionType.Dropdown`, `OptionType.Slider`, `OptionType.Stepper`, and `OptionType.Switch`. The `OptionType` enum is defined under `/core/ui/options/model-options.ts`.
- Any `modId` arguement must **exactly** match the modId listed under the mod's associated `.modinfo` file.
- The `ModOptions.addOption(...)` function should be declared in the global scope (i.e. the same level you have your `Privus.defineModClass()` declaration).
- Unlike `Privus`, `ModOptions` must be imported using `import ModOptions from '/privus-api/privus-options-manager.js';`

### Definitions
```ts
ModOptions.addOption(modId : string, optionId : string, inputType : OptionType, nameKey : string, descriptionKey : string, defaultValue : boolean | number | string, additionalProperties? : object);
```
Define an option

<br/>

```ts
Option ModOptions.option(modId : string, optionId : string)
```
Get/set an existing option

### Example
```js
//I want to add a checkbox option called 'show-core' for my mod `example-mods-content` with my given name and description
ModOptions.addOption('example-mods-content', 'show-core', OptionType.Checkbox, "LOC_EXAMPLE_MOD_OPTIONS_SHOW_CORE", "LOC_EXAMPLE_MOD_OPTIONS_SHOW_CORE_DESC", false);
```

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
