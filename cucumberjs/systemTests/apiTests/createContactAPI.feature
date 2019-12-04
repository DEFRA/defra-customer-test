@Regression-Test
Feature:  CREATE CONTACT -CM-146 As a Web API User
As an external API user 
I want to be able to consume the D365 WebAPI Actions
So that I can create a Contact record in D365 Customer Master.

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
  @api2-Done @smoke-Test @SmokeContact
  Scenario Outline: Creating a UK - <ContactType> - Contact-type with <ValidationType>
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
    Examples:
       | ContactType | ValidationType            | StatusMsgCont                                                        |
      | Citizen     | BasicContact              | (contactid,defra_uniquereference)                                    |
     | Citizen     | ValidWordandHint          | (contactid,defra_uniquereference)                                    |
      | Citizen     | ValidWord6CharHint100Char | (contactid,defra_uniquereference)                                    |
      | Citizen     | BlankWordandHint          | (contactid,defra_uniquereference)                                    |
      | Citizen     | HintOnly                  | Security Word and Security Hint both must have data.                 |
      | Citizen     | WordOnly                  | Security Word and Security Hint both must have data.                 |
     | Citizen     | HintBlank                 | Security Word and Security Hint both must have data.                 |
      | Citizen     | WordBlank                 | Security Word and Security Hint both must have data.                 |
      | Citizen     | WordLessthan6Char         | Security Word must Alphanumeric, contain between 6 and 12 characters (not case sensitive) and contain no spaces or special characters.                 |
      | Citizen     | WordMorethan12Char        | A validation error occurred.  The length of the 'defra_securityword' attribute of the 'contact' entity exceeded the maximum allowed length of '12'                 |
      | Citizen     | WordSpecialChar           | Security Word must Alphanumeric, contain between 6 and 12 characters (not case sensitive) and contain no spaces or special characters.                 |
      | Citizen     | WordInvalidRangeandSpecialChar | A validation error occurred.  The length of the 'defra_securityword' attribute of the 'contact' entity exceeded the maximum allowed length of '12'.   |
      | Citizen     | HintLessthan100CharandSplChar   | defra_uniquereference   |
      | Citizen     | HintMorethan100Char | The length of the 'defra_securityhint' attribute of the 'contact' entity exceeded the maximum allowed length of '100'.   |
      | Citizen     | HintSplCharandMorethan100Char | The length of the 'defra_securityhint' attribute of the 'contact' entity exceeded the maximum allowed length of '100'.   |
      | Citizen     | DuplicateB2cObjectId      | A record that has the attribute values B2C Object Id already exists. |
      | Citizen     | InvalidB2cObjectId        | B2C - Object - ID must be a valid Guid format.                       |
      | Citizen     | MissingFirstName          | Firstname is a required field                                        |
      | Citizen     | MissingLastName           | LastName is a required field                                         |
      | Citizen     | DuplicateEmailAddr        | A record that has the attribute values Principal Email Address already exists. |
      | Citizen     | InvalidEmailAddr2         | Invalid email address |
      | Citizen     | MissingCorAddress         | Correspondence address is required for a Contact                 |
      | Citizen     | MissingBuildNameNo        | Correspondence Address BuildingNumber orBuildingName is required |
    | Citizen     | MissingStreet             | Correspondence Address Street  is required         |
#      | Citizen     | MissingPostCode           | Correspondence Address MissingPostCode is required | */
      | Citizen     | MissingCountry            | Correspondence Address Country is required         |
      | Citizen     | ContactMissingTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | Citizen     | ContactInvalidTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
     | Citizen     | ContactMissingTnCVersion  | T&C version and date both must have data. |
      | Citizen     | ContactInvalidTnCVersion  | T&C version and date both must have data. |
    | Citizen     | FNameGreaterThan50Char  | The length of the 'firstname' attribute of the 'contact' entity exceeded the maximum allowed length of '50'. |
     | Citizen     | LNameGreaterThan50Char  | The length of the 'lastname' attribute of the 'contact' entity exceeded the maximum allowed length of '50'. |


  #2
  @api2-Done @smoke-Test
  Scenario Outline: Creating a UK - <ContactType> - Contact-type with <ValidationType>
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
    Examples:
      | ContactType | ValidationType            | StatusMsgCont                                                        |
      | Non_Citizen | BasicContact              | (contactid,defra_uniquereference)                                    |
      | Non_Citizen | DuplicateB2cObjectId      | A record that has the attribute values B2C Object Id already exists. |
      | Non_Citizen | InvalidB2cObjectId        | B2C - Object - ID must be a valid Guid format.                       |
      | Non_Citizen | MissingFirstName          | Firstname is a required field                                        |
      | Non_Citizen | MissingLastName           | LastName is a required field                                         |
      | Non_Citizen | DuplicateEmailAddr        | A record that has the attribute values Principal Email Address already exists. |
      | Non_Citizen | InvalidEmailAddr2         | Invalid email address             |
      | Non_Citizen | MissingCorAddress         | (contactid,defra_uniquereference) |
      | Non_Citizen | MissingBuildNameNo        | (contactid,defra_uniquereference) |
      | Non_Citizen | MissingStreet             | (contactid,defra_uniquereference) |
      # | Non_Citizen | MissingPostCode           | (contactid,defra_uniquereference) |
      | Non_Citizen | MissingCountry            | (contactid,defra_uniquereference)|
      | Non_Citizen | ContactMissingTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | Non_Citizen | ContactInvalidTnCDate     | DateTime is less than minumum value supported by CrmDateTime. |
      | Non_Citizen | ContactMissingTnCVersion  | T&C version and date both must have data. |
      | Non_Citizen | ContactInvalidTnCVersion  | T&C version and date both must have data. |
      | Non_Citizen | FNameGreaterThan50Char  | The length of the 'firstname' attribute of the 'contact' entity exceeded the maximum allowed length of '50'. |
      | Non_Citizen | LNameGreaterThan50Char  | The length of the 'lastname' attribute of the 'contact' entity exceeded the maximum allowed length of '50'. |
