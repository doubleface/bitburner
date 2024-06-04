import { getAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [actionFile] = ns.args
  const action = getAction(ns, actionFile)
  const costString = '$' + ns.formatNumber(action.cost)
  try {
    const result = ns.singularity.purchaseTor()
    if (result) {
      ns.toast('Purchased TOR router for ' + costString, 'success', null)
    } else {
      ns.toast('Failed to purchase TOR router for ' + costString, 'error', null)
    }
  } catch (err) {
    ns.print('No singularity api available: ', err.message)
    ns.toast('You can now purchase Tor Router for ' + costString, "warning", null)
  }
}