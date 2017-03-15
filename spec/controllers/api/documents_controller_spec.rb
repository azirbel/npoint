RSpec.describe Api::DocumentsController do
  let(:contents) { {} }
  let!(:document) { create :document, contents: contents }

  # TODO(azirbel): Tests for failure cases

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
        expect(parsed_response).to eq('John')
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
        expect(parsed_response).to eq('wow')
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
        expect(parsed_response).to eq('second')
      end
    end
  end
end
