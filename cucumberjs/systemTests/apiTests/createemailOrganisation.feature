Feature: CREATE EMAIL - ORGANISATION- AS a Web API User

I want to be able to call the defra_createemail endpoint for an organisation

SO that I can create additional emails for an organisation in dynamics

  Acceptance Criteria:
  The D365 WebAPI defra_createemail action can be called for an organisation using the Microsoft provided guidelines

  @api
  Scenario Outline: Create addional email -Success-Point to Point integration via direct API calls
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I call defra createemail for an organisation success action with <StatusMsg>
    Examples:
      | StatusMsg        | 
      |  \"status\":\"success\",\"code\":200,\"message\":\"\"}"}  | 
    #Then I should be able to create an additional address for an organisation 

  @api
  Scenario Outline: Create addional email -Failure1-Point to Point integration via direct API calls
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I call defra createemail action for an organisation with no email with <StatusMsg>
    Examples:
      | StatusMsg        | 
      |  \message: 'Please provide valid Email Address in the Email'\  | 
    #Then I should be able to receive a validaton error regarding email 
