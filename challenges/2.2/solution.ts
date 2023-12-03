export default function (input: string) {
  const games = input.split('\n').map(game => {
    return game.split(': ')[1]
  })
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
  let sum = 0
  for (let i = 0; i < withBalls.length; i++) {
    const game = withBalls[i]
    const mins = { green: 0, red: 0, blue: 0 }
    for (let j = 0; j < game.length; j++) {
      const round = game[j]
      if (round.green > mins.green) {
        mins.green = round.green
      }
      if (round.red > mins.red) {
        mins.red = round.red
      }
      if (round.blue > mins.blue) {
        mins.blue = round.blue
      }
    }
    let power = Object.values(mins).reduce((acc, curr) => acc * curr, 1)
    sum += power
  }
  return sum
}
