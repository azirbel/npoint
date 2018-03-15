require 'sendgrid-ruby'
include SendGrid

class Npointmail
  def password_reset(user)
    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: 'support@npoint.io')
    personalization = SendGrid::Personalization.new
    personalization.add_to(SendGrid::Email.new(email: user.email))
    personalization.add_substitution(SendGrid::Substitution.new(key: '%name%', value: user.name))
    mail.add_personalization(personalization)
    mail.template_id = 'bdf0a64b-087d-4c5f-a955-fb6589d3422a'

    puts ENV['SENDGRID_API_KEY']
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    begin
        response = sg.client.mail._('send').post(request_body: mail.to_json)
    rescue Exception => e
        puts e.message
    end
    puts response.status_code
    puts response.body
    puts response.headers
  end
end
