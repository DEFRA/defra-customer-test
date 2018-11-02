const World = require("../support/world").World;
const Assert = require("assert");

module.exports = function () {

    this.World = World;

    this.defineStep(/^I am on the "(.*?)" page$/, { timeout: 4000000 }, async function (title) {
        //await this.newApplication.waitUntilLoaded(title);
        const titleText = await this.newApplication.waitUntilLoaded(title);
        actualtext = await this.confirmRules.getTextElement(titleText);
        Assert.equal(actualtext, title, "Incorrect title Expected: "+title+ " Actual title is :"+ actualtext);
    });

    this.defineStep(/^I am on the "(.*?)" page for payment$/, { timeout: 2000000 }, async function (title) {
        await this.newApplication.waitUntilLoadedGovUK(title);
    });

    this.defineStep(/^I select "(.*?)" waste permit application page$/, { timeout: 2000000 }, async function (option) {
        switch (option) {
            case "Start a new application":
                const startApplication = await this.newApplication.startApplicationRadio();
                startApplication.click();
                break;
            case "Open a saved application":
                const openApplication = await this.newApplication.openApplicationRadio();
                openApplication.click();
                break;
            default: break;
        }
    });

    this.defineStep(/^I click on "(.*?)" button$/, { timeout: 2000000 }, async function (button) {
        switch (button) {
            case "Continue":
                const continueButton = await this.newApplication.continueButton();
                await continueButton.click();
                break;
            case "Find Address":
                const findAddressButton = await this.newApplication.continueButton();
                await findAddressButton.click();
                break;
            case "Send Application":
                const submitButton = await this.newApplication.continueButton();
                await submitButton.click();
                break;
            case "I got the email":
                const gotmail = await this.confirmRules.gotemail();
                await gotmail.click();
                break;
            case "I didn't get the email":
                const notgotmail = await this.confirmRules.notgotemail();
                await notgotmail.click();
                break;
            default: break;
        }
    });
};