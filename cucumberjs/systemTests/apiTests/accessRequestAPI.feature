@Regression-Test
Feature: Create ACCESS REQUEST via the Web API
As an external API user 
I want to be able to call the defra_createaccessrequest endpoint
So that I can create an Access-Request between a Contact and an LOB service

  @api2-Done @smoke-Test
  Scenario Outline: Creating Access-Request for N+1-Contact
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole <ContactType> to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Handshake contact to a defra service <DefraService> and returned <StatusMsgDefraService>
     When I call defra Relationship action between <ContactType2> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole <ContactType2> to an IDM service <IDMServcie2> and returned <StatusMsgIDMService>
    When I create access request for N-plus1-Contact and Org-1 to <LoBService> with excpected outcome <StatusMsgCreate>
    Examples:
     | ContactType | ContactType2 | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType      | StatusMsgCreate                    | IDMServcie | IDMServcie2    | StatusMsgIDMService          | DefraService     | StatusMsgDefraService        | ServAndServRole | StatusMsgService             | LoBService |
     | Non_Citizen | N_plus_one   | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer | (_defra_connectiondetailsid_value) | Admin-User | Standared-User | (defra_lobserviceuserlinkid) | IMP_Notification | (defra_lobserviceuserlinkid) | ImpNotification | (defra_lobserviceuserlinkid) | Imports    |
     | Non_Citizen | N_plus_one   | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer | (_defra_connectiondetailsid_value) | Admin-User | Standared-User | (defra_lobserviceuserlinkid) | IMP_Veterinarian | (defra_lobserviceuserlinkid) | ImpVeterinarian | (defra_lobserviceuserlinkid) | Imports    |
        
  @api2-DoneZZ @ignore
  Scenario Outline: Creating and Approving Access-Request for N+1-Contact
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole <ContactType> to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
   When I call defra Relationship action between <ContactType2> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole <ContactType2> to an IDM service <IDMServcie2> and returned <StatusMsgIDMService>
    When I create access request for N-plus1-Contact and Org-1 to <LoBService> with excpected outcome <StatusMsgCreate>
    When I <accessAction> created access request
    Examples:
     | ContactType | ContactType2 | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType      | StatusMsgCreate                    | IDMServcie | IDMServcie2    | StatusMsgIDMService          | DefraService     | StatusMsgDefraService        | ServAndServRole | StatusMsgService             | LoBService | accessAction |
     | Non_Citizen | N_plus_one   | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer | (_defra_connectiondetailsid_value) | Admin-User | Standared-User | (defra_lobserviceuserlinkid) | IMP_Notification | (defra_lobserviceuserlinkid) | ImpNotification | (defra_lobserviceuserlinkid) | Imports    | approve |
    #  | Non_Citizen | N_plus_one   | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer | (_defra_connectiondetailsid_value) | Admin-User | Standared-User | (defra_lobserviceuserlinkid) | IMP_Veterinarian | (defra_lobserviceuserlinkid) | ImpVeterinarian | (defra_lobserviceuserlinkid) | Imports    | approve |
      
 @api2-Done @ignore
  Scenario Outline: Creating and Rejecting Access-Request for N+1-Contact
    # Given I am a Web API user 
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationTypeOrg> and <StatusMsgOrg>
    When I call defra Relationship action between <ContactType> and same Org with <RoleType> and returned <StatusMsgCreate>
    When I Enrole <ContactType> to an IDM service <IDMServcie> and returned <StatusMsgIDMService>
    When I Enrole <ContactType2> to an IDM service <IDMServcie2> and returned <StatusMsgIDMService>
    When I create access request for N-plus1-Contact and Org-1 to <LoBService> with excpected outcome <StatusMsgCreate>
    When I <accessAction> created access request
    Examples:
     | ContactType | ContactType2 | ValidationType | StatusMsgCont                     | isUK | OrgType | ValidationTypeOrg | StatusMsgOrg                      | RoleType      | StatusMsgCreate                    | IDMServcie | IDMServcie2    | StatusMsgIDMService          | DefraService     | StatusMsgDefraService        | ServAndServRole | StatusMsgService             | LoBService | accessAction |
     | Non_Citizen | N_plus_one   | BasicContact   | (contactid,defra_uniquereference) | true | LTD     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer | (_defra_connectiondetailsid_value) | Admin-User | Standared-User | (defra_lobserviceuserlinkid) | IMP_Notification | (defra_lobserviceuserlinkid) | ImpNotification | (defra_lobserviceuserlinkid) | Imports    | reject    |
    #  | Non_Citizen | N_plus_one   | BasicContact   | (contactid,defra_uniquereference) | true | PLC     | Basic_Org         | (accountid,defra_uniquereference) | Empl_Employer | (_defra_connectiondetailsid_value) | Admin-User | Standared-User | (defra_lobserviceuserlinkid) | IMP_Veterinarian | (defra_lobserviceuserlinkid) | ImpVeterinarian | (defra_lobserviceuserlinkid) | Imports    | reject   |
     
