class UsersController < ApplicationController
  SERIALIZER = UserSerializer

  def show
    render json: user, serializer: SERIALIZER
  end

  def create
    binding.pry
    @user = User.create!(user_params)
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
