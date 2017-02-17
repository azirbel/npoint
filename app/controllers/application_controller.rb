class ApplicationController < ActionController::Base
  include ApplicationHelper

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #
  # TODO(azirbel): Re-enable
  # protect_from_forgery with: :exception unless Rails.env.development?, prepend: true

  # TODO(azirbel): See if devise has something like this built in
  rescue_from CustomUnauthorized, with: :unauthorized

  def unauthorized
    render json: {}, status: :unauthorized
  end
end
