@Regression-Test
Feature: CREATE ENROLMENT via the Web API
    As an external API user
    I want to be able to call the defra_createEnrolment endpoint
    So that I can create an Enrolment between an Organisation and a Defra service

    Acceptance Criteria:

    @api2-Done @smoke-Test @fishPlantsexportsenrolment
    Scenario Outline: Enroling a Contact and a <OrgType> Organisation to a Defra-Service as an IDM-ADMIN using - SERVICE AND SERVICE-ROLE
        # Given I am a Web API user
        When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
        When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
        When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
        When I Enrole 'Contact' to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
         When I call defra Enrolement action with <ServAndServRole> and returned <StatusMsgService>
        #Then I should be able to create the requested relationship for the records in context
        Examples:
            | ContactType | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | IDMServcie | StatusMsgIDMService          | DefraService                       | StatusMsgDefraService        | ServAndServRole                    | StatusMsgService             | EnrolmentRequestStatsMsg          |
            | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | FishExports                        | (defra_lobserviceuserlinkid) | FishExports                        | (defra_lobserviceuserlinkid) | defra_lobserviceuserlinkrequestid |
            | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | FishExports                        | (defra_lobserviceuserlinkid) | FishExports                        | (defra_lobserviceuserlinkid) | defra_lobserviceuserlinkrequestid |
         
