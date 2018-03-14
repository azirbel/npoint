RSpec.describe SchemaController do
  describe '#validate' do
    it 'is valid for an empty schema' do
      post :validate, contents: '{}', schema: '{}'

      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({
        "valid" => true,
        "errors" => []
      })
    end

    it 'is invalid for a type mismatch' do
      post :validate, contents: '[]', schema: '{ "type": "object" }'

      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({
        "valid" => false,
        "errors" => [
          "The property '#/' of type array did not match the following type: object"
        ]
      })
    end

    context 'a schema that requires param "a"' do
      let(:schema) {
        '{ "required": ["a"] }'
      }

      it 'is invalid for a missing param' do
        post :validate, contents: '{}', schema: schema

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq({
          "valid" => false,
          "errors" => [
            "The property '#/' did not contain a required property of 'a'"
          ]
        })
      end

      it 'is valid when the param is provided' do
        post :validate, contents: '{ "a": 3 }', schema: schema

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq({
          "valid" => true,
          "errors" => []
        })
      end
    end
  end
end
