class Document < ActiveRecord::Base
  before_validation :create_unique_identifier, on: :create

  validate :contents_must_match_schema
  validate :contents_size_within_limit, if: :contents_changed?, on: :update
  validates :token, presence: true, uniqueness: true

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

  # Maximum size for document contents (in bytes of JSON)
  # Set to 1MB by default - adjust as needed
  MAX_CONTENTS_SIZE = 1.megabyte

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

  def contents_size_within_limit
    return if contents.nil?

    contents_json = contents.to_json
    size_in_bytes = contents_json.bytesize

    if size_in_bytes > MAX_CONTENTS_SIZE
      size_in_mb = (size_in_bytes.to_f / 1.megabyte).round(2)
      limit_in_mb = (MAX_CONTENTS_SIZE.to_f / 1.megabyte).round(2)
      errors.add(:contents, "is too large (#{size_in_mb}MB). Maximum size is #{limit_in_mb}MB")
    end
  end
end
