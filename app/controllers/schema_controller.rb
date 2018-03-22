class SchemaController < ApplicationController
  def validate
    contents = JSON.parse(params.require(:contents))
    schema = JSON.parse(params.require(:schema))

    errors = JSON::Validator.fully_validate(schema, contents)
    render json: {
      valid: errors.blank?,
      errors: errors.map { |e| improve_readability(e) }
    }
  end

  def generate
    contents = JSON.parse(params.require(:contents))

    schema = JSON.parse(
      JSON::SchemaGenerator.generate(
        'npoint',
        contents.to_json,
        {:schema_version => 'draft4'}
      )
    )

    # Mostly just confusing information
    schema.delete('$schema')
    schema.delete('description')

    render json: {
      schema: schema,
      original_schema: JSON.pretty_generate(schema),
    }
  end

  private

  def improve_readability(error_message)
    msg = error_message
    msg = strip_schema_id(msg)
    msg = rename_root_element(msg)
    msg = rename_root_reference(msg)
    msg
  end

  def strip_schema_id(error_message)
    error_message.gsub(/ in schema [a-z0-9-]*$/, '')
  end

  # BAD:
  # The property '#/' of type array did not match the following type: object
  # The property '#/' did not contain a required property of 'a'
  #
  # GOOD:
  # The data did not match the following type: object
  # The data did not contain a required property of 'a'
  def rename_root_element(error_message)
    error_message.gsub(/^The property \'#\/\'( of type array)?/, 'The data')
  end

  # BAD:
  # The property '#/b' did not contain a required property of 'a'
  #
  # GOOD:
  # The property 'b' did not contain a required property of 'a'
  def rename_root_reference(error_message)
    error_message.gsub(/^The property \'#\//, "The property '")
  end
end
