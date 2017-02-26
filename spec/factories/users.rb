FactoryGirl.define do
  factory :user do
    email 'holmes@bakerstreet.com'
    name 'Sherlock Holmes'
    password 'password123'
    password_confirmation 'password123' # TODO(azirbel): Try delete
  end
end
