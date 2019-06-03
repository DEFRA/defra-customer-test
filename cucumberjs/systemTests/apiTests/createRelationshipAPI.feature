Feature: CREATE RELATIONSHIP - AS a Web API User

  I want to be able to call the defra_relationship endpoint

  SO that I can develop relationships between D365 records (Contact & Organisations)

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

  @api2-Done
  Scenario Outline: Creating Relationship - NON-CITIZEN
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | ContactType     |
      | BasicContact   | error           | BasicOrgDetails   | NonCitizenEmpl  |
      | BasicContact   | error           | BasicOrgDetails   | NonCitizenAgent |

@api2-Done
  Scenario Outline: Creating Relationship - CITIZEN
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | ValidationType      | StatusMsgCreate | ContactType |
      | BasicContactCitizen | error           | Citizen     |
   