include Rails.application.routes.url_helpers

class DocumentSerializer < ActiveModel::Serializer
  EXAMPLE_SUBPROPERTY_DEPTH = 2

  attributes :token,
    :api_url,
    :contents,
    :contents_locked,
    :editable,
    :example_subproperty_url,
    :original_contents,
    :original_schema,
    :owned_by_current_user,
    :schema,
    :schema_locked,
    :title

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

  def editable
    object.editable_by_user?(scope)
  end

  def owned_by_current_user
    scope.present? && object.user === scope
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
