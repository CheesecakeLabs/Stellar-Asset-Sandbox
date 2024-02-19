-- Migration Up Script
ALTER TABLE LogTransactions ADD COLUMN fee_charged FLOAT;
