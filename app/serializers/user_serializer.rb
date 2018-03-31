class UserSerializer < ActiveModel::Serializer
  attributes :name, :email, :avatar_url, :has_documents

  def avatar_url
    hash = Digest::MD5.hexdigest(object.email)
    "https://www.gravatar.com/avatar/#{hash}?d=identicon"
  end

  def has_documents
    return false unless scope.present?

    !scope.documents.empty?
  end
end
