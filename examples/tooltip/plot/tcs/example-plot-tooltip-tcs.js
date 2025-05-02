//Get the plot tooltip name from Privus API
import PrivusTooltips from '/privus-api/ui/privus-tooltips.js';
import PlotTooltipTypeName from '/privus-api/ui/tooltip/privus-plot-tooltip.js';
import { ComponentID } from '/core/ui/utilities/utilities-component-id.js';
import ModOptions from '/privus-api/privus-options-manager.js';


class ExamplePlotTooltipTCS {
    constructor() {
        this.borderWidth = "0.1111111111rem";
        this.styles = Object.freeze({
            container: {
                'display': 'flex',
                'flex-direction': 'row',
                'justify-content': 'center',
                'align-items': 'center',
                'align-self': 'center',
                'margin-left': '-1.3333333333rem',
                'margin-right': '-1.3333333333rem',
                'flex': '1 1 auto',
            },
            lineLeft: {
                'height': '0.1111111111rem',
                'flex': '1 1 auto',
                'min-width': '0.5rem',
                'margin-left': '0.3333333333rem',
                'background-image': 'linear-gradient(to left, #8D97A6, rgba(141, 151, 166, 0))',
            },
            lineRight: {
                'height': '0.1111111111rem',
                'flex': '1 1 auto',
                'min-width': '0.5rem',
                'margin-left': '0.3333333333rem',
                'background-image': 'linear-gradient(to right, #8D97A6, rgba(141, 151, 166, 0))',
            },
            title: {
                'display': 'flex',
                'flex-direction': 'row',
                'align-items': 'center',
                'position': 'relative',
                'align-self': 'center',
                'text-align': 'center',
                'font-size': 'calc(1rem + -0.1111111111rem)',
                'letter-spacing': '0.1111111111rem',
                'padding-top': '0.25rem',
                'padding-bottom': '0.1rem',
                'padding-left': '0.6666666667rem',
                'padding-right': '0.6666666667rem',
                'line-height': '1.3333333333rem',
                'max-width': '12rem',
            },
            icon: {
                'position': 'relative',
                'background-size': 'contain',
                'background-repeat': 'no-repeat',
                'align-content': 'center'
            },
            banner: {
                'flex-direction': 'column',
                '--padding-top-bottom': '0.2222222222rem',
                'margin-left': `calc(${this.borderWidth} - var(--padding-left-right))`,
                'margin-right': `calc(${this.borderWidth} - var(--padding-left-right))`,
                'margin-top': `calc(${this.borderWidth} - var(--padding-top-bottom))`,
                'margin-bottom': `calc(${this.borderWidth} - var(--padding-top-bottom))`,
                'padding-top': `calc(var(--padding-top-bottom) - ${this.borderWidth})`,
                'padding-bottom': `calc(var(--padding-top-bottom) - ${this.borderWidth})`,
                'padding-left': `calc(var(--padding-left-right) - ${this.borderWidth})`,
                'padding-right': `calc(var(--padding-left-right) - ${this.borderWidth})`,
                'background-color': '#3A0806' // #3A0806
            },
            default: {
                'font-size': 'calc(1rem + -0.2222222222rem)',
                'text-align': 'center',
                'line-height': '1rem',
                'margin-top': '0.0555555556rem',
            }
        });

        this.missingIcons = ['IMPROVEMENT_VILLAGE', 'IMPROVEMENT_ENCAMPMENT'];
        this.dividerDot = Locale.compose("LOC_PLOT_DIVIDER_DOT");
    }



    /* API Functions */
    addSettlerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        PrivusTooltips.defaultFn(PlotTooltipTypeName, "addSettlerInfo").call(PrivusTooltips.getInstance(PlotTooltipTypeName), modIds, container, yieldsFlexbox, plotInfo, keysPressed);
        PrivusTooltips.setAppendDivider(PlotTooltipTypeName, 'addSettlerInfo', false);
    }

    addFeatureInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed){
        if(keysPressed.shift) return;
        const featureType = GameplayMap.getFeatureType(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        const feature = GameInfo.Features.lookup(featureType);
        const naturalWonder = GameInfo.Feature_NaturalWonders.find(e => e.FeatureType == featureType);

        if(!feature || naturalWonder) return;

        const featureLabel = this.getFeatureLabel(feature, plotInfo.plotCoord);
        const riverLabel = PrivusTooltips.defaultFn(PlotTooltipTypeName, "getRiverLabel").call(PrivusTooltips.getInstance(PlotTooltipTypeName), plotInfo.plotCoord);
        if(!featureLabel && !riverLabel) return;

        const tooltipSecondLine = document.createElement("div");
        tooltipSecondLine.classList.add('text-2xs', 'text-center');

        tooltipSecondLine.setAttribute('data-l10n-id', (featureLabel && riverLabel) ? 
            Locale.compose("LOC_PLOT_MOD_TCS_FEATURE_RIVER", featureLabel, riverLabel) :
            (featureLabel ?? riverLabel));
        container.appendChild(tooltipSecondLine);
    }

    addYields(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        //return PrivusTooltips.defaultFn(PlotTooltipTypeName, "addYields").call(PrivusTooltips.getInstance(PlotTooltipTypeName), modIds, container, yieldsFlexbox, plotInfo, keysPressed);
        
        const fragment = document.createDocumentFragment();
        let maxValueLength = 0;
        this.yieldTypes = 0;
        this.totalYields = 0;
        
        for (const yieldInfo of GameInfo.Yields) {
            const yieldAmount = GameplayMap.getYield(plotInfo.plotCoord.x, plotInfo.plotCoord.y, yieldInfo.YieldType, GameContext.localPlayerID);
            if (yieldAmount <= 0) continue;

            const tooltipIndividualYieldFlex = document.createElement("div");
            tooltipIndividualYieldFlex.classList.add("plot-tooltip__IndividualYieldFlex");
            tooltipIndividualYieldFlex.ariaLabel = `${Locale.toNumber(yieldAmount)} ${Locale.compose(yieldInfo.Name)}`;
            fragment.appendChild(tooltipIndividualYieldFlex);
            
            const yieldIconCSS = UI.getIconCSS(yieldInfo.YieldType, "YIELD");
            const yieldIconShadow = document.createElement("div");
            yieldIconShadow.classList.add("plot-tooltip__IndividualYieldIcons-Shadow");
            yieldIconShadow.style.backgroundImage = yieldIconCSS;
            tooltipIndividualYieldFlex.appendChild(yieldIconShadow);
            
            const yieldIcon = document.createElement("div");
            yieldIcon.classList.add("plot-tooltip__IndividualYieldIcons");
            yieldIcon.style.backgroundImage = yieldIconCSS;
            yieldIconShadow.appendChild(yieldIcon);
            
            const toolTipIndividualYieldValues = document.createElement("div");
            const yieldAmtStr = yieldAmount.toString();
            maxValueLength = Math.max(maxValueLength, yieldAmtStr.length);

            toolTipIndividualYieldValues.classList.add("plot-tooltip__IndividualYieldValues");
            toolTipIndividualYieldValues.textContent = yieldAmtStr;
            tooltipIndividualYieldFlex.appendChild(toolTipIndividualYieldValues);

            this.totalYields += yieldAmount;
            ++this.yieldTypes;
        }

        yieldsFlexbox.appendChild(fragment);
        // Give all the yields extra room if one of them has extra digits, to keep the spacing even.
        yieldsFlexbox.classList.remove('resourcesFlex--double-digits', 'resourcesFlex--triple-digits');
        
        if (maxValueLength <= 2) return;
        yieldsFlexbox.classList.add(`resourcesFlex--${maxValueLength > 3 ? 'triple' : 'double'}-digits`);
        
    }

    addDistrictInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        //Covered by addConstructibleInfo
        return;
    }

    addSpecialistInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        const workerString = this.getWorkerString(plotInfo);

		if (this.totalYields === 0 && !workerString) return;

        const additionalIconStyle = Object.freeze({
            'width': '0.92rem',
            'height': '0.92rem',
            'margin-right': '0.2666667rem',
            'margin-top': '0.1rem'
        });
        const rowStyle = Object.freeze({
		    'position': 'relative',
		    'width': '100%',
		    'display': 'flex',
		    'flex-direction': 'row',
		    'justify-content': 'center',
		    'align-content': 'center',
        });
        const subcontainerStyle = Object.freeze({
		    'display': 'flex',
		    'flex-direction': 'row',
		    'justify-content': 'flex-start',
        });

        const additionalYieldInfo = document.createElement("div");
        this.setStyle(additionalYieldInfo, rowStyle);
        
        if (this.totalYields > 0 && this.yieldTypes > 1) {
            const subContainer = document.createElement("div");
            this.setStyle(subContainer, subcontainerStyle);

            // Icon + shadow
            const totalYieldsIconCSS = UI.getIconCSS('CITY_RURAL');
            const totalYieldsIconShadow = this.addShadowedIcon(totalYieldsIconCSS, Object.assign({}, this.styles.icon, additionalIconStyle));

            // Text
            const totalYieldsText = this.addGenericText(this.totalYields, {'font-weight': '500'});
            totalYieldsText.classList.add('text-xs');

            subContainer.appendChild(totalYieldsIconShadow);
            subContainer.appendChild(totalYieldsText);
            additionalYieldInfo.appendChild(subContainer);
        }

        if (workerString) {
            const subContainer = document.createElement("div");
            this.setStyle(subContainer, subcontainerStyle);

            // Icon + shadow
            const specialistsIconCSS = UI.getIconCSS('CITY_SPECIAL_BASE');
            // extra margin for the specialist icon to space it from the total yields divs
            const specialistsIconShadow = this.addShadowedIcon(specialistsIconCSS, Object.assign({'margin-left': '0.75rem'}, additionalIconStyle));

            // Text
            const specialistsText = this.addGenericText(workerString, {'font-weight': '500'});
            specialistsText.classList.add('text-xs');

            subContainer.appendChild(specialistsIconShadow);
            subContainer.appendChild(specialistsText);
            additionalYieldInfo.appendChild(subContainer);
        }
        container.appendChild(additionalYieldInfo);
    }

    addConstructibleInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        /*
		district (rural/urban/quarter/wonder)
		constructibles (improvements/buildings)
		fortifications
		*/
		
		const currentAge = Game.age;
	
		// Get constructibles
		const buildings = [];
		const walls = [];
		const wonders = [];
		const improvements = [];
		const constructibles = MapConstructibles.getHiddenFilteredConstructibles(plotInfo.plotCoord.x, plotInfo.plotCoord.y);;
		
		// Get district info
		const district = (plotInfo.districtID) ? Districts.get(plotInfo.districtID) : undefined;
		let districtName = (district) ? Locale.compose(GameInfo.Districts.lookup(district.type).Name) : undefined;
		
		// Get player info
		const player = Players.get(plotInfo.owningPlayerID);;
					
		// Collect and sort constructibles
		constructibles.forEach((item) => {
			const instance = Constructibles.getByComponentID(item);
			if (!instance) return;
			
			const location = instance.location;
			if (location.x != plotInfo.plotCoord.x || location.y != plotInfo.plotCoord.y) return;

			const info = GameInfo.Constructibles.lookup(instance.type);
			if (!info) {
				console.warn("Building constructible without a definition: " + instance.type.toString());
				return;
			}
            switch(info.ConstructibleClass) {
            case "BUILDING": {
				const building = {
					Info: info,
					Name: Locale.compose(info.Name), //LOC_PLOT_MOD_TCS_CONSTRUCTIBLE_NAME -> name + tag
					Ageless: GameInfo.TypeTags.find(e => e.Tag == "AGELESS" && e.Type == info.ConstructibleType), //LOC_PLOT_MOD_TCS_AGELESS
					UniqueTrait: GameInfo.Buildings.find(e => e.ConstructibleType == info.ConstructibleType && e.TraitType !== null), //LOC_PLOT_MOD_TCS_UNIQUE
					ConstructibleAge: Database.makeHash(info?.Age ?? ""), //LOC_PLOT_MOD_TCS_OBSOLETE
					Damaged: instance.damaged, //LOC_PLOT_TOOLTIP_DAMAGED
					Completed: (instance.complete), //LOC_PLOT_TOOLTIP_IN_PROGRESS
					Defensive: (info.DistrictDefense > 0),
					FullTile: GameInfo.TypeTags.find(e => e.Tag == "FULL_TILE" && e.Type == info.ConstructibleType)
				};
				
				// Filter to walls out of building list
				if (info.DistrictDefense > 0 && info.ExistingDistrictOnly > 0) walls.push(building);
				else buildings.push(building);
                break;
                }
            case "WONDER":
				wonders.push({
					Info: info,
					Name: Locale.compose(info.Name), //LOC_PLOT_MOD_TCS_CONSTRUCTIBLE_NAME -> name + tag
					Tooltip : Locale.compose(info.Tooltip),
					ConstructibleAge: Database.makeHash(info?.Age ?? ""), //LOC_PLOT_MOD_TCS_OBSOLETE
					Damaged: instance.damaged, //LOC_PLOT_TOOLTIP_DAMAGED
					Completed: (instance.complete), //LOC_PLOT_TOOLTIP_IN_PROGRESS
					Defensive: (info.DistrictDefense > 0)
				});
                break;
            case "IMPROVEMENT":
				improvements.push({
					Info: info,
					Name: Locale.compose(info.Name), //LOC_PLOT_MOD_TCS_CONSTRUCTIBLE_NAME -> name + tag
					//Ageless: GameInfo.TypeTags.find(e => e.Tag == "AGELESS" && e.Type == info.ConstructibleType), //LOC_PLOT_MOD_TCS_AGELESS
					UniqueTrait: GameInfo.Improvements.find(e => e.ConstructibleType == info.ConstructibleType && e.TraitType !== null), //LOC_PLOT_MOD_TCS_UNIQUE
					//ConstructibleAge: Database.makeHash(info?.Age ?? ""), //LOC_PLOT_MOD_TCS_OBSOLETE
					Damaged: instance.damaged, //LOC_PLOT_TOOLTIP_DAMAGED
					Completed: (instance.complete) //LOC_PLOT_TOOLTIP_IN_PROGRESS
				});
                break;
            }
		});	
		
		// Check for Quarters
		// Criteria for an Urban district to be a Quarter:
		// 	- Have both unique Buildings from the same Civilization --> a Unique quarter
		//  - Have 2 Buildings from the current age --> a Standard quarter
		//  - Have 1 full-tile Building from the current age --> a Standard quarter
		const quarters = [];
		if (district && district.type == DistrictTypes.URBAN && buildings.length > 0) {
			const uniques = [];
			const ages = [];
			buildings.forEach((item) => {
				if (item.UniqueTrait && item.Completed)
					uniques.push(item.UniqueTrait.TraitType);
				if ((item.ConstructibleAge || item.Ageless) && item.Completed) 
					ages.push(item.Ageless ? currentAge : item.ConstructibleAge);
			});
            
			if (uniques.length > 1 && [...new Set(uniques)].length === 1) {
				const uniqueQuarter = GameInfo.UniqueQuarters.find(e => e.TraitType == uniques[0]);
				const civType = GameInfo.LegacyCivilizationTraits.find(e => e.TraitType == uniques[0]);
				const civLegacy = GameInfo.LegacyCivilizations.find(e => e.CivilizationType == civType.CivilizationType);
				const quarterTooltip = "LOC_" + uniqueQuarter.UniqueQuarterType + "_TOOLTIP";
				quarters.push({
					QuarterName: uniqueQuarter.Name,
					QuarterDescription: uniqueQuarter.Description,
					QuarterTooltip: (Locale.keyExists(quarterTooltip) ? quarterTooltip : uniqueQuarter.Description),
					Civilization: civLegacy,
					CivilizationAdjective: civLegacy.Adjective
				});
			}
			else if (
                (ages.length > 1 && [...new Set(ages)].length === 1 && ages[0] == currentAge) ||
                (buildings.length == 1 && buildings[0].FullTile && buildings[0].Completed)) {
                quarters.push({
						QuarterName: "LOC_PLOT_MOD_TCS_QUARTER",
						QuarterDescription: undefined,
						Civilization: undefined,
						CivilizationAdjective: undefined
				});
			}
		}


        //Get potential improvements
        this.potentialImprovements = [];
        this.potentialImprovementTypes = [];
        if(!constructibles || constructibles.length == 0) {
            if(plotInfo.resource)
                this.addPotentialImprovements(item => (item.ResourceType && item.ResourceType == plotInfo.resource.ResourceType));
            if(plotInfo.feature && this.potentialImprovements.length == 0)
                this.addPotentialImprovements(item => (item.FeatureType == plotInfo.feature.FeatureType));
            if(plotInfo.riverType && plotInfo.riverType == RiverTypes.RIVER_NAVIGABLE && this.potentialImprovements.length == 0)
                this.addPotentialImprovements(item => (item.RiverType == "RIVER_NAVIGABLE"));
            if(plotInfo.terrain && this.potentialImprovements.length == 0)
                this.addPotentialImprovements(item => (item.TerrainType == plotInfo.terrain.TerrainType));

			const localPlayer = Players.get(GameContext.localPlayerID);
			const localPlayerCivType = GameInfo.Civilizations.lookup(localPlayer.civilizationType).CivilizationType;
            const localPlayerCivTraits = [];
			GameInfo.CivilizationTraits.filter(t => t.CivilizationType == localPlayerCivType).forEach(t => {
				localPlayerCivTraits.push(t.TraitType);
			});
            const uniqueImprovements = GameInfo.Improvements.filter(i => localPlayerCivTraits.includes(i.TraitType));
            if(uniqueImprovements){
                uniqueImprovements.forEach(i => {
                    if(this.addPotentialUniqueImprovements('ResourceType', plotInfo.resource, i, GameInfo.Constructible_ValidResources))
                        return;
                    if(this.addPotentialUniqueImprovements('FeatureType', plotInfo.feature, i, GameInfo.Constructible_ValidFeatures))
                        return;
                    if(this.addPotentialUniqueImprovements('TerrainType', plotInfo.terrain, i, GameInfo.Constructible_ValidTerrains))
                        return;
                });
            }

        }
		
		// Build District Title Tooltip
		// If Wonder, title is Wonder name
		// If unique Quarter, title is unique Quarter name
		// If standard Quarter, title is "Quarter"
		// If Urban, title is "Urban"
		// If Rural, title is "Rural"
		// If empty, title is "Wilderness"
		if (player || (improvements.length > 0) || (this.potentialImprovements.length > 0)) {
			if (district && district.type == DistrictTypes.WONDER) 
                districtName = wonders[0].Name;
			else if (quarters.length > 0) 
                districtName = Locale.compose(quarters[0].QuarterName);
			else if (district && (district.type == DistrictTypes.RURAL)) 
                districtName = undefined;
			//else if (!player || plotObject.PotentialImprovements.length > 0) 
            //  districtName = Locale.compose("LOC_PLOT_MOD_TCS_WILDERNESS");

			if (districtName) 
                container.appendChild(this.addTitle(districtName));
			if (this.getOption('show-quarter-descriptions') == true && quarters.length > 0 && quarters[0].QuarterDescription)
				container.appendChild(this.addGenericText(
					Locale.compose(quarters[0].QuarterTooltip), 
					Object.assign({'padding-bottom': '0.25rem'}, this.styles.default)
                ));
		}
		
		// Potential improvements
		if (this.getOption('show-potential-improvements') == true && improvements.length == 0 && buildings.length == 0 && wonders.length == 0 && this.potentialImprovements.length > 0) {
			this.potentialImprovements.sort((a,b) => (Locale.compose(a.Name) > Locale.compose(b.Name)) ? 1 : ((Locale.compose(b.Name) > Locale.compose(a.Name)) ? -1 : 0));
			
			const plotTooltipImprovementContainer = this.addSectionContainer({
                'justify-content': 'center',
                'align-content': 'center',
                'padding': '0.5rem'
            });
			
			// Sub Container
			const plotTooltipImprovementSubContainer = this.addSectionContainer({
				'align-content': 'flex-start',
				'max-width': '100%',
                'justify-content': 'center',
            }, 'column');
			plotTooltipImprovementSubContainer.style.removeProperty('width');
			plotTooltipImprovementContainer.appendChild(plotTooltipImprovementSubContainer);
			
			this.potentialImprovements.forEach((item) => {
				const plotTooltipSubContainer = this.addSectionContainer({
					'justify-content': 'flex-start',
					'align-content': 'flex-start',
					//'background-color': 'rgb(0, 91, 188)' //debugging
                });

				// Icon
				const toolTipImprovementIcon = this.addConstructibleIcon(item, {'opacity': '0.35'});
				
				// Improvement String
				const plotTooltipImprovementElement = this.addGenericText(
					Locale.stylize("LOC_PLOT_MOD_TCS_POTENTIAL_IMPROVEMENT", item.Name), 
					{'margin-left': '0.15rem', 'margin-right': '0.15rem'}
                );

				plotTooltipSubContainer.appendChild(toolTipImprovementIcon);
				plotTooltipSubContainer.appendChild(plotTooltipImprovementElement);
				plotTooltipImprovementSubContainer.appendChild(plotTooltipSubContainer);
			});
			container.appendChild(plotTooltipImprovementContainer);
		}
		
		// Improvements
		if (improvements.length > 0) {
			improvements.sort((a,b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
			
			const plotTooltipImprovementContainer = this.addSectionContainer({
				'justify-content': 'center',
				'align-content': 'center',
				'max-width': '100%',
				'padding-top': '0.125rem',
				'padding-bottom': '0.125rem',
            });
			plotTooltipImprovementContainer.style.removeProperty('width');
			
			improvements.forEach((item) => {
				// Parse item tag (Wilderness, Rural, Unique)
				const itemTags = [];
				if (item.Info.Discovery)
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_WILDERNESS"));
				else 
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_RURAL"));
				if (item.UniqueTrait) 
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_UNIQUE"));
				
				// Parse item status (Damaged, In Progress)
				if (item.Damaged) 
                    itemTags.push(Locale.compose("LOC_PLOT_TOOLTIP_DAMAGED"));
				else if (!item.Completed) 
                    itemTags.push(Locale.compose("LOC_PLOT_TOOLTIP_IN_PROGRESS"));
								
				// Sub Container
				const plotTooltipSubContainer = this.addSectionContainer({
					'justify-content': 'center',
					'align-content': 'center',
					//'padding': '0.25rem'
			    });
				plotTooltipSubContainer.style.removeProperty('width');
				
				// Icon
				const toolTipImprovementIcon = this.addConstructibleIcon(item);
				plotTooltipSubContainer.appendChild(toolTipImprovementIcon);

				// Improvement String
				const plotTooltipImprovementElement = document.createElement("div");
				this.setStyle(plotTooltipImprovementElement, {
					'margin-left': '0.15rem',
					'margin-right': '0.15rem',
					'flex-direction': 'column',
					'align-content': 'flex-start'
				});
				
				const plotTooltipImprovementString = this.addGenericText(item.Name, {
					//'max-width': '8rem',
					'font-weight': 'bold'
                });
				plotTooltipImprovementString.classList.add('text-xs');

				plotTooltipImprovementElement.appendChild(plotTooltipImprovementString);
				if (itemTags.length > 0) {
					const plotTooltipPropertyString = this.addConstructibleTag(itemTags.join(" " + this.dividerDot + " "));
					plotTooltipImprovementElement.appendChild(plotTooltipPropertyString);	
				}
				plotTooltipSubContainer.appendChild(plotTooltipImprovementElement);
				plotTooltipImprovementContainer.appendChild(plotTooltipSubContainer);
			});

			container.appendChild(plotTooltipImprovementContainer);
		}
		
		// Buildings
		if (buildings.length > 0) {
			buildings.sort((a,b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));
			
			const plotTooltipBuildingsContainer = this.addSectionContainer({
                'justify-content': 'center',
                'align-content': 'flex-start',
                'padding': '0.5rem'
            });
			const plotTooltipBuildingSubcontainer = this.addSectionContainer({
				'justify-content': 'flex-start',
				'align-content': 'center',
				//'background-color': TCS_WARNING_BACKGROUND_COLOR, //debugging
            });
			plotTooltipBuildingsContainer.appendChild(plotTooltipBuildingSubcontainer);
			
			if (buildings.length == 1) {
				plotTooltipBuildingSubcontainer.style.removeProperty('width');
				plotTooltipBuildingSubcontainer.style.setProperty('max-width', '100%');	
			}
			if (this.getOption('building-display-mode') == false) {
				plotTooltipBuildingSubcontainer.style.setProperty('flex-direction', 'column');
				plotTooltipBuildingsContainer.style.setProperty('justify-content', 'center');
				plotTooltipBuildingsContainer.style.setProperty('align-content', 'center');
				plotTooltipBuildingSubcontainer.style.removeProperty('width');
				plotTooltipBuildingSubcontainer.style.setProperty('max-width', '100%');	
			}
			

			buildings.forEach((item) => {
				// Parse item tag (Unique, Ageless, Obsolete)
				const itemTags = [];
				if (item.UniqueTrait) 
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_UNIQUE"));
				else if (item.Ageless) 
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_AGELESS"));
				else if (item.ConstructibleAge != currentAge) 
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_OBSOLETE"));
				else if (currentAge == Game.getHash("AGE_ANTIQUITY")) 
                    itemTags.push(Locale.compose("LOC_AGE_ANTIQUITY_NAME"));
				else if (currentAge == Game.getHash("AGE_EXPLORATION")) 
                    itemTags.push(Locale.compose("LOC_AGE_EXPLORATION_NAME"));
				else if (currentAge == Game.getHash("AGE_MODERN")) 
                    itemTags.push(Locale.compose("LOC_AGE_MODERN_NAME"));
				
				// Parse item status (Damaged, In Progress, Full-Tile)
				if (item.Damaged) 
                    itemTags.push(Locale.compose("LOC_PLOT_TOOLTIP_DAMAGED"));
				if (!item.Completed) 
                    itemTags.push(Locale.compose("LOC_PLOT_TOOLTIP_IN_PROGRESS"));
				if (item.FullTile) 
                    itemTags.push(Locale.compose("LOC_PLOT_MOD_TCS_FULL_TILE"));
				
				// Sub Container
				/* Structure:
					I C	BuildingName
					O N - Tag 1
						- Tag 2
				*/
				

				const plotTooltipSubContainer = this.addSectionContainer({
					'justify-content': 'center',
					'align-content': 'flex-start',
					//'background-color': 'rgb(0, 91, 188)', //debugging
                });
				if (buildings.length > 1 && this.getOption('building-display-mode') == true) 
					plotTooltipSubContainer.style.setProperty('width', '50%');
				else 
                    plotTooltipSubContainer.style.removeProperty('width');
				if (this.getOption('building-display-mode') == false) 
					plotTooltipSubContainer?.style.setProperty('justify-content', 'flex-start');
				
				// Icon
				const toolTipBuildingIcon = this.addConstructibleIcon(item);
				plotTooltipSubContainer.appendChild(toolTipBuildingIcon);
				
				// Building String
				const plotTooltipBuildingElement = document.createElement("div");
				this.setStyle(plotTooltipBuildingElement, {
					'margin-left': '0.15rem',
					'margin-right': '0.15rem',
					'flex-direction': 'column',
					'align-content': 'flex-start',
					//'background-color': 'rgb(0, 114, 23)', //debugging
				});
				
				// Modify building name to fit better when displayed as row
				const itemName = (this.getOption('building-display-mode') == true && Locale.compose(item.Name).length > 12) ? 
                    Locale.compose(item.Name).replaceAll('-', ' ') : 
                    Locale.compose(item.Name);
				const plotTooltipBuildingString = this.addGenericText(itemName, {'font-weight': 'bold'});
				if (buildings.length > 1 && this.getOption('building-display-mode') == true) {
					plotTooltipBuildingString.style.setProperty('max-width', '6rem');
					plotTooltipBuildingString.style.setProperty('overflow-wrap', 'break-word');
				}
				else 
                    plotTooltipBuildingString?.style.removeProperty('width');
				if (this.getOption('building-display-mode') == true && buildings.length > 1 && itemName.length > 12 && (itemName == itemName.replaceAll(' ', ''))) 
                    plotTooltipBuildingString.classList.add('text-2xs');
				else 
                    plotTooltipBuildingString.classList.add('text-xs');
				plotTooltipBuildingElement.appendChild(plotTooltipBuildingString);
				
				if (itemTags.length > 0) {
					const plotTooltipPropertyString = this.addConstructibleTag(itemTags.join(" " + this.dividerDot + " "));
					if (buildings.length > 1 && this.getOption('building-display-mode') == true) 
                        plotTooltipPropertyString.style.setProperty('max-width', '6rem');
					plotTooltipBuildingElement.appendChild(plotTooltipPropertyString);	
				}
				plotTooltipSubContainer.appendChild(plotTooltipBuildingElement);
				plotTooltipBuildingSubcontainer.appendChild(plotTooltipSubContainer);
			});

			container.appendChild(plotTooltipBuildingsContainer);
		}
		
		// Wonders
		if (wonders.length > 0) {
			wonders.sort((a,b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0));		
			wonders.forEach((item) => {         
				const itemTags = [];
				if (item.Damaged) 
                    itemTags.push(Locale.compose("LOC_PLOT_TOOLTIP_DAMAGED"));
				else if (!item.Completed) 
                    itemTags.push(Locale.compose("LOC_PLOT_TOOLTIP_IN_PROGRESS"));

				// Add status
				if (itemTags.length > 0) {
					const tooltipBuildingStatus = document.createElement("div");
					tooltipBuildingStatus.classList.add("plot-tooltip__building-status");
					tooltipBuildingStatus.innerHTML = itemTags.join(" " + this.dividerDot + " ");
					container.appendChild(tooltipBuildingStatus);
				}			
				
				// Add icon and description	
				const toolTipWonderContainer = this.addSectionContainer();	
				const tooltipWonderSubcontainer = this.addSectionContainer({
					'justify-content': 'center',
					'align-content': 'flex-start',
					'padding-left': '0.5rem'
				});		
				const toolTipWonderLargeIcon = this.addConstructibleIcon(item);					
				const toolTipWonderDescription = this.addGenericText(item.Tooltip, {
					'max-width': '14rem',
					'font-size': 'calc(1rem + -0.2222222222rem)',
					'line-height': '1rem'
				});

				tooltipWonderSubcontainer.appendChild(toolTipWonderLargeIcon);
				tooltipWonderSubcontainer.appendChild(toolTipWonderDescription);
				toolTipWonderContainer.appendChild(tooltipWonderSubcontainer);
				container.appendChild(toolTipWonderContainer);
			});
		}
					
		// Fortifications Container
		if (!player) return;
		if (!district || district.type == DistrictTypes.RURAL) return;
		const playerDistricts = plotInfo.owningPlayer ? Players.Districts.get(plotInfo.owningPlayerID) : undefined;
		if (!playerDistricts) return;

		const currentHealth = playerDistricts.getDistrictHealth(plotInfo.plotCoord);
		const maxHealth = playerDistricts.getDistrictMaxHealth(plotInfo.plotCoord);
		const isFortified = maxHealth > 0 && currentHealth == maxHealth;
		const isDamaged = maxHealth > 0 && currentHealth < maxHealth;
		const isUnderSiege = playerDistricts.getDistrictIsBesieged(plotInfo.plotCoord);
		const isHealing = (!isUnderSiege && isDamaged);
		
		//Wall info
		const defensiveConstructibles = [];
		wallInfo: if (walls.length > 0) {
			for (const wall of walls) {
                switch(wall.Info.ConstructibleType) {
                case "BUILDING_DEFENSIVE_FORTIFICATIONS":
                case "BUILDING_MEDIEVAL_WALLS":
                case "BUILDING_ANCIENT_WALLS":
					defensiveConstructibles.push(wall.Name);
                    break wallInfo;
                default:
                    continue;
                }
			}
		}
		// Check for other defensive buildings or wonders
		for (const item of buildings)
			if (item.Defensive)
				defensiveConstructibles.push(item.Name);
		for (const item of wonders)
			if (item.Defensive) 
				defensiveConstructibles.push(item.Name);

		// Concatenate wall name with other defensive structures
		const allFortificationNames = defensiveConstructibles.join(" " + this.dividerDot + " ");			
		
		// Build Fortification tooltip
		if (!isFortified && !isDamaged) return;

		const fortificationInfo = document.createElement("div");
		this.setStyle(fortificationInfo, {
			'position': 'relative',
			'display': 'flex',
			'flex-direction': 'row',
			'justify-content': 'center',
			'align-content': 'center',
        });

		// Add warning banner styling if under siege or recovering
		if (isUnderSiege || isHealing) {
            this.setStyle(fortificationInfo, this.styles.banner);
			
			const siegeTitle = document.createElement("div");
			siegeTitle.classList.add("plot-tooltip__district-title", "plot-tooltip__lineThree");
			siegeTitle.innerHTML = (isUnderSiege) ? Locale.compose("LOC_PLOT_TOOLTIP_UNDER_SIEGE") : Locale.compose("LOC_PLOT_TOOLTIP_HEALING_DISTRICT");
			fortificationInfo.appendChild(siegeTitle);
		}
		
		// Icon + String subcontainer
		const subContainer = document.createElement("div");
        this.setStyle(subContainer, {
            'flex-direction': 'row',
            'display': 'flex',
            'justify-content': (isUnderSiege || isHealing) ? 'center' : 'flex-start'
        });

		// Fortification Icon and shadow
		const fortificationIconShadow = this.addShadowedIcon(`url("fs://game/Action_Defend.png")`, Object.assign({
			'width': '1rem',
			'height': '1rem',
			'margin-right': '0.166666667rem',
			'margin-top': '0.1rem',
        }, this.styles.icon));
	
		// Text
		const fortificationText = document.createElement("div");
		fortificationText.classList.add('text-2xs');
		if (isUnderSiege || isHealing) 
            fortificationText.style.setProperty('color', '#CEA92F');// #CEA92F
        fortificationText.setAttribute('data-l10n-id', 
            (allFortificationNames ? (allFortificationNames + " " + this.dividerDot + " ") : "") + 
            (isDamaged ? (currentHealth + "/") : "") + 
            maxHealth
        );


		// Health Icon and shadow
		const healthIconShadow = this.addShadowedIcon(`url("fs://game/prod_generic.png")`, Object.assign({
			'width': '1rem',
			'height': '1rem',
			'margin-left': '0.166666667rem',
			'margin-top': '0.1rem'
        }, this.styles.icon));

		// Build tooltip section
		subContainer.appendChild(fortificationIconShadow);
		subContainer.appendChild(fortificationText);
		subContainer.appendChild(healthIconShadow);
		fortificationInfo.appendChild(subContainer);
		container.appendChild(fortificationInfo);
    }

    addNaturalWonderInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        const featureType = GameplayMap.getFeatureType(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        const feature = GameInfo.Features.lookup(featureType);
        const naturalWonder = GameInfo.Feature_NaturalWonders.find(e => e.FeatureType == featureType);

        if(!feature || !naturalWonder) return;

        const featureLabel = this.getFeatureLabel(feature, plotInfo.plotCoord);
        if(!featureLabel) return;

		// title line
		container.appendChild(this.addTitle(featureLabel));

		// tooltip line
		const naturalWonderTooltip = document.createElement('div');
		naturalWonderTooltip.classList.add("plot-tooltip__owner-civ-text", "justify-center");
		naturalWonderTooltip.setAttribute('data-l10n-id', Locale.compose(feature.Description));
		container.appendChild(naturalWonderTooltip);
    }

    addResourceInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        if(!plotInfo.resource) return;
				
		// Resource name
		const nameString = "[icon:" + plotInfo.resource.ResourceClassType + "] " + Locale.compose(plotInfo.resource.Name);
		container.appendChild(this.addTitle(Locale.stylize(nameString)));
		
		// Resource icon and tooltip	
		const toolTipResourceContainer = document.createElement('div');
		toolTipResourceContainer.classList.add('plot-tooltip__resource-container');
		//toolTipResourceContainer?.style.setProperty('justify-content', 'center');
		
		const toolTipResourceIconCSS = UI.getIconCSS(plotInfo.resource.ResourceType);

		// Icon + Background shadow
		const resourceIconShadow = this.addShadowedIcon(toolTipResourceIconCSS, Object.assign({
			'height': '2.6666666667rem',
			'width': '2.6666666667rem',
			'margin-right': '0.666666667rem'
        }, this.styles.icon));
		toolTipResourceContainer.appendChild(resourceIconShadow);
		
		const toolTipResourceDetails = document.createElement('div');
		toolTipResourceDetails.classList.add('plot-tooltip__resource-details');
		toolTipResourceDetails.style.setProperty('flex-direction', 'row'); //text needs to flow more smoothly across
		toolTipResourceDetails.style.setProperty('max-width', '14rem');
		
		const toolTipResourceDescription = document.createElement("div");
		toolTipResourceDescription.classList.add("plot-tooltip__resource-label_description");
		//toolTipResourceDescription.setAttribute('data-l10n-id', plotInfo.resource.Tooltip);
		toolTipResourceDescription.innerHTML = Locale.stylize(plotInfo.resource.Tooltip);
		
		toolTipResourceDetails.appendChild(toolTipResourceDescription);
		toolTipResourceContainer.appendChild(toolTipResourceDetails);
		
		container.appendChild(toolTipResourceContainer);	
    }

    addOwnerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        //const owningPlayerID = plotInfo.owningPlayerID;
        //const owningPlayer = plotInfo.owningPlayer;
        
        // Cancel if player is not alive
        if (!plotInfo.owningPlayer || !Players.isAlive(plotInfo.owningPlayerID)) 
            return;
        
        
        const constructibles = MapConstructibles.getConstructibles(plotInfo.plotCoord.x, plotInfo.plotCoord.y);        
        if (constructibles.length == 0)
            return;
        
        
        // Get player
        const owningPlayerDiplomacy = plotInfo.owningPlayer.Diplomacy;
        const localPlayerID = GameContext.localPlayerID;
        const localPlayer = Players.get(localPlayerID);
        const localPlayerDiplomacy = localPlayer?.Diplomacy; 
        
        // Get ownership labels (playerLabel, civLabel, cityLabel)
        const playerLabel = (plotInfo.owningPlayer) ? Locale.stylize(plotInfo.owningPlayer.name) + ((plotInfo.owningPlayerID == localPlayerID) ? (" (" + Locale.compose("LOC_PLOT_TOOLTIP_YOU") + ")") : "") : undefined;
        const civLabel = Locale.compose(GameplayMap.getOwnerName(plotInfo.plotCoord.x, plotInfo.plotCoord.y));
        let cityLabel;
        let townFocus;
        let townFoodYield; //not using this for anything, but it's the net food sent from a Specialized Town to each connected City
        const tradeRoutes = [];
        const connectedSettlementNames = [];
        const citiesReceivingFood = [];
        const city = this.getOwningCity(plotInfo);

        getCityLabel: {
        if (!city) break getCityLabel;	

        cityLabel = Locale.stylize(`LOC_PLOT_MOD_TCS_${city.isTown ? 'TOWN' : 'CITY'}`, Locale.compose(city.name));
        
        // Get connections
        const connectedSettlements = city.getConnectedCities();
        if (connectedSettlements.length > 0) {
            if (city.isTown) {
                townFoodYield = city.Yields?.getNetYield(YieldTypes.YIELD_FOOD);
                if (townFoodYield) {
                    for (const townConnectedSettlementID of connectedSettlements) {
                        const townConnectedSettlement = Cities.get(townConnectedSettlementID);
                        if (townConnectedSettlement && !townConnectedSettlement.isTown)
                            citiesReceivingFood.push(townConnectedSettlement);
                    }	
                }
            }
            if (citiesReceivingFood.length > 0) 
                townFoodYield = Math.round(townFoodYield / citiesReceivingFood.length);
            
            // Build connection names list	
            for (const connectedsettlementID of connectedSettlements) {
                const connectedSettlement = Cities.get(connectedsettlementID);
                if (!connectedSettlement) continue;

                let nameSuffix = "";
                if(connectedSettlement.isTown && !city.isTown && connectedSettlement.Growth?.growthType != GrowthTypes.EXPAND)
                    nameSuffix = Locale.compose("LOC_PLOT_MOD_TCS_FOOD_ICON_RECEIVING");
                else if (!connectedSettlement.isTown && city.isTown && city.Growth?.growthType != GrowthTypes.EXPAND)
                    nameSuffix = Locale.compose("LOC_PLOT_MOD_TCS_FOOD_ICON_SENDING");
                connectedSettlementNames.push(Locale.compose(`LOC_PLOT_MOD_TCS_${connectedSettlement.isTown ? 'TOWN' : 'CITY'}`, connectedSettlement.name) + nameSuffix);
            }
            connectedSettlementNames.sort();						
        }
        
        // Get Town Focus
        if (city.isTown) {
            switch(city.Growth?.growthType) {
            case GrowthTypes.EXPAND:
                townFocus = "GROWING"
                break;
            default:
                townFocus = "SPECIALIZED";
                break;
            }
            //There are apparantly only 2 GrowthTypes: GrowthTypes.EXPAND and GrowthTypes.PROJECT.
            //EXPAND indicates a growing town, PROJECT indicates a specialized town. Each specialization has an entry in the Projects table.
            
            //TO DO: investigate further to see if we can figure out what Project a town has.
            //Potential info in production-chooser-helpers.js
        }
        
        // Get Trade Route counts
        if (plotInfo.owningPlayer && plotInfo.owningPlayerID && plotInfo.owningPlayerID != localPlayerID) {
            const localPlayerTrade = localPlayer?.Trade;
            const current = localPlayerTrade?.countPlayerTradeRoutesTo(city.owner) ?? 0;
            const capacity = localPlayerTrade?.getTradeCapacityFromPlayer(city.owner) ?? 0;
            if (capacity > 0) {
                tradeRoutes.push(current);
                tradeRoutes.push(capacity);
            }
        }
        }
        
        // Get relationship label (relationshipLabel)
        let relationshipLabel;
        if (this.getOption('show-player-relationships') == true && plotInfo.owningPlayer && plotInfo.owningPlayerID && plotInfo.owningPlayerID != localPlayerID) {
            // If Plot Owner is an Independent and the local player is its suzerain, display relationship
            if (plotInfo.owningPlayer.isMinor && plotInfo.owningPlayer.Influence?.hasSuzerain && plotInfo.owningPlayer.Influence.getSuzerain() == localPlayerID) {
                relationshipLabel = Locale.compose("LOC_PLOT_MOD_TCS_RELATIONSHIP_VASSAL")
            }
            else if (owningPlayerDiplomacy.isAtWarWith(localPlayerID)) {
                relationshipLabel = Locale.compose("LOC_PLOT_MOD_TCS_RELATIONSHIP_WAR");
            }
            else if (owningPlayerDiplomacy.hasAllied(localPlayerID)) {
                relationshipLabel = Locale.compose("LOC_PLOT_MOD_TCS_RELATIONSHIP_ALLIANCE", Locale.compose(owningPlayerDiplomacy.getRelationshipLevelName(localPlayerID)));
            }
            else {
                relationshipLabel = Locale.compose("LOC_PLOT_MOD_TCS_RELATIONSHIP_OTHER", Locale.compose(owningPlayerDiplomacy.getRelationshipLevelName(localPlayerID)));
            }
        }
        
        // Get district info
        const districtId = plotInfo.districtID;
        const district = (districtId) ? Districts.get(districtId) : undefined;
        const plotIsCityCenter = (district && district.type == DistrictTypes.CITY_CENTER);
        
        //================
        // Build Container
        //================
        
        // Leader & Civ & Relationship, City & Status
        if (playerLabel) {
            // City
            container.appendChild(this.addTitle(cityLabel ?? civLabel));
            
            // Player & Civ
            if (civLabel) {
                const ownerLeaderText = (relationshipLabel) ? (playerLabel + " " + relationshipLabel) : playerLabel;
                const plotTooltipOwnerLeader = this.addGenericText(ownerLeaderText, {'text-align': 'center'}, true);
                container.appendChild(plotTooltipOwnerLeader);
                
                if (!plotInfo.owningPlayer.isIndependent) {
                    let ownerCivText = civLabel;
                    if (tradeRoutes.length == 2 && plotIsCityCenter && !owningPlayerDiplomacy.isAtWarWith(localPlayerID)) {
                        const tradeString = '[icon:UNIT_MERCHANT]' + " " + tradeRoutes[0] + "/" + tradeRoutes[1];
                        ownerCivText += " " + tradeString;
                    }
                    const plotTooltipOwnerCiv = this.addGenericText(ownerCivText, this.styles.default);
                    container.appendChild(plotTooltipOwnerCiv);
                }
            }
            
            // Additional info for local player
            if (localPlayerID == plotInfo.owningPlayerID) {
                // Town Focus
                if (plotIsCityCenter && townFocus) {
                    const townFocusString = (townFocus == "GROWING") ? Locale.compose("LOC_PLOT_MOD_TCS_TOWN_GROWING") : Locale.compose("LOC_PLOT_MOD_TCS_TOWN_SPECIALIZED");
                    let tooltipTownFocusString = townFocusString;
                    if (townFocus != "GROWING")
                        tooltipTownFocusString = (citiesReceivingFood.length == 1) ? (townFocusString + " " + this.dividerDot + " " + Locale.compose("LOC_PLOT_MOD_TCS_TOWN_FEEDING_SINGULAR")) : (townFocusString + " " + TCS_DIVIDER_DOT + " " + Locale.compose("LOC_PLOT_MOD_TCS_TOWN_FEEDING_PLURAL", citiesReceivingFood.length));
                    const plotTooltipTownFocus = this.addGenericText(tooltipTownFocusString);
                    plotTooltipTownFocus.classList.add('text-2xs', 'text-center');
                    container.appendChild(plotTooltipTownFocus);
                }
                
                // Flag if city is not in trade network
                if (city && !city.Trade.isInTradeNetwork()) {
                    const toolTipNotInTradeNetwork = this.addGenericText(Locale.compose("LOC_PLOT_MOD_TCS_NOT_IN_TRADE_NETWORK"), Object.assign({
                        'text-align': 'center',
                        'color': '#CEA92F'
                    }, this.styles.banner), true);
                    container.appendChild(toolTipNotInTradeNetwork);
                }
                
                // Connections - shown when hovering over city center
                if (connectedSettlementNames.length > 0 && plotIsCityCenter) {
                    const plotTooltipConnectionsHeader = this.addGenericText("LOC_PLOT_MOD_TCS_CONNECTED", {
                        'text-align': 'center',
                        'font-weight': 'bold'
                    }, true);
                    plotTooltipConnectionsHeader.classList.add('text-2xs');
                    container.appendChild(plotTooltipConnectionsHeader);
                    
                    const plotTooltipConnectionsContainer = this.addSectionContainer({
                        'justify-content': 'center',
                        'align-content': 'center',
                        'flex-wrap': 'wrap',
                        'width': '100%',
                        'padding-right': '0.25rem',
                        'padding-left': '0.25rem',
                        'padding-bottom': '0.25rem'
                    });
                    
                    for (const settlementName of connectedSettlementNames) {
                        const plotTooltipConnectionsElement = this.addGenericText(settlementName, {
                            'text-align': 'left',
                            'margin-right': '0.5rem',
                            'max-height': '1.5rem'
                        }, true);
                        plotTooltipConnectionsElement.classList.add('text-2xs');
                        plotTooltipConnectionsContainer.appendChild(plotTooltipConnectionsElement);
                    }
                    
                    container.appendChild(plotTooltipConnectionsContainer);
                }
            }
        }
        
        //Hmm...do i need this?
        const plotTooltipConqueror = PrivusTooltips.defaultFn(PlotTooltipTypeName, 'getConquerorInfo').call(PrivusTooltips.getInstance(PlotTooltipTypeName), districtId);
        if (plotTooltipConqueror) {
            container.appendChild(plotTooltipConqueror);
        }
    }

    addUnitInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        const localPlayerID = GameContext.localPlayerID;
        if (GameplayMap.getRevealedState(localPlayerID, plotInfo.plotCoord.x, plotInfo.plotCoord.y) != RevealedStates.VISIBLE) {
            return;
        }
        const topUnit = PrivusTooltips.defaultFn(PlotTooltipTypeName, "getTopUnit").call(PrivusTooltips.getInstance(PlotTooltipTypeName), plotInfo.plotCoord);
        if (!topUnit) return;
        if (!Visibility.isVisible(localPlayerID, topUnit?.id)) return;
        
        let player = Players.get(topUnit.owner);
        if (!player) return;
        
        // Build Element: Unit Header
        container.appendChild(this.addTitle(Locale.compose("LOC_PLOT_MOD_TCS_UNITS")));
        
        // Build Elements: Unit
        const plotUnits = MapUnits.getUnits(plotInfo.plotCoord.x, plotInfo.plotCoord.y);
        const unitContainer = document.createElement("div");
        for (let i = 0; i < plotUnits.length && i < 4; i++) {
            let plotUnit = Units.get(plotUnits[i]);
            let unitName = Locale.compose(plotUnit.name);
            const unitDefinition = GameInfo.Units.lookup(plotUnit.type);
            player = Players.get(plotUnit.owner);
            const toolTipUnitInfo = document.createElement("div");
            if (player.id != localPlayerID && i == 0) {
                const playerDiplomacy = player?.Diplomacy;
                if (playerDiplomacy.isAtWarWith(localPlayerID))
                    this.setStyle(unitContainer, this.styles.banner);
            }
            toolTipUnitInfo.classList.add('text-center',"plot-tooltip__unitInfo");
            toolTipUnitInfo.innerHTML = Locale.stylize("LOC_PLOT_MOD_TCS_TOP_UNIT", "[icon:" + unitDefinition.UnitType + "] " + unitName, Locale.compose(player.id == localPlayerID ? "LOC_PLOT_MOD_TCS_YOURS" : player.name));
            unitContainer.appendChild(toolTipUnitInfo);
        }
        if (plotUnits.length > 3) {
            const toolTipUnitInfo = document.createElement("div");
            toolTipUnitInfo.classList.add('text-center',"plot-tooltip__unitInfo");
            toolTipUnitInfo.innerHTML = Locale.compose("LOC_PLOT_MOD_TCS_ADDITIONAL_UNITS", (plotUnits.length - 3));
            unitContainer.appendChild(toolTipUnitInfo);
        }

        container.appendChild(unitContainer);
    }

    addContinentInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        this.moreInfoTitle = false;
    }

    addTradeRouteInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;

        let continentName = Locale.compose(plotInfo.continentName);
        if(!continentName) {
            if(plotInfo.routeName) this.addMoreInfoTitle(container);
            return;
        };
        this.addMoreInfoTitle(container);


        const localPlayer = Players.get(GameContext.localPlayerID);
        if (localPlayer && localPlayer.isDistantLands(plotInfo.plotCoord))
            continentName += " " + Locale.compose("LOC_PLOT_MOD_TCS_DISTANT_LANDS");

        // Add Fresh Water info
        const freshWaterLabel = GameplayMap.isFreshWater(plotInfo.plotCoord.x, plotInfo.plotCoord.y) ? 
            " " + this.dividerDot + " " + Locale.compose("LOC_PLOT_MOD_TCS_FRESH_WATER") : "";
        const routeNameLabel = plotInfo.routeName ? (continentName + " " + this.dividerDot + " " + plotInfo.routeName) : continentName
        const tooltipLastLine = this.addGenericText(routeNameLabel + freshWaterLabel);
        tooltipLastLine.classList.add('text-2xs', 'text-center');
        container.appendChild(tooltipLastLine);
    }

    addEffectInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        

        const plotEffects = MapPlotEffects.getPlotEffects(plotInfo.plotIndex);
        const localPlayerID = GameContext.localPlayerID;
        let effectString = undefined;
        plotEffects?.forEach((item) => {
            const effectInfo = GameInfo.PlotEffects.lookup(item.effectType);
            if (item.onlyVisibleToOwner && item.owner != localPlayerID) return;
            if (!effectInfo) return;
            if(!effectString) {
                effectString = Locale.compose(effectInfo.Name);
                return;
            }
            effectString += " " + this.dividerDot + " " + Locale.compose(effectInfo.Name);
        });

        if(!effectString) return;

        this.addMoreInfoTitle(container);

		const toolTipPlotEffectsText = this.addGenericText(effectString);
		toolTipPlotEffectsText.classList.add('text-2xs', 'text-center');
		container.appendChild(toolTipPlotEffectsText);
    }

    addOriginalOwnerInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;

        const city = this.getOwningCity(plotInfo);
        const district = (plotInfo.districtID) ? Districts.get(plotInfo.districtID) : undefined;
        if (!city || city.owner == city.originalOwner || !district || district.type != DistrictTypes.CITY_CENTER) return;

        const toolTipOriginalOwner = this.addGenericText(Locale.compose("LOC_PLOT_MOD_TCS_ORIGINAL_FOUNDER", Players.get(city.originalOwner).name));
        toolTipOriginalOwner.classList.add('text-2xs', 'text-center');
        container.appendChild(toolTipOriginalOwner);
    }

    addCoordinateInfo(modIds, container, yieldsFlexbox, plotInfo, keysPressed) {
        if(keysPressed.shift) return;
        if (this.getOption('show-coordinates') != true) return;

        const toolTipCoordinates = this.addGenericText(Locale.compose("LOC_PLOT_MOD_TCS_COORDINATES", plotInfo.plotCoord.x, plotInfo.plotCoord.y));
        toolTipCoordinates.classList.add('text-2xs', 'text-center');
        container.appendChild(toolTipCoordinates);
    }


    /* Helper Functions */
    getOption(id) {
        const value = ModOptions.option('example-plot-tooltip-tcs', id)?.currentValue ?? false;
        console.debug(`[TCS-PLOT-TOOLTIP][DEBUG] ${id} = ${value}`);
        return value;
    }
    setStyle(element, style, log = false) {
        if(log)
            console.info(`[PRIVUS][TOOLTIP][DEBUG] <${element.tagName}> style:`);
        for (const [key, val] of Object.entries(style)) {
            element.style.setProperty(key, val);
            if(log) console.info(`[PRIVUS][TOOLTIP][DEBUG] ${key}: ${element.style.getPropertyValue(key)}`);
        }
        
    }

    addTitle(localizationKey) {
        // Container Element
        const containerElement = document.createElement("div");
        this.setStyle(containerElement, this.styles.container);

        // Left Element
        const leftElement = document.createElement("div");
        this.setStyle(leftElement, this.styles.lineLeft);
        
        // Middle Element
        const textElement = this.addGenericText(localizationKey, this.styles.title, true);
        
        // Right Element
        const rightElement = document.createElement("div");
        this.setStyle(rightElement, this.styles.lineRight);

        containerElement.appendChild(leftElement);
        containerElement.appendChild(textElement);
        containerElement.appendChild(rightElement);
        return containerElement;

    }

    addGenericText(localizationKey, style = {}, setInnerHTML = false, log = false) {
        const textElement = document.createElement("div");
        if (setInnerHTML) 
            textElement.innerHTML = Locale.stylize(localizationKey);
        else 
            textElement.setAttribute('data-l10n-id', localizationKey);

        this.setStyle(textElement, style, log);

        return textElement;
    }

    addIcon(iconCSS, style = {}) {
        const iconElement = document.createElement("div");
        this.setStyle(iconElement, style);
        iconElement.style.backgroundImage = iconCSS;
        return iconElement;
    }

    addShadowedIcon(iconCSS, style = {}, log = false) {
        const shadowElement = document.createElement("div");
        this.setStyle(shadowElement, Object.assign({}, style, {
            'transform': 'translate(-0.0999999999rem, 0.0999999999rem)',
            'fxs-background-image-tint': 'black'
        }), log);
        shadowElement.style.backgroundImage = iconCSS;

        const extraProperties = {
            'transform': 'translate(0.0999999999rem, -0.0999999999rem)',
        };
        if(style.height) extraProperties.height = style.height;
        if(style.width) extraProperties.width = style.width;
        
        const iconElement = this.addIcon(iconCSS, Object.assign({}, this.styles.icon, extraProperties));
        shadowElement.appendChild(iconElement);
        return shadowElement;
    }

    
    addConstructibleIcon(item, style = {}) {
        let constructibleIconCSS;
        let size = '2rem';
        let marginRight = '0.333333337rem';
        const constructibleType = (item.Info) ? item.Info.ConstructibleType : item.ConstructibleType;
        if (constructibleType.startsWith("BUILDING"))
            constructibleIconCSS = UI.getIconCSS(constructibleType, "CONSTRUCTIBLE");
        else if (constructibleType.startsWith("IMPROVEMENT")) {
            if (this.missingIcons.includes(constructibleType)) 
                constructibleIconCSS = UI.getIconCSS('IMPROVEMENT_HILLFORT', "CONSTRUCTIBLE");
            else 
                constructibleIconCSS = UI.getIconCSS(constructibleType, "CONSTRUCTIBLE");
            if (!constructibleIconCSS) 
                constructibleIconCSS = UI.getIconCSS('IMPROVEMENT_EXPEDITION_BASE', "CONSTRUCTIBLE");
            size = '2.25rem';
        }
        else if (constructibleType.startsWith("WONDER")) {
            constructibleIconCSS = UI.getIconCSS(constructibleType, "CONSTRUCTIBLE");
            size = '2.6666666667rem';
            marginRight = '0.666666667rem';
        }	
        if (!constructibleIconCSS) return;

		return this.addShadowedIcon(constructibleIconCSS, Object.assign({}, this.styles.icon, {
			'height': size,
			'width': size,
			'margin-right': marginRight
        }, style));
    }

    addConstructibleTag(text) {
        const textElement = this.addGenericText(text);
        textElement.classList.add('text-2xs', 'text-left', 'font-body-sm');
        return textElement;
    }

    addSectionContainer(style = {}, direction = 'row') {
        const containerElement = document.createElement("div");
        this.setStyle(containerElement, Object.assign({
            'position': 'relative',
            'width': '100%',
            'display': 'flex',
            'justify-content': 'flex-start',
            'align-content': 'center',
        }, style, {'flex-direction': direction}));
        
        return containerElement;
    }

    addMoreInfoTitle(container) {
        if(this.moreInfoTitle) return;
        container.appendChild(this.addTitle(Locale.compose("LOC_PLOT_MOD_TCS_MORE_INFO")));
        this.moreInfoTitle = true;
    }

    getFeatureLabel(feature, plotCoord) {
        if (GameplayMap.isVolcano(plotCoord.x, plotCoord.y)) {
            const active = GameplayMap.isVolcanoActive(plotCoord.x, plotCoord.y);
            const volcanoStatus = (active) ? 'LOC_VOLCANO_ACTIVE' : 'LOC_PLOT_MOD_TCS_DORMANT';
            const volcanoName = GameplayMap.getVolcanoName(plotCoord.x, plotCoord.y);
            return (volcanoName ? Locale.compose("LOC_PLOT_MOD_TCS_VOLCANO", volcanoName, volcanoStatus) : Locale.compose("LOC_PLOT_MOD_TCS_UNNAMED_VOLCANO", volcanoStatus));
        }
       
        return Locale.compose(feature.Name);
    }

    getOwningCity(plotInfo) {
        if (!plotInfo.owningPlayer || !Players.isAlive(plotInfo.owningPlayerID))
            return undefined;
        
        const playerCities = plotInfo.owningPlayer.Cities;
        if (!playerCities) return undefined;

        for (const city of playerCities.getCities()) 
            if (ComponentID.isMatch(city.id, plotInfo.owningCityID) == true) 
                return city;
        return undefined;
    }

    getWorkerString(plotInfo) {
		const player = plotInfo.owningPlayer;
        const city = this.getOwningCity(plotInfo);
        const district = plotInfo.districtID ? Districts.get(plotInfo.districtID) : undefined;

        if (plotInfo.owningPlayerID != GameContext.localPlayerID) return undefined;
        if (!city || !district || !(district.type == DistrictTypes.URBAN || district.type == DistrictTypes.CITY_CENTER)) return undefined;
        if (city.isTown) return undefined;

        const numWorkerSlots = city.Workers.getCityWorkerCap();
        if (numWorkerSlots <= 0) return undefined;

        const cityPlots = city.Workers.GetAllPlacementInfo();
        if (!cityPlots) return undefined;

        const plot = cityPlots.find(p => p.PlotIndex == GameplayMap.getIndexFromLocation(plotInfo.plotCoord));
        if (!plot) return undefined;

        const numWorkers = plot.NumWorkers;
        return (numWorkerSlots == numWorkers) ? numWorkers : (numWorkers + "/" + numWorkerSlots);
    }

    addPotentialImprovements(filterFn) {
        const infos = GameInfo.District_FreeConstructibles.filter(item => filterFn(item));
        if (!infos) return;

        for (const info of infos) {
            const constructible = GameInfo.Constructibles.find(item => (item.ConstructibleType == info.ConstructibleType));
            if (this.potentialImprovementTypes.includes(constructible.ConstructibleType) || !(!constructible.Age || Database.makeHash(constructible?.Age ?? "") == Game.age)) continue;
            this.potentialImprovements.push(constructible);
            this.potentialImprovementTypes.push(constructible.ConstructibleType);
        }
    }

    addPotentialUniqueImprovements(filterPropertyName, land, uniqueImprovement, validImprovements, additionalCondition = true) {
        const valid = validImprovements.filter(c => c.ConstructibleType == uniqueImprovement.ConstructibleType);
        if(!land || !valid || !additionalCondition) return false;
        for (const v of valid) {
            if (this.potentialImprovementTypes.includes(uniqueImprovement.ConstructibleType) || v[filterPropertyName] != land[filterPropertyName]) continue;
            const constructible = GameInfo.Constructibles.find(item => (item.ConstructibleType == uniqueImprovement.ConstructibleType));
            this.potentialImprovements.push(constructible);
            this.potentialImprovementTypes.push(constructible.ConstructibleType);
            break;
        }
        return true;
    }
}


PrivusTooltips.registerModdedSections(PlotTooltipTypeName, 'example-plot-tooltip-tcs', ExamplePlotTooltipTCS, 
    'addSettlerInfo',                  //Order: 2 (default)
    //addTerrainAndBiomeInfo (default) //Order: 4 (default)
    'addFeatureInfo',                  //Order: 6 (default)
    //addYieldsFlexbox (default)       //Order: 7 (default is 12)
    'addYields',                       //Order: 8 (default is 14)
    'addDistrictInfo',                 //Order: 10 (default)
    'addSpecialistInfo',               //Order: 16 (default)
    'addConstructibleInfo',            //Order: 18 (default is 22)
    'addNaturalWonderInfo',            //Order: 19 (no default)
    'addResourceInfo',                 //Order: 20 (default)
    'addOwnerInfo',                    //Order: 22 (default is 18)
    'addUnitInfo',                     //Order: 24 (default is 28)
    'addContinentInfo',                //Order: 25 (default is 8)
    'addTradeRouteInfo',               //Order: 26 (default)
    'addEffectInfo',                   //Order: 28 (default is 24)
    'addOriginalOwnerInfo',            //Order: 30 (no default)
    'addCoordinateInfo'                //Order: 32 (no default)
);

PrivusTooltips.setSectionOrders(PlotTooltipTypeName, {
    addYieldsFlexbox: 7,
    addYields: 8,
    addConstructibleInfo: 18,
    addNaturalWonderInfo: 19,
    addOwnerInfo: 22,
    addUnitInfo: 24,
    addContinentInfo: 25,
    addEffectInfo: 28,
    addOriginalOwnerInfo: 30,
    addCoordinateInfo: 32
});