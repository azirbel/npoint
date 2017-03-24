class ApplicationController < ActionController::Base
  class ContentNotFoundError < StandardError; end

  # Prevent CSRF attacks by raising an exception.
  # See http://alexzirbel.com/npoint-csrf-test/ for a live test.
  protect_from_forgery with: :exception, prepend: true unless Rails.env.development?

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ContentNotFoundError, with: :not_found

  def not_found
    head :not_found
  end
end
