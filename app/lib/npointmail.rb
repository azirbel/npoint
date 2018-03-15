require 'sendgrid-ruby'
include SendGrid

# TODO(azirbel): Rename
class Npointmail
  # Currently returns true on success, false on error
  def self.reset_password(user, token)
    reset_url = "http://localhost:3000/reset-password?token=#{token}"

    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: 'support@npoint.io')
    personalization = SendGrid::Personalization.new
    personalization.add_to(SendGrid::Email.new(email: user.email))
    personalization.add_substitution(SendGrid::Substitution.new(key: '%name%', value: user.name))
    personalization.add_substitution(SendGrid::Substitution.new(key: '%reset_url%', value: reset_url))
    mail.add_personalization(personalization)
    mail.template_id = 'bdf0a64b-087d-4c5f-a955-fb6589d3422a'

    puts ENV['SENDGRID_API_KEY']
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    begin
      response = sg.client.mail._('send').post(request_body: mail.to_json)
    rescue Exception => e
      # TODO(azirbel): Handle this?
      puts e.message
      return false
    end
    puts response.status_code
    puts response.body
    puts response.headers

    true
  end
end
