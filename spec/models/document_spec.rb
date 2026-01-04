RSpec.describe Document do
  let(:schema) { { required: ['a'] } }
  let(:good_contents) { { a: 3 } }
  let(:bad_contents) { { c: 2 } }

  let(:contents) { good_contents }
  let(:document) { Document.new(title: 'Untitled', schema: schema, contents: contents) }

  describe 'create_unique_identifier' do
    context 'if the token is already taken' do
      let!(:existing_document1) { create(:document) }
      let!(:existing_document2) { create(:document) }

      before do
        existing_document1.update!(token: 'TOKEN_1')
        existing_document2.update!(token: 'TOKEN_2')
      end

      it 'generates a new token' do
        counter = 0
        allow(SecureRandom).to receive(:hex) { |l| counter += 1; "TOKEN_#{counter}" }

        document.save!
        expect(document.token).to eq('TOKEN_3')
      end
    end
  end

  describe 'validations' do
    context 'when the contents match the schema' do
      let(:contents) { good_contents }

      it 'is valid' do
        expect(document.valid?).to be(true)
        expect(document.errors.messages).to eq({})
      end
    end

    context 'when the contents do not match the schema' do
      let(:contents) { bad_contents }

      it 'is invalid' do
        expect(document.valid?).to be(false)
        expect(document.errors.messages[:contents]).to include('does not match schema')
      end
    end

    context 'when the schema is nil' do
      let(:contents) { bad_contents }
      let(:schema) { nil }

      it 'is valid' do
        expect(document.valid?).to be(true)
        expect(document.errors.messages).to eq({})
      end
    end

    context 'when the schema is []' do
      let(:contents) { bad_contents }
      let(:schema) { [] }

      it 'is valid' do
        expect(document.valid?).to be(true)
        expect(document.errors.messages).to eq({})
      end
    end

    context 'when the schema is {}' do
      let(:contents) { bad_contents }
      let(:schema) { {} }

      it 'is valid' do
        expect(document.valid?).to be(true)
        expect(document.errors.messages).to eq({})
      end
    end

    context 'document size limits' do
      let(:small_contents) { { 'data' => 'small' } }
      let(:large_contents) { { 'data' => 'x' * (Document::MAX_CONTENTS_SIZE_BYTES + 1000) } }
      let(:schema) { nil }

      context 'when contents are under the limit' do
        let(:contents) { small_contents }

        it 'is valid' do
          expect(document.valid?).to be(true)
          expect(document.errors.messages).to eq({})
        end
      end

      context 'when updating with contents over the limit' do
        it 'raises an error on save' do
          document = create(:document, contents: small_contents)
          document.contents = large_contents
          document.original_contents = JSON.generate(large_contents)

          expect { document.save! }.to raise_error(Document::OverSizeLimit, /is too large/)
        end
      end

      context 'when an existing large document is not modified' do
        it 'remains valid' do
          # Create a document with large contents by bypassing validations
          document = create(:document, contents: small_contents)
          document.update_column(:contents, large_contents)

          # Reload and verify it can be loaded
          reloaded = Document.find(document.id)
          expect(reloaded).to be_present
          expect(reloaded.contents).to eq(large_contents)

          # Should be valid when not changing contents
          reloaded.title = 'Updated title'
          expect(reloaded.valid?).to be(true)
        end
      end

      context 'when a rejected edit to a large document preserves original state' do
        it 'keeps the document in its pre-edit state after failed save' do
          # Create a document with large contents by bypassing validations
          original_large_contents = { 'data' => 'x' * (Document::MAX_CONTENTS_SIZE_BYTES + 1000) }
          document = create(:document, contents: small_contents)
          document.update_column(:contents, original_large_contents)

          # Reload the document
          reloaded = Document.find(document.id)

          # Try to edit the large document (should fail)
          new_large_contents = { 'data' => 'y' * (Document::MAX_CONTENTS_SIZE_BYTES + 2000) }
          reloaded.contents = new_large_contents
          reloaded.original_contents = JSON.generate(new_large_contents)

          expect { reloaded.save! }.to raise_error(Document::OverSizeLimit, /is too large/)

          # Verify the document still has its original contents in the database
          reloaded.reload
          expect(reloaded.contents).to eq(original_large_contents)
          expect(reloaded).to be_valid
        end
      end
    end
  end
end
