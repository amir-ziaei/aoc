export default function (input: string) {
  const lines = input.split('\n')
  let gearRatio = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (let c = 0; c < line.length; c++) {
      const char = line[c]
      if (!isStar(char)) continue
      const lookUps = [
        [i - 1, c - 1], // top left
        [i - 1, c], // top middle
        [i - 1, c + 1], // top right
        [i, c - 1], // middle left
        [i, c + 1], // middle right
        [i + 1, c - 1], // bottom left
        [i + 1, c], // bottom middle
        [i + 1, c + 1], // bottom right
      ]
      const inboundLookUps = lookUps.filter(l => {
        const isInBoundVertically = l[0] >= 0 && l[0] < lines.length
        const isInBoundHorizontally = l[1] >= 0 && l[1] < line.length
        return isInBoundVertically && isInBoundHorizontally
      })
      const numLookUps = inboundLookUps.filter(([x, y]) => {
        const isNum = isNumber(lines[x][y])
        return isNum
      })
      if (numLookUps.length < 2 || numLookUps.length > 6) continue
      const numbers = getNumbersForBox(numLookUps, lines)
      if (numbers.length !== 2) continue
      const num1 = numbers[0] as { value: string; idx: Array<number> }
      const num2 = numbers[1] as { value: string; idx: Array<number> }
      gearRatio += Number(num1.value) * Number(num2.value)
    }
  }
  return gearRatio
}

function isStar(char: string): boolean {
  return char === '*'
}
function isNumber(char: string): boolean {
  return !isNaN(Number(char))
}

function getNumbersForBox(box: Array<Array<number>>, table: Array<string>) {
  function readNumberHorizontally(cords: Array<number>) {
    let digits = [
      {
        value: table[cords[0]][cords[1]],
        idx: [cords[0], cords[1]],
      },
    ]
    // one loop to left
    for (let i = cords[1] - 1; i >= 0; i--) {
      const char = table[cords[0]][i]
      if (isNumber(char)) {
        digits = [
          {
            value: char,
            idx: [cords[0], i],
          },
          ...digits,
        ]
      } else {
        break
      }
    }
    // one loop to right
    for (let i = cords[1] + 1; i < table[cords[0]].length; i++) {
      const char = table[cords[0]][i]
      if (isNumber(char)) {
        digits = [
          ...digits,
          {
            value: char,
            idx: [cords[0], i],
          },
        ]
      } else {
        break
      }
    }
    return digits
  }
  let numbers: Array<Array<{ value: string; idx: Array<number> }>> = []
  box.forEach(b => {
    numbers.push(readNumberHorizontally(b))
  })
  const normalized = numbers.map(n => {
    return {
      value: n.reduce((acc, curr) => (acc += curr.value), ''),
      idx: n[0].idx,
    }
  })
  const withoutDuplicates = normalized.reduce(
    (acc, curr) => {
      const exists = acc.some(
        n =>
          n.value === curr.value &&
          n.idx[0] === curr.idx[0] &&
          n.idx[1] === curr.idx[1],
      )
      if (!exists) {
        acc.push(curr)
      }
      return acc
    },
    [] as {
      value: string
      idx: number[]
    }[],
  )
  return withoutDuplicates
}
