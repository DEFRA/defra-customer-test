const webdriver = require("selenium-webdriver");
const appRootDir = require("app-root-dir").get();
const encode = require("./chrome-util").base64EncodeCrx;
const config = require("../../../../config").config;
const configCRM = require("../../../../configCRM").configCRM;

require("chromedriver");
require("geckodriver");
require("iedriver");
require("cucumber");

const PLATFORMS = {
	CHROME_PHONE_DEV: "chrome-phone-dev",
	CHROME_PHONE_TEST: "chrome-phone-test",
	CHROME_DESKTOP_DEV: "chrome-desktop-dev",
	CHROME_DESKTOP_TEST: "chrome-desktop-test",
	CHROME_DESKTOP_HEADLESS_TEST: "chrome-desktop-headless-test",
	CHROME_TABLET_DEV: "chrome-tablet-dev",
	CHROME_TABLET_TEST: "chrome-tablet-test",
	IE_DESKTOP_DEV: "ie-desktop-dev",
	IE_DESKTOP_TEST: "ie-desktop-test",
	FIREFOX_DESKTOP_DEV: "firefox-desktop-dev",
	FIREFOX_DESKTOP_TEST: "firefox-desktop-test"
};

class Driver {

	constructor() {
		this.browser = undefined;
	}

	getChromeDesktopSpec(width, height) {
		return {
			browserName: "chrome",
			browserstack: {
				user: "",
				key: ""
			},
			chromeOptions: {
				args: ["--window-size=" + width + "," + height]
			}
		};
	}

	getChromeDesktopHeadlessSpec(width, height) {
		return {
			browserName: "chrome",
			chromeOptions: {
				args: ["--headless" + "," + "--window-size=" + width + "," + height]
			}
		};
	}

	getChromePhoneSpec(width, height) {
		return {
			browserName: "chrome",
			chromeOptions: {
				args: ["--window-size=" + width + "," + height],
				mobileEmulation: {
					userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1"
				}
			}
		};
	}

	getChromeTabletSpec(width, height) {
		return {
			browserName: "chrome",
			chromeOptions: {
				args: ["--window-size=" + width + "," + height],
				mobileEmulation: {
					userAgent: "Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36"
				}
			}
		};
	}

	getFirefoxDesktopSpec() {
		return {
			browserName: "firefox",
			marionette: true,
			acceptInsecureCerts: true
		};
	}

	getIeDesktopSpec() {
		return {
			browserName: "ie",
			ignoreProtectedModeSettings: true,
			ignoreZoomSetting: true,
			"ie.ensureCleanSession": true
		};
	}

	getDriverSpec(platform, width, height) {
		let spec;

		switch (platform) {
			case PLATFORMS.CHROME_PHONE_DEV:
				spec = this.getChromePhoneSpec(width, height);
				//config.appUrl = config.appUrlDev;
				//configCRM.appUrlCRM = configCRM.appUrlCRMDevMaster;
				break;
			case PLATFORMS.CHROME_PHONE_TEST:
				spec = this.getChromePhoneSpec(width, height);
				//config.appUrl = config.appUrlTest;
				//configCRM.appUrlCRM = configCRM.appUrlCRMTest;
				break;
			case PLATFORMS.CHROME_DESKTOP_DEV:
				spec = this.getChromeDesktopSpec(width, height);
				//config.appUrl = config.appUrlDev;
				//configCRM.appUrlCRM = configCRM.appUrlCRMDevMaster;
				break;
			case PLATFORMS.CHROME_DESKTOP_HEADLESS_TEST:
				spec = this.getChromeDesktopHeadlessSpec(width, height);
				//config.appUrl = config.appUrlDev;
				//configCRM.appUrlCRM = configCRM.appUrlCRMDevMaster;
				break;	
			case PLATFORMS.CHROME_DESKTOP_TEST:
				spec = this.getChromeDesktopSpec(width, height);
				//config.appUrl = config.appUrlTest;
				//configCRM.appUrlCRM = configCRM.appUrlCRMTest;
				break;
			case PLATFORMS.CHROME_TABLET_DEV:
				spec = this.getChromeTabletSpec(width, height);
				//config.appUrl = config.appUrlDev;
				//configCRM.appUrlCRM = configCRM.appUrlCRMDevMaster;
				break;
			case PLATFORMS.CHROME_TABLET_TEST:
				spec = this.getChromeTabletSpec(width, height);
				//config.appUrl = config.appUrlTest;
				//configCRM.appUrlCRM = configCRM.appUrlCRMTest;
				break;
			case PLATFORMS.FIREFOX_DESKTOP_DEV:
				spec = this.getFirefoxDesktopSpec();
				//config.appUrl = config.appUrlDev;
				//configCRM.appUrlCRM = configCRM.appUrlCRMDevMaster;
				//config.appUrl = config.appUrlTest;
				//configCRM.appUrlCRM = configCRM.appUrlCRMTest;
				break;
			case PLATFORMS.FIREFOX_DESKTOP_TEST:
				spec = this.getFirefoxDesktopSpec();
				//config.appUrl = config.appUrlTest;
				//configCRM.appUrlCRM = configCRM.appUrlCRMTest;
				break;
			case PLATFORMS.IE_DESKTOP_DEV:
				spec = this.getIeDesktopSpec();
				//config.appUrl = config.appUrlDev;
				//configCRM.appUrlCRM = configCRM.appUrlCRMDevMaster;
				break;
			case PLATFORMS.IE_DESKTOP_TEST:
				spec = this.getIeDesktopSpec();
				//config.appUrl = config.appUrlTest;
				//configCRM.appUrlCRM = configCRM.appUrlCRMTest;
				break;
		}
		return spec;
	}

	getBrowser(parameters) {
		if (!this.browser) {
			switch (parameters.platform) {
				case PLATFORMS.CHROME_PHONE_DEV:
				case PLATFORMS.CHROME_PHONE_TEST:
				case PLATFORMS.CHROME_DESKTOP_TEST:
				case PLATFORMS.CHROME_DESKTOP_HEADLESS_TEST:
				case PLATFORMS.CHROME_DESKTOP_DEV:
				case PLATFORMS.CHROME_TABLET_TEST:
					this.browser = new webdriver.Builder().withCapabilities(this.getDriverSpec(parameters.platform, parameters.width, parameters.height)).build();
					break;
				case PLATFORMS.CHROME_TABLET_DEV:
					this.browser = new webdriver.Builder().withCapabilities(this.getDriverSpec(parameters.platform, parameters.width, parameters.height)).build();
					break;
				case PLATFORMS.FIREFOX_DESKTOP_DEV:
				case PLATFORMS.FIREFOX_DESKTOP_TEST:
				case PLATFORMS.IE_DESKTOP_TEST:
					this.browser = new webdriver.Builder().withCapabilities(this.getDriverSpec(parameters.platform)).build();
					this.browser.manage().window().setSize(parameters.width, parameters.height);
					break;
				case PLATFORMS.IE_DESKTOP_DEV:
					this.browser = new webdriver.Builder().withCapabilities(this.getDriverSpec(parameters.platform)).build();
					this.browser.manage().window().setSize(parameters.width, parameters.height);
					break;
				default:
					throw new Error("Unsupported platform");
			}
		}
		return this.browser;
	}

	quitBrowser() {
		const browser = this.browser;
		this.browser = null;
		return browser.quit();
	}
}

const _instance = new Driver();

module.exports.driver = _instance;
