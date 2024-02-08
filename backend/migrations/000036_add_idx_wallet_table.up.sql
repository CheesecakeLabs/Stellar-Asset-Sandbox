-- Asset Table
CREATE INDEX idx_asset_name ON Asset(name);
CREATE INDEX idx_asset_asset_type ON Asset(asset_type);
CREATE INDEX idx_asset_code ON Asset(code);
CREATE INDEX idx_asset_distributor_id ON Asset(distributor_id);
CREATE INDEX idx_asset_issuer_id ON Asset(issuer_id);

-- Wallet Table
CREATE INDEX idx_wallet_type ON Wallet(type);

-- Key Table
CREATE INDEX idx_key_public_key ON Key(public_key);
CREATE INDEX idx_key_wallet_id ON Key(wallet_id);
