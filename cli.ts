import { watch } from 'node:fs'
import fs from 'node:fs'

const { 2: action, 3: challengeNumber } = Bun.argv

if (!challengeNumber) {
  console.error('Please specify a challenge')
  process.exit(1)
}

if (!action) {
  console.error('Please specify an action')
  process.exit(1)
}

const challengeDir = `./challenges/${challengeNumber}`

switch (action) {
  case 'solve': {
    const inputFileName = 'input'
    const input = await requireInputFile(inputFileName)
    const { default: solve } = await import(`${challengeDir}/solution.ts`)
    const output = solve(input)
    console.log(output)
    process.exit(0)
  }
  case 'example': {
    const inputFileName = 'example'
    const input = await requireInputFile(inputFileName)
    const { default: solve } = await import(`${challengeDir}/solution.ts`)
    const output = solve(input)
    console.log(output)
    process.exit(0)
  }
  case 'scaffold': {
    if (fs.existsSync(challengeDir)) {
      console.error(`Directory ${challengeDir} already exists`)
      process.exit(1)
    }
    fs.mkdirSync(challengeDir)
    await Promise.all([
      Bun.write(`${challengeDir}/input.txt`, ''),
      Bun.write(`${challengeDir}/example.txt`, ''),
      Bun.write(
        `${challengeDir}/solution.ts`,
        `export default function (input: string) {
  return 0
}`,
      ),
      Bun.write(`${challengeDir}/example.solution.txt`, ''),
    ])
    console.log(`Created scaffold for challenge ${challengeNumber}`)
    process.exit(0)
  }
  case 'test': {
    async function test() {
      const inputFileName = 'example'
      const input = await requireInputFile(inputFileName)
      const { default: solve } = await importFresh(
        `${challengeDir}/solution.ts`,
      )
      const output = solve(input)
      const expected = await Bun.file(
        `${challengeDir}/example.solution.txt`,
      ).text()
      if (output == expected) {
        console.log(`✅ Test passed. Expected ${expected}, got ${output}`)
      } else {
        console.error(`❌ Test failed. Expected ${expected}, got ${output}`)
      }
    }
    test()
    watch(challengeDir, async (_, filename) => {
      if (typeof filename !== 'string') return
      const filesToWatchFor = [
        'solution.ts',
        'example.solution.txt',
        'example.txt',
      ]
      if (!filesToWatchFor.includes(filename)) return
      await test()
    })
    break
  }
  default: {
    console.error('Unrecognized action')
    process.exit(1)
  }
}

async function requireInputFile(inputFileName: string) {
  return Bun.file(`${challengeDir}/${inputFileName}.txt`).text()
}

async function importFresh(modulePath: string) {
  const cacheBustingModulePath = `${modulePath}?update=${Date.now()}`
  return await import(cacheBustingModulePath)
}
