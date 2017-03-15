class Api::DocumentsController < ApplicationController
  # TODO(azirbel): Allow a ?type sort of param that would allow you
  # to get data back in e.g. "JSON API" format. Or XML. Or whatever.

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

    if contents.is_a? String
      render plain: contents
    else
      render json: contents
    end
  end

  private

  def document
    @document ||= Document.find_by(token: params[:token])
  end
end
