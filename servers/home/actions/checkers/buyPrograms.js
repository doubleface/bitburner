import { createAction } from 'libs/utils'
import { hackExeList, getHackPortLevel } from 'libs/hackAll'
const costs = [500000, 1500000, 5000000, 30000000, 250000000]

/** @param {NS} ns */
export async function main(ns) {
  const player = JSON.parse(ns.read('data/player.json'))
  const maxPortsRequired = JSON.parse(ns.read('data/servers.json'))
    .filter(server =>
      server.hostname !== 'darkweb' // not needed
      && ns.getServerRequiredHackingLevel(server.hostname) <= player.skills.hacking
      && !ns.hasRootAccess(server.hostname)
    )
    .reduce((memo, server) => Math.max(memo, ns.getServerNumPortsRequired(server.hostname)), 0)

  for (let i=getHackPortLevel(ns) ; i < maxPortsRequired ; i++) {
    createAction(ns, {
      name: 'buyPrograms_' + hackExeList[i],
      doer: 'buyPrograms',
      program: hackExeList[i],
      label: hackExeList[i],
      cost: costs[i]
    })
  }
}