class DocumentSerializer < ActiveModel::Serializer
  attributes :token,
    :title,
    :editable,
    :contents,
    :original_contents

  def editable
    object.editable_by_user?(scope)
  end
end
