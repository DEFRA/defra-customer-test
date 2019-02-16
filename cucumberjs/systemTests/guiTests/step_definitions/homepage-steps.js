const World = require("../support/world").World;
const html2canvas = require("html2canvas");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const chai = require("chai");

module.exports = function () {
	this.World = World;

	this.defineStep(/^I am logged in to Customer Master test$/, { timeout: 2000000 }, async function () {
        const title = await this.homePage.headerTitle();
        const txt = await title.getAttribute("title");
        console.log(txt);
        chai.expect(txt).to.contain('Customer Master (test)');
        chai.expect(txt).to.contain('Go to home page.');  
    });
    
    //When ""
    this.defineStep(/^I switch to "(.*?)"$/, { timeout: 2000000 }, async function (selectApp) {
        switch (selectApp) {
            case "Defra Customer App (0.1)":
                dropDown = await this.homePage.switchApp();
                await dropDown.click();
                custApp = await this.homePage.defraCustmApp();
                await custApp.click();
                break;
            default: break;
        } 
    });
};
