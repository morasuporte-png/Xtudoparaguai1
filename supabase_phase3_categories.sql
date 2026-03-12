-- Migration Phase 3: Add sub_sub_category to products

-- Add the new column if it doesn't already exist
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sub_sub_category text;

-- Add an index to speed up filtering by sub_sub_category
CREATE INDEX IF NOT EXISTS idx_products_sub_sub_category 
  ON public.products (sub_sub_category);
