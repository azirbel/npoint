class AddSchemaToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :schema, :jsonb
    add_column :documents, :original_schema, :string
  end
end
