class DocumentSerializer < ActiveModel::Serializer
  attributes :id,
    :title,
    :contents
end
