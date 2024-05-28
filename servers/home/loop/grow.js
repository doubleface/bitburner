/** @param {NS} ns */
export async function main(ns) {
  const additionalMsec = ns.args[1] ?? 0
  await ns.sleep(additionalMsec)
  while(true) {
    await ns.grow(ns.args[0], {
      stock: true
    })
  }
}