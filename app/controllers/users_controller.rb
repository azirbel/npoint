class UsersController < ApplicationController
  SERIALIZER = UserSerializer

  def me
    if user_signed_in?
      render json: current_user, serializer: SERIALIZER
    else
      render json: {}
    end
  end
end
