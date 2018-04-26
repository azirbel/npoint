require 'sendgrid-ruby'
include SendGrid
include Rails.application.routes.url_helpers

class TransactionalMail
  # Currently returns true on success, false on error
  def self.reset_password(user, token)
    port = if Rails.env.development? then 3000 else nil end
    reset_url = "#{url_for(controller: 'app', subdomain: 'www', port: port)}reset-password?token=#{token}"

    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: 'n:point <support@npoint.io>')
    personalization = SendGrid::Personalization.new
    personalization.add_to(SendGrid::Email.new(email: user.email))
    personalization.add_substitution(SendGrid::Substitution.new(key: '%name%', value: user.name))
    personalization.add_substitution(SendGrid::Substitution.new(key: '%reset_url%', value: reset_url))
    mail.add_personalization(personalization)
    mail.template_id = 'bdf0a64b-087d-4c5f-a955-fb6589d3422a'

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    begin
      response = sg.client.mail._('send').post(request_body: mail.to_json)
    rescue Exception => e
      # TODO(sentry): Log this failure
      return false
    end

    true
  end
end
