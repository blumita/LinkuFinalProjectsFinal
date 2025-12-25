#!/bin/bash
# Script to normalize all phone numbers in the database
# This ensures all phone numbers are stored in the format: 9XXXXXXXXX

ssh root@95.215.59.92 'mysql -u root -pMh@36463646 linku_api << EOF
-- Normalize phone numbers: remove leading 0, +98, 98
UPDATE users 
SET phone = CASE
    -- Remove +98 prefix
    WHEN phone LIKE "+98%" THEN SUBSTRING(phone, 4)
    -- Remove 98 prefix (without +)
    WHEN phone LIKE "98%" AND LENGTH(phone) = 12 THEN SUBSTRING(phone, 3)
    -- Remove leading 0
    WHEN phone LIKE "0%" AND LENGTH(phone) = 11 THEN SUBSTRING(phone, 2)
    -- Already normalized
    ELSE phone
END
WHERE phone IS NOT NULL 
  AND phone != "";

-- Show affected rows
SELECT COUNT(*) as total_users_with_phone FROM users WHERE phone IS NOT NULL AND phone != "";
SELECT phone, COUNT(*) as count FROM users WHERE phone IS NOT NULL AND phone != "" GROUP BY phone HAVING count > 1;
EOF
'

echo "Phone normalization completed!"
