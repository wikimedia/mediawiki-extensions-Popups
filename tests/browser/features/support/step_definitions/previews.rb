When(/^I dwell on the first valid link$/) do
  on(ArticlePage).first_valid_link_element.hover
end

When(/^I abandon the link$/) do
  on(ArticlePage).page_header_element.hover
end

Then(/^I should see a preview$/) do
  expect(on(ArticlePage).hovercard_element.when_present(5)).to be_visible
end

Then(/^I should not see a preview$/) do

  # Requesting a preview hits the API so wait some time before asserting it did
  # not show.
  sleep 5

  expect(on(ArticlePage).hovercard_element).not_to be_visible
end
