import { createAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [name, label, cost] = ns.args
  createAction(ns, {
    name,
    label,
    cost
  })
  ns.tprint(`Created action ${name} with label ${label} and which costs $${ns.formatNumber(cost)}`)
}
