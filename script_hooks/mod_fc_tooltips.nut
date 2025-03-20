::mods_hookClass("ui/screens/tooltip/tooltip_events", function(te) {
	local general_queryUIElementTooltipData = te.general_queryUIElementTooltipData;

	te.general_queryUIElementTooltipData = function(_entityId, _elementId, _elementOwner) {
		switch(_elementId) {
			case "menu-screen.new-campaign.FactionOneName": {
				return [
					{ id = 1, type = "title", text = "Noble House Name" },
					{ id = 2, type = "description", text = "The name of one of the noble houses in the world." }
				];
			}
            case "menu-screen.new-campaign.FactionTwoName": {
                return [
                    { id = 1, type = "title", text = "Noble House Name" },
                    { id = 2, type = "description", text = "The name of one of the noble houses in the world." }
                ];
            }
			case "menu-screen.new-campaign.FactionThreeName": {
                return [
                    { id = 1, type = "title", text = "Noble House Name" },
                    { id = 2, type = "description", text = "The name of one of the noble houses in the world." }
                ];
            }
		}

		return general_queryUIElementTooltipData(_entityId, _elementId, _elementOwner);
	}
});
