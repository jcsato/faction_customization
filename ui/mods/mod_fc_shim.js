"use strict";

// asset.js

// tooltip_identifier.js
TooltipIdentifier.MenuScreen.NewCampaign.FactionNames = [
	'menu-screen.new-campaign.FactionOneName',
	'menu-screen.new-campaign.FactionTwoName',
	'menu-screen.new-campaign.FactionThreeName'
];

// new_campaign_menu_module.js
// List is copied from strings.nut - can't send this to the frontend because the OOO with when registerJS runs
NewCampaignMenuModule.prototype.NOBLE_NAMES = [
	"Grimmund",
	"Weilburg",
	"Armsberg",
	"Gota",
	"Eisenstein",
	"Grauwall",
	"Rabenholt",
	"Sommerwein",
	"Winterhall",
	"Ruhmolt",
	"Adelreich",
	"Perowinger",
	"Eiglof",
	"Berengar",
	"Gunbald",
	"Goswin",
	"Adelheim",
	"Ammondt",
	"Bartholin",
	"Eberlin",
	"Folsach",
	"Hedin",
	"Horn",
	"Niedergard",
	"Rosenving",
	"Thurah",
	"Kaltenborn",
	"Krieger",
	"Steinwall",
	"Harkon",
	"Osten"
];
NewCampaignMenuModule.prototype.NOBLE_BANNERS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
NewCampaignMenuModule.prototype.mFactionsPanel = null;
NewCampaignMenuModule.prototype.mFactions = [{ name: "", banner: -1 }, { name: "", banner: -1 }, { name: "", banner: -1 }];
NewCampaignMenuModule.prototype.mNobleNameInputs = [null, null, null];
NewCampaignMenuModule.prototype.mNobleBannerImages = [null, null, null];

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

	this.initializeFactionData();

    this.buildFactionColumn(factionsContainer, 1);
    this.buildFactionColumn(factionsContainer, 2);
    this.buildFactionColumn(factionsContainer, 3);
}

NewCampaignMenuModule.prototype.initializeFactionData = function() {
	// Assign a random banner between 2-10 - banner 1 is the castle head and shouldn't be there by default
	this.mFactions[0].banner = this.NOBLE_BANNERS[Math.floor(Math.random() * (this.NOBLE_BANNERS.length - 1)) + 1];

	do {
		this.mFactions[1].banner = this.NOBLE_BANNERS[Math.floor(Math.random() * (this.NOBLE_BANNERS.length - 1)) + 1];
	} while(this.mFactions[1].banner == this.mFactions[0].banner);

	do {
		this.mFactions[2].banner = this.NOBLE_BANNERS[Math.floor(Math.random() * (this.NOBLE_BANNERS.length - 1)) + 1];
	} while(this.mFactions[2].banner == this.mFactions[0].banner || this.mFactions[2].banner == this.mFactions[1].banner);

	// Assign different names to the various factions
	this.mFactions[0].name = this.NOBLE_NAMES[Math.floor(Math.random() * this.NOBLE_NAMES.length)];

	do {
		this.mFactions[1].name = this.NOBLE_NAMES[Math.floor(Math.random() * this.NOBLE_NAMES.length)];
	} while(this.mFactions[1].name == this.mFactions[0].name);

	do {
		this.mFactions[2].name = this.NOBLE_NAMES[Math.floor(Math.random() * this.NOBLE_NAMES.length)];
	} while(this.mFactions[2].name == this.mFactions[0].name || this.mFactions[2].name == this.mFactions[1].name);
}

NewCampaignMenuModule.prototype.buildFactionColumn = function(container, faction) {
    var self = this;

    var factionColumn = $('<div class="faction-container"/>');
	container.append(factionColumn);

	var label = $('<div class="title title-font-big font-color-title">House</div>');
	factionColumn.append(label);

	var factionNameInput = $('<div class="l-input"/>');
	factionColumn.append(factionNameInput);

	this.mNobleNameInputs[faction - 1] = factionNameInput.createInput("", 0, 32, 1, function (_input) {
		if (self.mStartButton !== null) self.mStartButton.enableButton(_input.getInputTextLength() >= 1);

		self.mFactions[faction - 1].name = _input.getInputText();
	}, 'title-font-big font-bold font-color-brother-name'); 
	this.mNobleNameInputs[faction - 1].setInputText(this.mFactions[faction - 1].name);

	var table = $('<table width="100%""><tr><td width="10%"><div class="l-button prev-banner-button"/></td><td width="80%" class="banner-image-container"></td><td width="10%"><div class="l-button next-banner-button"/></td></tr></table>');
	factionColumn.append(table);

	var prevBanner = table.find('.prev-banner-button:first');
	prevBanner.createImageButton(Path.GFX + Asset.BUTTON_PREVIOUS_BANNER, function() {
		self.setNextAvailableFactionBanner(faction, -1);
	}, '', 6);

	var nextBanner = table.find('.next-banner-button:first');
	nextBanner.createImageButton(Path.GFX + Asset.BUTTON_NEXT_BANNER, function() {
		self.setNextAvailableFactionBanner(faction, 1);
	}, '', 6);

	var bannerImage = table.find('.banner-image-container:first');
	this.mNobleBannerImages[faction - 1] = bannerImage.createImage(Path.GFX + this.getBannerImageForFaction(faction), function(_image) {
		_image.removeClass('display-none').addClass('display-block');
	}, null, 'display-none banner-image');
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

var originalFooterStartActionFC = NewCampaignMenuModule.prototype.footerStartAction;
NewCampaignMenuModule.prototype.footerStartAction = function ()
{
	if (this.mFactionsPanel.hasClass('display-block'))
		this.showDifficultySelectionPanel();
	else if (this.mCompanyCrisisSelectionPanel.hasClass('display-block'))
		this.showFactionsPanel();
	else
		originalFooterStartActionFC.call(this);
}

var originalFooterCancelActionFC = NewCampaignMenuModule.prototype.footerCancelAction;
NewCampaignMenuModule.prototype.footerCancelAction = function() {
	if (this.mFactionsPanel.hasClass('display-block'))
		this.showCompanyCrisisSelectionPanel();
	else if (this.mDifficultySelectionPanel.hasClass('display-block'))
		this.showFactionsPanel();
	else
		originalFooterCancelActionFC.call(this);
}

var originalNewCampaignMenuModuleResetPanels = NewCampaignMenuModule.prototype.resetPanels;
NewCampaignMenuModule.prototype.resetPanels = function() {
	originalNewCampaignMenuModuleResetPanels.call(this);

	this.mFactionsPanel.removeClass('display-block').addClass('display-none');
}

NewCampaignMenuModule.prototype.showFactionsPanel = function() {
	this.resetPanels();
	this.mFactionsPanel.addClass('display-block').removeClass('display-none');
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
}
