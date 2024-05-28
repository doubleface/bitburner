import { getActions } from 'actions/doNextAction'

/** @param {NS} ns */
export async function main(ns) {
  const actions = getActions(ns)
  for (const action of actions) {
    ns.tprint(`${action.name}: ${action.label} $${ns.formatNumber(action.cost)}`)
  }
}