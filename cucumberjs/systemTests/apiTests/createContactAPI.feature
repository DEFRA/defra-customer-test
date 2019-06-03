Feature:  CREATE CONTACT -CM-146 As a Web API User

I want to be able to consume the D365 WebAPI Actions

SO that I can create a contact record in D365 Customer Master.

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
  @api2-Done
  Scenario Outline: Creating a new contact - CITIZEN
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Contact record should be created
    Examples:
      | ValidationType  | StatusMsg  |
      | BasicContact    | error      |

  #2
  @api2-Done
  Scenario Outline: Creating a new Contact with MISSING first-Name
    # Given I am a Web API user
   When I create a new <ValidationType> with expected message outcome <StatusMsg>
   # Then a new Contact record is NOT created
   Examples:
      | ValidationType          | StatusMsg                      |
      | ContactMissingFirstName | Firstname is a required field. |

  #3
  @api2-Done
  Scenario Outline: Creating a new Contact with MISSING last-Name
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Contact record is NOT created
    Examples:
      | ValidationType         | StatusMsg                     |
      | ContactMissingLastName | LastName is a required field. |

  #4
  @api2-Done
  Scenario Outline: Creating a new CITIZEN Contact with MISSING Corresponding-Address
    # Given I am a Web API user
    # When I create a new <ValidationType> Contact with <StatusMsg> for duplication check
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Organisation record is NOT created
    Examples:
      | ValidationType           | StatusMsg                                        |
      | ContactMissingCorAddress | Correspondence address is required for a Contact |

  #5
  @api2-Done
  Scenario Outline: Creating a new Contact with MISSING/INVALID T&C Date
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Organisation record is NOT created
    Examples:
      | ValidationType        | StatusMsg                                                     |
      | ContactMissingTnCDate | DateTime is less than minumum value supported by CrmDateTime. |
      | ContactInvalidTnCDate | DateTime is less than minumum value supported by CrmDateTime. |

  #6        
  @api2-Done
  Scenario Outline: Creating a new Contact using an already EXISTING/DUPLICATE 'b2cobjectid'
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Organisation record is NOT created
    Examples:
      | ValidationType        | StatusMsg                                                            |
      | DuplicateB2cObjectId  | A record that has the attribute values B2C Object Id already exists. |

  #7
  @api2-Done
  Scenario Outline: Creating a new Contact using an INVALID 'b2cobjectid'
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Organisation record is NOT created
    Examples:
      | ValidationType      | StatusMsg                                      |
      | InvalidB2cObjectId  | B2C - Object - ID must be a valid Guid format. |

  #8
  @api2-Done
  Scenario Outline: Creating a new Contact using an already EXISTING/DUPLICATE 'EMAIL-ADDRESS'
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Organisation record is NOT created
    Examples:
      | ValidationType             | StatusMsg                                                                      |
      | ContactWithDuplicateEmail  | A record that has the attribute values Principal Email Address already exists. |


