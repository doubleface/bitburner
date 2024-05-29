import {runAndWait} from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const flags = ns.flags([
    ['safetyFactor', 1.5],
    ['g', null],
    ['h', null],
    ['w', null]
  ])
  const [target] = ns.args
  await runAndWait(ns, 'setCurrentTarget.js', 1, target)
  await runAndWait(ns, 'init.js', 1, target)
  const deployArgs = []
  for (const letter of ['g', 'h', 'w']) {
    if (flags[letter]) deployArgs.push(...['--' + letter, flags[letter]])
  }
  await runAndWait(ns, 'deploy.js', 1, target, '--safetyFactor', flags.safetyFactor, ...deployArgs)
}

export function autocomplete(data, args) {
  return data.servers.filter(server => server.includes(args[0]))
}