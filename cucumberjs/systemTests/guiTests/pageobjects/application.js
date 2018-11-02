const config = require("../../../../config").config;
const configCRM = require("../../../../configCRM").configCRM;
const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;

const fs = require("fs");

class Application {

	constructor(browser) {
		this.browser = browser;
	}


	async launchCRM(appConfiguration) {
		await this.browser.get(configCRM.appUrlCRM);
		await this.browser.wait(async () => (
			await this.browser.wait(appConfiguration.getReadyState()) === "complete"
		), 10000);
	}

	async launchAPI(appConfiguration, apirul) {
		await this.browser.get(apirul);
		await this.browser.wait(async () => (
			await this.browser.wait(appConfiguration.getReadyState()) === "complete"
		), 10000);
	}

}

module.exports.Application = Application;
