export default function (input: string) {
  const lines = input.split('\n')
  return lines
    .map(convertAlphabeticalNumbersToDigits)
    .map(calc)
    .reduce((acc, curr) => acc + curr, 0)
}

const numMap: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
}

function convertAlphabeticalNumbersToDigits(inputLn: string) {
  let matches = []
  for (let i = 0; i < inputLn.length; i++) {
    for (let j = 3; j <= 5; j++) {
      let sequence = inputLn.slice(i, i + j)
      if (sequence.match(/^(one|two|three|four|five|six|seven|eight|nine)$/)) {
        matches.push({
          value: sequence,
          index: i,
        })
      }
    }
  }
  if (matches.length === 0) {
    return inputLn
  }
  let chars = inputLn.split('')
  chars[matches[0].index] = numMap[matches[0].value]
  if (matches.length > 1) {
    let lastMatch = matches[matches.length - 1]
    chars[lastMatch.index] = numMap[lastMatch.value]
  }
  return chars.join('')
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
