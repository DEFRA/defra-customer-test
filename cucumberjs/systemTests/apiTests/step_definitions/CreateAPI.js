//import { stringify } from "querystring";
// defined in support - world.js - creates a world for every scenario - distinct webdriver instance
const World = require("../support/world").World;
const config = require("../../../../configCRM").configCRM;
const Assert = require("assert");
const request = require("request");
const chai = require("chai");

module.exports = function () {


    this.World = World;

    this.defineStep(/^I send an API request to create a new contact$/, { timeout: 2000000 }, async function () {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.sendRequestCreateContact(token);

    });


    this.defineStep(/^I send an API request to create a new (.*?) organisation with (.*?)$/, { timeout: 2000000 }, async function (validationtype, statusmsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)

        await this.activeDirectoryAuthService.sendRequestCreateOrg(token, validationtype, statusmsg);
        
    });

    this.defineStep(/^I create a new (.*?) organisation with (.*?) for duplication check$/, { timeout: 2000000 }, async function (ValidationTypeDup, StatusMsgDup) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)

        await this.activeDirectoryAuthService.sendRequestCreateOrgDuplicationChk(token, ValidationTypeDup, StatusMsgDup);
        
    });

    this.defineStep(/^I call defra relationship action (.*?) with (.*?)$/, { timeout: 2000000 }, async function (ValidationType, StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)

        await this.activeDirectoryAuthService.sendRequestCreateRelationshipSuccess(token, ValidationType, StatusMsg);
        
    });

};

