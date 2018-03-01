class DocumentsController < ApplicationController
  SERIALIZER = DocumentSerializer

  # TODO(azirbel): Remove this when moving validations to new controller
  before_action :authenticate_user!, :except => [:show, :create, :update, :validate_schema]

  def index
    render json: current_user.documents, each_serializer: SERIALIZER
  end

  def show
    render json: document, serializer: SERIALIZER
  end

  def create
    @document = Document.new(document_params.merge(user_id: current_user&.id))

    if params[:generate_contents]
      @document.contents = random_contents
      @document.original_contents = JSON.pretty_generate(@document.contents)
    end
    @document.title = random_title unless @document.title

    @document.save!
    render json: @document, serializer: SERIALIZER
  end

  def update
    if document.user.present?
      if user_signed_in? && current_user == document.user
        document.update!(document_params)
        render json: document, serializer: SERIALIZER
      else
        head :unauthorized
      end
    else
      document.update!(document_params)
      render json: document, serializer: SERIALIZER
    end
  end

  def destroy
    document.destroy!
    head :ok
  end

  # TODO(azirbel): Move to another controller
  def validate_schema
    contents = JSON.parse(params.require(:contents))
    schema = JSON.parse(params.require(:schema))

    errors = JSON::Validator.fully_validate(schema, contents)
    render json: {
      valid: errors.blank?,
      errors: errors
    }
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
        .permit(:title, :original_contents)
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
