# Standard article page
class ArticlePage
  include PageObject

  page_url '<%= URI.encode(params[:article_name]) %>'\
           '<%= URI.encode(params[:query_string]) if params[:query_string] %>'\
           '<%= params[:hash] %>'
  div(:page_header, css: '#mw-head')
  a(:first_valid_link, css: 'ul a', index: 0)
  div(:hovercard, css: '.mwe-popups')
  a(:settings_icon, css: '.mwe-popups-settings-icon')
  radio(:enable_previews_radio, id: 'mwe-popups-settings-simple')
  radio(:disable_previews_radio, id: 'mwe-popups-settings-disable_previews')
  button(:cancel_settings_button, css: '#mwe-popups-settings-form button', index: 0)
  button(:save_settings_button, css: '#mwe-popups-settings-form button', index: 1)
  button(:settings_help_ok_button, css: '#mwe-popups-settings-help button', index: 0)
  a(:last_link_in_the_footer, css: '#footer-places a', index: -1)
end
