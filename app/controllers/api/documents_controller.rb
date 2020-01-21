class Api::DocumentsController < ApplicationController
  class InvalidPathError < StandardError
  end

  before_action :check_document_edit_rights!, :only => [:update]

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
    new_contents = JSON.parse(request.body.read)
    document.update!(contents: new_contents, original_contents: new_contents.as_json)
    render json: new_contents
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

  def user_can_edit_document
    # Anonymous doc
    return true unless document.user.present?

    # User-owned doc
    # TODO(api-update): Check token permissions
    true
  end

  def check_document_edit_rights!
    unless user_can_edit_document
      head :unauthorized
    end
  end
end
