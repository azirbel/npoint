class CreateDocuments < ActiveRecord::Migration[5.1]
  def change
    create_table :documents do |t|
      t.string :title, null: false
      t.jsonb :contents
      t.timestamps null: false
    end
  end
end
