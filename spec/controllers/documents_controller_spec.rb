RSpec.describe DocumentsController do
  let!(:user) { create :user }
  let!(:unowned_document) { create :document }

  # TODO(azirbel): Why isn't `user: user` working?
  let!(:owned_document1) { create :document, user_id: user.id }
  let!(:owned_document2) { create :document, user_id: user.id }

  def serializer
    described_class::SERIALIZER
  end

  describe '#index' do
    context 'with no logged in user' do
      it 'returns a 401' do
        get :index
        expect(response).to have_http_status(401)
      end
    end

    context 'with a logged in user' do
      before { sign_in user }

      it "returns the user's documents" do
        get :index
      end
    end
  end

  describe '#show' do
    it 'returns owned documents' do
      get :show, token: owned_document1.token
      expect(response).to have_http_status(200)
      expect(parsed_response).to eq(serialize_one(owned_document1))
    end

    it 'returns unowned documents' do
      get :show, token: unowned_document.token
      expect(response).to have_http_status(200)
      expect(parsed_response).to eq(serialize_one(unowned_document))
    end

    it 'does not return the document id' do
      get :show, token: unowned_document.token
      expect(parsed_response['id']).to be_nil
    end

    it 'gives a 404 for nonexistant documents' do
      get :show, token: 'notatoken'
      expect(response).to have_http_status(404)
    end
  end
end
