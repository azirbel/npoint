class AddApiAuthTokenToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :api_auth_token, :string
    add_index :users, :api_auth_token, unique: true

    add_column :users, :is_premium, :boolean, null: false, default: false
  end
end
