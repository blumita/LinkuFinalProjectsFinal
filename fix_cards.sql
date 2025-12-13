-- Update card names from card_users table
UPDATE cards c 
JOIN card_users cu ON c.id = cu.card_id 
SET c.card_name = cu.name 
WHERE (c.card_name = 'کارت پیش فرض' OR c.card_name = 'پروفایل پیش‌فرض') 
AND cu.name IS NOT NULL 
AND cu.name != '';

-- Show results
SELECT c.id, c.card_name, c.slug, c.is_default, cu.name as user_name 
FROM cards c 
LEFT JOIN card_users cu ON c.id = cu.card_id 
WHERE c.user_id = 11;
