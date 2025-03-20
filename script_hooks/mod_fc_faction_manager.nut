::mods_hookClass("factions/faction_manager", function(fm) {
	local createNobleHouses = fm.createNobleHouses;

	fm.createNobleHouses = function() {
		local nobles = createNobleHouses();

		nobles[0].setBanner(World.State.m.CampaignSettings.NobleOneBanner);
		nobles[0].setName(World.State.m.CampaignSettings.NobleOneName);
		nobles[1].setBanner(World.State.m.CampaignSettings.NobleTwoBanner);
		nobles[1].setName(World.State.m.CampaignSettings.NobleTwoName);
		nobles[2].setBanner(World.State.m.CampaignSettings.NobleThreeBanner);
		nobles[2].setName(World.State.m.CampaignSettings.NobleThreeName);

		return nobles;
	};
});
