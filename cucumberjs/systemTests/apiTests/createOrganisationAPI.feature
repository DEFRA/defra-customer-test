Feature: AS a Web API User

  I want to be able to consume the D365 WebAPI Actions

  SO that I can create an organisation record in D365 Customer Master.

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

  @api
  Scenario Outline: Web API User creates a new Organisation
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    Examples:
      | ValidationType        | StatusMsg                                                                              |
      | BasicOrganisationTest | \"status\":\"success\",\"code\":200,\"message\":\"\"}"}                             |
# Then a new Organisation record is created

  @api
  Scenario Outline: Web API User creates a new Organisation using a CRN which already exists
    # Given I am a Web API user
    When I create a new <ValidationTypeDup> organisation with <StatusMsgDup> for duplication check
    Examples:
      | ValidationTypeDup        | StatusMsgDup                                                                              |
      | DuplicateCRNCheck      | \\"status\\":\\"failure\\",\\"code\\":412,\\"message\\":\\"Company house id already exists.;\\ |
# Then a new Organisation record is NOT created

