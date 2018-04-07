# TODO(test): Could use a few more integration tests:
# * Create document while logged out
# * Create document whie logged in, log out, verify you can't edit
# * Lock schema, go to list of documents, verify you can't delete
# * Lock data, go to list of documents, verify you can't delete

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
    expect(page).not_to have_content 'Invalid username or password'
  end

  it 'shows an error for an incorrect password' do
    visit '/'
    expect(page).to have_content 'JSON storage bins'
    expect(page).not_to have_css '.js-account-dropdown'

    click_button 'Log in'

    within '.js-login' do
      fill_in 'Email', with: user.email
      fill_in 'Password', with: BAD_PASSWORD
      click_button 'Log in'
    end

    expect(page).not_to have_css '.js-account-dropdown'
    expect(page).not_to have_content 'My JSON Bins'
    expect(page).to have_content 'Invalid username or password'
  end
end
