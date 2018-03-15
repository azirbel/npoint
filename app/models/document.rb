class Document < ActiveRecord::Base
  before_create :create_unique_identifier

  validate :contents_must_match_schema

  # TODO(azirbel): Allow storing ECMA-404-valid JSON here, not just
  # arrays and objects

  # TODO(azirbel): Allow "null" values in the JSON

  belongs_to :user

  # TODO(azirbel): Test for collision case
  def create_unique_identifier
    begin
      # 5 years to guess at 10k attempts/second:
      # log(16, 10000 * 60 * 60 * 24 * 365 * 5) ~= 10.13
      #
      # TODO(azirbel): Yeah, that ^ is not actually right because we want something like
      # "number of attempts between guesses which produce ANY document" - you shouldn't
      # be able to brute force and get interesting documents quickly
      self.token = SecureRandom.hex(10)
    end while self.class.exists?(:token => token)
  end

  def editable_by_user?(u)
    return true unless user.present?
    u == user
  end

  private

  def contents_must_match_schema
    if schema.present? &&
        schema != [] &&
        !JSON::Validator.validate(schema, contents)
      errors.add(:contents, "does not match schema")
    end
  end
end
