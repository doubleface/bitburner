/** @param {NS} ns */
export async function main(ns) {
  for (const file of ns.ls('home', 'data/actions/')) {
    ns.rm(file, 'home')
  }
  ns.run('demon.js')
}