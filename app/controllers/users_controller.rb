class UsersController < ApplicationController
  SERIALIZER = UserSerializer

  # TODO(azirbel): Finalize ignore ID query param
  def show
    if current_user
      render json: current_user, serializer: SERIALIZER
    else
      render json: {}
    end
  end

  def create
    @user = User.create!(user_params)
    log_in @user
    render json: user, serializer: SERIALIZER
  end

  private

  def user
    @user ||= User.find(params[:id])
  end

  def user_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
