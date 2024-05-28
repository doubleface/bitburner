/** @param {NS} ns */
export async function main(ns) {
  const [target] = ns.args
  while(true) {
    ns.tprint(
      new Date().toLocaleTimeString(),
      ' money: ', ns.formatNumber(ns.getServerMoneyAvailable(target)), ' / ', ns.formatNumber(ns.getServerMaxMoney(target)),
      ' difficulty: ', ns.formatNumber(ns.getServerSecurityLevel(target)), ' / ', ns.formatNumber(ns.getServerMinSecurityLevel(target)),
    )
    await ns.sleep(1000)
  }
}