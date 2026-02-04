-- Update orderCode column from INT to BIGINT
ALTER TABLE payment_orders 
ALTER COLUMN "orderCode" TYPE BIGINT;