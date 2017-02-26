class Api::DocumentsController < ApplicationController
  def show
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    render json: document.contents
  end

  private

  def document
    @document ||= Document.find_by(token: params[:token])
  end
end
