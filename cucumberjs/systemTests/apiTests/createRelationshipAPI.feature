Feature: CREATE RELATIONSHIP - AS a Web API User

  I want to be able to call the defra_relationship endpoint

  SO that I can develop relationships between D365 records (Contact & Organisations)

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

  @api2-Done
  Scenario Outline: Create Relationship -Success-Point to Point integration via direct API calls (Contact to Organisation)
    # Given I am a Web API user
    # When I create a new <ValidationCont> with expected message outcome <StatusCont>
    # When I send an API request to create a new <ValidationOrg> organisation with <StatusOrg>
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I call defra relationship action with <StatusMsgCreate>
    #When I call defra relationship action with <StatusMsg>
    #Then I should be able to create the requested relationship for the records in context
    Examples:
      | ValidationType | StatusMsgCreate | StatusMsg    | ValidationTypeOrg |
      | BasicContact   | error           | BasicContact | BasicOrgDetails   |


  @apixx
  Scenario Outline: Create Relationship-Failure - Point to Point integration via direct API calls (Contact to Organisation)
    # Given I am a Web API user
    # And I have created a post request payload in JSON format
    When I call defra relationship action an existing contact organisation relationship with <StatusMsg>
    Examples:
      | StatusMsg                                                                      |
      | \"status\":\"success\",\"code\":412,\"message\":\"Connection already exists\"} |
#Then I should be NOT be able to create the duplicate relationship for the records in context