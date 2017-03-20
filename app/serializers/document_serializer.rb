class DocumentSerializer < ActiveModel::Serializer
  attributes :token,
    :title,
    :editable,
    :contents

  def editable
    object.editable_by_user?(scope)
  end
end
