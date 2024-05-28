import { createAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const hasTorRouter = ns.hasTorRouter()
  if (!hasTorRouter) {
    createAction(ns, {
      name: 'purchaseTor',
      label: 'TOR',
      cost: 200000
    })
  }
}