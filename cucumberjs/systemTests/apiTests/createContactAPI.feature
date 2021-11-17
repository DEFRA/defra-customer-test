@Regression-Test
Feature:  CREATE CONTACT -CM-146 As a Web API User
              As an external API user
              I want to be able to consume the D365 WebAPI Actions
So that I can create a Contact record in D365 Customer Master.

              Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

  #1
        @api2-Done @smoke-Test @SmokeContact112
        Scenario Outline: Creating a UK - <ContactType> - Contact-type with <ValidationType>
    # Given I am a Web API user
             When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
        Examples:
                  | ContactType | ValidationType                 | StatusMsgCont                                                                                                                                       |
                  | Citizen     | AllUK_Addresses                | (contactid,defra_uniquereference)                                                                                                                   |
                  | Citizen     | BasicContact                   | (contactid,defra_uniquereference)                                                                                                                   |
                  | Citizen     | ValidWordandHint               | (contactid,defra_uniquereference)                                                                                                                   |
                  | Citizen     | ValidWord6CharHint100Char      | (contactid,defra_uniquereference)                                                                                                                   |
                  | Citizen     | BlankWordandHint               | (contactid,defra_uniquereference)                                                                                                                   |
                  | Citizen     | HintOnly                       | Security Word and Security Hint both must have data.                                                                                                |
                  | Citizen     | WordOnly                       | Security Word and Security Hint both must have data.                                                                                                |
                  | Citizen     | HintBlank                      | Security Word and Security Hint both must have data.                                                                                                |
                  | Citizen     | WordBlank                      | Security Word and Security Hint both must have data.                                                                                                |
              

  #2
        @api2-Done @smoke-Test @SmokeContact @CIMD187x
        Scenario Outline: Creating a UK - <ContactType> - Contact-type with <ValidationType>
    # Given I am a Web API user
             When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
    # Then a new Contact record should be created
        Examples:
                  | ContactType | ValidationType                | StatusMsgCont                                                                                                     |
                  | Non_Citizen | AllUK_Addresses               | (contactid,defra_uniquereference)                                                                                 |
                  | Non_Citizen | NonUKCorAdd_OthersUKAddresses | (contactid,defra_uniquereference)                                                                                 |
                  | Non_Citizen | AllNoneUK_Addresses           | (contactid,defra_uniquereference)                                                                                 |
                  | Non_Citizen | BasicContact                  | (contactid,defra_uniquereference)                                                                                 |
                  | Non_Citizen | DuplicateB2cObjectId          | A record that has the attribute values B2C Object Id already exists.                                              |
                  | Non_Citizen | InvalidB2cObjectId            | B2C - Object - ID must be a valid Guid format.                                                                    |
                  | Non_Citizen | MissingFirstName              | Firstname is a required field                                                                                     |
           
        @api2-Done @smoke-Test @SmokeContact
        Scenario Outline: UPDATE an existing - <ContactType> - Contact details
    # Given I am a Web API user
             When I create a new <ContactType> Contact with <ValidationType> then expected message outcome is <StatusMsgCont>
              And I EDIT the newly created Contacts <FieldsToEdite> field then expected message outcome is <UpdateMsgCont>
    # Then a new Contact record should be created
        Examples:
                  | ContactType | ValidationType  | StatusMsgCont                     | FieldsToEdite | UpdateMsgCont |
                  | Citizen     | AllUK_Addresses | (contactid,defra_uniquereference) | firstName     | OK            |
                  | Citizen     | AllUK_Addresses | (contactid,defra_uniquereference) | lastName      | OK            |
                  | Citizen     | AllUK_Addresses | (contactid,defra_uniquereference) | phone         | OK            |
                  | Citizen     | AllUK_Addresses | (contactid,defra_uniquereference) | email         | OK            |
                  | Non_Citizen | AllUK_Addresses | (contactid,defra_uniquereference) | firstName     | OK            |
                  | Non_Citizen | AllUK_Addresses | (contactid,defra_uniquereference) | lastName      | OK            |
                  | Non_Citizen | AllUK_Addresses | (contactid,defra_uniquereference) | phone         | OK            |
                  | Non_Citizen | AllUK_Addresses | (contactid,defra_uniquereference) | email         | OK            |
