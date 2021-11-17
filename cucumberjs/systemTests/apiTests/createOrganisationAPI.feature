@Regression-Test  @OrgRegression

Feature: CREATING an ORGANISATION AS a Web API User
      As an external API user
      I want to be able to consume the D365 WebAPI Actions
      So that I can create an Organisation record in D365 Customer Master.

      Acceptance Criteria:
      The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines

      #1
      @api2-Done @smoke-Test @parentorgchk
      Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> -Organisation with <ValidationType> details
            # Given I am a Web API user
            When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
            # Then a new Organisation record is created
            Examples:
                  | isUK | OrgType | ValidationType | StatusMsgOrg                      |
                  | true | LTD     | Basic_Org      | (accountid,defra_uniquereference) |
                  | true | PLC     | Basic_Org      | (accountid,defra_uniquereference) |
                  | true | LLP     | Basic_Org      | (accountid,defra_uniquereference) |

     
