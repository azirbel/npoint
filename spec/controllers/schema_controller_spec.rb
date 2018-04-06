RSpec.describe SchemaController do
  describe '#validate' do
    it 'is valid for an empty schema' do
      post :validate, params: { contents: '{}', schema: '{}' }

      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({
        "valid" => true,
        "errors" => []
      })
    end

    it 'is invalid for a type mismatch' do
      post :validate, params: { contents: '[]', schema: '{ "type": "object" }' }

      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({
        "valid" => false,
        "errors" => [
          "The data did not match the following type: object"
        ]
      })
    end

    context 'a schema that requires param "a"' do
      let(:schema) {
        '{ "required": ["a"] }'
      }

      it 'is invalid for a missing param' do
        post :validate, params: { contents: '{}', schema: schema }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq({
          "valid" => false,
          "errors" => [
            "The data did not contain a required property of 'a'"
          ]
        })
      end

      it 'is valid when the param is provided' do
        post :validate, params: { contents: '{ "a": 3 }', schema: schema }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq({
          "valid" => true,
          "errors" => []
        })
      end
    end

    context 'a schema that requires a nested param' do
      let(:schema) {
        '{ "properties": { "b": { "required": ["a"] } } }'
      }

      it 'is invalid for a missing param' do
        post :validate, params: { contents: '{ "b": { "c": 3 } }', schema: schema }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq({
          "valid" => false,
          "errors" => [
            "The property 'b' did not contain a required property of 'a'"
          ]
        })
      end

      it 'is valid when the param is provided' do
        post :validate, params: { contents: '{ "b": { "a": 3 } }', schema: schema }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq({
          "valid" => true,
          "errors" => []
        })
      end
    end
  end
end
