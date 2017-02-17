class RegistrationsController < Devise::RegistrationsController
  clear_respond_to
  respond_to :json

  private

  # TODO(azirbel): Use configure_permitted_parameters instead
  # like in opendoor/web?

  def sign_up_params
    params.permit(:name, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.permit(:name, :email, :password, :password_confirmation, :current_password)
  end

  # Override devise default so we always respond with JSON
  def respond_with(resource, *ignored)
    render json: resource, serializer: UserSerializer
  end
end
