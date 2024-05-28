import { createAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  let currentRam
  try {
  currentRam = ns.getServerMaxRam('pserver')
  } catch (err) {
    ns.print('error', err.message)
  }
  if (currentRam) {
    const count = ns.getPurchasedServers().length
    const oneUpgradeCost = ns.getPurchasedServerUpgradeCost('pserver', currentRam*2)
    if (oneUpgradeCost !== Infinity) {
      createAction(ns, {
        name: 'upgradeServers',
        label: 'Upgrade servers',
        ram: currentRam * 2,
        value: currentRam * 2,
        cost: oneUpgradeCost * count
      })
    }
  }
}