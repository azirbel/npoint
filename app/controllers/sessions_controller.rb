class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email].downcase)
    if user && user.authenticate(params[:password])
      log_in user
      remember user
      render json: user, serializer: UserSerializer
    else
      head :unprocessable_entity
    end
  end

  def destroy
    log_out if logged_in?
    head :ok
  end
end
