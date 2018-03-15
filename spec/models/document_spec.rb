RSpec.describe Document do
  let(:schema) { { required: ['a'] } }
  let(:good_contents) { { a: 3 } }
  let(:bad_contents) { { c: 2 } }

  let(:contents) { good_contents }
  let(:document) { Document.new(schema: schema, contents: contents) }

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
