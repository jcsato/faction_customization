"use strict";

// tooltip_identifier.js
TooltipIdentifier.MenuScreen.NewCampaign.FactionNames = [
	'menu-screen.new-campaign.FactionOneName',
	'menu-screen.new-campaign.FactionTwoName',
	'menu-screen.new-campaign.FactionThreeName'
];

// new_campaign_menu_module.js
NewCampaignMenuModule.prototype.NOBLE_BANNERS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
NewCampaignMenuModule.prototype.mNobleNames = [];
NewCampaignMenuModule.prototype.mNobleArchetypes = [];
NewCampaignMenuModule.prototype.mFactionsPanel = null;
NewCampaignMenuModule.prototype.mFactions = [
	{ name: "", banner: -1, archetype: {}, motto: "" },
	{ name: "", banner: -1, archetype: {}, motto: "" },
	{ name: "", banner: -1, archetype: {}, motto: "" }
];
NewCampaignMenuModule.prototype.mNobleNameInputs = [null, null, null];
NewCampaignMenuModule.prototype.mNobleBannerImages = [null, null, null];
NewCampaignMenuModule.prototype.mNobleArchetypeInputs = [null, null, null];
NewCampaignMenuModule.prototype.mNobleMottoInputs = [null, null, null];

NewCampaignMenuModule.prototype.setFactionData = function(_data) {
	this.mNobleNames = _data.NobleNames;
	this.mNobleArchetypes = _data.NobleArchetypes;
};

var originalShowFC = NewCampaignMenuModule.prototype.show;
NewCampaignMenuModule.prototype.show = function() {
	// Hack: modding script hooks doesn't register JS until the first time the main menu is loaded
	//  At that point, NewCampaignMenuModule has already been created, so we need to re-run panel creation
	if (this.mFactionsPanel == null) {
		var contentContainer = this.mDialogContainer.findDialogContentContainer();
		this.buildFactionsPanel(contentContainer);
	}

    // Bind tooltips, since bindTooltips is unhookable, just like createDIV
	this.mNobleNameInputs.forEach(function(input, index) {
		input.bindTooltip({ contentType: 'ui-element', elementId: TooltipIdentifier.MenuScreen.NewCampaign.FactionNames[index] });
	});

	originalShowFC.call(this);
}

var originalBuildPanelsFC = NewCampaignMenuModule.prototype.buildPanels;
NewCampaignMenuModule.prototype.buildPanels = function(container) {
    originalBuildPanelsFC.call(this, container);

    this.buildFactionsPanel(container);
}

NewCampaignMenuModule.prototype.buildFactionsPanel = function(container) {
	this.mFactionsPanel = $('<div class="display-none"/>');
	container.append(this.mFactionsPanel);

	var panelContents = $('<div class="factions-panel-contents"/>');
	this.mFactionsPanel.append(panelContents);

	var title = $('<div class="title title-font-big font-color-title">Faction Customization</div>');
	panelContents.append(title);

    var factionsContainer = $('<div class="factions-container"/>');
    this.mFactionsPanel.append(factionsContainer);

	this.initializeAndBuildPanel();
}

NewCampaignMenuModule.prototype.initializeAndBuildPanel = function() {
	this.initializeFactionData();

	var factionsContainer = this.mFactionsPanel.find(".factions-container");
    this.buildFactionColumn(factionsContainer, 1);
    this.buildFactionColumn(factionsContainer, 2);
    this.buildFactionColumn(factionsContainer, 3);
},

NewCampaignMenuModule.prototype.initializeFactionData = function() {
	var seed = this.cyrb53(this.mSeed.getInputText());
	var getRand = this.splitmix32(seed);

	// Assign a random banner between 2-10 - banner 1 is the castle head and shouldn't be there by default
	this.mFactions[0].banner = this.NOBLE_BANNERS[Math.floor(getRand() * (this.NOBLE_BANNERS.length - 1)) + 1];

	do {
		this.mFactions[1].banner = this.NOBLE_BANNERS[Math.floor(getRand() * (this.NOBLE_BANNERS.length - 1)) + 1];
	} while(this.mFactions[1].banner == this.mFactions[0].banner);

	do {
		this.mFactions[2].banner = this.NOBLE_BANNERS[Math.floor(getRand() * (this.NOBLE_BANNERS.length - 1)) + 1];
	} while(this.mFactions[2].banner == this.mFactions[0].banner || this.mFactions[2].banner == this.mFactions[1].banner);

	if (this.mNobleNames.length <= 0)
		return;

	// Assign different names to the various factions
	this.mFactions[0].name = this.mNobleNames[Math.floor(getRand() * this.mNobleNames.length)];

	do {
		this.mFactions[1].name = this.mNobleNames[Math.floor(getRand() * this.mNobleNames.length)];
	} while(this.mFactions[1].name == this.mFactions[0].name);

	do {
		this.mFactions[2].name = this.mNobleNames[Math.floor(getRand() * this.mNobleNames.length)];
	} while(this.mFactions[2].name == this.mFactions[0].name || this.mFactions[2].name == this.mFactions[1].name);

	// Assign different archetypes to the various factions
	this.mFactions[0].archetype = this.mNobleArchetypes[Math.floor(getRand() * this.mNobleArchetypes.length)];

	do {
		this.mFactions[1].archetype = this.mNobleArchetypes[Math.floor(getRand() * this.mNobleArchetypes.length)];
	} while(this.mFactions[1].archetype == this.mFactions[0].archetype);

	do {
		this.mFactions[2].archetype = this.mNobleArchetypes[Math.floor(getRand() * this.mNobleArchetypes.length)];
	} while(this.mFactions[2].archetype == this.mFactions[0].archetype || this.mFactions[2].archetype == this.mFactions[1].archetype);

	// Assign different mottos to the various factions
	this.mFactions[0].motto = this.mFactions[0].archetype.Mottos[Math.floor(getRand() * this.mFactions[0].archetype.Mottos.length)];
	this.mFactions[1].motto = this.mFactions[1].archetype.Mottos[Math.floor(getRand() * this.mFactions[1].archetype.Mottos.length)];
	this.mFactions[2].motto = this.mFactions[2].archetype.Mottos[Math.floor(getRand() * this.mFactions[2].archetype.Mottos.length)];
}

NewCampaignMenuModule.prototype.buildFactionColumn = function(container, faction) {
    var self = this;

    var factionColumn = container.find('#faction-' + faction + '-container');
	if (factionColumn.length <= 0) {
		factionColumn = $('<div id="faction-' + faction + '-container" class="faction-container"/>');
		container.append(factionColumn);
	} else {
		this.mNobleNameInputs[faction - 1].remove();
		this.mNobleNameInputs[faction - 1] = null;

		this.mNobleBannerImages[faction - 1].remove();
		this.mNobleBannerImages[faction - 1] = null;

		this.mNobleArchetypeInputs[faction - 1].remove();
		this.mNobleArchetypeInputs[faction - 1] = null;

		this.mNobleMottoInputs[faction - 1].remove();
		this.mNobleMottoInputs[faction - 1] = null;

		factionColumn.empty();
	}

	var label = $('<div class="title title-font-big font-color-title">House</div>');
	factionColumn.append(label);

	var factionNameInput = $('<div class="l-input"/>');
	factionColumn.append(factionNameInput);

	this.mNobleNameInputs[faction - 1] = factionNameInput.createInput("", 0, 32, 1, function (_input) {
		if (self.mStartButton !== null) self.mStartButton.enableButton(_input.getInputTextLength() >= 1);

		self.mFactions[faction - 1].name = _input.getInputText();
	}, 'title-font-big font-bold font-color-brother-name'); 
	this.mNobleNameInputs[faction - 1].setInputText(this.mFactions[faction - 1].name);

	var bannerTable = $('<table class="faction-banner-table" width="100%""><tr><td width="10%"><div class="l-button prev-banner-button"/></td><td width="80%" class="banner-image-container"></td><td width="10%"><div class="l-button next-banner-button"/></td></tr></table>');
	factionColumn.append(bannerTable);

	var prevBanner = bannerTable.find('.prev-banner-button:first');
	prevBanner.createImageButton(Path.GFX + Asset.BUTTON_PREVIOUS_BANNER, function() {
		self.setNextAvailableFactionBanner(faction, -1);
	}, '', 6);

	var nextBanner = bannerTable.find('.next-banner-button:first');
	nextBanner.createImageButton(Path.GFX + Asset.BUTTON_NEXT_BANNER, function() {
		self.setNextAvailableFactionBanner(faction, 1);
	}, '', 6);

	var bannerImage = bannerTable.find('.banner-image-container:first');
	this.mNobleBannerImages[faction - 1] = bannerImage.createImage(Path.GFX + this.getBannerImageForFaction(faction), function(_image) {
		_image.removeClass('display-none').addClass('display-block');
	}, null, 'display-none banner-image');

	var archetypeTable = $('<table class="faction-archetype-table" width="100%""><tr><td width="10%"><div class="l-button prev-archetype-button"/></td><td width="80%" class="archetype-container"></td><td width="10%"><div class="l-button next-archetype-button"/></td></tr></table>');
	factionColumn.append(archetypeTable);

	var prevArchetype = archetypeTable.find('.prev-archetype-button:first');
	prevArchetype.createImageButton(Path.GFX + Asset.BUTTON_PREVIOUS_BANNER, function() {
		self.setNextAvailableFactionArchetype(faction, -1);
	}, '', 6);

	var nextArchetype = archetypeTable.find('.next-archetype-button:first');
	nextArchetype.createImageButton(Path.GFX + Asset.BUTTON_NEXT_BANNER, function() {
		self.setNextAvailableFactionArchetype(faction, 1);
	}, '', 6);

	var factionArchetype = archetypeTable.find('.archetype-container:first');
	factionArchetype.html(this.getArchetypeHTMLForFaction(faction));
	this.mNobleArchetypeInputs[faction - 1] = factionArchetype;

	var mottoTable = $('<table class="faction-motto-table" width="100%""><tr><td width="10%"><div class="l-button prev-motto-button"/></td><td width="80%" class="motto-container"></td><td width="10%"><div class="l-button next-motto-button"/></td></tr></table>');
	factionColumn.append(mottoTable);

	var prevMotto = mottoTable.find('.prev-motto-button:first');
	prevMotto.createImageButton(Path.GFX + Asset.BUTTON_PREVIOUS_BANNER, function() {
		self.setNextAvailableFactionMotto(faction, -1);
	}, '', 6);

	var nextMotto = mottoTable.find('.next-motto-button:first');
	nextMotto.createImageButton(Path.GFX + Asset.BUTTON_NEXT_BANNER, function() {
		self.setNextAvailableFactionMotto(faction, 1);
	}, '', 6);

	var factionMotto = mottoTable.find('.motto-container:first');
	factionMotto.html(this.getMottoHTMLForFaction(faction));
	this.mNobleMottoInputs[faction - 1] = factionMotto;
}

NewCampaignMenuModule.prototype.setNextAvailableFactionBanner = function(faction, offset) {
	var secondFaction = faction + 1 > 3 ? 1 : faction + 1;
	var thirdFaction = faction - 1 < 1 ? 3 : faction - 1;

	var cursor = this.NOBLE_BANNERS.indexOf(this.mFactions[faction - 1].banner);
	do {
		cursor += offset;

		if (cursor == this.NOBLE_BANNERS.length)
			cursor = 0;
		else if (cursor == -1)
			cursor = this.NOBLE_BANNERS.length - 1;

	} while (this.NOBLE_BANNERS[cursor] == this.mFactions[secondFaction - 1].banner || this.NOBLE_BANNERS[cursor] == this.mFactions[thirdFaction - 1].banner)

	this.mFactions[faction - 1].banner = this.NOBLE_BANNERS[cursor];

	this.mNobleBannerImages[faction - 1].attr('src', Path.GFX + this.getBannerImageForFaction(faction));
}

NewCampaignMenuModule.prototype.getBannerImageForFaction = function(faction) {
	return "ui/banners/factions/banner_" + (this.mFactions[faction - 1].banner < 10 ? "0" : "") + this.mFactions[faction - 1].banner + ".png";
}

NewCampaignMenuModule.prototype.setNextAvailableFactionArchetype = function(faction, offset) {
	var secondFaction = faction + 1 > 3 ? 1 : faction + 1;
	var thirdFaction = faction - 1 < 1 ? 3 : faction - 1;

	// for once, strict object equality actually works in my favor
	var cursor = this.mNobleArchetypes.indexOf(this.mFactions[faction - 1].archetype);
	do {
		cursor += offset;

		if (cursor == this.mNobleArchetypes.length)
			cursor = 0;
		else if (cursor == -1)
			cursor = this.mNobleArchetypes.length - 1;

	} while (this.mNobleArchetypes[cursor] == this.mFactions[secondFaction - 1].archetype || this.mNobleArchetypes[cursor] == this.mFactions[thirdFaction - 1].archetype)

	this.mFactions[faction - 1].archetype = this.mNobleArchetypes[cursor];
	// We don't care about using `Math.random` here because we only need consistent seeding with splitmix32 for initial state
	this.mFactions[faction - 1].motto = this.mFactions[faction - 1].archetype.Mottos[Math.floor(Math.random() * this.mFactions[faction - 1].archetype.Mottos.length)];

	this.mNobleArchetypeInputs[faction - 1].html(this.getArchetypeHTMLForFaction(faction));
	this.mNobleMottoInputs[faction - 1].html(this.getMottoHTMLForFaction(faction));
}

NewCampaignMenuModule.prototype.getArchetypeHTMLForFaction = function(faction) {
	return '<span class="title-font-normal font-color-title">' + this.mFactions[faction - 1].archetype.Name + '</span>';
}

NewCampaignMenuModule.prototype.setNextAvailableFactionMotto = function(faction, offset) {
	var archetype = this.mFactions[faction - 1].archetype;
	var cursor = archetype.Mottos.indexOf(this.mFactions[faction - 1].motto);

	cursor += offset;

	if (cursor == archetype.Mottos.length)
		cursor = 0;
	else if (cursor == -1)
		cursor = archetype.Mottos.length - 1;

	this.mFactions[faction - 1].motto = archetype.Mottos[cursor];

	this.mNobleMottoInputs[faction - 1].html(this.getMottoHTMLForFaction(faction));
}

NewCampaignMenuModule.prototype.getMottoHTMLForFaction = function(faction) {
	return '<span class="description-font-small font-color-title">\"' + this.mFactions[faction - 1].motto + '\"</span>';
}

var originalFooterStartActionFC = NewCampaignMenuModule.prototype.footerStartAction;
NewCampaignMenuModule.prototype.footerStartAction = function ()
{
	if (this.mFactionsPanel.hasClass('display-block'))
		this.notifyBackendStartButtonPressed();
	else if (this.mDifficultySelectionPanel.hasClass('display-block')) {
		this.initializeAndBuildPanel();
		this.showFactionsPanel();
	} else
		originalFooterStartActionFC.call(this);
}

var originalFooterCancelActionFC = NewCampaignMenuModule.prototype.footerCancelAction;
NewCampaignMenuModule.prototype.footerCancelAction = function() {
	if (this.mFactionsPanel.hasClass('display-block'))
		this.showDifficultySelectionPanel();
	else
		originalFooterCancelActionFC.call(this);
}

var originalNewCampaignMenuModuleResetPanelsFC = NewCampaignMenuModule.prototype.resetPanels;
NewCampaignMenuModule.prototype.resetPanels = function() {
	originalNewCampaignMenuModuleResetPanelsFC.call(this);

	this.mFactionsPanel.removeClass('display-block').addClass('display-none');
}

var originalNewCampaignMenuModuleShowDifficultySelectionPanelFC = NewCampaignMenuModule.prototype.showDifficultySelectionPanel;
NewCampaignMenuModule.prototype.showDifficultySelectionPanel = function ()
{
	originalNewCampaignMenuModuleShowDifficultySelectionPanelFC.call(this);
	this.mStartButton.changeButtonText("Next");
}

NewCampaignMenuModule.prototype.showFactionsPanel = function() {
	this.resetPanels();
	this.mFactionsPanel.addClass('display-block').removeClass('display-none');
	this.mStartButton.changeButtonText("Start");
}

var originalCollectSettingsFC = NewCampaignMenuModule.prototype.collectSettings;
NewCampaignMenuModule.prototype.collectSettings = function() {

    var settings = originalCollectSettingsFC.call(this);

    // This is read in (in squirrel) in new_campaign_menu_module
    settings.nobleOneBanner = this.mFactions[0].banner;
    settings.nobleTwoBanner = this.mFactions[1].banner;
    settings.nobleThreeBanner = this.mFactions[2].banner;

	settings.nobleOneName = this.mFactions[0].name;
    settings.nobleTwoName = this.mFactions[1].name;
    settings.nobleThreeName = this.mFactions[2].name;

	settings.nobleOneArchetype = this.mFactions[0].archetype.RawTraits
	settings.nobleTwoArchetype = this.mFactions[1].archetype.RawTraits
	settings.nobleThreeArchetype = this.mFactions[2].archetype.RawTraits

	settings.nobleOneMotto = this.mFactions[0].motto;
    settings.nobleTwoMotto = this.mFactions[1].motto;
    settings.nobleThreeMotto = this.mFactions[2].motto;

    return settings;
}

var originalDestroyDIVFC = NewCampaignMenuModule.prototype.destroyDIV;
NewCampaignMenuModule.prototype.destroyDIV = function() {
	this.mFactions = [{ name: "", banner: -1 }, { name: "", banner: -1 }, { name: "", banner: -1 }];

	this.mNobleNameInputs.forEach(function(input) {
		if (input != null) {
			input.remove();
			input = null;
		}
	});
	this.mNobleBannerImages.forEach(function(image) {
		if (image != null) {
			image.remove();
			image = null;
		}
	});

	this.mNobleNameInputs = [null, null, null];
	this.mNobleBannerImages = [null, null, null];

	if (this.mFactionsPanel != null) {
		this.mFactionsPanel.empty();
		this.mFactionsPanel.remove();
		this.mFactionsPanel = null;
    }

    originalDestroyDIVFC.call(this);
};

var originalUnbindTooltipsFC = NewCampaignMenuModule.prototype.unbindTooltips;
NewCampaignMenuModule.prototype.unbindTooltips = function() {
	this.mNobleNameInputs.forEach(function(input) {
		if (input != null) input.unbindTooltip();
	});
};

/**
 * Math.random() isn't seed-able.
 * In order to keep _default_ faction details consistent across players, we need a PRNG that's seedable
 * We use cyrb53 below to hash the input seed (`this.mSeed`) to an integer seed
 * That integer seed is then used to seed splitmix32, which we then use to set our default faction details
 */

// Grabbed from https://stackoverflow.com/a/47593316
NewCampaignMenuModule.prototype.splitmix32 = function(seed) {
	return function() {
		seed |= 0;
		seed = seed + 0x9e3779b9 | 0;

		var t = seed ^ seed >>> 16;
		t = Math.imul(t, 0x21f0aaad);
		t = t ^ t >>> 15;
		t = Math.imul(t, 0x735a2d97);

		return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
	}
};

// Grabbed from https://stackoverflow.com/a/52171480
NewCampaignMenuModule.prototype.cyrb53 = function(str) {
	var h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;

	for (var i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}

	h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};
