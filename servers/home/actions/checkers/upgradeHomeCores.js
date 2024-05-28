import { createAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const currentCores = ns.getServer('home').cpuCores
  const cost = 10**9 * 7.5**currentCores
  createAction(ns, {
    name: 'upgradeHomeCores',
    label: 'Home cores ' + (currentCores + 1),
    value: currentCores + 1,
    cost
  })
}