import ModOptions from '/privus-api/privus-options-manager.js';
import { OptionType } from '/core/ui/options/model-options.js';

ModOptions.addOption('example-plot-tooltip-tcs', 
    'show-potential-improvements', OptionType.Checkbox, 
    "LOC_OPTIONS_TCS_SHOW_POTENTIAL_IMPROVEMENT_LABEL", 
    "LOC_OPTIONS_TCS_SHOW_POTENTIAL_IMPROVEMENT_DESCRIPTION", 
    true);

ModOptions.addOption('example-plot-tooltip-tcs', 
    'show-player-relationships', OptionType.Checkbox, 
    "LOC_OPTIONS_TCS_SHOW_PLAYER_RELATIONSHIP_LABEL", 
    "LOC_OPTIONS_TCS_SHOW_PLAYER_RELATIONSHIP_DESCRIPTION", 
    true);


ModOptions.addOption('example-plot-tooltip-tcs', 
    'show-quarter-descriptions', OptionType.Checkbox, 
    "LOC_OPTIONS_TCS_SHOW_QUARTER_DESCRIPTION_LABEL", 
    "LOC_OPTIONS_TCS_SHOW_QUARTER_DESCRIPTION_DESCRIPTION", 
    true);

//TODO?: make this a dropdown?
ModOptions.addOption('example-plot-tooltip-tcs', 
    'building-display-mode', OptionType.Checkbox, 
    "LOC_OPTIONS_TCS_BUILDING_DISPLAY_MODE_LABEL", 
    "LOC_OPTIONS_TCS_BUILDING_DISPLAY_MODE_DESCRIPTION",
    true);
    
ModOptions.addOption('example-plot-tooltip-tcs', 
    'show-coordinates', OptionType.Checkbox, 
    "LOC_OPTIONS_TCS_SHOW_COORDINATES_LABEL", 
    "LOC_OPTIONS_TCS_SHOW_COORDINATES_DESCRIPTION", 
    false);

ModOptions.addOption('example-plot-tooltip-tcs', 
    'debug-mode', OptionType.Checkbox,
    "LOC_OPTIONS_TCS_ENABLE_DEBUG_LABEL", 
    "LOC_OPTIONS_TCS_ENABLE_DEBUG_DESCRIPTION", 
    false);