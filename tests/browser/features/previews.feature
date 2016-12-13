@chrome @en.m.wikipedia.beta.wmflabs.org @firefox @test2.m.wikipedia.org @vagrant @integration
Feature: Previews
  Background:
    Given I am logged in
    And I have enabled the beta feature
    And I am on the test page

  Scenario: Dwelling on a valid link shows a preview
    When I dwell on the first valid link
    Then I should see a preview

  Scenario: Abandoning the link hides the preview
    When I dwell on the first valid link
    And I abandon the link
    Then I should not see a preview
