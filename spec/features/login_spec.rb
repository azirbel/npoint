RSpec.describe 'login', type: :feature, js: true do
  include Devise::Test::IntegrationHelpers
  include Warden::Test::Helpers

  Warden.test_mode!

  GOOD_PASSWORD = 'good-password'
  BAD_PASSWORD = 'bad-password'

  let!(:document) { create :document, user: user }
  let!(:user) { create :user, email: 'good@example.com', password: GOOD_PASSWORD }

  it 'works for a valid user' do
    visit '/'
    expect(page).to have_content 'JSON storage bins'
    expect(page).not_to have_css '.js-account-dropdown'

    click_button 'Log in'

    within '.js-login' do
      fill_in 'Email', with: user.email
      fill_in 'Password', with: GOOD_PASSWORD
      click_button 'Log in'
    end

    expect(page).to have_css '.js-account-dropdown'
    expect(page).to have_content 'My JSON Bins'
  end

  it 'shows an error for an incorrect password'
end
