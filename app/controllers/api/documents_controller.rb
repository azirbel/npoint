class Api::DocumentsController < ApplicationController
  protect_from_forgery with: :null_session # Disable CSRF

  class InvalidPathError < StandardError
  end

  class PathNotSupportedError < StandardError
  end

  before_action :check_api_update_rights!, :only => [:update]

  def show
    contents = document.contents

    if params[:path]
      params[:path].split('/').each do |path_part|
        if contents.is_a? Array
          begin
            path_part = Integer(path_part, 10)
          rescue ArgumentError
            raise InvalidPathError
          end
        end
        unless contents[path_part]
          raise InvalidPathError
        end
        contents = contents[path_part]
      end
    end

    # Content-Type `application/json` should only be used with JSON
    # objects and arrays.
    #
    # However, ECMA-404 allows other types of top-level objects to be valid
    # JSON as well (strings, integers, etc). Render these so that they can
    # be parsed as JSON (i.e. render `"abc"`, not `abc`), but set Content-Type
    # to be technically correct.
    #
    # http://stackoverflow.com/questions/18419428/what-is-the-minimum-valid-json
    # http://stackoverflow.com/questions/19569221/did-the-publication-of-ecma-404-affect-the-validity-of-json-texts-such-as-2-or
    case contents
    when Hash, Array
      render json: contents
    else
      render plain: contents.to_json
    end
  rescue InvalidPathError
    head :not_found
  end

  def update
    if params[:path]
      raise PathNotSupportedError
    end

    new_contents = fetch_json_or_nil(request.body.read)
    document.update!(contents: new_contents, original_contents: new_contents.as_json.to_json || '')
    render json: new_contents
  rescue PathNotSupportedError
    head :not_found
  rescue ActiveRecord::RecordInvalid
    head :bad_request
  end

  private

  def document
    @document ||= Document.find_by(token: params[:token])
  end

  def cors_set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token, X-CSRF-Token'
  end

  def cors_preflight_check
    if request.method == 'OPTIONS'
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
      headers['Access-Control-Request-Method'] = '*'
      headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token, X-CSRF-Token'

      render :text => '', :content_type => 'text/plain'
    end
  end

  def check_api_update_rights!
    if !document.present?
      return head :not_found
    end

    if !document.user.present?
      return
    end

    token = http_auth_token
    if token.nil? || token != document.user.api_auth_token
      return head :unauthorized
    end

    if !document.user.is_premium
      return head :payment_required
    end
  end

  def http_auth_token
    if request.headers['Authorization'].present?
      return request.headers['Authorization'].split(' ').last
    else
      return nil
    end
    nil
  end

  def fetch_json_or_nil(data)
    begin
      JSON.parse(data)
    rescue TypeError, JSON::ParserError
      nil
    end
  end
end
