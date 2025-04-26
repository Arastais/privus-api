import PrivusTooltips from '/privus-api/ui/privus-tooltips.js';
import LensManager from '/core/ui/lenses/lens-manager.js';

const PlotTooltipTypeName = 'plot';

class PrivusPlotTooltipType {
    constructor() {
        this.plotCoord = null;
        this.isShowingDebug = false;
        this.currentAge = GameInfo.Ages.lookup(Game.age)?.ChronologyIndex ?? 0;
        this.agelessTypes = new Set(GameInfo.TypeTags.filter(e => e.Tag == "AGELESS").map(e => e.Type));

        this.container = document.createElement('div');
        this.tooltip = document.createElement('fxs-tooltip');
        this.tooltip.classList.add('plot-tooltip', 'max-w-96');
        this.tooltip.appendChild(this.container);
        this.yieldsFlexbox = document.createElement('div');

        this.keysPressed = {
            shift: false
        }

        Loading.runWhenFinished(() => {
            for (const y of GameInfo.Yields) {
                const url = UI.getIcon(`${y.YieldType}`, "YIELD");
                Controls.preloadImage(url, 'plot-tooltip');
            }
        });
    }

    isUpdateNeeded(plotCoord) {
        const defaultUpdate = PrivusTooltips.baseFn(PlotTooltipTypeName, "isUpdateNeeded").call(this, plotCoord);
        const shiftKey = Input.isShiftDown();
        const oldShiftKey = this.keysPressed.shift;
        this.keysPressed.shift = shiftKey;

        if(defaultUpdate || oldShiftKey !== shiftKey) return true;

		return false;
    }

    update() {
        if (this.plotCoord == null) throw new Error("[PRIVUS][PLOT-TOOLTIP] Unable to read plot coordinates");

        this.isShowingDebug = UI.isDebugPlotInfoVisible(); // Ensure debug status hasn't changed

        // Obtain plot info
        const plotInfo = Object.freeze({
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

        for(const sectionFn of PrivusTooltips.getSectionFns(PlotTooltipTypeName)) {
            const sectionFnName = sectionFn.name.substring(6);
            sectionFn.call(undefined, PrivusTooltips.getModIds(PlotTooltipTypeName, sectionFnName), this.container, this.yieldsFlexbox, plotInfo, this.keysPressed);
            if(PrivusTooltips.getShouldAppendDivider(PlotTooltipTypeName, sectionFnName) === true)
                this.appendDivider();
        }

        UI.setPlotLocation(this.plotCoord.x, this.plotCoord.y, plotInfo.plotIndex);

        // Adjust cursor between normal and red based on the plot owner's hostility
        this.adjustCursor();
        
        //debug info
        if (!this.isShowingDebug) return;

        const tooltipDebugFlexbox = document.createElement("div");
        tooltipDebugFlexbox.classList.add("plot-tooltip__debug-flexbox");
        this.container.appendChild(tooltipDebugFlexbox);
        this.appendDivider();

        const currHp = Players.Districts.get(plotInfo.owningPlayerID)?.getDistrictHealth(this.plotCoord);
        const maxHp = Players.Districts.get(plotInfo.owningPlayerID)?.getDistrictMaxHealth(this.plotCoord);
        const toolTipDebugTitle = document.createElement("div");
        toolTipDebugTitle.classList.add("plot-tooltip__debug-title-text");
        const hasHp = (currHp != undefined && currHp != 0) && (maxHp != undefined && maxHp != 0);
        tooltipDebugFlexbox.appendChild(toolTipDebugTitle);
        toolTipDebugTitle.innerHTML = Locale.compose("LOC_PLOT_TOOLTIP_DEBUG_TITLE") + ":" + (hasHp ? (" " + currHp + " / " + maxHp) : "");

        const toolTipDebugPlotCoord = document.createElement("div");
        toolTipDebugPlotCoord.classList.add("plot-tooltip__coordinate-text");
        toolTipDebugPlotCoord.innerHTML = Locale.compose("LOC_PLOT_TOOLTIP_PLOT") + `: (${this.plotCoord.x},${this.plotCoord.y})`;
        tooltipDebugFlexbox.appendChild(toolTipDebugPlotCoord);

        const toolTipDebugPlotIndex = document.createElement("div");
        toolTipDebugPlotIndex.classList.add("plot-tooltip__coordinate-text");
        toolTipDebugPlotIndex.innerHTML = Locale.compose("LOC_PLOT_TOOLTIP_INDEX") + `: ${plotIndex}`;
        tooltipDebugFlexbox.appendChild(toolTipDebugPlotIndex); 
    }
    

    adjustCursor() {
        if (UI.isCursorLocked()) return;
        
        const localPlayerID = GameContext.localPlayerID;
        const topUnit = this.getTopUnit(this.plotCoord);
        const owningPlayerID = topUnit ? topUnit.owner : GameplayMap.getOwner(this.plotCoord.x, this.plotCoord.y);
        let showHostileCursor = false;

        if (Players.isValid(localPlayerID) && Players.isValid(owningPlayerID) && (GameplayMap.getRevealedState(localPlayerID, this.plotCoord.x, this.plotCoord.y) == RevealedStates.VISIBLE)) {
            const owningPlayer = Players.get(owningPlayerID);
            // Is it an independent?
            if (owningPlayer?.isIndependent) {
                const independentID = topUnit ? 
                    Game.IndependentPowers.getIndependentPlayerIDFromUnit(topUnit.id) : 
                    Game.IndependentPowers.getIndependentPlayerIDAt(this.plotCoord.x, this.plotCoord.y);

                if (independentID != PlayerIds.NO_PLAYER) 
                    showHostileCursor = (Game.IndependentPowers.getIndependentRelationship(independentID, localPlayerID) == IndependentRelationship.HOSTILE);
            } else {
                const hasHiddenUnit = topUnit?.hasHiddenVisibility;
                const localPlayer = Players.get(localPlayerID);
                if (localPlayer) {
                    const localPlayerDiplomacy = localPlayer.Diplomacy;
                    showHostileCursor = localPlayerDiplomacy && localPlayerDiplomacy.isAtWarWith(owningPlayerID) && !hasHiddenUnit;
                }
            }
        }
            
        UI.setCursorByType(showHostileCursor ? UIHTMLCursorTypes.Enemy : UIHTMLCursorTypes.Default);
    }


    addSettlerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if (LensManager.getActiveLens() != "fxs-settler-lens")  return;

        //Add more details to the tooltip if we are in the settler lens
        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update settler tooltip: no valid local player!");
        const localPlayerDiplomacy = localPlayer?.Diplomacy;
        if (localPlayerDiplomacy === undefined) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update settler tooltip: no valid local player Diplomacy object!");

        //Don't add any extra tooltip to mountains, oceans, or navigable rivers
        if (GameplayMap.isWater(this.plotCoord.x, this.plotCoord.y) || GameplayMap.isImpassable(this.plotCoord.x, this.plotCoord.y) || GameplayMap.isNavigableRiver(this.plotCoord.x, this.plotCoord.y)) return;
            
        const settlerTooltip = document.createElement("div");
        settlerTooltip.classList.add("plot-tooltip__settler-tooltip");
        const localPlayerAdvancedStart = localPlayer?.AdvancedStart;
        if (localPlayerAdvancedStart === undefined) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update settler tooltip: no valid local player advanced start object!");

        //Show why we can't settle here
        const settleErrors = {
            tooFar: !GameplayMap.isPlotInAdvancedStartRegion(GameContext.localPlayerID, this.plotCoord.x, this.plotCoord.y) && !localPlayerAdvancedStart?.getPlacementComplete(),
            tooCloseToCity: !localPlayerDiplomacy.isValidLandClaimLocation(this.plotCoord, true) && GameplayMap.isCityWithinMinimumDistance(this.plotCoord.x, this.plotCoord.y),
            blockingResource: !localPlayerDiplomacy.isValidLandClaimLocation(this.plotCoord, true) && GameplayMap.getResourceType(this.plotCoord.x, this.plotCoord.y) != ResourceTypes.NO_RESOURCE,
            noFreshWater: !GameplayMap.isFreshWater(this.plotCoord.x, this.plotCoord.y)
        }
        const settleErrorLocaleKeys = {
            tooFar: "LOC_PLOT_TOOLTIP_CANT_SETTLE_TOO_FAR",
            tooCloseToCity: "LOC_PLOT_TOOLTIP_CANT_SETTLE_TOO_CLOSE",
            blockingResource: "LOC_PLOT_TOOLTIP_CANT_SETTLE_RESOURCES",
            noFreshWater: "LOC_PLOT_TOOLTIP_NO_FRESH_WATER",
        }

        for(const [key, err] of Object.entries(settleErrors)) {
            if(err !== true) continue;
            settlerTooltip.classList.add(key === 'noFreshWater' ? "okay-location" : "blocked-location");
            settlerTooltip.innerHTML = Locale.compose(settleErrorLocaleKeys[key]);
            break;
        }
        PrivusTooltips.setAppendDivider(PlotTooltipTypeName, 'addSettlerInfo');
        container.appendChild(settlerTooltip);
    }

    addTerrainAndBiomeInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        const tooltipFirstLine = document.createElement("div");
        tooltipFirstLine.classList.add('text-secondary', 'text-center', 'uppercase', 'font-title');
        tooltipFirstLine.setAttribute('data-l10n-id', plotInfo.biomeLabel ? 
            Locale.compose("{1_TerrainName} {2_BiomeName}", plotInfo.terrainLabel, plotInfo.biomeLabel) :
            plotInfo.terrainLabel);
            
        container.appendChild(tooltipFirstLine);
    }

    addFeatureInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if (!plotInfo.featureLabel) return;

        const tooltipSecondLine = document.createElement("div");
        tooltipSecondLine.classList.add("plot-tooltip__line");
        tooltipSecondLine.setAttribute('data-l10n-id', plotInfo.featureLabel);
        container.appendChild(tooltipSecondLine);
    }

    addContinentInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if (!plotInfo.continentName) return;
        
        const tooltipThirdLine = document.createElement("div");
        tooltipThirdLine.classList.add("plot-tooltip__line");
        tooltipThirdLine.setAttribute('data-l10n-id', plotInfo.riverLabel ? 
            Locale.compose('{1_ContinentName} {LOC_PLOT_DIVIDER_DOT} {2_RiverName}', plotInfo.continentName, plotInfo.riverLabel) : 
            plotInfo.continentName);
        container.appendChild(tooltipThirdLine);

        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update continent tooltip: no valid local player!");
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

    addResourceInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(!plotInfo.resource) return;

        const tooltipIndividualYieldFlex = document.createElement("div");
        tooltipIndividualYieldFlex.classList.add("plot-tooltip__IndividualYieldFlex");
        yieldsFlexbox.appendChild(tooltipIndividualYieldFlex);

        const toolTipResourceIconCSS = UI.getIconCSS(plotInfo.resource.ResourceType);
        const yieldIconShadow = document.createElement("div");
        yieldIconShadow.classList.add("plot-tooltip__IndividualYieldIcons-Shadow");
        yieldIconShadow.style.backgroundImage = toolTipResourceIconCSS;
        tooltipIndividualYieldFlex.appendChild(yieldIconShadow);

        const yieldIcon = document.createElement("div");
        yieldIcon.classList.add("plot-tooltip__IndividualYieldIcons");
        yieldIcon.style.backgroundImage = toolTipResourceIconCSS;
        yieldIconShadow.appendChild(yieldIcon);

        const toolTipIndividualYieldValues = document.createElement("div");
        toolTipIndividualYieldValues.classList.add("plot-tooltip__IndividualYieldValues", "font-body");
        toolTipIndividualYieldValues.innerHTML = "1";
        tooltipIndividualYieldFlex.appendChild(toolTipIndividualYieldValues);

        const additionalText = [];
        additionalText.push(Locale.stylize("LOC_RESOURCECLASS_TOOLTIP_NAME", Locale.compose("LOC_" + plotInfo.resource.ResourceClassType + "_NAME")));
        additionalText.push(Locale.stylize(plotInfo.resource.Tooltip));
        this.appendTooltipInformation(plotInfo.resource.Name, additionalText, toolTipResourceIconCSS);

        
        if (plotInfo.resource.ResourceClassType != "RESOURCECLASS_TREASURE") return;
        
        this.appendHeaderDivider(Locale.stylize("LOC_UI_CITY_DETAILS_TREASURE_FLEET"));
        const treasureFleetText = document.createElement('div');
        treasureFleetText.setAttribute('data-l10n-id', 'LOC_CAN_CREATE_TREASURE_FLEET');
        container.appendChild(treasureFleetText);

        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update resource tooltip: no valid local player!");
        if (localPlayer.isDistantLands(plotInfo.plotCoord)) return;

        const treasureFleetWillSpawnText = document.createElement('div');
        treasureFleetWillSpawnText.setAttribute('data-l10n-id', 'LOC_UI_TOOPTIP_TREASURE_HOMELANDS');
        treasureFleetWillSpawnText.classList.add("text-negative");
        container.appendChild(treasureFleetWillSpawnText);

    }

    addTradeRouteInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if (!plotInfo.routeName) return;

        const toolTipRouteInfo = document.createElement("div");
        toolTipRouteInfo.classList.add("plot-tooltip__trade-route-info");
        toolTipRouteInfo.innerHTML = plotInfo.routeName;
        container.appendChild(toolTipRouteInfo);
    }


    /* Wrapper Functions */
    addDistrictInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        return PrivusTooltips.baseFn(PlotTooltipTypeName, 'addPlotDistrictInformation').call(this, plotInfo.plotCoord);
    }

    addYields(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        return PrivusTooltips.baseFn(PlotTooltipTypeName, 'addPlotYields').call(this, plotInfo.plotCoord, GameContext.localPlayerID);
    }

    addOwnerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        return PrivusTooltips.baseFn(PlotTooltipTypeName, 'addOwnerInfo').call(this, plotInfo.plotCoord, plotInfo.owningPlayerID);
    }

    addConstructibleInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        return PrivusTooltips.baseFn(PlotTooltipTypeName, 'addConstructibleInformation').call(this, plotInfo.plotCoord);
    }

    addEffectInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        PrivusTooltips.setAppendDivider(PlotTooltipTypeName, 'addEffectInfo', plotInfo.routeName);
        return PrivusTooltips.baseFn(PlotTooltipTypeName, 'addPlotEffectNames').call(this, plotInfo.plotIndex);
    }

    addUnitInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        return PrivusTooltips.baseFn(PlotTooltipTypeName, 'addUnitInfo').call(this, plotInfo.plotCoord);
    }
}

PrivusTooltips.registerPrivusType(PlotTooltipTypeName, PrivusPlotTooltipType);
PrivusTooltips.registerPrivusSections(PlotTooltipTypeName, 
    'addSettlerInfo',         //Default Order: 2
    'addTerrainAndBiomeInfo', //Default Order: 4
    'addFeatureInfo',         //Default Order: 6
    'addContinentInfo',       //Default Order: 8
    'addDistrictInfo',        //Default Order: 10
    'addYieldsFlexbox',       //Default Order: 12
    'addYields',              //Default Order: 14
    'addSpecialistInfo',      //Default Order: 16
    'addOwnerInfo',           //Default Order: 18
    'addResourceInfo',        //Default Order: 20
    'addConstructibleInfo',   //Default Order: 22
    'addEffectInfo',          //Default Order: 24
    'addTradeRouteInfo',      //Default Order: 26
    'addUnitInfo'             //Default Order: 28
);

export {PlotTooltipTypeName as default};
