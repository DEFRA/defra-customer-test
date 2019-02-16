Feature: CREATE ENROLMENT via the Web API

I want to be able to call the defra_createEnrolment endpoint

So that I can create an Enrolment between an Organisation and a Defra service

  Acceptance Criteria:
  
  @api2-Done
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - Service ONLY
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate>
    When I call defra <Service> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | Service     |
      | BasicContact   | error           | BasicOrgDetails   | ServiceOnly |
      # | BasicContact   | error           | BasicOrgDetails   | ServiceAndServiceRole |
      # | BasicContact   | error           | BasicOrgDetails   | ServiceRoleOnly |
   
 @api2-Done
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - Service and ServiceRole
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate>
    When I call defra <Service> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | Service               |
      | BasicContact   | error           | BasicOrgDetails   | ServiceAndServiceRole |
   
  @api2-Done
  Scenario Outline: Enroling an Organisation/Contact to a defra service using - ServiceRole ONLY
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate>
    When I call defra <Service> enrolement action with <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | Service         |
      | BasicContact   | error           | BasicOrgDetails   | ServiceRoleOnly |