const World = require("../support/world").World;
const html2canvas = require("html2canvas");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

module.exports = function () {
	this.World = World;

	this.defineStep(/^the application has been launched$/, { timeout: 2000000 }, function () {
		this.appConfiguration.injectInterceptor();
		return this.application.launch(this.appConfiguration);
	});

	this.defineStep(/^the CRM application has been launched$/, { timeout: 2000000 }, function () {
		//this.appConfiguration.injectInterceptor();
		return this.application.launchCRM(this.appConfiguration);
	});
	
	this.defineStep(/^I configure the app for "([^"]*)"$/, { timeout: 2000000 }, function (feature) {
		this.appConfiguration.setConfigForFeature(feature);
	});

	this.defineStep(/^the app is started after being configured$/, { timeout: 2000000 }, function () {
		this.appConfiguration.startApp();
	});

	this.defineStep(/^take screenshots$/, { timeout: 2000000 }, async function () {
		const fieldText = await this.giveCompanyDetails.getTitleOfThePage();
		const actualtext = await this.giveCompanyDetails.getTextElement(fieldText);
		this.application.takeScreenshots(actualtext);
	});
	
	this.defineStep(/^take screenshots GovPay$/, { timeout: 2000000 }, async function () {
		const fieldText = await this.giveCompanyDetails.getTitleOfThePageGovPay();
		const actualtext = await this.giveCompanyDetails.getTextElement(fieldText);
		this.application.takeScreenshots(actualtext);
	});
};
