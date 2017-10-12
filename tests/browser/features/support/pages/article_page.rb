# Standard article page
class ArticlePage
  include PageObject

  page_url '<%= URI.encode(params[:article_name]) %>'\
           '<%= URI.encode(params[:query_string]) if params[:query_string] %>'\
           '<%= params[:hash] %>'
  div(:page_header, css: '#mw-head')
  a(:first_valid_link, css: 'ul a', index: 0)
  div(:hovercard, css: '.mwe-popups')
end
