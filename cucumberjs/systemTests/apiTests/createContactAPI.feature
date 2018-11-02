Feature: CM-146 As a Web API User

I want to be able to consume the D365 WebAPI Actions

SO that I can create a contact record in D365 Customer Master.

Acceptance Criteria:
The D365 WebAPI Create Contact Actions can be called using the Microsoft provided guidelines

@api
  Scenario: CM-146 Web API User creates a new contact
  #  Given I am a Web API user
    When  I send an API request to create a new contact
   # Then a new contact record is created ---- need to implement GET request(once available) to verify contact record.