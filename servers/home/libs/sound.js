/** @param {NS} ns */
export async function main(ns) {
  okSound()
}

export async function okSound() {
  sound(400)
}

export async function koSound() {
  sound(100)
}

export async function multipleOkSound() {
  let nb = 2
  while (nb > 0) {
    ok()
    nb--
    await ns.sleep(100)
  }
}

export function sound(frequency, duration = 0.4) {
  const audioContext = new AudioContext()
  const osc = audioContext.createOscillator()
  const envelope = audioContext.createGain()
  osc.frequency.setValueAtTime(frequency, 0)
  const audioConnect = 'connect' // to avoid wrong ram cost
  osc[audioConnect](envelope)
  osc.start()
  osc.stop(duration)
  envelope.gain.value = 0
  envelope.gain.linearRampToValueAtTime(1, 0.1)
  envelope.gain.linearRampToValueAtTime(0, 0.4)
  envelope[audioConnect](audioContext.destination)
}