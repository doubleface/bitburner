import { deployInstancesToServers, getMaxRam } from 'libs/deploy'

/** @param {NS} ns */
export async function main(ns) {
  const [target] = ns.args
  const servers = JSON.parse(ns.read('data/serversStateWithAnalyze.json'))
    .filter(s => getMaxRam(s) > 0)

  servers.sort((a, b) => getMaxRam(a) > getMaxRam(b) ? -1 : 1)

  ns.run('setCurrentTarget.js', 1, target)

  const weakenRam = 1.7
  const toWeaken = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)
  const weakenThreadsNeeded = Math.ceil(toWeaken / 0.05)
  ns.print('weakenThreadsNeeded: ', weakenThreadsNeeded)
  const weakenRamNeeded = weakenThreadsNeeded * weakenRam
  let totalRam = servers.reduce((memo, s) => memo + getMaxRam(s), 0)
  let weakenTime = ns.getHackTime(target) * 4
  if (weakenThreadsNeeded > 5) {
    ns.tprint('First needs weakening...')
    ns.tprint('In loop...')
    ns.tprint('weakenRamNeeded: ', ns.formatRam(weakenRamNeeded))
    ns.tprint('totalRam: ', ns.formatRam(totalRam))
    const threads = (totalRam / weakenRam) > 1000
      ? Math.ceil(totalRam / weakenRamNeeded * 10)
      : Math.ceil(totalRam / weakenRamNeeded)
    ns.tprint('threads: ', threads)
    const instance = createInstance('loop/weaken.js', threads, weakenRam)
    const timeOffset = weakenTime / (totalRam / weakenRam)
    await deployInstancesToServers({
      ns,
      instance,
      servers,
      timeOffset,
      totalRam,
      target
    })
    while (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)) {
      await ns.sleep(timeOffset)
    }
  }

  if (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)
    || ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)
  ) {
    const growRam = 1.75
    const minimalInstanceRam = 5 * growRam + 4 * weakenRam
    const maximalNbInstances = Math.floor(totalRam / minimalInstanceRam)
    const factor = maximalNbInstances > 1000
      ? maximalNbInstances / 1000
      : 1
    const growThreads = Math.ceil(5 * factor)
    const weakenThreads = Math.ceil(4 * factor)
    const instance = [
      ...Array(growThreads).fill({ script: 'loop/grow.js', ram: growRam }),
      ...Array(weakenThreads).fill({ script: 'loop/weaken.js', ram: weakenRam })
    ]
    const instanceRam = growThreads * growRam + weakenThreads * weakenRam
    const nbInstances = totalRam / instanceRam
    ns.tprint('nbInstances: ', nbInstances)
    weakenTime = ns.getHackTime(target) * 4
    const timeOffset = weakenTime / nbInstances
    ns.tprint('Waiting for ', ns.tFormat(weakenTime), '...')
    await deployInstancesToServers({
      ns,
      instance,
      servers,
      timeOffset,
      totalRam,
      target
    })
    while (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)
      || ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
      await ns.sleep(timeOffset)
    }
  }

  ns.toast(target + ' init success', 'success', null)
}

export function autocomplete(data, args) {
  return data.servers.filter(server => server.includes(args[0]))
}

function createInstance(script, number, ram) {
  return [
    ...Array(number).fill({ script, ram })
  ]
}
