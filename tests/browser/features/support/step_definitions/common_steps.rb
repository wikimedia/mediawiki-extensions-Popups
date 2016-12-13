TEST_PAGE_TITLE = 'Popups test page'

Given(/^I have enabled the beta feature$/) do
  visit(SpecialPreferencesPage).enable_page_previews
end

Given(/^I am on the test page$/) do
  api.create_page TEST_PAGE_TITLE, File.read('fixtures/test_page.wikitext')

  visit(ArticlePage, using_params: { article_name: TEST_PAGE_TITLE })
end

Given(/^the RL module has loaded$/) do
  on(ArticlePage) do |page|
    page.wait_until do
      browser.execute_script("return mw.loader.getState('ext.popups') === 'ready'")
    end
  end
end
