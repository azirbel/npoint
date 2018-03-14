class SchemaController < ApplicationController
  def validate
    contents = JSON.parse(params.require(:contents))
    schema = JSON.parse(params.require(:schema))

    errors = JSON::Validator.fully_validate(schema, contents)
    render json: {
      valid: errors.blank?,
      errors: errors.map { |e| strip_schema_id(e) }
    }
  end

  def generate
    contents = JSON.parse(params.require(:contents))

    # TODO(azirbel): Naming?
    schema = JSON.parse(
      JSON::SchemaGenerator.generate(
        'TODO',
        contents.to_json,
        {:schema_version => 'draft4'}
      )
    )
    render json: {
      schema: schema,
      original_schema: JSON.pretty_generate(schema),
    }
  end

  private

  def strip_schema_id(error_message)
    error_message.gsub(/ in schema [a-z0-9-]*$/, '')
  end
end
