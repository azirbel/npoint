class AddTokenToDocuments < ActiveRecord::Migration
  def change
    add_column :documents, :token, :string, null: false
    add_index :documents, :token
  end
end
