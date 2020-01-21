CREATE TABLE account (
   account_id serial UNIQUE PRIMARY KEY,
   username VARCHAR (50) UNIQUE NOT NULL,
   password_hash VARCHAR(100) NOT NULL,
   password_hash_salt VARCHAR(100) NOT NULL,
	 is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE EXTENSION pgcrypto;
CREATE OR REPLACE FUNCTION create_account(input_username TEXT, input_password TEXT) RETURNS integer AS $$
	INSERT INTO account (username, password_hash, password_hash_salt)
		SELECT
			input_username AS username,
			crypt(input_password, password_hash_salt) AS password_hash,
			password_hash_salt
		FROM (SELECT gen_salt('bf', 8) AS password_hash_salt) AS salter
	RETURNING account_id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION account_id_with_credentials(input_username TEXT, input_password TEXT) RETURNS INTEGER AS $$
	SELECT
		account_id
	FROM (
		SELECT
			account_id,
			username,
			password_hash,
			password_hash_salt,
			is_active
		FROM account
	) AS t
	WHERE username = input_username
	AND crypt(input_password, password_hash_salt) = password_hash
	AND is_active = TRUE
$$ LANGUAGE SQL IMMUTABLE;

CREATE OR REPLACE FUNCTION soft_delete_account(input_account_id INTEGER) RETURNS INTEGER AS $$
	UPDATE account
		SET is_active = FALSE
	WHERE account_id = input_account_id
	RETURNING account_id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION set_username(input_account_id INTEGER, input_username TEXT) RETURNS INTEGER AS $$
	UPDATE account
		SET username = input_username
	WHERE account_id = input_account_id
	AND is_active = TRUE
	RETURNING account_id
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION set_password(input_account_id INTEGER, input_password TEXT) RETURNS INTEGER AS $$
	UPDATE account
	SET
		password_hash = crypt(input_password, salter.password_hash_salt),
		password_hash_salt = salter.password_hash_salt
	FROM (SELECT gen_salt('bf', 8) AS password_hash_salt) AS salter
	WHERE account_id = input_account_id
	RETURNING account_id
$$ LANGUAGE SQL;