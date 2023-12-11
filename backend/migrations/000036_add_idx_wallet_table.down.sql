-- Removing indexes added for optimization

-- Asset Table
DROP INDEX idx_asset_name;
DROP INDEX idx_asset_asset_type;
DROP INDEX idx_asset_code;
DROP INDEX idx_asset_distributor_id;
DROP INDEX idx_asset_issuer_id;

-- Wallet Table
DROP INDEX idx_wallet_type;

-- Key Table
DROP INDEX idx_key_public_key;
DROP INDEX idx_key_wallet_id;
