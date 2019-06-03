# Feature: CREATE ENROLMENT via the Web API
# I want to be able to call the defra_createEnrolment endpoint
# So that I can create an Enrolment between an Organisation and a Defra service

#  @api2-Donezx
#   Scenario Outline: Enroling an Organisation/Contact to a defra service using - Service and ServiceRole
#     # Given I am a Web API user 
#     # And I have created a post request payload in JSON format 
#     When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
#     When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
#     When I call defra relationship action with <StatusMsgCreate> <ContactType>
#     When I enrole as an IDM-Admin
#     When I create a handshake to a <ServiceName>
#     When I call defra <ServAndServRole> enrolement action with <StatusMsgCreate>
#     #-----Then I should be able to create the requested relationship for the records in context 
#     # When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
#     # When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
#     # When I call defra relationship action with <StatusMsgCreate> <ContactType>
#     # When I enrole as an IDM-Admin
#     # When I create a handshake to a <ServiceName>
#     # When I call defra <ServAndServRole> enrolement action with <StatusMsgCreate>
#     #----Then I should be able to create the requested relationship for the records in context 
#     Examples:
#       | ValidationType        | StatusMsgCreate | ValidationTypeOrg | ServAndServRole  | ContactType  |
#       | AccessRequestContact1 | error           | BasicOrgDetails   | VMDAppLicence    | NonCitizen   |

Feature: Create ACCESS REQUEST via the Web API
I want to be able to call the defra_createaccessrequest endpoint
So that I can create an Access request bewtween a Contact and an LOB service

 api2-Donex
 Scenario Outline: Creating Access request between a Contact and an LOB-service
    # Given I am a Web API user 
    # And I have created a post request payload in JSON format 
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    # When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When I create access request for Contact to <ServiceRef>
    Examples:
      | ValidationType  | StatusMsgCreate | ValidationTypeOrg | ContactType  | ServiceRef     |
      | BasicContact    | error           | BasicOrgDetails   | NonCitizen   | AccesReqVMD-licence    |
      # | BasicContact    | error           | BasicOrgDetails   | NonCitizen   | AccesReqVMD- Reports    |
      # | BasicContact    | error           | BasicOrgDetails   | NonCitizen   | AccesReqVMD-SecureMsg |