/** @param {NS} ns */
export async function main(ns) {
  const infiltrations = ns.infiltration.getPossibleLocations()
    .map(infiltration => ns.infiltration.getInfiltration(infiltration.name))
    .map(infiltration => ({
      ...infiltration,
      difficultyPercent: ns.formatPercent(infiltration.difficulty / 3)
    }))

  infiltrations.sort((a, b) => (a.reward.tradeRep / a.maxClearanceLevel) > (b.reward.tradeRep / a.maxClearanceLevel) ? 1 : -1)
  ns.print(JSON.stringify(infiltrations, null, 2))
  ns.write('data/infiltrations.json', JSON.stringify(infiltrations , null, 2), 'w')
}