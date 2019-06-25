Feature: CREATING an ORGANISATION AS a Web API User
  As an external API user 
  I want to be able to consume the D365 WebAPI Actions
  So that I can create an Organisation record in D365 Customer Master.

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines
  
  #1
  @api2-Done
  Scenario Outline: Creating a UK registered <OrgType> -Organisation with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType  | ValidationType | StatusMsg                          |
      | LTD      | Basic_Org      | (accountid,defra_uniquereference)  |
      | PLC      | Basic_Org      | (accountid,defra_uniquereference)  |
      | LLP      | Basic_Org      | (accountid,defra_uniquereference)  |


  # ------ This story is to test in SIT environment  -----------------------
  #2
  # @api2-Done
  # Scenario Outline: Creating a UK registered <OrgType> Organisation with <ValidationType> details
  #   # Given I am a Web API user
  #   # When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
  #   When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
  #   # Then a new Organisation record is created
  #   Examples:
  #     | OrgType | ValidationType           | StatusMsg                                                    |
  #     | LTD     | MissingOrgName           | Name is a required Field                                     |
  #     | LTD     | MissingOrgType           | Edm Object passed should have the options selected.          |
  #     | LTD     | MissingCRNCheck          | Company Number required for Uk types LTD, PLC or LLP         |
  #     | LTD     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
  #     | LTD     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
  #     | LTD     | CRNLessThan              | Company Number must be 8 characters long                     |
  #     | LTD     | MissingRegAddress        | A valid registered address is required for an organisation: (reg) Invalid address - Building Name and / or Building Number must be supplied |
  #     | LTD     | MissingStreet            | A valid registered address is required for an organisation: (reg) Invalid address - street must be supplied                                 |
  #     | LTD     | MissingBuildingNameAndNo | A valid registered address is required for an organisation: (reg) Invalid address - Building Name and / or Building Number must be supplied |
  #     | LTD     | MissingPostCode          | Invalid address - postcode must be supplied                    |

  # ------ This story is to test in System-test -----------------------
  #2
  @api2-Done
  Scenario Outline: Creating a UK registered <OrgType> Organisation with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType           | StatusMsg                                                    |
      | LTD     | MissingOrgName           | Name is required                                             |
      | LTD     | MissingOrgType           | Edm Object passed should have the options selected.          |
      | LTD     | MissingCRNCheck          | Company House Number is required for these UK business Types |
      | LTD     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
      | LTD     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
      | LTD     | CRNLessThan              | Company House Number should be 8 characters long               |
      | LTD     | MissingRegAddress        | Registered address is required for an Organisation             |
      | LTD     | MissingStreet            | Registration Address Street  is required                       |
      | LTD     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required |
      | LTD     | MissingPostCode          | Invalid address - postcode must be supplied                    |


  #3
  @api2-Done
  Scenario Outline: Creating a UK registered <OrgType> Organisation with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType           | StatusMsg                                                    |
      | PLC     | MissingOrgName           | Name is required                                             |
      | PLC     | MissingOrgType           | Edm Object passed should have the options selected.          |
      | PLC     | MissingCRNCheck          | Company House Number is required for these UK business Types |
      | PLC     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
      | PLC     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
      | PLC     | CRNLessThan              | Company House Number should be 8 characters long                |
      | PLC     | MissingRegAddress        | Registered address is required for an Organisation              |
      | PLC     | MissingStreet            | Registration Address Street  is required                        |
      | PLC     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
      | PLC     | MissingPostCode          | Invalid address - postcode must be supplied                    |

  #4
  @api2-Done
  Scenario Outline: Creating a UK registered <OrgType> Organisation with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType           | StatusMsg                                                    |
      | LLP     | MissingOrgName           | Name is required                                             |
      | LLP     | MissingOrgType           | Edm Object passed should have the options selected.          |
      | LLP     | MissingCRNCheck          | Company House Number is required for these UK business Types |
      | LLP     | DuplicateCRNCheck        | An account with the specified Company Number already exists! |
      | LLP     | CRNGreaterThan           | The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|
      | LLP     | CRNLessThan              | Company House Number should be 8 characters long                |
      | LLP     | MissingRegAddress        | Registered address is required for an Organisation              |
      | LLP     | MissingStreet            | Registration Address Street  is required                        |
      | LLP     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |
      | LLP     | MissingPostCode          | Invalid address - postcode must be supplied                     |

# ----- Scenarios below will TEST other-types of Organisations i.e. Sole Trader / Govenment / Not for profit etc ---

  #5
  @api2-Done
  Scenario Outline: Creating a UK registered ' <OrgType> ' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType  | ValidationType | StatusMsg |
      | SoleTrad | Basic_Org      | (accountid,defra_uniquereference)  |
      | Gov      | Basic_Org      | (accountid,defra_uniquereference)  |
      | CompAuth | Basic_Org      | (accountid,defra_uniquereference)  |

  #6
  @@api2-Done
  Scenario Outline: Creating a UK registered '<OrgType>' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType  | ValidationType           | StatusMsg                                                   |
      | SoleTrad | MissingOrgName           | Name is required                                            |
      | SoleTrad | MissingOrgType           | Edm Object passed should have the options selected.         |
      | SoleTrad | MissingRegAddress        | Registered address is required for an Organisation          |
      | SoleTrad | MissingStreet            | Registration Address Street  is required                    |
      | SoleTrad | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |

  #7
  @api2-Done
  Scenario Outline: Creating a UK registered '<OrgType>' Organisation with <ValidationType> details
    # Given I am a Web API user
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType           | StatusMsg                                                   |
      | Gov     | MissingOrgName           | Name is required                                            |
      | Gov     | MissingOrgType           | Edm Object passed should have the options selected.         |
      | Gov     | MissingRegAddress        | Registered address is required for an Organisation          |
      | Gov     | MissingStreet            | Registration Address Street  is required                    |
      | Gov     | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |

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
    When I make an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType  | ValidationType           | StatusMsg                                                   |
      | CompAuth | MissingOrgName           | Name is required                                            |
      | CompAuth | MissingOrgType           | Edm Object passed should have the options selected.         |
      | CompAuth | MissingRegAddress        | Registered address is required for an Organisation          |
      | CompAuth | MissingStreet            | Registration Address Street  is required                    |
      | CompAuth | MissingBuildingNameAndNo | Registration Address BuildingNumber orBuildingName is required  |

 # ---- Below test will Test Charity Organisation ---  
  #10
  @api2-Done
  Scenario Outline: Creating a Charity Organisation (England & Wales) with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a <CharityLocal> charity organisation with <ValidationType> and <StatusMsg>
    # Then the corresponding message <StatusMsg> is displayed
    Examples:
      | CharityLocal | ValidationType         | StatusMsg                                           |
      | EnW          | Charity_BasicDetails   | metadata#accounts(accountid,defra_uniquereference)  |
      | EnW          | CharityNo_GreaterThan  | entity exceeded the maximum allowed length of '8'.  |
      | EnW          | CharityNo_Duplicated   | An account with the specified E&W Charity Number already exists!|

      # | EnW          | CharityNo_AlphabitOnly     | Charity Number can only be digits                  |
      # | EnW          | CharityNo_NumericOnly     | Charity Number can only be digits                   |

  #11
  @api2-Done
  Scenario Outline: Creating a Charity Organisation (Scotland) with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a <CharityLocal> charity organisation with <ValidationType> and <StatusMsg>
    # Then the corresponding message <StatusMsg> is displayed
    Examples:
      |CharityLocal| ValidationType         | StatusMsg                                           |
      | Scot       | Charity_BasicDetails   | metadata#accounts(accountid,defra_uniquereference)  |
      | Scot       | CharityNo_GreaterThan  | entity exceeded the maximum allowed length of '8'.  |
      | Scot       | CharityNo_Duplicated   | An account with the specified Scotland Charity Number already exists! |

      # | Scot       | CharityNo_AlphabitOnly  | Charity Number can only be digits                   |
      # | Scot       | CharityNo_NumericOnly   | Charity Number can only be digits                   |

  #12
  @api2-Done
  Scenario Outline: Creating a Charity Organisation (Northan Ireland) with <ValidationType> details
    # Given I am a Web API user
    When I send an API request to create a <CharityLocal> charity organisation with <ValidationType> and <StatusMsg>
    # Then the corresponding message <StatusMsg> is displayed
    Examples:
      | CharityLocal | ValidationType           | StatusMsg                                           |
      | NI           | Charity_BasicDetails     | metadata#accounts(accountid,defra_uniquereference)  |
      | NI           | CharityNo_GreaterThan    | entity exceeded the maximum allowed length of '9'.  |
      | NI           | CharityNo_Duplicated     | An account with the specified NI Charity Number already exists! |

      # | NI           | CharityNo_AlphabitOnly   | Charity Number can only be digits                   |
      # | NI           | CharityNo_NumericOnly    | Charity Number can only be digits                   |

  #13
  @api2-Done-later
  Scenario Outline: Creating a <OrgType> UK Organisation with a Non-UK Address
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType   | StatusMsg                         |
      | LTD     | UKOrg_NonUk_Addr | (accountid,defra_uniquereference) |
      | PLC     | UKOrg_NonUk_Addr | (accountid,defra_uniquereference) |
      | LLP     | UKOrg_NonUk_Addr | (accountid,defra_uniquereference) |

  #14
  @api2-Done-later
  Scenario Outline: Creating a Non-UK <OrgType> Organisation with No CRN and No Address details
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType  | StatusMsg                         |
      | LTD     | NonUkOrg_NoAdd  | Registered address is required for an Organisation:Registration Address BuildingNumber orBuildingName is required |
      | PLC     | NonUkOrg_NoAdd  | Registered address is required for an Organisation:Registration Address BuildingNumber orBuildingName is required |
      | LLP     | NonUkOrg_NoAdd  | Registered address is required for an Organisation:Registration Address BuildingNumber orBuildingName is required |

  #15
  @api2-Done-later
  Scenario Outline: Creating a Non-UK <OrgType> Organisation WITH Registered Address details BUT No CRN
    # Given I am a Web API user
    When I send an API request to create a new <OrgType> organisation with <ValidationType> and <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | OrgType | ValidationType  | StatusMsg                         |
      | LTD     | NonUkOrg_NoCRN  | (accountid,defra_uniquereference) |
      | PLC     | NonUkOrg_NoCRN  | (accountid,defra_uniquereference) |
      | LLP     | NonUkOrg_NoCRN  | (accountid,defra_uniquereference) |