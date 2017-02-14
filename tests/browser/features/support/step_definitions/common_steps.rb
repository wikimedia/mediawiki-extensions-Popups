TEST_PAGE_TITLE = 'Popups test page'

Given(/^I have enabled the beta feature$/) do
  visit(SpecialPreferencesPage).enable_page_previews
end

Given(/^I am on the test page$/) do
  api.create_page TEST_PAGE_TITLE, File.read('fixtures/test_page.wikitext')

  visit(ArticlePage, using_params: { article_name: TEST_PAGE_TITLE }) do |page|
    page.wait_until_rl_module_ready('ext.popups')
  end
end
