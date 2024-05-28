import { runAndWait } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const start = Date.now()
  const checkers = ns.ls('home', 'actions/checkers/')
  for (const checker of checkers) {
    await runAndWait(ns, checker)
  }
  ns.print(`Did next actions check in ${((Date.now() - start)/1000).toFixed(2)}s`)
}