class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # See http://alexzirbel.com/npoint-csrf-test/ for a live test.
  protect_from_forgery with: :exception, prepend: true unless Rails.env.development?

  rescue_from Exception, with: :internal_server_error
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  protected

  def not_found
    head :not_found
  end

  def internal_server_error
    head :internal_server_error
  end
end
