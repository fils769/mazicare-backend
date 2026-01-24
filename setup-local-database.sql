-- ============================================================================
-- MAZICARE LOCAL DATABASE SETUP SCRIPT
-- Run this in pgAdmin Query Tool
-- ============================================================================

-- STEP 1: Create the database
-- NOTE: You may need to disconnect from the current database first
-- or run this from the default 'postgres' database

CREATE DATABASE mazicare_local
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE mazicare_local
    IS 'MaziCare Platform Local Development Database';

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check if database was created)
-- ============================================================================

-- Check if database exists
SELECT datname, datdba, encoding, datcollate, datctype 
FROM pg_database 
WHERE datname = 'mazicare_local';

-- Get database size
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'mazicare_local';

-- ============================================================================
-- AFTER CREATING DATABASE:
-- 1. Update your .env file with:
--    DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mazicare_local?schema=public"
--
-- 2. Run in terminal:
--    npx prisma migrate dev --name init
--    npx prisma db seed
--
-- 3. Verify tables were created with queries below
-- ============================================================================

-- ============================================================================
-- POST-MIGRATION VERIFICATION QUERIES
-- (Run these AFTER running Prisma migrations)
-- ============================================================================

-- List all tables
SELECT 
    tablename,
    schemaname
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count rows in each table
SELECT 
    'users' as table_name, 
    COUNT(*) as row_count 
FROM users
UNION ALL
SELECT 'families', COUNT(*) FROM families
UNION ALL
SELECT 'caregivers', COUNT(*) FROM caregivers
UNION ALL
SELECT 'elders', COUNT(*) FROM elders
UNION ALL
SELECT 'activity_logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'deals', COUNT(*) FROM deals;

-- ============================================================================
-- USEFUL QUERIES AFTER SEEDING
-- ============================================================================

-- View all users with their roles
SELECT 
    id,
    email,
    role,
    status,
    "isVerified",
    "createdAt"
FROM users
ORDER BY "createdAt" DESC;

-- View families with their onboarding status
SELECT 
    f.id,
    f."familyName",
    u.email,
    f."onboardingComplete",
    (SELECT COUNT(*) FROM elders WHERE "familyId" = f.id) as elder_count
FROM families f
JOIN users u ON f."userId" = u.id;

-- View caregivers with their status
SELECT 
    c.id,
    c."firstName",
    c."lastName",
    c.email,
    u.status,
    c."onboardingComplete",
    (SELECT COUNT(*) FROM elders WHERE "careGiverId" = c.id) as assigned_elders
FROM caregivers c
JOIN users u ON c."userId" = u.id;

-- View elders with their family and caregiver
SELECT 
    e."firstName" || ' ' || e."lastName" as elder_name,
    f."familyName",
    c."firstName" || ' ' || c."lastName" as caregiver_name,
    e.gender,
    e."dateOfBirth"
FROM elders e
LEFT JOIN families f ON e."familyId" = f.id
LEFT JOIN caregivers c ON e."careGiverId" = c.id;

-- Check activity logs
SELECT 
    category,
    "eventType",
    COUNT(*) as count
FROM activity_logs
GROUP BY category, "eventType"
ORDER BY count DESC;

-- Check subscriptions
SELECT 
    s.id,
    u.email,
    sp.name as plan_name,
    s.status,
    s."startDate",
    s."endDate",
    s.price
FROM subscriptions s
JOIN users u ON s."userId" = u.id
JOIN subscription_plans sp ON s."planId" = sp.id;

-- ============================================================================
-- CLEANUP QUERIES (USE WITH CAUTION)
-- ============================================================================

-- Drop all tables (run this if you need to reset everything)
-- WARNING: This will delete all data!
/*
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- After running this, you'll need to run migrations again:
-- npx prisma migrate dev --name init
-- npx prisma db seed
*/

-- Delete all data but keep tables (safer option)
/*
TRUNCATE TABLE 
    activity_logs,
    deal_claims,
    deals,
    event_registrations,
    events,
    messages,
    conversations,
    notifications,
    payment_transactions,
    reviews,
    schedule_items,
    schedules,
    subscriptions,
    subscription_plans,
    care_requests,
    elders,
    families,
    caregivers,
    otps,
    users,
    care_programs,
    regions,
    languages
CASCADE;

-- After truncating, run: npx prisma db seed
*/

-- ============================================================================
-- ADMIN REPORTS TEST QUERY
-- (Test the data that will be returned by /admin/reports endpoint)
-- ============================================================================

-- Overview stats
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'FAMILY') as total_families,
    (SELECT COUNT(*) FROM users WHERE role = 'FAMILY' AND status = 'ACTIVE') as active_families,
    (SELECT COUNT(*) FROM users WHERE role = 'CAREGIVER') as total_caregivers,
    (SELECT COUNT(*) FROM users WHERE role = 'CAREGIVER' AND status = 'ACTIVE') as active_caregivers,
    (SELECT COUNT(*) FROM elders WHERE "careGiverId" IS NOT NULL) as elders_with_caregivers,
    (SELECT COUNT(*) FROM elders) as total_elders,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'ACTIVE') as active_subscriptions;

-- Care completion stats
SELECT 
    COUNT(*) as total_schedule_items,
    COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_items,
    COUNT(*) FILTER (WHERE status = 'PENDING') as pending_items,
    CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(*) FILTER (WHERE status = 'COMPLETED')::numeric / COUNT(*)::numeric * 100), 0)
        ELSE 0 
    END as completion_rate
FROM schedule_items;

-- Matching stats
SELECT 
    (SELECT COUNT(DISTINCT "familyId") FROM elders WHERE "careGiverId" IS NOT NULL) as families_with_caregivers,
    (SELECT COUNT(DISTINCT id) FROM caregivers WHERE id IN (SELECT "careGiverId" FROM elders WHERE "careGiverId" IS NOT NULL)) as caregivers_with_elders,
    (SELECT COUNT(DISTINCT "familyId" || '-' || "careGiverId") FROM elders WHERE "careGiverId" IS NOT NULL) as total_connections;

-- Recent activity
SELECT 
    COUNT(*) as recent_activities
FROM activity_logs
WHERE "createdAt" >= NOW() - INTERVAL '30 days';

-- ============================================================================
-- END OF SETUP SCRIPT
-- ============================================================================
