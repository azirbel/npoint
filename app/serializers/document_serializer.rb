class DocumentSerializer < ActiveModel::Serializer
  attributes :token,
    :contents,
    :contents_locked,
    :editable,
    :original_contents,
    :original_schema,
    :schema,
    :schema_locked,
    :title

  def editable
    object.editable_by_user?(scope)
  end
end
