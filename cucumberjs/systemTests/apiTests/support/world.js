const driver = require("./driver").driver;
const Factory = require("../pageobjects/factory").Factory;
const AppConfiguration = require("./app-configuration").AppConfiguration;
const TestData = require("./test-data").TestData;
const jsel = require("jsel");
const json1 = require("../test_data_mapping/createsdata.json");
const assetsJson1 = jsel(json1);

let params;

module.exports.World = function World(parameters) {
	
	params = parameters;

	console.log("PARAM" +JSON.stringify(parameters));
	const browser = driver.getBrowser(parameters);
	this.testdata = new TestData(assetsJson1);
	this.pageFactory = new Factory(browser, this.testdata);
	this.activeDirectoryAuthService = this.pageFactory.create("activedirectoryauthservice");
	
	this.parameters = parameters;
	// Config injection
	this.appConfiguration = new AppConfiguration(browser);


};

module.exports.getWorldParameters = () => params;
