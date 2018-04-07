# TODO(test): Test 401 on bad login, etc

RSpec.describe RegistrationsController do
  let!(:user) { create :user }

  def serializer
    UserSerializer
  end

  before { @request.env["devise.mapping"] = Devise.mappings[:user] }

  describe '#create' do
    context 'with a valid email and password' do
      it 'registers a new user' do
        expect {
          post :create, params: { email: 'good@npoint.io', password: 'password123' }
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq(serialize_one(User.last))
      end
    end

    context 'with a valid email and invalid password' do
      it 'registers a new user' do
        expect {
          post :create, params: { email: 'good@npoint.io', password: 'bad' }
        }.not_to change(User, :count)

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('errors' => [
          'Password is too short (minimum is 6 characters)'
        ])
      end
    end

    context 'with an invalid email and valid password' do
      it 'registers a new user' do
        expect {
          post :create, params: { email: 'bad', password: 'password123' }
        }.not_to change(User, :count)

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('errors' => ['Email is invalid'])
      end
    end

    context 'with an invalid email and invalid password' do
      it 'registers a new user' do
        expect {
          post :create, params: { email: 'bad', password: 'bad' }
        }.not_to change(User, :count)

        expect(response).to have_http_status(200)
        expect(parsed_response).to eq('errors' => [
          'Email is invalid',
          'Password is too short (minimum is 6 characters)'
        ])
      end
    end
  end
end
