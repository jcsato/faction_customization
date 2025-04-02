::mods_hookExactClass("ui/screens/menu/modules/new_campaign_menu_module", function(ncmm) {
	local onModuleShown = ::mods_getMember(ncmm, "onModuleShown");
	local parseSettingsFromJS = ::mods_getMember(ncmm, "parseSettingsFromJS");

	local nameForArchetype = function(archetype) {
		if (archetype.Traits.find(Const.FactionTrait.Warmonger) != null && archetype.Traits.find(Const.FactionTrait.ManOfThePeople) != null)
			return "Paladin";
		else if (archetype.Traits.find(Const.FactionTrait.Sheriff) != null && archetype.Traits.find(Const.FactionTrait.ManOfThePeople) != null)
			return "Benevolent Ruler";
		else if (archetype.Traits.find(Const.FactionTrait.Sheriff) != null && archetype.Traits.find(Const.FactionTrait.Collector) != null)
			return "Honest Trader";
		else if (archetype.Traits.find(Const.FactionTrait.Warmonger) != null && archetype.Traits.find(Const.FactionTrait.Tyrant) != null)
			return "Conqueror";
		else if (archetype.Traits.find(Const.FactionTrait.Warmonger) != null && archetype.Traits.find(Const.FactionTrait.Marauder) != null)
			return "Raider";
		else if (archetype.Traits.find(Const.FactionTrait.Schemer) != null && archetype.Traits.find(Const.FactionTrait.Tyrant) != null)
			return "Malicious Ruler";
		else if (archetype.Traits.find(Const.FactionTrait.Marauder) != null && archetype.Traits.find(Const.FactionTrait.Tyrant) != null)
			return "Despot";
		else if (archetype.Traits.find(Const.FactionTrait.Schemer) != null && archetype.Traits.find(Const.FactionTrait.Collector) != null)
			return "Ruthless Collector";
		else if (archetype.Traits.find(Const.FactionTrait.ManOfThePeople) != null && archetype.Traits.find(Const.FactionTrait.Collector) != null)
			return "Explorer";
		else if (archetype.Traits.find(Const.FactionTrait.Marauder) != null && archetype.Traits.find(Const.FactionTrait.Schemer) != null)
			return "Anarchist";
		else
			return "Noble";
	}

	local mapTraitToName = function(trait) {
		switch (trait) {
			case Const.FactionTrait.Warmonger:
				return "Warmonger"
			case Const.FactionTrait.Tyrant:
				return "Tyrant"
			case Const.FactionTrait.Marauder:
				return "Marauder"
			case Const.FactionTrait.Schemer:
				return "Schemer"
			case Const.FactionTrait.ManOfThePeople:
				return "Man of the People"
			case Const.FactionTrait.Sheriff:
				return "Sheriff"
			case Const.FactionTrait.Collector:
				return "Collector"
		}

		return "Noble";
	}

	local traitsforArchetype = function(archetype) {
		return [ mapTraitToName(archetype.Traits[1]), mapTraitToName(archetype.Traits[2]) ];
	}

	::mods_override(ncmm, "onModuleShown", function() {
		local archetypes = [];
		local archetypeIndex = 0;

		foreach(archetypeGroup in Const.FactionArchetypes) {
			foreach(archetype in archetypeGroup) {
				archetypes.push({
					ID = archetypeIndex
					Name = nameForArchetype(archetype)
					Traits = traitsforArchetype(archetype)
					RawTraits = archetype.Traits
					Mottos = archetype.Mottos
				});

				++archetypeIndex;
			}
		}

		local factionData = {
			NobleNames = Const.Strings.NobleHouseNames
			NobleArchetypes = archetypes
		}
		m.JSHandle.asyncCall("setFactionData", factionData);

		onModuleShown();
	});

	::mods_override(ncmm, "parseSettingsFromJS", function(_settings) {
		local settings = parseSettingsFromJS(_settings);

		settings.NobleOneBanner <- _settings.nobleOneBanner;
		settings.NobleOneName <- _settings.nobleOneName;
		settings.NobleOneTraits <- _settings.nobleOneArchetype;
		settings.NobleOneMotto <- _settings.nobleOneMotto;

		settings.NobleTwoBanner <- _settings.nobleTwoBanner;
		settings.NobleTwoName <- _settings.nobleTwoName;
		settings.NobleTwoTraits <- _settings.nobleTwoArchetype;
		settings.NobleTwoMotto <- _settings.nobleTwoMotto;

		settings.NobleThreeBanner <- _settings.nobleThreeBanner;
		settings.NobleThreeName <- _settings.nobleThreeName;
		settings.NobleThreeTraits <- _settings.nobleThreeArchetype;
		settings.NobleThreeMotto <- _settings.nobleThreeMotto;

		return settings;
	});
});
