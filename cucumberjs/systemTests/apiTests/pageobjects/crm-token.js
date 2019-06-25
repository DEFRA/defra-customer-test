const AdalNode = require('adal-node')
const request = require("request");
const chai = require("chai");
const configCRM = require("../../../../configCRM").configCRM;
const fs = require('fs');

let resp;
let today = new Date().toLocaleString();

//const LoggingService = require('../services/logging.service')
const authorityURL = configCRM.authorityURL;
//CRM Organization URL
const resource = configCRM.resource;
//Dynamics 365 Client Id when registered in Azure
const clientID = configCRM.clientID;

var contactID = "";
var contactFullName = "";
var organisationID = "";
var organisationName = "";
var connectionID = "";
var statusCodeVal = "";


class ActiveDirectoryAuthService {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }

    readFiles(fileName) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fileName, 'utf8', function (err, dataCust) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(dataCust.toString());
                }
            })
        })

    }

    readFilesJSON(fileName) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fileName, 'utf8', function readFileCallback(err, data){
                if (err){
                    reject(err);
                } else {
                    resolve(data);
                }});
        });
    }

    
//this is to return request as a promise - Earlier we had issues as it didn't perform the assertions after the response was received
//this way of returning promise works reliably to return response and perform actions/assertions on the response
    initialize(options) {
        return new Promise(function (resolve, reject) {
            // Do async job
            request(options, function (err, resp, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp, body);
                }
            })
        })
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        //return Math.floor(Math.random() * (max - min + 1)) + min;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //**************USE THIS**********************/
    async requestCreateContact(token, validationtype, statusMsg) {
        // get data from createcontact.json using test-data.js
        // get me the B2CObjID for BasicContactTest testIdentifier from createcontact.json
        var b2cObjectID = this.testdata.getB2CObjectID("BasicContact");
        var isCitizen = this.testdata.getIsCitizen("BasicContact");
        var title = this.testdata.getTitle("BasicContact");
        var firstName = this.testdata.getFirstName("BasicContact");
        var middleName = this.testdata.getMiddleName("BasicContact");
        var lastName = this.testdata.getLastName("BasicContact");
        var source = this.testdata.getSource("BasicContact");
        var DOB = this.testdata.getDOB("BasicContact");
        var gender = this.testdata.getGender("BasicContact");
        var telephone = this.testdata.getTelephone("BasicContact");
        var email = this.testdata.getEmail("BasicContact");
        var buildingName = this.testdata.getBuildingName("BasicContact");
        var buildingNumber = this.testdata.getBuildingNumber("BasicContact");
        var street = this.testdata.getStreet("BasicContact");
        var locality = this.testdata.getLocality("BasicContact");
        var town = this.testdata.getTown("BasicContact");
        var country = this.testdata.getCountry("BasicContact");
        var postcode = this.testdata.getPostcode("BasicContact");
        var tacsacceptedversion = this.testdata.getTacsacceptedversion("BasicContact");
        var tacsacceptedon = this.testdata.getTacsacceptedone("BasicContact")
        var privacyPolicyVersio  = this.testdata.getPrivacypolicyacceptedversion("BasicContact");
        var privacyPolicyDate = this.testdata.getPrivacypolicyacceptedon("BasicContact")
        var cookiesVersion = this.testdata.getCookiespolicyacceptedversion("BasicContact");
        var cookiesDate = this.testdata.getCookiespolicyacceptedon("BasicContact")

        //generate random 12 digit number - used to generate unique Postman token 
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // apended in B2CObjID to generate random unique B2CObjectId   
        const elevenDigitRandomNum = Math.floor(Math.pow(10, 11 - 1) + Math.random() * (Math.pow(10, 11) - Math.pow(10, 11 - 1) - 1));

        console.log("");
        let midRandon = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonOne = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonTwo = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let postFix = "8d" + midRandon + "-de6a" + randonOne + "ac" + randonTwo + "a8";

        let b2cObject;

        switch (validationtype) {
            case "BasicContact":
                console.log("---  TESTING Creating a BASIC Contact ---");
                // b2cObject = b2cObjectID + postFix;
                b2cObject = b2cObjectID + postFix;
                console.log("--- b2cObject: " + b2cObject);
                var contEmail = this.testdata.getEmail("BasicContact");
                email = (Math.random().toString().slice(2,5)) + "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                break;
            case "BasicContactCitizen":
                console.log("---  TESTING Creating a BASIC Contact - CITIZEN ---");    
                console.log("");
                b2cObject = b2cObjectID + postFix;
                var contEmail = this.testdata.getEmail("BasicContact");
                email = (Math.random().toString().slice(2,5)) + "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                isCitizen = this.testdata.getIsCitizen("BasicContactCitizen");
                firstName = this.testdata.getFirstName("BasicContactCitizen");
                middleName = this.testdata.getMiddleName("BasicContactCitizen");
                lastName = this.testdata.getLastName("BasicContactCitizen");    
                console.log("--- isCitizen: " + isCitizen);   
                console.log("--- firstName: " + firstName);   
                console.log("--- lastName: " + lastName);         
                console.log("*** emailAddress: " + email);    
                break;
            case "ContactMissingFirstName":
                console.log("---  TESTING Creating Contact with MISSING FirstName ---");
                firstName = this.testdata.getFirstName("ContactMissingFirstName");
                console.log("--- Contact FirstName: " + firstName);
                b2cObject = b2cObjectID + postFix;
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                break;
            case "ContactMissingLastName":
                console.log("---  TESTING Creating Contact with MISSING LastName ---");
                lastName = this.testdata.getLastName("ContactMissingLastName");
                console.log("--- Contact LastName: " + lastName);
                b2cObject = b2cObjectID + postFix;
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                break;
            case "DuplicateB2cObjectId":
                console.log("---  TESTING Duplicate B2CObjectID ---");
                b2cObject = this.testdata.getB2CObjectID("DuplicateB2cObjectId");
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                console.log("--- B2CObjectID: " + b2cObject);
                break;
            case "InvalidB2cObjectId":
                console.log("--- TESTING Invalide B2CObjectID ---");
                b2cObject = this.testdata.getB2CObjectID("InvalidB2cObjectId");
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                console.log("--- InvalidB2cObjectId: " + b2cObject);
                break;
            case "ContactWithDuplicateEmail":
                console.log("--- TESTING Duplicate B2CObjectID ---");
                email = this.testdata.getEmail("ContactWithDuplicateEmail");
                console.log("--- Duplicate Email: " + email);
                break;
            case "ContactMissingTnCDate":
                console.log("--- TESTING creating Contact with MISSING TandC Date ---");
                b2cObject = b2cObjectID + postFix;
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                tacsacceptedon = this.testdata.getTacsacceptedone("ContactMissingTnCDate");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            case "ContactInvalidTnCDate":
                console.log("--- TESTING creating Contact with INVALID TandC Date ---");
                b2cObject = b2cObjectID + postFix;
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                tacsacceptedon = this.testdata.getTacsacceptedone("ContactInvalidTnCDate");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            case "ContactMissingCorAddress":
                console.log("--- TESTING creating a new CITIZEN Contact with MISSING Corresponding Address ---");            
                b2cObject = b2cObjectID + postFix;
                isCitizen = this.testdata.getIsCitizen("ContactMissingCorAddress");
                buildingName = this.testdata.getBuildingName("ContactMissingCorAddress");
                buildingNumber = this.testdata.getBuildingNumber("ContactMissingCorAddress");
                street = this.testdata.getStreet("ContactMissingCorAddress");
                country = this.testdata.getCountry("ContactMissingCorAddress");
                postcode = this.testdata.getPostcode("ContactMissingCorAddress");
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                console.log("");
                break;
            case "MissingBuildNameNo":
                console.log("--- TESTING creating a new CITIZEN Contact with MISSING Building Name OR Number fields ---");            
                b2cObject = b2cObjectID + postFix;     
                isCitizen = this.testdata.getIsCitizen("ContactMissingCorAddress");
                buildingName = this.testdata.getBuildingName("ContactMissingCorAddress");
                buildingNumber = this.testdata.getBuildingNumber("ContactMissingCorAddress");
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                console.log("buildingName: " + buildingName);
                console.log("buildingNumber: " + buildingNumber);
                console.log("");
                break;
            case "MissingStreet":
                console.log("--- TESTING creating a new CITIZEN Contact with MISSING street field ---");            
                b2cObject = b2cObjectID + postFix;     
                street = this.testdata.getStreet("ContactMissingCorAddress");
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                console.log("");
                console.log("street: " + street);
                break;
            case "MissingCountry":
                console.log("--- TESTING creating a new CITIZEN Contact with MISSING Country field ---");            
                b2cObject = b2cObjectID + postFix;     
                country = this.testdata.getCountry("ContactMissingCorAddress");
                var contEmail = this.testdata.getEmail("BasicContact");
                email = "contact" + (Math.random().toString().slice(2,5)) + contEmail;
                console.log("*** emailAddress: " + email);
                console.log("");
                console.log("country: " + country);
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        //options for api response :- need to change postman token so used random 12 digit in the end
        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/contacts?$select=contactid,defra_uniquereference',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                // Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            body: { 
             'defra_title': title, 'defra_b2cobjectid': b2cObject, 'gendercode': gender, 'firstname': firstName, 'middlename': middleName, 'lastname': lastName, 'emailaddress1': email, 'birthdate': DOB, 'telephone1': telephone,
             'defra_cmcreateascitizen': isCitizen,
             'defra_cmcreationsource': source,
             'defra_addrcorbuildingname': buildingName,
             'defra_addrcorbuildingnumber': buildingNumber,
             'defra_addrcorstreet': street,
             'defra_addrcorlocality': locality,
             'defra_addrcortown': town,
             'defra_addrcorcountry@odata.bind': country,
             'defra_addrcorpostcode': postcode,
             'defra_tacsacceptedversion': tacsacceptedversion,
             'defra_tacsacceptedon': tacsacceptedon,
             'defra_cookiespolicyacceptedversion': cookiesVersion,
             'defra_cookiespolicyacceptedon': cookiesDate,
             'defra_privacypolicyacceptedversion': privacyPolicyVersio,
             'defra_privacypolicyacceptedon': privacyPolicyDate      
             },
            json: true
        };

        //Calling request to return a promise so that it will use the returning values andperform the rest of the assertions/actions
        var initializePromise = await this.initialize(options);
        statusCodeVal = initializePromise.statusCode;

        if (statusCodeVal === 200 || statusCodeVal === 201) {
            console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            console.log("TEXT:       " + initializePromise.statusMessage);

            //console.log("Contact-ID: " + JSON.stringify(response.body["contactid"]));
            console.log("");
            console.log("Assertion TEXT: " + statusMsg);
            console.log("Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            contactID = JSON.stringify(initializePromise.body["contactid"]);
            fs.writeFile('CustID.txt', contactID, function (err) {
                if (err) throw err;
            });

            //ADD it to the json file - note we actually don't need the txt file for relationship

            var obj = {
                custID: []
             };
    
            obj.custID.push({id: contactID});
            var json = JSON.stringify(obj);
            
            fs.writeFile('contactid.json', contactID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });


            fs.appendFileSync('CustIDAll.txt', "\n" + contactID, function (err) {
                if (err) throw err;
            });

            console.log("--- Contact-ID: " + contactID);

            // chai.expect(JSON.stringify(response.body)).to.contain(statusMsg);
            chai.expect(JSON.stringify(initializePromise.body)).contain(statusMsg);
        }
        else if (statusCodeVal !== 200 || statusCodeVal !== 201) {
            console.log("");
            console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            console.log("TEXT:       " + initializePromise.statusMessage);

            console.log("");
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + errorText);

            chai.expect(errorText).to.contains(statusMsg);
            console.log("-- END --")
        }

    }

    //**************USE THIS**********************/
    async requestCreateOrg(token, validationtype, statusMsg) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        const eightDigitRandomNum = Math.floor(Math.pow(10, 8 - 1) + Math.random() * (Math.pow(10, 8) - Math.pow(10, 8 - 1) - 1));
        // console.log(elevenDigitRandomNum);

        //const emailRandom = Math.random().toString(36) + "@gmail.com";
        const emailRandomNo = Math.random().toString(36);
        //options for api response :- need to change postman token so used random 12 digit in the end

        var orgName = this.testdata.getOrgName("BasicOrgDetails");
        const orgIsUK = this.testdata.getOrgIsUK("BasicOrgDetails");
        var orgType = this.testdata.getOrgType("BasicOrgDetails");
        var charityNo = this.testdata.getCharityNo("BasicOrgDetails");
        var orgCRN = this.testdata.getOrgCRN("BasicOrgDetails");
        var orgEmail = this.testdata.getOrgEmail("BasicOrgDetails");
        var orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("BasicOrgDetails");
        var orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("BasicOrgDetails");
        var orgRegsubbuildingname = this.testdata.getOrgRegSubBuildingName("BasicOrgDetails");
        var orgRegaddstreet = this.testdata.getOrgRegStreet("BasicOrgDetails");
        var orgRegaddlocality = this.testdata.getOrgRegLocality("BasicOrgDetails");
        var orgRegcounty = this.testdata.getOrgRegCounty("BasicOrgDetails");
        var orgRegtown = this.testdata.getOrgRegTown("BasicOrgDetails");
        var orgRegcountry = this.testdata.getOrgRegCountry("BasicOrgDetails");
        var orgRegpostcode = this.testdata.getOrgRegPostcode("BasicOrgDetails");
        // Organisation Correespondence Address Registration Details
        var orgCoraddbuildingname = this.testdata.getOrgCorBuildingName("BasicOrgDetails");
        var orgCoraddbuildingno = this.testdata.getOrgCorBuildingNo("BasicOrgDetails");
        var orgCorsubbuildingname = this.testdata.getOrgCorSubBuildingName("BasicOrgDetails");
        var orgCoraddstreet = this.testdata.getOrgCorStreet("BasicOrgDetails");
        var orgCoraddlocality = this.testdata.getOrgCorLocality("BasicOrgDetails");
        var orgCorcounty = this.testdata.getOrgCorCounty("BasicOrgDetails");
        var orgCortown = this.testdata.getOrgCorTown("BasicOrgDetails");
        var orgCorcountry = this.testdata.getOrgCorCountry("BasicOrgDetails");   
        var orgCorpostcode = this.testdata.getOrgCorPostcode("BasicOrgDetails");  

        switch (validationtype) {

            case "BasicOrgDetails":
                console.log("--- Creating a Basic Organisation ---");
                orgName = orgName + " " + Math.random().toString(36).substr(2, 5);
                orgEmail = Math.random().toString(36) + "@gmail.com";
                orgCRN = Math.random().toString().slice(2,10);
                console.log("ORGANISATION CRN:- " + orgCRN);
                break;
            case "BasicOrg_LTD":
                console.log("--- Creating a Basic LTD-Organisation ---");
                orgName = orgName + "LTD" + "-" + Math.random().toString(36).substr(2, 5);
                orgType = this.testdata.getOrgType("BasicOrg_LTD");
                orgEmail = Math.random().toString(36) + "@ltdtest.com";
                orgCRN = Math.random().toString().slice(2,10);
                console.log("ORGANISATION TypeID:- " + orgType);
                console.log("ORGANISATION CRN:- " + orgCRN);
                break;
            case "BasicOrg_PLC":
                console.log("--- Creating a Basic PLC-Organisation ---");
                orgName = orgName + "PLC" + "-" + Math.random().toString(36).substr(2, 5);
                orgType = this.testdata.getOrgType("BasicOrg_PLC");
                orgEmail = Math.random().toString(36) + "@plctest.com";
                orgCRN = Math.random().toString().slice(2,10);
                console.log("ORGANISATION TypeID:- " + orgType);
                console.log("ORGANISATION CRN:- " + orgCRN);
                break;
            case "BasicOrg_LLP":
                console.log("--- Creating a Basic LLP-Organisation ---");
                orgName = orgName + "LLP" + "-" + Math.random().toString(36).substr(2, 5);
                orgType = this.testdata.getOrgType("BasicOrg_LLP");
                orgEmail = Math.random().toString(36) + "@llptest.com";
                orgCRN = Math.random().toString().slice(2,10);
                console.log("ORGANISATION TypeID:- " + orgType);
                console.log("ORGANISATION CRN:- " + orgCRN);
                break;
            case "MissingOrgNameCheck":
                console.log("--- MISSING Org Name TEST ---");
                orgName = this.testdata.getOrgName("MissingOrgNameCheck");
                orgCRN = Math.random().toString().slice(2,10);
                console.log("--- Org Name: " + orgName);
                break;
            case "MissingOrgType":
                console.log("--- MISSING Org Type TEST --");
                name = this.testdata.getOrgName("MissingOrgType");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("MissingOrgType");
                orgCRN = Math.random().toString().slice(2,10);
                console.log("--- Org NAME: " + orgName);
                console.log("--- Org TYPE: " + orgType);
                console.log("--- Org CRN : " + orgCRN);
                break;
            case "MissingCRNCheck":
                console.log("--- Missing CRN TEST ---");
                orgCRN = this.testdata.getOrgCRN("MissingCRNCheck");
                console.log("--- Org CRN: " + orgCRN);
                break;
            case "DuplicateCRNCheck":
                console.log("--- Duplicated CRN TEST ---");
                orgCRN = this.testdata.getOrgCRN("DuplicateCRNCheck");
                console.log("--- Duplicate CRN: " + orgCRN);
                break;
            case "CRNGreaterThanCheck":
                console.log("--- CRN GREATER THAN 8 Char TEST ---");
                orgCRN = this.testdata.getOrgCRN("CRNGreaterThanCheck");
                break;
            case "CRNLessThanCheck":
                console.log("--- CRN LESS THAN 8 Char TEST ---");
                orgCRN = this.testdata.getOrgCRN("CRNLessThanCheck");
                break;
            case "LLP_OrgDetails":
                console.log("--- Create Charity Organisation TEST ---");
                var name = this.testdata.getOrgName("LLPOrgDetails");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("LLPOrgDetails");
                orgCRN = Math.random().toString().slice(2,10);
                break;
            case "MissingRegAddress":
                console.log("--- MISSING Registered Address TEST ---");
                orgName = this.testdata.getOrgName("MissingRegAddressCheck");
                orgCRN = this.testdata.getOrgCRN("MissingRegAddressCheck");
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("MissingRegAddressCheck");
                orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("MissingRegAddressCheck");
                orgRegsubbuildingname = this.testdata.getOrgRegSubBuildingName("MissingRegAddressCheck");
                orgRegaddstreet = this.testdata.getOrgRegStreet("MissingRegAddressCheck");
                orgRegaddlocality = this.testdata.getOrgRegLocality("MissingRegAddressCheck");
                orgRegcounty = this.testdata.getOrgRegCounty("MissingRegAddressCheck");
                orgRegtown = this.testdata.getOrgRegTown("MissingRegAddressCheck");
                orgRegpostcode = this.testdata.getOrgRegPostcode("MissingRegAddressCheck"); 
                console.log("Missing Registered ADDRESS!! ");     
                break;
            case "MissingStreet":
                console.log("--- MISSING Registered Address TEST ---");
                orgName = this.testdata.getOrgName("MissingStreetCheck");
                orgCRN = this.testdata.getOrgCRN("MissingStreetCheck");
                orgRegaddstreet = this.testdata.getOrgRegStreet("MissingStreetCheck");  
                console.log("Missing STREET in ADDRESS!! ");     
                break;
            case "MissingBuildingNameAndNo":
                console.log("--- MISSING Building name and Number in Address TEST ---");
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("MissingRegAddressCheck");
                orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("MissingRegAddressCheck");
                console.log("Missing Building Name and Number in ADDRESS!! ");     
                break;
            case "BasicOrg_SoleTrader":
                console.log("--- Creating a 'SOLE TRADER' Organisation TEST ---");
                name = this.testdata.getOrgName("BasicOrgSoleTrader");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("BasicOrgSoleTrader");
                orgCRN = this.testdata.getOrgCRN("BasicOrgSoleTrader");
                orgEmail = this.testdata.getOrgEmail("BasicOrgSoleTrader");
                break;
            case "BasicOrg_Government":
                console.log("--- Creating a 'GOVERNMENT' Organisation TEST ---");
                name = this.testdata.getOrgName("BasicOrgGovernment");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("BasicOrgGovernment");
                orgCRN = this.testdata.getOrgCRN("BasicOrgGovernment");
                orgEmail = this.testdata.getOrgEmail("BasicOrgGovernment");
                break;
            case "BasicOrg_NotForProfit":
                console.log("--- Creating a 'NOT-FOR-PROFIT' Organisation TEST ---");
                name = this.testdata.getOrgName("BasicOrgNotForProfit");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("BasicOrgNotForProfit");
                orgCRN = this.testdata.getOrgCRN("BasicOrgNotForProfit");
                orgEmail = this.testdata.getOrgEmail("BasicOrgNotForProfit");
                break;
            case "BasicOrg_CompAuthority":
                console.log("--- Creating a 'COMPETENT-AUTHORITY' Organisation TEST ---");
                name = this.testdata.getOrgName("BasicOrgCompAuthority");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("BasicOrgCompAuthority");
                orgCRN = this.testdata.getOrgCRN("BasicOrgCompAuthority");
                orgEmail = this.testdata.getOrgEmail("BasicOrgCompAuthority");
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/accounts?$select=accountid,defra_uniquereference',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            //System-test enviroment
            body: { 
                'name': orgName,
                'defra_isuk': orgIsUK,
                'defra_type': orgType,
                // 'defra_charitynumber': charityNo,
                'defra_cmcrn': orgCRN,
                'emailaddress1': orgEmail,
                'defra_addrregbuildingname': orgRegaddbuildingname,
                'defra_addrregbuildingnumber': orgRegaddbuildingno,
                'defra_addrregsubbuildingname': orgRegsubbuildingname,
                'defra_addrregstreet': orgRegaddstreet,
                'defra_addrreglocality': orgRegaddlocality,
                'defra_addrregcounty': orgRegcounty,
                'defra_addrregtown': orgRegtown,
                'defra_addrregcountry@odata.bind': orgRegcountry,
                'defra_addrregpostcode': orgRegpostcode, 
                'defra_addrcorbuildingname': orgCoraddbuildingname,
                'defra_addrcorbuildingnumber': orgCoraddbuildingno,
                'defra_addrcorsubbuildingname': orgCorsubbuildingname,
                'defra_addrcorstreet': orgCoraddstreet,
                'defra_addrcorlocality': orgCoraddlocality,
                'defra_addrcorcounty': orgCorcounty,
                'defra_addrcortown': orgCortown,
                'defra_addrcorcountry@odata.bind': orgCorcountry,
                'defra_addrcorpostcode': orgCorpostcode 
                },
            json: true
        };

        var initializePromise = await this.initialize(options);

        statusCodeVal = initializePromise.statusCode;

        //console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;

        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT      : " + initializePromise.statusMessage);

        if (statusCode === 200 || statusCode === 201) {
            console.log("");
            console.log("--- Org NAME : " + orgName);
            console.log("--- Org CRN  : " + orgCRN);

            organisationID = JSON.stringify(initializePromise.body["accountid"]);

            fs.writeFile('OrgID.txt', organisationID, function (err) {
                if (err) throw err;
            });

            //ADD it to the json file - note we actually don't need the txt file for relationship
            var obj = {
                orgID: []
            };

            obj.orgID.push({id: organisationID});
            var json = JSON.stringify(obj);

            fs.writeFile('organisationid.json', organisationID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });

            fs.appendFileSync('OrgIDAll.txt', "\n" + organisationID, function (err) {
                if (err) throw err;
            });

            console.log("--- Organisation/Account-ID: " + organisationID);
            console.log("");

            console.log("-- Assertion TEXT: " + statusMsg);
            console.log("-- Responce BODY : " + JSON.stringify(initializePromise.body));
            chai.expect(JSON.stringify(initializePromise)).to.not.contain(statusMsg); 
            console.log("-- END --")

            // chai.expect(JSON.stringify(response)).to.contain('"status\\":\\"success\\",\\"code\\":200,\\"message\\":\\"\\"}"');
        }
        else if (statusCode !== 200 || statusCode !== 201) {
            console.log("");
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + errorText);

            chai.expect(errorText).to.contains(statusMsg);
            console.log("-- END --")

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }  

    //**************USE THIS**********************/
    async requestCreateOrgNEW(token, orgtype, validationtype, statusMsg) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        const eightDigitRandomNum = Math.floor(Math.pow(10, 8 - 1) + Math.random() * (Math.pow(10, 8) - Math.pow(10, 8 - 1) - 1));
        // console.log(elevenDigitRandomNum);

        //const emailRandom = Math.random().toString(36) + "@gmail.com";
        const emailRandomNo = Math.random().toString(36);
        //options for api response :- need to change postman token so used random 12 digit in the end

        var orgIsUK = this.testdata.getOrgIsUK("BasicOrgDetails");
        var orgName = this.testdata.getOrgName("BasicOrgDetails");   
        var orgType = this.testdata.getOrgType("BasicOrgDetails");
        var charityNo = this.testdata.getCharityNo("BasicOrgDetails");
        var orgCRN = this.testdata.getOrgCRN("BasicOrgDetails");
        var orgEmail = this.testdata.getOrgEmail("BasicOrgDetails");
        var orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("BasicOrgDetails");
        var orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("BasicOrgDetails");
        var orgRegsubbuildingname = this.testdata.getOrgRegSubBuildingName("BasicOrgDetails");
        var orgRegaddstreet = this.testdata.getOrgRegStreet("BasicOrgDetails");
        var orgRegaddlocality = this.testdata.getOrgRegLocality("BasicOrgDetails");
        var orgRegcounty = this.testdata.getOrgRegCounty("BasicOrgDetails");
        var orgRegtown = this.testdata.getOrgRegTown("BasicOrgDetails");
        var orgRegcountry = this.testdata.getOrgRegCountry("BasicOrgDetails");
        var orgRegpostcode = this.testdata.getOrgRegPostcode("BasicOrgDetails");
        // --- Organisation Correespondence Address Registration Details ---
        var orgCoraddbuildingname = this.testdata.getOrgCorBuildingName("BasicOrgDetails");
        var orgCoraddbuildingno = this.testdata.getOrgCorBuildingNo("BasicOrgDetails");
        var orgCorsubbuildingname = this.testdata.getOrgCorSubBuildingName("BasicOrgDetails");
        var orgCoraddstreet = this.testdata.getOrgCorStreet("BasicOrgDetails");
        var orgCoraddlocality = this.testdata.getOrgCorLocality("BasicOrgDetails");
        var orgCorcounty = this.testdata.getOrgCorCounty("BasicOrgDetails");
        var orgCortown = this.testdata.getOrgCorTown("BasicOrgDetails");
        var orgCorcountry = this.testdata.getOrgCorCountry("BasicOrgDetails");   
        var orgCorpostcode = this.testdata.getOrgCorPostcode("BasicOrgDetails");      

        if(orgtype == "LTD"){
            console.log("--- Creating a Basic LTD-Organisation ---");
            orgType = this.testdata.getOrgType("BasicOrg_LTD");
        }
        if(orgtype == "PLC"){
            console.log("--- Creating a Basic PLC-Organisation ---");
            orgType = this.testdata.getOrgType("BasicOrg_PLC"); 
        }
        if(orgtype == "LLP"){
            console.log("--- Creating a Basic LLP-Organisation ---");
            orgType = this.testdata.getOrgType("BasicOrg_LLP");                
        }  

        switch (validationtype) {
            case "Basic_Org":             
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgEmail = Math.random().toString(36) + "@ltdtest.com";
                orgCRN = Math.random().toString().slice(2,10);
                break;
             case "MissingOrgName":
                console.log("*** MISSING Organisation Name TEST ***");
                orgName = this.testdata.getOrgName("MissingOrgNameCheck");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                console.log("--- Organisation Name :- " + orgName);
                console.log("--- Organisation Email:- " + orgEmail);
                break;
            case "MissingOrgType":
                console.log("--- MISSING Org Type TEST --");
                var name = this.testdata.getOrgName("MissingOrgType");
                orgName = orgtype + " - " + name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("MissingOrgType");
                orgCRN = Math.random().toString().slice(2,10);
                console.log("--- Org NAME: " + orgName);
                console.log("--- Org TYPE: " + orgType);
                console.log("--- Org CRN : " + orgCRN);
                break;
            case "MissingCRNCheck":
                console.log("*** Missing CRN TEST ***");
                orgCRN = this.testdata.getOrgCRN("MissingCRNCheck");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                console.log("--- Org CRN  : " + orgCRN);
                console.log("--- Org email: " + orgEmail);
                break;
            case "DuplicateCRNCheck":
                console.log("--- Duplicated Organisation CRN TEST ---");
                orgCRN = this.testdata.getOrgCRN("DuplicateCRNCheck");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                console.log("--- Duplicate Email: " + orgEmail);
                console.log("--- Duplicate CRN  : " + orgCRN);
                break;
            case "CRNGreaterThan":
                console.log("--- CRN GREATER THAN 8 Char TEST ---");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                orgCRN = this.testdata.getOrgCRN("CRNGreaterThanCheck");
                console.log("--- CRN characters : " + orgCRN);
                break;
            case "CRNLessThan":
                console.log("--- CRN LESS THAN 8 Char TEST ---");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                orgCRN = this.testdata.getOrgCRN("CRNLessThanCheck");
                console.log("--- CRN characters: " + orgCRN);
                break;
            case "LLP_OrgDetails":
                console.log("--- Create Charity Organisation TEST ---");
                var name = this.testdata.getOrgName("LLPOrgDetails");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("LLPOrgDetails");
                orgCRN = Math.random().toString().slice(2,10);
                break;
            case "MissingRegAddress":
                console.log("--- MISSING Registered Address TEST ---");
                orgName = this.testdata.getOrgName("MissingRegAddressCheck");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;       
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("MissingRegAddressCheck");
                orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("MissingRegAddressCheck");
                orgRegaddstreet = this.testdata.getOrgRegStreet("MissingRegAddressCheck");
                orgRegpostcode = this.testdata.getOrgRegPostcode("MissingRegAddressCheck");   
                console.log("Org Building Name:   " + orgRegsubbuildingname);
                console.log("Org Building Number: " + orgRegaddbuildingno);
                console.log("Org Street:          " + orgRegaddstreet);
                console.log("Org Postcode:        " + orgRegpostcode);
                break;
            case "MissingStreet":  
                console.log("--- MISSING Street TEST ---");
                orgName = this.testdata.getOrgName("MissingStreetCheck");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;   
                orgRegaddstreet = this.testdata.getOrgRegStreet("MissingStreetCheck");  
                console.log("Org Street: " + orgRegaddstreet);   
                break;
            case "MissingPostCode":  
                console.log("--- MISSING Post-Code in Address TEST ---");
                orgName = this.testdata.getOrgName("Missing_Postcode");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email; 
                orgRegpostcode = this.testdata.getOrgRegPostcode("Missing_Postcode");    
                break;
            case "MissingBuildingNameAndNo":
                console.log("--- MISSING Building name and Number in Address TEST ---");
                orgName = this.testdata.getOrgName("MissingBuildingNameAndNo");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email; 
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("MissingBuildingNameAndNo");
                orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("MissingBuildingNameAndNo");
                console.log("Org Building Name  : " + orgRegaddbuildingname);    
                console.log("Org Building Number: " + orgRegaddbuildingno);    
                break;
            case "UKOrg_NonUk_Addr":          
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5) + "-UK";
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = "UK-" + orgtype + (Math.random().toString().slice(2,5)) + email; 
                orgCRN = Math.random().toString().slice(2,10);
                orgIsUK = this.testdata.getOrgIsUK ("UKOrg_NoneUKAddr");
                orgRegaddbuildingno  = this.testdata.getOrgRegBuildingNo("UKOrg_NoneUKAddr")
                orgRegcountry = this.testdata.getOrgRegCountry("UKOrg_NoneUKAddr")
                orgRegaddstreet = this.testdata.getOrgRegStreet ("UKOrg_NoneUKAddr")
                orgCoraddbuildingno  = this.testdata.getOrgCorBuildingNo("UKOrg_NoneUKAddr")
                orgCorcountry = this.testdata.getOrgCorCountry("UKOrg_NoneUKAddr")
                orgCoraddstreet = this.testdata.getOrgCorStreet ("UKOrg_NoneUKAddr")
                break;
            case "NonUkOrg_NoAdd":         
                orgIsUK = this.testdata.getOrgIsUK ("NoneUK_Org");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5) + "-Non-UK";
                orgCRN = this.testdata.getOrgCRN("NoneUK_Org");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = "NonUK_" + orgtype + (Math.random().toString().slice(2,5)) + email; 
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("NoneUK_Org")
                orgRegaddbuildingno  = this.testdata.getOrgRegBuildingNo("NoneUK_Org")
                orgRegcountry = this.testdata.getOrgRegCountry("NoneUK_Org")
                orgRegaddstreet = this.testdata.getOrgRegStreet ("NoneUK_Org")
                orgCoraddbuildingname = this.testdata.getOrgCorBuildingName("NoneUK_Org")
                orgCoraddbuildingno  = this.testdata.getOrgCorBuildingNo("NoneUK_Org")
                orgCorcountry = this.testdata.getOrgCorCountry("NoneUK_Org")
                orgCoraddstreet = this.testdata.getOrgCorStreet ("NoneUK_Org")

                console.log("IsUK     : " + orgIsUK);    
                console.log("Org Name : " + orgName);  
                console.log("Org CRN  : " + orgCRN);  
                console.log("Org Email: " + orgEmail);  
                console.log("");
                console.log("Reg Building Name  : " + orgRegaddbuildingname);    
                console.log("Reg Building Number: " + orgRegaddbuildingno);  
                console.log("Reg Address Country: " + orgRegcountry);  
                console.log("Reg Address Street : " + orgRegaddstreet);  
                console.log("");
                console.log("Cor Building Name  : " + orgCoraddbuildingname);    
                console.log("Cor Building Number: " + orgCoraddbuildingno);  
                console.log("Cor Address Country: " + orgCorcountry);  
                console.log("Cor Address Street : " + orgCoraddstreet); 
                break;
                case "NonUkOrg_NoCRN":         
                orgIsUK = this.testdata.getOrgIsUK ("NoneUK_Org");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5) + "-Non-UK";
                orgCRN = this.testdata.getOrgCRN("NoneUK_Org");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = "NonUK_" + orgtype + (Math.random().toString().slice(2,5)) + email; 

                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("NoneUKOrg_WithAdd")
                orgRegaddbuildingno  = this.testdata.getOrgRegBuildingNo("NoneUKOrg_WithAdd")
                orgRegcountry = this.testdata.getOrgRegCountry("NoneUKOrg_WithAdd")
                orgRegaddstreet = this.testdata.getOrgRegStreet ("NoneUKOrg_WithAdd")
                orgCoraddbuildingname = this.testdata.getOrgCorBuildingName("NoneUK_Org")
                orgCoraddbuildingno  = this.testdata.getOrgCorBuildingNo("NoneUK_Org")
                orgCorcountry = this.testdata.getOrgCorCountry("NoneUK_Org")
                orgCoraddstreet = this.testdata.getOrgCorStreet ("NoneUK_Org")
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/accounts?$select=accountid,defra_uniquereference',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            //System-test enviroment
            body: { 
                'name': orgName,
                'defra_isuk': orgIsUK,
                'defra_type': orgType,
                // 'defra_charitynumber': charityNo,
                'defra_cmcrn': orgCRN,
                'emailaddress1': orgEmail,
                'defra_addrregbuildingname': orgRegaddbuildingname,
                'defra_addrregbuildingnumber': orgRegaddbuildingno,
                'defra_addrregsubbuildingname': orgRegsubbuildingname,
                'defra_addrregstreet': orgRegaddstreet,
                'defra_addrreglocality': orgRegaddlocality,
                'defra_addrregcounty': orgRegcounty,
                'defra_addrregtown': orgRegtown,
                'defra_addrregcountry@odata.bind': orgRegcountry,
                'defra_addrregpostcode': orgRegpostcode, 
                'defra_addrcorbuildingname': orgCoraddbuildingname,
                'defra_addrcorbuildingnumber': orgCoraddbuildingno,
                'defra_addrcorsubbuildingname': orgCorsubbuildingname,
                'defra_addrcorstreet': orgCoraddstreet,
                'defra_addrcorlocality': orgCoraddlocality,
                'defra_addrcorcounty': orgCorcounty,
                'defra_addrcortown': orgCortown,
                'defra_addrcorcountry@odata.bind': orgCorcountry,
                'defra_addrcorpostcode': orgCorpostcode 
                },
            json: true
        };

        var initializePromise = await this.initialize(options);
        statusCodeVal = initializePromise.statusCode;

        //console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;

        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT      : " + initializePromise.statusMessage);

        if (statusCode === 200 || statusCode === 201) {
            console.log("");
            console.log("--- Org NAME : " + orgName);
            console.log("--- Org CRN  : " + orgCRN);
            organisationID = JSON.stringify(initializePromise.body["accountid"]);

            fs.writeFile('OrgID.txt', organisationID, function (err) {
                if (err) throw err;
            });

            //ADD it to the json file - note we actually don't need the txt file for relationship
            var obj = {
                orgID: []
            };

            obj.orgID.push({id: organisationID});
            var json = JSON.stringify(obj);

            fs.writeFile('organisationid.json', organisationID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });

            fs.appendFileSync('OrgIDAll.txt', "\n" + organisationID, function (err) {
                if (err) throw err;
            });

            console.log("--- Organisation/Account-ID: " + organisationID);
            console.log("");

            console.log("-- Assertion TEXT: " + statusMsg);
            console.log("-- Responce BODY : " + JSON.stringify(initializePromise.body));

            // chai.expect(JSON.stringify(initializePromise)).to.not.contain(statusMsg); 
            chai.expect(JSON.stringify(initializePromise)).contain(statusMsg); 
            console.log("--- THE END ---")
        }
        else if (statusCode !== 200 || statusCode !== 201) {
            console.log("");
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + errorText);

            chai.expect(errorText).to.contains(statusMsg);
            console.log("--- THE END ---")

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

      //**************USE THIS**********************/
      async requestCreateOrgOTHERS(token, orgtype, validationtype, statusMsg) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        const eightDigitRandomNum = Math.floor(Math.pow(10, 8 - 1) + Math.random() * (Math.pow(10, 8) - Math.pow(10, 8 - 1) - 1));
        // console.log(elevenDigitRandomNum);

        //const emailRandom = Math.random().toString(36) + "@gmail.com";
        const emailRandomNo = Math.random().toString(36);
        //options for api response :- need to change postman token so used random 12 digit in the end

        var orgIsUK = this.testdata.getOrgIsUK("BasicOrgDetails");
        var orgName = this.testdata.getOrgName("BasicOrgDetails");   
        var orgType = this.testdata.getOrgType("BasicOrgDetails");
        // var charityNo = this.testdata.getCharityNo("BasicOrgDetails");
        var orgCRN = this.testdata.getOrgCRN("BasicOrgDetails");
        var orgEmail = this.testdata.getOrgEmail("BasicOrgDetails");
        var orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("BasicOrgDetails");
        var orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("BasicOrgDetails");
        var orgRegsubbuildingname = this.testdata.getOrgRegSubBuildingName("BasicOrgDetails");
        var orgRegaddstreet = this.testdata.getOrgRegStreet("BasicOrgDetails");
        var orgRegaddlocality = this.testdata.getOrgRegLocality("BasicOrgDetails");
        var orgRegcounty = this.testdata.getOrgRegCounty("BasicOrgDetails");
        var orgRegtown = this.testdata.getOrgRegTown("BasicOrgDetails");
        var orgRegcountry = this.testdata.getOrgRegCountry("BasicOrgDetails");
        var orgRegpostcode = this.testdata.getOrgRegPostcode("BasicOrgDetails");
        // --- Organisation Correespondence Address Registration Details ---
        var orgCoraddbuildingname = this.testdata.getOrgCorBuildingName("BasicOrgDetails");
        var orgCoraddbuildingno = this.testdata.getOrgCorBuildingNo("BasicOrgDetails");
        var orgCorsubbuildingname = this.testdata.getOrgCorSubBuildingName("BasicOrgDetails");
        var orgCoraddstreet = this.testdata.getOrgCorStreet("BasicOrgDetails");
        var orgCoraddlocality = this.testdata.getOrgCorLocality("BasicOrgDetails");
        var orgCorcounty = this.testdata.getOrgCorCounty("BasicOrgDetails");
        var orgCortown = this.testdata.getOrgCorTown("BasicOrgDetails");
        var orgCorcountry = this.testdata.getOrgCorCountry("BasicOrgDetails");   
        var orgCorpostcode = this.testdata.getOrgCorPostcode("BasicOrgDetails");  

        if(orgtype == "SoleTrad"){
            orgType = this.testdata.getOrgType("BasicOrg_Sole");
            console.log("--- Organisation Type  :-" + orgType);
            console.log("");
        }
        if(orgtype == "Gov"){
            orgType = this.testdata.getOrgType("BasicOrg_Gov");
            console.log("--- Organisation Type  :-" + orgType);
            console.log("");
        }
        if(orgtype == "CompAuth"){
            orgType = this.testdata.getOrgType("BasicOrg_Comp");
            console.log("--- Organisation Type  :-" + orgType);
            console.log("");
        }

        switch (validationtype) {
            case "Basic_Org":
                console.log("*** Creating a '" + orgtype + "' Organisation ***");   
                var name = this.testdata.getOrgName("BasicOrgDetails");
                orgName = name + orgtype + "-" + (Math.random().toString().slice(2,4));
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                console.log("--- Organisation Name :- " + orgName);
                console.log("--- Organisation Email:- " + orgEmail);
                break;
            case "MissingOrgName":
                console.log("*** '" + orgtype + "' MISSING Organisation Name TEST ***");
                orgName = this.testdata.getOrgName("MissingOrgNameCheck");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;
                console.log("--- Organisation Name :- " + orgName);
                console.log("--- Organisation Email:- " + orgEmail);
                break;
            case "MissingOrgType":
                console.log("*** '" + orgtype + "' MISSING Organisation Type TEST ***");
                var name = this.testdata.getOrgName("MissingOrgType");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("MissingOrgType");
                console.log("--- Org NAME: " + orgName);
                console.log("--- Org TYPE: " + orgType);
                break;
            case "MissingRegAddress":
                console.log("*** '" + orgtype + "' MISSING Registered Address TEST ***");
                orgName = this.testdata.getOrgName("MissingRegAddressCheck");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;   
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("MissingRegAddressCheck");          
                orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("MissingRegAddressCheck");      
                orgRegaddstreet = this.testdata.getOrgRegStreet("MissingRegAddressCheck"); 
                orgRegpostcode = this.testdata.getOrgRegPostcode("MissingRegAddressCheck"); 
                console.log("Building Name:   " + orgRegaddbuildingname); 
                console.log("Building Number: " + orgRegaddbuildingno); 
                console.log("Street:          " + orgRegaddstreet); 
                console.log("Post-Code:       " + orgRegpostcode); 
                console.log("Email Address:   " + orgEmail);    
                break;
            case "MissingStreet":
                console.log("--- '" + orgtype + "' MISSING street TEST ---");
                orgName = this.testdata.getOrgName("MissingStreetCheck");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email;   
                orgRegaddstreet = this.testdata.getOrgRegStreet("MissingStreetCheck");  
                console.log("Missing STREET in ADDRESS !! ");     
                break;
            case "MissingBuildingNameAndNo":
                console.log("--- '" + orgtype + "' MISSING Building Name and Number in Address TEST ---");
                orgName = this.testdata.getOrgName("MissingRegAddressCheck");
                orgCRN = Math.random().toString().slice(2,10);
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = orgtype + (Math.random().toString().slice(2,5)) + email; 
                orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("MissingRegAddressCheck");
                orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("MissingRegAddressCheck");
                console.log("Missing Building Name and Number in ADDRESS !! ");     
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/accounts?$select=accountid,defra_uniquereference',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            //System-test enviroment
            body: { 
                'name': orgName,
                'defra_isuk': orgIsUK,
                'defra_type': orgType,
                // 'defra_charitynumber': charityNo,
                // 'defra_cmcrn': orgCRN,
                'emailaddress1': orgEmail,
                'defra_addrregbuildingname': orgRegaddbuildingname,
                'defra_addrregbuildingnumber': orgRegaddbuildingno,
                'defra_addrregsubbuildingname': orgRegsubbuildingname,
                'defra_addrregstreet': orgRegaddstreet,
                'defra_addrreglocality': orgRegaddlocality,
                'defra_addrregcounty': orgRegcounty,
                'defra_addrregtown': orgRegtown,
                'defra_addrregcountry@odata.bind': orgRegcountry,
                'defra_addrregpostcode': orgRegpostcode, 
                'defra_addrcorbuildingname': orgCoraddbuildingname,
                'defra_addrcorbuildingnumber': orgCoraddbuildingno,
                'defra_addrcorsubbuildingname': orgCorsubbuildingname,
                'defra_addrcorstreet': orgCoraddstreet,
                'defra_addrcorlocality': orgCoraddlocality,
                'defra_addrcorcounty': orgCorcounty,
                'defra_addrcortown': orgCortown,
                'defra_addrcorcountry@odata.bind': orgCorcountry,
                'defra_addrcorpostcode': orgCorpostcode 
                },
            json: true
        };

        var initializePromise = await this.initialize(options);
        statusCodeVal = initializePromise.statusCode;
        //console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;

        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT      : " + initializePromise.statusMessage);

        if (statusCode === 200 || statusCode === 201) {

            organisationID = JSON.stringify(initializePromise.body["accountid"]);

            fs.writeFile('OrgID.txt', organisationID, function (err) {
                if (err) throw err;
            });

            //ADD it to the json file - note we actually don't need the txt file for relationship
            var obj = {
                orgID: []
            };

            obj.orgID.push({id: organisationID});
            var json = JSON.stringify(obj);

            fs.writeFile('organisationid.json', organisationID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });

            fs.appendFileSync('OrgIDAll.txt', "\n" + organisationID, function (err) {
                if (err) throw err;
            });

            console.log("");
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + JSON.stringify(initializePromise.body));
            // chai.expect(JSON.stringify(initializePromise)).to.not.contain(statusMsg); 
            chai.expect(JSON.stringify(initializePromise)).contain(statusMsg); 
            console.log("");
            console.log("-- THE END --")
        }
        else if (statusCode !== 200 || statusCode !== 201) {
            console.log("");

            var errorText = JSON.stringify(initializePromise.body.error["message"]);
              
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + errorText);

            chai.expect(errorText).to.contains(statusMsg);
            console.log("-- THE END --")

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/
    async requestCreateCharityOrg(token, charityType, validationtype, statusMsg) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        const eightDigitRandomNum = Math.floor(Math.pow(10, 8 - 1) + Math.random() * (Math.pow(10, 8) - Math.pow(10, 8 - 1) - 1));
        // console.log(elevenDigitRandomNum);

        //const emailRandom = Math.random().toString(36) + "@gmail.com";
        const emailRandomNo = Math.random().toString(36);
        //options for api response :- need to change postman token so used random 12 digit in the end

        var orgName = this.testdata.getOrgName("BasicOrgDetails");
        const orgIsUK = this.testdata.getOrgIsUK("BasicOrgDetails");
        var orgType = this.testdata.getOrgType("BasicOrgDetails");
        var charityNo = this.testdata.getCharityNo("BasicOrgDetails");
        var charityNoEnW = "";
        var charityNoNI = "";
        var charityNoScot = "";
        var orgCRN = this.testdata.getOrgCRN("BasicOrgDetails");
        var orgEmail = this.testdata.getOrgEmail("BasicOrgDetails");
        var orgRegaddbuildingname = this.testdata.getOrgRegBuildingName("BasicOrgDetails");
        var orgRegaddbuildingno = this.testdata.getOrgRegBuildingNo("BasicOrgDetails");
        var orgRegsubbuildingname = this.testdata.getOrgRegSubBuildingName("BasicOrgDetails");
        var orgRegaddstreet = this.testdata.getOrgRegStreet("BasicOrgDetails");
        var orgRegaddlocality = this.testdata.getOrgRegLocality("BasicOrgDetails");
        var orgRegcounty = this.testdata.getOrgRegCounty("BasicOrgDetails");
        var orgRegtown = this.testdata.getOrgRegTown("BasicOrgDetails");
        var orgRegcountry = this.testdata.getOrgRegCountry("BasicOrgDetails");
        var orgRegpostcode = this.testdata.getOrgRegPostcode("BasicOrgDetails");
        // Organisation Correespondence Address Registration Details
        var orgCoraddbuildingname = this.testdata.getOrgCorBuildingName("BasicOrgDetails");
        var orgCoraddbuildingno = this.testdata.getOrgCorBuildingNo("BasicOrgDetails");
        var orgCorsubbuildingname = this.testdata.getOrgCorSubBuildingName("BasicOrgDetails");
        var orgCoraddstreet = this.testdata.getOrgCorStreet("BasicOrgDetails");
        var orgCoraddlocality = this.testdata.getOrgCorLocality("BasicOrgDetails");
        var orgCorcounty = this.testdata.getOrgCorCounty("BasicOrgDetails");
        var orgCortown = this.testdata.getOrgCorTown("BasicOrgDetails");
        var orgCorcountry = this.testdata.getOrgCorCountry("BasicOrgDetails");   
        var orgCorpostcode = this.testdata.getOrgCorPostcode("BasicOrgDetails");  

        console.log("");

        switch (validationtype) {

            case "Charity_BasicDetails":
                if(charityType === "EnW" || charityType === "Scot"){
                    console.log("--- Creating a Basic " + "'"+ charityType + "'" + " Charity Organisation ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var chaNum = this.testdata.getCharityNo("CharityOrgDetails");
                    var charNo = chaNum + (Math.random().toString().slice(2,5));
                    var email = this.testdata.getOrgEmail("BasicOrgDetails");
                    orgEmail = charityType + (Math.random().toString().slice(2,5)) + email; 
                    console.log("*** Email Address: " + orgEmail);
                    var charity = "charityNo" + charityType;

                    if(charity == "charityNoEnW" ){
                        charityNoEnW = charNo
                    }else{
                        charityNoScot = charNo
                    }
                    orgCRN = "";
                }
                else{
                    console.log("--- Creating a Basic 'Northan Ireland' Charity Organisation ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var email = this.testdata.getOrgEmail("BasicOrgDetails");
                    orgEmail = charityType + (Math.random().toString().slice(2,5)) + email; 
                    var chaNum = this.testdata.getCharityNo("CharityOrgDetails");
                    var charNo = chaNum + (Math.random().toString().slice(2,6));
                    charityNoNI = charNo;
                    var charity = "charityNo" + charityType;
                    console.log("Charity : " + charity);
                    orgCRN = "";
                }
                break;
            case "CharityNo_GreaterThan":
                if(charityType === "EnW" || charityType === "Scot"){
                    console.log("--- Creating a " + "'"+ charityType + "'" + " Charity Organisation with Charity-Number GREATER than 8 characters TEST ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var chaNum = this.testdata.getCharityNo("CharityOrgDetails");
                    var charNo = chaNum + (Math.random().toString().slice(2,7));
                    var charity = "charityNo" + charityType;
                    if(charity == "charityNoEnW" ){
                        charityNoEnW = charNo
                    }else{
                        charityNoScot = charNo
                    }
                    orgCRN = "";
                }
                else{
                    console.log("--- Creating a 'Northan Ireland' Charity Organisation with Charity-Number GREATER than 9 characters TEST ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var chaNum = this.testdata.getCharityNo("CharityOrgDetails");
                    var charNo = chaNum + (Math.random().toString().slice(2,9));
                    charityNoNI = charNo;

                    var charity = "charityNo" + charityType;
                    console.log("Charity : " + charity);
                    orgCRN = "";
                }
                break;
            case "CharityNo_NumericOnly":
                if(charityType === "EnW" || charityType === "Scot"){
                    console.log("--- Creating a " + "'"+ charityType + "'" + " Charity Organisation with Charity-Number in numeric formart ONLY ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var chaNum = this.testdata.getCharityNo("CharityNoNumericOnly");
                    var charNo = chaNum + (Math.random().toString().slice(2,5));
                    console.log("** Charity NUMBER is: " + charNo);
                    var charity = "charityNo" + charityType;

                    if(charity == "charityNoEnW" ){
                        charityNoEnW = charNo
                    }else{
                        charityNoScot = charNo
                    }
                    orgCRN = "";
                        }
                else{
                    console.log("--- Creating a 'Northan Ireland' Charity Organisation with Charity-Number in numeric formart ONLY ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var chaNum = this.testdata.getCharityNo("CharityNoNumericOnly");
                    var charNo = chaNum + (Math.random().toString().slice(2,6));
                    charityNoNI = charNo;
        
                    var charity = "charityNo" + charityType;
                    console.log("Charity : " + charity);
                    orgCRN = "";
                }
                break;
            case "CharityNo_AlphabitOnly":
                if(charityType === "EnW" || charityType === "Scot"){
                    console.log("--- Creating a " + "'"+ charityType + "'" + " Charity Organisation with Charity-Number in Alphabitic formart ONLY ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    var charNo = this.testdata.getCharityNo("CharityNoAlphabitOnly");
                    console.log("** Charity NUMBER is: " + charNum);
                    var charity = "charityNo" + charityType;

                    if(charity == "charityNoEnW" ){
                        charityNoEnW = charNo
                    }else{
                        charityNoScot = charNo
                    }
                orgCRN = "";
                }
                else{
                    console.log("--- Creating a 'Northan Ireland' Charity Organisation with Charity-Number in Alphabitic formart ONLY ---");
                    var name = this.testdata.getOrgName("CharityOrgDetails");
                    orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                    // console.log("Charity NAME: " + orgName);
                    orgType = this.testdata.getOrgType("BasicOrg_Char");
                    // console.log("Charity TYPE: " + orgType);
                    var chaNum = this.testdata.getCharityNo("CharityNoAlphabitOnly");
                    // var charNo = chaNum + (Math.random().toString().slice(2,6));
                    charityNoNI = chaNum;
                
                    var charity = "charityNo" + charityType;
                    console.log("*** Charity : " + charity);
                    orgCRN = "";
                }
                break;
            case "CharityNo_Duplicated":
                console.log("--- Create " + charityType + " Charity with Duplicate Charity-Number TEST ---");
                var name = this.testdata.getOrgName("CharityOrgDetails");
                orgName = name + "" + (Math.random().toString().slice(2,4) + " - " + charityType);
                orgType = this.testdata.getOrgType("BasicOrg_Char");
                var email = this.testdata.getOrgEmail("BasicOrgDetails");
                orgEmail = charityType + (Math.random().toString().slice(2,5)) + email;
                console.log("** Charity Email Address: " + orgEmail);

                var charNo = this.testdata.getCharityNo("CharityNoDuplicate");
                var charity = "charityNo" + charityType;
                console.log("** Charity Organisation : " + charity);

                if(charity == "charityNoEnW" ){
                    charityNoEnW = charNo
                }
                if(charity == "charityNoNI" ){
                    charityNoNI = charNo
                }
                if(charity == "charityNoScot" ){
                    charityNoScot = charNo
                }
                orgCRN = "";
                // console.log("Charity NUMBER: " + charNo);
                break;
            case "LLPOrgDetails":
                console.log("--- Create Charity Organisation TEST ---");
                var name = this.testdata.getOrgName("LLPOrgDetails");
                orgName = name + (Math.random().toString().slice(2,4));
                orgType = this.testdata.getOrgType("LLPOrgDetails");
                orgCRN = Math.random().toString().slice(2,10);
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        console.log("");
        console.log("England And Wales Charity Number: " + charityNoEnW);
        console.log("Northan Ireland charity Number  : " + charityNoNI);
        console.log("Scotland Charity Number         : " + charityNoScot);

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/accounts?$select=accountid,defra_uniquereference',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            //System-test enviroment
            body: { 
                'name': orgName,
                'defra_isuk': orgIsUK,
                'defra_type': orgType,
                'defra_charitynumber': charityNoEnW,
                'defra_charitynumberni': charityNoNI,
                'defra_charitynumberscot': charityNoScot,
                'emailaddress1': orgEmail,
                'telephone1': "0208 952 1345",
                'defra_addrregbuildingname': orgRegaddbuildingname,
                'defra_addrregbuildingnumber': orgRegaddbuildingno,
                'defra_addrregsubbuildingname': orgRegsubbuildingname,
                'defra_addrregstreet': orgRegaddstreet,
                'defra_addrreglocality': orgRegaddlocality,
                'defra_addrregcounty': orgRegcounty,
                'defra_addrregtown': orgRegtown,
                'defra_addrregcountry@odata.bind': orgRegcountry,
                'defra_addrregpostcode': orgRegpostcode, 
                'defra_addrcorbuildingname': orgCoraddbuildingname,
                'defra_addrcorbuildingnumber': orgCoraddbuildingno,
                'defra_addrcorsubbuildingname': orgCorsubbuildingname,
                'defra_addrcorstreet': orgCoraddstreet,
                'defra_addrcorlocality': orgCoraddlocality,
                'defra_addrcorcounty': orgCorcounty,
                'defra_addrcortown': orgCortown,
                'defra_addrcorcountry@odata.bind': orgCorcountry,
                'defra_addrcorpostcode': orgCorpostcode 
                },
            json: true
        };

        var initializePromise = await this.initialize(options);

        statusCodeVal = initializePromise.statusCode;

        //console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;

        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT      : " + initializePromise.statusMessage);

        if (statusCode === 200 || statusCode === 201) {
            console.log("");
            console.log("--- Charity NAME  : " + orgName);

            organisationID = JSON.stringify(initializePromise.body["accountid"]);

            fs.writeFile('OrgID.txt', organisationID, function (err) {
                if (err) throw err;
            });

            //ADD it to the json file - note we actually don't need the txt file for relationship
            var obj = {
                orgID: []
            };

            obj.orgID.push({id: organisationID});
            var json = JSON.stringify(obj);

            fs.writeFile('organisationid.json', organisationID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });

            fs.appendFileSync('OrgIDAll.txt', "\n" + organisationID, function (err) {
                if (err) throw err;
            });

            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + JSON.stringify(initializePromise.body));

            chai.expect(JSON.stringify(initializePromise)).contain(statusMsg); 
            console.log("--- THE END ---")
        }
        else if (statusCode !== 200 || statusCode !== 201) {
            console.log("");
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + errorText);

            chai.expect(errorText).to.contains(statusMsg);
            console.log("--- THE END ---")

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/
    async requestCreateRelationship(token, StatusMsgCreate, RoleType) {

        let today = new Date().toLocaleString();

        const fileNameCust = 'CustID.txt';
        const fileNameOrg = 'OrgID.txt';
        // let cust11="";
        // let org11="";
        var custIDObj = {
            table: []
         };
         var objorgID = {
            table: []
         };

         console.log("");
         console.log("-- Role TYPE:    " + RoleType);

         if(RoleType === "Empl_Employer" || RoleType === "Agent_AgentCust"){
            var custIDObj1 = await this.readFilesJSON('contactid.json')
            //console.log("CUSTOMER ID as a String:  " + custIDObj1); 
            custIDObj = JSON.parse(custIDObj1); //now it an object
            var customerID = '/contacts(' + custIDObj + ')';
            console.log("-- CustomerID    : " + customerID );
      
            var objorgID1 = await this.readFilesJSON('organisationid.json')
            //console.log("ORGANISATION ID as a String:  " + objorgID1);      
            objorgID = JSON.parse(objorgID1); //now it an object
            var organID = '/accounts(' + objorgID + ')';
            console.log("-- OrganisationID: " + organID );
         } else {
            var custIDObj1 = await this.readFilesJSON('contactid.json')
            //console.log("CUSTOMER ID as a String:  " + custIDObj1); 
            custIDObj = JSON.parse(custIDObj1); //now it an object
            var customerID = '/contacts(' + custIDObj + ')';
            console.log("-- CustomerID:     " + customerID );
         }
        
        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");

        switch(RoleType){
            case "Empl_Employer":
            console.log("--- Creating a " + RoleType + " Relationship type ---");
            bodyObject = {
                "record2roleid@odata.bind": "/connectionroles(35A23B91-EC62-41EA-B5E5-C59B689FF0B4)",
                "record1roleid@odata.bind": "/connectionroles(1EB54AB1-58B7-4D14-BF39-4F3E402616E8)", 
                "record1id_contact@odata.bind": customerID, 
                "record2id_account@odata.bind": organID, 
                "defra_iscustomer": "true" 
            };
            break; 
            case "Agent_AgentCust":
            console.log("--- Creating a " + RoleType + " Relationship type ---");
            bodyObject = {
                "record2roleid@odata.bind": "/connectionroles(CAAF4DF7-0229-E811-A831-000D3A2B29F8)",
                "record1roleid@odata.bind": "/connectionroles(776E1B5A-1268-E811-A83B-000D3AB4F7AF)", 
                "record1id_contact@odata.bind": customerID, 
                "record2id_account@odata.bind": organID, 
                "defra_iscustomer": "true" 
            };
            break; 
            case "Citizen":
            console.log("--- Creating a " + RoleType + " Relationship type ---");
            bodyObject = {
                "record2roleid@odata.bind": "/connectionroles(878ED5F8-0A90-E811-A845-000D3AB4FDDF)",
                "record1roleid@odata.bind": "/connectionroles(3FC7E717-0B90-E811-A845-000D3AB4FDDF)", 
                "record1id_contact@odata.bind": customerID, 
                "defra_iscustomer": "true" 
            };
            break;
        default:
            console.log("Invalide data TYPE !!");
            break;
        }

        const options = {
            method: 'POST', 
            url: configCRM.appUrlCRM + 'api/data/v9.0/connections?$select=_defra_connectiondetailsid_value',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            body: bodyObject,
            json: true

        };

        var initializePromise = await this.initialize(options);

        console.log("");

        //const responseStatus = initializePromise.statusCode;
        //console.log("Relationship Status code: " + JSON.stringify(responseStatus));
        console.log("RELATIONSHIP statusCode: ", initializePromise && initializePromise.statusCode);
        console.log("RELATIONSHIP TEXT      : " + initializePromise.statusMessage);
        console.log("");
       
        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);

            console.log("");
            console.log("Assertion TEXT: " + StatusMsgCreate);
            console.log("Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            let connectionID = JSON.stringify(initializePromise.body["connectionid"]);
            let connectionDetails = JSON.stringify(initializePromise.body["_defra_connectiondetailsid_value"]);
        
            console.log("--- connection ID      : " + connectionID);
            console.log("--- connection Details : " + connectionDetails);

            chai.expect(JSON.stringify(initializePromise.body)).to.contain(StatusMsgCreate);

            fs.writeFile('connectionDetails.json', connectionDetails, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {

            console.log('statusCode:' + initializePromise.statusCode);
            console.log("TEXT: " + initializePromise.statusMessage);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/
    async createAccessRequest(token, SearchRef, ServiceRef, StatusMsg) {
        var lobserviceid = this.testdata.getLOBserviceID(ServiceRef);

        let today = new Date().toLocaleString();

        const fileNameCust = 'CustID.txt';
        const fileNameOrg = 'OrgID.txt';
   
        var custIDObj = {
            table: []
         };
         var objorgID = {
            table: []
         };

         console.log("");
         console.log("--- Creating Access Request for LOB-Service ---");
         console.log("");
         console.log("*** LOB-Service TYPE: " + ServiceRef);
         console.log("*** LOB-Service ID  : " + lobserviceid);
         console.log("");

         var custIDObj1 = await this.readFilesJSON('contactid.json')
         custIDObj = JSON.parse(custIDObj1); //now it an object
         var customerID = custIDObj
         console.log("*** CustomerID      : " + customerID );
      
         var objorgID1 = await this.readFilesJSON('organisationid.json')     
         objorgID = JSON.parse(objorgID1); //now it an object
         var organID = objorgID;
         console.log("*** OrganisationID  : " + organID );
        
        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");
        switch(SearchRef){  
            case "All-refs":
            console.log("--- Creating ACCESS-REQUEST with ALL References available ---");
            bodyObject = {
                "ContactRef":{ "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": customerID },
                "OrganisationRef":{ "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": organID },
                "ServiceRef":{ "@odata.type": "Microsoft.Dynamics.CRM.defra_lobservice", "defra_lobserviceid": lobserviceid },
                "UserAccountProfilePageURL": "https://www.msn.com/?123444444" 
            };
            break; 
            case "No-Contact-ref":
            console.log("--- Creating ACCESS-REQUEST with No-Contact-References available ---");
            bodyObject = {
                "ContactRef":{ "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": "" },
                "OrganisationRef":{ "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": organID },
                "ServiceRef":{ "@odata.type": "Microsoft.Dynamics.CRM.defra_lobservice", "defra_lobserviceid": lobserviceid },
                "UserAccountProfilePageURL": "https://www.msn.com/?123444444" 
            };
            break; 
            case "No-Org-ref":
            console.log("--- Creating ACCESS-REQUEST with No-Organisation-References available ---");
            bodyObject = {
                "ContactRef":{ "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": customerID },
                "OrganisationRef":{ "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": "" },
                "ServiceRef":{ "@odata.type": "Microsoft.Dynamics.CRM.defra_lobservice", "defra_lobserviceid": lobserviceid },
                "UserAccountProfilePageURL": "https://www.msn.com/?123444444"
            };
            break; 
            case "No-ContAndOrg-ref":
            console.log("--- Creating ACCESS-REQUEST with No-Contact-and-Organisation-References available ---");
            bodyObject = {
                "ContactRef":{ "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": "" },
                "OrganisationRef":{ "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": "" },
                "ServiceRef":{ "@odata.type": "Microsoft.Dynamics.CRM.defra_lobservice", "defra_lobserviceid": lobserviceid },
                "UserAccountProfilePageURL": "https://www.msn.com/?123444444"
            };
            break;
            case "No-servicer-ref":
            console.log("---  Creating ACCESS-REQUEST with No-Service-References available ---");
            bodyObject = {
                "ContactRef":{ "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": customerID },
                "OrganisationRef":{ "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": organID },
                "ServiceRef":{ "@odata.type": "Microsoft.Dynamics.CRM.defra_lobservice", "defra_lobserviceid": "" },
                "UserAccountProfilePageURL": "https://www.msn.com/?123444444"
            };
            break;
        default:
            console.log("Invalide data TYPE !!");
            break;
        }

        const options = {
            method: 'POST', 
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createaccessrequest',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            body: bodyObject,
            json: true
        };

        var initializePromise = await this.initialize(options);
       
        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            // console.log("");
            console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            console.log("TEXT:       " + initializePromise.statusMessage);

            console.log("");
            console.log("Response BODY: " + JSON.stringify(initializePromise.body));
            console.log("");

            chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(StatusMsg);

            // fs.writeFile('connectionDetails.json', connectionDetails, 'utf8', function (err) {
            //     if (err) {
            //         reject(err);
            //     };
            // });

            // fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            //     if (err) throw err;
            // });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.statusCode);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).to.contain(StatusMsg);

            // fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            //     if (err) throw err;
            // });
        }
        else if (error) throw new Error(error);

    }

     //**************USE THIS**********************/
     async requestEnroleAsAnIDMAdmin(token) {
        // get data from createcontact.json using test-data.js
        // get me the B2CObjID for BasicContactTest testIdentifier from createcontact.json
        var b2cObjectID = this.testdata.getB2CObjectID("BasicContact");
        const isCitizen = this.testdata.getIsCitizen("BasicContact");
        const title = this.testdata.getTitle("BasicContact");
        var firstName = this.testdata.getFirstName("BasicContact");
        const middleName = this.testdata.getMiddleName("BasicContact");
        var lastName = this.testdata.getLastName("BasicContact");
        const source = this.testdata.getSource("BasicContact");
        const DOB = this.testdata.getDOB("BasicContact");
        const gender = this.testdata.getGender("BasicContact");
        const telephone = this.testdata.getTelephone("BasicContact");
        var email = this.testdata.getEmail("BasicContact");
        const buildingName = this.testdata.getBuildingName("BasicContact");
        const buildingNumber = this.testdata.getBuildingNumber("BasicContact");
        const street = this.testdata.getStreet("BasicContact");
        const locality = this.testdata.getLocality("BasicContact");
        const town = this.testdata.getTown("BasicContact");
        const country = this.testdata.getCountry("BasicContact");
        const postcode = this.testdata.getPostcode("BasicContact");
        const tacsacceptedversion = this.testdata.getTacsacceptedversion("BasicContact");
        var tacsacceptedon = this.testdata.getTacsacceptedone("BasicContact")

        //generate random 12 digit number - used to generate unique Postman token 
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // apended in B2CObjID to generate random unique B2CObjectId   
        const elevenDigitRandomNum = Math.floor(Math.pow(10, 11 - 1) + Math.random() * (Math.pow(10, 11) - Math.pow(10, 11 - 1) - 1));

        // console.log("");
        // let randonOne = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        // let randonTwo = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        // let postFix = "de6a" + randonOne + "ac" + randonTwo + "a8";

        console.log("");
        let midRandon = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonOne = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonTwo = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let postFix = "8d" + midRandon + "-de6a" + randonOne + "ac" + randonTwo + "a8";

        let b2cObject;
        //const emailRandom = Math.random().toString(36) + "@gmail.com";
        let emailAddress;

        switch (validationtype) {
            case "BasicContact":
                console.log("---  TESTING Creating a BASIC Contact ---");
                b2cObject = b2cObjectID + postFix;
                emailAddress = Math.random().toString(36) + "@gmail.com";
                //console.log("*** b2cObject:    " + b2cObject);
                //console.log("*** emailAddress: " + emailAddress);
                break;
            case "ContactMissingFirstName":
                console.log("---  TESTING Creating Contact with MISSING FirstName ---");
                firstName = this.testdata.getFirstName("ContactMissingFirstName");
                console.log("--- Contact FirstName: " + firstName);
                b2cObject = b2cObjectID + postFix;
                emailAddress = Math.random().toString(36) + "@gmail.com";
                break;
            case "ContactMissingLastName":
                console.log("---  TESTING Creating Contact with MISSING LastName ---");
                lastName = this.testdata.getLastName("ContactMissingLastName");
                console.log("--- Contact LastName: " + lastName);
                b2cObject = b2cObjectID + postFix;
                emailAddress = Math.random().toString(36) + "@gmail.com";
                break;
            case "DuplicateB2cObjectId":
                console.log("---  TESTING Duplicate B2CObjectID ---");
                b2cObject = this.testdata.getB2CObjectID("DuplicateB2cObjectId");
                emailAddress = Math.random().toString(36) + "@gmail.com";
                console.log("--- B2CObjectID: " + b2cObject);
                break;
            case "InvalidB2cObjectId":
                console.log("--- TESTING Invalide B2CObjectID ---");
                b2cObject = this.testdata.getB2CObjectID("InvalidB2cObjectId");
                emailAddress = Math.random().toString(36) + "@gmail.com";
                console.log("--- InvalidB2cObjectId: " + b2cObject);
                break;
            case "ContactWithDuplicateEmail":
                console.log("--- TESTING Duplicate B2CObjectID ---");
                emailAddress = this.testdata.getEmail("ContactWithDuplicateEmail");
                console.log("--- Duplicate Email: " + emailAddress);
                break;
            case "ContactMissingTnCDate":
                console.log("--- TESTING creating Contact with missing TandC Date ---");
                tacsacceptedon = this.testdata.getTacsacceptedone("ContactMissingTnCDate");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        console.log("*** b2cObject:    " + b2cObject);
        console.log("*** emailAddress: " + emailAddress);

        //options for api response :- need to change postman token so used random 12 digit in the end
        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/contacts?$select=contactid,defra_uniquereference',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                // Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            body: { 'defra_title': title, 'defra_b2cobjectid': b2cObject, 'gendercode': gender, 'firstname': firstName, 'middlename': middleName, 'lastname': lastName, 'defra_cmcreateascitizen': isCitizen, 'defra_cmcreationsource': source, 'defra_addrcorbuildingname': buildingName, 'defra_addrcorbuildingnumber': buildingNumber, 'defra_addrcorstreet': street, 'defra_addrcorlocality': locality, 'defra_addrcortown': town, 'defra_addrcorcountry@odata.bind': country, 'defra_addrcorpostcode': postcode, 'defra_tacsacceptedversion': tacsacceptedversion, 'defra_tacsacceptedon': tacsacceptedon, 'emailaddress1': emailAddress, 'birthdate': DOB, 'address1_telephone1': telephone },
            json: true
        };

        //Calling request to return a promise so that it will use the returning values andperform the rest of the assertions/actions
        var initializePromise = await this.initialize(options);
        statusCodeVal = initializePromise.statusCode;

        if (statusCodeVal === 200 || statusCodeVal === 201) {
            console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            console.log("TEXT:       " + initializePromise.statusMessage);

            //console.log("Contact-ID: " + JSON.stringify(response.body["contactid"]));
            console.log("");
            console.log("Response BODY: " + JSON.stringify(initializePromise.body));
            console.log("");

            contactID = JSON.stringify(initializePromise.body["contactid"]);
            fs.writeFile('CustID.txt', contactID, function (err) {
                if (err) throw err;
            });

            //ADD it to the json file - note we actually don't need the txt file for relationship

            var obj = {
                custID: []
             };
    
            obj.custID.push({id: contactID});
            var json = JSON.stringify(obj);
            
            fs.writeFile('contactid.json', contactID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });


            fs.appendFileSync('CustIDAll.txt', "\n" + contactID, function (err) {
                if (err) throw err;
            });

            console.log("--- Contact-ID: " + contactID);

            // chai.expect(JSON.stringify(response.body)).to.contain(statusMsg);
            chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(statusMsg);
        }
        else if (statusCodeVal !== 200 || statusCodeVal !== 201) {
            console.log("");
            console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            console.log("TEXT:       " + initializePromise.statusMessage);

            //chai.expect(JSON.stringify(response).to.contain(statusMsg));
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            console.log("");
            console.log("** ERROR MESSAGE: " + JSON.stringify(errorText));

            chai.expect(errorText).contains(statusMsg);
        }

    }

    //**************USE THIS**********************/
    async requestCreateEnrolement(token, ServAndServRole, StatusMsg) {
        let today = new Date().toLocaleString();

        const fileNameCust = 'CustID.txt';
        const fileNameOrg = 'OrgID.txt';
  
        var custIDObj = {
            table: []
        };
        var objorgID = {
            table: []
        };
        var connObjID = {
            table: []
        };

        console.log("");

        // getting the ContactID from the contactid.json file
        var custIDObj1 = await this.readFilesJSON('contactid.json');
        custIDObj = JSON.parse(custIDObj1);
        var customerID = '/contacts(' + custIDObj + ')';
        console.log("-- customerID: " + customerID );
   
        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json') ;       
        objorgID = JSON.parse(objorgID1);
        var organID = '/accounts(' + objorgID + ')';
        console.log("-- organID   : " + organID );

        // getting the connnectionDetails from the connnectionDetails.json file    
        var connObjID1 = await this.readFilesJSON('connectionDetails.json');
        connObjID = JSON.parse(connObjID1);
        var connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
        console.log("-- enroleID  : " + connectionDetails );

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");

        switch(ServAndServRole){
            case "ServiceOnly":
            console.log("---  TESTING ENROLEMENT using LOB-Service ONLY ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(A65E89E7-66B6-E811-A954-000D3A29B5DE)",	
                "defra_enrolmentstatus": 2,
            };
            break; 
            case "VMDAppLicence": 
            console.log("---  TESTING ENROLEMENT using VMD-Service 'Apply to Licence' AND ServiceRole 'Standard User' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(A65E89E7-66B6-E811-A954-000D3A29B5DE)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "VMDReportAdverse":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'Report an Adverse' AND ServiceRole 'Standard User' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(39c4599e-27de-e811-a842-000d3ab4f534)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(3c669b52-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "VMDSecureMang":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'Secure Messaging' AND ServiceRole 'Standard User' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(a99fcef9-66b6-e811-a954-000d3a29b5de)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(3015249a-c1cc-e811-a95b-000d3a29ba60)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "IDM-Identity":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'IDM-Identity' AND ServiceRole 'Admin' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(5A90DD44-DD9B-E811-A94F-000D3A3A8543)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(A3217E78-DD9B-E811-A94F-000D3A3A8543)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "EXP-SERVICE":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'EXP_SERVICE1' AND ServiceRole 'Exports' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(34b46f99-66b6-e811-a954-000d3a29b5de)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(f830c35e-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "ServiceRoleOnly":
            console.log("---  TESTING ENROLEMENT using VMD 'Apply to Licence'-ServiceRole ONLY ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
        default:
            console.log("Invalide data TYPE !!");
            break;
        }

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_lobserviceuserlinks?$select=defra_lobserviceuserlinkid',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            body: bodyObject,
            json: true

        };

        var initializePromise = await this.initialize(options);

        console.log("");

        //const responseStatus = initializePromise.statusCode;

        console.log("ENROLEMENT statusCode    : ", initializePromise && initializePromise.statusCode);
        console.log("ENROLEMENT response-TEXT : " + initializePromise.statusMessage);
        console.log("");
       
        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);

            console.log("");
            console.log("Response BODY: " + JSON.stringify(initializePromise.body));
            console.log("");

            let lobservicelinkid = JSON.stringify(initializePromise.body["defra_lobserviceuserlinkid"]);
            console.log("--- LOB Service link-ID : " + lobservicelinkid);

            chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(StatusMsg);

            // fs.writeFile('connectionDetails.json', connectionDetails, 'utf8', function (err) {
            //     if (err) {
            //         reject(err);
            //     };
            // });

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);
            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    async requestCreateMultipleEnrolement(token, ServAndServRole, StatusMsg) {
        let today = new Date().toLocaleString();

        const fileNameCust = 'CustID.txt';
        const fileNameOrg = 'OrgID.txt';
  
        var custIDObj = {
            table: []
        };
        var objorgID = {
            table: []
        };
        var connObjID = {
            table: []
        };

        console.log("");

        // getting the ContactID from the contactid.json file
        var custIDObj1 = await this.readFilesJSON('contactid.json');
        custIDObj = JSON.parse(custIDObj1);
        var customerID = '/contacts(' + custIDObj + ')';
        console.log("-- customerID: " + customerID );
   
        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json') ;       
        objorgID = JSON.parse(objorgID1);
        var organID = '/accounts(' + objorgID + ')';
        console.log("-- organID   : " + organID );

        // getting the connnectionDetails from the connnectionDetails.json file    
        var connObjID1 = await this.readFilesJSON('connectionDetails.json');
        connObjID = JSON.parse(connObjID1);
        var connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
        console.log("-- enroleID  : " + connectionDetails );

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");

        switch(ServAndServRole){
            case "ServiceOnly":
            console.log("---  TESTING ENROLEMENT using LOB-Service ONLY ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(A65E89E7-66B6-E811-A954-000D3A29B5DE)",	
                "defra_enrolmentstatus": 2,
            };
            break; 
            case "VMDAppLicence": 
            console.log("---  TESTING ENROLEMENT using VMD-Service 'Apply to Licence' AND ServiceRole 'Standard User' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(A65E89E7-66B6-E811-A954-000D3A29B5DE)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "VMDReportAdverse":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'Report an Adverse' AND ServiceRole 'Standard User' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(39c4599e-27de-e811-a842-000d3ab4f534)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(3c669b52-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "VMDSecureMang":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'Secure Messaging' AND ServiceRole 'Standard User' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(a99fcef9-66b6-e811-a954-000d3a29b5de)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(3015249a-c1cc-e811-a95b-000d3a29ba60)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "IDM-Identity":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'IDM-Identity' AND ServiceRole 'Admin' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(5A90DD44-DD9B-E811-A94F-000D3A3A8543)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(A3217E78-DD9B-E811-A94F-000D3A3A8543)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "EXP-SERVICE":
            console.log("---  TESTING ENROLEMENT using VMD-Service 'EXP_SERVICE1' AND ServiceRole 'Exports' ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(34b46f99-66b6-e811-a954-000d3a29b5de)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(f830c35e-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "ServiceRoleOnly":
            console.log("---  TESTING ENROLEMENT using VMD 'Apply to Licence'-ServiceRole ONLY ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
        default:
            console.log("Invalide data TYPE !!");
            break;
        }

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_lobserviceuserlinks?$select=defra_lobserviceuserlinkid',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            body: bodyObject,
            json: true

        };

        var initializePromise = await this.initialize(options);

        console.log("");
        console.log("ENROLEMENT statusCode    : ", initializePromise && initializePromise.statusCode);
        console.log("ENROLEMENT response-TEXT : " + initializePromise.statusMessage);
        console.log("");
       
        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);

            console.log("");
            console.log("Response BODY: " + JSON.stringify(initializePromise.body));
            console.log("");

            let lobservicelinkid = JSON.stringify(initializePromise.body["defra_lobserviceuserlinkid"]);
            console.log("--- LOB Service link-ID : " + lobservicelinkid);

            chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(StatusMsg);

            // fs.writeFile('connectionDetails.json', connectionDetails, 'utf8', function (err) {
            //     if (err) {
            //         reject(err);
            //     };
            // });

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);
            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/
    async requestCreateInvitation(token, Role) {
        let today = new Date().toLocaleString();

        const fileNameCust = 'CustID.txt';
        const fileNameOrg = 'OrgID.txt';
        // let cust11="";
        // let org11="";
        var custIDObj = {
            table: []
        };
        var objorgID = {
            table: []
        };

        var custIDObj1 = await this.readFilesJSON('contactid.json')
        var custID = JSON.parse(custIDObj1); //now it an object
       // var customerID = '/contacts(' + custIDObj + ')';
        console.log("-- Inviters Customer-ID:     " + custID );
      
        var orgIDObj1 = await this.readFilesJSON('organisationid.json')    
        var orgID = JSON.parse(orgIDObj1); //now it an object
       // var organID = '/accounts(' + objorgID + ')';
        console.log("-- Inviters Organisation-ID: " + orgID );

        console.log("");
        console.log("-- ROLE Intived to join: " + Role);
        
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");      

        const options = {
            method: 'POST', 
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createinvitation',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'return=representation',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },

            body: {
            'Type': 1,
            'RegardingOrganisationRef': { '@odata.type': 'Microsoft.Dynamics.CRM.account', 'accountid': orgID},   
            'InviterRef': { '@odata.type': 'Microsoft.Dynamics.CRM.contact', 'contactid': custID },        
            "ConnectionRole": Role, 
            'EmailAddress': 'fadeleadu@gmail.com',        
            'IdmLink': 'https://www.google.com',     
            'PrivacyLink': 'www.amazon.com'
             },
            json: true

        };
        // console.log("");
        var initializePromise = await this.initialize(options);

        //const responseStatus = initializePromise.statusCode;
        console.log("INVITATION statusCode: ", initializePromise && initializePromise.statusCode);
        console.log("INVITATION TEXT      : " + initializePromise.statusMessage);
        console.log("");
       
        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            console.log("");
            console.log("Response BODY: " + JSON.stringify(initializePromise.body));
            console.log("");

            let connectionID = JSON.stringify(initializePromise.body["connectionid"]);
            let connectionDetails = JSON.stringify(initializePromise.body["_defra_connectiondetailsid_value"]);

          //  chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(StatusMsgCreate);

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);
            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    async getToken() {
        return new Promise((resolve, reject) => {
            // Make the token request

            const authorityHostUrl = configCRM.authorityHostUrl;
            const tenant = configCRM.tenant; // AAD Tenant name.
            const authorityUrl = authorityHostUrl + '/' + tenant
            const clientId = clientID // Application Id of app registered under AAD.
            const clientSecret = configCRM.clientSecret; // Secret generated for app. Read this environment constiable.
            const resource = configCRM.resource;// URI that identifies the resource for which the token is valid.

            const AuthenticationContext = AdalNode.AuthenticationContext
            const context = new AuthenticationContext(authorityUrl)

            return context.acquireTokenWithClientCredentials(resource, clientId, clientSecret, function (err, tokenResponse) {
                if (err) {
                    // LoggingService.logError(err.message)
                    reject(err)
                } else {
                    const token = tokenResponse.accessToken
                    if (token) {
                        resolve(token)
                    } else {
                        const error = new Error(`Error obtaining Active Directory auth token: ${JSON.stringify(tokenResponse)}`)
                        //LoggingService.logError(error.message)
                        reject(error)
                        console.log(token)
                    }
                }
            })
        })
    }

    // old steps to be reviewed
    async sendRequestCreateRelationship(token, StatusMsg) {

        const fileNameCust = 'CustID.txt';
        const fileNameOrg = 'OrgID.txt';

        fs.readFile(fileNameCust, 'utf8', async function (err, dataCust) {
            if (err)
                return console.log(err);

            fs.readFile(fileNameOrg, 'utf8', async function (err, dataOrg) {
                if (err)
                    return console.log(err);

                let today = new Date().toLocaleString();
                const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
                //console.log(val);

                console.log("*** Contact-ID      " + dataCust);
                console.log("*** Organisation-ID " + dataOrg);

                const options = {
                    method: 'POST',
                    url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createrelationship',
                    headers:
                    {
                        'postman-token': configCRM.postmantoken + val,
                        'cache-control': 'no-cache',
                        Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                        'OData-MaxVersion': '4.0',
                        'OData-Version': '4.0',
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        Accept: 'application/json'
                    },
                    // contact name -SuccessrelationshipContact1 , org name - SuccessrelationshipOrg1
                    // body: { request: '{ \'fromrecordid\': \'70946f05-911d-e911-a968-000d3a28d1a0\',\'torecordid\': \'aca51717-911d-e911-a969-000d3a28d891\',\'fromrecordtype\': \'contact\',\'torecordtype\': \'organisation\', \'relations\': { \'torole\': \'Agent Customer\', \'fromrole\': \'Agent\'   } }' }, 
                    // json: true 
                    body: { request: '{\'fromrecordid\': \'' + contactID + '\',\'torecordid\': \'' + organisationID + '\',\'fromrecordtype\': \'contact\',\'torecordtype\': \'organisation\', \'relations\': { \'torole\': \'Agent Customer\', \'fromrole\': \'Agent\'   } }' },
                    json: true
                };

                var initializePromise = await this.initialize(options);

                console.log('REL statusCode: ', JSON.stringify(initializePromise) && initializePromise.statusCode);
                console.log("RELTEXT      : " + JSON.stringify(initializePromise));

                if (initializePromise.statusCode === 200) {
                    console.log('RELATIONSHIP statusCode: ', initializePromise && initializePromise.statusCode);
                    console.log("RELATIONSHIP TEXT      : " + initializePromise.statusMessage);
                    console.log(JSON.stringify(initializePromise.body.response));

                    //parsing the response sting into an object
                    let responseData = JSON.parse(initializePromise.body.response);
                    connectionID = responseData.data.connectionid;
                    console.log("--- connection ID      : " + connectionID);

                    chai.expect(JSON.stringify(initializePromise)).to.contain(StatusMsg);

                    fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                        if (err) throw err;
                    });

                };
            })

        })
    }

    async sendRequestCreateRelationshipDuplicate(token, StatusMsg) {

        let today = new Date().toLocaleString();


        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        //console.log(val);

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createrelationship',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            // contact name -SuccessrelationshipContact1 , org name - SuccessrelationshipOrg1
            body: { request: '{   \'fromrecordid\': \'df402f3c-92da-e811-a960-000d3a29b5de\',\'torecordid\': \'8a2cd17f-92da-e811-a960-000d3a29b5de\',\'fromrecordtype\': \'contact\',\'torecordtype\': \'organisation\', \'relations\': { \'torole\': \'Agent Customer\', \'fromrole\': \'Agent\'   } }' }, json: true
        };

        var initializePromise = await this.initialize(options);

        chai.expect(JSON.stringify(initializePromise)).to.contain(StatusMsg);

        fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            if (err) throw err;
        });
    }

    async sendRequestCreateemailContactSuccess(token, StatusMsg) {

        let today = new Date().toLocaleString();
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        //console.log(val);

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createemail',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            // contact name -SuccessrelationshipContact1 
            body: { ContactRef: { '@odata.type': 'Microsoft.Dynamics.CRM.contact', contactid: ' DF402F3C-92DA-E811-A960-000D3A29B5DE' }, Type: 10, Email: 'contactemailtestfrompostman@test.com' },
            json: true
        };

        //await chai.expect(JSON.stringify(response)).to.contain(statusMsg);
        var initializePromise = await this.initialize(options);

        chai.expect(JSON.stringify(initializePromise)).to.contain(StatusMsg);

        fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            if (err) throw err;
        });

    }

    async sendRequestCreateemailOrgSuccess(token, StatusMsg) {

        let today = new Date().toLocaleString();


        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        //console.log(val);

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createemail',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            // organisation name -Orgapprovalwflcustbase1 
            body:
            {
                OrganisationRef:
                {
                    '@odata.type': 'Microsoft.Dynamics.CRM.account',
                    accountid: '7B856820-CBDA-E811-A960-000D3A29B5DE'
                },
                Type: 10,
                Email: 'testlinkfrompostman@test.com'
            },
            json: true
        };

        //await chai.expect(JSON.stringify(response)).to.contain(statusMsg);
        var initializePromise = await this.initialize(options);

        chai.expect(JSON.stringify(initializePromise)).to.contain(StatusMsg);

        fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            if (err) throw err;
        });
    }

    async sendRequestCreateemailOrgFailure1(token, StatusMsg) {

        let today = new Date().toLocaleString();


        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        //console.log(val);

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createemail',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                Prefer: 'odata-include-annotations=OData.Community.Display.V1.FormattedValue',
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token,
                Accept: 'application/json'
            },
            // organisation name -Orgapprovalwflcustbase1 
            body:
            {
                OrganisationRef:
                {
                    '@odata.type': 'Microsoft.Dynamics.CRM.account',
                    accountid: '7B856820-CBDA-E811-A960-000D3A29B5DE'
                },
                Type: 10,
                Email: ''
            },
            json: true
        };

        var initializePromise = await this.initialize(options);

        chai.expect(JSON.stringify(initializePromise)).to.contain(StatusMsg);

        fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            if (err) throw err;
        });
    }

}

module.exports.ActiveDirectoryAuthService = ActiveDirectoryAuthService;
