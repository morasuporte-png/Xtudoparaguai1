-- ════════════════════════════════════════════════════════════════
-- XTUDO PARAGUAI — FASE 1: Rastreabilidade & Status Machine
-- ▶ Cole este arquivo no SQL Editor do Supabase → Run (Ctrl+Enter)
-- ════════════════════════════════════════════════════════════════

-- ── 1. TABELA order_events (Log de Auditoria) ────────────────────
create table if not exists public.order_events (
  id            uuid        primary key default gen_random_uuid(),
  order_id      uuid        not null references public.orders on delete cascade,
  event_type    text        not null,
  payload       jsonb       not null default '{}',
  success       boolean     not null default true,
  error_message text,
  created_at    timestamptz not null default now()
);

-- Index para busca por pedido
create index if not exists idx_order_events_order_id
  on public.order_events (order_id, created_at desc);

-- RLS
alter table public.order_events enable row level security;

-- Comprador vê eventos dos seus próprios pedidos
create policy "events_buyer_select" on public.order_events
  for select
  using (
    order_id in (
      select id from public.orders where buyer_id = auth.uid()
    )
  );

-- Backend (service role) pode inserir qualquer evento
create policy "events_service_insert" on public.order_events
  for insert
  with check (true);

-- ── 2. SEPARAR payment_status e order_status na tabela orders ────

-- 2a. Adicionar colunas novas
alter table public.orders
  add column if not exists payment_status text
    not null default 'pending_payment'
    check (payment_status in (
      'pending_payment',
      'payment_approved',
      'payment_failed',
      'refunded'
    )),
  add column if not exists order_status text
    not null default 'pending'
    check (order_status in (
      'pending',
      'confirmed',
      'sending_to_supplier',
      'supplier_processing',
      'awaiting_tracking',
      'shipped',
      'delivered',
      'cancelled',
      'failed'
    ));

-- 2b. Migrar dados existentes da coluna legada 'status'
update public.orders set
  payment_status = case status
    when 'paid'      then 'payment_approved'
    when 'cancelled' then 'pending_payment'
    when 'failed'    then 'payment_failed'
    else 'pending_payment'
  end,
  order_status = case status
    when 'paid'      then 'confirmed'
    when 'shipped'   then 'shipped'
    when 'delivered' then 'delivered'
    when 'cancelled' then 'cancelled'
    else 'pending'
  end
where payment_status = 'pending_payment'; -- só migra se ainda não migrado

-- ── 3. FUNÇÃO UTILITÁRIA: log_order_event ────────────────────────
-- Facilita chamar de triggers futuros ou de dentro do banco
create or replace function public.log_order_event(
  p_order_id      uuid,
  p_event_type    text,
  p_payload       jsonb    default '{}',
  p_success       boolean  default true,
  p_error_message text     default null
) returns void
language plpgsql security definer as $$
begin
  insert into public.order_events
    (order_id, event_type, payload, success, error_message)
  values
    (p_order_id, p_event_type, p_payload, p_success, p_error_message);
end;
$$;

-- ── 4. TRIGGER: registrar ORDER_CREATED automaticamente ──────────
create or replace function public.on_order_created()
returns trigger language plpgsql security definer as $$
begin
  perform public.log_order_event(
    new.id,
    'ORDER_CREATED',
    jsonb_build_object(
      'total_brl',       new.total_brl,
      'payment_method',  new.payment_method,
      'payment_status',  new.payment_status,
      'order_status',    new.order_status
    )
  );
  return new;
end;
$$;

drop trigger if exists trg_order_created on public.orders;
create trigger trg_order_created
  after insert on public.orders
  for each row execute procedure public.on_order_created();

-- ── 5. TRIGGER: registrar ORDER_STATUS_CHANGED ───────────────────
create or replace function public.on_order_status_changed()
returns trigger language plpgsql security definer as $$
begin
  if (new.order_status <> old.order_status) or
     (new.payment_status <> old.payment_status) then
    perform public.log_order_event(
      new.id,
      'STATUS_CHANGED',
      jsonb_build_object(
        'old_payment_status', old.payment_status,
        'new_payment_status', new.payment_status,
        'old_order_status',   old.order_status,
        'new_order_status',   new.order_status
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_order_status_changed on public.orders;
create trigger trg_order_status_changed
  after update on public.orders
  for each row execute procedure public.on_order_status_changed();

-- ════════════════════════════════════════════════════════════════
-- ✅ FASE 1 Concluída — Tabelas e triggers prontos
-- Próximo: atualizar api/webhook.ts e services/db.ts
-- ════════════════════════════════════════════════════════════════
