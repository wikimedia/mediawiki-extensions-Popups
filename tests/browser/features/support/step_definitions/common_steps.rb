Given(/^the test page has been created$/) do
  api.create_page 'Popups test page', File.read('samples/links.wikitext')
end

Given(/^I am on the "(.*?)" page$/) do |page|
  visit(ArticlePage, using_params: { article_name: page })
end

Given(/^I have enabled the beta feature$/) do
  visit(SpecialPreferencesPage).enable_page_previews
end

Given(/^the RL module has loaded$/) do
  on(ArticlePage) do |page|
    page.wait_until do
      browser.execute_script("return mw.loader.getState('ext.popups') === 'ready'")
    end
  end
end
