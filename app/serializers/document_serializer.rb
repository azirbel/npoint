class DocumentSerializer < ActiveModel::Serializer
  attributes :token,
    :title,
    :contents
end
