Feature: AS a Web API User

I want to be able to call the defra_relationship endpoint

SO that I can develop relationships between D365 records (Contact & Organisations)

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

  @api2
  Scenario Outline: Create Relationship - Point to Point integration via direct API calls (Contact to Organisation)
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I call defra relationship action <ValidationType> with <StatusMsg>
    Examples:
      | StatusMsg        | 
      |  \"status\":\"success\",\"code\":200,\"message\":\"\"}"}  | 
    #Then I should be able to create the requested relationship for the records in context 

  