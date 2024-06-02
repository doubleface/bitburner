import { deployInstancesToServers, getMaxRam } from 'libs/deploy'

/** @param {NS} ns */
export async function main(ns) {
  const flags = ns.flags([
    ['offset', -1],
    ['dryRun', false],
    ['safetyFactor', 10],
    ['g', null],
    ['h', null],
    ['w', null]
  ])
  const {dryRun, safetyFactor} = flags
  const [target] = ns.args
  let servers = JSON.parse(ns.read('data/serversStateWithAnalyze.json'))

  const targetServerData = servers.find(server => server.hostname === target)
  ns.print('targetServerData:', targetServerData)

  // ignore servers without ram
  servers = servers.filter(s => getMaxRam(s) > 0)

  servers.sort((a, b) => getMaxRam(a) > getMaxRam(b) ? -1 : 1)

  let { hackThreads, growThreads, weakenThreads, hackTime } = targetServerData

  hackThreads = Number(flags.h) || hackThreads
  growThreads = safetyFactor * (Number(flags.g) || growThreads)
  weakenThreads = safetyFactor * (Number(flags.w) || weakenThreads)

  const hackScriptRam = 1.7
  const growScriptRam = 1.75
  const weakenScriptRam = 1.75

  // total ram available on hacked servers
  let totalRam = servers.reduce((memo, s) => memo + getMaxRam(s), 0)
  ns.tprint('totalRam: ', ns.formatRam(totalRam))

  // an instance is a group of equilibred threads
  const instanceRam = hackThreads * hackScriptRam + growThreads * growScriptRam + weakenThreads * weakenScriptRam
  ns.tprint('instanceRam: ', ns.formatRam(instanceRam))
  let nbInstances = Math.floor(totalRam / instanceRam)
  ns.tprint('nbInstances: ', nbInstances)

  if (nbInstances === 0) {
    // minimize the number of hack threads
    nbInstances = 1
    const minimalRam = growThreads * growScriptRam + weakenThreads * weakenScriptRam
    hackThreads = (totalRam - minimalRam) / hackScriptRam
    ns.print('new hackThreads: ', hackThreads)
    if (hackThreads === 0) {
      throw new Error('Cannot deploy with 0 hack threads')
    }
  } else if (nbInstances > 1000) {
    const factor = nbInstances / 1000
    nbInstances = 1000
    hackThreads*= factor
    growThreads*= factor
    weakenThreads*= factor
  }
  hackThreads = Math.floor(hackThreads)
  growThreads = Math.ceil(growThreads)
  weakenThreads = Math.ceil(weakenThreads)

  const newInstanceRam = hackThreads * hackScriptRam + growThreads * growScriptRam + weakenThreads * weakenScriptRam
  ns.print('newInstanceRam: ', newInstanceRam)

  ns.tprint(`Deploying ${nbInstances} instances. grow:${growThreads},hack:${hackThreads},weaken:${weakenThreads} targetting ${target}...`)

  if (dryRun) {
    ns.exit()
  }

  const instance = [
    ...Array(hackThreads).fill({ script: 'loop/hack.js', ram: hackScriptRam, offset: hackTime * 3 - 2000 }),
    ...Array(growThreads).fill({ script: 'loop/grow.js', ram: growScriptRam, offset: hackTime * 0.8 - 1000 }),
    ...Array(weakenThreads).fill({ script: 'loop/weaken.js', ram: weakenScriptRam })
  ]
  ns.print('new hackThreads: ', hackThreads)
  await deployInstancesToServers({
    ns,
    instance,
    servers,
    timeOffset: flags.offset === -1 ? hackTime * 4 / nbInstances : flags.offset,
    totalRam,
    target
  })
  ns.toast("Deployed " + target + ' hacking on servers', "success", null)
}

export function autocomplete(data, args) {
  return data.servers.filter(server => server.includes(args[0]))
}
