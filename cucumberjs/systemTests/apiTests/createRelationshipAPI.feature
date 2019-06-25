Feature: CREATE RELATIONSHIP - AS a Web API User

  I want to be able to call the defra_relationship endpoint

  SO that I can develop relationships between D365 records (Contact & Organisations)

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

  @api2-Done
  Scenario Outline: Creating a <RoleType> Relationship
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsgCont>
    When I send an API request to create a new <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra relationship action with <StatusMsgCreate> <RoleType>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | OrgType | ValidationType | StatusMsgCont                     | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    |
      | LTD     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) |
      | LTD     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) |
      | PLC     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) |
      | PLC     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) |
      | LLP     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) |
      | LLP     | BasicContact   | (contactid,defra_uniquereference) | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) |


@api2-Done
  Scenario Outline: Creating a <RoleType> Relationship
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsgCont>
    When I call defra relationship action with <StatusMsgCreate> <RoleType>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | ValidationType      | StatusMsgCont                     | RoleType | StatusMsgCreate                    |
      | BasicContactCitizen | (contactid,defra_uniquereference) | Citizen  | (_defra_connectiondetailsid_value) |
   