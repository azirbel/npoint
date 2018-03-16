class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json
  after_filter :set_csrf_headers, only: [:create, :destroy]

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

  def update
    if user_signed_in? and params[:name].present?
      current_user.update!(name: params[:name])
      render json: current_user, serializer: UserSerializer
    elsif params[:password].present?
      # TODO(azirbel): Move to a different route
      # Taken and modified from
      # https://github.com/plataformatec/devise/blob/f39c6fd92774cb66f96f546d8d5e8281542b4e78/lib/devise/models/recoverable.rb

      original_token = params[:reset_token]
      reset_password_token = Devise.token_generator.digest(
        User,
        :reset_password_token,
        original_token
      )
      user = User.find_by!(reset_password_token: reset_password_token)

      if user.persisted?
        if user.reset_password_period_valid?
          user.reset_password(params[:password], params[:password])
          user.update!(reset_password_token: nil)
          sign_in(:user, user)
        else
          user.errors.add(:reset_password_token, :expired)
        end
      end

      render json: user, serializer: UserSerializer
    else
      head :unauthorized
    end
  end

  def send_reset_password_email
    token = set_reset_password_token(current_user)
    email_sent = Npointmail.reset_password(current_user, token)
    if email_sent
      head :ok
    else
      # TODO(azirbel): Test this
      head :service_unavailable
    end
  end

  # Render a goblin if the user is signed in, or an ogre if they are signed out.
  # This is just for CSRF testing. It bothers me that lack of CSRF checking for
  # GET requests leaks information about whether the user is signed in.
  #
  # See http://alexzirbel.com/npoint-csrf-test/.
  def image
    if user_signed_in?
      send_file 'public/img/goblin.png', type: 'image/png', disposition: 'inline'
    else
      send_file 'public/img/ogre.png', type: 'image/png', disposition: 'inline'
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

  # The CSRF token changes on login and logout. Send the new token
  # back with a successful login response, so the frontend can keep working.
  def set_csrf_headers
    response.headers['X-CSRF-Token'] = form_authenticity_token
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
