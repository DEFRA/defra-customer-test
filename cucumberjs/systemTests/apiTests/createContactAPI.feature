Feature:  CREATE CONTACT -CM-146 As a Web API User

I want to be able to consume the D365 WebAPI Actions
SO that I can create a contact record in D365 Customer Master.

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
  @api2-Done
  Scenario Outline: Creating a UK - CITIZEN - with <ValidationType>
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Contact record should be created
    Examples:
      | ValidationType            | StatusMsg                                                   |
      | BasicContact              | metadata#contacts(contactid,defra_uniquereference)/$entity  |
      | ContactMissingFirstName   | Firstname is a required field                               |
      | ContactMissingLastName    | LastName is a required field                                |
      | ContactMissingCorAddress  | Correspondence address is required for a Contact              |
      | ContactMissingTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | ContactInvalidTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | DuplicateB2cObjectId      | A record that has the attribute values B2C Object Id already exists. |
      | InvalidB2cObjectId        | B2C - Object - ID must be a valid Guid format.                       |
      | ContactWithDuplicateEmail | A record that has the attribute values Principal Email Address already exists. |
      | MissingBuildNameNo        | Correspondence Address BuildingNumber orBuildingName is required               |
      # | MissingStreet             | Correspondence Address Street  is required           |
      # | MissingCountry            | An error occurred while validating input parameters: |


  #2
  @api2-??
  Scenario Outline: Creating a UK - NON CITIZEN - with <ValidationType>
    # Given I am a Web API user
    When I create a new <ValidationType> with expected message outcome <StatusMsg>
    # Then a new Contact record should be created
    Examples:
      | ValidationType            | StatusMsg                     |
      | BasicContact              | error                         |
      | ContactMissingFirstName   | Firstname is a required field |
      | ContactMissingLastName    | LastName is a required field  |
      | ContactMissingCorAddress  | Correspondence address is required for a Contact              |
      | ContactMissingTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | ContactInvalidTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | DuplicateB2cObjectId      | A record that has the attribute values B2C Object Id already exists. |
      | InvalidB2cObjectId        | B2C - Object - ID must be a valid Guid format.                 |
      | ContactWithDuplicateEmail | A record that has the attribute values Principal Email Address already exists. |