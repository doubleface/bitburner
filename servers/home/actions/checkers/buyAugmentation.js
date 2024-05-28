/** @param {NS} ns */
export async function main(ns) {
  const doc = eval('document')
  const currentWorkTr = Array.from(doc.querySelectorAll('tr')).find(tr => tr.innerHTML.includes('Working for'))
  if (!currentWorkTr) {
    ns.exit()
  }
  ns.print('currentWorkTr: ', currentWorkTr.innerHTML)
  const currentFaction = currentWorkTr.querySelector('strong').innerText.trim()
  ns.print('currentFaction: ', currentFaction)
  const reputationTr = currentWorkTr.nextSibling
  ns.print('reputationTr: ', reputationTr.innerHTML)
  const match = reputationTr.innerText.match(/(.*) rep\s\((.*) \/ sec\)/)
  if (match) {
    let [_, repString, repSpeedString] = match

    const rep = getFullNumber(repString)
    ns.print('rep: ', rep)
    const repSpeed = getFullNumber(repSpeedString)
    ns.print('repSpeed: ', repSpeed)

    const objective = 100000
    const eta = Math.ceil(objective - rep / repSpeed)
    ns.print('eta: ', ns.tFormat(eta * 1000))
  }
}

function getFullNumber(nbString) {
  const factor = getUnityFactor(nbString.slice(-1)) 
  const nbStringNoUnity = factor === 1
    ? nbString
    : nbString.slice(0, -1)
  return factor * parseFloat(nbStringNoUnity.replace(',','.'))
}

function getUnityFactor(unityString) {
  const unities = ['k', 'm', 'b', 't', 'q']
  const index = unities.findIndex(unity => unity === unityString)
  return ((index + 1) * 1000) || 1
}