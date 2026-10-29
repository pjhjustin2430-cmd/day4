// Supabase 가 연결되지 않았거나 products 테이블이 아직 없을 때 보여 주는 "데모" 상품 목록.
// 실제 상품은 supabase/cart.sql 로 만든 products 테이블이 기준입니다. (id 는 DB 값이 아님)
export const DEMO_PRODUCTS = [
  { slug: 'dol-keyring', name: '돌하르방 키링', description: '제주 돌하르방을 모티프로 한 아크릴 키링', price: 6900, emoji: '🗿', ip_slug: 'dol-hareubang' },
  { slug: 'haenyeo-ecobag', name: '해녀 에코백', description: '튼튼한 면 소재, 테왁과 해녀 일러스트', price: 12000, emoji: '🤿', ip_slug: 'haenyeo' },
  { slug: 'gamgyul-cream', name: '감귤 핸드크림', description: '상큼한 귤 향의 휴대용 핸드크림 50ml', price: 9500, emoji: '🍊', ip_slug: 'gamgyul' },
  { slug: 'hallasan-mug', name: '한라산 머그컵', description: '백록담이 그려진 세라믹 머그컵 350ml', price: 14000, emoji: '⛰️', ip_slug: 'hallasan' },
  { slug: 'oreum-postcard', name: '오름 엽서 세트', description: '제주 오름 풍경 엽서 6장 세트', price: 5000, emoji: '🌋', ip_slug: 'oreum' },
  { slug: 'pony-plush', name: '제주 조랑말 인형', description: '보들보들한 조랑말 봉제 인형 25cm', price: 18000, emoji: '🐴', ip_slug: 'jeju-pony' },
  { slug: 'seongsan-poster', name: '성산일출봉 포스터', description: 'A3 사이즈 일출 일러스트 포스터', price: 15000, emoji: '🌅', ip_slug: 'seongsan' },
  { slug: 'canola-sticker', name: '유채꽃 스티커팩', description: '방수 스티커 20매 (노란 유채꽃 시리즈)', price: 4500, emoji: '🌼', ip_slug: 'canola' },
].map((p, i) => ({ ...p, id: i + 1, stock: 100 }))

export const won = (n) => `${Number(n).toLocaleString('ko-KR')}원`

// 배송비 정책 (예시): 3만원 이상 무료, 그 외 3,000원
export const FREE_SHIPPING_FROM = 30000
export const SHIPPING_FEE = 3000
