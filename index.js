const { generateChangelog } = require('@gitmoji-changelog/core')

const { buildRepoClient } = require('./client')

async function main() {
  const from = 'v0.25.0'
  const to = ''
  const client = await buildRepoClient("bpetetot", "conference-hall")
  const changelog = await generateChangelog(from, to, { client })

  return changelog
}

main().then(console.log)