```js
import PrivusTooltips from '/privus-api/ui/privus-tooltips.js';
```

## Registering Tooltip Sections
Tooltips are created in the Privus API by combining each "section" to form a single tooltip. Each section repesents a different fundamental part of the tooltip and is defined by a tooltip class' associated section function. All section functions for a given tooltip type have the same signature, and all section functions for any tooltip type always have `modIds` (a list of mods that implement the given function) as the first parameter.

Thus, for a mod to create a tooltip, its section functions must be registered by the Privus API. The section functions for a given tooltip type are listed under the tooltip type's [API reference](#tooltip-types-api-reference). 

Any section that does not have an associated section function from a mod is instead created using the respective base game's section function, if it exists (i.e., if no mod registers a function for a given section, then Privus API will replicate whatever the base game does for that tooltip section).

### Definition
```ts
void PrivusTooltips.registerModdedSections(tooltipTypeName : string, modId : string, modClass : object, ...sectionFunctionNames : string[]);
```
Register tooltip sections of your mod using the name of the tooltip type, the mod's ID, the class with the section functions, and a list containing the names of the section functions to register.

> The `modId` argument is only used as part of the list of mods (i.e. the `modIds` parameter) that implement a given function

### Example
```js
class ExamplePlotTooltip {
    constructor() { /*...*/ }

    addSettlerInfo(modIds, ...args) {
        //...
    }
    addTerrainAndBiomeInfo(modIds, ...args) {
        //...
    }
    addUnitInfo(modIds, ...args) {
        //...
    }
    addCoordinateInfo(modIds, ...args) {
        //...
    }
}

// Register our class as this mod's changes to the plot tooltip
PrivusTooltips.registerPrivusSections(PlotTooltipTypeName, 'example-plot-tooltip', ExamplePlotTooltip,
    'addSettlerInfo',
    'addTerrainAndBiomeInfo',
    'addUnitInfo'
    'addCoordinateInfo' //This function is not part of the base game, but I can still add it.
);
```


## Setting the Order of Tooltip Sections
Each section of a tooltip is rendered in a specific order. By default, this is the same order that the base game renders each section of the tooltip. 

More specifically, each section is given a specific order value (i.e. an index value of some sorts) so that each section is rendered in ascending order (e.g. a section with order 2 will be rendered before one with order 5). The default values for the order of each section function of a tooltip can be found in the tooltip's [API reference](#tooltip-types-api-reference).

> If a section function that is registered by a mod does not exist within the base game, it is given an order value of 0 by default.

One can change/override the order of any section function using `PrivusTooltips.setSectionOrders(...)`. Only the sections which you wish to override need to be specified. 

> Note that the order of a section is **global**, so changing it will affect the ordering of all other mods and the base game for that given tooltip section function

### Definition
```ts
void PrivusTooltips.setSectionOrders(modId : string, category : string, componentClass : object);
```
Register a class of your mod with the Privus API using the mod's ID, the category, and the class itself.

> The `modId` should be the exact mod id in your modinfo file, although (unlike with [`ModOptions`](Global#mod-options)), it does not have to be - it only needs to be consistent throughout your mod.

### Example
```js
// Based on the example just above
PrivusTooltips.setSectionOrders(PlotTooltipTypeName, {
    addTerrainAndBiomeInfo: 0, //"Move" the terrain and biome info to the top of the tooltip
    addCoordinateInfo: 30 //Make our custom section function be at the end of the tooltip
});
```


## Default Functions
Each API function has a default functionality, so it is possible to retrieve the associated default function, but it will not be binded to any instance.

### Definition
```ts
function PrivusTooltips.defaultFn(tooltipType : string, functionName : string);
```
Get the unbounded default function for a given tooltip type

### Example
You can get the default/base game functionality at any time with `PrivusTooltips.defaultFn(...)`
```js
//I want to use the base game's `onEngineInput()` function
this.defaultOwnerInfoFn = PrivusTooltips.defaultFn(PlotTooltipTypeName, "addOwnerInfo");
```


## Instances
Each tooltip type has an API instance which contains all the API members and functions. The default instance is mainly used in mods when calling default functionality.

### Definition
```ts
object PrivusTooltips.getInstance(catooltipTypetegory : string);
```
Get the asssociated API instance

### Example
```js
addSettlerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
    if(keysPressed.shift) return;
    //I want to call the default functionality for the `addSettlerInfo(...)` function
    PrivusTooltips.defaultFn(PlotTooltipTypeName, "addSettlerInfo").call(PrivusTooltips.getInstance(PlotTooltipTypeName), modIds, container, yieldsFlexbox, plotInfo, keysPressed);
}
```


## Adding Dividers
Some tooltip types have access to dividers. Dividers are horionztal rules (i.e. the horionztal line you see on some tooltips) between sections. 

> If a tooltip type has access to dividers, it will be listed under that tooltip type's [API reference](#tooltip-types-api-reference), along with what sections have dividers appended to them by default.

You can set whether or not to append a divider after a section with `PrivusTooltips.setAppendDivider(...)`. For the value of `setAppendDivider()` to actually be applied to a section, it must be called/declared before the associated section function finishes execution.

### Definition
```ts
void PrivusTooltips.setAppendDivider(tooltipType : string, sectionFunctionName : string, value : boolean? = true)
```

### Example
```js
class ExamplePlotTooltip {
    addSettlerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        //valid - called wihtin the function, i.e. before the function is finished executing
        PrivusTooltips.setAppendDivider(PlotTooltipTypeName, 'addSettlerInfo', keysPressed.shift);
    }
    
    addTerrainAndBiomeInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        //invalid - `addTerrainAndBiomeInfo` is executed after `addSettlerInfo`, so this is called too late and thus has no effect
        PrivusTooltips.setAppendDivider(PlotTooltipTypeName, 'addSettlerInfo', false);
    }

    //...
}

//valid - global scope means this is called when the script file loads
PrivusTooltips.setAppendDivider(PlotTooltipTypeName, 'addSettlerInfo', false);
```

## Tooltip Types (API Reference)
[**Plot**](Plot-Tooltip) <br/>