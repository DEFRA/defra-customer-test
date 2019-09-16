@Regression-Test
Feature: CREATING an ORGANISATION AS a Web API User
  As an external API user 
  I want to be able to consume the D365 WebAPI Actions
  So that I can create an Organisation record in D365 Customer Master.

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines
  
  #1
  @api2-Done @smoke-Test
  Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> -Organisation with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | isUK | OrgType  | ValidationType | StatusMsgOrg                       |
      | true | LTD      | Basic_Org      | (accountid,defra_uniquereference)  |
      | true | PLC      | Basic_Org      | (accountid,defra_uniquereference)  |
      | true | LLP      | Basic_Org      | (accountid,defra_uniquereference)  |

  #2
  @api2-Done @smoke-Test
  Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> Organisation with <ValidationType> details
    # Given I am a Web API user
    # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | isUK | OrgType | ValidationType           | StatusMsgOrg                                                 |
      | true | LTD     | MissingOrgName           | Name is required                                             |
      | true | LTD     | MissingOrgType           | Edm Object passed should have the options selected.          |
      | true | LTD     | MissingCRNCheck          | Company House Number is required for these UK business Types |
      | true | LTD     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
      | true | LTD     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
      | true | LTD     | CRNLessThan              | Company House Number should be 8 characters long           |
      | true | LTD     | MissingRegAddress        | Registered address is required for an Organisation         |
      | true | LTD     | MissingStreet            | Registration Address Street  is required                   |
      | true | LTD     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
      # | true | LTD     | MissingPostCode          | Registration Address Postcode is required             |
      | true | LTD     | MissingCountry           | Registration Address Country is required              |

  #3
  @api2-Done
  Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> Organisation with <ValidationType> details
    # Given I am a Web API user
    # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
     | isUK  | OrgType | ValidationType           | StatusMsgOrg                                                 |
     | true  | PLC     | MissingOrgName           | Name is required                                             |
     | true  | PLC     | MissingOrgType           | Edm Object passed should have the options selected.          |
     | true  | PLC     | MissingCRNCheck          | Company House Number is required for these UK business Types |
     | true  | PLC     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
     | true  | PLC     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
     | true  | PLC     | CRNLessThan              | Company House Number should be 8 characters long            |
     | true  | PLC     | MissingRegAddress        | Registered address is required for an Organisation          |
     | true  | PLC     | MissingStreet            | Registration Address Street  is required                    |
     | true  | PLC     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
    #  | true  | PLC     | MissingPostCode          | Registration Address Postcode is required |
     | true  | PLC     | MissingCountry           | Registration Address Country is required  |

  #4
  @api2-Done
  Scenario Outline: Creating a IsUK '<isUK>' registered <OrgType> Organisation with <ValidationType> details
    # Given I am a Web API user
    # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | isUK  | OrgType | ValidationType           | StatusMsgOrg                                                 |
      | true  | LLP     | MissingOrgName           | Name is required                                             |
      | true  | LLP     | MissingOrgType           | Edm Object passed should have the options selected.          |
      | true  | LLP     | MissingCRNCheck          | Company House Number is required for these UK business Types |
      | true  | LLP     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
      | true  | LLP     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
      | true  | LLP     | CRNLessThan              | Company House Number should be 8 characters long                |
      | true  | LLP     | MissingRegAddress        | Registered address is required for an Organisation              |
      | true  | LLP     | MissingStreet            | Registration Address Street  is required                        |
      | true  | LLP     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
      # | true  | LLP     | MissingPostCode          | Registration Address Postcode is required    |
      | true  | LLP     | MissingCountry           | Registration Address Country is required     |

# ----- Scenarios below will TEST other-types of Organisations i.e. Sole Trader / Govenment / Not for profit etc ---

  #5
  @api2-Done @smoke-Test
  Scenario Outline: Creating a UK registered ' <OrgType> ' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | OrgType  | ValidationType | StatusMsgOrg                       |
      | SoleTrad | Basic_Org      | (accountid,defra_uniquereference)  |
      | Gov      | Basic_Org      | (accountid,defra_uniquereference)  |
      | CompAuth | Basic_Org      | (accountid,defra_uniquereference)  |

  #6
  @@api2-Done @smoke-Test
  Scenario Outline: Creating a UK registered '<OrgType>' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
    | OrgType  | ValidationType           | StatusMsgOrg                                       |
    | SoleTrad | MissingOrgName           | Name is required                                   |
    | SoleTrad | MissingOrgType           | Edm Object passed should have the options selected.|
    | SoleTrad | MissingRegAddress        | Registered address is required for an Organisation |
    | SoleTrad | MissingStreet            | Registration Address Street  is required           |
    | SoleTrad | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
    | SoleTrad | With_CRN                 | (accountid,defra_uniquereference)         |
    | SoleTrad | MissingCountry           | Registration Address Country is required  |

  #7
  @api2-Done
  Scenario Outline: Creating a UK registered '<OrgType>' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType           | StatusMsgOrg                                        |
      | Gov     | MissingOrgName           | Name is required                                    |
      | Gov     | MissingOrgType           | Edm Object passed should have the options selected. |
      | Gov     | MissingRegAddress        | Registered address is required for an Organisation  |
      | Gov     | MissingStreet            | Registration Address Street  is required            |
      | Gov     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
      | Gov     | With_CRN                 | (accountid,defra_uniquereference)         |
      | Gov     | MissingCountry           | Registration Address Country is required  |

  #8 - are we still using this Org TYPE - Not for Profit ???
  # @api2-Done_??
  # Scenario Outline: Creating a UK registered <OrgType> Organisation with <ValidationType> details
  #   # Given I am a Web API user
  #   # When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
  #   When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
  #   # Then a new Organisation record is created
  #   Examples:
  #     | OrgType  | ValidationType           | StatusMsg                                                   |
  #     | NotForPr | MissingOrgName           | Name is required                                            |
  #     | NotForPr | MissingOrgType           | Edm Object passed should have the options selected.         |
  #     | NotForPr | MissingRegAddress        | Registered address is required for an Organisation          |
  #     | NotForPr | MissingStreet            | Registration Address Street  is required                    |
  #     | NotForPr | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
  
  #9
  @api2-Done
  Scenario Outline: Creating a UK registered '<OrgType>' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
     | OrgType  | ValidationType           | StatusMsgOrg                                        |
     | CompAuth | MissingOrgName           | Name is required                                    |
     | CompAuth | MissingOrgType           | Edm Object passed should have the options selected. |
     | CompAuth | MissingRegAddress        | Registered address is required for an Organisation  |
     | CompAuth | MissingStreet            | Registration Address Street  is required            |
     | CompAuth | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
     | CompAuth | MissingCountry           | Registration Address Country is required  |

 # ---- Below test will Test Charity Organisation ---  
  #10
  @api2-Done @smoke-Test
  Scenario Outline: Creating a Charity Organisation (England & Wales) with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a <CharityLocal> charity organisation with <ValidationType> and <StatusMsgOrg>
    # Then the corresponding message <StatusMsg> is displayed
    Examples:
      | CharityLocal | ValidationType         | StatusMsgOrg                                        |
      | EnW          | Charity_BasicDetails   | (accountid,defra_uniquereference)                   |
      | EnW          | CharityNo_GreaterThan  | entity exceeded the maximum allowed length of '8'.  |
      | EnW          | CharityNo_Duplicated   | An account with the specified E&W Charity Number already exists!|
      # | EnW          | CharityNo_AlphabitOnly     | Charity Number can only be digits                  |
      # | EnW          | CharityNo_NumericOnly     | Charity Number can only be digits                   |

  #11
  @api2-Done @smoke-Test
  Scenario Outline: Creating a Charity Organisation (Scotland) with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a <CharityLocal> charity organisation with <ValidationType> and <StatusMsgOrg>
    # Then the corresponding message <StatusMsg> is displayed
    Examples:
      |CharityLocal| ValidationType         | StatusMsgOrg                                        |
      | Scot       | Charity_BasicDetails   | (accountid,defra_uniquereference)                   |
      | Scot       | CharityNo_GreaterThan  | entity exceeded the maximum allowed length of '8'.  |
      | Scot       | CharityNo_Duplicated   | An account with the specified Scotland Charity Number already exists! |
      # | Scot       | CharityNo_AlphabitOnly  | Charity Number can only be digits                   |
      # | Scot       | CharityNo_NumericOnly   | Charity Number can only be digits                   |

  #12
  @api2-Done @smoke-Test
  Scenario Outline: Creating a Charity Organisation (Northan Ireland) with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a <CharityLocal> charity organisation with <ValidationType> and <StatusMsgOrg>
    # Then the corresponding message <StatusMsg> is displayed
    Examples:
      | CharityLocal | ValidationType           | StatusMsgOrg                                        |
      | NI           | Charity_BasicDetails     | (accountid,defra_uniquereference)                   |
      | NI           | CharityNo_GreaterThan    | entity exceeded the maximum allowed length of '9'.  |
      | NI           | CharityNo_Duplicated     | An account with the specified NI Charity Number already exists! |
      # | NI           | CharityNo_AlphabitOnly   | Charity Number can only be digits                   |
      # | NI           | CharityNo_NumericOnly    | Charity Number can only be digits                   |

  #13 ---- CM-883 #1 & #2
  @api2-Done @smoke-Test
  Scenario Outline: Creating a IsUK '<isUK>' registered Org type '<OrgType>' with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | isUK  | OrgType  | ValidationType   | StatusMsgOrg                       |
      | true  | None     | Basic_Org        | Edm Object passed should have the options selected. |
      | false | None     | Basic_Org        | Edm Object passed should have the options selected. |


  #14 // postcode should NOT be a amandatory field in a non-UK address 
  @api2-Done @smoke-Test
  Scenario Outline: Creating a IsUK '<isUK>' <OrgType> Organisation with a Non-UK Address
    # Given I am a Web API user
    # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
      | isUK | OrgType | ValidationType   | StatusMsgOrg                      |
      | true | LTD     | UKOrg_NonUk_Addr | (accountid,defra_uniquereference) |
      | true | PLC     | UKOrg_NonUk_Addr | (accountid,defra_uniquereference) |
      | true | LLP     | UKOrg_NonUk_Addr | (accountid,defra_uniquereference) |


  #15 ---- CM-883 #5 & #6
  @api2-Done @smoke-Test
  Scenario Outline: Creating a isUK '<isUK>' <OrgType> Organisation WITH Registered Address details BUT No CRN
    # Given I am a Web API user
    # When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    When I send an API request to create a new <isUK> <OrgType> organisation with <ValidationType> and <StatusMsgOrg>
    # Then a new Organisation record is created
    Examples:
     | isUK  | OrgType | ValidationType         | StatusMsgOrg                      |
     | false | LTD     | NonUkOrg_NoCRN_Address | (accountid,defra_uniquereference) |
     | false | PLC     | NonUkOrg_NoCRN_Address | (accountid,defra_uniquereference) |
     | false | LLP     | NonUkOrg_NoCRN_Address | (accountid,defra_uniquereference) |
     | false | LTD     | NonUkOrg_CRN_NoAdd     | Registered address is required for an Organisation |
     | false | PLC     | NonUkOrg_CRN_NoAdd     | Registered address is required for an Organisation |
     | false | LLP     | NonUkOrg_CRN_NoAdd     | Registered address is required for an Organisation |
     | false | LTD     | NonUkOrg_NoCRN_NoAdd   | Registered address is required for an Organisation |
     | false | PLC     | NonUkOrg_NoCRN_NoAdd   | Registered address is required for an Organisation |
     | false | LLP     | NonUkOrg_NoCRN_NoAdd   | Registered address is required for an Organisation |