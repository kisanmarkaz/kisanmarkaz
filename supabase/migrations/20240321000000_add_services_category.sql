-- Add services category
INSERT INTO categories (name, slug, description, icon)
VALUES (
  'Services',
  'services',
  'Find and offer agricultural services including tractor rental, harvesting, spraying, and more',
  'Wrench'
) ON CONFLICT (slug) DO NOTHING;

-- Add service subcategories
INSERT INTO subcategories (name, slug, category_id, description)
SELECT 
  subcategory.name,
  subcategory.slug,
  c.id,
  subcategory.description
FROM categories c,
(VALUES 
  ('Tractor Rental', 'tractor-rental', 'Rent tractors for your farming needs'),
  ('Harvesting Services', 'harvesting', 'Professional harvesting services for all types of crops'),
  ('Spraying Services', 'spraying', 'Crop spraying and pest control services'),
  ('Farm Labor', 'labor', 'Hire skilled agricultural laborers'),
  ('Transport Services', 'transport', 'Transportation services for agricultural products'),
  ('Agricultural Consultancy', 'consultancy', 'Expert farming advice and consultation'),
  ('Equipment Rental', 'equipment-rental', 'Rent various farming equipment'),
  ('Other Services', 'other-services', 'Other agricultural services')
) AS subcategory(name, slug, description)
WHERE c.slug = 'services'
ON CONFLICT (slug) DO NOTHING; 