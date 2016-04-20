Given(/^the hover cards test page is installed$/) do
  api.create_page 'Popups test page', File.read('samples/links.wikitext')
end

Given(/^I am on the "(.*?)" page$/) do |page|
  visit(ArticlePage, using_params: { article_name: page })
end

Then(/^HoverCards is enabled as a beta feature$/) do
  visit(SpecialPreferencesPage).enable_hovercards
end

Given(/^the Hovercards JavaScript module has loaded$/) do
  on(ArticlePage) do |page|
    page.wait_until do
      browser.execute_script("return mw.loader.getState('ext.popups.desktop') === 'ready'")
    end
  end
end
