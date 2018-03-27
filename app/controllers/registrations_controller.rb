class RegistrationsController < Devise::RegistrationsController
  clear_respond_to
  respond_to :json

  private

  def sign_up_params
    params.permit(:name, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.permit(:name, :email, :password, :password_confirmation, :current_password)
  end

  # Override devise default so we always respond with JSON
  def respond_with(resource, *ignored)
    # We lose this info from devise. DON'T SAVE!
    resource.password = params[:password]

    if resource.valid?
      render json: resource, serializer: UserSerializer
    else
      render json: { errors: resource.errors.full_messages }
    end
  end
end
