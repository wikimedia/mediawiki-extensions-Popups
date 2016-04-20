class SpecialPreferencesPage
  include PageObject
  page_url 'Special:Preferences'

  a(:beta_features_tab, css: '#preftab-betafeatures')
  text_field(:hovercards_checkbox, css: '#mw-input-wppopups')
  button(:submit_button, css: '#prefcontrol')
  div(:notification, css: ".mw-notification")

  def enable_hovercards
    beta_features_tab_element.when_present.click
    return unless hovercards_checkbox_element.attribute('checked').nil?
    hovercards_checkbox_element.click
    submit_button_element.when_present.click

    # Note well that Element#wait_until_present is more semantic but is
    # deprecated. Fortunately, #when_present simply wraps #wait_until_present.
    notification_element.when_present
  end
end
