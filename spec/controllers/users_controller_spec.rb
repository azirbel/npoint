require 'rails_helper'

RSpec.describe UsersController do
  let(:user) { create :user }

  describe '#me' do
    context 'with a logged in user' do
      before { sign_in user }

      it 'returns the logged in user info' do
        expect(subject.current_user).to eq(user)
      end
    end

    context 'without a logged in user' do
      it 'returns nothing' do
        expect(subject.current_user).to be_nil
      end
    end
  end
end
