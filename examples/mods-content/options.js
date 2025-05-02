import ModOptions from '/privus-api/privus-options-manager.js';
import { OptionType } from '/core/ui/options/model-options.js';

ModOptions.addOption('example-mods-content', 'show-core', OptionType.Checkbox, 
    "LOC_EXAMPLE_MOD_OPTIONS_SHOW_CORE", "LOC_EXAMPLE_MOD_OPTIONS_SHOW_CORE_DESC", false);