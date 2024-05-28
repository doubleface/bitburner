/** séparé de analyzeServers pour cause de besoin de ram au démarrage */
/** @param {NS} ns */
export async function main(ns) {
  const servers = JSON.parse(ns.read('data/servers.json'))
    .map(server => ({...server, ...ns.getServer(server.hostname)}))

  ns.write('data/serversState.json', JSON.stringify(servers, null, 2), 'w')
}