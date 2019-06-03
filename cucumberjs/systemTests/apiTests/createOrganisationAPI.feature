Feature: CREATE ORGANISATION AS a Web API User

  I want to be able to consume the D365 WebAPI Actions

  SO that I can create an organisation record in D365 Customer Master.

  Acceptance Criteria:
  The D365 WebAPI Create organisation Actions can be called using the Microsoft provided guidelines
  
  #1
  @api2-Donex
  Scenario Outline: Creating a UK registered Organisation (LTD / PLC / LLP) with basic details
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType  | StatusMsg |
      | BasicOrgDetails | error     |

  #2
  @api2-Done
  Scenario Outline: Creating an Organisation with MISSING Organisations-Name
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType      | StatusMsg        |
      | MissingOrgNameCheck | Name is required |

  #3
  @api2-Done
  Scenario Outline: Creating an Organisation with MISSING Organisations-Type
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType  | StatusMsg                                           |
      | MissingOrgType  | An error occurred while validating input parameters |
        
  #4
  @api2-Done
  Scenario Outline: Creating an Organisation (LTD / PLC / LLP) with MISSING Company-House-Number
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType  | StatusMsg                                                    |
      | MissingCRNCheck | Company House Number is required for these UK business Types |

  #5
  @api2-Done
  Scenario Outline: Creating an Organisation (LTD / PLC / LLP) using already EXISTING/DUPLICATE Company-House-Number
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # When I create a new <ValidationType> organisation with <StatusMsg> for duplication check
    # Then a new Organisation record is NOT created
    Examples:
      | ValidationType    | StatusMsg                                                    |
      | DuplicateCRNCheck | An account with the specified Company Number already exists! |

  #6
  @api2-Done
  Scenario Outline: Creating an Organisation (LTD / PLC / LLP) using Company-House-Number GREATER-THAN-8-CHARACTERS
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType      | StatusMsg                                     |
      | CRNGreaterThanCheck | A validation error occurred.  The length of the 'defra_cmcrn' attribute of the 'account' entity exceeded the maximum allowed length of '8'.|

  #7
  @api2-Done
  Scenario Outline: Creating an Organisation (LTD / PLC / LLP) with Company-House-Number LESS-THAN-8-CHARACTERS
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType   | StatusMsg                                        |
      | CRNLessThanCheck | Company House Number should be 8 characters long |

  #8
  @api2-Done
  Scenario Outline: Creating an Organisation with MISSING Registration-Address
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType         | StatusMsg                                          |
      | MissingRegAddressCheck | Registered address is required for an Organisation |

  #9
  @api2-Done
  Scenario Outline: Creating a UK registered Organisation (Sole Trader/Gov/None profite/Comp Auth) with basic details
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType     | StatusMsg  |
      | BasicOrgOthersTest | error      |

  #10
  @api2-todo
  Scenario Outline: Creating a new NON-UK Organisation
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType | StatusMsg |
      | BasicNonUkOrg  | error     |

  #11
  @api2-todo
  Scenario Outline: Creating a new NON-UK Organisation with MISSING Organisation-Name
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType           | StatusMsg         |
      | BasicNonUkMissingOrgName | Name is required  |

  #12
  @api2-Done
  Scenario Outline: Creating a UK registered Organisation (Charity / LLP) with basic details
    # Given I am a Web API user
    When I send an API request to create a new <ValidationType> organisation with <StatusMsg>
    # Then a new Organisation record is created
    Examples:
      | ValidationType           | StatusMsg                                                    |
      | CharityOrgDetails        | error                                                        |
      | LLPOrgDetails            | error                                                        |
      | CharityOrgNoGreaterThan  | entity exceeded the maximum allowed length of '8'.           |
      | CharityOrgNoAlphaNumeric | Charity Number can only be digits.                           |
      | CharityOrgNoDuplicate    | An account with the specified Charity Number already exists! |