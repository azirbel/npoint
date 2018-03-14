FactoryGirl.define do
  factory :document do
    sequence(:title) { |n| "Monograph #{n}" }
    contents do
      {
        subject: 'Typewriters',
        telltaleClues: [
          'letter e',
          'letter t',
          'ligatures',
        ]
      }.to_json
    end
    schema do
      {
        properties: {
          subject: {
            type: 'String'
          }
        }
      }.to_json
    end
  end
end
