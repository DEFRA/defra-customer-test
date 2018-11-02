const Application = require("./application").Application;
const NewApplication = require("./new-application").NewApplication;
const LoginCRM = require("./login-crm").LoginCRM;
const ActiveDirectoryAuthService = require("./crm-token").ActiveDirectoryAuthService;
const HomePage = require("./homepage").HomePage;


class Factory {

	constructor(browser, testdata) {
		this.browser = browser;
		this.testdata = testdata;
		this.pages = {
			application: Application,
			newapplication: NewApplication,
			logincrm: LoginCRM,
			activedirectoryauthservice: ActiveDirectoryAuthService,
			homepage: HomePage
		};
	}

	create(name) {
		const pageClass = this.pages[name];
		if (pageClass === null) throw new Error("Page not found");
		return new pageClass(this.browser, this.testdata);
	}
}

module.exports.Factory = Factory;
