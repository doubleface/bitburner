/** @param {NS} ns */
export async function main(ns) {
  const [target] = ns.args
  ns.tprint(target, ': ',
    ' money: ', ns.formatNumber(ns.getServerMoneyAvailable(target)), ' / ', ns.formatNumber(ns.getServerMaxMoney(target)),
    ' difficulty: ', ns.formatNumber(ns.getServerSecurityLevel(target)), ' / ', ns.formatNumber(ns.getServerMinSecurityLevel(target)),
  )
}

export function autocomplete(data, args) {
  return data.servers.filter(server => server.includes(args[0]))
}