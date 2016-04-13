When(/^I hover over the page header$/) do
  on(ArticlePage).page_header_element.hover
  sleep 1  # and dwell on it for a sec to give time for the visible hover card hide itself
end

When(/^I hover over the first valid link$/) do
  on(ArticlePage).first_valid_link_element.hover
  sleep 1  # and dwell on it for a sec to give time for hover card to appear
end

Then(/^I should see a hover card$/) do
  expect(on(ArticlePage).hovercard_element).to be_visible
end

Then(/^I should not see a hover card$/) do
  expect(on(ArticlePage).hovercard_element).not_to be_visible
end
