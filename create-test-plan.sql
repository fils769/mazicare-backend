-- Insert a test subscription plan
INSERT INTO subscription_plans (id, name, role, "basePrice", "vatRate", "durationMonths", features, "createdAt")
VALUES (
  'test-plan-123',
  'Test Basic Plan',
  'FAMILY',
  29.99,
  0.24,
  1,
  ARRAY['Basic Support', 'Monthly Billing'],
  NOW()
) ON CONFLICT (name) DO UPDATE SET
  "basePrice" = 29.99,
  "vatRate" = 0.24,
  "durationMonths" = 1;