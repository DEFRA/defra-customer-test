// id = TabnavTabLogoTextId
// title="Customer Master (test) Go to home page."


const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;
const alert = require("selenium-webdriver").Alert;


class HomePage {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }

    async headerTitle() {
        return await this.browser.wait(until.elementLocated(By.id("TabnavTabLogoTextId")), 5 * 20000);
    }

    async headerTitleText(element) {
        return await element.getAttribute("title");
    }

    async switchApp() {
        return await this.browser.wait(until.elementLocated(By.css("span[title='Switch to another app']")), 5 * 20000);
    }

    async defraCustmApp() {
        return await this.browser.wait(until.elementLocated(By.css("img[src='https://defra-custmstr-test.crm4.dynamics.com/{636734180550002078}/WebResources/defra_Logo_DefraSmall']")), 5 * 20000);
    }

    async getTextElement(element) {
        return element.getText();
    }

    async sleep() {
        return this.browser.sleep(7000);
    }

}

module.exports.HomePage = HomePage;