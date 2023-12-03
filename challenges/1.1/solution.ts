export default function (input: string) {
  const lines = input.split('\n')
  return lines.map(calc).reduce((acc, curr) => acc + curr, 0)
}

function calc(inputLn: string) {
  const numbers: Array<number> = []
  inputLn.split('').forEach((char, i) => {
    if (!isNaN(Number(char))) {
      numbers.push(Number(char))
    }
  })
  if (numbers.length === 1) {
    numbers.push(numbers[0])
  }
  return Number(`${numbers[0]}${numbers.at(-1)}`)
}
