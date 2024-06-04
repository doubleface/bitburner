/** @param {NS} ns */
export async function main(ns) {
  const {debug} = ns.flags([
    ['debug', false]
  ])
  const [target] = ns.args

  const playerData = JSON.parse(ns.read('data/player.json'))
  let servers = JSON.parse(ns.read('data/serversState.json'))
    .filter(server => server.hasAdminRights)

  const totalRam = servers
    .reduce((memo, s) => memo + getMaxRam(s), 0)
  
  servers = servers
    .filter(s => (debug && target) ? s.hostname === target : true)
    .map(server => ({
      ...server,
      ...getHackStats(ns, server, playerData, totalRam, debug)
    }))


  if (!debug) {
    ns.write('data/serversStateWithAnalyze.json', JSON.stringify(servers, null, 2), 'w')
  }
}

function logIfDebug(ns, label, value, debug) {
  if (debug) ns.tprint('debug: ', label, ': ', value)
}

function getHackStats(ns, serverData, playerData, totalRam, debug) {
  const hackChance = getOptimalHackChance(playerData, serverData)
  logIfDebug(ns, 'hackChance', hackChance, debug)
  const hackPercent = optimalHackAnalyze(ns, serverData)
  logIfDebug(ns, 'hackPercent', hackPercent, debug)
  const growPercent = Math.exp(Math.log(2) / ns.growthAnalyze(serverData.hostname, 2))
  logIfDebug(ns, 'growPercent', growPercent, debug)

  const hackFactor = hackPercent * 3.2
  let hackThreads = (1 / hackFactor) / hackChance
  logIfDebug(ns, 'hackThreads', hackThreads, debug)
  const hackSecurityAdded = 0.002 * hackThreads
  logIfDebug(ns, 'hackSecurityAdded', hackSecurityAdded, debug)

  const growFactor = growPercent - 1
  logIfDebug(ns, 'hackFactor', hackFactor, debug)
  logIfDebug(ns, 'growFactor', growFactor, debug)
  let growThreads = 1/growFactor
  logIfDebug(ns, 'growThreads', growThreads, debug)
  const growSecurityAdded = 0.004 * growThreads
  logIfDebug(ns, 'growSecurityAdded', growSecurityAdded, debug)
  let weakenThreads = (hackSecurityAdded + growSecurityAdded) / ns.weakenAnalyze(1)
  logIfDebug(ns, 'weakenThreads', weakenThreads, debug)
  const currentHackTime = ns.getHackTime(serverData.hostname)
  const currentWeakenTime = currentHackTime * 4
  const hackTime = currentHackTime * serverData.minDifficulty / serverData.hackDifficulty
  logIfDebug(ns, 'hackTime', hackTime, debug)
  const weakenTime = hackTime * 4
  logIfDebug(ns, 'weakenTime', weakenTime, debug)
  let threads = [growThreads, hackThreads, weakenThreads]
  const min = Math.min(...threads)
  const factor = 1 / min
  threads = threads.map(thread => {
    const result = thread*factor
    if (Math.abs(result-1) < 0.001) {
      return 1
    }
    return thread*factor
  })

  growThreads = threads[0]
  hackThreads = threads[1]
  logIfDebug(ns, 'final hackThreads', hackThreads, debug)
  weakenThreads = threads[2]

  const hackScriptRam = 1.7
  const growScriptRam = 1.75
  const weakenScriptRam = 1.75

  let instanceRam = Math.ceil(growThreads) * growScriptRam + Math.floor(hackThreads) * hackScriptRam + Math.ceil(weakenThreads) * weakenScriptRam
  let nbInstances = Math.floor(totalRam / instanceRam)

  const automaticSafetyFactor = (nbInstances / 2000 * 9 + 1)
  logIfDebug(ns, 'automaticSafetyFactor', automaticSafetyFactor, debug)

  growThreads = automaticSafetyFactor * growThreads
  logIfDebug(ns, 'final growThreads', growThreads, debug)
  weakenThreads = automaticSafetyFactor * weakenThreads
  logIfDebug(ns, 'final weakenThreads', weakenThreads, debug)

  instanceRam = Math.ceil(growThreads) * growScriptRam + Math.floor(hackThreads) * hackScriptRam + Math.ceil(weakenThreads) * weakenScriptRam
  logIfDebug(ns, 'instanceRam', instanceRam, debug)

  nbInstances = Math.floor(totalRam / instanceRam)
  logIfDebug(ns, 'nbInstances', nbInstances, debug)

  const hackMoney = serverData.moneyMax * hackPercent // money stollen with a single thread
  logIfDebug(ns, 'hackMoney', hackMoney, debug)
  const possibleYield = nbInstances * hackChance * hackMoney * hackThreads * 1000 / hackTime // 1000 is to have seconds
  logIfDebug(ns, 'possibleYield', possibleYield, debug)

  return {
    hackThreads,
    growThreads,
    weakenThreads,
    currentHackTime,
    currentWeakenTime,
    hackTime,
    weakenTime,
    hackChance,
    possibleYield,
    nbInstances,
    automaticSafetyFactor
  }
}

function getOptimalHackChance(playerData, serverData) {
  const hackFactor = 1.75
  const difficultyMult = (100 - serverData.minDifficulty) / 100
  const skillMult = hackFactor * playerData.skills.hacking
  const skillChance = (skillMult - serverData.requiredHackingSkill) / skillMult
  const chance = skillChance * difficultyMult * playerData.mults.hacking_chance
  return Math.min(1, Math.max(chance, 0))
}

function optimalHackAnalyze(ns, serverData) {
  return ns.hackAnalyze(serverData.hostname) / (100 - serverData.hackDifficulty) * (100 - serverData.minDifficulty)
}

export function getMaxRam(server) {
  return server.hostname === 'home'
    ? Math.max(server.maxRam - 100, 0) // keep 100 Go of home server free for running programs
    : server.maxRam
}