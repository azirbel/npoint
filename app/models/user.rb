class User < ActiveRecord::Base
  devise :database_authenticatable,
         :recoverable,
         :registerable,
         :rememberable,
         :trackable,
         :validatable

  has_many :documents
end
