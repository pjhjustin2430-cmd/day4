// 제주를 대표하는 IP(캐릭터·이야기 소재) 목록.
// 새 항목을 추가하려면 아래 배열에 객체를 하나 더 넣으면 갤러리/상세 페이지가 자동으로 생깁니다.
// queries: Pixabay 검색어 (앞의 검색어 결과가 적으면 뒤의 검색어로 보충)
export const IPS = [
  {
    slug: 'dol-hareubang',
    emoji: '🗿',
    name: '돌하르방',
    tagline: '제주를 지키는 돌 할아버지',
    color: '#6b7280',
    queries: ['dol hareubang jeju', 'harubang', 'hareubang statue', 'jeju statue'],
    // 검색 결과 중 태그에 아래 단어가 있는 사진만 사용 (프랑스 Dol-de-Bretagne, 인형 등 제외)
    filter: {
      include: ['hareubang', 'harubang', 'grandfather statue'],
      soft: ['jeju statue', 'jeju stone'],
      exclude: ['bretagne', 'brittany', 'france', 'doll', 'cathedral', 'mont dol'],
    },
    description:
      '제주 화산암(현무암)을 깎아 만든 돌 조각상으로, 마을 입구에서 잡귀를 막고 마을을 지킨다고 전해져요. 둥근 눈과 큼직한 코, 벙거지 모자가 트레이드마크라 제주 캐릭터 디자인의 단골 모티프가 됐어요.',
    facts: ['소재는 구멍이 송송 뚫린 현무암', '벙거지 모자에 부리부리한 눈, 두 손은 배 위에', '지금은 제주 기념품·캐릭터의 대표 얼굴'],
  },
  {
    slug: 'haenyeo',
    emoji: '🤿',
    name: '해녀',
    tagline: '숨 한 번에 바다를 누비는 사람들',
    color: '#0e7c86',
    queries: ['haenyeo', 'jeju haenyeo', 'jeju lady divers', 'korean woman diver'],
    // 태그에 haenyeo/diver 가 있는 사진만 (일반 제주 풍경, 부산 갈매기 등은 제외)
    filter: {
      include: ['haenyeo', 'diver', 'diving', 'sea woman'],
      soft: ['jeju woman', 'jeju sea', 'seafood'],
      exclude: ['scuba', 'busan', 'seagull', 'bikini'],
    },
    description:
      '산소통 없이 숨을 참고 바다에 들어가 전복, 소라, 미역 등을 채취하는 제주의 여성 잠수부예요. 해녀 문화는 2016년 유네스코 인류무형문화유산으로 등재됐고, 용감하고 강인한 이야기의 주인공으로 사랑받아요.',
    facts: ['물질을 마치고 내쉬는 숨소리를 "숨비소리"라고 불러요', '테왁(부력 도구)과 망사리가 필수 장비', '유네스코 인류무형문화유산(2016)'],
  },
  {
    slug: 'gamgyul',
    emoji: '🍊',
    name: '제주 감귤',
    tagline: '새콤달콤 제주의 대표 특산물',
    color: '#ff8a1f',
    queries: ['jeju tangerine', 'hallabong', 'tangerine', 'mandarin orange'],
    // 뱅쇼(음료), 폭포, AI 패턴 일러스트, 사과·호두 사진 등을 제외
    filter: {
      include: ['tangerine', 'mandarin', 'hallabong', 'clementine', 'citrus'],
      soft: ['orange', 'fruit'],
      exclude: ['wine', 'drink', 'christmas', 'kitchen', 'falls', 'waterfall', 'cherry blossom', 'apple', 'walnut', 'ai generated', 'pattern', 'vector'],
    },
    description:
      '따뜻한 기후의 제주에서 자라는 감귤은 겨울 간식이자 제주의 상징이에요. 한라봉, 천혜향, 레드향처럼 이름도 모양도 다양한 만감류가 있어 귀여운 과일 캐릭터로 만들기 좋은 소재예요.',
    facts: ['한라봉·천혜향·레드향 등 다양한 품종', '귤 따기 체험은 인기 관광 프로그램', '귤꽃 향기는 초여름 제주의 향기'],
  },
  {
    slug: 'hallasan',
    emoji: '⛰️',
    name: '한라산',
    tagline: '제주의 한가운데, 남한에서 가장 높은 산',
    color: '#2f7d4f',
    queries: ['hallasan', 'mt hanlla', 'jeju mountain', 'jeju snow mountain'],
    // 철자가 'Hanlla'(Mt Hanlla)로 올라온 사진도 포함. 'hallabong'(감귤)과 헷갈리지 않게 'halla' 단독은 쓰지 않음
    filter: {
      include: ['hallasan', 'hanlla', 'mount halla', 'mt halla'],
      soft: ['mountain', 'volcano', 'mountaineering'],
      exclude: ['snow white', 'city', 'urban', 'building', 'leaf', 'leaves', 'hallabong', 'fruit', 'cormorant'],
    },
    description:
      '해발 1,947m로 남한에서 가장 높은 산이에요. 정상에는 화구호인 백록담이 있고, 오르는 높이에 따라 식물의 모습이 달라져요. 유네스코 세계자연유산(제주 화산섬과 용암동굴)의 중심이기도 해요.',
    facts: ['해발 1,947m, 정상에는 화구호 백록담', '고도에 따라 달라지는 식생', '유네스코 세계자연유산에 포함'],
  },
  {
    slug: 'oreum',
    emoji: '🌋',
    name: '오름',
    tagline: '제주 들판 곳곳의 작은 화산',
    color: '#7aa63a',
    queries: ['jeju oreum', 'oreum', 'jeju silver grass', 'jeju pampas grass', 'jeju meadow'],
    // 'oreum' 태그 사진이 적어서, 부족하면 억새·초원 사진으로 보충 (새·폭포·해변·차량 등은 제외)
    filter: {
      include: ['oreum'],
      soft: ['silver grass', 'pampas', 'meadow', 'pasture', 'grass'],
      exclude: ['cormorant', 'egret', 'heron', 'gull', 'bird', 'falls', 'waterfall', 'bmw', 'suv', 'tea', 'beach', 'udo', 'lake', 'city', 'olle', 'mandarin', 'fruit', 'cliff'],
    },
    description:
      '오름은 한라산 주변에 솟아 있는 작은 기생화산이에요. 제주에는 360여 개의 오름이 있고, 부드러운 곡선과 억새 물결이 만드는 풍경 덕분에 일러스트와 캐릭터 배경으로 자주 쓰여요.',
    facts: ['제주 곳곳에 360여 개', '가을 억새와 일몰 풍경이 유명', '가볍게 오를 수 있는 곳이 많아요'],
  },
  {
    slug: 'jeju-pony',
    emoji: '🐴',
    name: '제주 조랑말',
    tagline: '작지만 튼튼한 제주의 말',
    color: '#a0693a',
    queries: ['jeju pony', 'pony meadow jeju', 'jeju horse', 'jeju island horse'],
    // '제주 AND 말' 인 사진만 우선. 부족하면 일반 말 사진으로 보충하되 아이슬란드·페가수스·유니콘 등은 제외
    filter: {
      require: [['jeju', 'korea'], ['horse', 'pony', 'foal']],
      soft: ['pony', 'horse', 'foal'],
      exclude: ['iceland', 'icelandic', 'pegasus', 'unicorn', 'fantasy', 'sleigh', 'winter', 'eye', 'car', 'cormorant'],
    },
    description:
      '제주마(조랑말)는 키는 작지만 튼튼해서 오랫동안 제주 사람들과 함께 살아온 토종 말이에요. 초원에서 풀을 뜯는 모습이 푸근해서 평화로운 제주를 표현하는 캐릭터로 잘 어울려요.',
    facts: ['몸집은 작고 체력은 튼튼', '초원 목장이 제주 곳곳에 있어요', '승마 체험으로도 인기'],
  },
  {
    slug: 'seongsan',
    emoji: '🌅',
    name: '성산일출봉',
    tagline: '바다 위에 떠오른 거대한 왕관',
    color: '#e8590c',
    queries: ['seongsan sunrise peak', 'seongsan ilchulbong', 'jeju sunrise', 'jeju holy mountain'],
    // 'Seongsan'이 들어간 서울 성산대교(한강 다리) 사진 제외
    filter: {
      include: ['seongsan', 'sunrise peak', 'ilchulbong'],
      soft: ['jeju sunrise', 'holy mountain', 'holy', 'sunrise'],
      exclude: ['bridge', 'seoul', 'han river', 'salary', 'night view'],
    },
    description:
      '바닷속 화산 폭발로 만들어진 분화구로, 꼭대기에서 바라보는 일출이 유명해요. 왕관처럼 둥글게 솟은 모양이 독특해서 제주의 랜드마크로 자주 그려져요. 유네스코 세계자연유산에도 포함돼 있어요.',
    facts: ['수중 화산 폭발로 생긴 분화구', '일출 명소, 정상에서 보는 바다 전망', '유네스코 세계자연유산 구역'],
  },
  {
    slug: 'canola',
    emoji: '🌼',
    name: '유채꽃',
    tagline: '봄이면 제주를 노랗게 물들이는 꽃',
    color: '#f2c200',
    queries: ['jeju canola', 'jeju rape flowers', 'rapeseed field', 'canola field'],
    // 제주 + 유채(rape flowers) 사진 우선, 부족하면 일반 유채밭으로 보충. 주의: 'rape'만 쓰면 'grape'가 걸려서 구체적인 단어만 사용
    filter: {
      require: [['jeju'], ['rape flower', 'rapeseed', 'canola', 'oilseed']],
      soft: ['rape flower', 'rapeseed', 'canola', 'oilseed', 'yellow flower'],
      exclude: ['cormorant', 'bird', 'bee', 'pollination', 'mower'],
    },
    description:
      '이른 봄이 되면 제주 들판과 바닷가가 노란 유채꽃으로 가득 차요. 파란 바다, 검은 돌담, 노란 꽃의 색 대비가 선명해서 제주의 봄을 상징하는 소재로 사랑받아요.',
    facts: ['이른 봄에 절정을 맞는 노란 꽃', '검은 돌담·파란 바다와 색 대비가 예뻐요', '봄 축제와 사진 명소로 유명'],
  },
]

export const findIp = (slug) => IPS.find((i) => i.slug === slug)

// 홈 화면 대표 이미지: 제주 + 바다/일출/해안 풍경만 (새·단풍·차밭·키워드 스팸 사진 제외)
export const HERO = {
  queries: ['jeju sunrise ocean', 'jeju island ocean', 'jeju island'],
  filter: {
    require: [['jeju', 'korea'], ['sunrise', 'ocean', 'sea', 'coast', 'beach', 'sunset', 'seascape', 'sky']],
    exclude: ['salary', 'bird', 'cormorant', 'udo', 'harbor', 'vacation', 'summer'],
  },
}
