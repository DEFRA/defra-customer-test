
const webdriver = require("selenium-webdriver");
const By = webdriver.By;
const until = webdriver.until;
const alert = require("selenium-webdriver").Alert;


class LoginCRM {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }

    async waitUntilLoaded() {
        return this.browser.wait(until.elementLocated(By.id("loginHeader")), 5 * 20000);
    }

    async loginHeader() {
        return this.browser.wait(until.elementLocated(By.id("loginHeader")), 5 * 20000);
    }

    async useAnotherAccount() {
        return this.browser.wait(until.elementLocated(By.id("otherTile")), 5 * 20000);
    }

    async inputUserName() {
        return this.browser.wait(until.elementLocated(By.name("loginfmt")), 5 * 20000);
    }

    async inputUserName() {
        return this.browser.wait(until.elementLocated(By.name("loginfmt")), 5 * 20000);
    }

    async inputUserPassword() {
        return this.browser.wait(until.elementLocated(By.name("passwd")), 5 * 20000);
    }

    async closeCSS() {
        return this.browser.wait(until.elementLocated(By.css("div[className='navTourClose']")), 5 * 20000);;
    }

    
    async applicationLP() {
        return this.browser.wait(until.elementLocated(By.xpath("//span[@class = 'nav-rowLabel' and (text() = 'Applications' or . = 'Applications')]")), 5 * 20000);;
    }

    async applicationsMenu() {
        return this.browser.wait(until.elementLocated(By.css("ul[role='application']")), 5 * 20000);;
    }
    async newApplication() { 
        return this.browser.wait(until.elementLocated(By.id("defra_application|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.defra_application.NewRecord")), 5 * 20000);
    }

    async newapplicationTitle() {
        return this.browser.wait(until.elementLocated(By.css("h1[title='New Application']")), 5 * 20000);;
    }

    //
    async formNavigation() { 
        return this.browser.wait(until.elementLocated(By.css("img[src='/_imgs/formsections_navigationflyout_button.png']")), 5 * 20000);
    }

    //
    async selectCust() { 
        return this.browser.wait(until.elementLocated(By.css("td[title='CUSTOMER']")), 5 * 20000);
    }
    
    async customerID() { 
        return this.browser.wait(until.elementLocated(By.id("header_process_defra_customerid_lookupValue")), 5 * 20000);
    }

    async userName(user) {
        //img[@alt = 'Waste Test 1 AG-EA-LP-QA-MASTER' and @class = 'navTabButtonUserInfoProfileImage']
        //img[@alt = 'Waste Test 1 AG-EA-LP-QA-MASTER' and @class = 'navTabButtonUserInfoProfileImage']
        const user1 = "//img[@alt = '" + user + "' and @class = 'navTabButtonUserInfoProfileImage']"
        console.log(user1);
        return this.browser.wait(until.elementLocated(By.xpath(user1)), 5 * 20000);
    }

    async contentArea() {
        return this.browser.wait(until.elementLocated(By.xpath("//iframe[@id = 'contentIFrame0' and @name = 'contentIFrame0' and @title = 'Content Area']")), 5*20000);
    }

    async clickSearch() {
        return this.browser.wait(until.elementLocated(By.xpath("//span[@title = 'Start search' and @class = 'navImageFlipHorizontal']")),5*20000);
    }

    async enterSearch() {
        return this.browser.wait(until.elementLocated(By.xpath("//input[@aria-label = 'Search Dynamics 365 data' and @class = 'ms-crm-Dialog-Lookup-QuickFind navBarSearchTextBox' and @id = 'search' and @type = 'text']")),5*20000);
    }

    async doSearch() {
        return this.browser.wait(until.elementLocated(By.xpath("//img[@title = 'Start search' and @id = 'findCriteriaImg' and @class = 'navImageFlipHorizontal' and @alt = 'Start search']")),5*20000);
    }

    async searchApp(appno) {
        const path = "//span[@id = 'attribone' and (text() = '"+ appno+"' or . = '"+appno+"') and @ref_element = 'Object Repository/tmm/Page_Microsoft Dynamics 365/iframe_contentIFrame1']";
        return this.browser.wait(until.elementLocated(By.xpath("//span[@id = 'attribone' and (text() = 'WE6081QA/A001' or . = 'WE6081QA/A001') and @ref_element = 'Object Repository/FrontEnd/Page_Microsoft Dynamics 365/iframe_contentIFrame1']")),5*20000);
    }

    async searchAppNo() {

        //const myElement = this.browser.wait(until.elementLocated(By.xpath("//iframe[@id = 'contentIFrame0' and @name = 'contentIFrame0' and @title = 'Content Area']")), 5*20000);
       // const parent = myElement.searchAppNo();
       const elem = this.browser.wait(until.elementLocated(By.xpath("//iframe[@id = 'contentIFrame0' and @name = 'contentIFrame0' and @title = 'Content Area']")), 5*20000);
       const elem1 = this.elem.wait(until.elementLocated(By.xpath("//input[@id = 'crmGrid_findCriteria' and @title = 'Search for records' and @type = 'text' and @ref_element = 'Object Repository/tryss/Page_Applications Active Applicatio/iframe_contentIFrame0']")),5*20000);
       return elem1;
       //return contentArea.wait(until.elementLocated(By.xpath("//input[@id = 'crmGrid_findCriteria' and @title = 'Search for records' and @type = 'text' and @ref_element = 'Object Repository/tryss/Page_Applications Active Applicatio/iframe_contentIFrame0']")),5*20000); 
        //this.contentArea.wait(until.elementLocated(By.xpath("")), 5*20000);
        //return this.browser.wait(until.elementLocated(By.xpath("//input[@id = 'crmGrid_findCriteria' and @title = 'Search for records' and @type = 'text' and @ref_element = 'Object Repository/tryss/Page_Applications Active Applicatio/iframe_contentIFrame0']")), 5 * 20000);
    }

    async clickSearchButton() {
        return this.browser.wait(until.elementLocated(By.id("crmGrid_findCriteriaButton")), 5 * 20000);
        
    }

    async nextButton() {
        //return this.browser.wait(until.elementLocated(By.xpath("//input[contains(@type,'submit')]")), 5 * 20000);
        return this.browser.wait(until.elementLocated(By.id("idSIButton9")), 5*20000);
    }


    async signinButton() {
        return this.browser.wait(until.elementLocated(By.xpath("//input[contains(@value,'Sign in')]")), 5 * 20000);
    }

    async staySignedInNoButton() {
        return this.browser.wait(until.elementLocated(By.xpath("//input[@type = 'button' and @id = 'idBtn_Back']")), 5 * 20000);
    }

    
    getTextElement(element) {
        return element.getText();
    }

    async pressEscape() {
        this.sleep();
        console.log("ESCAPE");
      return await this.browser.switchTo().alert().dismiss();


        
    }

    async header() {
        return this.browser.wait(until.elementLocated(By.className("navTourTitleText")), 5 * 20000);
    }

    async closePopup() {
        // return this.header.wait(until.elementLocated(By.xpath("//img[contains(@alt,'Close')]")), 5 * 20000);
        //this.browser.wait(until.elementLocated(By.xpath("//img[contains(@alt,'Close')]")), 5 * 20000);
        return this.browser.wait(until.elementLocated(By.id("buttonClose")), 5 * 200000);
    }

    async navtourtitle() {
        //InlineDialog
        return this.browser.wait(until.elementLocated(By.xpath("//a[contains(@id,'buttonClose')]")), 5 * 20000);
        // return this.browser.wait(until.elementLocated(By.id("buttonClose")), 5 * 200000);
    }

    async navtitletext() {
        return navtourtitle.getAttribute("label");
    }

    async loggedInPageUserProfileImage() {
        return this.browser.wait(until.elementLocated(By.className("navTabButtonUserInfoProfileImage")), 5 * 20000);
    }

    async lpTab() {
        return this.browser.wait(until.elementLocated(By.id("TabLP")), 5 * 20000);
    }

    async sleep() {
        return this.browser.sleep(7000);
    }

}

module.exports.LoginCRM = LoginCRM;