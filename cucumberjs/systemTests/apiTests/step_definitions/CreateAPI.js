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
        await this.activeDirectoryAuthService.requestCreateContact(token);
    });

    this.defineStep(/^an Organisation invites a Contact to join as a (.*?)$/, { timeout: 2000000 }, async function (Role) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.requestCreateInvitation(token, Role);
    });

    this.defineStep(/^I create access request for Contact to (.*?)$/, { timeout: 2000000 }, async function (ServiceRef) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.createAccessRequest(token, ServiceRef);
    });

    this.defineStep(/^I create a new (.*?) with expected message outcome (.*?)$/, { timeout: 2000000 }, async function (ValidationType, StatusMsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateContact(token, ValidationType, StatusMsg);    
    });

    this.defineStep(/^I send an API request to create a new (.*?) organisation with (.*?)$/, { timeout: 2000000 }, async function (validationtype, statusmsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateOrg(token, validationtype, statusmsg);     
    });

    this.defineStep(/^I call defra relationship action with (.*?) (.*?)$/, { timeout: 2000000 }, async function (StatusMsgCreate, ContactType) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateRelationship(token, StatusMsgCreate, ContactType);
        
    });

    this.defineStep(/^I call defra (.*?) enrolement action with (.*?)$/, { timeout: 2000000 }, async function (ServAndServRole, StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateEnrolement(token, ServAndServRole, StatusMsg);
        
    });

    this.defineStep(/^I enrole as an IDM-Admin$/, { timeout: 2000000 }, async function () {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.requestEnroleAsAnIDMAdmin(token);
    });

    this.defineStep(/^I call defra relationship action an existing contact organisation relationship with (.*?)$/, { timeout: 2000000 }, async function (StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)

        await this.activeDirectoryAuthService.sendRequestCreateRelationshipDuplicate(token, StatusMsg);

    });

    this.defineStep(/^I call defra relationship action an existing contact organisation relationship with (.*?)$/, { timeout: 2000000 }, async function (StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)

        await this.activeDirectoryAuthService.sendRequestCreateRelationshipDuplicate(token, StatusMsg);

    });

    this.defineStep(/^I call defra createemail success action with (.*?)$/, { timeout: 2000000 }, async function (StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.sendRequestCreateemailContactSuccess(token, StatusMsg);
    });

    this.defineStep(/^I call defra createemail for an organisation success action with (.*?)$/, { timeout: 2000000 }, async function (StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)

        await this.activeDirectoryAuthService.sendRequestCreateemailOrgSuccess(token, StatusMsg);

    });

    this.defineStep(/^I call defra createemail action for an organisation with no email with (.*?)$/, { timeout: 2000000 }, async function (StatusMsg) {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.sendRequestCreateemailOrgFailure1(token, StatusMsg);
    });


};

