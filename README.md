# day4 — three.js 3D 콘텐츠 + 제주 IP 스튜디오

바이브코딩으로 만든 작업물 모음입니다.

## 단일 HTML (서버 없이 더블클릭 / GitHub Pages)

| 파일 | 내용 |
|---|---|
| [index.html](index.html) | 3D 제주도 장면 (한라산·오름·성산일출봉·우도, 감귤나무, 돌하르방, 풍력발전기, 배·비행기). 서귀포 관광지 **관람객 데이터 기둥**과 월 슬라이더, 관람객 수에 연동된 배·비행기 속도 |
| [game.html](game.html) | 제주 감귤 폴짝! — 3D 점프 게임 (콤보, 파워업, 스테이지, 효과음·음성) |
| [racing.html](racing.html) | Jeju Coast GP — 3랩 6대 3D 레이싱 (드리프트, 니트로, 아이템) |
| [transformer.html](transformer.html) | 트랜스포머(챗GPT·제미나이·클로드) 원리를 유치원생 눈높이로 설명하는 9장면 3D 동화 |

## 제주 IP 스튜디오 (Vite + React)

[jeju-ip/](jeju-ip) — Supabase 회원가입/로그인, Pixabay 이미지 갤러리, 굿즈 상점·장바구니, 공공데이터포털 관람객 통계.
설치·환경변수·Vercel 배포 절차는 [jeju-ip/README.md](jeju-ip/README.md) 를 보세요.

## 스크립트

[scripts/update-visitors.mjs](scripts/update-visitors.mjs) — 공공데이터포털에서 관람객 데이터를 받아 `index.html` 에 내장합니다.

```powershell
$env:DATA_GO_KR_API_KEY="발급받은키" ; node scripts/update-visitors.mjs
```

## 보안

- API 키(Supabase service_role, Pixabay, 공공데이터포털)는 **코드나 저장소에 넣지 않습니다.** 환경변수로만 사용합니다.
- `.env`, `.env.local` 은 `.gitignore` 로 제외됩니다. 견본은 `jeju-ip/.env.example` 입니다.
