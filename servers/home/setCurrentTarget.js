/** @param {NS} ns */
export async function main(ns) {
  const [target] = ns.args
  const config = JSON.parse(ns.read('data/config.json') || '{}')
  config.currentTarget = target
  ns.write('data/config.json', JSON.stringify(config, null, 2), 'w')
}

export function autocomplete(data, args) {
  return data.servers.filter(server => server.includes(args[0]))
}