ALTER TABLE Asset
DROP COLUMN IF EXISTS authorize_required,
DROP COLUMN IF EXISTS clawback_enabled,
DROP COLUMN IF EXISTS freeze_enabled;
