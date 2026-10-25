// Position du soleil selon l'heure réelle du visiteur, et ambiance (couleurs) qui en découle.
// Calcul solaire simplifié (précision de quelques minutes, largement suffisante pour l'ambiance).

const RAD = Math.PI / 180

// Longitude « solaire » déduite du fuseau horaire hors heure d'été (Paris → 15°), latitude de la France
function observer(date) {
  // En France (fuseau Europe/Paris) : coordonnées de Clermont-Ferrand
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (tz === 'Europe/Paris') return { lat: 45.78, lon: 3.08 }
  } catch (e) { /* fuseau inconnu */ }
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset()
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset()
  const standardOffset = Math.max(jan, jul) // en minutes, hors heure d'été
  return { lat: 46, lon: -standardOffset / 4 }
}

/** Élévation et azimut du soleil (en degrés) pour une date donnée. */
export function sunPosition(date = new Date()) {
  const { lat, lon } = observer(date)
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const day = (date.getTime() - start) / 86400000
  const g = (2 * Math.PI / 365) * (day - 1)
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
  const utcMin = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60
  const solarMin = utcMin + eqTime + 4 * lon
  const ha = (solarMin / 4 - 180) * RAD
  const phi = lat * RAD
  const cosZen = Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(ha)
  const zen = Math.acos(Math.min(1, Math.max(-1, cosZen)))
  const elevation = 90 - zen / RAD
  let az = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(phi) - Math.tan(decl) * Math.cos(phi)) / RAD + 180
  az = (az + 360) % 360 // 0 = nord, 90 = est, 180 = sud, 270 = ouest
  return { elevation, azimuth: az }
}

// Ambiances de référence
export const MOODS = {
  night: { skyTop: '#060b1f', skyMid: '#14254d', skyLow: '#3a4f7a', sun: '#dfe8ff', water: '#164a70', waterDeep: '#081e36', lagoon: '#1f6f8a', foam: '#5f8fc4', fog: '#1b2c50', amb: 0.35, key: '#9fb8ff', keyI: 0.9, cloud: '#5a6a96', cloudGlow: '#3a4f7a' },
  dusk: { skyTop: '#2b4a7a', skyMid: '#f2a65a', skyLow: '#ffd9a0', sun: '#fff1c4', water: '#2a8c98', waterDeep: '#134f68', lagoon: '#3fb7a8', foam: '#fff1dc', fog: '#f0b878', amb: 0.55, key: '#ffcf96', keyI: 2.0, cloud: '#fff8ee', cloudGlow: '#ff9f80' },
  day: { skyTop: '#2f8fd8', skyMid: '#8fd3f4', skyLow: '#e6f7ff', sun: '#ffffff', water: '#18a6b8', waterDeep: '#0a5f86', lagoon: '#5fe0d0', foam: '#ffffff', fog: '#bfe6f5', amb: 0.75, key: '#fff4dc', keyI: 2.2, cloud: '#fff8ee', cloudGlow: '#e6f7ff' },
}

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

/**
 * Poids des ambiances selon l'élévation du soleil :
 * nuit sous -8°, crépuscule/aube autour de l'horizon, plein jour au-dessus de 20°.
 */
export function moodWeights(elevation) {
  const toDusk = smooth(-9, -2, elevation) // nuit → crépuscule
  const toDay = smooth(6, 22, elevation) // crépuscule → jour
  const night = 1 - toDusk
  const day = toDusk * toDay
  const dusk = toDusk * (1 - toDay)
  return { night, dusk, day }
}

/** Mélange des couleurs/intensités (THREE.Color est passé en paramètre pour rester indépendant). */
export function blendMood(THREE, w) {
  const out = {}
  for (const key of Object.keys(MOODS.day)) {
    const v = MOODS.day[key]
    if (typeof v === 'number') {
      out[key] = MOODS.night[key] * w.night + MOODS.dusk[key] * w.dusk + MOODS.day[key] * w.day
    } else {
      const c = new THREE.Color(0, 0, 0)
      c.add(new THREE.Color(MOODS.night[key]).multiplyScalar(w.night))
      c.add(new THREE.Color(MOODS.dusk[key]).multiplyScalar(w.dusk))
      c.add(new THREE.Color(MOODS.day[key]).multiplyScalar(w.day))
      out[key] = c
    }
  }
  return out
}

/** Libellé lisible pour l'interface ("Nuit", "Aube", "Coucher de soleil"…). */
export function moodLabel(elevation, azimuth) {
  if (elevation < -8) return 'Nuit'
  if (elevation < 8) return azimuth < 180 ? 'Aube' : 'Coucher de soleil'
  return 'Jour'
}
