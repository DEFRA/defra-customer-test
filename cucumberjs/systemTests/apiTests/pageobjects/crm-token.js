const AdalNode = require('adal-node')
const request = require("request");
const chai = require("chai");
const configCRM = require("../../../../configCRM").configCRM;
const fs = require('fs');

let resp;

//const LoggingService = require('../services/logging.service')

const authorityURL = configCRM.authorityURL;
//CRM Organization URL
const resource = configCRM.resource;
//Dynamics 365 Client Id when registered in Azure
const clientID = configCRM.clientID;

class ActiveDirectoryAuthService {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }


    async sendRequestCreateContact(token) {
        //get data from createcontact.json using test-data.js
        // get me the B2CObjID for BasicContactTest testIdentifier from createcontact.json
        const b2cObjectID = this.testdata.getB2CObjectID("BasicContactTest");
        const title = this.testdata.getTitle("BasicContactTest");
        const firstName = this.testdata.getFirstName("BasicContactTest");
        const middleName = this.testdata.getMiddleName("BasicContactTest");
        const lastName = this.testdata.getLastName("BasicContactTest");
        const DOB = this.testdata.getDOB("BasicContactTest");
        const gender = this.testdata.getGender("BasicContactTest");
        const telephone = this.testdata.getTelephone("BasicContactTest");
        const type = this.testdata.getType("BasicContactTest");
        const UPRN = this.testdata.getUPRN("BasicContactTest");
        const buildingName = this.testdata.getBuildingName("BasicContactTest");
        const buildingNumber = this.testdata.getBuildingNumber("BasicContactTest");
        const street = this.testdata.getStreet("BasicContactTest");
        const locality = this.testdata.getLocality("BasicContactTest");
        const town = this.testdata.getTown("BasicContactTest");
        const postcode = this.testdata.getPostcode("BasicContactTest");
        const country = this.testdata.getCountry("BasicContactTest");
        const fromCompaniesHouse = this.testdata.getFromCompaniesHouse("BasicContactTest");

        //generate random 12 digit number - used to generate unique Postman token 
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // apended in B2CObjID to generate random unique B2CObjectId   
        const elevenDigitRandomNum = Math.floor(Math.pow(10, 11 - 1) + Math.random() * (Math.pow(10, 11) - Math.pow(10, 11 - 1) - 1));
        const emailRandom = Math.random().toString(36) + "@gmail.com";

        //options for api response :- need to change postman token so used random 12 digit in the end
        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createcontact',
            headers:
            {
                'postman-token': configCRM.postmantoken + val,
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            },
            body: { request: '{\'b2cobjectid\': \'' + b2cObjectID + '' + elevenDigitRandomNum + '\',\'title\': 1,\'firstname\': \'' + firstName + '\',\'middlename\': \'' + middleName + '\',\'lastname\': \'' + lastName + '\',\'email\': \'' + emailRandom + '\',\'dob\': \'02/12/1999\',\'gender\': 2,\'telephone\': \'004412345678\',\'tacsacceptedversion\': \'1.0\',\'tacsacceptedon\': \'23/10/2010 19:00\',\'address\': { \'type\': 3, \'uprn\':\'200010019924\', \'buildingname\': \'Horizon House\', \'buildingnumber\': \'123\', \'street\': \'Deanery Road\', \'locality\': \'\', \'town\': \'\', \'postcode\': \'TW67YT\', \'country\':\'GBR\', \'fromcompanieshouse\': \'true\'}}' },
            json: true
        };

        return await request(options, function (error, response, body) {
            if (response.statusCode === 200) {
                console.log('statusCode:', response && response.statusCode);
                console.log("TEXT:-" + response.statusMessage);
                console.log(JSON.stringify(response));
                chai.expect(JSON.stringify(response)).to.contain('"status\\":\\"success\\",\\"code\\":200,\\"message\\":\\"\\"}"');
            }
            if (response.statusCode !== 200) {
                console.log('statusCode:', response && response.statusCode);
                console.log("TEXT:-" + response.statusMessage);
                console.log(JSON.stringify(response));
            }
            if (error) throw new Error(error);
        });;
    }

    async sendRequestCreateOrg(token, validationType, statusMsg) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        console.log(val);

        const eightDigitRandomNum = Math.floor(Math.pow(10, 8 - 1) + Math.random() * (Math.pow(10, 8) - Math.pow(10, 8 - 1) - 1));
        // console.log(elevenDigitRandomNum);

        const emailRandom = Math.random().toString(36) + "@gmail.com";
        console.log(emailRandom);
        //options for api response :- need to change postman token so used random 12 digit in the end
        const orgv1name = this.testdata.getorgv1name(validationType);
        const orgv1type = this.testdata.getorgv1type(validationType);
        const orgv1crn = this.testdata.getorgv1crn(validationType);
        const orgv1email = this.testdata.getorgv1email(validationType);
        const orgv1telephone = this.testdata.getorgv1telephone(validationType);
        const orgv1valwithcompanieshouse = this.testdata.getorgv1valwithcompanieshouse(validationType);
        const orgv1addtype = this.testdata.getorgv1addtype(validationType);
        const orgv1adduprn = this.testdata.getorgv1adduprn(validationType);
        const orgv1addbuildingname = this.testdata.getorgv1addbuildingname(validationType);
        const orgv1addbuildingno = this.testdata.getorgv1addbuildingno(validationType);
        const orgv1addstreet = this.testdata.getorgv1addstreet(validationType);
        const orgv1addlocality = this.testdata.getorgv1addlocality(validationType);
        const orgv1town = this.testdata.getorgv1town(validationType);
        const orgv1countyorgv1dependentlocality = this.testdata.getorgv1dependentlocality(validationType);
        const orgv1subbuildingname = this.testdata.getorgv1subbuildingname(validationType);
        const orgv1postcode = this.testdata.getorgv1postcode(validationType);
        const orgv1country = this.testdata.getorgv1country(validationType);
        const orgv1fromcompanieshouse = this.testdata.getorgv1fromcompanieshouse(validationType);


        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createorganisation',
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

            body: { request: '{\'name\': \'' + orgv1name + eightDigitRandomNum + '\',\'type\': ' + parseInt(orgv1type) + ',\'crn\': \'' + eightDigitRandomNum + '\',\'email\': \'' + emailRandom + '\',\'telephone\': \'' + orgv1telephone + '\',\'validatedwithcompanieshouse\': ' + Boolean(orgv1valwithcompanieshouse) + ',\'address\': { \'type\': ' + parseInt(orgv1addtype) + ', \'uprn\': \'' + orgv1adduprn + '\',\'buildingname\': \'' + orgv1addbuildingname + '\', buildingnumber: \'' + orgv1addbuildingno + '\', \'street\': \'' + orgv1addstreet + '\',\'locality\': \'' + orgv1addlocality + '\',\'town\': \'' + orgv1town + '\',\'county\':\'Avon\',\'dependentlocality\':\'Bristol Locality\',\'subbuildingname\':\'Bristol SubbuildName1\', postcode: \'' + orgv1postcode + '\',\'country\': \'' + orgv1country + '\',\'fromcompanieshouse\': ' + Boolean(orgv1fromcompanieshouse) + ' } }' },
            json: true
        };

        //console.log(options);
        //await chai.expect(JSON.stringify(response)).to.contain(statusMsg);
        request(options, function (error, response, body) {
            chai.expect(JSON.stringify(response)).to.contain(statusMsg);

            fs.writeFile('CRM Logs.txt', '\n' + today + JSON.stringify(response) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        });
    }

    async sendRequestCreateOrgDuplicationChk(token, validationTypeDup, statusMsgDup) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
        console.log(val);

        const eightDigitRandomNum = Math.floor(Math.pow(10, 8 - 1) + Math.random() * (Math.pow(10, 8) - Math.pow(10, 8 - 1) - 1));
        // console.log(elevenDigitRandomNum);

        const emailRandom = Math.random().toString(36) + "@gmail.com";
        console.log(emailRandom);
        //options for api response :- need to change postman token so used random 12 digit in the end
        const orgv1name = this.testdata.getorgv1name(validationTypeDup);
        const orgv1type = this.testdata.getorgv1type(validationTypeDup);
        const orgv1crn = this.testdata.getorgv1crn(validationTypeDup);
        const orgv1email = this.testdata.getorgv1email(validationTypeDup);
        const orgv1telephone = this.testdata.getorgv1telephone(validationTypeDup);
        const orgv1valwithcompanieshouse = this.testdata.getorgv1valwithcompanieshouse(validationTypeDup);
        const orgv1addtype = this.testdata.getorgv1addtype(validationTypeDup);
        const orgv1adduprn = this.testdata.getorgv1adduprn(validationTypeDup);
        const orgv1addbuildingname = this.testdata.getorgv1addbuildingname(validationTypeDup);
        const orgv1addbuildingno = this.testdata.getorgv1addbuildingno(validationTypeDup);
        const orgv1addstreet = this.testdata.getorgv1addstreet(validationTypeDup);
        const orgv1addlocality = this.testdata.getorgv1addlocality(validationTypeDup);
        const orgv1town = this.testdata.getorgv1town(validationTypeDup);
        const orgv1countyorgv1dependentlocality = this.testdata.getorgv1dependentlocality(validationTypeDup);
        const orgv1subbuildingname = this.testdata.getorgv1subbuildingname(validationTypeDup);
        const orgv1postcode = this.testdata.getorgv1postcode(validationTypeDup);
        const orgv1country = this.testdata.getorgv1country(validationTypeDup);
        const orgv1fromcompanieshouse = this.testdata.getorgv1fromcompanieshouse(validationTypeDup);


        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createorganisation',
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

            body: { request: '{\'name\': \'' + orgv1name + eightDigitRandomNum + '\',\'type\': ' + parseInt(orgv1type) + ',\'crn\': \'' + orgv1crn + '\',\'email\': \'' + emailRandom + '\',\'telephone\': \'' + orgv1telephone + '\',\'validatedwithcompanieshouse\': ' + Boolean(orgv1valwithcompanieshouse) + ',\'address\': { \'type\': ' + parseInt(orgv1addtype) + ', \'uprn\': \'' + orgv1adduprn + '\',\'buildingname\': \'' + orgv1addbuildingname + '\', buildingnumber: \'' + orgv1addbuildingno + '\', \'street\': \'' + orgv1addstreet + '\',\'locality\': \'' + orgv1addlocality + '\',\'town\': \'' + orgv1town + '\',\'county\':\'Avon\',\'dependentlocality\':\'Bristol Locality\',\'subbuildingname\':\'Bristol SubbuildName1\', postcode: \'' + orgv1postcode + '\',\'country\': \'' + orgv1country + '\',\'fromcompanieshouse\': ' + Boolean(orgv1fromcompanieshouse) + ' } }' },
            json: true
        };

        //console.log(options);
        //await chai.expect(JSON.stringify(response)).to.contain(statusMsg);
        request(options, function (error, response, body) {
            chai.expect(JSON.stringify(response)).to.contain(statusMsgDup);

            fs.writeFile('CRM Logs.txt', '\n' + today + JSON.stringify(response) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        });
    }

    async sendRequestCreateRelationshipSuccess(token, ValidationType, StatusMsg) {

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
            body: { request: '{   \'fromrecordid\': \'df402f3c-92da-e811-a960-000d3a29b5de\',\'torecordid\': \'8a2cd17f-92da-e811-a960-000d3a29b5de\',\'fromrecordtype\': \'contact\',\'torecordtype\': \'organisation\', \'relations\': { \'torole\': \'Agent Customer\', \'fromrole\': \'Agent\'   } }' },            json: true
        };

        //console.log(options);
        //await chai.expect(JSON.stringify(response)).to.contain(statusMsg);
        request(options, function (error, response, body) {
            chai.expect(JSON.stringify(response)).to.contain(StatusMsg);

            fs.writeFile('CRM Logs.txt', '\n' + today + JSON.stringify(response) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        });
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
}

module.exports.ActiveDirectoryAuthService = ActiveDirectoryAuthService;
