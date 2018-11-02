//import { stringify } from "querystring";

const World = require("../support/world").World;
const config = require("../../../../configCRM").configCRM;
const Assert = require("assert");
const request = require("request");
const chai = require("chai");

module.exports = function () {

    this.World = World;

    this.defineStep(/^the user creates a contact$/, { timeout: 2000000 }, async function () {

        //generate token
        const token = await this.activeDirectoryAuthService.getToken();

        const result = await this.activeDirectoryAuthService.sendRequest(token);

        request(result, function (error, response, body) {
            if(response.statusCode === 200) {
                console.log('statusCode:', response && response.statusCode); 
                console.log("TEXT:-"+response.statusMessage);
                console.log(JSON.stringify(response));
                chai.expect(JSON.stringify(response)).to.contain('"status\\":\\"success\\",\\"code\\":200,\\"message\\":\\"\\"}"');
            }  
            if(response.statusCode !== 200) {
                console.log('statusCode:', response && response.statusCode); 
                console.log("TEXT:-"+response.statusMessage);
                console.log(JSON.stringify(response));
            }          
            if (error) throw new Error(error);


        });


    });


};