class DocumentsController < ApplicationController
  SERIALIZER = DocumentSerializer

  before_action :authenticate_user!, :except => [:show, :create, :update]

  def index
    render json: current_user.documents, each_serializer: SERIALIZER
  end

  def show
    render json: document, serializer: SERIALIZER
  end

  def create
    @document = Document.new(document_params.merge(user_id: current_user&.id))

    @document.contents = random_contents if params[:generate_contents]
    @document.title = random_title unless @document.title

    @document.save!
    render json: @document, serializer: SERIALIZER
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
    @document ||= Document.find_by!(token: params[:token])
  end

  # TODO(azirbel): Huge hackery
  # TODO(azirbel): Remove `params.require(:document)`, just access directly
  def document_params
    if params[:contents]
      params
        .permit(:title)
        .merge(contents: JSON.parse(params.try(:[], :contents) || {}))
    else
      params.permit(:title)
    end
  end

  def random_title
    "Untitled (#{Faker::App.name})"
  end

  def random_contents
    {
      'next_steps' => [
        'Edit this JSON document',
        'Make an account so you can edit it later',
        'Try accessing it via the API!'
      ],
      'data' => {
        'advice' => Faker::Hacker.say_something_smart,
        Faker::Hacker.noun => Faker::Hacker.adjective,
        Faker::Hacker.noun => Faker::Hacker.adjective
      }
    }
  end
end
