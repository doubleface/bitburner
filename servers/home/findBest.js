/** @param {NS} ns */
export async function main(ns) {
  let servers = JSON.parse(ns.read('data/serversStateWithAnalyze.json'))
  servers.sort((a, b) => a.possibleYield > b.possibleYield ? 1 : -1)
  for (const server of servers) {
    displayServer(ns, server)
  }

  ns.tprint('chosen one: ')
  displayServer(ns, servers.filter(s => s.weakenTime < 1000 * 60).pop())
}

function displayServer(ns, serverData) {
  ns.tprint(serverData.hostname, ': ')
  ns.tprint(' money: ', ns.formatNumber(serverData.moneyAvailable), ' / ', ns.formatNumber(serverData.moneyMax))
  ns.tprint(' difficulty: ', ns.formatNumber(serverData.hackDifficulty), ' / ', ns.formatNumber(serverData.minDifficulty))
  ns.tprint(' weaken time: ', ns.tFormat(serverData.weakenTime))
  ns.tprint(' current weaken time: ', ns.tFormat(serverData.currentWeakenTime))
  ns.tprint(' yield: ', ns.formatNumber(serverData.possibleYield || 0))
  ns.tprint(' ')
}
