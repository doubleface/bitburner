/** @param {NS} ns */
export async function runAndWait(ns, script, threads = 1, ...args) {
  const pid = ns.run(script, threads, ...args)
  if (pid == 0) {
    ns.toast("Failed to run " + script, "error", null)
  }
  while (ns.isRunning(pid)) {
    await ns.sleep(10)
  }
}

export function execCommand(command) {
  const terminalInput = eval('document').getElementById('terminal-input')
  terminalInput.value = command;
  terminalInput[Object.keys(
    terminalInput)
      .find(k => k.startsWith('__reactProps$'))
  ].onChange({
    target: terminalInput
  })
}

/** @param {NS} ns */
export function createAction(ns, action) {
  const {priority = 10} = action
  
  ns.write(`data/actions/${action.name}.json`, JSON.stringify({...action, priority}, null, 2), 'w')
}

/** @param {NS} ns */
export function getAction(ns, actionFile) {
  return JSON.parse(ns.read(actionFile))
}
