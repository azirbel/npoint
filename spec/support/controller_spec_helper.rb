module ControllerSpecHelper
  def log_in_user
    user = User.create
    log_in user
    user
  end
end
