class DocumentsController < ApplicationController
  def show
    render json: document.contents || {}
  end

  def create
    @document = Document.new(document_params)
    head :created
  end

  def update
    document.update!(document_params)
    head :ok
  end

  private

  def document
    @document ||= Document.find(params[:id])
  end

  def document_params
    params.require(:document).permit(:title, :contents)
  end
end
