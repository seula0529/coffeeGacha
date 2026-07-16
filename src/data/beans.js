export const beans = {
  acid: {
    tag: 'acid',
    name: '에티오피아 예가체프',
    emoji: '🍋',
    desc: '화사한 산미와 은은한 꽃향이 매력적인 원두예요.',
  },
  balance: {
    tag: 'balance',
    name: '콜롬비아 수프리모',
    emoji: '⚖️',
    desc: '산미와 바디감의 조화가 좋은 균형 잡힌 원두예요.',
  },
  dark: {
    tag: 'dark',
    name: '다크로스트 블렌드',
    emoji: '🌑',
    desc: '진한 바디감과 묵직한 다크초콜릿 향의 원두예요.',
  },
  smooth: {
    tag: 'smooth',
    name: '브라질 디카페인',
    emoji: '🌾',
    desc: '부드럽고 순한 목넘김, 카페인 걱정 없는 원두예요.',
  },
}

export function pickBean(answers) {
  const counts = {}
  for (const tag of answers) {
    counts[tag] = (counts[tag] || 0) + 1
  }
  let bestTag = answers[0]
  let bestCount = 0
  for (const [tag, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count
      bestTag = tag
    }
  }
  return beans[bestTag]
}
