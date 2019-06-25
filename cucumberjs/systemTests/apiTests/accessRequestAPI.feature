Feature: Create ACCESS REQUEST via the Web API
I want to be able to call the defra_createaccessrequest endpoint
So that I can create an Access request bewtween a Contact and an LOB service

 @api2-DoneZZ
 Scenario Outline: Creating Access request between a Contact and an LOB-service
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I create access request using <SearchRef> for Contact to <ServiceRef> with no <StatusMsgCreate>
    Examples:
      | ValidationType | StatusMsgCreate | ValidationTypeOrg | ServiceRef       | SearchRef |
      | BasicContact   | error           | BasicOrgDetails   | VMD-licencing    | All-refs  |
      | BasicContact   | error           | BasicOrgDetails   | VMD-AdverseEvent | All-refs  |
      | BasicContact   | error           | BasicOrgDetails   | VMD-SecureMsg    | All-refs  |


 @api2-DoneZZ
 Scenario Outline: Creating Access request between a Contact and an LOB-service, with missing <>
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I create access request using <SearchRef> for Contact to <ServiceRef> with no <StatusMsgCreate>
    # When I create a <SearchRef> access request for Contact to <ServiceRef> with no <StatusMsgError>
    Examples:
      | ValidationType  | StatusMsgCreate | ValidationTypeOrg | ServiceRef    | SearchRef         |
      | BasicContact    | error           | BasicOrgDetails   | VMD-licencing | No-Contact-ref    |
      | BasicContact    | error           | BasicOrgDetails   | VMD-licencing | No-Org-ref        |
      | BasicContact    | error           | BasicOrgDetails   | VMD-licencing | No-ContAndOrg-ref |
      | BasicContact    | error           | BasicOrgDetails   | VMD-licencing | No-servicer-ref   |