if (process.argv.includes("--runlocal")) {
  module.exports.configCRM = {
    appUrlCRM: 'https://defra-custmstr-test.api.crm4.dynamics.com/',
    authorityURL: 'https://login.microsoftonline.com/6f504113-6b64-43f2-ade9-242e05780007/oauth2/token',
    resource: 'https://defra-custmstr-test.api.crm4.dynamics.com/',
    clientID: '0d0eef32-8078-4209-82f5-d91ac90f694a',
    postmantoken: '79027737-fb75-4634-a162-379f5eb9cdf4',
    authorityHostUrl: 'https://login.microsoftonline.com',
    tenant: 'defradev.onmicrosoft.com',
    clientSecret: 'RRGGWNtbGVbLIPDS4qGbjpRuPEU02x5BScPqplNVTzk=',
    loadChromeNmpExtension: false
  }
}
else {
  module.exports.configCRM = {
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
}