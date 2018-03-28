include Rails.application.routes.url_helpers

class DocumentIndexSerializer < ActiveModel::Serializer
  attributes :token,
    :contents_locked,
    :editable,
    :owned_by_current_user,
    :schema_locked,
    :title

  def editable
    object.editable_by_user?(scope)
  end

  def owned_by_current_user
    scope.present? && object.user === scope
  end
end
