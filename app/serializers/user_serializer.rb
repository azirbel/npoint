class UserSerializer < ActiveModel::Serializer
  attributes :name, :email, :avatar_url

  def avatar_url
    hash = Digest::MD5.hexdigest(object.email)
    "https://www.gravatar.com/avatar/#{hash}?d=identicon"
  end
end
