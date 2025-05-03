//Get the plot tooltip name from Privus API
import PrivusTooltips from '/privus-api/ui/privus-tooltips';
import PlotTooltipTypeName from '/privus-api/ui/tooltip/privus-plot-tooltip.js';


class ExamplePlotTooltipTrix {
    constructor() {
        this.effectTexts = [];
        this.headerBanners = 0;
        this.geoContainer = document.createElement("div");
        this.geoContainer.classList.add("text-xs","leading-snug","text-center");

        this.colors = Object.freeze({
            // game colors
            silver: "#4c5366",  // = primary
            bronze: "#e5d2ac",  // = secondary
            primary: "#4c5366",
            secondary: "#e5d2ac",
            accent: "#616266",
            accent1: "#e5e5e5",
            accent2: "#c2c4cc",
            accent3: "#9da0a6",
            accent4: "#85878c",
            accent5: "#616266",
            accent6: "#05070d",
            // alert colors
            black: "#000000",
            danger: "#af1b1c99",  // danger = militaristic 60% opacity
            caution: "#cea92f",  // caution = healthbar-medium
            note: "#ff800033",  // note = orange 20% opacity
            // geographic colors
            hill: "#ff800033",  // Rough terrain = orange 20% opacity
            vegetated: "#aaff0033",  // Vegetated features = green 20% opacity
            wet: "#55aaff66",  // Wet features = teal 60% opacity
            road: "#e5d2accc",  // Roads & Railroads = bronze 80% opacity
            // yield types
            food: "#80b34d",        //  90° 40 50 green
            production: "#a33d29",  //  10° 60 40 red
            gold: "#f6ce55",        //  45° 90 65 yellow
            science: "#6ca6e0",     // 210° 65 65 cyan
            culture: "#5c5cd6",     // 240° 60 60 violet
            happiness: "#f5993d",   //  30° 90 60 orange
            diplomacy: "#afb7cf",   // 225° 25 75 gray
            // independent power types
            militaristic: "#af1b1c",
            scientific: "#4d7c96",
            economic: "#ffd553",
            cultural: "#892bb3",
        });
        this.alertStyles = Object.freeze({
            primary: { "background-color": this.colors.primary },
            secondary: { "background-color": this.colors.secondary, "color": this.colors.black },
            black: { "background-color": this.colors.black },
            danger: { "background-color": this.colors.danger },
            enemy: { "background-color": this.colors.danger },
            conqueror: { "background-color": this.colors.danger, "color": this.colors.caution },
            caution: { "background-color": this.colors.caution, "color": this.colors.black },
            note: { "background-color": this.colors.note },
            DEBUG: { "background-color": "#80808080" },
        });
        this.terrainStyles = Object.freeze({
            road: { "background-color": this.colors.road, "color": this.colors.black },
            volcano: this.alertStyles.caution,
            // obstacle types
            TERRAIN_HILL: { "background-color": this.colors.hill },
            TERRAIN_OCEAN: {},  // don't need to highlight this
            FEATURE_CLASS_VEGETATED: { "background-color": this.colors.vegetated },
            FEATURE_CLASS_WET: { "background-color": this.colors.wet },
            RIVER_MINOR: { "background-color": this.colors.wet },
            RIVER_NAVIGABLE: { "background-color": this.colors.wet },
        });
        
    }

    /* Helper Functions */
    setStyle(element, style, ...extraClasses) {
        if(extraClasses.length > 0)
            element.classList.add(...extraClasses);
        for (const [key, value] of Object.entries(style))
            element.style.setProperty(key, value);
    }

    getStyleFor(terrainType, fallbackType = undefined) {
        return ([terrainType, fallbackType].find(t => t in this.terrainStyles)) ?? this.alertStyles.caution;
    }

    isValidObstacle(terrainType) {
        if(this.movementObstaces) return this.movementObstaces.has(terrainType);
            
        this.movementObstaces = new Set();
        for (const o of GameInfo.UnitMovementClassObstacles) {
            if (!o.EndsTurn || o.UnitMovementClass != "UNIT_MOVEMENT_CLASS_FOOT") continue;
            if (o.FeatureType) this.movementObstaces.add(o.FeatureType);
            if (o.RiverType) this.movementObstaces.add(o.RiverType);
            if (o.TerrainType) this.movementObstaces.add(o.TerrainType);
        }
        return this.movementObstaces.has(terrainType);
    }


    /* API Functions */
    addSettlerInfo(modIds, container, yieldsFlexbox, plotInfo) {
        //if(modIds.length > 0) return;

        if (LensManager.getActiveLens() != "fxs-settler-lens")  return;

        //Add more details to the tooltip if we are in the settler lens
        const localPlayer = Players.get(GameContext.localPlayerID);
        if (!localPlayer) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update settler tooltip: no valid local player!");
        const localPlayerDiplomacy = localPlayer?.Diplomacy;
        if (localPlayerDiplomacy === undefined) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update settler tooltip: no valid local player Diplomacy object!");

        //Don't add any extra tooltip to mountains, oceans, or navigable rivers
        if (GameplayMap.isWater(this.plotCoord.x, this.plotCoord.y) || GameplayMap.isImpassable(this.plotCoord.x, this.plotCoord.y) || GameplayMap.isNavigableRiver(this.plotCoord.x, this.plotCoord.y)) return;
            
        const settlerTooltip = document.createElement("div");
        const localPlayerAdvancedStart = localPlayer?.AdvancedStart;
        if (localPlayerAdvancedStart === undefined) throw new Error("[PRIVUS][PLOT-TOOLTIP] Cannot update settler tooltip: no valid local player advanced start object!");

        //Show why we can't settle here
        const settleErrors = {
            tooFar: !GameplayMap.isPlotInAdvancedStartRegion(GameContext.localPlayerID, this.plotCoord.x, this.plotCoord.y) && !localPlayerAdvancedStart?.getPlacementComplete(),
            blockingResource: !localPlayerDiplomacy.isValidLandClaimLocation(this.plotCoord, true) && GameplayMap.getResourceType(this.plotCoord.x, this.plotCoord.y) != ResourceTypes.NO_RESOURCE,
            tooCloseToCity: !localPlayerDiplomacy.isValidLandClaimLocation(this.plotCoord, true) && GameplayMap.isCityWithinMinimumDistance(this.plotCoord.x, this.plotCoord.y),
            noFreshWater: !GameplayMap.isFreshWater(this.plotCoord.x, this.plotCoord.y)
        }
        const settleErrorLocaleKeys = {
            tooFar: "LOC_PLOT_TOOLTIP_CANT_SETTLE_TOO_FAR",
            blockingResource: "LOC_PLOT_TOOLTIP_CANT_SETTLE_RESOURCES",
            tooCloseToCity: "LOC_PLOT_TOOLTIP_CANT_SETTLE_TOO_CLOSE",
            noFreshWater: "LOC_PLOT_TOOLTIP_NO_FRESH_WATER",
        }

        for(const [key, err] of Object.entries(settleErrors)) {
            if(err !== true) continue;
            settlerTooltip.classList.add("text-xs", "leading-normal", "mb-1");
            settlerTooltip.innerHTML = Locale.compose(settleErrorLocaleKeys[key]);
            settlerTooltip.setAttribute('data-l10n-id', settleErrorLocaleKeys[key]);
            this.setStyle(settlerTooltip, key === "LOC_PLOT_TOOLTIP_NO_FRESH_WATER" ? this.alertStyles.caution : this.alertStyles.danger, "bz-banner");
            break;
        }
        
        container.appendChild(settlerTooltip);
        ++this.headerBanners;
    }

    addEffectInfo(modIds, container, yieldsFlexbox, plotInfo) {
        const banners = [];
        const plotEffects = MapPlotEffects.getPlotEffects(plotInfo.plotIndex);
        const localPlayerID = GameContext.localPlayerID;
        if (!plotEffects) return;

        for (const item of plotEffects) {
            if (item.onlyVisibleToOwner && item.owner != localPlayerID) continue;
            
            const effectInfo = GameInfo.PlotEffects.lookup(item.effectType);
            if (!effectInfo) return;

            if (!effectInfo.Damage && !effectInfo.Defense) {
                this.effectTexts.push(effectInfo.Name);
                continue;
            } 

            const effectBanner = document.createElement("div");
            effectBanner.classList.add("text-xs", "leading-normal", "mb-1")
            effectBanner.setAttribute('data-l10n-id', effectInfo.Name);
            this.setStyle(effectBanner, effectInfo.Damage  ? this.alertStyles.danger : this.alertStyles.note, "bz-banner");
            container.appendChild(effectBanner);
            ++this.headerBanners;
        }
    }

    addTerrainAndBiomeInfo(modIds, container, yieldsFlexbox, plotInfo) {
        const titleTooltip = document.createElement("div");
        titleTooltip.classList.value = "text-secondary font-title uppercase text-sm leading-snug text-center";
        titleTooltip.setAttribute('data-l10n-id', plotInfo.biomeLabel ? 
            Locale.compose("{1_TerrainName} {2_BiomeName}", plotInfo.terrainLabel, plotInfo.biomeLabel) :
            plotInfo.terrainLabel);
        if (this.headerBanners === 0)
            titleTooltip.style.setProperty("padding-top", "var(--padding-top-bottom)");
        
        const terrainTooltip = document.createElement("div");
        const terrainType = GameplayMap.getTerrainType(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        if(this.isValidObstacle(terrainType))
            this.setStyle(terrainTooltip, this.getStyleFor(terrainType), "my-0\\.5", "px-2", "rounded-full")
        
        titleTooltip.appendChild(terrainTooltip);
        container.appendChild(titleTooltip);
    }

    addFeatureInfo(modIds, container, yieldsFlexbox, plotInfo) {
        const featureType = GameplayMap.getFeatureType(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        const feature = GameInfo.Features.lookup(featureType);
        if (feature) {
            const featureTooltip = document.createElement("div");
            const volcano = GameplayMap.isVolcano(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
            const activeVolcano = volcano && GameplayMap.isVolcanoActive(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
            if (volcano) {
                const volcanoStatus = (activeVolcano) ? 'LOC_VOLCANO_ACTIVE' : 'LOC_VOLCANO_NOT_ACTIVE';
                const volcanoName = GameplayMap.getVolcanoName(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
                const volcanoDetailsKey = (volcanoName) ? 'LOC_UI_NAMED_VOLCANO_DETAILS' : 'LOC_UI_VOLCANO_DETAILS';
                featureTooltip.setAttribute('data-l10n-id', Locale.compose(volcanoDetailsKey, feature.Name, volcanoStatus, volcanoName));
            }
            if(activeVolcano || this.isValidObstacle(featureType))
                this.setStyle(featureTooltip, activeVolcano ? this.terrainStyles.volcano : this.getStyleFor(featureType, feature.FeatureClassType), "my-0\\.5", "px-2", "rounded-full");
            this.geoContainer.appendChild(featureTooltip);
        }


        const routeType = GameplayMap.getRouteType(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        const route = GameInfo.Routes.lookup(routeType);
        const routeNames = [];
        if(route) routeNames.push(route.Name);
        if(GameplayMap.isFerry(plotInfo.plotCoord.x, plotInfo.plotCoord.y)) routeNames.push("LOC_NAVIGABLE_RIVER_FERRY");
        const hasRoad = routeNames.length > 0;

        const riverType = GameplayMap.getRiverType(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        let riverName = GameplayMap.getRiverName(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        switch(riverType) {
        case RiverTypes.RIVER_MINOR:
            if(!riverName) riverName = "LOC_MINOR_RIVER_NAME";
            break;
        case RiverTypes.RIVER_NAVIGABLE:
            if(!riverName) riverName = "LOC_NAVIGABLE_RIVER_NAME";
            break;
        default: 
            break;
        }
        if (riverType !== RiverTypes.NO_RIVER && riverName) 
            routeNames.push(riverName);

        if (routeNames.length > 0) {
            // road, ferry, river info
            const routeTooltip = document.createElement("div");
            // highlight priority: navigable rivers, roads, other rivers
            let routeStyle = this.terrainStyles.road;
            switch(riverType) {
            case RiverTypes.RIVER_NAVIGABLE:
                routeStyle = this.isValidObstacle("RIVER_NAVIGABLE") ? this.getStyleFor()
                break;
            case RiverTypes.RIVER_MINOR:
                if(hasRoad) break;
                
                break;
            }
            setCapsuleStyle(tt, routeStyle, "my-0\\.5", "px-2", "rounded-full");
            tt.innerHTML = dotJoinLocale(routes);
            this.geoContainer.appendChild(tt);
        }

        if (this.effectTexts.length === 0) return;
        const effectsTooltip = document.createElement("div");
        for (const effect of this.effectTexts) {
            const effectsText = document.createElement("div");
            effectsText.setAttribute('data-l10n-id', effect);
            effectsTooltip.appendChild(effectsText);
        }
        this.geoContainer.appendChild(effectsTooltip);
    }
}

PrivusTooltips.setSectionOrders(PlotTooltipTypeName, {
    addEffectInfo: 3
});