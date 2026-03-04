-- ════════════════════════════════════════════════════════════════
-- XTUDO PARAGUAI — FASE 2: Automação Resiliente
-- ▶ Cole no SQL Editor do Supabase → Run (Ctrl+Enter)
-- ════════════════════════════════════════════════════════════════

-- ── 1. TABELA suppliers ──────────────────────────────────────────
create table if not exists public.suppliers (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  api_url        text,
  api_key        text,              -- armazene criptografado via Vault
  webhook_secret text,
  active         boolean     not null default true,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Apenas admins (service role) gerenciam fornecedores
alter table public.suppliers enable row level security;
create policy "suppliers_service_only" on public.suppliers
  using (false); -- bloqueia acesso público; service role ignora RLS

-- ── 2. CAMPOS em products para rastrear fornecedor e custo ───────
alter table public.products
  add column if not exists supplier_id         uuid    references public.suppliers(id),
  add column if not exists supplier_product_id text,   -- ID do produto no sistema do fornecedor
  add column if not exists cost                numeric(12,2); -- custo do produto (p/ cálculo de margem)

-- Index para buscar produtos de um fornecedor
create index if not exists idx_products_supplier_id
  on public.products (supplier_id) where supplier_id is not null;

-- ── 3. TABELA job_queue (Fila de Processamento) ──────────────────
create table if not exists public.job_queue (
  id           uuid        primary key default gen_random_uuid(),
  job_type     text        not null,              -- SEND_TO_SUPPLIER, SEND_EMAIL, etc.
  payload      jsonb       not null default '{}',
  attempts     integer     not null default 0,
  max_attempts integer     not null default 5,
  status       text        not null default 'pending'
               check (status in ('pending', 'processing', 'completed', 'failed')),
  run_at       timestamptz not null default now(),  -- não processar antes deste timestamp
  last_error   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index para o worker buscar jobs prontos para processar
create index if not exists idx_job_queue_worker
  on public.job_queue (status, run_at)
  where status = 'pending';

-- Apenas service role acessa a fila
alter table public.job_queue enable row level security;
create policy "job_queue_service_only" on public.job_queue
  using (false);

-- ── 4. FUNÇÃO: enfileirar um job (helper) ────────────────────────
create or replace function public.enqueue_job(
  p_job_type     text,
  p_payload      jsonb    default '{}',
  p_max_attempts integer  default 5,
  p_run_at       timestamptz default now()
) returns uuid
language plpgsql security definer as $$
declare
  v_id uuid;
begin
  insert into public.job_queue (job_type, payload, max_attempts, run_at)
  values (p_job_type, p_payload, p_max_attempts, p_run_at)
  returning id into v_id;
  return v_id;
end;
$$;

-- ── 5. TRIGGER: criar job SEND_TO_SUPPLIER quando pedido é pago ──
create or replace function public.on_order_payment_approved()
returns trigger language plpgsql security definer as $$
begin
  -- Só aciona quando payment_status muda para 'payment_approved'
  if (new.payment_status = 'payment_approved') and
     (old.payment_status is distinct from 'payment_approved') then
    perform public.enqueue_job(
      'SEND_TO_SUPPLIER',
      jsonb_build_object('order_id', new.id, 'buyer_id', new.buyer_id, 'total_brl', new.total_brl),
      5,
      now()
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_order_payment_approved on public.orders;
create trigger trg_order_payment_approved
  after update on public.orders
  for each row execute procedure public.on_order_payment_approved();

-- ════════════════════════════════════════════════════════════════
-- ✅ FASE 2 SQL Concluída
-- Próximo: rodar este arquivo no Supabase → depois fazer deploy no Vercel
-- ════════════════════════════════════════════════════════════════
