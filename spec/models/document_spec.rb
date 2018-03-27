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
  end
end
