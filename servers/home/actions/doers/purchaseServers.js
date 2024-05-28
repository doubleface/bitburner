import { getAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [actionFile] = ns.args
  const action = getAction(ns, actionFile)
  ns.tprint('action: ', action)
  for (let i = 0; i < action.value; i++) {
    ns.purchaseServer('pserver', 2)
  }
  ns.toast('Purchased ' + action.value + ' servers', "success", null)
}