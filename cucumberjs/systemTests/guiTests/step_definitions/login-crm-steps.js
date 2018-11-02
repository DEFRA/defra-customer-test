//import { stringify } from "querystring";

const World = require("../support/world").World;
const config = require("../../../../configCRM").configCRM;

module.exports = function () {

    this.World = World;

    this.defineStep(/^I am on the CRM login page$/, { timeout: 2000000 }, async function () {
        await this.loginCRM.waitUntilLoaded();
    });

    this.defineStep(/^I click on the New Application button$/, { timeout: 2000000 }, async function () {
        const newapp = await this.loginCRM.newApplication();
        await newapp.click();
    });

    this.defineStep(/^I am logged in to CRM as "(.*?)"$/, { timeout: 2000000 }, async function (user) {
        await this.loginCRM.userName(user);
    });

    this.defineStep(/^I select "(.*?)" from the LP menu$/, { timeout: 2000000 }, async function (user) {
        const appln = await this.loginCRM.applicationLP();
        await appln.click();
    });


    this.defineStep(/^I am on the Applications page$/, { timeout: 2000000 }, async function () {
        await this.loginCRM.applicationsMenu();
    });

    this.defineStep(/^I search for "(.*?)" application$/, { timeout: 2000000 }, async function (appno) {
        const app1 =  await this.loginCRM.clickSearch();
        await app1.click();
        const app2 =  await this.loginCRM.enterSearch();
        await app2.sendKeys(appno);
        const app3 =  await this.loginCRM.doSearch();
        await app3.click();
        await app3.click();

        const app4 = await this.loginCRM.searchApp(appno);
        await app4.click();

    });

    this.defineStep(/^I am on the New Applications page$/, { timeout: 2000000 }, async function () {
        await this.loginCRM.newapplicationTitle();
    });

    this.defineStep(/^I enter "(.*?)" in the customer id field$/, { timeout: 2000000 }, async function (cust) {
        // const formNav = await this.loginCRM.formNavigation();
        // await formNav.click();
        // const applnsel = await this.loginCRM.selectCust();
        // await applnsel.click();

        const appln = await this.loginCRM.customerID();
        await appln.click();
        await appln.sendKeys(cust);
    });

    this.defineStep(/^I login into customer identity service$/, { timeout: 2000000 }, async function () {
        const name = await this.loginCRM.inputUserName();
        await name.clear();
        await name.sendKeys(config.userid01);
        const next = await this.loginCRM.nextButton();
        await next.click();
        const pass = await this.loginCRM.inputUserPassword();
        await pass.clear();
        await pass.sendKeys(config.pass01);
        const signin = await this.loginCRM.signinButton();
        await signin.click();
        const staysignin = await this.loginCRM.staySignedInNoButton();
        await staysignin.click();
    });
};