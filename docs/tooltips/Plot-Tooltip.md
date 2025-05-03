`PlotTooltipTypeName` defined in `/privus-api/ui/tooltip/privus-plot-tooltip.js`
<hr>

```ts
void <section_function_name>(modIds: string[], container : HTMLDivElement, yieldsFlexbox : HTMLDivElement, plotInfo : object, keysPressed : object);
```
Render a section and add it to the plot tooltip

> This tooltip type has dividers

### Parameters

`modIds`         &ndash; array containing mod ID strings of mods that have registered this section function <br>
`container`      &ndash; element represeting the main container for the tooltip <br>
`yieldsFlexbox`  &ndash; element represeting the default container for the yields <br>
`plotInfo`       &ndash; object containing all the relevant info for the current plot <br>
`keysPressed`    &ndash; object containing boolean values for if modifier keys (e.g. shift, ctrl) are pressed <br>

### Notes

`plotInfo` is defined as: 
```js
Object.freeze({
    plotCoord:        this.plotCoord,
    plotIndex:        GameplayMap.getIndexFromLocation(this.plotCoord),
    terrainLabel:     this.getTerrainLabel(this.plotCoord),
    terrainType:      GameplayMap.getTerrainType(this.plotCoord.x, this.plotCoord.y),
    terrain:          GameInfo.Terrains.lookup(GameplayMap.getTerrainType(this.plotCoord.x, this.plotCoord.y)),
    biomeLabel:       this.getBiomeLabel(this.plotCoord),
    biomeType:        GameplayMap.getBiomeType(this.plotCoord.x, this.plotCoord.y),
    biome:            GameInfo.Biomes.lookup(GameplayMap.getBiomeType(this.plotCoord.x, this.plotCoord.y)),
    featureLabel:     this.getFeatureLabel(this.plotCoord),
	featureType:      GameplayMap.getFeatureType(this.plotCoord.x, this.plotCoord.y),
    feature:          GameInfo.Features.lookup(GameplayMap.getFeatureType(this.plotCoord.x, this.plotCoord.y)),
    continentName:    this.getContinentName(this.plotCoord),
    riverLabel:       this.getRiverLabel(this.plotCoord),
    riverType:        GameplayMap.getRiverType(this.plotCoord.x, this.plotCoord.y),
    resourceType:     GameplayMap.getResourceType(this.plotCoord.x, this.plotCoord.y),
    resource:         this.getResource(),
    owningPlayerID:   GameplayMap.getOwner(this.plotCoord.x, this.plotCoord.y),
    owningPlayer:     Players.get(GameplayMap.getOwner(this.plotCoord.x, this.plotCoord.y)),
    districtID:       MapCities.getDistrict(this.plotCoord.x, this.plotCoord.y),
    owningCityID:     GameplayMap.getOwningCityFromXY(this.plotCoord.x, this.plotCoord.y),
    specialistsLabel: this.getSpecialistDescription(),
    routeName:        this.getRouteName(),
});
```
Note that `this` refers to the base game instance for the plot tooltip, i.e. `PlotTooltipType` defined in `base-standard/ui/tooltips/plot-toolip.js`

`keysPressed` only has the property `shift` (for now).


### Default Sections

| Section | Function Name | Description | Default Order | Append Divider by Default? |
| --- | --- | --- | --- | --- |
| Settler          | `addSettlerInfo`         | Details about settling on the plot (if the settler lens is active) |  2 | Yes |
| Terrain & Biome  | `addTerrainAndBiomeInfo` | Terrain and biome type of the plot                        |  4 | No  |
| Features         | `addFeatureInfo`         | Any feautres (e.g. river, mountains, etc.) on the plot    |  6 | No  |
| Continent        | `addContinentInfo`       | Name of the continent the plot resides on                 |  8 | No  |
| Districts        | `addDistrictInfo`        | Any disctricts on the plot                                |  8 | No  |
| Yields Container | `addYieldsFlexbox`       | Creates the container for the yields (`yieldsFlexbox`)    | 10 | No  |
| Yields           | `addYields`              | List of yields of the plot                                | 12 | No  |
| Specialists      | `addSpecialistInfo`      | Any specialists on the plot                               | 14 | No  |
| Owner            | `addOwnerInfo`           | Owner of the plot                                         | 16 | No  |
| Resource         | `addResourceInfo`        | Any special resource (e.g. sugar, corn, etc.) on the plot | 18 | No  |
| Constructibles   | `addConstructibleInfo`   | Any player-made constructibles/buildings on the plot      | 20 | No  |
| Effects          | `addEffectInfo`          | Any miscellaneous effects on the plot                     | 22 | Yes<sup>1</sup> |
| Trade Routes     | `addTradeRouteInfo`      | Name of any trade routes involving the plot               | 24 | No  |
| Units            | `addUnitInfo`            | Any units on the plot                                     | 26 | No  |

<sup>1</sup>Only if the plot has an active trade route


### Example
```js
import PrivusTooltips from '/privus-api/ui/privus-tooltips.js';
import PlotTooltipTypeName from '/privus-api/ui/tooltip/privus-plot-tooltip.js';

class ExamplePlotTooltip {
    addContinentInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if (!plotInfo.continentName) return;
        
        const tooltipThirdLine = document.createElement("div");
        tooltipThirdLine.classList.add("plot-tooltip__line");
        tooltipThirdLine.setAttribute('data-l10n-id', plotInfo.riverLabel ? 
            Locale.compose('{1_ContinentName} {LOC_PLOT_DIVIDER_DOT} {2_RiverName}', plotInfo.continentName, plotInfo.riverLabel) : 
            plotInfo.continentName);
        container.appendChild(tooltipThirdLine);

        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) throw new Error("[EXAMPLE][PLOT-TOOLTIP] Cannot update continent tooltip: no valid local player!");
        const isDistantLands = localPlayer.isDistantLands(plotInfo.plotCoord);

        const landsLine = document.createElement("div");
        landsLine.classList.add("plot-tooltip__line");
        landsLine.setAttribute('data-l10n-id', "LOC_PLOT_TOOLTIP_HEMISPHERE_" + (isDistantLands ? "WEST" : "EAST"));
        container.appendChild(landsLine);
    }

    addYieldsFlexbox(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        yieldsFlexbox.classList.add("plot-tooltip__resourcesFlex");
        container.appendChild(yieldsFlexbox);
    }

    addSpecialistInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if (plotInfo.specialistsLabel == "") return;

        const specialistText = document.createElement("div");
        specialistText.classList.add("text-center");
        specialistText.innerHTML = plotInfo.specialistsLabel;
        container.appendChild(specialistText);
    }

    addCoordinateInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;

        const toolTipCoordinates = document.createElement("div");
        toolTipCoordinates.setAttribute('data-l10n-id', Locale.compose("LOC_EXAMPLE_PLOT_TOOLTIP_COORDINATES", plotInfo.plotCoord.x, plotInfo.plotCoord.y));
        toolTipCoordinates.classList.add('text-2xs', 'text-center');
        container.appendChild(toolTipCoordinates);
    }
}

//All other section functions that aren't registered here will use their associated default functions (if they exist)
//Orders are overrided just below using `setSectionOrders(...)`
PrivusTooltips.registerModdedSections(PlotTooltipTypeName, 'example-plot-tooltip-tcs', ExamplePlotTooltipTCS, 
    'addYieldsFlexbox',  //Order: 12 [default]
    'addSpecialistInfo', //Order: 16 [default]
    'addContinentInfo',  //Order: 29 (right after `addUnitInfo`) [default is 8]
    'addCoordinateInfo'  //Order: 30 (right after `addContinentInfo`] [no default] 
);

//Set the order for our custom section function
//Move continent info closer to the bottom

PrivusTooltips.setSectionOrders(PlotTooltipTypeName, {
    addContinentInfo: 29,
    addCoordinateInfo: 32
});
```