Rails.application.routes.draw do
  # TODO(azirbel): Copy opendoor/web setup, the routes are more beautiful
  devise_for :users, :controllers => {
    registrations: 'registrations',
    sessions: 'sessions'
  }

  devise_scope :user do
    get 'users/me' => 'sessions#info'
  end

  constraints :subdomain => 'api' do
    namespace :api, path: nil, defaults: { format: 'json' } do
      resources :documents, param: :token, path: '/', only: [:show]
    end
  end

  root 'app#index'
  get 'docs', to: 'app#index'
  get 'faq', to: 'app#index'
  get 'docs/:id', to: 'app#index'

  resources :documents,
    param: :token,
    only: [:index, :create, :show, :update, :destroy]

  # Followed https://collectiveidea.com/blog/archives/2016/01/12/lets-encrypt-with-a-rails-app-on-heroku#comment-56f2af9c524ce84ba3000005
  # to set up SSL
  get '/.well-known/acme-challenge/WMR9ZsaN_jU71mT7d4Z59RBrRZa4Nw80Ms61cfmhXWY' => 'pages#letsencrypt'
  get '/.well-known/acme-challenge/jEd9Iw3Oi37AY-h2GsmmaFvjE8z3MnUSP1CaR_vMOtM' => 'pages#letsencrypt_api'
end
