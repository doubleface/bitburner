import {runAndWait} from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  let counter = 0
  while(true) {
    // only update data every 10s
    if (counter%10 === 0) {
      await runAndWait(ns, 'update.js')
    }
    updateHud(ns)

    counter++

    await runAndWait(ns, 'actions/doNextAction.js')
    await ns.sleep(1000)
  }
}

/** @param {NS} ns */
function updateHud(ns) {
  const headers = [
    'script inc',
    '-----------',
  ]
  const values = [
    ns.formatNumber(ns.getTotalScriptIncome()[0], 1) + '/sec',
    '-----------'
  ]

  const {currentTarget} = JSON.parse(ns.read('data/config.json') || '{}')
  if (currentTarget) {
    headers.push('target')
    values.push(currentTarget)

    headers.push('money')
    values.push('$' + ns.formatNumber(ns.getServerMoneyAvailable(currentTarget)))

    headers.push('money max')
    values.push('$' + ns.formatNumber(ns.getServerMaxMoney(currentTarget)))

    headers.push('diff.')
    values.push('' + ns.getServerSecurityLevel(currentTarget).toFixed(1))

    headers.push('diff. min')
    values.push('' + ns.getServerMinSecurityLevel(currentTarget).toFixed(1))

    headers.push('-----------')
    values.push('-----------')

    const infiltrationData = JSON.parse(ns.read('data/infiltrations.json'))
    const infiltrationDataAccessible = infiltrationData.filter(i => i.difficulty < 1.2)
    let bestInfiltration = null
    if (!infiltrationDataAccessible.length) {
      infiltrationData.sort((a, b) => a.difficulty > b.difficulty ? -1 : 1)
      bestInfiltration = infiltrationData.pop()
    } else {
      bestInfiltration = infiltrationDataAccessible.pop()
    }

    headers.push('Infiltration')
    values.push(bestInfiltration.location.name)
    headers.push('City')
    values.push(bestInfiltration.location.city)
    headers.push('Rep')
    values.push(ns.formatNumber(bestInfiltration.reward.tradeRep))
    headers.push('Money')
    values.push('$'+ ns.formatNumber(bestInfiltration.reward.sellCash))

    if (bestInfiltration.difficulty >= 1) {
      headers.push('Difficulty')
      values.push(bestInfiltration.difficultyPercent)
    }
  }
  const doc = eval('window.document')
  doc.getElementById('overview-extra-hook-0').innerText = headers.join("\n")
  doc.getElementById('overview-extra-hook-1').innerText = values.join("\n")
}