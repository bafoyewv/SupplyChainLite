ALTER TABLE users
    ADD COLUMN status VARCHAR(20),
    ADD COLUMN verification_code VARCHAR(6),
    ADD COLUMN verification_code_expiry TIMESTAMP;

-- Set default status for existing users
UPDATE users SET status = 'VERIFIED' WHERE status IS NULL; 