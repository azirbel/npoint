FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "holmes#{n}@bakerstreet.com" }
    name { 'Sherlock Holmes' }
    password { 'password123' }
  end
end
