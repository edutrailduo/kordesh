-- Phase 5: Customer order status tracking
-- Exposes only the order number, status and order date through a narrowly-scoped RPC.
-- Customer name, phone, address, items, prices and payment details remain private.

create or replace function public.kordesh_track_order(p_order_number text)
returns table(order_number text, status text, created_at timestamptz)
language sql
security definer
set search_path = ''
stable
as $$
  select o.order_number, o.status, o.created_at
  from public.kordesh_orders as o
  where upper(btrim(o.order_number)) = upper(btrim(p_order_number))
  limit 1;
$$;

revoke all on function public.kordesh_track_order(text) from public;
grant execute on function public.kordesh_track_order(text) to anon, authenticated;
