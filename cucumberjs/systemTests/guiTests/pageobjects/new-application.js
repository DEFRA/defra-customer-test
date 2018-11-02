const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;

class NewApplication {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }

    async waitUntilLoaded(title) {
        return this.browser.wait(until.elementLocated(By.id("page-heading")), 5 * 20000);
    }

    async waitUntilLoadedGovUK(title) {
        return this.browser.wait(until.elementLocated(By.tagName("h1")), 5 * 20000);
    }

    async returnURL() {
        return this.browser.wait(until.elementLocated(By.id("return-url")), 5*3000000);
    }

    async startApplicationRadio() {
        return this.browser.wait(until.elementLocated(By.id("start-application")), 5 * 20000);
    }

    async openApplicationRadio() {
        return this.browser.wait(until.elementLocated(By.id("open-application")), 5 * 20000);
    }

    async continueButton() {
        return this.browser.wait(until.elementLocated(By.id("submit-button")), 5 * 8000);
    }

    getTextElement(element) {
        return element.getText();
    }

}

module.exports.NewApplication = NewApplication;