const fs = require('fs')
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) { throw result.error; }
const { parsed: config } = result;

var crmConfig = {}

if (config.RUN_LOCAL.toLowerCase() == "true") {
  const envConfig = dotenv.parse(fs.readFileSync(config.ENV_CONFIG))
  if (envConfig.error) {
    throw envConfig.error;
  }
  console.log("loaded " + envConfig.NODE_ENV + " config")
  crmConfig = {
    appUrlCRM: envConfig.appUrlCRM,
    authorityURL: envConfig.authorityURL,
    resource: envConfig.resource,
    clientID: envConfig.clientID,
    postmantoken: envConfig.postmantoken,
    authorityHostUrl: envConfig.authorityHostUrl,
    tenant: envConfig.tenant,
    clientSecret: envConfig.clientSecret,
    loadChromeNmpExtension: false
  }
}
else {
  crmConfig = {
    appUrlCRM: '#{appUrlCRM}#',
    authorityURL: '#{authorityURL}#',
    resource: '#{resource}#',
    clientID: '#{clientID}#',
    postmantoken: '#{postmantoken}#',
    authorityHostUrl: '#{authorityHostUrl}#',
    tenant: '#{tenant}#',
    clientSecret: '#{clientSecret}#',
    loadChromeNmpExtension: false
  }

  console.log("loaded tokenised config for " + crmConfig.appUrlCRM)
}

module.exports.configCRM = crmConfig