//import { stringify } from "querystring";
// defined in support - world.js - creates a world for every scenario - distinct webdriver instance
const World = require("../support/world").World;
// const config = require("../../../../configCRM").configCRM;
// const Assert = require("assert");
// const request = require("request");
// const chai = require("chai");

module.exports = function () {

    this.World = World;

    this.defineStep(/^I create a new (.*?) Contact with (.*?) then expected message outcome is (.*?)$/, { timeout: 2000000 }, async function (ContactType, ValidationType, StatusMsgCont) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateContact(token, ContactType, ValidationType, StatusMsgCont);    
    });

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

    this.defineStep(/^I create access request for Contact to (.*?) with no (.*?)$/, { timeout: 2000000 }, async function (ServiceRef, StatusMsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.createAccessRequest(token, ServiceRef, StatusMsg);
    });
    
    this.defineStep(/^I create access request for N-plus1-Contact and Org-1 to (.*?) with excpected outcome (.*?)$/, { timeout: 2000000 }, async function (LoBService, StatusMsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.createAccessRequest(token, LoBService, StatusMsg);
    });
    
    this.defineStep(/^I send an API request to create a new (.*?) (.*?) organisation with (.*?) and (.*?)$/, { timeout: 2000000 }, async function (isuk, orgtype, validationtype, statusmsgorg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateOrgNEW(token, isuk, orgtype, validationtype, statusmsgorg);     
    });

    this.defineStep(/^I make an API request to create a new (.*?) organisation with (.*?) and (.*?)$/, { timeout: 2000000 }, async function (orgtype, validationtype, statusmsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateOrgOTHERS(token, orgtype, validationtype, statusmsg);     
    });

    this.defineStep(/^I send an API request to create a (.*?) charity organisation with (.*?) and (.*?)$/, { timeout: 2000000 }, async function (charityType, validationtype, statusmsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateCharityOrg(token, charityType, validationtype, statusmsg);     
    });

    this.defineStep(/^I call defra Relationship action between (.*?) and same Org with (.*?) and returned (.*?)$/, { timeout: 2000000 }, async function (ContactType, RoleType, StatusMsgCreate) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateRelationship(token, ContactType, RoleType, StatusMsgCreate);
        
    });

      this.defineStep(/^I Enrole (.*?) to an IDM service (.*?) and returned (.*?)$/, { timeout: 2000000 }, async function (ContactType, IDMServcie, StatusMsgIDMService) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateIDMEnrolment(token, ContactType, IDMServcie, StatusMsgIDMService);    
    });

    this.defineStep(/^I Handshake contact to a defra service (.*?) and returned (.*?)$/, { timeout: 2000000 }, async function (DefraService, StatusMsgDefraService) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateHandshake(token, DefraService, StatusMsgDefraService);     
    });

    this.defineStep(/^I call Enrolment Request for contact to a defra service (.*?) and returned (.*?)$/, { timeout: 2000000 }, async function (DefraService, StatusMsgDefraService) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestEnrolmentRequest(token, DefraService, StatusMsgDefraService);     
    });

    this.defineStep(/^I call defra Enrolement action with (.*?) and returned (.*?)$/, { timeout: 2000000 }, async function (ServAndServRole, StatusMsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        //console.log(token)
        await this.activeDirectoryAuthService.requestCreateEnrolement(token, ServAndServRole, StatusMsg);     
    });

    this.defineStep(/^I Enrole to an LoB service (.*?) and returned (.*?)$/, { timeout: 2000000 }, async function (ServAndServRole, StatusMsg) {
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

    this.defineStep(/^I (.*?) created access request$/, { timeout: 2000000 }, async function (accessAction, StatusMsg) {
        //generate token
        const token = await this.activeDirectoryAuthService.getToken();
        // use async with await for all step definitions , assertions, page objects to avoid any timeouts or obj not found conditon due to time out
        await this.activeDirectoryAuthService.accessRequestAction(token, accessAction, StatusMsg);
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

