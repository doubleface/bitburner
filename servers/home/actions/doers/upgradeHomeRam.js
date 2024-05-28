import { getAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [actionFile] = ns.args
  const action = getAction(ns, actionFile)
  ns.toast('You can now upgrade home RAM to ' + action.value + ' for $' + ns.formatNumber(action.cost), "warning", null)
}