When(/^I hover over the page header$/) do
  on(ArticlePage).page_header_element.hover
end

When(/^I hover over the first valid link$/) do
  on(ArticlePage).first_valid_link_element.hover
end

When(/^I see a hover card$/) do
  on(ArticlePage).hovercard_element.when_present
end

When(/^I open the popups settings dialog of the first valid link$/) do
  step("I hover over the first valid link")
  on(ArticlePage).settings_icon_element.when_present.click
end

When(/^I dismiss the popups settings dialog of the first valid link$/) do
  on(ArticlePage).cancel_settings_button_element.when_present.click
end

When(/^I disable previews in the popups settings$/) do
  on(ArticlePage) do |page|
    page.settings_icon_element.when_present.click
    page.disable_previews_radio_element.when_present.click
    page.save_settings_button_element.when_present.click
    page.settings_help_ok_button_element.when_present.click
  end
end

When(/^I enable previews in the popups settings$/) do
  step("I see the enable previews link in the footer")
  on(ArticlePage) do |page|
    page.last_link_in_the_footer_element.when_present.click
    page.enable_previews_radio_element.when_present.click
    page.save_settings_button_element.when_present.click
  end
end

When(/^I see the enable previews link in the footer$/) do
  on(ArticlePage) do |page|
    page.wait_until do
      page.last_link_in_the_footer_element.when_present.text.include? 'Enable previews'
    end
  end
end

When(/^I do not see the enable previews link in the footer$/) do
  !on(ArticlePage).last_link_in_the_footer_element.when_present.text.include? 'Enable previews'
end

Then(/^I should see a hover card$/) do
  expect(on(ArticlePage).hovercard_element.when_present(5)).to be_visible
end

Then(/^I should not see a hover card$/) do
  # Requesting a hovercard hits API so wait time before asserting it did not show
  sleep 5
  expect(on(ArticlePage).hovercard_element).not_to be_visible
end

Then(/^I should see the enable previews link in the footer$/) do
  on(ArticlePage) do |page|
    page.wait_until do
      page.last_link_in_the_footer_element.when_present.text.include? 'Enable previews'
    end
    expect(page.last_link_in_the_footer_element.when_present.text).to match 'Enable previews'
  end
end

Then(/^I should not see the enable previews link in the footer$/) do
  expect(on(ArticlePage).last_link_in_the_footer_element.when_present.text).not_to match 'Enable previews'
end

