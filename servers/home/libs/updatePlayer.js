/** @param {NS} ns */
export async function main(ns) {
  const playerData = ns.getPlayer()
  ns.write('data/player.json', JSON.stringify(playerData, null, 2), 'w')
}