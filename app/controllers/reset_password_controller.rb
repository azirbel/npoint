class ResetPasswordController < ApplicationController
  # TODO(azirbel): Rate limit
  def send_reset_password_email
    user = User.find_by!(email: params.require(:email))
    token = set_reset_password_token(user)
    email_sent = Npointmail.reset_password(user, token)
    if email_sent
      head :ok
    else
      head :service_unavailable
    end
  end

  # Taken and modified from
  # https://github.com/plataformatec/devise/blob/f39c6fd92774cb66f96f546d8d5e8281542b4e78/lib/devise/models/recoverable.rb
  def reset_password
    original_token = params.require(:reset_token)
    reset_password_token = Devise.token_generator.digest(
      User,
      :reset_password_token,
      original_token
    )
    user = User.find_by!(reset_password_token: reset_password_token)

    if user.persisted?
      # TODO(azirbel): Test timeout
      if user.reset_password_period_valid?
        user.reset_password(params.require(:password), params.require(:password))
        user.update!(reset_password_token: nil)
        sign_in(:user, user)
      else
        user.errors.add(:reset_password_token, :expired)
      end
    end

    render json: user, serializer: UserSerializer
  rescue ActiveRecord::RecordNotFound
    head :bad_request
  end

  private

  # From
  # https://github.com/plataformatec/devise/blob/f39c6fd92774cb66f96f546d8d5e8281542b4e78/lib/devise/models/recoverable.rb
  def set_reset_password_token(user)
    raw, enc = Devise.token_generator.generate(User, :reset_password_token)

    user.reset_password_token = enc
    user.reset_password_sent_at = Time.now.utc
    user.save(validate: false)
    raw
  end
end
