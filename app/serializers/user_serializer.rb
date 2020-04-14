class UserSerializer < ActiveModel::Serializer
  attributes :name, :email, :avatar_url, :has_documents, :is_premium, :api_auth_token, :sample_update_url

  def avatar_url
    hash = Digest::MD5.hexdigest(object.email)
    "https://www.gravatar.com/avatar/#{hash}?d=identicon"
  end

  def has_documents
    return false unless scope.present?

    !scope.documents.empty?
  end

  def api_auth_token
    object.is_premium ? object.api_auth_token : nil
  end

  def sample_update_url
    url_for(controller: 'api/documents', subdomain: 'api', action: 'update', token: 'DOC_ID')
  end
end
