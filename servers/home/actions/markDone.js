/** @param {NS} ns */
export async function main(ns) {
  const [fileName] = ns.args
  const result = ns.rm('data/actions/' + fileName + '.json', 'home')
  if (result) {
    ns.tprint("Removed action " + fileName)
  } else {
    ns.tprint("Failed to remove action " + fileName)
  }
}

export function autocomplete(data, args) {
  const actionFiles = data.txts
    .filter(txt => txt.includes('data/actions/'))
    .map(txt => txt.split('/').pop().split('.').shift())
  return actionFiles.filter(txt => !args[0] || txt.includes(args[0]))
}