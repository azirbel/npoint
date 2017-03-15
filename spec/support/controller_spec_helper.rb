module ControllerSpecHelper
  extend ActiveSupport::Concern

  def parsed_response
    result = case response.content_type
      when 'text/plain' then response.body
      else JSON.parse(response.body)
    end
    result = result.with_indifferent_access if result.is_a?(Hash)
    yield result if block_given?
    result
  end

  def parsed_response_ids
    parsed_response.map { |item| item['id'] }
  end

  def serialize_one(obj)
    JSON.parse(serializer.new(obj).to_json)
  end

  def serialize_many(*objs)
    objs.flatten.map { |o| serialize_one(o) }
  end
end
