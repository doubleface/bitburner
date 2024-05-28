import {execCommand} from 'libs/utils'

/** @param {NS} ns */
export async function main(ns) {
  const [target] = ns.args
  const servers = JSON.parse(ns.read('data/servers.json'))
  const server = servers.find(server => server.hostname.includes(target))
  if (!server) throw new Error('Could not find target ' + target)
  const command = server.path.split('/')
    .filter(Boolean)
    .map(s => `connect ${s};`)
    .join('')
  execCommand(command)
}

export function autocomplete(data, args) {
  const [target] = args
  return data.servers.filter(s => s.includes(target))
}