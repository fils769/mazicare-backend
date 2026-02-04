-- Fix the existing plans
UPDATE subscription_plans 
SET "durationMonths" = 1 
WHERE "durationMonths" IS NULL;

-- Update the Premium Plan that has no basePrice or vatRate
UPDATE subscription_plans 
SET "basePrice" = 99.99, "vatRate" = 0.24, "durationMonths" = 1
WHERE id = 'cmkaxwyvs0000zouwsn7ewdlj';

-- Update Family Premium 
UPDATE subscription_plans 
SET "durationMonths" = 1
WHERE id = 'cml7z5tfv0000zocgzqsiq1h4';

-- Update Caregiver Premium
UPDATE subscription_plans 
SET "durationMonths" = 1
WHERE id = 'cml7z5tfw0001zocgudvefxtq';