class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json

  # TODO(azirbel): Extremely annoying warden expects sign in params
  # to be in format { user: { email: ... } }. Refactor so you can just
  # send { email: ... }

  def info
    if user_signed_in?
      render json: current_user, serializer: UserSerializer
    else
      render json: {}
    end
  end

  # TODO(azirbel): This is a lot of code for a pretty simple 401 response
  # on failure
  def unauthorized
    head :unauthorized
  end

  protected

  # TODO(azirbel): This is a lot of code for a pretty simple 401 response
  # on failure
  def auth_options
    { scope: resource_name, recall: "#{controller_path}#unauthorized" }
  end

  private

  # Override devise default so we always respond with JSON
  def respond_with(resource, *ignored)
    render json: resource, serializer: UserSerializer
  end

  # Override devise default so we don't redirect
  def respond_to_on_destroy
    head :ok
  end
end
