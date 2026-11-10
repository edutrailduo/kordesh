-- KORDESH Phase 6: Live customer care chat
-- Tables are private to the API. Customers access only through a random per-chat key.
create table if not exists public.kordesh_chat_sessions (
 id uuid primary key default gen_random_uuid(),
 token_hash text not null unique,
 customer_name text not null default 'Guest',
 status text not null default 'waiting' check(status in ('waiting','active','closed')),
 created_at timestamptz not null default now(),
 last_message_at timestamptz not null default now()
);
create table if not exists public.kordesh_chat_messages (
 id bigint generated always as identity primary key,
 chat_id uuid not null references public.kordesh_chat_sessions(id) on delete cascade,
 sender text not null check(sender in ('customer','agent')),
 body text not null check(char_length(body) between 1 and 1000),
 created_at timestamptz not null default now()
);
create index if not exists kordesh_chat_messages_chat_id_id_idx on public.kordesh_chat_messages(chat_id,id);
create index if not exists kordesh_chat_sessions_last_message_idx on public.kordesh_chat_sessions(last_message_at desc);
alter table public.kordesh_chat_sessions enable row level security;
alter table public.kordesh_chat_messages enable row level security;
revoke all on public.kordesh_chat_sessions from anon,authenticated;
revoke all on public.kordesh_chat_messages from anon,authenticated;

create or replace function public.kordesh_chat_create(p_customer_name text default 'Guest')
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_key text; v_id uuid;
begin
 v_key:=replace(gen_random_uuid()::text||gen_random_uuid()::text,'-','');
 insert into public.kordesh_chat_sessions(token_hash,customer_name)
 values(md5(v_key),left(coalesce(nullif(trim(p_customer_name),''),'Guest'),80)) returning id into v_id;
 return jsonb_build_object('chat_id',v_id,'chat_key',v_key);
end; $$;

create or replace function public.kordesh_chat_customer_send(p_chat_key text,p_body text)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_id uuid; v_msg public.kordesh_chat_messages;
begin
 if p_body is null or char_length(trim(p_body)) not between 1 and 1000 then raise exception 'Message must be 1-1000 characters'; end if;
 select id into v_id from public.kordesh_chat_sessions where token_hash=md5(coalesce(p_chat_key,'')) and status<>'closed';
 if v_id is null then raise exception 'Chat session not found or closed'; end if;
 insert into public.kordesh_chat_messages(chat_id,sender,body) values(v_id,'customer',trim(p_body)) returning * into v_msg;
 update public.kordesh_chat_sessions set last_message_at=now() where id=v_id;
 return jsonb_build_object('id',v_msg.id,'sender',v_msg.sender,'body',v_msg.body,'created_at',v_msg.created_at);
end; $$;

create or replace function public.kordesh_chat_customer_messages(p_chat_key text,p_after_id bigint default 0)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_id uuid; v_rows jsonb;
begin
 select id into v_id from public.kordesh_chat_sessions where token_hash=md5(coalesce(p_chat_key,''));
 if v_id is null then raise exception 'Chat session not found'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'sender',m.sender,'body',m.body,'created_at',m.created_at) order by m.id),'[]'::jsonb)
 into v_rows from public.kordesh_chat_messages m where m.chat_id=v_id and m.id>coalesce(p_after_id,0);
 return v_rows;
end; $$;

create or replace function public.kordesh_chat_admin_sessions()
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_rows jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.kordesh_admins a where a.user_id=auth.uid()) then raise exception 'Not authorized'; end if;
 select coalesce(jsonb_agg(x order by (x->>'last_message_at') desc),'[]'::jsonb) into v_rows
 from (select jsonb_build_object('id',s.id,'customer_name',s.customer_name,'status',s.status,'created_at',s.created_at,'last_message_at',s.last_message_at,
 'last_message',(select m.body from public.kordesh_chat_messages m where m.chat_id=s.id order by m.id desc limit 1)) x
 from public.kordesh_chat_sessions s where s.status<>'closed' order by s.last_message_at desc limit 100) q;
 return v_rows;
end; $$;

create or replace function public.kordesh_chat_admin_messages(p_chat_id uuid,p_after_id bigint default 0)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_rows jsonb;
begin
 if auth.uid() is null or not exists(select 1 from public.kordesh_admins a where a.user_id=auth.uid()) then raise exception 'Not authorized'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'sender',m.sender,'body',m.body,'created_at',m.created_at) order by m.id),'[]'::jsonb)
 into v_rows from public.kordesh_chat_messages m where m.chat_id=p_chat_id and m.id>coalesce(p_after_id,0);
 return v_rows;
end; $$;

create or replace function public.kordesh_chat_admin_send(p_chat_id uuid,p_body text)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare v_msg public.kordesh_chat_messages;
begin
 if auth.uid() is null or not exists(select 1 from public.kordesh_admins a where a.user_id=auth.uid()) then raise exception 'Not authorized'; end if;
 if p_body is null or char_length(trim(p_body)) not between 1 and 1000 then raise exception 'Message must be 1-1000 characters'; end if;
 if not exists(select 1 from public.kordesh_chat_sessions where id=p_chat_id and status<>'closed') then raise exception 'Chat session not found or closed'; end if;
 insert into public.kordesh_chat_messages(chat_id,sender,body) values(p_chat_id,'agent',trim(p_body)) returning * into v_msg;
 update public.kordesh_chat_sessions set status='active',last_message_at=now() where id=p_chat_id;
 return jsonb_build_object('id',v_msg.id,'sender',v_msg.sender,'body',v_msg.body,'created_at',v_msg.created_at);
end; $$;

create or replace function public.kordesh_chat_admin_close(p_chat_id uuid)
returns boolean language plpgsql security definer set search_path=''
as $$
begin
 if auth.uid() is null or not exists(select 1 from public.kordesh_admins a where a.user_id=auth.uid()) then raise exception 'Not authorized'; end if;
 update public.kordesh_chat_sessions set status='closed' where id=p_chat_id;
 return found;
end; $$;

revoke execute on function public.kordesh_chat_create(text) from public,authenticated;
revoke execute on function public.kordesh_chat_customer_send(text,text) from public,authenticated;
revoke execute on function public.kordesh_chat_customer_messages(text,bigint) from public,authenticated;
revoke execute on function public.kordesh_chat_admin_sessions() from public,anon;
revoke execute on function public.kordesh_chat_admin_messages(uuid,bigint) from public,anon;
revoke execute on function public.kordesh_chat_admin_send(uuid,text) from public,anon;
revoke execute on function public.kordesh_chat_admin_close(uuid) from public,anon;
grant execute on function public.kordesh_chat_create(text) to anon;
grant execute on function public.kordesh_chat_customer_send(text,text) to anon;
grant execute on function public.kordesh_chat_customer_messages(text,bigint) to anon;
grant execute on function public.kordesh_chat_admin_sessions() to authenticated;
grant execute on function public.kordesh_chat_admin_messages(uuid,bigint) to authenticated;
grant execute on function public.kordesh_chat_admin_send(uuid,text) to authenticated;
grant execute on function public.kordesh_chat_admin_close(uuid) to authenticated;
