class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json
  after_filter :set_csrf_headers, only: [:create, :destroy]

  def info
    if user_signed_in?
      render json: current_user, serializer: UserSerializer
    else
      render json: {}
    end
  end

  def create
    binding.pry
    self.resource = warden.authenticate!(auth_options)
    binding.pry
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  rescue Exception => e
    binding.pry
  end

  def update
    if user_signed_in?
      current_user.update!(name: params[:name]) if params[:name].present?
      render json: current_user, serializer: UserSerializer
    else
      head :unauthorized
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

  def unauthorized
    head :unauthorized
  end

  protected

  # Override devise default
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
    if resource.valid?
      render json: resource, serializer: UserSerializer
    else
      head :unauthorized
    end
  end

  # Override devise default so we don't auto-redirect
  def respond_to_on_destroy
    head :ok
  end
end
