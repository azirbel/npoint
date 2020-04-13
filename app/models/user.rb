class User < ActiveRecord::Base
  has_secure_token :api_auth_token

  devise :database_authenticatable,
         :recoverable,
         :registerable,
         :rememberable,
         :trackable,
         :validatable

  has_many :documents
end
