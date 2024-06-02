/** @param {NS} ns */
export async function main(ns) {
  const [currentFavor, currentReputation] = ns.args
  ns.tprint((repToFavor(favorToRep(currentFavor) + currentReputation)).toFixed(2))
}

export function repToFavor(r) {
  return Math.log(r / 25000 + 1) / Math.log(1.02)
}

export function favorToRep(f) {
  return 25000 * (Math.pow(1.02, f) - 1)
}