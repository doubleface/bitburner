import colors from 'libs/colors'

/** @param {NS} ns */
export async function main(ns) {
  const {debug} = ns.flags([
    ['debug', false]
  ])
  const [target = null] = ns.args
  const servers = JSON.parse(ns.read('data/serversState.json'))
    .filter(server => server.maxRam)
    .filter(server => target !== null ? server.hostname.includes(target) : true)
    .filter(server => server.hasAdminRights)
    .map(server => ({...server, ps: ns.ps(server.hostname)}))
  
  servers.sort((a, b) => b.ramUsed === 0
    ? -1
    : (a.ramUsed > b.ramUsed ? 1 : -1))

  if (debug) {
    ns.tprint(JSON.stringify(servers, null, 2))
  } else {
    for (const server of servers) {
      ns.tprint(server.ramUsed ? '': colors['red'], server.hostname, '(', ns.formatRam(server.maxRam), ' -> ', ns.formatPercent(server.ramUsed/server.maxRam), '):')
      for (const process of server.ps) {
        ns.tprint('  ', process.filename, ' (', process.threads, ') ', JSON.stringify(process.args))
      }
    }
  }
}