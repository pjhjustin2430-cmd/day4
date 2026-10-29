# 🍊 제주 IP 스튜디오

제주를 대표하는 IP(돌하르방·해녀·감귤·한라산·오름·조랑말·성산일출봉·유채꽃) 이미지 갤러리.
**Vite + React** · **Supabase**(회원가입/로그인/즐겨찾기) · **Pixabay**(이미지) · **Vercel**(배포)

| 기능 | 설명 |
|---|---|
| 회원가입 / 로그인 / 로그아웃 | 이메일 + 비밀번호, 닉네임, 비밀번호 재설정 메일 |
| IP 갤러리 / 상세 | Pixabay 이미지 검색 결과 + 작가 크레딧, 확대 보기 |
| ♥ 즐겨찾기 | 로그인한 사용자만. Supabase DB + RLS 로 본인 것만 읽기/쓰기 |
| 내 계정 | 닉네임 변경 |

```
jeju-ip/
├─ api/pixabay.js          # Vercel 서버리스 함수 (Pixabay 키를 서버에만 보관)
├─ supabase/schema.sql     # 테이블 + RLS + 가입 트리거 (SQL Editor 에 붙여넣기)
├─ src/                    # React 앱 (pages, components, context, hooks, data)
├─ vite.config.js          # 개발 서버에서도 /api/pixabay 가 동작하게 하는 플러그인
├─ vercel.json             # SPA 새로고침 404 방지 rewrite
└─ .env.example            # 환경변수 견본
```

---

## 환경변수 한눈에 보기

| 이름 | 어디서 얻나 | 브라우저 노출 | 용도 |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → **Project URL** | O (정상) | Supabase 연결 주소 |
| `VITE_SUPABASE_ANON_KEY` | 같은 화면의 **anon public** 키 (새 UI: Publishable key) | O (정상) | 로그인/DB 호출 (RLS 가 보호) |
| `PIXABAY_API_KEY` | https://pixabay.com/api/docs/ (로그인 후 Your API key) | **X (서버 전용)** | 이미지 검색 |
| `DATA_GO_KR_API_KEY` | 공공데이터포털 → 마이페이지 → 데이터 활용 → 활용신청 현황 → 「서귀포시_직영관광지 관람객수 추이」 → **일반 인증키** | **X (서버 전용)** | `/stats` 관람객 통계 페이지 |

> ⚠️ **절대 넣지 말 것**: `service_role` / `secret` 키, 데이터베이스 비밀번호, 연결 문자열(`postgresql://...`).
> 이 앱은 DB 비밀번호가 필요 없습니다. `VITE_` 로 시작하는 변수는 빌드 결과(JS)에 그대로 들어가 누구나 볼 수 있습니다.
> `PIXABAY_API_KEY` 는 `VITE_` 를 **붙이지 않아서** 서버리스 함수에서만 읽힙니다.

---

## 1단계. Supabase 설정

1. https://supabase.com → **New project** (이름 예: `jeju-ip`, 리전 `Northeast Asia (Seoul)` 권장).
   - Database Password 는 **Generate a password** 로 강력하게 만들고 안전한 곳에 저장 (앱에는 쓰지 않습니다).
2. 왼쪽 **SQL Editor → New query** → [`supabase/schema.sql`](supabase/schema.sql) 내용을 전부 붙여 넣고 **Run**.
   - `profiles`, `favorites` 테이블, RLS 정책, 가입 시 프로필 자동 생성 트리거가 만들어집니다.
   - **장바구니/상점을 쓰려면** 이어서 [`supabase/cart.sql`](supabase/cart.sql) 도 새 쿼리로 붙여 넣고 **Run** 합니다.
     (`products` 샘플 상품 8개, `cart_items`, `add_to_cart` 함수, RLS 가 만들어집니다)
3. **Authentication → Providers → Email** 이 켜져 있는지 확인.
   - 개발 중 이메일 인증 메일이 번거로우면 **Confirm email** 을 잠시 끄세요. (운영에서는 켜 두기)
4. **Authentication → URL Configuration**
   - 지금은 `Site URL` = `http://localhost:5173`
   - `Redirect URLs` 에 `http://localhost:5173/**` 추가
   - (Vercel 배포 후 5단계에서 배포 주소를 추가합니다)
5. **Project Settings → API** 에서 **Project URL** 과 **anon public (또는 Publishable) key** 를 복사해 둡니다.

## 2단계. Pixabay API 키

1. https://pixabay.com 가입/로그인 → https://pixabay.com/api/docs/ 이동
2. 문서 상단 **Parameters → key** 옆에 보이는 본인 API 키를 복사합니다.
3. (약관) 결과는 24시간 캐싱, 사진 작가 크레딧 표기를 권장합니다. 이 프로젝트는 둘 다 처리해 둠.

## 2-1단계. 공공데이터포털 API 키 (관람객 통계 페이지용)

1. https://www.data.go.kr 로그인 → **마이페이지 → 데이터 활용 → Open API → 활용신청 현황**
2. 「제주특별자치도 서귀포시_직영관광지 관람객수 추이」 를 열어 **일반 인증키**를 복사 (승인 상태여야 함)
3. 환경변수 이름은 `DATA_GO_KR_API_KEY` (**VITE_ 금지**). 키는 서버리스 함수(`api/visitors.js`)에서만 사용되며,
   인증키를 URL 이 아닌 `Authorization: Infuser <키>` 헤더로 보냅니다.
4. 이 키는 채팅·스크린샷·GitHub 에 올리지 마세요. 노출됐다면 포털에서 재발급하세요.

## 3단계. 로컬 실행

Node.js 18+ (LTS) 필요.

```bash
cd jeju-ip
npm install
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
```

`.env.local` 을 열어 값을 채웁니다.

```ini
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
PIXABAY_API_KEY=12345678-abcdef...
```

```bash
npm run dev      # http://localhost:5173
```

확인: 회원가입 → (인증 메일 사용 시 메일 링크 클릭) → 로그인 → 상세 페이지에서 ♡ 클릭 → `/favorites` 에서 보이는지.
`.env.local` 을 고치면 **개발 서버를 재시작**해야 반영됩니다.

## 4단계. GitHub 업로드

`.env.local` 은 `.gitignore` 에 들어 있어 올라가지 않습니다. (`git status` 로 `.env*` 가 없는지 꼭 확인)

```bash
git add .
git commit -m "Jeju IP studio"
git push
```

## 5단계. Vercel 배포

1. https://vercel.com → **Add New… → Project** → GitHub 저장소 **Import**.
   - 저장소 안에 여러 폴더가 있고 이 프로젝트가 `jeju-ip/` 하위라면 **Root Directory = `jeju-ip`** 로 지정.
   - Framework Preset 은 **Vite** 로 자동 인식 (Build `npm run build`, Output `dist`).
2. **Environment Variables** 에 3개를 입력 (Environments: Production · Preview · Development 모두 체크).

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | anon / publishable 키 |
   | `PIXABAY_API_KEY` | Pixabay 키 |
   | `DATA_GO_KR_API_KEY` | 공공데이터포털 일반 인증키 (관람객 통계용) |

3. **Deploy**. 완료되면 `https://프로젝트명.vercel.app` 주소가 생깁니다.
4. 환경변수를 나중에 바꾸면 **Deployments → … → Redeploy** 해야 반영됩니다 (빌드 시점에 주입되는 값이라서).

## 6단계. 배포 주소를 Supabase 에 등록 (중요!)

이걸 안 하면 이메일 인증/비밀번호 재설정 링크가 `localhost` 로 가거나 막힙니다.

- Supabase → **Authentication → URL Configuration**
  - **Site URL** → `https://프로젝트명.vercel.app`
  - **Redirect URLs** 에 추가 → `https://프로젝트명.vercel.app/**` (로컬용 `http://localhost:5173/**` 는 그대로 유지)
  - Vercel 미리보기 배포까지 쓰려면 `https://*-팀이름.vercel.app/**` 도 추가

## 7단계. 점검 체크리스트

- [ ] 배포 주소에서 홈 이미지가 뜬다 (안 뜨면 `PIXABAY_API_KEY` 확인 후 Redeploy)
- [ ] 회원가입 → 인증 메일 → 로그인 성공
- [ ] ♡ 클릭 → `/favorites` 에 저장, 새로고침해도 유지
- [ ] 다른 계정으로 로그인하면 내 즐겨찾기가 보이지 않는다 (RLS 확인)
- [ ] `/ip/hallasan` 같은 주소에서 새로고침해도 404 가 아니다

## 자주 겪는 문제

| 증상 | 원인 / 해결 |
|---|---|
| 화면 위에 노란 "Supabase 환경변수가 설정되지 않았어요" | `.env.local` 누락 또는 오타. 저장 후 `npm run dev` 재시작 |
| 이미지가 회색/에러 | `PIXABAY_API_KEY` 누락 또는 `VITE_` 를 잘못 붙임. Vercel 은 값 변경 후 Redeploy |
| 가입 메일이 안 옴 / "rate limit" | Supabase 기본 메일은 시간당 발송 수 제한이 작음. 개발 중엔 Confirm email 끄기, 운영은 Custom SMTP 설정 |
| 로그인했는데 즐겨찾기가 안 저장됨 | `schema.sql` 을 실행하지 않았거나 RLS 정책 누락 → SQL 다시 Run |
| 비밀번호 재설정 링크가 localhost 로 이동 | 6단계 Site URL / Redirect URLs 미설정 |

## 커스터마이즈

- IP 항목 추가/수정: `src/data/ips.js` 의 배열에 객체를 추가하면 갤러리·상세 페이지가 자동 생성됩니다.
- 색/폰트: `src/styles.css` 맨 위 CSS 변수.
