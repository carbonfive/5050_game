module ApplicationHelper
  def inject_js
    @javascripts.uniq
  end
end
