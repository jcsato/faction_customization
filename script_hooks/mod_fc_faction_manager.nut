::mods_hookClass("factions/faction_manager", function(fm) {
	local createNobleHouses = fm.createNobleHouses;

	fm.createNobleHouses = function() {
		local nobles = createNobleHouses();
		local archetypeOne, archetypeTwo, archetypeThree;
		foreach (archetypeGroup in Const.FactionArchetypes) {
			foreach (archetype in archetypeGroup) {
				if (archetype.Traits.find(World.State.m.CampaignSettings.NobleOneTraits[0]) != null
					&& archetype.Traits.find(World.State.m.CampaignSettings.NobleOneTraits[1]) != null
					&& archetype.Traits.find(World.State.m.CampaignSettings.NobleOneTraits[2]) != null) {
						archetypeOne = archetype;
					}
				else if (archetype.Traits.find(World.State.m.CampaignSettings.NobleTwoTraits[0]) != null
					&& archetype.Traits.find(World.State.m.CampaignSettings.NobleTwoTraits[1]) != null
					&& archetype.Traits.find(World.State.m.CampaignSettings.NobleTwoTraits[2]) != null) {
						archetypeTwo = archetype;
					}
				else if (archetype.Traits.find(World.State.m.CampaignSettings.NobleThreeTraits[0]) != null
					&& archetype.Traits.find(World.State.m.CampaignSettings.NobleThreeTraits[1]) != null
					&& archetype.Traits.find(World.State.m.CampaignSettings.NobleThreeTraits[2]) != null) {
						archetypeThree = archetype;
					}
			}
		}

		nobles[0].setBanner(World.State.m.CampaignSettings.NobleOneBanner);
		nobles[0].setName(World.State.m.CampaignSettings.NobleOneName);
		nobles[0].m.Traits = [];
		foreach(trait in archetypeOne.Traits)
			nobles[0].addTrait(trait);

		nobles[0].setDescription(archetypeOne.Description);
		nobles[0].setMotto("\"" + World.State.m.CampaignSettings.NobleOneMotto + "\"");

		nobles[1].setBanner(World.State.m.CampaignSettings.NobleTwoBanner);
		nobles[1].setName(World.State.m.CampaignSettings.NobleTwoName);
		nobles[1].m.Traits = [];
		foreach(trait in archetypeTwo.Traits)
			nobles[1].addTrait(trait);

		nobles[1].setDescription(archetypeTwo.Description);
		nobles[1].setMotto("\"" + World.State.m.CampaignSettings.NobleTwoMotto + "\"");

		nobles[2].setBanner(World.State.m.CampaignSettings.NobleThreeBanner);
		nobles[2].setName(World.State.m.CampaignSettings.NobleThreeName);
		nobles[2].m.Traits = [];
		foreach(trait in archetypeThree.Traits)
			nobles[2].addTrait(trait);

		nobles[2].setDescription(archetypeThree.Description);
		nobles[2].setMotto("\"" + World.State.m.CampaignSettings.NobleThreeMotto + "\"");

		return nobles;
	};
});
