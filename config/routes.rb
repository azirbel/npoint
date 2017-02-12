Rails.application.routes.draw do
  constraints :subdomain => 'api' do
    namespace :api, path: nil, defaults: { format: 'json' } do
      resources :documents, path: '/', only: [:show]
    end
  end

  root 'app#index'
  get 'docs', to: 'app#index'
  get 'docs/:id', to: 'app#index'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'

  resources :documents, only: [:index, :create, :show, :update, :destroy]

  resources :users
end
