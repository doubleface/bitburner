/** @param {NS} ns */
export async function main(ns) {
  const [limit] = ns.args
  const config = JSON.parse(ns.read('data/config.json') || '{}')
  config.nbInstancesLimit = limit
  ns.write('data/config.json', JSON.stringify(config, null, 2), 'w')
}