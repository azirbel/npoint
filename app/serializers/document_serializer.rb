include Rails.application.routes.url_helpers

class DocumentSerializer < DocumentIndexSerializer
  EXAMPLE_SUBPROPERTY_DEPTH = 2

  attributes :api_url,
    :contents,
    :example_subproperty_url,
    :original_contents,
    :original_schema,
    :owned_by_current_user,
    :schema

  def api_url
    url_for(controller: 'api/documents', subdomain: 'api', action: 'show', token: object.token)
  end

  def example_subproperty_url
    return nil unless object.contents.present?
    return nil if object.contents.empty?

    url = api_url
    contents = object.contents

    for i in 1..EXAMPLE_SUBPROPERTY_DEPTH do
      break unless contents.present?
      key, contents = first_property(contents)
      url += "/#{key}" if key.present?
    end

    url
  end

  private

  def first_property(contents)
    if contents.is_a? Array
      return '0', contents[0]
    elsif contents.respond_to? :keys
      first_key = contents.keys.first
      return first_key, contents[first_key]
    else
      return nil, nil
    end
  end
end
