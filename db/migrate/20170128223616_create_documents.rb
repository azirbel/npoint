class CreateDocuments < ActiveRecord::Migration
  def change
    create_table :documents do |t|
      t.string :title, null: false
      t.json :contents
      t.timestamps null: false
    end
  end
end
