class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    @url = 'http://www.google.com'
    mail(to: @user.email, subject: 'Welcome to My Awesome Site')
  end
end
