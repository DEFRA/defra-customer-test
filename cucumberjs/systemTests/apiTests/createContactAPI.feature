@Regression-Test
Feature:  CREATE CONTACT -CM-146 As a Web API User
As an external API user 
I want to be able to consume the D365 WebAPI Actions
So that I can create a Contact record in D365 Customer Master.

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
  @api2-Done @smoke-Test @SmokeContact1
  Scenario Outline: Creating a UK - <ContactType> - Contact-type with <ValidationType>
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
    Examples:
       | ContactType | ValidationType            | StatusMsgCont                                                        |
      | Citizen     | BasicContact              | (contactid,defra_uniquereference)                                    |
   

  #2
  @api2-Done @smoke-Test @SmokeContact1
  Scenario Outline: Creating a UK - <ContactType> - Contact-type with <ValidationType>
    # Given I am a Web API user
    When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
    Examples:
      | ContactType | ValidationType            | StatusMsgCont                                                        |
      | Non_Citizen | BasicContact              | (contactid,defra_uniquereference)                                    |
      | Non_Citizen | DuplicateB2cObjectId      | A record that has the attribute values B2C Object Id already exists. |
     
