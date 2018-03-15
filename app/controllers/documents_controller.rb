class DocumentsController < ApplicationController
  SERIALIZER = DocumentSerializer

  before_action :authenticate_user!, :only => [:index]
  before_action :check_document_edit_rights!, :only => [:update, :destroy]

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
    document.update!(document_params)
    render json: document, serializer: SERIALIZER
  end

  def destroy
    if document.contents_locked || document.schema_locked
      head :bad_request
    else
      document.destroy!
      head :ok
    end
  end

  private

  def document
    @document ||= Document.find_by!(token: params[:token])
  end

  def user_can_edit_document
    # Anonymous doc
    return true unless document.user.present?

    # User-owned doc
    user_signed_in? && current_user == document.user
  end

  def check_document_edit_rights!
    unless user_can_edit_document
      head :unauthorized
    end
  end

  def document_params
    p = params.permit(:title)

    unless document.contents_locked
      p = p.merge(params.permit(:original_contents, :contents_locked))

      if params.key?(:contents)
        p = p.merge(contents: fetch_json_or_nil(:contents))
      end

      unless document.schema_locked
        p = p.merge(params.permit(:original_schema, :schema_locked))

        if params.key?(:schema)
          p = p.merge(schema: fetch_json_or_nil(:schema))
        end
      end
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
