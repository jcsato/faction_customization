::mods_hookExactClass("ui/screens/menu/modules/new_campaign_menu_module", function(ncmm) {
	local parseSettingsFromJS = ::mods_getMember(ncmm, "parseSettingsFromJS");

	::mods_override(ncmm, "parseSettingsFromJS", function(_settings) {
		local settings = parseSettingsFromJS(_settings);

		settings.NobleOneBanner <- _settings.nobleOneBanner;
		settings.NobleOneName <- _settings.nobleOneName;
		settings.NobleTwoBanner <- _settings.nobleTwoBanner;
		settings.NobleTwoName <- _settings.nobleTwoName;
		settings.NobleThreeBanner <- _settings.nobleThreeBanner;
		settings.NobleThreeName <- _settings.nobleThreeName;

		return settings;
	});
});
