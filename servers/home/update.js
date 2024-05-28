import { runAndWait } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const start = Date.now()
  await runAndWait(ns, 'libs/scan.js')
  await runAndWait(ns, 'libs/updatePlayer.js')
  await runAndWait(ns, 'libs/updateServersState.js')
  await runAndWait(ns, 'libs/analyzeServers.js')
  await runAndWait(ns, 'libs/hackAll.js')
  await runAndWait(ns, 'actions/checkNextActions.js')
  ns.print(`Did update in ${((Date.now() - start)/1000).toFixed(2)}s`)
}