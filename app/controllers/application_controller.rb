class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #
  # TODO(azirbel): Re-enable
  # protect_from_forgery with: :exception unless Rails.env.development?

  include SessionsHelper
end
