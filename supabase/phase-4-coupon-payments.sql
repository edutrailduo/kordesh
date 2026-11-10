-- KORDESH Phase 4: WELCOME coupon and manual payment methods
-- Applied to Supabase project bibithkwfrwahttdkcfi on 2026-11-10.

alter table public.kordesh_orders
  add column if not exists coupon_code text not null default '',
  add column if not exists discount numeric(12,2) not null default 0 check (discount >= 0),
  add column if not exists payment_method text not null default 'cod'
    check (payment_method in ('cod','bkash','nagad','bank_transfer','bangla_qr')),
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','awaiting_verification','paid'));

alter table public.kordesh_orders drop constraint if exists kordesh_orders_check;
alter table public.kordesh_orders drop constraint if exists kordesh_orders_total_check;
alter table public.kordesh_orders add constraint kordesh_orders_total_check
check (total = subtotal - discount + delivery_fee);

create or replace function public.kordesh_validate_order()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
 item jsonb;
 product_row record;
 qty_value integer;
 subtotal_value numeric(12,2) := 0;
 discount_value numeric(12,2) := 0;
 normalized_items jsonb := '[]'::jsonb;
 seen_ids text[] := array[]::text[];
 delivery_value numeric(12,2);
 product_id_value text;
 phone_value text;
 coupon_value text;
 payment_value text;
begin
 if jsonb_typeof(new.items) <> 'array' or jsonb_array_length(new.items) < 1 or jsonb_array_length(new.items) > 30 then
   raise exception 'Invalid order items';
 end if;
 if length(trim(coalesce(new.customer_name,''))) < 2 or length(trim(coalesce(new.customer_name,''))) > 120 then
   raise exception 'Please enter a valid customer name';
 end if;
 phone_value := regexp_replace(coalesce(new.customer_phone,''), '[ -]', '', 'g');
 if phone_value !~ '^(\+?88)?01[3-9][0-9]{8}$' then
   raise exception 'Please enter a valid Bangladesh mobile number';
 end if;
 if nullif(trim(coalesce(new.customer_district,'')),'') is null
    or nullif(trim(coalesce(new.customer_area,'')),'') is null
    or nullif(trim(coalesce(new.customer_address,'')),'') is null then
   raise exception 'District, area and address are required';
 end if;
 if new.delivery_zone = 'Inside Dhaka' then delivery_value := 80;
 elsif new.delivery_zone = 'Outside Dhaka' then delivery_value := 130;
 else raise exception 'Invalid delivery zone'; end if;
 payment_value := lower(trim(coalesce(new.payment_method,'cod')));
 if payment_value not in ('cod','bkash','nagad','bank_transfer','bangla_qr') then
   raise exception 'Invalid payment method';
 end if;
 coupon_value := upper(trim(coalesce(new.coupon_code,'')));
 if coupon_value not in ('','WELCOME') then
   raise exception 'Invalid coupon code';
 end if;
 for item in select value from jsonb_array_elements(new.items)
 loop
   product_id_value := item->>'id';
   if product_id_value is null or product_id_value = any(seen_ids) then
     raise exception 'Invalid or duplicate product in order';
   end if;
   if coalesce(item->>'qty','') !~ '^[1-9][0-9]?$' then
     raise exception 'Invalid product quantity';
   end if;
   qty_value := (item->>'qty')::integer;
   select c.product_id,c.product_name,c.english_name,c.brand,c.price
   into product_row
   from public.kordesh_catalog c
   where c.product_id = product_id_value and c.active = true;
   if not found then raise exception 'A product is unavailable. Please refresh your cart.'; end if;
   seen_ids := array_append(seen_ids, product_id_value);
   subtotal_value := subtotal_value + product_row.price * qty_value;
   normalized_items := normalized_items || jsonb_build_array(jsonb_build_object(
     'id',product_row.product_id,'name',product_row.product_name,
     'englishName',product_row.english_name,'brand',product_row.brand,
     'price',product_row.price,'qty',qty_value
   ));
 end loop;
 if coupon_value = 'WELCOME' then discount_value := least(100, subtotal_value); end if;
 new.customer_name := trim(new.customer_name);
 new.customer_phone := phone_value;
 new.customer_district := trim(new.customer_district);
 new.customer_area := trim(new.customer_area);
 new.customer_address := trim(new.customer_address);
 new.customer_note := left(coalesce(new.customer_note,''),1000);
 new.items := normalized_items;
 new.coupon_code := coupon_value;
 new.discount := discount_value;
 new.payment_method := payment_value;
 if payment_value = 'cod' then new.payment_status := 'unpaid';
 else new.payment_status := 'awaiting_verification'; end if;
 new.subtotal := subtotal_value;
 new.delivery_fee := delivery_value;
 new.total := subtotal_value - discount_value + delivery_value;
 new.status := 'pending';
 return new;
end;
$$;

notify pgrst, 'reload schema';
