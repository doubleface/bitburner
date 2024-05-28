const SERVERS_TO_BACKDOOR = ['fulcrumassets', 'CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z']
export const hackExeList = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe']

/** @param {NS} ns */
export async function main(ns) {
  const servers = JSON.parse(ns.read('data/serversState.json'))
  const player = JSON.parse(ns.read('data/player.json'))
  const playerHackPortLevel = getHackPortLevel(ns)
  for (const server of servers) {
    if (!server.hasAdminRights && server.numOpenPortsRequired <= playerHackPortLevel && player.skills.hacking >= server.requiredHackingSkill) {
      getRootAccess({ ns, server })
      if (SERVERS_TO_BACKDOOR.includes(server.hostname) && !server.backdoorInstalled) {
        ns.toast('You should install backdoor on ' + server.hostname, 'warning', null)
      }
    }
  }
}

export function getHackPortLevel(ns) {
  let result = 0
  for (const hackExe of hackExeList) {
    if (ns.fileExists(hackExe, 'home')) {
      result++
    }
  }
  return result
}

function getRootAccess({ ns, server }) {
  ns.print('Getting root access on ', server.hostname, '...')
  let counter = 0
  for (const exe of hackExeList) {
    if (counter >= server.numOpenPortsRequired) break
    if (ns.fileExists(exe)) {
      ns[exe.split('.').shift().toLowerCase()](server.hostname)
      counter++
    }
  }
  ns.nuke(server.hostname)
  ns.print('  Done')
  ns.toast('Got root access on ' + server.hostname, 'success', null)

  // to avoid ram calculation problems
  ns.brutessh; ns.ftpcrack; ns.relaysmtp; ns.httpworm; ns.sqlinject
}
