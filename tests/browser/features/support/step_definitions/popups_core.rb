When(/^I hover over the page header$/) do
  on(ArticlePage).page_header_element.hover
end

When(/^I hover over the first valid link$/) do
  on(ArticlePage).first_valid_link_element.hover
end

Then(/^I should see a hover card$/) do
  expect(on(ArticlePage).hovercard_element.when_present(5)).to be_visible
end

Then(/^I should not see a hover card$/) do
  # Requesting a hovercard hits API so wait time before asserting it did not show
  sleep 5
  expect(on(ArticlePage).hovercard_element).not_to be_visible
end
