import { runAndWait } from 'libs/utils.js'
/** @param {NS} ns */
export async function main(ns) {
  for (const file of ns.ls('home', 'data/actions/')) {
    ns.rm(file, 'home')
  }
  ns.run('demon.js')
  await ns.sleep(5000)
  await runAndWait(ns, 'deploy.js', 1, 'n00dles', '-g', 7, '-h', 4, '-w', 1)
}
