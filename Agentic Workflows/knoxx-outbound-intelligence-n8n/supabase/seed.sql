insert into categories (slug, name, description) values
  ('ready_meals', 'Ready meals', 'Manufacturers of prepared or frozen meals'),
  ('food_manufacturer', 'Food manufacturer', 'General food manufacturing'),
  ('airline_catering', 'Airline catering', 'Airline and travel meal providers'),
  ('institutional_catering', 'Institutional catering', 'Healthcare, education and institutional catering'),
  ('restaurant_group', 'Restaurant group', 'Multi-site restaurant operators'),
  ('sauces_condiments', 'Sauces and condiments', 'Sauce, paste and condiment manufacturers'),
  ('other_review', 'Needs review', 'No approved segment matched')
on conflict (slug) do update set name = excluded.name, description = excluded.description;

insert into knoxx_catalog_items (sku, name, category, canonical_ingredients, synonyms, pack_size_kg, moq_kg, service_regions, certifications, priority, synthetic) values
  ('DEMO-TOM-001', 'Processed tomato pulp — aseptic', 'Processed tomatoes', '{tomato,tomato pulp,tomato base}', '{tomato puree,crushed tomato,napolitana base}', 20, 500, '{Australia}', '{HACCP}', 5, true),
  ('DEMO-RIC-001', 'Food-service long-grain rice', 'Rice', '{rice,long-grain rice,jasmine rice}', '{white rice,basmati rice}', 25, 1000, '{Australia}', '{HACCP}', 5, true),
  ('DEMO-VEG-001', 'Dehydrated onion flakes', 'Dehydrated vegetables', '{onion}', '{onion flakes,dried onion,dehydrated onion}', 10, 250, '{Australia}', '{HACCP}', 4, true),
  ('DEMO-VEG-002', 'Dehydrated garlic granules', 'Dehydrated vegetables', '{garlic}', '{garlic granules,dried garlic,dehydrated garlic}', 10, 250, '{Australia}', '{HACCP}', 4, true),
  ('DEMO-PAS-001', 'Italian penne rigate', 'Italian pasta', '{penne,pasta}', '{penne rigate,durum wheat pasta}', 10, 500, '{Australia}', '{HACCP}', 3, true),
  ('DEMO-SEA-001', 'Bulk curry seasoning blend', 'Starches and seasonings', '{seasoning,spice,curry}', '{curry powder,spice blend}', 10, 250, '{Australia}', '{HACCP}', 3, true)
on conflict (sku) do update set name = excluded.name, synonyms = excluded.synonyms;

insert into qualification_rules (version, active, rules, synthetic) values
(1, true, '{
  "weights": {"product_applicability":40,"evidence_specificity":25,"scale_fit":20,"supply_feasibility":15},
  "risk_penalty_min":-30,
  "thresholds":{"qualified":75,"review":55},
  "hard_disqualifiers":["outside_service_area","incompatible_certification","active_suppression"],
  "quantity_uncertainty":0.25
}'::jsonb, true)
on conflict (version) do update set active = excluded.active, rules = excluded.rules;

insert into historical_outcomes (segment, persona, outcome, outcome_weight, synthetic, occurred_at) values
  ('ready_meals','procurement','meeting_booked',1.0,true,'2026-03-12'),
  ('ready_meals','product_development','positive_reply',0.8,true,'2026-04-08'),
  ('ready_meals','operations','no_reply',0.2,true,'2026-05-19'),
  ('sauces_condiments','procurement','opportunity_created',1.0,true,'2026-02-22'),
  ('food_manufacturer','supply_chain','positive_reply',0.7,true,'2026-06-03');
