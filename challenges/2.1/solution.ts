export default function (input: string) {
  const games = input.split('\n').map(game => game.replace(/Game \d: /, ''))
  const withRounds = games.map(game => {
    return game.split('; ')
  })
  const withBalls = withRounds.map(game => {
    return game.map(round => {
      const res: Record<string, number> = {}
      const balls = round.split(', ')
      balls.forEach(ball => {
        const [count, color] = ball.split(' ')
        res[color] = parseInt(count, 10)
      })
      return res
    })
  })
  let ans = 0
  outer: for (let i = 0; i < withBalls.length; i++) {
    const game = withBalls[i]
    for (let j = 0; j < game.length; j++) {
      const round = game[j]
      if (round.red > 12 || round.green > 13 || round.blue > 14) {
        continue outer
      }
    }
    ans += i + 1
  }
  return ans
}
