class Lockdown < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :contents_locked, :boolean, null: false, default: false
    add_column :documents, :schema_locked, :boolean, null: false, default: false
  end
end
