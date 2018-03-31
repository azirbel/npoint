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
    def serializer
      DocumentIndexSerializer
    end

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
            serialize_one(owned_document1).merge('editable' => true,
                                                 'owned_by_current_user' => true),
            serialize_one(owned_document2).merge('editable' => true,
                                                 'owned_by_current_user' => true)
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
          serialize_one(owned_document1).merge('editable' => true,
                                               'owned_by_current_user' => true)
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
    it 'allows setting contents to nil' do
      expect {
        post :update, token: unowned_document.token, contents: nil
      }.to change { unowned_document.reload.contents }.to(nil)

      expect(response).to have_http_status(200)
      expect(parsed_response).to include(contents: nil)
    end

    it 'allows setting contents to {}' do
      expect {
        post :update, token: unowned_document.token, contents: '{}'
      }.to change { unowned_document.reload.contents }.to({})

      expect(response).to have_http_status(200)
      expect(parsed_response).to include(contents: {})
    end

    it 'allows setting contents to []' do
      expect {
        post :update, token: unowned_document.token, contents: '[]'
      }.to change { unowned_document.reload.contents }.to([])

      expect(response).to have_http_status(200)
      expect(parsed_response).to include(contents: [])
    end

    it 'disallows setting contents to a string'

    it 'allows setting schema to nil' do
      expect {
        post :update, token: unowned_document.token, schema: nil
      }.to change { unowned_document.reload.schema }.to(nil)

      expect(response).to have_http_status(200)
      expect(parsed_response).to include(schema: nil)
    end

    it 'allows setting schema to {}' do
      expect {
        post :update, token: unowned_document.token, schema: '{}'
      }.to change { unowned_document.reload.schema }.to({})

      expect(response).to have_http_status(200)
      expect(parsed_response).to include(schema: {})
    end

    it 'allows setting schema to []' do
      expect {
        post :update, token: unowned_document.token, schema: '[]'
      }.to change { unowned_document.reload.schema }.to([])

      expect(response).to have_http_status(200)
      expect(parsed_response).to include(schema: [])
    end

    it 'disallows setting schema to a string'

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
          serialize_one(owned_document1).merge('editable' => true,
                                               'owned_by_current_user' => true)
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
    context 'with no logged in user' do
      it 'allows deleting an unowned document' do
        expect {
          delete :destroy, token: unowned_document.token
        }.to change(Document, :count).by(-1)

        expect(response).to have_http_status(200)
      end

      it 'returns a 401 for an owned document' do
        expect {
          delete :destroy, token: owned_document1.token
        }.not_to change(Document, :count)

        expect(response).to have_http_status(401)
      end
    end

    context 'with a logged in user' do
      before { sign_in user }

      it 'allows deleting an unowned document' do
        expect {
          delete :destroy, token: unowned_document.token
        }.to change(Document, :count).by(-1)

        expect(response).to have_http_status(200)
      end

      it 'allows deleting an owned document' do
        expect {
          delete :destroy, token: owned_document1.token
        }.to change(Document, :count).by(-1)

        expect(response).to have_http_status(200)
      end

      it 'returns a 401 for a document owned by a different user' do
        expect {
          delete :destroy, token: user2_document.token
        }.not_to change(Document, :count)

        expect(response).to have_http_status(401)
      end

      context 'with a document with locked contents' do
        before do
          owned_document1.update!(contents_locked: true)
        end

        it 'returns a 400' do
          expect {
            delete :destroy, token: owned_document1.token
          }.not_to change(Document, :count)

          expect(response).to have_http_status(400)
        end
      end

      context 'with a document with locked schema' do
        before do
          owned_document1.update!(schema_locked: true)
        end

        it 'returns a 400' do
          expect {
            delete :destroy, token: owned_document1.token
          }.not_to change(Document, :count)

          expect(response).to have_http_status(400)
        end
      end
    end
  end

  describe 'api URLs' do
    context 'a document with no data' do
      before do
        unowned_document.update!(contents: nil)
      end

      it 'has correct api URLs' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          nil
        )
      end
    end

    context 'a document with empty object data' do
      before do
        unowned_document.update!(contents: {})
      end

      it 'has correct api URLs' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          nil
        )
      end
    end

    context 'a document with empty array data' do
      before do
        unowned_document.update!(contents: [])
      end

      it 'has correct api URLs' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          nil
        )
      end
    end

    context 'a document with simple object data' do
      before do
        unowned_document.update!(contents: { a: 3 })
      end

      it 'has correct api URLs' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          "http://api.test.com/#{unowned_document.token}/a"
        )
      end
    end

    context 'a document with simple array data' do
      before do
        unowned_document.update!(contents: [ 1, 2, 3 ])
      end

      it 'has correct api URLs' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          "http://api.test.com/#{unowned_document.token}/0"
        )
      end
    end

    context 'a document with complex object data' do
      before do
        unowned_document.update!(contents: { a: [{ c: 2 }, { c: 3 }, { c: 4 }], b: 6 })
      end

      it 'has correct api URLs 2 levels deep' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          "http://api.test.com/#{unowned_document.token}/a/0"
        )
      end
    end

    context 'a document with complex array data' do
      before do
        unowned_document.update!(contents: [ { a: [6, 7, 8] }, 2, 3 ])
      end

      it 'has correct api URLs 2 levels deep' do
        get :show, token: unowned_document.token
        expect(parsed_response['api_url']).to eq(
          "http://api.test.com/#{unowned_document.token}"
        )
        expect(parsed_response['example_subproperty_url']).to eq(
          "http://api.test.com/#{unowned_document.token}/0/a"
        )
      end
    end
  end

  describe '#clone' do
    context 'with no logged in user' do
      it 'clones a document' do
        expect {
          post :clone, token: owned_document1.token
        }.to change(Document, :count).by(1)

        expect(Document.last.contents).to eq(owned_document1.contents)
        expect(Document.last.token).not_to eq(owned_document1.token)

        expect(response).to have_http_status(200)
        expect(parsed_response['title']).to eq("#{owned_document1.title} (Copy)")
        expect(parsed_response['token']).not_to eq(owned_document1.token)
      end
    end

    context 'with a logged in user' do
      before { sign_in user }

      it 'copies an unowned document to one owned by the user' do
        expect {
          post :clone, token: unowned_document.token
        }.to change(Document, :count).by(1)

        expect(Document.last.user).not_to eq(unowned_document.user)

        expect(response).to have_http_status(200)
        expect(parsed_response['owned_by_current_user']).to be(true)
      end

      it 'copies an owned document' do
        expect {
          post :clone, token: owned_document1.token
        }.to change(Document, :count).by(1)

        expect(Document.last.user).to eq(owned_document1.user)

        expect(response).to have_http_status(200)
        expect(parsed_response['owned_by_current_user']).to be(true)
      end

      it 'copies a document owned by a different user' do
        expect {
          post :clone, token: user2_document.token
        }.to change(Document, :count).by(1)

        expect(Document.last.user).not_to eq(user2_document.user)

        expect(response).to have_http_status(200)
        expect(parsed_response['owned_by_current_user']).to be(true)
      end
    end
  end
end
