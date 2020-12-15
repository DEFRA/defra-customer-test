@Regression-Test
Feature:  AUTHZ -CIDM-859 As a Web API User
As an external API user 
I want to be able to consume the D365 WebAPI Actions
So that I can read all Active Service Enrolments for a Contact match in D365 Customer Master using contact b2c objectid and ServiceID

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
        @api2-Done @smoke-Test @AuthZ
        Scenario Outline: GET AUTHZ response with ContactB2CObjectID and ServiceID on SYSTEST
    # Given I am a Web API user
             When I call AUTHZ API request with <ValidationType1> and <ValidationType2> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
        Examples:
                  | ValidationType1            |  ValidationType2            | StatusMsgCont                                                        |
                  | ValidB2CObjID           |        ValidServiceID           | {\"version\":\"1.0\",\"status\":200,\"message\":\"Success!\",\"roles\":[\"4bf8ae9b-8188-ea11-a812-000d3a20f3f8:e46b89c2-cd02-e911-a847-000d3ab4ffef:1\",\"4bf8ae9b-8188-ea11-a812-000d3a20f3f8:29072a8c-73b6-e811-a954-000d3a29b5de:2\"],\"mappings\":[\"4bf8ae9b-8188-ea11-a812-000d3a20f3f8:2 LEEP NETWORKS (WATER) LIMITED\",\"e46b89c2-cd02-e911-a847-000d3ab4ffef:Inspector\",\"1:Incomplete\",\"29072a8c-73b6-e811-a954-000d3a29b5de:Notifier\",\"2:Pending\"]}                          |