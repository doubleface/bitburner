import { createAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const remaining = ns.getPurchasedServerLimit() - ns.getPurchasedServers().length
  if (remaining > 0) {
    createAction(ns, {
      name: 'purchaseServers',
      label: 'Purchase servers',
      remaining,
      value: remaining,
      cost: ns.getPurchasedServerCost(2) * remaining
    })
  }
}