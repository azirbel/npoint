RSpec.describe ResetPasswordController do
  RAW_TOKEN = 'RAW_TOKEN'
  ENC_TOKEN = 'ENC_TOKEN'

  let(:user) { create :user }

  before do
    allow(Devise.token_generator).to receive(:generate).and_return([RAW_TOKEN, ENC_TOKEN])
  end

  describe '#send_reset_password_email' do
    context 'with a valid user' do
      it 'triggers sending an email' do
        expect(TransactionalMail).to receive(:reset_password)
          .with(user, RAW_TOKEN)
          .and_return(true)

        post :send_reset_password_email, params: { email: user.email }
        expect(response).to have_http_status(200)
      end
    end

    context 'with an invalid user' do
      it 'returns 404' do
        allow(TransactionalMail).to receive(:reset_password).and_return(true)

        post :send_reset_password_email, params: { email: 'bad.email@npoint.io' }
        expect(response).to have_http_status(404)
      end
    end

    context 'if sending the email fails' do
      it 'returns a failed status' do
        expect(TransactionalMail).to receive(:reset_password)
          .with(user, RAW_TOKEN)
          .and_return(false)

        post :send_reset_password_email, params: { email: user.email }
        expect(response).to have_http_status(503)
      end
    end
  end

  describe 'full reset flow' do
    context 'with the same token sent through email' do
      it 'resets the user password' do
        expect(TransactionalMail).to receive(:reset_password)
          .with(user, RAW_TOKEN)
          .and_return(true)

        expect {
          post :send_reset_password_email, params: { email: user.email }
        }.to change { user.reload.reset_password_token }.to(ENC_TOKEN)

        expect(response).to have_http_status(200)

        expect(Devise.token_generator).to receive(:digest)
          .with(User, :reset_password_token, RAW_TOKEN)
          .and_return(ENC_TOKEN)

        expect {
          post :reset_password, params: { reset_token: RAW_TOKEN, password: 'NEW_PASSWORD' }
        }.to change { user.reload.reset_password_token }.to(nil)
          .and(change { user.reload.encrypted_password })

        expect(response).to have_http_status(200)
        expect(parsed_response['email']).to eq(user.email)
      end
    end

    context 'with the wrong token' do
      BAD_TOKEN = 'BAD_TOKEN'

      it 'does not reset the password' do
        expect(TransactionalMail).to receive(:reset_password)
          .with(user, RAW_TOKEN)
          .and_return(true)

        expect {
          post :send_reset_password_email, params: { email: user.email }
        }.to change { user.reload.reset_password_token }.to(ENC_TOKEN)

        expect(response).to have_http_status(200)

        expect {
          expect {
            post :reset_password, params: { reset_token: 'BAD_TOKEN', password: 'NEW_PASSWORD' }
          }.not_to change { user.reload.reset_password_token }
        }.not_to change { user.reload.encrypted_password }

        expect(response).to have_http_status(400)
      end
    end

    context 'with no token' do
      it 'does not reset the password' do
        expect(TransactionalMail).to receive(:reset_password)
          .with(user, RAW_TOKEN)
          .and_return(true)

        expect {
          post :send_reset_password_email, params: { email: user.email }
        }.to change { user.reload.reset_password_token }.to(ENC_TOKEN)

        expect(response).to have_http_status(200)

        expect {
          expect {
            post :reset_password, params: { password: 'NEW_PASSWORD' }
          }.not_to change { user.reload.reset_password_token }
        }.not_to change { user.reload.encrypted_password }

        expect(response).to have_http_status(400)
      end
    end
  end
end
