RSpec.describe Api::DocumentsController do
  let(:contents) { {} }
  let!(:document) { create :document, contents: contents }

  # TODO(azirbel): Tests for not-found / failure cases

  describe '#show' do
    it 'handles empty JSON documents' do
      get :show, token: document.token
      expect(response).to have_http_status(200)
      expect(parsed_response).to eq({})
    end

    context 'with simple data' do
      let(:contents) { { 'name' => 'John', 'age' => 45 } }

      it 'returns the correct data' do
        get :show, token: document.token
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(contents)
      end

      it 'can access sub-properties' do
        get :show, token: document.token, path: 'name'

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('"John"')
      end

      it 'returns an error for bad sub-properties' do
        get :show, token: document.token, path: 'invalid-path'

        expect(response).to have_http_status(404)
      end
    end

    context 'with nested data' do
      let(:contents) { { 'a' => { 'b' => { 'c' => 'wow' } } } }

      it 'can access sub-properties' do
        get :show, token: document.token, path: 'a'

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(contents['a'])
      end

      it 'can access nested properties' do
        get :show, token: document.token, path: 'a/b/c'

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
        get :show, token: document.token, path: 'list/0'

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(contents['list'][0])
      end

      it 'can access the second index sub-properties' do
        get :show, token: document.token, path: 'list/1/s'

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('"second"')
      end

      it 'returns an error for non-integer indexes' do
        get :show, token: document.token, path: 'list/five'

        expect(response).to have_http_status(404)
      end

      it 'returns an error for invalid indexes' do
        get :show, token: document.token, path: 'list/30'

        expect(response).to have_http_status(404)
      end
    end

    describe 'content types' do
      RSpec.shared_examples 'an application/json response' do
        it 'returns application/json with the correct content' do
          get :show, token: document.token, path: 'data'

          expect(response).to have_http_status(200)
          expect(response.content_type).to eq('application/json')
          expect(parsed_response).to eq(contents['data'])
        end
      end

      RSpec.shared_examples 'a text/plain response' do
        it 'returns text/plain with the correct content' do
          get :show, token: document.token, path: 'data'

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
end
