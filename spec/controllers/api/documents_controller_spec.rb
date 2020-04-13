RSpec.describe Api::DocumentsController do
  let(:contents) { {} }
  let(:owner) { nil }
  let(:schema) { nil }
  let!(:document) { create :document, contents: contents, user: owner, schema: schema }

  # TODO(test): Not-found / failure cases

  describe '#show' do
    it 'handles empty JSON documents' do
      get :show, params: { token: document.token }
      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({})
    end

    context 'with simple data' do
      let(:contents) { { 'name' => 'John', 'age' => 45 } }

      it 'returns the correct data' do
        get :show, params: { token: document.token }
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(contents)
      end

      it 'can access sub-properties' do
        get :show, params: { token: document.token, path: 'name' }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('"John"')
      end

      it 'returns an error for bad sub-properties' do
        get :show, params: { token: document.token, path: 'invalid-path' }

        expect(response).to have_http_status(404)
      end
    end

    context 'with nested data' do
      let(:contents) { { 'a' => { 'b' => { 'c' => 'wow' } } } }

      it 'can access sub-properties' do
        get :show, params: { token: document.token, path: 'a' }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(contents['a'])
      end

      it 'can access nested properties' do
        get :show, params: { token: document.token, path: 'a/b/c' }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('"wow"')
      end
    end

    context 'with array data' do
      let(:contents) do
        {
          'list' => [
            { 'f' => 'first', },
            { 's' => 'second', },
            { 't' => 'third', }
          ]
        }
      end

      it 'can access the first by index' do
        get :show, params: { token: document.token, path: 'list/0' }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(contents['list'][0])
      end

      it 'can access the second index sub-properties' do
        get :show, params: { token: document.token, path: 'list/1/s' }

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('"second"')
      end

      it 'returns an error for non-integer indexes' do
        get :show, params: { token: document.token, path: 'list/five' }

        expect(response).to have_http_status(404)
      end

      it 'returns an error for invalid indexes' do
        get :show, params: { token: document.token, path: 'list/30' }

        expect(response).to have_http_status(404)
      end
    end

    describe 'content types' do
      RSpec.shared_examples 'an application/json response' do
        it 'returns application/json with the correct content' do
          get :show, params: { token: document.token, path: 'data' }

          expect(response).to have_http_status(200)
          expect(response.content_type).to eq('application/json')
          expect(parsed_response).to eq(contents['data'])
        end
      end

      RSpec.shared_examples 'a text/plain response' do
        it 'returns text/plain with the correct content' do
          get :show, params: { token: document.token, path: 'data' }

          expect(response).to have_http_status(200)
          expect(response.content_type).to eq('text/plain')
          expect(parsed_response).to eq(contents['data'].to_json)
        end
      end

      it_behaves_like 'an application/json response' do
        let(:contents) { { 'data' => {} } }
      end

      it_behaves_like 'an application/json response' do
        let(:contents) { { 'data' => ['a', 'b'] } }
      end

      it_behaves_like 'a text/plain response' do
        let(:contents) { { 'data' => 'abc' } }
      end

      it_behaves_like 'a text/plain response' do
        let(:contents) { { 'data' => true } }
      end

      it_behaves_like 'a text/plain response' do
        let(:contents) { { 'data' => 99 } }
      end
    end
  end

  describe '#update' do
    let(:contents) { { 'name' => 'John', 'age' => 45 } }
    let(:new_contents) { { 'name' => 'Rishab' } }
    let(:bearer_token) { nil }

    before do
      if bearer_token
        request.headers["Authorization"] = "Bearer #{bearer_token}"
      end
    end

    RSpec.shared_examples 'a valid request' do
      it 'updates the document and returns the contents' do
        expect {
          post :update, params: { token: document.token }, body: new_contents.to_json

          expect(response).to have_http_status(200)
          expect(response.content_type).to eq('application/json')
          expect(parsed_response).to eq(new_contents)
        }.to change{ document.reload.contents }.from(contents).to(new_contents)
      end
    end

    RSpec.shared_examples 'a denied request' do |error_code|
      it 'returns an error and does not update the document' do
        expect {
          post :update, params: { token: document.token }, body: new_contents.to_json

          expect(response).to have_http_status(error_code || 401)
        }.not_to change{ document.reload.contents }
      end
    end

    # Public document
    it_behaves_like 'a valid request'

    it_behaves_like 'a valid request' do
      let(:new_contents) { {} }
    end

    it_behaves_like 'a valid request' do
      let(:new_contents) { ["abc"] }
    end

    context 'with an unnecessary auth token' do
      let!(:bearer_token) { 'WHY' }

      it_behaves_like 'a valid request'
    end

    context 'with a private document' do
      let(:owner_is_premium) { true }
      let(:owner) { create :user, api_auth_token: '123', is_premium: owner_is_premium }

      it_behaves_like 'a denied request'

      it_behaves_like 'a valid request' do
        let!(:bearer_token) { '123' }
      end

      it_behaves_like 'a denied request' do
        let!(:bearer_token) { 'WRONG' }
      end

      it_behaves_like 'a denied request', 402 do
        let!(:bearer_token) { '123' }
        let(:owner_is_premium) { false }
      end

      it_behaves_like 'a denied request' do
        let!(:non_owner) { create :user, api_auth_token: '456', is_premium: true }
        let!(:bearer_token) { '456' }
      end
    end

    context 'with a schema' do
      let(:schema) {
        {
          "type": "object",
          "required": [
            "name"
          ],
          "properties": {
            "name": {
              "type": "string"
            }
          }
        }
      }

      it_behaves_like 'a valid request'

      it_behaves_like 'a denied request', 400 do
        let(:new_contents) { ["abc"] }
      end
    end

    it 'fails if a path is given' do
      expect {
        post :update, params: { token: document.token, path: 'name' }, body: new_contents.to_json
        expect(response).to have_http_status(404)
      }.not_to change{ document.reload.contents }
    end
  end
end
