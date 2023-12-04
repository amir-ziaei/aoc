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
    }
  })
  const ans = cards.reduce((acc, curr) => {
    let cardPoints = 0
    curr.myNumbers.forEach(num => {
      if (curr.winningNumbers[num]) {
        if (cardPoints === 0) {
          cardPoints = 1
        } else {
          cardPoints *= 2
        }
      }
    })
    acc += cardPoints
    return acc
  }, 0)
  return ans
}
