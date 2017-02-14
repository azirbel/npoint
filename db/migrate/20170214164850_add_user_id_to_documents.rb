class AddUserIdToDocuments < ActiveRecord::Migration
  def change
    add_column :documents, :user_id, :integer
    add_index :documents, :user_id
  end
end
