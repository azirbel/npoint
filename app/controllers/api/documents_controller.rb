class Api::DocumentsController < ApplicationController
  def show
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

    contents = document.contents

    if params[:path]
      params[:path].split('/').each do |path_part|
        if contents.is_a? Array
          path_part = path_part.to_i
        end
        unless contents[path_part]
          raise ApplicationController::ContentNotFoundError
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
  end

  private

  def document
    @document ||= Document.find_by(token: params[:token])
  end
end
