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
  end
end
