class SpecialPreferencesPage
  include PageObject
  page_url 'Special:Preferences'

  a(:beta_features_tab, css: '#preftab-betafeatures')
  text_field(:hovercards_checkbox, css: '#mw-input-wppopups')
  button(:submit_button, css: '#prefcontrol')

  def enable_hovercards
    beta_features_tab_element.when_present.click
    return unless hovercards_checkbox_element.attribute('checked').nil?
    hovercards_checkbox_element.click
    submit_button_element.when_present.click
  end
end