const AdalNode = require('adal-node')
const webdriver = require('selenium-webdriver')
const By = webdriver.By;
const until = webdriver.until;
const request = require("request");
const chai = require("chai");
let resp;

//const LoggingService = require('../services/logging.service')

const authorityURL = 'https://login.microsoftonline.com/common/oauth2/token'
//CRM Organization URL
var resource = 'https://defra-custmstr-dev.crm4.dynamics.com'
//Dynamics 365 Client Id when registered in Azure
const clientID = 'f0ce8ded-50ec-4edc-8afe-c5b66157f963'

class ActiveDirectoryAuthService {

    constructor(browser, testdata) {
        this.browser = browser;
        this.testdata = testdata;
    }

    async getContent() {
        return this.browser.wait(until.elementLocated(By.css("body")), 5 * 20000);
    }

    async getTextElement(element) {
        return element.getText();
    }

    async sendRequest(token) {
        //generate random 12 digit number
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
console.log(val);
        const elevenDigitRandomNum = Math.floor(Math.pow(10, 11 - 1) + Math.random() * (Math.pow(10, 11) - Math.pow(10, 11 - 1) - 1));
        console.log(elevenDigitRandomNum);

        const emailRandom = Math.random().toString(36)+ "@gmail.com";
        console.log(emailRandom);
        //options for api response :- need to change postman token so used random 12 digit in the end
        const options = {
            method: 'POST',
            url: 'https://defra-custmstr-test.crm4.dynamics.com/api/data/v9.0/defra_createcontact',
            headers:
            {
                'postman-token': 'ec6fe982-31e1-4bc2-1f47-' + val,
                'cache-control': 'no-cache',
                authorization: 'Bearer ' + token,
                'content-type': 'application/json'
            },
            body: { request: '{\'b2cobjectid\': \'7b1ad2d0-7946-11e8-8d36-'+elevenDigitRandomNum+'\',\'title\': 1,\'firstname\': \'Test\',\'middlename\': \'mid\',\'lastname\': \'Brendan\',\'email\': \''+emailRandom+'\',\'dob\': \'02/12/1999\',\'gender\': 2,\'telephone\': \'004412345678\',\'tacsacceptedversion\': \'1.0\',\'tacsacceptedon\': \'23/10/2010 19:00\',\'address\': { \'type\': 3, \'uprn\':\'200010019924\', \'buildingname\': \'Horizon House\', \'buildingnumber\': \'123\', \'street\': \'Deanery Road\', \'locality\': \'\', \'town\': \'\', \'postcode\': \'TW67YT\', \'country\':\'GBR\', \'fromcompanieshouse\': \'true\'}}' },
            json: true
        };
        console.log(options);
return options;
    }

    async getToken() {
        return new Promise((resolve, reject) => {
            // Make the token request

            const authorityHostUrl = 'https://login.microsoftonline.com'
            const tenant = 'defradev.onmicrosoft.com' // AAD Tenant name.
            const authorityUrl = authorityHostUrl + '/' + tenant
            const clientId = clientID // Application Id of app registered under AAD.
            const clientSecret = 'lUvlF1kKTQhuB4mgo5td1AxaRCPHDLF5zoRk1eauZ5U=' // Secret generated for app. Read this environment constiable.
            const resource = 'https://defra-custmstr-dev.crm4.dynamics.com' // URI that identifies the resource for which the token is valid.

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
                    }
                }
            })
        })
    }
}

module.exports.ActiveDirectoryAuthService = ActiveDirectoryAuthService;
