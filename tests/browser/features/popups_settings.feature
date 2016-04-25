@chrome @en.m.wikipedia.beta.wmflabs.org @firefox @test2.m.wikipedia.org @vagrant @integration
Feature: Popups settings
  Background:
    Given the hover cards test page is installed
    And I am logged in
    And HoverCards is enabled as a beta feature
    And I am on the "Popups test page" page
    And the Hovercards JavaScript module has loaded

  Scenario: "Enable previews" footer link correctly appears
    And I do not see the enable previews link in the footer
    And I hover over the first valid link
    And I see a hover card
    And I disable previews in the popups settings
    Then I should see the enable previews link in the footer

  Scenario: Disabling previews in the popup settings correctly disables popups
    And I do not see the enable previews link in the footer
    And I hover over the first valid link
    And I see a hover card
    And I disable previews in the popups settings
    And I hover over the first valid link
    Then I should not see a hover card

  Scenario: "Enable previews" footer link correctly disappears
    And I do not see the enable previews link in the footer
    And I hover over the first valid link
    And I see a hover card
    And I disable previews in the popups settings
    And I enable previews in the popups settings
    Then I should not see the enable previews link in the footer

  Scenario: Popups can be enabled via the "Enable previews" footer link
    And I do not see the enable previews link in the footer
    And I hover over the first valid link
    And I see a hover card
    And I disable previews in the popups settings
    And I enable previews in the popups settings
    And I hover over the first valid link
    Then I should see a hover card

  Scenario: Dismissing settings dialog does not change popups settings
    And I hover over the first valid link
    And I see a hover card
    And I open the popups settings dialog of the first valid link
    And I dismiss the popups settings dialog of the first valid link
    And I hover over the first valid link
    Then I should see a hover card
