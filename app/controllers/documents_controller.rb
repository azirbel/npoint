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

  private

  def document
    @document ||= Document.find_by!(token: params[:token])
  end

  def document_params
    p = params.permit(:title, :original_contents, :original_schema)

    if params.key?(:contents)
      p = p.merge(contents: fetch_json_or_nil(:contents))
    end

    if params.key?(:schema)
      p = p.merge(schema: fetch_json_or_nil(:schema))
    end

    p
  end

  def fetch_json_or_nil(param)
    begin
      JSON.parse(params.try(:[], param))
    rescue TypeError
      nil
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
