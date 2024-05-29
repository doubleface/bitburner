import { deployInstancesToServers, getMaxRam } from 'libs/deploy'

/** @param {NS} ns */
export async function main(ns) {
  const [target] = ns.args
  const servers = JSON.parse(ns.read('data/serversStateWithAnalyze.json'))
    .filter(s => getMaxRam(s) > 0)

  servers.sort((a, b) => getMaxRam(a) > getMaxRam(b) ? -1 : 1)

  const weakenRam = 1.7
  const toWeaken = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)
  const weakenThreadsNeeded = Math.ceil(toWeaken / 0.05)
  ns.print('weakenThreadsNeeded: ', weakenThreadsNeeded)
  const weakenRamNeeded = weakenThreadsNeeded * weakenRam
  let totalRam = servers.reduce((memo, s) => memo + getMaxRam(s), 0)
  let weakenTime = ns.getHackTime(target) * 4
  if (weakenThreadsNeeded > 5) {
    ns.tprint('First needs weakening...')
    if (weakenRamNeeded < totalRam) {
      ns.tprint('In one batch...')
      const instance = createInstance('batch/weaken.js', 1000, weakenRam)
      await deployInstancesToServers({
        ns,
        instance,
        servers,
        timeOffset: 0,
        totalRam,
        target
      })
      ns.tprint('Waiting for ', ns.tFormat(weakenTime), '...')
      await ns.sleep(weakenTime + 1000)
    } else {
      ns.tprint('In loop...')
      ns.print('weakenRamNeeded: ', ns.formatRam(weakenRamNeeded))
      ns.print('totalRam: ', ns.formatRam(totalRam))
      const threads = (total / weakenRamNeeded) > 1000
        ? 1000
        : 1
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
  }


  if (ns.getServerMinSecurityLevel(target) < ns.getServerSecurityLevel(target)
    || ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)
  ) {
    const growRam = 1.75
    const instance = [
      ...Array(5).fill({ script: 'loop/grow.js', ram: growRam }),
      ...Array(4).fill({ script: 'loop/weaken.js', ram: weakenRam })
    ]
    const instanceRam = 5 * growRam + 4 * weakenRam
    const nbInstances = totalRam / instanceRam
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