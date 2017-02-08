Rails.application.routes.draw do
  constraints :subdomain => 'api' do
    namespace :api, path: nil, defaults: { format: 'json' } do
      resources :documents, path: '/', only: [:show]
    end
  end

  root 'app#index'
  get 'docs', to: 'app#index'
  get 'docs/:id', to: 'app#index'

  resources :documents, only: [:index, :create, :show, :update, :destroy]
end
