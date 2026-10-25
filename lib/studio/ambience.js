// Ambiance sonore du studio, générée en direct dans le navigateur (aucun fichier audio) :
// vagues, vent léger, nappe d'accords calme, notes pincées et quelques mouettes le jour.
// Composition originale.

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12) // numéro MIDI → fréquence

// Progression lente (ré dorien) : Dm9 – B♭maj7 – Fmaj7/A – C6
const CHORDS = [
  [50, 57, 62, 65, 69, 64],
  [46, 53, 58, 62, 65, 69],
  [45, 53, 57, 60, 64, 69],
  [48, 55, 60, 64, 67, 69],
]
const PENTA = [62, 64, 65, 67, 69, 72, 74, 76, 77, 79, 81]

export function createAmbience() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  // iPhone : sans ceci, le son Web Audio est coupé quand le bouton silencieux est activé
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback' } catch (e) { /* non pris en charge */ }
  const ctx = new Ctx()
  // Débloque la sortie audio sur iOS/Safari (doit avoir lieu pendant le geste de l'utilisateur)
  const unlock = () => { try { const b = ctx.createBuffer(1, 1, 22050); const s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0) } catch (e) { /* ignoré */ } }
  unlock()

  // ----- Chaîne de sortie -----
  const master = ctx.createGain(); master.gain.value = 0
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3
  master.connect(comp).connect(ctx.destination)

  // Écho doux (sert de « réverbération » pour la musique)
  const delay = ctx.createDelay(2); delay.delayTime.value = 0.42
  const fb = ctx.createGain(); fb.gain.value = 0.38
  const damp = ctx.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 2200
  delay.connect(damp).connect(fb).connect(delay)
  const wet = ctx.createGain(); wet.gain.value = 0.5
  delay.connect(wet).connect(master)

  const music = ctx.createGain(); music.gain.value = 0.5
  music.connect(master); music.connect(delay)

  // ----- Bruit (vagues et vent) -----
  const len = ctx.sampleRate * 4
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c); let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < len; i++) { // bruit rose approché
      const w = Math.random() * 2 - 1
      b0 = 0.997 * b0 + w * 0.029591; b1 = 0.985 * b1 + w * 0.032534; b2 = 0.95 * b2 + w * 0.048056
      d[i] = (b0 + b1 + b2 + w * 0.05) * 0.9
    }
  }
  const noise = (filterType, freq, q) => {
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.loopStart = Math.random()
    const f = ctx.createBiquadFilter(); f.type = filterType; f.frequency.value = freq; f.Q.value = q
    const g = ctx.createGain(); g.gain.value = 0
    src.connect(f).connect(g).connect(master); src.start()
    return { src, f, g }
  }
  const lfo = (target, rate, depth, offset) => {
    const o = ctx.createOscillator(); o.frequency.value = rate
    const a = ctx.createGain(); a.gain.value = depth
    o.connect(a).connect(target); target.value = offset; o.start()
    return o
  }

  // Ressac grave + écume aiguë, en décalé, comme des vagues qui arrivent et repartent
  const surf = noise('lowpass', 520, 0.4)
  lfo(surf.g.gain, 1 / 7.5, 0.16, 0.2)
  lfo(surf.f.frequency, 1 / 7.5, 260, 560)
  const foam = noise('bandpass', 2600, 0.6)
  lfo(foam.g.gain, 1 / 7.5, 0.035, 0.03)
  const wind = noise('bandpass', 380, 0.8)
  lfo(wind.g.gain, 1 / 19, 0.02, 0.035)
  lfo(wind.f.frequency, 1 / 13, 120, 400)

  // ----- Musique -----
  let night = 0
  let timers = []
  let chordIdx = 0

  function pad(freq, t, dur, vol) {
    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = freq * 1.003
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900 - night * 300
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 3)
    g.gain.setValueAtTime(vol, t + dur - 3)
    g.gain.linearRampToValueAtTime(0, t + dur + 1.5)
    o1.connect(f); o2.connect(f); f.connect(g).connect(music)
    o1.start(t); o2.start(t); o1.stop(t + dur + 2); o2.stop(t + dur + 2)
  }

  function pluck(freq, t, vol) {
    // Note pincée douce (type kalimba / harpe)
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2.01
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4)
    const g2 = ctx.createGain(); g2.gain.value = 0.25
    o.connect(g); o2.connect(g2).connect(g); g.connect(music)
    o.start(t); o2.start(t); o.stop(t + 2.5); o2.stop(t + 2.5)
  }

  function gull(t) {
    // Cri de mouette lointain : glissando descendant filtré
    const o = ctx.createOscillator(); o.type = 'sawtooth'
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 4
    const g = ctx.createGain(); g.gain.value = 0
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null
    o.connect(f).connect(g); (pan ? g.connect(pan).connect(master) : g.connect(master))
    if (pan) pan.pan.value = Math.random() * 1.6 - 0.8
    for (let k = 0; k < 2 + Math.floor(Math.random() * 2); k++) {
      const s = t + k * 0.32
      o.frequency.setValueAtTime(1350, s); o.frequency.exponentialRampToValueAtTime(820, s + 0.24)
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(0.012, s + 0.04); g.gain.linearRampToValueAtTime(0, s + 0.26)
    }
    o.start(t); o.stop(t + 1.2)
  }

  const CHORD_LEN = 9 // secondes par accord
  function scheduleChord() {
    if (ctx.state !== 'running') return // son encore bloqué par le navigateur : on n'empile pas de notes
    const t = ctx.currentTime + 0.1
    const chord = CHORDS[chordIdx % CHORDS.length]; chordIdx++
    chord.forEach((n, i) => pad(NOTE(n - (night > 0.5 ? 12 * (i === 0) : 0)), t, CHORD_LEN + 1, i === 0 ? 0.05 : 0.028))
    // quelques notes pincées dans l'accord
    const plucks = night > 0.5 ? 2 : 4
    for (let k = 0; k < plucks; k++) {
      if (Math.random() < 0.25) continue
      const n = PENTA[Math.floor(Math.random() * PENTA.length)]
      pluck(NOTE(n), t + 0.6 + k * (CHORD_LEN / plucks) + Math.random() * 0.6, 0.05 - night * 0.015)
    }
    if (night < 0.5 && Math.random() < 0.35) gull(t + 2 + Math.random() * 5)
  }

  let running = false, loop = 0
  function start() {
    if (running) return
    running = true
    unlock()
    ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2.5)
    if (ctx.state === 'running') { scheduleChord(); loop = setInterval(scheduleChord, CHORD_LEN * 1000) }
  }
  function stop() {
    if (!running) return
    running = false
    clearInterval(loop); loop = 0
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
    timers.push(setTimeout(() => { if (!running) ctx.suspend() }, 1400))
  }
  function setNight(n) {
    night = n
    music.gain.setTargetAtTime(0.5 - n * 0.15, ctx.currentTime, 2)
    surf.f.frequency.setTargetAtTime(560 - n * 120, ctx.currentTime, 2)
  }
  function dispose() { stop(); timers.forEach(clearTimeout); setTimeout(() => ctx.close(), 1500) }
  // Débloque la sortie audio (à appeler pendant un clic/toucher) sans lancer la musique
  function prime() { unlock(); return ctx.resume() }
  // La musique démarre dès que le navigateur autorise le son
  ctx.addEventListener?.('statechange', () => { if (ctx.state === 'running' && running && !loop) { scheduleChord(); loop = setInterval(scheduleChord, CHORD_LEN * 1000) } })

  return { start, stop, setNight, dispose, prime, get running() { return running }, get state() { return ctx.state } }
}

// Une seule ambiance pour tout le site : elle peut être débloquée au clic sur un lien « Studio »
// puis réutilisée par la page (indispensable sur iPhone, où le son doit naître d'un geste).
export function getAmbience() {
  if (typeof window === 'undefined') return null
  if (!window.__ascentAmbience) window.__ascentAmbience = createAmbience()
  return window.__ascentAmbience
}
