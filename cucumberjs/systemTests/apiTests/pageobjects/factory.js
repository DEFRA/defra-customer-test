
const ActiveDirectoryAuthService = require("./crm-token").ActiveDirectoryAuthService;

// 	Instantiates page objects
class Factory {

	constructor(browser, testdata) {
		this.browser = browser;
		this.testdata = testdata;
		this.pages = {

			activedirectoryauthservice: ActiveDirectoryAuthService
		};
	}

	create(name) {
		const pageClass = this.pages[name];
		if (pageClass === null) throw new Error("Page not found");
		return new pageClass(this.browser, this.testdata);
	}
}

module.exports.Factory = Factory;
