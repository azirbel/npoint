include Rails.application.routes.url_helpers

class DocumentSerializer < ActiveModel::Serializer
  attributes :token,
    :api_url,
    :contents,
    :contents_locked,
    :editable,
    :original_contents,
    :original_schema,
    :owned_by_current_user,
    :schema,
    :schema_locked,
    :title

  def api_url
    url_for(controller: 'api/documents', subdomain: 'api', action: 'show', token: object.token)
  end

  def editable
    object.editable_by_user?(scope)
  end

  def owned_by_current_user
    scope.present? && object.user === scope
  end
end
