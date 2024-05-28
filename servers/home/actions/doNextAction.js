import { runAndWait } from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const {money} = JSON.parse(ns.read('data/player.json'))
  const actions = getActions(ns)
  const nextAction = actions.pop()
  if (nextAction && (nextAction.cost === undefined || nextAction.cost && nextAction.cost <= money)) {
    await runAndWait(ns, `actions/doers/${nextAction.doer || nextAction.name}.js`, 1, nextAction.file)
    ns.rm(nextAction.file, 'home')
  }
}

function actionSorter(a, b) {
  if ((a.priority ?? 10) === (b.priority ?? 10)) {
    return a.cost > b.cost ? -1 : 1
  } else {
    return (a.priority ?? 10) > (b.priority ?? 10) ? -1 : 1
  }
}

export function getActions(ns) {
  const actions = ns.ls('home', 'data/actions/')
    .map(actionFile => ({
      ...JSON.parse(ns.read(actionFile)),
      file: actionFile
    }))
    .flat()
  actions.sort(actionSorter)
  return actions
}