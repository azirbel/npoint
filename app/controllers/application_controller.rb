class ApplicationController < ActionController::Base
  class ContentNotFoundError < StandardError; end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #
  # TODO(azirbel): Re-enable
  # protect_from_forgery with: :exception unless Rails.env.development?, prepend: true

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ContentNotFoundError, with: :not_found

  def not_found
    head :not_found
  end
end
