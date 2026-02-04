-- Update null durationMonths to a default value (e.g., 1 month)
UPDATE subscription_plans 
SET "durationMonths" = 1 
WHERE "durationMonths" IS NULL;

-- Also update any null basePrice or vatRate values
UPDATE subscription_plans 
SET "basePrice" = 0 
WHERE "basePrice" IS NULL;

UPDATE subscription_plans 
SET "vatRate" = 0 
WHERE "vatRate" IS NULL;