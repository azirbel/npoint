require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  include ControllerSpecHelper

  describe '#hello' do
    it 'returns world' do
      expect(UsersController.new.hello).to eq('world')
    end
  end

  describe '#me' do
    context 'with a logged in user' do
      before { log_in_user }

      it 'returns the logged in user info' do
        binding.pry
      end
    end

    context 'without a logged in user' do
      it 'returns nothing' do
        binding.pry
      end
    end
  end
end
