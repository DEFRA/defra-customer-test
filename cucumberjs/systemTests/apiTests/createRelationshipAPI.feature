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
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    # When I call defra Relationship action with <RoleType> and returned <StatusMsgCreate> 
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | isUK | ContactType | ValidationType | StatusMsgCont                     |OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    |
      | true | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) |LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) |
      | true | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) |LTD     | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) |
     
