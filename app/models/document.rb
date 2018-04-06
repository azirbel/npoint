class Document < ActiveRecord::Base
  before_create :create_unique_identifier

  validate :contents_must_match_schema

  belongs_to :user, optional: true

  # 5 years to guess a specific token at 10k attempts/second:
  # log(16, 10000 * 60 * 60 * 24 * 365 * 5) ~= 10.13
  #
  # That's not actually right, because we want something like "number of
  # attempts between guesses which produce ANY document" - you shouldn't be
  # able to brute force and get interesting documents quickly.
  #
  # But it's ok for now. Token-based security is only so strong anyway,
  # since URLs show up in logs and can't be rolled back if leaked.
  TOKEN_LENGTH = 10

  # TODO(azirbel): DB or rails-level uniqueness validation
  def create_unique_identifier
    begin
      self.token = SecureRandom.hex(TOKEN_LENGTH)
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
