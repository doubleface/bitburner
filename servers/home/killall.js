/** @param {NS} ns */
export async function main(ns) {
  const servers = JSON.parse(ns.read('data/servers.json'))
  for (const server of servers) {
    ns.killall(server.hostname, true)
  }
}