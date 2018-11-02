Feature: CM-XXX Login Customer Identity


    @desktop
    @phone
    @tablet
    Scenario: CM-XXX Login D365 UI
    # fetches appurlcrm defined in crmconfig, and waits for browser to be in 'complete' ready state 

        Given the CRM application has been launched
        And I am on the CRM login page 
        When I login into customer identity service
        Then I am logged in to Customer Master test
       # When I switch to "Defra Customer App (0.1)"
