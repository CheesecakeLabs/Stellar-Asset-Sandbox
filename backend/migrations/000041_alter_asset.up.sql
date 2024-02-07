ALTER TABLE Asset
ADD COLUMN authorize_required BOOLEAN DEFAULT false,
ADD COLUMN clawback_enabled BOOLEAN DEFAULT false,
ADD COLUMN freeze_enabled BOOLEAN DEFAULT false;

