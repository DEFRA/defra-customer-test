const AdalNode = require('adal-node')
const request = require("request");
const chai = require("chai");
const configCRM = require("../../../../configCRM").configCRM;
const fs = require('fs');
const { url } = require('inspector');
const { type } = require('os');
const { UserPromptHandler } = require('selenium-webdriver/lib/capabilities');

let resp;
let today = new Date().toLocaleString();

//const LoggingService = require('../services/logging.service')
const authorityURL = configCRM.authorityURL;
//CRM Organization URL
const resource = configCRM.resource;
//Dynamics 365 Client Id when registered in Azure
const clientID = configCRM.clientID;

var contactID = "";
var organisationID = "";
var orgIsUK;
var orgName;
var orgType;
var orgEmail;
var statusCodeVal = "";
var isUKAddress = true;
var connectionIDx;


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
            fs.readFile(fileName, 'utf8', function readFileCallback(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
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

    async certificateApi(ValidationType, StatusMsgCont) {
        var ValidB2CObjID = this.testdata.getInitialMatch("B2CObjID");
        var MissingB2CObjID = this.testdata.getInitialMatchMissingB2CID("B2CObjID");
        var NoB2CObjID = this.testdata.getInitialMatchNoB2CID("B2CObjID");
        var SecureDetailsSet = this.testdata.getSecureDetailsSet("B2CObjID");
        var SecureDetailsNotSet = this.testdata.getSecureDetailsNotSet("B2CObjID");



        var url1 = "";
        console.log("The VALID B2C ID IS " + ValidB2CObjID)
        console.log("MISSING B2C ID " + MissingB2CObjID)
        console.log("NO B2C ID " + NoB2CObjID)

        switch (ValidationType) {
            case "ValidB2CObjID":
                url1 = 'https://cus-tst.azure.defra.cloud/api/v1.0/InitialMatch?B2CObjectId=' + ValidB2CObjID
                break;
            case "MissingB2CObjID":
                url1 = 'https://cus-tst.azure.defra.cloud/api/v1.0/InitialMatch?B2CObjectId=' + MissingB2CObjID
                break;
            case "NoB2CObjID":
                url1 = 'https://cus-tst.azure.defra.cloud/api/v1.0/InitialMatch?B2CObjectId=' + NoB2CObjID
                break;
            case "SecureDetailsSet":
                url1 = 'https://cus-tst.azure.defra.cloud/api/v1.0/InitialMatch?B2CObjectId=' + SecureDetailsSet
                break;
            case "SecureDetailsNotSet":
                url1 = 'https://cus-tst.azure.defra.cloud/api/v1.0/InitialMatch?B2CObjectId=' + SecureDetailsNotSet
                break;

            default: break;
        }


        const options = {
            method: 'GET',
            url: url1,
            pfx: fs.readFileSync('QuantClientCert001a.pfx'),
            passphrase: 'defra123',
            headers: {
                Cookie: 'ARRAffinity=75ddd5225fe95ac7c182c95ddb06572176e41e2582bc2a571de4d3544b0ad899'
            }
        };
        var initializePromise = await this.initialize(options);
        statusCodeVal = initializePromise.statusCode;
        console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;
        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT      : " + initializePromise.statusMessage);
        console.log("BODY" + initializePromise.body);

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("");
            console.log("--- Assertion TEXT: " + StatusMsgCont);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgCont);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgCont);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/

    //----------------------------------API with Initial Match CERTIFICATE ENDS---------------------------------

    //**************USE THIS for AUTHZ certificate**********************/

    async authzcertificateApi(B2CObjectID, ServiceID, StatusMsgCont) {

        console.log("TELL ME WHAT IS IT " + B2CObjectID)
        console.log("TELL ME WHAT IS IT " + ServiceID)

        const options = {
            method: 'GET',
            url: 'https://sndcuswebawa003.azurewebsites.net/api/v1.0/Authz?ServiceID=' + ServiceID + '&B2CObjectId=' + B2CObjectID,
            pfx: fs.readFileSync('QuantClientCert001a.pfx'),
            passphrase: 'defra123',
            headers: {
                Cookie: 'ARRAffinity=75ddd5225fe95ac7c182c95ddb06572176e41e2582bc2a571de4d3544b0ad899'
            }
        };
 
        var initializePromise = await this.initialize(options);
        statusCodeVal = initializePromise.statusCode;
        console.log("Response Status message: " + initializePromise.statusMessage);
        var statusCode = initializePromise.statusCode;
        console.log("");
        console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
        console.log("TEXT      : " + initializePromise.statusMessage);
        console.log("BODY" + initializePromise.body);

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("");
            console.log("--- Assertion TEXT: " + StatusMsgCont);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgCont);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.message);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.message)).contain(StatusMsgCont);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

  

    //----------------------------------API with AUTHZ CERTIFICATE ENDS---------------------------------


    async requestCreateContact(token, contacttype, validationtype, statusMsg) {
        // get data from createcontact.json using test-data.js
        // get me the B2CObjID for BasicContactTest testIdentifier from createcontact.json
        var b2cObjectID = this.testdata.getB2CObjectID("BasicContact");
        var ggcredentialID = this.testdata.getGGcredentialID("BasicContact");
        var SecureWord = this.testdata.getSecureWord("BasicContact");
        var Hint = this.testdata.getHint("BasicContact");
        var isCitizen = this.testdata.getIsCitizen("BasicContact");
        var title = this.testdata.getTitle("BasicContact");
        var firstName = this.testdata.getFirstName("BasicContact");
        var middleName = this.testdata.getMiddleName("BasicContact");
        var lastN = this.testdata.getLastName("BasicContact") + (Math.random().toString().slice(2, 5));
        var lastName = lastN;
        var source = this.testdata.getSource("BasicContact");
        var DOB = this.testdata.getDOB("BasicContact");
        var gender = this.testdata.getGender("BasicContact");
        var telephone = this.testdata.getTelephone("BasicContact");
        var email = this.testdata.getEmail("BasicContact");
        // Contact Basic Address
        var buildingName = this.testdata.getBuildingName("BasicContact");
        var buildingNumber = this.testdata.getBuildingNumber("BasicContact");
        var street = this.testdata.getStreet("BasicContact");
        var locality = this.testdata.getLocality("BasicContact");
        var town = this.testdata.getTown("BasicContact");
        var country = this.testdata.getCountry("BasicContact");
        var postcode = this.testdata.getPostcode("BasicContact");
        // Contact Correspondence Address
        var contcorrbuildingName = this.testdata.getBuildingName("ContCorrAddress");
        var contcorrbuildingNumber = this.testdata.getBuildingNumber("ContCorrAddress");
        var contcorrstreet = this.testdata.getStreet("ContCorrAddress");
        var contcorrlocality = this.testdata.getLocality("ContCorrAddress");
        var contcorrtown = this.testdata.getTown("ContCorrAddress");
        var contcorrcountry = this.testdata.getCountry("ContCorrAddress");
        var contcorrpostcode = this.testdata.getPostcode("ContCorrAddress");
        // Contact Business Address
        var contbusinessbuildingName = this.testdata.getBuildingName("ContBusiAddress");
        var contbusinessbuildingNumber = this.testdata.getBuildingNumber("ContBusiAddress");
        var contbusinessstreet = this.testdata.getStreet("ContBusiAddress");
        var contbusinesslocality = this.testdata.getLocality("ContBusiAddress");
        var contbusinesstown = this.testdata.getTown("ContBusiAddress");
        var contbusinesscountry = this.testdata.getCountry("ContBusiAddress");
        var contbusinesspostcode = this.testdata.getPostcode("ContBusiAddress");
        // Contact Billing Address
        var contbillbuildingName = this.testdata.getBuildingName("ContBillAddress");
        var contbillbuildingNumber = this.testdata.getBuildingNumber("ContBillAddress");
        var contbillstreet = this.testdata.getStreet("ContBillAddress");
        var contbilllocality = this.testdata.getLocality("ContBillAddress");
        var contbilltown = this.testdata.getTown("ContBillAddress");
        var contbillcountry = this.testdata.getCountry("ContBillAddress");
        var contbillpostcode = this.testdata.getPostcode("ContBillAddress");
        // NoneUK Contact Correspondence Address
        var nonukcontcorrbuildingName = this.testdata.getBuildingName("NonUKContCorrAddress");
        var nonukcontcorrbuildingNumber = this.testdata.getBuildingNumber("NonUKContCorrAddress");
        var nonukcontcorrstreet = this.testdata.getStreet("NonUKContCorrAddress");
        var nonukcontcorrlocality = this.testdata.getLocality("NonUKContCorrAddress");
        var nonukcontcorrtown = this.testdata.getTown("NonUKContCorrAddress");
        var nonukcontcorrcountry = this.testdata.getCountry("NonUKContCorrAddress");
        var nonukcontintercorpostcode = this.testdata.getInternationalPostcode("NonUKContCorrAddress");
        // NoneUK Contact Business Address
        var nonukcontbusinessbuildingName = this.testdata.getBuildingName("NonUKContBusiAddress");
        var nonukcontbusinessbuildingNumber = this.testdata.getBuildingNumber("NonUKContBusiAddress");
        var nonukcontbusinessstreet = this.testdata.getStreet("NonUKContBusiAddress");
        var nonukcontbusinesslocality = this.testdata.getLocality("NonUKContBusiAddress");
        var nonukcontbusinesstown = this.testdata.getTown("NonUKContBusiAddress");
        var nonukcontbusinesscountry = this.testdata.getCountry("NonUKContBusiAddress");
        var nonukcontinterBusinesspostcode = this.testdata.getInternationalPostcode("NonUKContBusiAddress");
        // NoneUK Contact Billing Address
        var nonukcontbillbuildingName = this.testdata.getBuildingName("NonUKContBillAddress");
        var nonukcontbillbuildingNumber = this.testdata.getBuildingNumber("NonUKContBillAddress");
        var nonukcontbillstreet = this.testdata.getStreet("NonUKContBillAddress");
        var nonukcontbilllocality = this.testdata.getLocality("NonUKContBillAddress");
        var nonukcontbilltown = this.testdata.getTown("NonUKContBillAddress");
        var nonukcontbillcountry = this.testdata.getCountry("NonUKContBillAddress");
        var nonukcontinterbillpostcode = this.testdata.getInternationalPostcode("NonUKContBillAddress");
        // Ploicy and Terms & Conditions
        var tacsacceptedversion = this.testdata.getTacsacceptedversion("BasicContact");
        var tacsacceptedon = this.testdata.getTacsacceptedone("BasicContact")
        var privacyPolicyVersio = this.testdata.getPrivacypolicyacceptedversion("BasicContact");
        var privacyPolicyDate = this.testdata.getPrivacypolicyacceptedon("BasicContact")
        var cookiesVersion = this.testdata.getCookiespolicyacceptedversion("BasicContact");
        var cookiesDate = this.testdata.getCookiespolicyacceptedon("BasicContact")

        //generate random 12 digit number - used to generate unique Postman token 
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // apended in B2CObjID to generate random unique B2CObjectId   
        // const elevenDigitRandomNum = Math.floor(Math.pow(10, 11 - 1) + Math.random() * (Math.pow(10, 11) - Math.pow(10, 11 - 1) - 1));

        console.log("");
        let midRandon = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonOne = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let randonTwo = Math.floor(Math.pow(10, 2 - 1) + Math.random() * (Math.pow(10, 2) - Math.pow(10, 2 - 1) - 1));
        let postFix = "8d" + midRandon + "-de6a" + randonOne + "ac" + randonTwo + "a8";

        let mixRandom = Math.floor(Math.random() * (Math.pow(10, 4))) + 1000;
        let mixMix = mixRandom.toString().substring(0, 4);
        console.log("mixMax value: " + mixMix);

        if (contacttype == "Citizen" || contacttype == "N_plus_one") {
            isCitizen = this.testdata.getIsCitizen("CitizenContact");
            console.log("--- isCitizen:        " + isCitizen);
        } else {
            isCitizen = this.testdata.getIsCitizen("NonCitizenContact");
            console.log("--- isCitizen:        " + isCitizen);
        }

        var coruprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);
        var busiuprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);
        var billuprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);
        // console.log("**** Correspondence address uprn = " + coruprn);
        // console.log("**** Business address uprn       = " + busiuprn);
        // console.log("**** Billing address uprn       = " + billuprn);

        var b2cObject = b2cObjectID + mixMix + "-11e8-" + postFix;
        console.log("--- b2cObject:        " + b2cObject);

        var contEmail = this.testdata.getEmail("BasicContact");
        email = "sysTest" + (Math.random().toString().slice(2, 7)) + contEmail;
        console.log("--- email-Address:    " + email);

        var ggCredentials = ggcredentialID + Math.random().toString().slice(2, 5);
        console.log("--- GG-Credential-ID: " + ggCredentials);
        console.log("");

        switch (validationtype) {
            case "BasicContact":
                console.log("---  TESTING Creating a BASIC - " + contacttype + " - Contact ---");
                console.log("");
                // b2cObject = b2cObjectID + postFix;
                // firstName = firstName + Math.random().toString().slice(2,5);
                lastName = lastName + Math.random().toString().slice(2, 5);
                console.log("--- firstName: " + firstName);
                console.log("--- lastName: " + lastName);
                // console.log("--- b2cObject: " + b2cObject);
                break;
            case "AllUK_Addresses":
                console.log("---  TESTING Creating a BASIC - " + contacttype + " - Contact with 2 Addresses ---");
                console.log("");
                // b2cObject = b2cObjectID + postFix;
                // firstName = firstName + Math.random().toString().slice(2,5);
                lastName = lastName + Math.random().toString().slice(2, 5);
                console.log("--- firstName: " + firstName);
                console.log("--- lastName: " + lastName);
                // console.log("--- b2cObject: " + b2cObject);
                break;
            case "NonUKCorAdd_OthersUKAddresses":
                console.log("---  TESTING Creating a BASIC - " + contacttype + " - Contact with 2 Addresses ---");
                console.log("");
                // b2cObject = b2cObjectID + postFix;
                // firstName = firstName + Math.random().toString().slice(2, 5);
                lastName = lastName + Math.random().toString().slice(2, 5);
                console.log("--- firstName: " + firstName);
                console.log("--- lastName: " + lastName);
                // console.log("--- b2cObject: " + b2cObject);
                break;
            case "AllNoneUK_Addresses":
                console.log("---  TESTING Creating a BASIC - " + contacttype + " - Contact with 2 Addresses ---");
                console.log("");
                // b2cObject = b2cObjectID + postFix;
                // firstName = firstName + Math.random().toString().slice(2, 5);
                lastName = lastName + Math.random().toString().slice(2, 5);
                console.log("--- firstName: " + firstName);
                console.log("--- lastName: " + lastName);
                // console.log("--- b2cObject: " + b2cObject);
                break;
            case "BasicContactCitizen":
                console.log("---  TESTING Creating a BASIC Contact - CITIZEN ---");
                console.log("");
                // b2cObject = b2cObjectID + postFix;
                firstName = this.testdata.getFirstName("BasicContactCitizen") + Math.random().toString().slice(2, 5);
                middleName = this.testdata.getMiddleName("BasicContactCitizen") + Math.random().toString().slice(2, 5);
                lastName = this.testdata.getLastName("BasicContactCitizen");
                console.log("--- isCitizen: " + isCitizen);
                console.log("--- firstName: " + firstName);
                console.log("--- lastName: " + lastName);
                break;
            case "MissingFirstName":
                console.log("---  TESTING Creating a " + contacttype + " Contact with MISSING FirstName ---");
                // b2cObject = b2cObjectID + postFix;
                firstName = this.testdata.getFirstName("Missing_FirstName");
                console.log("--- Contact FirstName: " + firstName);
                break;
            case "MissingLastName":
                console.log("---  TESTING Creating a " + contacttype + " Contact with MISSING LastName ---");
                // b2cObject = b2cObjectID + postFix;
                lastName = this.testdata.getLastName("Missing_LastName");
                console.log("--- Contact LastName: " + lastName);
                break;
            case "ValidWordandHint":
                console.log("--- TESTING Creating a " + contacttype + " Contact with Valid Secure Word and Hint ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("ValidWordandHint");
                Hint = this.testdata.getHint("ValidWordandHint");

                console.log("--- Contact Secure Word ValidWord: " + SecureWord);
                console.log("--- Contact HINT ValidHint: " + Hint);
                break;
            case "ValidWord6CharHint100Char":
                console.log("--- TESTING Creating a " + contacttype + " Contact with Valid Word 6 Char and Hint 100Char ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("ValidWord6CharHint100Char");
                Hint = this.testdata.getHint("ValidWord6CharHint100Char");

                console.log("--- Contact Secure Word ValidWord6Char: " + SecureWord);
                console.log("--- Contact HINT ValidHint100Char: " + Hint);
                break;
            case "BlankWordandHint":
                console.log("--- TESTING Creating a " + contacttype + " Contact with BlankWordandHint ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("BlankWordandHint");
                Hint = this.testdata.getHint("BlankWordandHint");

                console.log("--- Contact Secure Word Blank: " + SecureWord);
                console.log("--- Contact HINT Blank: " + Hint);
                break;
            case "HintOnly":
                console.log("--- TESTING Creating a " + contacttype + " Contact with Hint Only ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("HintOnly");
                Hint = this.testdata.getHint("HintOnly");

                console.log("--- Contact Secure Word Attribute is missing: " + SecureWord);
                console.log("--- Contact HINT Blank: " + Hint);
                break;
            case "WordOnly":
                console.log("--- TESTING Creating a " + contacttype + " Contact with Word Only ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("WordOnly");
                Hint = this.testdata.getHint("WordOnly");

                console.log("--- Contact Secure Word : " + SecureWord);
                console.log("--- Contact HINT attribute is missing: " + Hint);
                break;
            case "HintBlank":
                console.log("---  TESTING Creating a " + contacttype + " Contact with BLANK Hint ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("HintBlank");
                Hint = this.testdata.getHint("HintBlank");

                console.log("--- Contact Secure Word : " + SecureWord);
                console.log("--- Contact HINT is BLANK: " + Hint);
                break;
            case "WordBlank":
                console.log("---  TESTING Creating a " + contacttype + " Contact with BLANK Word ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("WordBlank");
                Hint = this.testdata.getHint("WordBlank");

                console.log("--- Contact Secure Word is BLANK : " + SecureWord);
                console.log("--- Contact HINT is : " + Hint);
                break;
            case "WordLessthan6Char":
                console.log("--- TESTING Creating a " + contacttype + " Contact with WordLessthan6Char Word ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("WordLessthan6Char");
                Hint = this.testdata.getHint("WordLessthan6Char");

                console.log("--- Contact Secure Word is WordLessthan6Char : " + SecureWord);
                console.log("--- Contact HINT is : " + Hint);
                break;
            case "WordMorethan12Char":
                console.log("---  TESTING Creating a " + contacttype + " Contact with WordMorethan12Char Word ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("WordMorethan12Char");
                Hint = this.testdata.getHint("WordMorethan12Char");

                console.log("--- Contact Secure Word is WordMorethan12Char : " + SecureWord);
                console.log("--- Contact HINT is : " + Hint);
                break;
            case "WordSpecialChar":
                console.log("--- TESTING Creating a " + contacttype + " Contact with WordSpecialChar Word ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("WordSpecialChar");
                Hint = this.testdata.getHint("WordSpecialChar");

                console.log("--- Contact Secure Word is WordSpecialChar : " + SecureWord);
                console.log("--- Contact HINT is : " + Hint);
                break;
            case "WordInvalidRangeandSpecialChar":
                console.log("--- TESTING Creating a " + contacttype + " Contact with WordInvalidRangeandSpecialChar Word ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("WordInvalidRangeandSpecialChar");
                Hint = this.testdata.getHint("WordInvalidRangeandSpecialChar");

                console.log("--- Contact Secure Word is WordInvalidRangeandSpecialChar  : " + SecureWord);
                console.log("--- Contact HINT is : " + Hint);
                break;
            case "HintLessthan100CharandSplChar":
                console.log("---  TESTING Creating a " + contacttype + " Contact with HintLessthan100CharandSplChar HINT ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("HintLessthan100CharandSplChar");
                Hint = this.testdata.getHint("HintLessthan100CharandSplChar");

                console.log("--- Contact Secure Word is   : " + SecureWord);
                console.log("--- Contact HINT is HintLessthan100CharandSplChar : " + Hint);
                break;
            case "HintMorethan100Char":
                console.log("---  TESTING Creating a " + contacttype + " Contact with HintMorethan100Char HINT ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("HintMorethan100Char");
                Hint = this.testdata.getHint("HintMorethan100Char");

                console.log("--- Contact Secure Word is   : " + SecureWord);
                console.log("--- Contact HINT is HintMorethan100Char : " + Hint);
                break;
            case "HintSplCharandMorethan100Char":
                console.log("---  TESTING Creating a " + contacttype + " Contact with HintSplCharandMorethan100Char HINT ---");
                // b2cObject = b2cObjectID + postFix;
                SecureWord = this.testdata.getSecureWord("HintSplCharandMorethan100Char");
                Hint = this.testdata.getHint("HintSplCharandMorethan100Char");

                console.log("--- Contact Secure Word is   : " + SecureWord);
                console.log("--- Contact HINT is HintSplCharandMorethan100Char : " + Hint);
                break;
            case "DuplicateB2cObjectId":
                console.log("---  TESTING creating a " + contacttype + "  Contact with Duplicate B2CObjectID ---");
                b2cObject = this.testdata.getB2CObjectID("DuplicateB2cObjectId");
                console.log("--- B2CObjectID: " + b2cObject);
                break;
            case "InvalidB2cObjectId":
                console.log("--- TESTING creating a " + contacttype + " Contact with an Invalide B2CObjectID ---");
                b2cObject = this.testdata.getB2CObjectID("InvalidB2cObjectId");
                console.log("--- Invalid B2cObjectId: " + b2cObject);
                break;
            case "DuplicateEmailAddr":
                console.log("--- TESTING creating a " + contacttype + "  Duplicate Email-Address ---");
                email = this.testdata.getEmail("Duplicate_EmailAddr");
                console.log("--- Duplicate Email: " + email);
                break;
            case "InvalidEmailAddr1":
                console.log("--- TESTING creating a " + contacttype + " with an Invalid Email-Address (missing @) ---");
                var contEmail = this.testdata.getEmail("Invalid_EmailAddr1");
                email = (Math.random().toString().slice(2, 5)) + "contact" + (Math.random().toString().slice(2, 5)) + contEmail;
                console.log("--- Invalid Email with missing '@' character in email address : " + email);
                break;
            case "InvalidEmailAddr2":
                console.log("--- TESTING creating a " + contacttype + " with an Invalid Email-Address (missing .) ---");
                var contEmail = this.testdata.getEmail("Invalid_EmailAddr2");
                email = (Math.random().toString().slice(2, 5)) + "contact" + (Math.random().toString().slice(2, 5)) + contEmail;
                console.log("--- Invalid Email with missing '.' character in email address : " + email);
                break;
            case "MissingCorAddress":
                console.log("--- TESTING creating a new " + contacttype + " Contact with MISSING Corresponding Address ---");
                // b2cObject = b2cObjectID + postFix;
                // buildingName = this.testdata.getBuildingName("ContactMissingCorAddress");
                // buildingNumber = this.testdata.getBuildingNumber("ContactMissingCorAddress");
                // street = this.testdata.getStreet("ContactMissingCorAddress");
                // country = this.testdata.getCountry("ContactMissingCorAddress");
                // postcode = this.testdata.getPostcode("ContactMissingCorAddress");
                contcorrbuildingName = this.testdata.getBuildingName("ContactMissingCorAddress");
                contcorrbuildingNumber = this.testdata.getBuildingNumber("ContactMissingCorAddress");
                contcorrstreet = this.testdata.getStreet("ContactMissingCorAddress");
                contcorrcountry = this.testdata.getCountry("ContactMissingCorAddress");
                contcorrpostcode = this.testdata.getPostcode("ContactMissingCorAddress");
                console.log("");
                break;
            case "MissingBuildNameNo":
                console.log("--- TESTING creating a " + contacttype + " Contact with MISSING Building_Name OR Number fields ---");
                // b2cObject = b2cObjectID + postFix;     
                // buildingName = this.testdata.getBuildingName("ContactMissingCorAddress");
                // buildingNumber = this.testdata.getBuildingNumber("ContactMissingCorAddress");

                contcorrbuildingName = this.testdata.getBuildingName("ContactMissingCorAddress");
                contcorrbuildingNumber = this.testdata.getBuildingNumber("ContactMissingCorAddress");
                console.log("buildingName: " + contcorrbuildingName);
                console.log("buildingNumber: " + contcorrbuildingNumber);
                console.log("");
                break;
            case "MissingStreet":
                console.log("--- TESTING creating a " + contacttype + "  Contact with MISSING street field ---");
                // b2cObject = b2cObjectID + postFix;     
                contcorrstreet = this.testdata.getStreet("ContactMissingCorAddress");
                console.log("");
                console.log("street: " + contcorrstreet);
                break;
            case "MissingCountry":
                console.log("--- TESTING creating a " + contacttype + " Contact with " + validationtype + " field ---");
                contcorrcountry = this.testdata.getCountry("MissingCountryCorAddress");
                console.log("");
                // console.log("---- MISSING COUNTRY TEST ----");
                break;
            case "MissingPostCode":
                console.log("--- TESTING creating a " + contacttype + " Contact with MISSING Post-code field ---");
                // b2cObject = b2cObjectID + postFix;     
                contcorrpostcode = this.testdata.getPostcode("ContactMissingCorAddress");
                console.log("postcode: " + contcorrpostcode);
                break;
            case "ContactMissingTnCDate":
                console.log("--- TESTING creating a " + contacttype + "  Contact with MISSING TandC Date ---");
                // b2cObject = b2cObjectID + postFix;
                tacsacceptedon = this.testdata.getTacsacceptedone("ContactMissingTnCDate");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            case "ContactInvalidTnCDate":
                console.log("--- TESTING creating a " + contacttype + "  Contact with INVALID TandC Date ---");
                // b2cObject = b2cObjectID + postFix;
                tacsacceptedon = this.testdata.getTacsacceptedone("ContactInvalidTnCDate");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            case "ContactMissingTnCVersion":
                console.log("--- TESTING creating a " + contacttype + "  Contact with MISSING TandC Version ---");
                // b2cObject = b2cObjectID + postFix;
                tacsacceptedversion = this.testdata.getTacsacceptedversion("Contact_MissingTnCVersion");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            case "ContactInvalidTnCVersion":
                console.log("--- TESTING creating a " + contacttype + "  Contact with INVALID TandC Version ---");
                // b2cObject = b2cObjectID + postFix;
                tacsacceptedversion = this.testdata.getTacsacceptedversion("Contact_InvalidTnCVersion");
                console.log("--- TandC Date: " + tacsacceptedon);
                console.log("");
                break;
            case "FNameGreaterThan50Char":
                console.log("--- TESTING creating a Contact with " + validationtype + " ----");
                firstName = this.testdata.getFirstName("FNameGreaterThan50");
                console.log("--- First Name: " + firstName);
                console.log("");
                break;
            case "LNameGreaterThan50Char":
                console.log("--- TESTING creating a Contact with " + validationtype + " ----");
                lastName = this.testdata.getLastName("LNameGreaterThan50");
                console.log("--- Last Name: " + lastName);
                console.log("");
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        var bodyObject;

        switch (validationtype) {          
            case "AllUK_Addresses":
                bodyObject = {
                    'defra_title': title, 'defra_b2cobjectid': b2cObject, 'defra_ggcredentialid': ggCredentials, 'gendercode': gender, 'firstname': firstName, 'middlename': middleName, 'lastname': lastName, 'emailaddress1': email, 'birthdate': DOB, 'telephone1': telephone,
                    'defra_cmcreateascitizen': isCitizen,
                    'defra_securityword': SecureWord,
                    'defra_securityhint': Hint,
                    'defra_cmcreationsource': source,
                    // Correspondence Address
                    'defra_addrcoruprn': coruprn,
                    'defra_addrcorbuildingname': contcorrbuildingName,
                    'defra_addrcorbuildingnumber': contcorrbuildingNumber,
                    'defra_addrcorstreet': contcorrstreet,
                    'defra_addrcorlocality': contcorrlocality,
                    'defra_addrcortown': contcorrtown,
                    'defra_addrcorcountry@odata.bind': contcorrcountry,
                    'defra_addrcorpostcode': contcorrpostcode,
                    // Business Address
                    'defra_addrbusacuprn': busiuprn,
                    'defra_addrbusacbuildingname': contbusinessbuildingName,
                    'defra_addrbusacbuildingnumber': contbusinessbuildingNumber,
                    'defra_addrbusacstreet': contbusinessstreet,
                    'defra_addrbusaclocality': contbusinesslocality,
                    'defra_addrbusactown': contbusinesstown,
                    'defra_addrbusaccountry@odata.bind': contbusinesscountry,
                    'defra_addrbusacpostcode': contbusinesspostcode,
                    // Billing Address
                    // 'defra_addrbilluprn': billuprn,
                    // 'defra_addrbillbuildingname': contbillbuildingName,
                    // 'defra_addrbillbuildingnumber': contbillbuildingNumber,
                    // 'defra_addrbillstreet': contbillstreet,
                    // 'defra_addrbilllocality': contbilllocality,
                    // 'defra_addrbilltown': contbilltown,
                    // 'defra_addrbillcountry@odata.bind': contbillcountry,
                    // 'defra_addrbillpostcode': contbillpostcode,
                    // Cookies, Policy and T&Condition
                    'defra_tacsacceptedversion': tacsacceptedversion,
                    'defra_tacsacceptedon': tacsacceptedon,
                    'defra_cookiespolicyacceptedversion': cookiesVersion,
                    'defra_cookiespolicyacceptedon': cookiesDate,
                    'defra_privacypolicyacceptedversion': privacyPolicyVersio,
                    'defra_privacypolicyacceptedon': privacyPolicyDate
                }
                break;
            case "NonUKCorAdd_OthersUKAddresses":
                bodyObject = {
                    'defra_title': title, 'defra_b2cobjectid': b2cObject, 'defra_ggcredentialid': ggCredentials, 'gendercode': gender, 'firstname': firstName, 'middlename': middleName, 'lastname': lastName, 'emailaddress1': email, 'birthdate': DOB, 'telephone1': telephone,
                    'defra_cmcreateascitizen': isCitizen,
                    'defra_securityword': SecureWord,
                    'defra_securityhint': Hint,
                    'defra_cmcreationsource': source,
                    //NoneUK Correspondence Address
                    'defra_addrcorbuildingname': nonukcontcorrbuildingName,
                    'defra_addrcorbuildingnumber': nonukcontcorrbuildingNumber,
                    'defra_addrcorstreet': nonukcontcorrstreet,
                    'defra_addrcorlocality': nonukcontcorrlocality,
                    'defra_addrcortown': nonukcontcorrtown,
                    'defra_addrcorcountry@odata.bind': nonukcontcorrcountry,
                    'defra_addrcorinternationalpostalcode': nonukcontintercorpostcode,
                    //UK Business Address
                    'defra_addrbusacuprn': busiuprn,
                    'defra_addrbusacbuildingname': contbusinessbuildingName,
                    'defra_addrbusacbuildingnumber': contbusinessbuildingNumber,
                    'defra_addrbusacstreet': contbusinessstreet,
                    'defra_addrbusaclocality': contbusinesslocality,
                    'defra_addrbusactown': contbusinesstown,
                    'defra_addrbusaccountry@odata.bind': contbusinesscountry,
                    'defra_addrbusacpostcode': contbusinesspostcode,
                    //NoneUK Billing Address
                    // 'defra_addrbillbuildingname': nonukcontbillbuildingName,
                    // 'defra_addrbillbuildingnumber': nonukcontbillbuildingNumber,
                    // 'defra_addrbillstreet': nonukcontbillstreet,
                    // 'defra_addrbilllocality': nonukcontbilllocality,
                    // 'defra_addrbilltown': nonukcontbilltown,
                    // 'defra_addrbillcountry@odata.bind': nonukcontbillcountry,
                    // 'defra_addrbillinternationalpostalcode': nonukcontinterbillpostcode,
                    // Cookies, Policies, T&Conditions
                    'defra_tacsacceptedversion': tacsacceptedversion,
                    'defra_tacsacceptedon': tacsacceptedon,
                    'defra_cookiespolicyacceptedversion': cookiesVersion,
                    'defra_cookiespolicyacceptedon': cookiesDate,
                    'defra_privacypolicyacceptedversion': privacyPolicyVersio,
                    'defra_privacypolicyacceptedon': privacyPolicyDate
                }
                break;
            case "AllNoneUK_Addresses":
                bodyObject = {
                    'defra_title': title, 'defra_b2cobjectid': b2cObject, 'defra_ggcredentialid': ggCredentials, 'gendercode': gender, 'firstname': firstName, 'middlename': middleName, 'lastname': lastName, 'emailaddress1': email, 'birthdate': DOB, 'telephone1': telephone,
                    'defra_cmcreateascitizen': isCitizen,
                    'defra_securityword': SecureWord,
                    'defra_securityhint': Hint,
                    'defra_cmcreationsource': source,
                    //NoneUK Correspondence Address
                    'defra_addrcorbuildingname': nonukcontcorrbuildingName,
                    'defra_addrcorbuildingnumber': nonukcontcorrbuildingNumber,
                    'defra_addrcorstreet': nonukcontcorrstreet,
                    'defra_addrcorlocality': nonukcontcorrlocality,
                    'defra_addrcortown': nonukcontcorrtown,
                    'defra_addrcorcountry@odata.bind': nonukcontcorrcountry,
                    'defra_addrcorinternationalpostalcode': nonukcontintercorpostcode,
                    //UK Business Address
                    //  'defra_addrbusacuprn': busiuprn,
                    //  'defra_addrbusacbuildingname': contbusinessbuildingName,
                    //  'defra_addrbusacbuildingnumber': contbusinessbuildingNumber,
                    //  'defra_addrbusacstreet': contbusinessstreet,
                    //  'defra_addrbusaclocality': contbusinesslocality,
                    //  'defra_addrbusactown': contbusinesstown,
                    //  'defra_addrbusaccountry@odata.bind': contbusinesscountry,
                    //  'defra_addrbusacpostcode': contbusinesspostcode,
                    //NoneUK Billing Address
                    'defra_addrbillbuildingname': nonukcontbillbuildingName,
                    'defra_addrbillbuildingnumber': nonukcontbillbuildingNumber,
                    'defra_addrbillstreet': nonukcontbillstreet,
                    'defra_addrbilllocality': nonukcontbilllocality,
                    'defra_addrbilltown': nonukcontbilltown,
                    'defra_addrbillcountry@odata.bind': nonukcontbillcountry,
                    'defra_addrbillinternationalpostalcode': nonukcontinterbillpostcode,
                    //Cookies, Policies, T&Conditions
                    'defra_tacsacceptedversion': tacsacceptedversion,
                    'defra_tacsacceptedon': tacsacceptedon,
                    'defra_cookiespolicyacceptedversion': cookiesVersion,
                    'defra_cookiespolicyacceptedon': cookiesDate,
                    'defra_privacypolicyacceptedversion': privacyPolicyVersio,
                    'defra_privacypolicyacceptedon': privacyPolicyDate
                }
                break;
            default:
                bodyObject = {
                    'defra_title': title, 'defra_b2cobjectid': b2cObject, 'defra_ggcredentialid': ggCredentials,
                    'gendercode': gender, 'firstname': firstName, 'middlename': middleName, 'lastname': lastName, 
                    'emailaddress1': email, 'birthdate': DOB, 'telephone1': telephone,
                    'defra_cmcreateascitizen': isCitizen,
                    'defra_securityword': SecureWord,
                    'defra_securityhint': Hint,
                    'defra_cmcreationsource': source,
                    'defra_addrcoruprn': coruprn,
                    'defra_addrcorbuildingname': contcorrbuildingName,
                    'defra_addrcorbuildingnumber': contcorrbuildingNumber,
                    'defra_addrcorstreet': contcorrstreet,
                    'defra_addrcorlocality': contcorrlocality,
                    'defra_addrcortown': contcorrtown,
                    'defra_addrcorcountry@odata.bind': contcorrcountry,
                    'defra_addrcorpostcode': contcorrpostcode,
                    'defra_tacsacceptedversion': tacsacceptedversion,
                    'defra_tacsacceptedon': tacsacceptedon,
                    'defra_cookiespolicyacceptedversion': cookiesVersion,
                    'defra_cookiespolicyacceptedon': cookiesDate,
                    'defra_privacypolicyacceptedversion': privacyPolicyVersio,
                    'defra_privacypolicyacceptedon': privacyPolicyDate
                }
                break;
        }

        console.log(">>> Created CONTACT: " + firstName + " - " + lastName);
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

            body: bodyObject,
            json: true
        };

        //Calling request to return a promise so that it will use the returning values and perform the rest of the assertions/actions
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

            //----- ADD it to the json file - note we actually don't need the txt file for relationship ---
            // var obj = {
            //     custID: []
            //  };

            // obj.custID.push({id: contactID});
            // var json = JSON.stringify(obj);

            contactID = JSON.stringify(initializePromise.body["contactid"]);
            console.log("--- ContactID: " + contactID);

            if (contacttype == "Citizen" || contacttype == "Non_Citizen") {
                fs.writeFile('contactid.json', contactID, 'utf8', function (err) {
                    if (err) { reject(err); }
                });
            }
            else {
                fs.writeFile('contactidNPlusOne.json', contactID, 'utf8', function (err) {
                    if (err) { reject(err); };
                });
            }

            // Asserting the expected response body contains the expected statusMsg
            chai.expect(JSON.stringify(initializePromise.body)).contains(statusMsg);

            console.log("");
            console.log("------------- The END ----------------");
        }
        else if (statusCodeVal !== 200 || statusCodeVal !== 201) {
            console.log("");
            console.log("statusCode:", JSON.stringify(initializePromise) && initializePromise.statusCode);
            console.log("TEXT:       " + initializePromise.statusMessage);

            console.log("");
            var errorText = JSON.stringify(initializePromise.body.error["message"]);
            console.log("--- Assertion TEXT:  " + statusMsg);
            console.log("--- Responce  BODY: " + errorText);

            chai.expect(errorText).contains(statusMsg);

            console.log("");
            console.log("------------ END -------------------")
        }

    }

    async requestEditContact(token, FieldsToEdite, UpdateMsgCont) {
        console.log("");
        console.log("************ EDITING newly created CONTACT core details *******************");
        console.log("");

        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // GET the contactID of the NEWLY created Contact
        var externalJSON = await this.readFilesJSON('contactid.json')
        const savedContactID = JSON.parse(externalJSON); //now it an object

        var updateFN = 'UPDATE-fN';
        var updateLN = 'UPDATE-lN';
        var updatePhone = '7777777';
        var updateEmail = 'UPDATE-email-' + (Math.floor(1000 + Math.random() * 9000).toString().slice(0, 4)) + '@test.com';

        var bodyObject;

        switch (FieldsToEdite) {
            case "firstName":
                bodyObject = {
                    'firstname': updateFN
                }
                break;
            case "lastName":
                bodyObject = {
                    'lastname': updateLN
                }
                break;
            case "phone":
                bodyObject = {
                    'telephone1': updatePhone
                }
                break;
            case "email":
                bodyObject = {
                    'emailaddress1': updateEmail
                }
                break;
            default:
                console.log("-- ERROR - INVALIDE data field PASSED !! --");
                break;
        }

        var objKEY = Object.keys(bodyObject);
        // console.log(">>>> bodyObject KEY      : " + objKEY);
        // console.log(">>>> bodyObject Key VALUE: " + bodyObject[objKEY]);
        console.log("");

        // Generating/Configuring the PATCH Request
        // options for api response :- need to change postman token so used random 12 digit in the end
        const apiUpdateRequest = {
            method: 'PATCH',
            url: configCRM.appUrlCRM + 'api/data/v9.0/contacts(' + savedContactID + ')',
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

            body: bodyObject,
            json: true
        };

        // Running the PATCH request
        // Calling request to return a promise so that it will use the returning values and perform the rest of the assertions/actions
        var updateAPIResponse = await this.initialize(apiUpdateRequest);

        // Validating the PATCH response 
        statusCodeVal = updateAPIResponse.statusCode;
        if (statusCodeVal === 200 || statusCodeVal === 201) {
            console.log("PATCH response status-Code:", JSON.stringify(updateAPIResponse) && updateAPIResponse.statusCode);
            console.log("TEXT:       " + updateAPIResponse.statusMessage);
            console.log("");
            console.log("Assersion VALUE in Response BODY: " + bodyObject[objKEY]);
            console.log("Response BODY : " + JSON.stringify(updateAPIResponse.body));
            console.log("");

            chai.expect(JSON.stringify(updateAPIResponse.statusMessage)).contains(UpdateMsgCont);
            chai.expect(JSON.stringify(updateAPIResponse.body)).contains(bodyObject[objKEY]);
        }
        else if (statusCodeVal !== 200 || statusCodeVal !== 201) {
            console.log("");
            console.log("status-Code:", JSON.stringify(updateAPIResponse) && updateAPIResponse.statusCode);
            console.log("TEXT:       " + updateAPIResponse.statusMessage);

            console.log("");
            var errorText = JSON.stringify(updateAPIResponse.body.error["message"]);
            console.log("--- Responce  BODY: " + errorText);

            // chai.expect(errorText).contains(statusMsg);

            console.log("");
            console.log("------------ END -------------------")
        }

    }

      //**************USE THIS**********************/
      async requestCreateNEWOrg(token, isuk, orgtype, orgProperty, statusMsg) {

        let today = new Date().toLocaleString();
        //generate random 12 digit number for unique Postman Token
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));
     
        // var orgEmail;
        // var orgType;
        orgIsUK = isuk;    
        orgName = this.testdata.getOrgName("BasicOrgDetails");
        var orgCRN;
        var charityNoEnW = "";
        var charityNoNI = "";
        var charityNoScot = "";
        // var charityNo = this.testdata.getCharityNo("BasicOrgDetails");
        // --- Organisation Registered Address Registration Details --- 
        var orgRegaddbuildingname = this.testdata.getOrgBuildingName("UK_RegAddress");
        var orgRegaddbuildingno = this.testdata.getOrgBuildingNo("UK_RegAddress");
        var orgRegsubbuildingname = this.testdata.getOrgSubBuildingName("UK_RegAddress");
        var orgRegaddstreet = this.testdata.getOrgStreet("UK_RegAddress");
        var orgRegaddlocality = this.testdata.getOrgLocality("UK_RegAddress");
        var orgRegcounty = this.testdata.getOrgCounty("UK_RegAddress");
        var orgRegtown = this.testdata.getOrgTown("UK_RegAddress");
        var orgRegcountry = this.testdata.getOrgCountry("UK_RegAddress");
        var orgRegpostcode = this.testdata.getOrgPostcode("UK_RegAddress");
        // --- Organisation Correspondence Address Registration Details --- 
        var orgCoraddbuildingname = this.testdata.getOrgBuildingName("UK_CorrAddress");
        var orgCoraddbuildingno = this.testdata.getOrgBuildingNo("UK_CorrAddress");
        var orgCorsubbuildingname = this.testdata.getOrgSubBuildingName("UK_CorrAddress");
        var orgCoraddstreet = this.testdata.getOrgStreet("UK_CorrAddress");
        var orgCoraddlocality = this.testdata.getOrgLocality("UK_CorrAddress");
        var orgCorcounty = this.testdata.getOrgCounty("UK_CorrAddress");
        var orgCortown = this.testdata.getOrgTown("UK_CorrAddress");
        var orgCorcountry = this.testdata.getOrgCountry("UK_CorrAddress");
        var orgCorpostcode = this.testdata.getOrgPostcode("UK_CorrAddress");
        var orgParentOrg = this.testdata.getOrgParentOrg("BasicOrgDetails");
         // ------- NoneUK Organisations Registered Address -------
        var nonUKorgRegaddbuildingname = this.testdata.getOrgBuildingName("NoneUK_RegAddress");
        var nonUKorgRegaddbuildingno = this.testdata.getOrgBuildingNo("NoneUK_RegAddress");
        var nonUKorgRegsubbuildingname = this.testdata.getOrgSubBuildingName("NoneUK_RegAddress");
        var nonUKorgRegaddstreet = this.testdata.getOrgStreet("NoneUK_RegAddress");
        var nonUKorgRegaddlocality = this.testdata.getOrgLocality("NoneUK_RegAddress");
        var nonUKorgRegcounty = this.testdata.getOrgCounty("NoneUK_RegAddress");
        var nonUKorgRegtown = this.testdata.getOrgTown("NoneUK_RegAddress");
        var nonUKorgRegcountry = this.testdata.getOrgCountry("NoneUK_RegAddress");
        var nonUKorgReginterpostcode = this.testdata.getOrgInterPostcode("NoneUK_RegAddress");
         // ------ NoneUK Organisations Billing Address ------
        var nonUKorgBilladdbuildingname = this.testdata.getOrgBuildingName("NoneUK_BillAddress");
        var nonUKorgBilladdbuildingno = this.testdata.getOrgBuildingNo("NoneUK_BillAddress");
        var nonUKorgBillsubbuildingname = this.testdata.getOrgSubBuildingName("NoneUK_BillAddress");
        var nonUKorgBilladdstreet = this.testdata.getOrgStreet("NoneUK_BillAddress");
        var nonUKorgBilladdlocality = this.testdata.getOrgLocality("NoneUK_BillAddress");
        var nonUKorgBillcounty = this.testdata.getOrgCounty("NoneUK_BillAddress");
        var nonUKorgBilltown = this.testdata.getOrgTown("NoneUK_BillAddress");
        var nonUKorgBillcountry = this.testdata.getOrgCountry("NoneUK_BillAddress");
        var nonUKorgBillinterpostcode = this.testdata.getOrgInterPostcode("NoneUK_BillAddress");

        console.log("");
        console.log("*** isUk Org: " + orgIsUK);
        console.log("");

        var reguprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);
        var coruprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);
        var busiuprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);
        var billuprn = Math.floor(100000000000 + Math.random() * 900000000000).toString().slice(0, 12);

        switch(orgtype){
            case "LTD":
                console.log("--- Creating a Basic LTD-Organisation ---");
                orgType = this.testdata.getOrgType("BasicOrg_LTD");
                break;
            case "PLC":
                console.log("--- Creating a Basic PLC-Organisation ---");
                orgType = this.testdata.getOrgType("BasicOrg_PLC");
                break;
            case "LLP":
                console.log("--- Creating a Basic LLP-Organisation ---");
                orgType = this.testdata.getOrgType("BasicOrg_LLP");
                break;
            case "SoleTrad":
                console.log("--- Creating a Basic Sole Trader-Organisation ---");
                orgType = this.testdata.getOrgType("BasicOrg_Sole");
                break;
            case "Gov":
                console.log("--- Creating a Basic Government-Organisation ---");
                orgType = this.testdata.getOrgType("BasicOrg_Gov");
                break;
            case "CompAuth":
                console.log("--- Creating a Basic Competent Auth-Organisation ---");
                orgType = this.testdata.getOrgType("BasicOrg_Comp");
                break;
            case "Priv_unLTD":
                console.log("--- Creating a Private unlimited Company ---");
                orgType = this.testdata.getOrgType("Priv_unLTD");
                break;
            case "Old_Pub_Comp":
                console.log("--- Creating a Old Public Company ---");
                orgType = this.testdata.getOrgType("Old_Pub_Comp");
                break;
            case "PLC_GWoSC_UoLE":
                console.log("--- Creating a Pivate LTD by Guarnatee without Share Capital Use of LTD Exemption ---");
                orgType = this.testdata.getOrgType("PLC_GWoSC_UoLE");
                break;
            case "LTD_Partnership":
                console.log("--- Creating a Basic Sole LTD_Partnership ---");
                orgType = this.testdata.getOrgType("LTD_Partnership");
                break;
            case "PLC_GWoSC":
                console.log("--- Creating a Private Limited by Guarantee Without Share Capital ---");
                orgType = this.testdata.getOrgType("PLC_GWoSC");
                break;
            case "PLC_UnLTD_WSC":
                console.log("--- Creating a Private Unlimited Company Without Share Capital ---");
                orgType = this.testdata.getOrgType("PLC_UnLTD_WSC");
                break;
            case "PLC_UoLE":
                console.log("--- Creating a Private Limited Company, Use of Limited Exemption ---");
                orgType = this.testdata.getOrgType("PLC_UoLE");
                break;
            case "Prot_Cell_Comp":
                console.log("--- Creating a Protected Cell Company ---");
                orgType = this.testdata.getOrgType("Prot_Cell_Comp");
                break;
            case "Assu_Comp":
                console.log("--- Creating a Basic Assurance Company ---");
                orgType = this.testdata.getOrgType("Assu_Comp");
                break;
            case "EEIG":
                console.log("--- Creating a European Economic Interest Grouping (EEIG) ---");
                orgType = this.testdata.getOrgType("EEIG");
                break;
            case "ICWVC_Securities":
                console.log("--- Creating an Investment Company With Variable Capital (Securities) ---");
                orgType = this.testdata.getOrgType("ICWVC_Securities");
                break;
            case "ICWVC_Warrant":
                console.log("--- Creating an Investment Company With Variable Capital (Warrant)---");
                orgType = this.testdata.getOrgType("ICWVC_Warrant");
                break;
            case "ICWVC_Umbrella":
                console.log("--- Creating an Investment Company With Variable Capital (Umbrella) ---");
                orgType = this.testdata.getOrgType("ICWVC_Umbrella");
                break;
            case "IaPS":
                console.log("--- Creating a Industrial and Provident Society ---");
                orgType = this.testdata.getOrgType("IaPS");
                break;
            case "NI_Comp":
                console.log("--- Creating a Northern Ireland Company ---");
                orgType = this.testdata.getOrgType("NI_Comp");
                break;
            case "Credit_Union_NI":
                console.log("--- Creating a Credit Union (Northern Ireland) ---");
                orgType = this.testdata.getOrgType("Credit_Union_NI");
                break;
            case "Royal_Chart_Comp":
                console.log("--- Creating a Royal Charter Company ---");
                orgType = this.testdata.getOrgType("Royal_Chart_Comp");
                break;
            case "ICWVC":
                console.log("--- Creating an Investment Company With Variable Capital ---");
                orgType = this.testdata.getOrgType("ICWVC");
                break;
            case "EPLLC_SE":
                console.log("--- Creating a European Public Limited Liability Company (SE) ---");
                orgType = this.testdata.getOrgType("EPLLC_SE");
                break;
            case "UK_Est_Comp":
                console.log("--- Creating a UK Establishment Company ---");
                orgType = this.testdata.getOrgType("UK_Est_Comp");
                break;
            case "Scott_QP":
                console.log("--- Creating a Scottish Qualifying Partnership ---");
                orgType = this.testdata.getOrgType("Scott_QP");
                break;
            case "Reg_Society":
                console.log("--- Creating a Registered Society---");
                orgType = this.testdata.getOrgType("Reg_Society");
                break;
            case "EnW":
                console.log("--- Creating a Basic EnW-CHARITY ---");
                orgType = this.testdata.getOrgType("BasicOrg_Char");
                break;
            case "Scot":
                console.log("--- Creating a Basic Scot-CHARITY ---");
                orgType = this.testdata.getOrgType("BasicOrg_Char");
                break;
            case "NI":
                console.log("--- Creating a Basic NI-CHARITY ---");
                orgType = this.testdata.getOrgType("BasicOrg_Char");
                break;
            case "None":
                console.log("--- Creating a Basic Organisation with NO Org-type ---");
                orgType = "";
                break;
        }

        var email = this.testdata.getOrgEmail("BasicOrgDetails");
        orgEmail = orgtype + (Math.random().toString().slice(2, 7)) + email;
        orgCRN = Math.random().toString().slice(2, 10);

        switch (orgProperty) {
            case "Basic_Org":
                console.log("*** Basic Organisation Creation TEST ***");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);        
                break;
            case "MissingOrgName":
                console.log("*** Organisation MISSING-Name TEST ***");
                // orgName = this.testdata.getOrgName("MissingOrgNameCheck");
                orgName = "";
                break;
            case "MissingOrgType":
                console.log("--- Organisation MISSING-TYPE TEST --");
                orgName = orgName + orgtype + "-MissingOrgType" + Math.random().toString(36).substr(2, 5);
                orgType = this.testdata.getOrgType("MissingOrgType");
                // orgCRN = Math.random().toString().slice(2, 10);
                break;
            case "MissingCRNCheck":
                console.log("*** Organisation Missing-CRN TEST ***");
                orgCRN = this.testdata.getOrgCRN("MissingCRNCheck");
                break;
            case "DuplicateCRNCheck":
                console.log("--- Organisation Duplicated-CRN TEST ---");
                orgCRN = this.testdata.getOrgCRN("DuplicateCRNCheck");
                break;
            case "CRNGreaterThan":
                console.log("--- Organisation CRN-GREATER-THAN-8-Char TEST ---");
                orgCRN = this.testdata.getOrgCRN("CRNGreaterThanCheck");
                break;
            case "CRNLessThan":
                console.log("--- Organisation CRN-LESS-THAN-8-Char TEST ---");
                orgCRN = this.testdata.getOrgCRN("CRNLessThanCheck");
                break;
            case "MissingRegAddress":
                console.log("--- Org MISSING-Registered-Address TEST ---");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgRegaddbuildingname = this.testdata.getOrgBuildingName("MissingRegAddressCheck");
                orgRegaddbuildingno = this.testdata.getOrgBuildingNo("MissingRegAddressCheck");
                orgRegaddstreet = this.testdata.getOrgStreet("MissingRegAddressCheck");
                orgRegpostcode = this.testdata.getOrgPostcode("MissingRegAddressCheck");
                break;
            case "MissingStreet":
                console.log("--- Org MISSING-Street in Address TEST ---");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgRegaddstreet = this.testdata.getOrgStreet("MissingRegAddressCheck");
                break;
            case "MissingPostCode":
                console.log("--- Org MISSING-PostCode in Address TEST ---");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgRegpostcode = this.testdata.getOrgPostcode("MissingRegAddressCheck");
                break;
            case "MissingCountry":
                console.log("--- Org MISSING-Country in Address TEST ---");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                // orgRegcountry = this.testdata.getOrgCountry("OrgMissingCountry");
                orgRegcountry = this.testdata.getOrgCountry("MissingRegAddressCheck");
                break;
            case "OrgNameGrt160CharLong":
                console.log("--- ORGANISATIONS Name is GREATER-THAN-160-Characters LONG TEST ---");
                orgName = this.testdata.getOrgName("OrgNameGrt160CharLong");
                break;
            case "MissingBuildingNameAndNo":
                console.log("--- Org MISSING-Building NAME and NUMBER in Address TEST ---");
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgRegaddbuildingname = this.testdata.getOrgBuildingName("MissingRegAddressCheck");
                orgRegaddbuildingno = this.testdata.getOrgBuildingNo("MissingRegAddressCheck");
                break;
            case "UKOrg_NonUk_Addr":
                orgName = orgName + orgtype + "-" + Math.random().toString(36).substr(2, 5) + "-UK";
                isUKAddress = false;
                break;
            case "NonUkOrg_NoCRN_Address":
                isUKAddress = false;
                orgName = "NoneUK_Org" + "-" + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgCRN = this.testdata.getOrgCRN("MissingCRNCheck");
                // nonUKorgRegaddbuildingname = this.testdata.getOrgBuildingName("NoneUK_RegAddress")
                // nonUKorgRegaddbuildingno = this.testdata.getOrgBuildingNo("NoneUK_RegAddress")  
                // nonUKorgRegcountry = this.testdata.getOrgCountry("NoneUK_RegAddress")
                // nonUKorgRegaddstreet = this.testdata.getOrgStreet("NoneUK_RegAddress")         
                // nonUKorgReginterpostcode = this.testdata.getOrgInterPostcode("NoneUK_RegAddress");   
                // nonUKorgBilladdbuildingname = this.testdata.getOrgBuildingName("NoneUK_BillAddress")
                // nonUKorgBilladdbuildingno = this.testdata.getOrgBuildingNo("NoneUK_BillAddress")  
                // nonUKorgBillcountry = this.testdata.getOrgCountry("NoneUK_BillAddress")
                // nonUKorgBilladdstreet = this.testdata.getOrgStreet("NoneUK_BillAddress")         
                // nonUKorgBillinterpostcode = this.testdata.getOrgInterPostcode("NoneUK_BillAddress");  
                break;
            case "NonUkOrg_CRN_NoAdd":
                orgName = "NoneUK_Org" + "-" + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgCRN = Math.random().toString().slice(2, 10);
                isUKAddress = false;

                nonUKorgRegaddbuildingname = this.testdata.getOrgBuildingName("NoneUK_No_Address")
                nonUKorgRegaddbuildingno = this.testdata.getOrgBuildingNo("NoneUK_No_Address")
                nonUKorgRegcountry = this.testdata.getOrgCountry("NoneUK_No_Address")
                nonUKorgRegaddstreet = this.testdata.getOrgStreet("NoneUK_No_Address")
                nonUKorgReginterpostcode = this.testdata.getOrgPostcode("NoneUK_No_Address");

                nonUKorgBilladdbuildingname = this.testdata.getOrgBuildingName("NoneUK_No_Address")
                nonUKorgBilladdbuildingno = this.testdata.getOrgBuildingNo("NoneUK_No_Address")
                nonUKorgBillcountry = this.testdata.getOrgCountry("NoneUK_No_Address")
                nonUKorgBilladdstreet = this.testdata.getOrgStreet("NoneUK_No_Address")
                nonUKorgBillinterpostcode = this.testdata.getOrgPostcode("NoneUK_No_Address");
                break;
            case "NonUkOrg_NoCRN_NoAdd":
                orgName = "NoneUK_Org" + "-" + orgtype + "-" + Math.random().toString(36).substr(2, 5);
                orgCRN = this.testdata.getOrgCRN("MissingCRNCheck");  
                isUKAddress = false;   

                nonUKorgRegaddbuildingname = this.testdata.getOrgBuildingName("NoneUK_No_Address")
                nonUKorgRegaddbuildingno = this.testdata.getOrgBuildingNo("NoneUK_No_Address")
                nonUKorgRegcountry = this.testdata.getOrgCountry("NoneUK_No_Address")
                nonUKorgRegaddstreet = this.testdata.getOrgStreet("NoneUK_No_Address")
                nonUKorgReginterpostcode = this.testdata.getOrgPostcode("NoneUK_No_Address");

                nonUKorgBilladdbuildingname = this.testdata.getOrgBuildingName("NoneUK_BillAddress")
                nonUKorgBilladdbuildingno = this.testdata.getOrgBuildingNo("NoneUK_BillAddress")
                nonUKorgBillcountry = this.testdata.getOrgCountry("NoneUK_BillAddress")
                nonUKorgBilladdstreet = this.testdata.getOrgStreet("NoneUK_BillAddress")
                nonUKorgBillinterpostcode = this.testdata.getOrgPostcode("NoneUK_BillAddress");
                break;
            case "Charity_BasicDetails":
                console.log("--- Creating a Basic " + "'" + orgtype + "'" + " Charity Organisation ---");
                var name = this.testdata.getOrgName("CharityOrgDetails");
                orgName = name + "-" + orgtype + (Math.random().toString().slice(2, 4));
                var charNo = Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
                console.log("--- Charity NUMBER: " + charNo);

                var charityType = "charityNo" + orgtype;
                console.log(">>> Charity-TYPE: " + charityType );

                if (charityType == "charityNoEnW") {
                    charityNoEnW = charNo
                }
                if (charityType == "charityNoScot") {
                    charityNoScot = charNo
                }
                if (charityType == "charityNoNI") {
                    charityNoNI = charNo
                }
                orgCRN = null;         
                break;
            case "CharityNo_GreaterThan":
                console.log("--- Creating a Basic " + "'" + orgtype + "'" + " with Charity-No_GREATER-THAN-8 integers ---");
                var name = this.testdata.getOrgName("CharityOrgDetails");
                orgName = name + "-" + orgtype + (Math.random().toString().slice(2, 4));
                var charNo = Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 10);
                console.log("--- Charity NUMBER: " + charNo);
                var charityType = "charityNo" + orgtype;
                console.log(">>> Charity-TYPE: " + charityType );

                if (charityType == "charityNoEnW") {
                    charityNoEnW = charNo
                }
                if (charityType == "charityNoScot") {
                    charityNoScot = charNo
                }
                if (charityType == "charityNoNI") {
                    charityNoNI = charNo
                }
                orgCRN = null;  

                break;
            case "CharityNo_Duplicated":
                console.log("--- Create " + orgtype + " Charity with DUPLICATE-Charity-Number TEST ---");
                var name = this.testdata.getOrgName("CharityOrgDetails");
                orgName = name + "-" + orgtype + (Math.random().toString().slice(2, 4));
                var charNo = this.testdata.getCharityNo("CharityNoDuplicate");
                
                console.log("--- Charity NUMBER: " + charNo);
                var charityType = "charityNo" + orgtype;
                console.log(">>> Charity-TYPE: " + charityType );

                if (charityType == "charityNoEnW") {
                    charityNoEnW = charNo
                }
                if (charityType == "charityNoNI") {
                    charityNoNI = charNo
                }
                if (charityType == "charityNoScot") {
                    charityNoScot = charNo
                }
                orgCRN = "";
                break;
            default:
                console.log("Invalide DATA-TYPE !!");
                break;
        }

        // console.log("");

        var bodyObject;

        if (isUKAddress == true) {
            bodyObject = {
                'defra_isuk': orgIsUK,
                'defra_type': orgType,
                'name': orgName,     
                'defra_cmcrn': orgCRN,
                'defra_charitynumber': charityNoEnW,
                'defra_charitynumberni': charityNoNI,
                'defra_charitynumberscot': charityNoScot,
                'emailaddress1': orgEmail,
                'defra_addrreguprn': reguprn,
                'defra_addrregbuildingname': orgRegaddbuildingname,
                'defra_addrregbuildingnumber': orgRegaddbuildingno,
                'defra_addrregsubbuildingname': orgRegsubbuildingname,
                'defra_addrregstreet': orgRegaddstreet,
                'defra_addrreglocality': orgRegaddlocality,
                'defra_addrregcounty': orgRegcounty,
                'defra_addrregtown': orgRegtown,
                'defra_addrregcountry@odata.bind': orgRegcountry,
                'defra_addrregpostcode': orgRegpostcode,
                'defra_addrcoruprn': coruprn,
                'defra_addrcorbuildingname': orgCoraddbuildingname,
                'defra_addrcorbuildingnumber': orgCoraddbuildingno,
                'defra_addrcorsubbuildingname': orgCorsubbuildingname,
                'defra_addrcorstreet': orgCoraddstreet,
                'defra_addrcorlocality': orgCoraddlocality,
                'defra_addrcorcounty': orgCorcounty,
                'defra_addrcortown': orgCortown,
                'defra_addrcorcountry@odata.bind': orgCorcountry,
                'parentaccountid@odata.bind': orgParentOrg,
                'defra_hierarchylevel': "910400003",
                'defra_addrcorpostcode': orgCorpostcode
            };
        }
        else {
            bodyObject = {
                'defra_isuk': orgIsUK,
                'defra_type': orgType,
                'name': orgName,     
                'defra_cmcrn': orgCRN,
                'defra_charitynumber': charityNoEnW,
                'defra_charitynumberni': charityNoNI,
                'defra_charitynumberscot': charityNoScot,
                'emailaddress1': orgEmail,
                'defra_addrregbuildingname': nonUKorgRegaddbuildingname,
                'defra_addrregbuildingnumber': nonUKorgRegaddbuildingno,
                'defra_addrregstreet': nonUKorgRegaddstreet,
                'defra_addrregcountry@odata.bind': nonUKorgRegcountry,
                'defra_addrreginternationalpostalcode': nonUKorgReginterpostcode,
                'defra_addrbillbuildingname': nonUKorgBilladdbuildingname,
                'defra_addrbillbuildingnumber': nonUKorgBilladdbuildingno,
                'defra_addrbillstreet': nonUKorgBilladdstreet,
                'defra_addrbillcountry@odata.bind': nonUKorgBillcountry,
                'defra_addrbillinternationalpostalcode': nonUKorgBillinterpostcode,

                // 'parentaccountid@odata.bind': orgParentOrg,
                // 'defra_hierarchylevel': "910400003",
                // 'defra_addrcorpostcode': orgCorpostcode
            };
        }

        const apiPostRequest = {
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

            body: bodyObject,
            json: true
        };

        var apiPostResponse = await this.initialize(apiPostRequest);
        statusCodeVal = apiPostResponse.statusCode;

        console.log("");
        console.log("CREATED Organisation status-Code : ", JSON.stringify(apiPostResponse) && apiPostResponse.statusCode);
        console.log("TEXT      : " + apiPostResponse.statusMessage);

        if (statusCodeVal === 200 || statusCodeVal === 201) {
            console.log("");
            console.log("--- Organisation NAME : " + orgName);
            console.log("--- Organisation CRN  : " + orgCRN);

            // chai.expect(JSON.stringify(initializePromise)).to.not.contain(statusMsg); 
            chai.expect(JSON.stringify(apiPostResponse)).contain(statusMsg);

            organisationID = JSON.stringify(apiPostResponse.body["accountid"]);

            console.log("--- Organisation/AccountID: " + organisationID);
            console.log("");
            console.log("-- Assertion TEXT: " + statusMsg);
            console.log("-- Responce BODY : " + JSON.stringify(apiPostResponse.body));
            console.log("");

            fs.writeFile('organisationid.json', organisationID, 'utf8', function (err) {
                if (err) { reject(err); };
            });

            console.log("------------- THE END --------------------")
        }
        else if (statusCodeVal !== 200 || statusCodeVal !== 201) {
            console.log("");
            var errorText = JSON.stringify(apiPostResponse.body.error["message"]);
            console.log("--- Assertion TEXT: " + statusMsg);
            console.log("--- Responce BODY : " + errorText);

            chai.expect(errorText).to.contains(statusMsg);
            console.log("-------------- THE END -------------------")

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(apiPostResponse) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    async requestEditOrganisation(token, EditedField, UpdateMsgCont) {
        console.log("");
        console.log("************ EDITING newly created CHARITY-ORGANISATIONS core details *******************");

        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // STEP-1: Get the OrganisationID from the NEWLY created Organisation
        var externalJSON = await this.readFilesJSON('organisationid.json')
        const savedOrganisationID = JSON.parse(externalJSON); //now it an object

        console.log(">>> Org isUK: " + orgIsUK);
        // console.log(">>> Org isUK TYPE: " + typeof(orgIsUK));
        // console.log(">>> Org name: " + orgName);
      
        var bodyObject;
        // var updatedOrgName = JSON.parse(orgNameRes) + '-UPDATE';

        console.log("---- Org TYPE: " + orgType);

        switch (EditedField) {
            case "isUk":
                if (orgIsUK == 'true' || orgIsUK == true) {
                    bodyObject = {
                        'defra_isuk': false
                    }
                };
                if (orgIsUK == 'false' || orgIsUK == false){
                    bodyObject = {
                        'defra_isuk': true
                    }
                };
                break;
            case "name":
                bodyObject = {
                    'name': `${orgName}-UPDATE`,
                };
                break;
            case "type":
                if (orgType == '910400000') {
                    bodyObject = {
                        'defra_type':  '910400007'
                    }
                };
                if (orgType == '910400007') {
                    bodyObject = {
                        'defra_type':  '910400000'
                    }
                };
                if (orgType == '910400001' || orgType == '910400002') {
                    bodyObject = {
                        'defra_type':  '910400003'
                    }
                };
                if (orgType == '910400003') {
                    bodyObject = {
                        'defra_type':  '910400002'
                    }
                };
                if (orgType == '910400006') {
                    bodyObject = {
                        'defra_type':  '910400004'
                    }
                }
                if (orgType == '910400004') {
                    bodyObject = {
                        'defra_type':  '910400006'
                    }
                };          
                break;
            case "email":
                bodyObject = {
                    'emailaddress1': `${orgEmail}-UPDATE`,
                }
                break;
            default:
                console.log("-- ERROR - INVALIDE data field PASSED !! --");
                break;
        }

        var objKEY = Object.keys(bodyObject);
        console.log(">>>> bodyObject KEY      : " + objKEY);
        console.log(">>>> bodyObject Key VALUE: " + bodyObject[objKEY]);  
        console.log("");

        //options for api response :- need to change postman token so used random 12 digit in the end
        const apiUpdateRequest = {
            method: 'PATCH',
            url: `${configCRM.appUrlCRM}api/data/v9.0/accounts(${savedOrganisationID})`,
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

            body: bodyObject,
            json: true
        };

        //Calling request to return a promise so that it will use the returning values and perform the rest of the assertions/actions
        var updateAPIResponse = await this.initialize(apiUpdateRequest);
        statusCodeVal = updateAPIResponse.statusCode;

        if (statusCodeVal === 200 || statusCodeVal === 201) {
            console.log("status-Code for UPDATING existing Org:", JSON.stringify(updateAPIResponse) && updateAPIResponse.statusCode);
            console.log("TEXT:       " + updateAPIResponse.statusMessage);
            console.log("");
            console.log("Assersion VALUE in Response BODY: " + bodyObject[objKEY]);
            console.log("Response BODY : " + JSON.stringify(updateAPIResponse.body));
            console.log("");

            chai.expect(JSON.stringify(updateAPIResponse.statusMessage)).contains(UpdateMsgCont);
            chai.expect(JSON.stringify(updateAPIResponse.body)).contains(bodyObject[objKEY]);
        }
        else if (statusCodeVal !== 200 || statusCodeVal !== 201) {
            console.log("");
            console.log("status-Code:", JSON.stringify(updateAPIResponse) && updateAPIResponse.statusCode);
            console.log("TEXT:       " + updateAPIResponse.statusMessage);

            console.log("");
            var errorText = JSON.stringify(updateAPIResponse.body.error["message"]);
            console.log("--- Responce  BODY: " + errorText);

            // chai.expect(errorText).contains(statusMsg);

            console.log("");
            console.log("------------ END -------------------")
        }

    }

    //**************USE THIS**********************/
    async requestCreateRelationship(token, ContactType, RoleType, StatusMsgCreate) {

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

        var customerID;
        var organID;

        console.log("");
        console.log("--- Relationship TYPE: " + RoleType);

        var objorgID1 = await this.readFilesJSON('organisationid.json')
        objorgID = JSON.parse(objorgID1); //now it an object
        organID = '/accounts(' + objorgID + ')';
        console.log("--- OrganisationID: " + organID);

        // saving the Contact_ID to an external file depending on the type of Contact i.e. Citizen/Non-Citizen or N+One Contact
        if (ContactType === "Non_Citizen" || ContactType === "Citizen") {
            var custIDObj1 = await this.readFilesJSON('contactid.json')
            custIDObj = JSON.parse(custIDObj1); //now it an object
            customerID = '/contacts(' + custIDObj + ')';
            console.log("--- CustomerID    : " + customerID);
        } else {
            var custIDObj1 = await this.readFilesJSON('contactidNPlusOne.json')
            custIDObj = JSON.parse(custIDObj1); //now it an object
            customerID = '/contacts(' + custIDObj + ')';
            console.log("--- CustomerID:     " + customerID);
        }

        //  if(RoleType === "Empl_Employer" || RoleType === "Agent_AgentCust"){
        //     var custIDObj1 = await this.readFilesJSON('contactid.json')
        //     custIDObj = JSON.parse(custIDObj1); //now it an object
        //     var customerID = '/contacts(' + custIDObj + ')';
        //     console.log("-- CustomerID    : " + customerID );

        //     var objorgID1 = await this.readFilesJSON('organisationid.json')    
        //     objorgID = JSON.parse(objorgID1); //now it an object
        //     var organID = '/accounts(' + objorgID + ')';
        //     console.log("-- OrganisationID: " + organID );
        //  } else {
        //     var custIDObj1 = await this.readFilesJSON('contactid.json')
        //     custIDObj = JSON.parse(custIDObj1); //now it an object
        //     var customerID = '/contacts(' + custIDObj + ')';
        //     console.log("-- CustomerID:     " + customerID );
        //  }

        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = "true";
        var bodyObject;

        console.log("");

        switch (RoleType) {
            case "Empl_Employer":
                console.log("--- Creating a " + RoleType + " Relationship type ---");
                bodyObject = {
                    "record2roleid@odata.bind": "/connectionroles(35A23B91-EC62-41EA-B5E5-C59B689FF0B4)",
                    "record1roleid@odata.bind": "/connectionroles(1EB54AB1-58B7-4D14-BF39-4F3E402616E8)",
                    "record1id_contact@odata.bind": customerID,
                    "record2id_account@odata.bind": organID,
                    "defra_iscustomer": isCust
                };
                break;
            case "Empl_NoTonFrom":
                console.log("--- Creating a " + RoleType + " Relationship type ---");
                bodyObject = {
                    "record2roleid@odata.bind": "/connectionroles()",
                    "record1roleid@odata.bind": "/connectionroles()",
                    "record1id_contact@odata.bind": customerID,
                    "record2id_account@odata.bind": organID,
                    "defra_iscustomer": "true"
                };
                break;
            case "Empl_NoTo":
                console.log("--- Creating a " + RoleType + " Relationship type ---");
                bodyObject = {
                    "record2roleid@odata.bind": "/connectionroles(35A23B91-EC62-41EA-B5E5-C59B689FF0B4)",
                    "record1roleid@odata.bind": "/connectionroles()",
                    "record1id_contact@odata.bind": customerID,
                    "record2id_account@odata.bind": organID,
                    "defra_iscustomer": "true"
                };
                break;
            case "Empl_NoFrom":
                console.log("--- Creating a " + RoleType + " Relationship type ---");
                bodyObject = {
                    "record2roleid@odata.bind": "/connectionroles()",
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
        console.log("RELATIONSHIP statusCode: ", initializePromise && initializePromise.statusCode);
        console.log("RELATIONSHIP TEXT      : " + initializePromise.statusMessage);
        console.log("");

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("");
            console.log("Assertion TEXT: " + StatusMsgCreate);
            console.log("Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            chai.expect(JSON.stringify(initializePromise.body)).to.contain(StatusMsgCreate);

            connectionIDx = JSON.stringify(initializePromise.body["connectionid"]);
            console.log(">>> ConnectionID: " + connectionIDx);

            var connectionDetails = JSON.stringify(initializePromise.body["_defra_connectiondetailsid_value"]);

            if (ContactType == "N_plus_one") {
                fs.writeFile('connectionDetailsNPlusOne.json', connectionDetails, 'utf8', function (err) {
                    if (err) { reject(err); };
                });
            } else {
                fs.writeFile('connectionDetails.json', connectionDetails, 'utf8', function (err) {
                    if (err) { reject(err); };
                });
            }

            console.log("--- connectionDetails : " + connectionDetails);

            console.log("");
            console.log("------------------ The END -------------------")

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {

            console.log('statusCode:' + initializePromise.statusCode);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).to.contain(StatusMsgCreate);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

    }

    async requestDeactivateConnection(token, Statecodex, Statuscodex) {

        let today = new Date().toLocaleString();
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        console.log("");

        var bodyObject;

        const parsedconnectionID = JSON.parse(connectionIDx); //now it an object

        const connectionPostRequest = {
            method: 'POST',                                          
            url: configCRM.appUrlCRM + 'api/data/v9.0/connections(' + parsedconnectionID +')/Microsoft.Dynamics.CRM.defra_deleterelationship',
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

        var deactivationResponce = await this.initialize(connectionPostRequest);
        
        console.log("");

        if (deactivationResponce.statusCode === 200 || deactivationResponce.statusCode === 204) {
            // console.log("Assertion TEXT: " + StatusMsgInactive);
            // console.log("Response Statuscode : " + JSON.stringify(deactivationResponce.statusCode));
            console.log(">>> Connection with ConnectionID: '" + parsedconnectionID + "' De-activated. ");

            chai.expect(JSON.stringify(deactivationResponce.statusCode)).to.contain(204);

        }
        else if (deactivationResponce.statusCode !== 200 || deactivationResponce.statusCode !== 201) {

            console.log('statusCode:' + deactivationResponce.statusCode);
            // console.log("TEXT: " + deactivationResponce.statusMessage);
            // chai.expect(JSON.stringify(deactivationResponce.body.error.message)).to.contain(StatusMsgInactive);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(deactivationResponce) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

        // -------------- GET connection details -----------------

        const apiGetConnectionRequest = {
            method: 'GET',
            url: configCRM.appUrlCRM + 'api/data/v9.0/connections(' + parsedconnectionID + ')',
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

            // body: bodyObjectx,
            json: true
        };

        var connectionResponce = await this.initialize(apiGetConnectionRequest);
        
        console.log("");
        console.log(">>> GETTING Connection details");

        var stateCODE = JSON.stringify(connectionResponce.body["statecode"]);
        var statusCODE = JSON.stringify(connectionResponce.body["statuscode"]);
        var connectionID = connectionResponce.body["connectionid"];
        
        if (connectionResponce.statusCode === 200 || connectionResponce.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("Response Status : " + JSON.stringify(connectionResponce.statusCode));
            console.log("Response Statecode : " + stateCODE);
            console.log("Response Statuscode : " + statusCODE);
            console.log("Response ConnectionID : " + connectionID);
            console.log("");
            console.log("Response BODY : " + JSON.stringify(connectionResponce.body));
            // console.log("Assertion TEXT: " + StatusMsgInactive);
            chai.expect(stateCODE).equals(Statecodex);
            chai.expect(statusCODE).equals(Statuscodex);
            chai.expect(connectionID).equals(parsedconnectionID);

            console.log("");
            console.log("------------------ The END -------------------")

        }
        else if (connectionResponce.statusCode !== 200 || connectionResponce.statusCode !== 201) {

            console.log('statusCode:' + connectionResponce.statusCode);
            // console.log("TEXT: " + deactivationResponce.statusMessage);
            // chai.expect(JSON.stringify(deactivationResponce.body.error.message)).to.contain(StatusMsgInactive);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(connectionResponce) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);



    }

    //**************USE THIS**********************/
    async createAccessRequest(token, LoBService, StatusMsg) {
        var lobserviceid = this.testdata.getLOBserviceID(LoBService);
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
        //  console.log("*** LOB-Service TYPE: " + ServiceRef);
        console.log("*** LOB-Service ID  : " + lobserviceid);

        var custIDObj1 = await this.readFilesJSON('contactidNPlusOne.json')
        custIDObj = JSON.parse(custIDObj1);
        var customerID = custIDObj
        console.log("*** CustomerID      : " + customerID);

        var objorgID1 = await this.readFilesJSON('organisationid.json')
        objorgID = JSON.parse(objorgID1);
        var organID = objorgID;
        console.log("*** OrganisationID  : " + organID);

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");

        bodyObject = {
            "ContactRef": { "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": customerID },
            "OrganisationRef": { "@odata.type": "Microsoft.Dynamics.CRM.account", "accountid": organID },
            "ServiceRef": { "@odata.type": "Microsoft.Dynamics.CRM.defra_lobservice", "defra_lobserviceid": lobserviceid },
            "AcceptOrDeclineUserURL": "https://www.msn.com/?123444444"
        };

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

            var accessRequestID = JSON.stringify(initializePromise.body["defra_accessrequestid"]);
            console.log("--- accessRequestID: " + accessRequestID);

            fs.writeFile('accessRequestID.json', accessRequestID, 'utf8', function (err) {
                if (err) {
                    reject(err);
                };
            });

            // fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
            //     if (err) throw err;
            // });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.statusCode);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).to.contain(StatusMsg);
        }
        else if (error) throw new Error(error);

    }

    //**************USE THIS**********************/
    async accessRequestAction(token, accessAction, StatusMsg) {

        var custIDObj = {
            table: []
        };
        var objorgID = {
            table: []
        };

        console.log("");
        console.log("--- " + accessAction + " Access Request by Org-Admin to an LOB-Service ---");
        console.log("");
        //  console.log("*** LOB-Service TYPE: " + ServiceRef);
        //  console.log("*** LOB-Service ID  : " + lobserviceid);

        var custIDObj1 = await this.readFilesJSON('contactid.json')
        custIDObj = JSON.parse(custIDObj1);
        var customerID = custIDObj
        console.log("*** ADMIN CustomerID  : " + customerID);

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");

        switch (accessAction) {
            case "approve":
                console.log(" ---------------------------------- ");
                bodyObject = {
                    "Processedby": { "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": customerID },
                    "Outcome": 1,
                    "ServiceRoleGranted": true
                };
                break;
            case "reject":
                console.log(" ************************************** ");
                bodyObject = {
                    "Processedby": { "@odata.type": "Microsoft.Dynamics.CRM.contact", "contactid": customerID },
                    "Outcome": 0,
                    "ServiceRoleGranted": false,
                    "AccountDashLink": "https://wwww.live.co.uk"
                };
                break
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        var accessReqID = await this.readFilesJSON('accessRequestID.json')
        console.log("---- Access Request ID-1: " + accessReqID);
        var accessID = accessReqID.replace(/(^"|"$)/g, '');
        var accessConfig = 'api/data/v9.0/defra_accessrequests(' + accessID + ')/Microsoft.Dynamics.CRM.defra_completeaccessrequest';

        console.log("---- appUrlCRM: " + configCRM.appUrlCRM);
        console.log("---- accessConfig:                                                " + accessConfig);
        console.log("---- FULL URL : " + configCRM.appUrlCRM + accessConfig);
        console.log("");
        console.log(" ------------------------------ ");

        const options = {
            method: 'POST',
            // url: configCRM.appUrlCRM + 'api/data/v9.0/defra_createaccessrequest',
            url: configCRM.appUrlCRM + accessConfig,
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

            obj.custID.push({ id: contactID });
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
    async requestCreateIDMEnrolment(token, ContactType, IDMServcie, StatusMsgIDMService) {

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

        var customerID;
        var organID;
        var connectionDetails;

        console.log("");

        // getting the ContactID from the contactid.json file
        if (ContactType === "N_plus_one") {
            var custIDObj1 = await this.readFilesJSON('contactidNPlusOne.json');
            custIDObj = JSON.parse(custIDObj1);
            customerID = '/contacts(' + custIDObj + ')';
            console.log("--- CustomerID: " + customerID);
        }
        else {
            var custIDObj1 = await this.readFilesJSON('contactid.json');
            custIDObj = JSON.parse(custIDObj1);
            customerID = '/contacts(' + custIDObj + ')';
            console.log("--- CustomerID: " + customerID);
        }

        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json');
        objorgID = JSON.parse(objorgID1);
        organID = '/accounts(' + objorgID + ')';
        console.log("--- OrganisationID   : " + organID);

        // getting the connnectionDetails from the connnectionDetails.json file 
        if (ContactType === "N_plus_one") {
            var connObjID1 = await this.readFilesJSON('connectionDetailsNPlusOne.json');
            connObjID = JSON.parse(connObjID1);
            connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
            console.log("--- ConnectionDetails  : " + connectionDetails);
        }
        else {
            var connObjID1 = await this.readFilesJSON('connectionDetails.json');
            connObjID = JSON.parse(connObjID1);
            connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
            console.log("--- ConnectionDetails  : " + connectionDetails);
        }

        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // var isCust = true;
        var bodyObject;
        console.log("");

        switch (IDMServcie) {
            case "Standared-User":
                console.log("---  TESTING IDM-ENROLEMENT as a Standard-User ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(5A90DD44-DD9B-E811-A94F-000D3A3A8543)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(18d5908c-dd9b-e811-a94f-000d3a3a8543)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "Admin-User":
                console.log("---  TESTING IDM-ENROLEMENT as an Admin-User ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(5A90DD44-DD9B-E811-A94F-000D3A3A8543)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(A3217E78-DD9B-E811-A94F-000D3A3A8543)",
                    "defra_enrolmentstatus": 3,
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
        console.log("IDM-ENROLEMENT statusCode    : ", initializePromise && initializePromise.statusCode);
        console.log("IDM_ENROLEMENT response-TEXT : " + initializePromise.statusMessage);
        console.log("");

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("--- Assertion TEXT: " + StatusMsgIDMService);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            let lobservicelinkid = JSON.stringify(initializePromise.body["defra_lobserviceuserlinkid"]);
            console.log("--- LOB Service link-ID : " + lobservicelinkid);

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgIDMService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);
            console.log("");
            console.log("--- Assertion TEXT: " + StatusMsgIDMService);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body.error.message));
            console.log("");

            chai.expect(JSON.stringify(initializePromise.body.error.message)).contain(StatusMsgIDMService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

        console.log("----------------- The END -------------------------");

    }

    //**************USE THIS**********************/
    async requestCreateHandshake(token, DefraService, StatusMsgDefraService) {
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
        console.log("--- CustomerID: " + customerID);

        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json');
        objorgID = JSON.parse(objorgID1);
        var organID = '/accounts(' + objorgID + ')';
        console.log("--- OrganisationID   : " + organID);

        // getting the connnectionDetails from the connnectionDetails.json file    
        var connObjID1 = await this.readFilesJSON('connectionDetails.json');
        connObjID = JSON.parse(connObjID1);
        var connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
        console.log("--- ConnectionDetails  : " + connectionDetails);

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // var isCust = true;
        var bodyObject;
        console.log("");

        switch (DefraService) {
            case "":
                console.log("---  TESTING Handshake to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(b8717ec3-66b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "VMD_Secure_Msg":
                console.log("---  TESTING Handshake to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a99fcef9-66b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "FishExports":
                console.log("---  TESTING Handshake to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(b8717ec3-66b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "PlantsCompleteApproved":
                console.log("---  TESTING Handshake for a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a4d44b69-6bf2-ea11-a815-000d3ab4653d)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "PlantsPendingorIncompleteEnrolment":
                console.log("---  TESTING Handshake to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a4d44b69-6bf2-ea11-a815-000d3ab4653d)",
                    "defra_enrolmentstatus": 1,
                };
                break;
            case "VMD_Reporing":
                console.log("---  TESTING Handshake to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(39c4599e-27de-e811-a842-000d3ab4f534)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "IMP_Notification":
                console.log("---  TESTING Handshake to an " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "IMP_Veterinarian":
                console.log("---  TESTING Handshake to an " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "VMD_Missing_Connect":
                console.log("---  TESTING Handshake with " + DefraService + " ---");
                bodyObject = {
                    // "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
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
        console.log("Handshake statusCode    : ", initializePromise && initializePromise.statusCode);
        console.log("Handshake response-TEXT : " + initializePromise.statusMessage);
        console.log("");

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("--- Assertion TEXT: " + StatusMsgDefraService);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            let lobservicelinkid = JSON.stringify(initializePromise.body["defra_lobserviceuserlinkid"]);
            console.log("--- LOB Service link-ID : " + lobservicelinkid);

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgDefraService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).contain(StatusMsgDefraService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

        console.log("------------ The END ---------------------")

    }

    //

    async requestEnrolmentRequest(token, DefraService, StatusMsgDefraService) {
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
        console.log("--- CustomerID: " + customerID);

        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json');
        objorgID = JSON.parse(objorgID1);
        var organID = '/accounts(' + objorgID + ')';
        console.log("--- OrganisationID   : " + organID);

        // getting the connnectionDetails from the connnectionDetails.json file    
        var connObjID1 = await this.readFilesJSON('connectionDetails.json');
        connObjID = JSON.parse(connObjID1);
        var connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
        console.log("--- ConnectionDetails  : " + connectionDetails);

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        // var isCust = true;
        var bodyObject;
        console.log("");

        switch (DefraService) {
            case "VMD_Licencing":
                console.log("---  TESTING Enrolment Request to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a65e89e7-66b6-e811-a954-000d3a29b5de)",
                };
                break;
            case "VMD_Secure_Msg":
                console.log("---  TESTING Enrolment Request to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a99fcef9-66b6-e811-a954-000d3a29b5de)",
                };
                break;
            case "VMD_Reporing":
                console.log("---  TESTING Enrolment Request to a " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(39c4599e-27de-e811-a842-000d3ab4f534)",
                };
                break;
            case "IMP_Notification":
                console.log("---  TESTING Enrolment Request to an " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                };
                break;
            case "IMP_Veterinarian":
                console.log("---  TESTING Enrolment Request to an " + DefraService + " service ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                };
                break;
            case "VMD_Missing_Connect":
                console.log("---  TESTING Enrolment Request with " + DefraService + " ---");
                bodyObject = {
                    // "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                };
                break;
            case "FishExports":
                console.log("---  TESTING ENROLEMENT using FISH EXPORTS 'FishExports Service' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(b8717ec3-66b6-e811-a954-000d3a29b5de)",
                };
                break;
            case "PlantsCompleteApproved":
                console.log("---  TESTING ENROLEMENT using PLANTS 'PLANTS Service' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a4d44b69-6bf2-ea11-a815-000d3ab4653d)",
                };
                break;
            case "PlantsPendingorIncompleteEnrolment":
                console.log("---  TESTING ENROLEMENT using PLANTS 'PLANTS Service' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_serviceuser@odata.bind": customerID,
                    "defra_organisation@odata.bind": organID,
                    "defra_service@odata.bind": "/defra_lobservices(a4d44b69-6bf2-ea11-a815-000d3ab4653d)",
                };
                break;
            default:
                console.log("Invalide data TYPE !!");
                break;
        }

        const options = {
            method: 'POST',
            url: configCRM.appUrlCRM + 'api/data/v9.0/defra_lobserviceuserlinkrequests',
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
        console.log("Enrolment Request statusCode    : ", initializePromise && initializePromise.statusCode);
        console.log("HandsEnrolment Requesthake response-TEXT : " + initializePromise.statusMessage);
        console.log("");

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("--- Assertion TEXT: " + StatusMsgDefraService);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            let lobservicelinkid = JSON.stringify(initializePromise.body["defra_lobserviceuserlinkid"]);
            console.log("--- LOB Service link-ID : " + lobservicelinkid);

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgDefraService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).contain(StatusMsgDefraService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });
        }
        else if (error) throw new Error(error);

        console.log("------------ The END ---------------------")

    }

    //**************USE THIS**********************/
    async requestCreateEnrolement(token, ServAndServRole, StatusMsgService) {
        console.log("--------- Enroling to an LoB-Service -------------------")

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
        console.log("--- customerID: " + customerID);

        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json');
        objorgID = JSON.parse(objorgID1);
        var organID = '/accounts(' + objorgID + ')';
        console.log("--- organID   : " + organID);

        // getting the connnectionDetails from the connnectionDetails.json file    
        var connObjID1 = await this.readFilesJSON('connectionDetails.json');
        connObjID = JSON.parse(connObjID1);
        var connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
        console.log("--- enroleID  : " + connectionDetails);

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var bodyObject;
        console.log("");

        switch (ServAndServRole) {
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(3c669b52-71b6-e811-a954-000d3a29b5de)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(3015249a-c1cc-e811-a95b-000d3a29ba60)",
                    "defra_enrolmentstatus": 2,
                };
                break;
            case "ImpNotification":
                console.log("---  TESTING ENROLEMENT using Imports-Service 'Notification' AND ServiceRole 'Standard User' ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(29072a8c-73b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "ImpVeterinarian":
                console.log("---  TESTING ENROLEMENT using Imports-Service 'Veterinarian' AND ServiceRole 'Standard User' ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_service@odata.bind": "/defra_lobservices(8b5214ee-62b6-e811-a954-000d3a29b5de)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(55b25c28-ce02-e911-a847-000d3ab4ffef)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "IDM-Identity":
                console.log("---  TESTING ENROLEMENT using VMD-Service 'IDM-Identity' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_service@odata.bind": "/defra_lobservices(5A90DD44-DD9B-E811-A94F-000D3A3A8543)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(A3217E78-DD9B-E811-A94F-000D3A3A8543)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(f830c35e-71b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 2,
                };
                break;
            case "FishExports":
                console.log("---  TESTING ENROLEMENT using FISH EXPORTS 'FishExports Service' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_service@odata.bind": "/defra_lobservices(b8717ec3-66b6-e811-a954-000d3a29b5de)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(23016fc5-7acc-e811-a95b-000d3a29ba60)",
                    "defra_enrolmentstatus": 2,
                };
                break;
            case "PlantsCompleteApproved":
                console.log("---  TESTING ENROLEMENT using PLANTS 'PLANTS Service' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_service@odata.bind": "/defra_lobservices(a4d44b69-6bf2-ea11-a815-000d3ab4653d)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(f2a8f026-6df2-ea11-a815-000d3ab4653d)",
                    "defra_enrolmentstatus": 3,
                };
                break;
            case "PlantsPendingorIncompleteEnrolment":
                console.log("---  TESTING ENROLEMENT using PLANTS 'PLANTS Service' AND ServiceRole 'Admin' ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_service@odata.bind": "/defra_lobservices(a4d44b69-6bf2-ea11-a815-000d3ab4653d)",
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(f2a8f026-6df2-ea11-a815-000d3ab4653d)",
                    "defra_enrolmentstatus": 1,
                };
                break;
            case "ServiceRoleOnly":
                console.log("---  TESTING ENROLEMENT using VMD 'Apply to Licence'- Service-Role ONLY ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
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
        console.log("Service ENROLEMENT statusCode    : ", initializePromise && initializePromise.statusCode);
        console.log("Service ENROLEMENT response-TEXT : " + initializePromise.statusMessage);
        console.log("");

        if (initializePromise.statusCode === 200 || initializePromise.statusCode === 201) {
            //let responseData = JSON.parse(initializePromise.body);
            console.log("");
            console.log("--- Assertion TEXT: " + StatusMsgService);
            console.log("--- Response BODY : " + JSON.stringify(initializePromise.body));
            console.log("");

            let lobservicelinkid = JSON.stringify(initializePromise.body["defra_lobserviceuserlinkid"]);
            console.log("--- LOB Service link-ID : " + lobservicelinkid);

            chai.expect(JSON.stringify(initializePromise.body)).contain(StatusMsgService);

            fs.appendFileSync('CRM Logs.txt', '\n' + today + JSON.stringify(initializePromise) + '\n' + '------------------------', function (err) {
                if (err) throw err;
            });

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).contain(StatusMsgService);

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
        console.log("-- customerID: " + customerID);

        // getting the organisationID from the organisationid.json file
        var objorgID1 = await this.readFilesJSON('organisationid.json');
        objorgID = JSON.parse(objorgID1);
        var organID = '/accounts(' + objorgID + ')';
        console.log("-- organID   : " + organID);

        // getting the connnectionDetails from the connnectionDetails.json file    
        var connObjID1 = await this.readFilesJSON('connectionDetails.json');
        connObjID = JSON.parse(connObjID1);
        var connectionDetails = '/defra_connectiondetailses(' + connObjID + ')';
        console.log("-- enroleID  : " + connectionDetails);

        //var oRg1 = await this.readFiles(fileNameOrg);
        const val = Math.floor(Math.pow(10, 12 - 1) + Math.random() * (Math.pow(10, 12) - Math.pow(10, 12 - 1) - 1));

        var isCust = true;
        var bodyObject;

        console.log("");

        switch (ServAndServRole) {
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(3c669b52-71b6-e811-a954-000d3a29b5de)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(3015249a-c1cc-e811-a95b-000d3a29ba60)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(A3217E78-DD9B-E811-A94F-000D3A3A8543)",
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
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(f830c35e-71b6-e811-a954-000d3a29b5de)",
                    "defra_enrolmentstatus": 2,
                };
                break;
            case "ServiceRoleOnly":
                console.log("---  TESTING ENROLEMENT using VMD 'Apply to Licence'-ServiceRole ONLY ---");
                bodyObject = {
                    "defra_ServiceUser@odata.bind": customerID,
                    "defra_Organisation@odata.bind": organID,
                    "defra_connectiondetail@odata.bind": connectionDetails,
                    "defra_ServiceRole@odata.bind": "/defra_lobserivceroles(0dee7d46-71b6-e811-a954-000d3a29b5de)",
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
        console.log("-- Inviters Customer-ID:     " + custID);

        var orgIDObj1 = await this.readFilesJSON('organisationid.json')
        var orgID = JSON.parse(orgIDObj1); //now it an object
        // var organID = '/accounts(' + objorgID + ')';
        console.log("-- Inviters Organisation-ID: " + orgID);

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
                'RegardingOrganisationRef': { '@odata.type': 'Microsoft.Dynamics.CRM.account', 'accountid': orgID },
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

            chai.expect(JSON.stringify(initializePromise.body)).to.not.contain(StatusMsgCreate);

        }
        else if (initializePromise.statusCode !== 200 || initializePromise.statusCode !== 201) {
            console.log('statusCode:' + initializePromise.body.error.message);
            console.log("TEXT: " + initializePromise.statusMessage);

            chai.expect(JSON.stringify(initializePromise.body.error.message)).to.not.contain(StatusMsgCreate);

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
