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

      #2
      @api2-Done @smoke-Test
      Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> Organisation with <ValidationType> details
            # Given I am a Web API user
            # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
            When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
            # Then a new Organisation record is created
            Examples:
                  | isUK | OrgType | ValidationType           | StatusMsgOrg                                                                                                  |
                  | true | LTD     | MissingOrgName           | Name is required                                                                                              |
                  | true | LTD     | MissingOrgType           | Edm Object passed should have the options selected.                                                           |
                  | true | LTD     | MissingCRNCheck          | Company House Number is required for these UK business Types                                                  |
                  | true | LTD     | DuplicateCRNCheck        | An account with the specified Company Number already exists!                                                  |
                  | true | LTD     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'. |
                  | true | LTD     | CRNLessThan              | Company House Number should be 8 characters long                                                              |
                  | true | LTD     | MissingRegAddress        | Registered address is required for an Organisation                                                            |
                  | true | LTD     | MissingStreet            | (accountid,defra_uniquereference)                                                                             |
                  | true | LTD     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required                                                |
                  # | true | LTD     | MissingPostCode          | Registration Address Postcode is required             |
                  | true | LTD     | MissingCountry           | Registration Address Country is required                                                                      |
                  | true | LTD     | OrgNameGrt160CharLong    | The length of the 'name' attribute of the 'account' entity exceeded the maximum allowed length of '160'.      |

      #3
      @api2-Done
      Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> Organisation with <ValidationType> details
            # Given I am a Web API user
            # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
            When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
            # Then a new Organisation record is created
            Examples:
                  | isUK | OrgType | ValidationType           | StatusMsgOrg                                                                                                  |
                  | true | PLC     | MissingOrgName           | Name is required                                                                                              |
                  | true | PLC     | MissingOrgType           | Edm Object passed should have the options selected.                                                           |
          
