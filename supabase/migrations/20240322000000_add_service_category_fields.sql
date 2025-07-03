-- Add fields for service category
INSERT INTO category_fields (category_id, field_name, field_label, field_type, required, field_options)
SELECT 
  c.id,
  field.name,
  field.label,
  field.type,
  field.required,
  field.options
FROM categories c,
(VALUES 
  ('service_type', 'Service Type', 'select', true, '{"options": ["One-time", "Recurring", "On-demand"]}'),
  ('service_duration', 'Service Duration', 'text', true, null),
  ('service_area', 'Service Area Coverage', 'text', true, null),
  ('experience_years', 'Years of Experience', 'number', true, null),
  ('equipment_details', 'Equipment Details', 'text', false, null),
  ('availability', 'Availability', 'select', true, '{"options": ["Weekdays", "Weekends", "All days", "By appointment"]}'),
  ('insurance', 'Insurance Coverage', 'select', false, '{"options": ["Yes", "No"]}'),
  ('team_size', 'Team Size', 'number', false, null),
  ('languages', 'Languages Spoken', 'text', false, null),
  ('certifications', 'Professional Certifications', 'text', false, null)
) AS field(name, label, type, required, options)
WHERE c.slug = 'services'; 