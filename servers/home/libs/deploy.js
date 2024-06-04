export async function deployInstancesToServers({ns, instance, servers, timeOffset, totalRam, target}) {
  const givenServers = [...servers]
  let currentInstance = [...instance]
  ns.print('instance :', instance)
  const instanceRam = instance.reduce((memo, t) => memo + t.ram, 0)

  let count=1
  do {
    const currentServer = givenServers.pop()
    let currentRam = getMaxRam(currentServer)
    killGrep(ns, currentServer, ['grow', 'hack', 'weaken'])
    while (currentRam >= currentInstance[0]?.ram) {
      let shouldSleep = false
      const toRun = {}
      while (currentInstance.length && currentRam >= currentInstance[0].ram) {
        const currentThread = currentInstance.shift()
        currentRam -= currentThread.ram
        toRun[currentThread.script] = toRun[currentThread.script] === undefined
          ? [1, currentThread.offset ?? 0]
          : [toRun[currentThread.script][0] + 1, currentThread.offset ?? 0]
      }
      ns.tprint('deploy instance ' + count + ' on ', currentServer.hostname)
      if (currentInstance.length === 0 && totalRam - (getMaxRam(currentServer) - currentRam) > instanceRam) {
        currentInstance = [...instance]
        count++
        shouldSleep = true
      }
      for (const script of Object.keys(toRun)) {
        ns.scp(script, currentServer.hostname)
        ns.exec(script, currentServer.hostname, toRun[script][0], target, toRun[script][1] ?? 0)
      }
      if (shouldSleep) {
        ns.tprint('Wait ', ns.tFormat(timeOffset), '...')
        await ns.sleep(timeOffset)
      }
    }
    totalRam-= getMaxRam(currentServer)
  } while (givenServers.length)
}

export function getMaxRam(server) {
  return server.hostname === 'home'
    ? Math.max(server.maxRam - 100, 0) // keep 100 Go of home server free for running programs
    : server.maxRam
}

function killGrep(ns, server, names) {
  const procs = ns.ps(server.hostname)
  for (const proc of procs) {
    if (names.some(name => proc.filename.includes(name))) {
      ns.kill(proc.pid)
    }
  }
}