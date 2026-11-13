create or replace function public.public_data() returns jsonb language sql stable security definer set search_path=public as $$
select jsonb_build_object(
 'settings',(select data from settings order by created_at limit 1),
 'packages',coalesce((select jsonb_agg(data order by created_at) from packages),'[]'::jsonb),
 'posts',coalesce((select jsonb_agg(data order by created_at) from posts),'[]'::jsonb),
 'products',coalesce((select jsonb_agg(data order by created_at desc) from products),'[]'::jsonb),
 'rentals',coalesce((select jsonb_agg(data order by created_at desc) from rentals),'[]'::jsonb),
 'tk',public.recent_orders(),
 'ql',public.queue_list()) $$;
grant execute on function public.public_data() to anon, authenticated;
