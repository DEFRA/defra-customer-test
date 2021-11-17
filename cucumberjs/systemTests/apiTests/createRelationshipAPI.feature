@Regression-Test
Feature: CREATE RELATIONSHIP - AS a Web API User
  As an external API user 
  I want to be able to call the defra_relationship endpoint
  So that I can develop Relationships between D365 records (Contact & Organisations)

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

  @api2-Done @smoke-Test
  Scenario Outline: Creating a <RoleType> Relationship
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a NEW <isUK> <OrgType> <OrgProperty> Organisation then I expect <StatusMsgOrg>
    # When I call defra Relationship action with <RoleType> and returned <StatusMsgCreate> 
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | isUK | ContactType | ValidationType | StatusMsgCont                     |OrgType | OrgProperty | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    |
      | true | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) |LTD     | Basic_Org   | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) |
      | true | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) |LTD     | Basic_Org   | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) |
      | true | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) |PLC     | Basic_Org   | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) |
    

 
@api2-Done @smoke-Test
  Scenario Outline: Creating a <RoleType> Relationship
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # When I call defra Relationship action with <RoleType> and returned <StatusMsgCreate> 
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | ContactType| ValidationType      | StatusMsgCont                     | RoleType | StatusMsgCreate                    |
      | Citizen    | BasicContactCitizen | (contactid,defra_uniquereference) | Citizen  | (_defra_connectiondetailsid_value) |
   
  @api2-Done @smoke-Testxx
  Scenario Outline: De-activate the <RoleType> Connection
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a NEW <isUK> <OrgType> <OrgProperty> Organisation then I expect <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Deactivate the Connection then I expect <Statecode> <Statuscode>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | isUK | ContactType | ValidationType      | StatusMsgCont                     |OrgType | OrgProperty | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | Statecode |Statuscode |
      | true | Non_Citizen | BasicContact        | (contactid,defra_uniquereference) |LTD     | Basic_Org   | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | 1         | 2         |
      | true | Non_Citizen | BasicContact        | (contactid,defra_uniquereference) |LTD     | Basic_Org   | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) | 1         | 2         |
      | true | Citizen     | BasicContactCitizen | (contactid,defra_uniquereference) | LTD    | Basic_Org   | (accountid,defra_uniquereference) | Citizen         | (_defra_connectiondetailsid_value) | 1         | 2         |
