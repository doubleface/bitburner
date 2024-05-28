import { getAction } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [actionFile] = ns.args
  const action = getAction(ns, actionFile)
  for (const server of ns.getPurchasedServers()) {
    ns.upgradePurchasedServer(server, action.ram)
  }
  ns.toast('Upgrades purchased servers to ' + ns.formatRam(action.ram), "success", null)
}