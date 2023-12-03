export default function (input: string) {
  const lines = input.split('\n').map(l => `${l}.`)
  const partNumbers: Array<number> = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let numSequence = ''
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const isNumber = !isNaN(Number(char))
      if (isNumber) {
        numSequence += char
      } else if (numSequence) {
        const adjLinesIdx = []
        // first line
        if (i === 0) {
          adjLinesIdx.push(i + 1)
        }
        // last line
        else if (i === lines.length - 1) {
          adjLinesIdx.push(i - 1)
        }
        // middle lines
        else {
          adjLinesIdx.push(i - 1)
          adjLinesIdx.push(i + 1)
        }
        const unRestrictedStartRange = j - numSequence.length - 1
        const unRestrictedEndRage = j

        const startRange =
          unRestrictedStartRange >= 0 ? unRestrictedStartRange : 0
        const endRange =
          unRestrictedEndRage <= line.length ? unRestrictedEndRage : line.length

        if (isSpecialChar(line[startRange]) || isSpecialChar(line[endRange])) {
          partNumbers.push(Number(numSequence))
        } else {
          outer: for (let l = 0; l < adjLinesIdx.length; l++) {
            const adjLine = lines[adjLinesIdx[l]]

            for (let p = startRange; p <= endRange; p++) {
              const adjChar = adjLine[p]
              if (isSpecialChar(adjChar)) {
                partNumbers.push(Number(numSequence))
                break outer
              }
            }
          }
        }
        numSequence = ''
      }
    }
  }
  return partNumbers.reduce((acc, curr) => acc + curr, 0)
}

function isSpecialChar(char: string): boolean {
  const isNumber = !isNaN(Number(char))
  const isPeriod = char === '.'
  return !isPeriod && !isNumber
}
