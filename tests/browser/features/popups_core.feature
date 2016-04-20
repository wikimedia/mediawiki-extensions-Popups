@chrome @en.m.wikipedia.beta.wmflabs.org @firefox @test2.m.wikipedia.org @vagrant @integration
Feature: Popups core
  Background:
    Given the hover cards test page is installed
      And I am logged in
      And HoverCards is enabled as a beta feature
      And I am on the "Popups test page" page
      And the Hovercards JavaScript module has loaded

  Scenario: Hover card is visible on mouse over
    And I hover over the first valid link
    Then I should see a hover card

  Scenario: Hover card is not visible on mouse out
    And I hover over the first valid link
    And I hover over the page header
    Then I should not see a hover card
