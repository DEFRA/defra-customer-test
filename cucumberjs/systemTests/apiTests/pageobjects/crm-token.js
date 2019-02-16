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

        console.log("");
        let randonOne = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonTwo = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let postFix = "de6a" + randonOne + "ac" + randonTwo + "a8";

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
        // const orgCoraddbuildingname = this.testdata.getOrgCorBuildingName(null);
        // const orgCoraddbuildingno = this.testdata.getOrgCorBuildingNo(null);
        // const orgCorsubbuildingname = this.testdata.getOrgCorSubBuildingName(null);
        // const orgCoraddstreet = this.testdata.getOrgCorStreet(null);
        // const orgCoraddlocality = this.testdata.getOrgCorLocality(null);
        // const orgcorcounty = this.testdata.getOrgCorCounty(null);
        // const orgCortown = this.testdata.getOrgCorTown(null);
        // const orgCorcountry = this.testdata.getOrgCorCountry(null);   
        // const orgCorpostcode = this.testdata.getOrgCorPostcode(null);  
        // const orgv1isUK = this.testdata.getorgv1isUK(validationType);

        switch (validationtype) {

            case "BasicOrgDetails":
                console.log("--- Creating a Basic Organisation ---");
                orgName = orgName + " " + Math.random().toString(36).substr(2, 5);
                orgEmail = Math.random().toString(36) + "@gmail.com";
                orgCRN = Math.random().toString().slice(2,10);
                console.log("ORGANISATION CRN:- " + orgCRN);
                break;
            case "MissingOrgNameCheck":
                console.log("--- MISSING Org Name TEST ---");
                orgName = this.testdata.getOrgName("MissingOrgNameCheck");
                console.log("--- Org Name: " + orgName);
                break;
            case "MissingOrgType":
                console.log("--- MISSING Org Type TEST --");
                orgType = this.testdata.getOrgType("MissingOrgType");
                console.log("--- Org TYPE: " + orgType);
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
            case "MissingRegAddressCheck":
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
                break;
            case "BasicOrgOthersTest":
                console.log("--- OTHER Org i.e Sole Trader TEST ---");
                orgName = this.testdata.getOrgName("BasicOrgOthersTest");
                orgType = this.testdata.getOrgType("BasicOrgOthersTest");
                orgCRN = this.testdata.getOrgCRN("BasicOrgOthersTest");
                orgEmail = this.testdata.getOrgEmail("BasicOrgOthersTest");
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
            body: { 'name': orgName, 'defra_isuk': orgIsUK, 'defra_cminterimorganisationtypevalue': orgType, 'defra_cmcrn': orgCRN, 'emailaddress1': orgEmail, 'defra_addrregbuildingname': orgRegaddbuildingname, 'defra_addrregbuildingnumber': orgRegaddbuildingno, 'defra_addrregsubbuildingname': orgRegsubbuildingname, 'defra_addrregstreet': orgRegaddstreet, 'defra_addrreglocality': orgRegaddlocality, 'defra_addrregcounty': orgRegcounty, 'defra_addrregtown': orgRegtown, 'defra_addrregcountry@odata.bind': orgRegcountry, 'defra_addrregpostcode': orgRegpostcode },
            json: true
        };

        var initializePromise = await this.initialize(options);

        statusCodeVal = initializePromise.statusCode;

        //console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;

        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT:       " + initializePromise.statusMessage);

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

            // chai.expect(JSON.stringify(response)).to.contain(statusMsg);
            chai.expect(JSON.stringify(initializePromise)).to.not.contain(statusMsg);
            // chai.expect(JSON.stringify(response)).to.contain('"status\\":\\"success\\",\\"code\\":200,\\"message\\":\\"\\"}"');
        }
        else if (statusCode !== 200 || statusCode !== 201) {
            // console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            // console.log("TEXT:       " + initializePromise.statusMessage);
            console.log("");
            //chai.expect(JSON.stringify(response).to.contain(statusMsg));
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            chai.expect(errorText).contains(statusMsg);
            console.log("-- Error message: " + statusMsg);
            console.log("** ERROR MESSAGE: " + JSON.stringify(errorText));

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/
    async requestCreateRelationship(token, StatusMsg) {
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
         var custIDObj1 = await this.readFilesJSON('contactid.json')
         //console.log("CUSTOMER ID as a String:  " + custIDObj1); 
         custIDObj = JSON.parse(custIDObj1); //now it an object
         //console.log("CUSTOMER ID as an Object:  " + custIDObj); 
         var customerID = '/contacts(' + custIDObj + ')';
         console.log("-- Customer-ID:     " + customerID );
   
         var objorgID1 = await this.readFilesJSON('organisationid.json')
         //console.log("ORGANISATION ID as a String:  " + objorgID1);      
         objorgID = JSON.parse(objorgID1); //now it an object
         //console.log("ORGANISATION ID as an Object:  " + objorgID); 
         var organID = '/accounts(' + objorgID + ')';
         console.log("-- Organisation-ID: " + organID );

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;

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
            body: { 
                "record2roleid@odata.bind": "/connectionroles(35A23B91-EC62-41EA-B5E5-C59B689FF0B4)",
                "record1roleid@odata.bind": "/connectionroles(1EB54AB1-58B7-4D14-BF39-4F3E402616E8)", 
                "record1id_contact@odata.bind": customerID, 
                "record2id_account@odata.bind": organID, 
                "defra_iscustomer": "true" 
            },
            json: true

        };
        // console.log("");
        // console.log('OPTIONS: ' + JSON.stringify(options.body));

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
            console.log("Response BODY: " + JSON.stringify(initializePromise.body));
            console.log("");

            let connectionID = JSON.stringify(initializePromise.body["connectionid"]);
            let connectionDetails = JSON.stringify(initializePromise.body["_defra_connectiondetailsid_value"]);
        
            console.log("--- connection ID      : " + connectionID);
            console.log("--- connection Details : " + connectionDetails);

            chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(StatusMsg);

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
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);
            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    async requestCreateEnrolement(token, Service, StatusMsg) {
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

        switch(Service){
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
            case "ServiceAndServiceRole":
            console.log("---  TESTING ENROLEMENT using LOB-Service AND ServiceRole ---");
            bodyObject = {
                "defra_ServiceUser@odata.bind": customerID,		
                "defra_Organisation@odata.bind": organID, 
                "defra_connectiondetail@odata.bind": connectionDetails,
                "defra_service@odata.bind": "/defra_lobservices(A65E89E7-66B6-E811-A954-000D3A29B5DE)",	
                "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
                "defra_enrolmentstatus": 2,
            };
            break;
            case "ServiceRoleOnly":
            console.log("---  TESTING ENROLEMENT using LOB-ServiceRole ONLY ---");
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

            // body: { 
            //     "defra_ServiceUser@odata.bind": customerID,		
            //     "defra_Organisation@odata.bind": organID, 
            //     "defra_connectiondetail@odata.bind": connectionDetails,
            //     "defra_service@odata.bind": "/defra_lobservices(A65E89E7-66B6-E811-A954-000D3A29B5DE)",	
            //  //   "defra_ServiceRole@odata.bind":"/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
            //     "defra_enrolmentstatus": 2,
            // },

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
