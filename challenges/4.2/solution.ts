export default function (input: string) {
  const cards = input.split('\n').map(card => {
    const winningNumbers = card
      .split(': ')[1]
      .split(' | ')[0]
      .split(' ')
      .reduce((acc, curr) => {
        acc[curr] = curr
        return acc
      }, {} as Record<string, string>)
    const myNumbers = card.split(': ')[1].split(' | ')[1].split(' ')
    return {
      winningNumbers,
      myNumbers,
      ownedCopies: 1,
    }
  })
  cards.forEach((card, idx) => {
    const numOfMatching = card.myNumbers.reduce((acc, curr) => {
      if (card.winningNumbers[curr]) {
        acc += 1
      }
      return acc
    }, 0)
    for (let i = 1; i <= numOfMatching; i++) {
      cards[idx + i].ownedCopies += card.ownedCopies
    }
  })
  return cards.reduce((acc, curr, idx) => {
    acc += curr.ownedCopies
    return acc
  }, 0)
}
