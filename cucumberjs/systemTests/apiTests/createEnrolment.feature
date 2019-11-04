@Regression-Test
Feature: CREATE ENROLMENT via the Web API
As an external API user 
I want to be able to call the defra_createEnrolment endpoint
So that I can create an Enrolment between an Organisation and a Defra service

  Acceptance Criteria:

  @api2-Done @smoke-TestXX
  Scenario Outline: Enroling a Contact and a <OrgType> Organisation to a Defra-Service as an IDM-ADMIN using - SERVICE AND SERVICE-ROLE
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole Contact to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    When I call Enrolment Request for contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    When I call defra Enrolement action with <ServAndServRole> and returned <StatusMsgService>

    #Then I should be able to create the requested relationship for the records in context 
    Examples:
     | ContactType | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | IDMServcie | StatusMsgIDMService          | DefraService   | StatusMsgDefraService        | ServAndServRole  | StatusMsgService             |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Licencing  | (defra_lobserviceuserlinkid) | VMDAppLicence    | (defra_lobserviceuserlinkid) |
     | Non_Citizen | ValidWordandHint   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Secure_Msg | (defra_lobserviceuserlinkid) | VMDReportAdverse | (defra_lobserviceuserlinkid) |
     | Non_Citizen | ValidWordandHint   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Reporing   | (defra_lobserviceuserlinkid) | VMDSecureMang    | (defra_lobserviceuserlinkid) |
    #  | Citizen     | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer  | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | Admin-User     | (defra_lobserviceuserlinkid) |IDM-Identity     | (defra_lobserviceuserlinkid) |
  

  @api2-Done @smoke-Test @SmokeEnrolments
  Scenario Outline: Enroling a Contact and a <OrgType> Organisation to a Defra-Service as an IDM-ADMIN using - SERVICE ONLY
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole Contact to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    When I call Enrolment Request for contact to a defra service <DefraService> and returned <EnrolmentRequestStatsMsg>
    When I call defra Enrolement action with <ServAndServRole> and returned <StatusMsgService>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
     | ContactType | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | IDMServcie | StatusMsgIDMService          | DefraService   | StatusMsgDefraService        | ServAndServRole | StatusMsgService             | EnrolmentRequestStatsMsg |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Licencing  | (defra_lobserviceuserlinkid) | ServiceOnly     | (defra_lobserviceuserlinkid) |defra_lobserviceuserlinkrequestid |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Secure_Msg | (defra_lobserviceuserlinkid) | ServiceOnly     | (defra_lobserviceuserlinkid) |defra_lobserviceuserlinkrequestid|
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Reporing   | (defra_lobserviceuserlinkid) | ServiceOnly     | (defra_lobserviceuserlinkid) |defra_lobserviceuserlinkrequestid|
        

  @api2-Done @ignore
  Scenario Outline: Enroling a Contact and a <OrgType> Organisation to a Defra-Service as an IDM-ADMIN using - SERVICE AND SERVICEROLE ONLY
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole Contact to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    When I call defra Enrolement action with <ServAndServRole> and returned <StatusMsgService>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
     | ContactType | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | IDMServcie | StatusMsgIDMService          | DefraService   | StatusMsgDefraService        | ServAndServRole | StatusMsgService             |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Licencing  | (defra_lobserviceuserlinkid) | ServiceRoleOnly | (defra_lobserviceuserlinkid) |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Secure_Msg | (defra_lobserviceuserlinkid) | ServiceRoleOnly | (defra_lobserviceuserlinkid) |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Reporing   | (defra_lobserviceuserlinkid) | ServiceRoleOnly | (defra_lobserviceuserlinkid) |


  @api2-Done @smoke-Test
  Scenario Outline: Duplicate Handshake enrolement 
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole Contact to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
     | ContactType | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | IDMServcie | StatusMsgIDMService          | DefraService   | StatusMsgDefraService        |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Licencing  | (defra_lobserviceuserlinkid) |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Secure_Msg | (defra_lobserviceuserlinkid) |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Reporing   | (defra_lobserviceuserlinkid) |
     | Citizen     | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Reporing   | (defra_lobserviceuserlinkid) |
  
  
  @api2-Done @smoke-Test
  Scenario Outline: Handshake enrolement with missing connection
    # Given I am a Web API user d

    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole Contact to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
    #Then I should be able to create the requested relationship for the records in context 
    Examples:
     | ContactType | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType        | StatusMsgCreate                    | IDMServcie | StatusMsgIDMService          | DefraService        | StatusMsgDefraService                                          |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Agent_AgentCust | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Missing_Connect | A valid Customer Relationship (Connection Detail) is mandatory |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Missing_Connect | A valid Customer Relationship (Connection Detail) is mandatory |
     | Non_Citizen | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer   | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Missing_Connect | A valid Customer Relationship (Connection Detail) is mandatory |
     | Citizen     | BasicContact   | (contactid,defra_uniquereference) | true | LLP     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer  | (_defra_connectiondetailsid_value) | Admin-User | (defra_lobserviceuserlinkid) | VMD_Missing_Connect     | A valid Customer Relationship (Connection Detail) is mandatory |
  