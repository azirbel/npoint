class AddTokenToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :token, :string, null: false
    add_index :documents, :token
  end
end
