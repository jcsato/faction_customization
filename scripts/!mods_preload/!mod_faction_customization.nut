::mods_registerMod("faction_customization", 1.1, "Sato's Faction Customization");

::mods_queue("faction_customization", null, function() {
	::mods_registerCSS("mod_fc_shim.css");
	::mods_registerJS("mod_fc_shim.js");

	::include("script_hooks/mod_fc_faction_manager");
	::include("script_hooks/mod_fc_new_campaign_menu_module");
	::include("script_hooks/mod_fc_tooltips");
});
