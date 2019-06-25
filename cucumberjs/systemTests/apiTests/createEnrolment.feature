Feature: CREATE ENROLMENT via the Web API

I want to be able to call the defra_createEnrolment endpoint

So that I can create an Enrolment between an Organisation and a Defra service

  Acceptance Criteria:

  @api2-Done
  Scenario Outline: Enroling a Contact and a <OrgType> Organisation to a defra service using - SERVICE AND SERVICE-ROLE
    # Given I am a Web API user 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCont>
    When I send an API request to create a new <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When I call defra <ServAndServRole> enrolement action with <StatusMsgService >
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | OrgType | ValidationType | StatusMsgCont                     | ValidationTypeOrg | StatusMsgOrg                      | ContactType     | StatusMsgCreate                    | ServAndServRole  | StatusMsgService |
      | LTD     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | NonCitizenEmpl  | (_defra_connectiondetailsid_value) | VMDAppLicence    | NonCitizenAgent  |
      | PLC     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | NonCitizenEmpl  | (_defra_connectiondetailsid_value) | VMDReportAdverse | NonCitizenEmpl   |
      | LLP     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | NonCitizenEmpl  | (_defra_connectiondetailsid_value) | VMDSecureMang    | NonCitizenAgent  |
      | LTD     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | NonCitizenEmpl  | (_defra_connectiondetailsid_value) | IDM-Identity     | NonCitizenAgent  |
  
  
  @api2-xx
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - SERVICEROLE ONLY
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When I call defra <Service> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | Service         | ContactType  |
      | BasicContact   | error           | BasicOrgDetails   | ServiceRoleOnly | NonCitizen   |
      
  @api2-xx
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - SERVICE ONLY
    # Given I am a Web API user 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    # When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I send an API request to create a new <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When I call defra <Service> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | OrgType| ValidationType | StatusMsgCreate | ValidationTypeOrg | Service     | ContactType  |
      | LTD    | BasicContact   | error           | BasicOrgDetails   | ServiceOnly | NonCitizen   |