class AddOriginalContentsToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :original_contents, :string

    reversible do |dir|
      dir.up do
        Document.find_each do |document|
          if document.contents.present?
            document.update!(original_contents: JSON.pretty_generate(document.contents))
          end
        end
      end
    end
  end
end
