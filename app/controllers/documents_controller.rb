class DocumentsController < ApplicationController
  SERIALIZER = DocumentSerializer

  before_action :authenticate_user!, :only => [:index]
  before_action :check_document_edit_rights!, :only => [:update, :destroy]

  def index
    render json: current_user.documents.order(:title, :created_at), each_serializer: DocumentIndexSerializer
  end

  def show
    render json: document, serializer: SERIALIZER
  end

  def create
    @document = Document.new(create_params.merge(user_id: current_user&.id))

    if params[:generate_contents]
      @document.contents = random_contents
    end

    unless @document.original_contents.present?
      @document.original_contents = JSON.pretty_generate(@document.contents)
    end
    @document.title = random_title unless @document.title

    @document.save!
    render json: @document, serializer: SERIALIZER
  rescue ActiveRecord::RecordInvalid
    # TODO(azirbel): test this
    head :bad_request
  end

  def update
    document.update!(update_params)
    render json: document, serializer: SERIALIZER
  rescue ActiveRecord::RecordInvalid
    # TODO(azirbel): test this
    head :bad_request
  end

  def destroy
    if document.contents_locked || document.schema_locked
      head :bad_request
    else
      document.destroy!
      head :ok
    end
  end

  def clone
    new_title = document.title.ends_with?(" (Copy)") ? document.title : "#{document.title} (Copy)"
    new_document = Document.create!(
      title: new_title,
      contents: document.contents,
      user: current_user,
      original_contents: document.original_contents,
      schema: document.schema,
      original_schema: document.original_schema
    )

    render json: new_document, serializer: SERIALIZER
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

  def update_params
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

  def create_params
    p = params.permit(:title,
                      :original_contents,
                      :contents_locked,
                      :original_schema,
                      :schema_locked)

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
    "Untitled (#{Faker::Food.dish})"
  end

  def random_contents
    {
      'next_steps' => [
        'Edit this JSON bin',
        'Sign up to make bins only you can edit',
        "Access this bin via the API (see the footer)"
      ]
    }
  end
end
