const driver = require("./driver").driver;
const Factory = require("../pageobjects/factory").Factory;
const AppConfiguration = require("./app-configuration").AppConfiguration;
const TestData = require("./test-data").TestData;
const jsel = require("jsel");
const json1 = require("../test_data_mapping/assets.json");
const assetsJson = jsel(json1);

let params;

module.exports.World = function World(parameters) {
	
	params = parameters;

	console.log("PARAM" +JSON.stringify(parameters));
	const browser = driver.getBrowser(parameters);
	this.testdata = new TestData(assetsJson);
	this.pageFactory = new Factory(browser, this.testdata);
	this.newApplication = this.pageFactory.create("newapplication");
	this.loginCRM = this.pageFactory.create("logincrm");
	this.activeDirectoryAuthService = this.pageFactory.create("activedirectoryauthservice");
	this.homePage = this.pageFactory.create("homepage");
	
	this.parameters = parameters;

	// Create page objects
	this.application = this.pageFactory.create("application");

	// Config injection
	this.appConfiguration = new AppConfiguration(browser);


};

module.exports.getWorldParameters = () => params;
