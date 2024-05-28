import { createAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const currentRam = ns.getServerMaxRam('home')
  const cost = currentRam*3.2*(10**4)*1.58**(Math.log2(currentRam))
  const nextRam = currentRam*2
  createAction(ns, {
    name: 'upgradeHomeRam',
    label: 'Home Ram ' + ns.formatRam(nextRam),
    ram: nextRam,
    value: nextRam,
    cost
  })
}