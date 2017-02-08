class Api::DocumentsController < ApplicationController
  SERIALIZER = DocumentSerializer

  def show
    render json: document, serializer: SERIALIZER
  end

  private

  def document
    @document ||= Document.find(params[:id])
  end
end
