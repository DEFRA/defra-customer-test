Feature: CREATE ENROLMENT via the Web API

I want to be able to call the defra_createEnrolment endpoint

So that I can create an Enrolment between an Organisation and a Defra service

  Acceptance Criteria:
  
  @api2-??
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - SERVICE ONLY
    # Given I am a Web API user 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When I call defra <Service> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | Service     | ContactType  |
      | BasicContact   | error           | BasicOrgDetails   | ServiceOnly | NonCitizen   |
   
 @api2-Done
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - SERVICE AND SERVICEROLE
    # Given I am a Web API user 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When I call defra <ServAndServRole> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | ServAndServRole  | ContactType  |
      | BasicContact   | error           | BasicOrgDetails   | VMDAppLicence    | NonCitizen   |
      | BasicContact   | error           | BasicOrgDetails   | VMDReportAdverse | NonCitizen   |
      | BasicContact   | error           | BasicOrgDetails   | VMDSecureMang    | NonCitizen   |
      | BasicContact   | error           | BasicOrgDetails   | IDM-Identity     | NonCitizen   |
      | BasicContact   | error           | BasicOrgDetails   | EXP-SERVICE      | NonCitizen   |
   
  @api2-Done
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