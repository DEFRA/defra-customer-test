@Regression-Test
Feature:  INITIAL MATCH -CIDM-858 As a Web API User
As an external API user 
I want to be able to consume the D365 WebAPI Actions
So that I can read initial match in D365 Customer Master using contact b2c objectid

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
        @api2-Done @smoke-Test @initialmatch1

        Scenario Outline: GET Initial Match response with ContactB2CObjectID on SYSTEST
    # Given I am a Web API user
             When I call Initial Match API request with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be retrieved successfully
        Examples:
                  | ValidationType            | StatusMsgCont                                                        |
                  | ValidB2CObjID           | "{\"contactid\":\"5f73fbb9-d04f-e911-a969-000d3a28d1a0\",\"defra_uniquereference\":\"BA201911-N1-0903-L0-2614\",\"securityWordSet\":false,\"errorCode\":200,\"errorMsg\":null}"                                    |
                  | MissingB2CObjID           | "{\\"contactid\\":null,\\"defra_uniquereference\\":null,\\"securityWordSet\\":false,\\"errorCode\\":204,\\"errorMsg\\":\\"No Content\\"}"         |
                  | NoB2CObjID              | "{\\"contactid\\":null,\\"defra_uniquereference\\":null,\\"securityWordSet\\":false,\\"errorCode\\":400,\\"errorMsg\\":\\"B2CObjectid is invalid\\"}"       |
                  | SecureDetailsSet           | "{\"contactid\":\"951bf7ee-b4af-ea11-a812-000d3a2109c9\",\"defra_uniquereference\":\"BA202010-S6-3706-T7-1609\",\"securityWordSet\":true,\"errorCode\":200,\"errorMsg\":null}"                                    |
                  | SecureDetailsNotSet           | "{\"contactid\":\"73b5c8f0-b5af-ea11-a812-000d3a2109c9\",\"defra_uniquereference\":\"BA202021-Z6-4406-T7-1609\",\"securityWordSet\":false,\"errorCode\":200,\"errorMsg\":null}"                                    |


  
    