class DocumentsController < ApplicationController
  SERIALIZER = DocumentSerializer

  def index
    render json: Document.all, each_serializer: SERIALIZER
  end

  def show
    render json: document, serializer: SERIALIZER
  end

  def create
    @document = Document.create!(document_params)
    render json: document, serializer: SERIALIZER
  end

  def update
    document.update!(document_params)
    render json: document, serializer: SERIALIZER
  end

  def destroy
    document.destroy!
    head :ok
  end

  private

  def document
    @document ||= Document.find(params[:id])
  end

  # TODO(azirbel): Huge hackery
  # TODO(azirbel): Remove `params.require(:document)`, just access directly
  def document_params
    if params[:document][:contents]
      params
        .require(:document).permit(:title)
        .merge(contents: JSON.parse(params.try(:[], :document).try(:[], :contents) || {}))
    else
      params.require(:document).permit(:title)
    end
  end
end
