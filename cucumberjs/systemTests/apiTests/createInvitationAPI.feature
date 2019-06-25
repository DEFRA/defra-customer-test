Feature: As a Oganisation Admin, I want to INVITE a CONTACT to join my Organisation

I want to be able to consume the D365 WebAPI Actions

SO that I can invite a Contact to an Organisation

Acceptance Criteria:
The D365 WebAPI Invite Contact Actions can be called using the Microsoft provided guidelines

  #1
  @api2-Done??
  Scenario Outline: Inviting a Contact to join an Organisation as an <Role>
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsgCreate>
    # When I send an API request to create a new <ValidationTypeOrg> organisation with <StatusMsgCreate>
    When I send an API request to create a new <OrgType> organisation with <ValidationTypeOrg> and <StatusMsg>
    When I call defra relationship action with <StatusMsgCreate> <ContactType>
    When an Organisation invites a Contact to join as a <Role>
    # Then an invitation for the Contact should be created
    Examples:
      | OrgType | ValidationType | StatusMsgCreate | ValidationTypeOrg | ContactType     | Role     | 
      | LTD     | BasicContact   | error           | BasicOrg_LTD      | NonCitizenEmpl  | Employer |
      | LTD     | BasicContact   | error           | BasicOrg_LTD      | NonCitizenAgent | Agent    | 