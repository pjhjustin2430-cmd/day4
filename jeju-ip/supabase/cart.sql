-- 장바구니 기능용 테이블 (Supabase 대시보드 → SQL Editor → New query 에 통째로 붙여 넣고 Run)
-- 먼저 schema.sql 을 실행한 뒤에 실행하세요. 여러 번 실행해도 안전하게 작성했습니다.

-- ─────────────────────────────────────────────────────────────
-- 1) products : 상점에 진열할 굿즈 (누구나 읽기 가능, 수정은 대시보드에서만)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.products (
  id          bigint generated always as identity primary key,
  slug        text unique not null,
  name        text not null,
  description text,
  price       integer not null check (price >= 0),      -- 원 단위
  emoji       text not null default '🎁',
  ip_slug     text,                                      -- src/data/ips.js 의 slug (이미지 연결용)
  stock       integer not null default 100 check (stock >= 0),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_select_active" on public.products;
create policy "products_select_active" on public.products
  for select using (is_active = true);                   -- 로그인 안 해도 상품은 볼 수 있음

-- 샘플 상품 (이미 있으면 건너뜀)
insert into public.products (slug, name, description, price, emoji, ip_slug, stock) values
  ('dol-keyring',     '돌하르방 키링',       '제주 돌하르방을 모티프로 한 아크릴 키링',        6900,  '🗿', 'dol-hareubang', 200),
  ('haenyeo-ecobag',  '해녀 에코백',         '튼튼한 면 소재, 테왁과 해녀 일러스트',           12000, '🤿', 'haenyeo',       120),
  ('gamgyul-cream',   '감귤 핸드크림',       '상큼한 귤 향의 휴대용 핸드크림 50ml',            9500,  '🍊', 'gamgyul',       300),
  ('hallasan-mug',    '한라산 머그컵',       '백록담이 그려진 세라믹 머그컵 350ml',            14000, '⛰️', 'hallasan',      80),
  ('oreum-postcard',  '오름 엽서 세트',      '제주 오름 풍경 엽서 6장 세트',                   5000,  '🌋', 'oreum',         500),
  ('pony-plush',      '제주 조랑말 인형',    '보들보들한 조랑말 봉제 인형 25cm',               18000, '🐴', 'jeju-pony',     60),
  ('seongsan-poster', '성산일출봉 포스터',   'A3 사이즈 일출 일러스트 포스터',                 15000, '🌅', 'seongsan',      90),
  ('canola-sticker',  '유채꽃 스티커팩',     '방수 스티커 20매 (노란 유채꽃 시리즈)',          4500,  '🌼', 'canola',        400)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 2) cart_items : 사용자별 장바구니 (본인 것만 읽기/쓰기)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.cart_items (
  id          bigint generated always as identity primary key,
  user_id     uuid   not null default auth.uid() references auth.users (id) on delete cascade,
  product_id  bigint not null references public.products (id) on delete cascade,
  quantity    integer not null default 1 check (quantity between 1 and 99),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, product_id)                           -- 같은 상품은 한 줄, 수량만 늘림
);

create index if not exists cart_items_user_idx on public.cart_items (user_id, created_at);

alter table public.cart_items enable row level security;

drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own" on public.cart_items
  for select using (auth.uid() = user_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own" on public.cart_items
  for insert with check (auth.uid() = user_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own" on public.cart_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own" on public.cart_items
  for delete using (auth.uid() = user_id);

-- updated_at 자동 갱신 트리거
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cart_items_touch on public.cart_items;
create trigger cart_items_touch
  before update on public.cart_items
  for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 3) add_to_cart : "담기" 버튼용 함수. 이미 있으면 수량 +N (최대 99), 없으면 새로 추가
--    (RLS 는 그대로 적용되는 security invoker 함수라 본인 장바구니만 건드릴 수 있어요)
-- ─────────────────────────────────────────────────────────────
create or replace function public.add_to_cart(p_product_id bigint, p_quantity integer default 1)
returns void
language sql
security invoker
as $$
  insert into public.cart_items (user_id, product_id, quantity)
  values (auth.uid(), p_product_id, least(greatest(p_quantity, 1), 99))
  on conflict (user_id, product_id)
  do update set quantity = least(public.cart_items.quantity + excluded.quantity, 99);
$$;

revoke all on function public.add_to_cart(bigint, integer) from public, anon;
grant execute on function public.add_to_cart(bigint, integer) to authenticated;
