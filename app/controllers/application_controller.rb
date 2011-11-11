class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_javascripts_and_stylesheets

  def set_javascripts_and_stylesheets
    @javascripts ||= []
  end
end
