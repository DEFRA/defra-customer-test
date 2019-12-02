const { driver } = require("./driver");
const getWorldParameters = require("./world").getWorldParameters;
const config = require("../../../../config").config;
const configCRM = require("../../../../configCRM").configCRM;
const nock = require("nock");

let frontEndVersion;
let backEndVersion;

module.exports = function () {

	this.Before((scenario) => {
		scenario.attach(getWorldParameters().platform);

	});

	this.registerHandler('ScenarioResult', async function (scenario) {
		if (scenario.status === 'failed') {
			//   const filename = await driver.browser.getCurrentUrl()
			//   driver.takeScreenshotsAfterFailure(filename)
			return driver.quitBrowser()
		} else {
			return driver.quitBrowser()
		}
	})

	this.registerHandler("AfterFeatures", () => {

		if (process.argv.includes("--junit")) {
			const cucumberJunitConvert = require('cucumber-junit-convert');
			const options = {
				inputJsonFile: "reports/api-tests.json",
				outputXmlFile: 'reports/cucumber_report_api.xml'
			}
			cucumberJunitConvert.convert(options);
		}
		else {
			const reporter = require("cucumber-html-reporter");
			const options = {
				theme: "bootstrap",
				jsonDir: "reports",
				output: "reports/cucumber_report.html",
				reportSuiteAsScenarios: true,
				launchReport: true,
				ignoreBadJsonFile: true,
				metadata: {
					"App Version": "Customer Management App",
					"Test Environment": configCRM.appUrlCRM,
					"Version": 0.1,
					Platform: getWorldParameters().platform,
					Platform: "Windows 10",
					Parallel: "Scenarios",
					Executed: "local"
				}
			};
			reporter.generate(options);
		}
	});
};