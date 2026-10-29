---
name: threejs-single-file-games
description: three.js로 단일 HTML 파일 애니메이션·게임(제주 은하/제주도 키프레임 장면, 감귤 점프 게임, 3D 레이싱)을 만들고, 브라우저로 검증한 뒤 GitHub(day2)에 올리는 워크플로와 함정 모음. "three.js로 ~ 만들어줘", "게임/애니메이션 더 화려하게/퀄리티 좋게", "github에 올려줘" 요청에 사용.
---

# three.js 단일 파일 게임·애니메이션 제작 워크플로

사용자는 한국어로 요청한다(예: "tree.js"는 three.js). 응답은 한국어로, 결과 요약은 짧게 한다.
작업 폴더: `C:\vibe\day4` (결과물은 여기에 `*.html` 한 파일로 만든다).

## 지금까지 만든 결과물 (day2 저장소 main)
| 파일 | 내용 |
|---|---|
| `index.html` | 제주도 3D 장면. `webgl_animation_keyframes` 방식(AnimationMixer + KeyframeTrack): 한라산·오름·성산일출봉·우도, 감귤나무, 돌하르방, 풍력발전기, 배·비행기 경로 애니메이션, 라벨. 시작 버튼 후 실행 |
| `game.html` | 제주 감귤 폴짝! — 감귤 캐릭터가 자동으로 뛰는 수직 점프 게임. 발판 5종, 콤보, 파워업 3종(한라봉 방어막/천혜향 자석/레드향 로켓), 갈매기·낙석·강풍, 4개 스테이지, 합성 BGM/효과음 + Web Speech 한국어 음성 |
| `racing.html` | Jeju Coast GP — 3랩 6대 3D 레이싱. 긴 직선 + 스위퍼 + 시케인 서킷, AI(곡률 기반 속도 제어), 드리프트/니트로/부스트 패드, 기어·RPM HUD, 스타트 라이트, 아이템 박스(🍊 유도 미사일·🍋 껍질·🛡️ 방어막·🔥 터보·⚡ 번개, E/Enter로 사용, 순위가 낮을수록 좋은 아이템, AI도 상황별로 사용) |

| `transformer.html` | 트랜스포머(챗GPT·제미나이·클로드) 원리를 유치원생 눈높이로 설명하는 9장면 3D 동화. 모든 장면이 시간 t의 순수 함수라 이전/다음/슬라이더로 자유롭게 이동, 말풍선 + 한국어 음성(음성이 끝나야 다음 말풍선), 똑똑이 로봇 |

저장소: https://github.com/pjhjustin2430-cmd/day2 (Pages: `https://pjhjustin2430-cmd.github.io/day2/<파일>.html`)

## 기본 골격
- 단일 HTML, `importmap`으로 CDN 로드(버전 고정):
  `three` → `https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js`, `three/addons/` → `.../examples/jsm/`
- **시작 화면 + 버튼**: 오디오 정책 때문에 `AudioContext`는 버튼 클릭에서 생성. 장면은 한 번 렌더해 두고, 클릭 시 `renderer.setAnimationLoop(animate)` 시작. `Clock`은 `new THREE.Clock(false)` 후 클릭에서 `start()`.
- 오디오는 파일 없이 Web Audio 합성(효과음, 펜타토닉 BGM, 엔진음). 음성은 `speechSynthesis`(ko-KR, pitch ~1.9) + 화면 말풍선 병행(음성 미지원 대비).
- 최고 기록은 `localStorage`(try/catch).
- 모바일: `pointer: coarse`일 때 터치 버튼 표시.

## 품질 가이드 (사용자가 "화려하게" → "퀄리티 좋게"로 방향 수정함)
- 화려함을 요청받으면 이펙트(블룸, 파티클, 속도선)를 쓰되, **"퀄리티"를 요청하면 효과를 걷어내고 재질/조명/모델/HUD 완성도**로 간다.
- 후처리(`EffectComposer`)를 쓰면 MSAA가 사라지므로 `new WebGLRenderTarget(w*pr, h*pr, { type: HalfFloatType, samples: 4 })`를 composer에 전달. 마지막은 `OutputPass`(톤매핑).
- 하늘 돔을 `PMREMGenerator.fromScene()`으로 구워 `scene.environment`에 사용하면 금속/클리어코트 반사가 자연스럽다.
- 캔버스로 텍스처 생성(아스팔트, 풀, 자갈, 구름, 광고판) — 외부 에셋 없이 해결.
- 파티클은 `PointsMaterial` 대신 소프트 원형 `ShaderMaterial`(알파/크기 속성)로.
- 캐릭터/차량은 프리미티브 조합 + `ExtrudeGeometry` 베벨로 둥근 차체.

## 반드시 피할 함정 (실제로 겪음)
1. **`Object3D.lookAt`**: 일반 객체는 +z가 앞. 부모 없는 더미에 쓸 때 `updateMatrixWorld(true)`를 먼저 호출.
2. **카메라가 +z를 볼 때 화면 오른쪽은 −x**. 좌/우 벡터와 조향 부호를 이 기준으로 정의할 것(`f=(sin h, cos h)`, `left=(cos h, −sin h)`, 오른쪽 조향은 `h` 감소).
3. **리본(도로) 메시 와인딩**: 인덱스 순서가 틀리면 법선이 뒤집혀 도로가 검게 렌더링됨. 위를 보는 앞면이 되도록 `(0,2,1),(0,3,2)`. 법선은 (0,1,0)으로 직접 지정.
4. **AnimationMixer 클립**: 트랙 이름은 `객체이름.position/quaternion`, 객체에 `name`을 줄 것. 폐곡선 경로는 첫 점을 끝에 복제하고 쿼터니언 부호 연속성(`dot<0`이면 반전) 처리.
5. **벽/코스 밖 감속**: 벽 접촉 중 매 프레임 `v*=0.92`는 차를 멈춰 세움 → 강한 충돌(impact>4)에서만 감속, 스치면 거의 유지 + 차 방향을 벽 접선으로 보정. 코스 밖 최고속도·감속도 너무 가혹하게 잡지 말 것(최고 ~32, 감속 ×2.5).
6. **인스턴스 메시 초기값**: `InstancedMesh`는 기본 행렬이 항등이라 원점에 보임 → 사용 전 화면 밖(y=-100)으로 초기화.
7. **페이지 밖 배경 별/입자 크기**: 카메라가 별 필드 안에 들어가면 `sizeAttenuation` 때문에 큰 네모로 보임 → `sizeAttenuation:false`.
8. **TDZ**: 모듈 최상위의 `const`는 선언 이후에만 접근 가능. 함수 내부 참조는 실행 시점이 늦으면 괜찮지만, 초기화 순서를 확인할 것.
9. 이미 있는 파일을 덮어쓸 때는 **먼저 사용자에게 확인**(day2의 `index.html`은 사용자가 덮어쓰기를 선택했음).

## 레이싱 게임 핵심 설계 (재사용용)
- 트랙: `CatmullRomCurve3(closed, 'centripetal')` → `getPointAt`로 균일 샘플 `S[i]`(위치/접선/좌측벡터/곡률). 직선을 늘리려면 제어점을 일직선으로 여러 개 배치. 출발선은 첫 제어점(그 앞 직선에 그리드 배치).
- 차 물리: 속도를 전진/횡 성분으로 분해 → 전진 가속·항력, 횡속도는 `exp(-grip*dt)`로 감쇠(핸드브레이크 시 grip↓ = 드리프트). 조향률은 속도에 반비례.
- 트랙 추종: 이전 인덱스 ±32 구간 최근접 탐색, 인덱스 wrap으로 랩 카운트, `lat`(횡 오프셋)으로 코스 밖/벽 판정.
- AI: 전방 목표점으로 조향, 전방 곡률로 안전 속도 `v = 17.5(-1+√(1+4·2.2·R/35))` 계산, 러버밴딩 ±6%, 정지 시 코스 복귀.
- 속도 단위: 월드 속도×3.6 = km/h 표시. 기어는 속도 구간별 RPM으로 계산해 HUD·엔진음에 공통 사용.

## 검증 절차 (브라우저 패널)
1. `mcp__Claude_Browser__navigate`로 `file:///C:/vibe/day4/<파일>.html`.
2. `javascript_tool`로 시작 버튼 클릭, `dispatchEvent(new KeyboardEvent('keydown',{code:'ArrowUp'}))`로 키 입력 시뮬레이션.
3. 필요하면 일시적으로 `window.__g = {...}` 디버그 훅을 넣어 AI/상태 수치를 읽고, **검증 후 제거**.
4. `read_console_messages(onlyErrors)`와 스크린샷 확인. 패널이 세로형이면 `resize_window`로 1280×720 확인 후 `preset: desktop`으로 복원.
5. 직접 못 본 것(소리, 음성, 후반 스테이지 등)은 최종 보고에서 "확인하지 못함"이라고 명시.

## GitHub 업로드 절차 (사용자가 "올려줘/올리기"라고 할 때만)
```bash
S="<스크래치패드>/day2"
git clone https://github.com/pjhjustin2430-cmd/day2 "$S"   # 최초 1회. 이후엔 cd 후 git pull -q origin main
cp /c/vibe/day4/<파일>.html "$S/<파일>.html"
cd "$S" && git add <파일>.html && git commit -m "<메시지>

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" && git push origin main
git ls-remote https://github.com/pjhjustin2430-cmd/day2 main   # 커밋 해시 확인
```
- 저장소에는 다른 연습 파일들이 있으니 **기존 파일 덮어쓰기 전 확인**, 새 파일은 별도 이름으로.
- 푸시 후 커밋 해시와 Pages 주소를 알려 준다. 올리기는 사용자가 요청했을 때만 한다.

## 응답 습관
- 작업 시작 시 계획(`update_plan`) → 끝에 `wrap_up`(요약 + 다음 질문, 예: "GitHub에 올릴까요?") → 마지막 메시지에 기능 목록과 미확인 항목을 정리.
- 제주 테마(한라산, 오름, 성산일출봉, 우도, 감귤/한라봉/천혜향/레드향, 돌하르방, 풍력발전기, 해녀)를 기본 모티프로 사용.
