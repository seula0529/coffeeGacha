export const prizes = [
  {
    id: 'dripbag',
    name: '드립백 세트',
    desc: '엄선한 원두로 제작한 드립백 3입 세트',
    emoji: '☕',
    weight: 70,
  },
  {
    id: 'gifticon',
    name: '커피 기프티콘',
    desc: '가까운 카페에서 바로 쓰는 아메리카노 기프티콘',
    emoji: '🎟️',
    weight: 30,
  },
]

export function drawPrize() {
  const total = prizes.reduce((sum, p) => sum + p.weight, 0)
  let r = Math.random() * total
  for (const prize of prizes) {
    if (r < prize.weight) return prize
    r -= prize.weight
  }
  return prizes[0]
}
