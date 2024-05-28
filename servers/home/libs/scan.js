/**
 * Get a map of all the servers present in the nework and save them
 * in data/server.json.txt
 * 
 * @param {NS} ns
 **/
export async function main(ns) {
  const servers = scan(ns, 'home')
  ns.write('data/servers.json', JSON.stringify(servers, null, 2), 'w')
}

 /** @param {NS} ns */
function scan(ns, target, path = '', serversMap = {}) {
  serversMap[target] = {hostname: target, path: `${path}/${target}`}
  for (const server of ns.scan(target)) {
    if (!serversMap[server]) {
      scan(ns, server, `${path}/${target}`, serversMap)
    }
  }
  return Object.values(serversMap)
}