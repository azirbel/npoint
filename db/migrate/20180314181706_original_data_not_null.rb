class OriginalDataNotNull < ActiveRecord::Migration
  def change
    change_column_null :documents, :original_contents, false, ''
    change_column_null :documents, :original_schema, false, ''

    change_column_default :documents, :original_contents, ''
    change_column_default :documents, :original_schema, ''
  end
end
