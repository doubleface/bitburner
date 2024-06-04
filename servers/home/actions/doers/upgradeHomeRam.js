import { getAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [actionFile] = ns.args
  const action = getAction(ns, actionFile)

  const costString = '$' + ns.formatNumber(action.cost)
  try {
    const result = ns.singularity.upgradeHomeRam()
    if (result) {
      ns.toast('Upgraded home RAM for ' + costString, 'success', null)
    } else {
      ns.toast('Failed to upgrade home RAM for ' + costString, 'error', null)
    }
  } catch (err) {
    ns.print('No singularity api available: ', err.message)
    ns.toast('You can now upgrade home RAM to ' + action.value + ' for ' + costString, "warning", null)
  }
}