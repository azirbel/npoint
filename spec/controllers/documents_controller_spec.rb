RSpec.describe DocumentsController do
  let!(:user) { create :user }
  let!(:user2) { create :user }
  let!(:unowned_document) { create :document }
  let!(:owned_document1) { create :document, user: user }
  let!(:owned_document2) { create :document, user: user }
  let!(:user2_document) { create :document, user: user2 }

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
        expect(response).to have_http_status(200)
        expect(parsed_response)
          .to eq([
            serialize_one(owned_document1).merge('editable' => true),
            serialize_one(owned_document2).merge('editable' => true),
          ])
      end
    end
  end

  describe '#show' do
    context 'with no logged in user' do
      it 'returns owned documents' do
        get :show, token: owned_document1.token
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(owned_document1).merge('editable' => false)
        )
      end

      it 'returns unowned documents' do
        get :show, token: unowned_document.token
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(unowned_document).merge('editable' => true)
        )
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

    context 'with a logged in user' do
      before { sign_in user }

      it 'returns owned documents' do
        get :show, token: owned_document1.token
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(owned_document1).merge('editable' => true)
        )
      end

      it 'returns unowned documents' do
        get :show, token: unowned_document.token
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(unowned_document).merge('editable' => true)
        )
      end
    end

    context 'a different logged in user' do
      before { sign_in user2 }

      it 'returns owned documents' do
        get :show, token: owned_document1.token
        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(owned_document1).merge('editable' => false)
        )
      end
    end
  end

  describe '#update' do
    context 'with no logged in user' do
      it 'allows editing an unowned document' do
        expect {
          post :update, token: unowned_document.token, title: 'New title'
        }.to change { unowned_document.reload.title }.to('New title')

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(unowned_document).merge('editable' => true)
        )
      end

      it 'returns a 401 for an owned document' do
        expect {
          post :update, token: owned_document1.token, title: 'New title'
        }.not_to change { owned_document1.reload.title }

        expect(response).to have_http_status(401)
      end
    end

    context 'with a logged in user' do
      before { sign_in user }

      it 'allows editing an unowned document' do
        expect {
          post :update, token: unowned_document.token, title: 'New title'
        }.to change { unowned_document.reload.title }.to('New title')

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(unowned_document).merge('editable' => true)
        )
      end

      it 'allows editing an owned document' do
        expect {
          post :update, token: owned_document1.token, title: 'New title'
        }.to change { owned_document1.reload.title }.to('New title')

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(
          serialize_one(owned_document1).merge('editable' => true)
        )
      end

      it 'returns a 401 for a document owned by a different user' do
        expect {
          post :update, token: user2_document.token, title: 'New title'
        }.not_to change { user2_document.reload.title }

        expect(response).to have_http_status(401)
      end
    end
  end

  describe '#create' do
    it 'works'
  end

  describe '#destroy' do
    it 'works'
  end
end
