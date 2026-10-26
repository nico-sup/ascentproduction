// Monde 3D du « studio immersif » : archipel stylisé (rendu peint façon cartoon),
// une île par bloc Storyblok, lumière calée sur l'heure réelle.
import { sunPosition, moodWeights, blendMood, moodLabel } from './sun.js'

const MAX_ISL = 24
const HUB_R = 22
const PALETTES = {
  coucher: ['#f6b26b', '#e07b4f', '#4a2d2a'],
  ocean: ['#7fd0f0', '#5aa0c8', '#1f3b4f'],
  rose: ['#ffd9e0', '#f2b5a8', '#6d4b4b'],
  nuit: ['#3a5f8f', '#24406b', '#0e1b33'],
}

const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
const seeded = (seed) => { let s = seed % 2147483646 || 7; return () => (s = (s * 16807) % 2147483647) / 2147483647 }
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Disposition en spirale (Vogel) : chaque nouvelle île agrandit l'archipel sans chevauchement. */
export function layoutIslands(list) {
  return list.map((isl, i) => {
    const rnd = seeded(hashStr(isl.uid || String(i)))
    const angle = -Math.PI / 2 - 0.9 + i * 2.39996 // la première île apparaît devant, à gauche
    const dist = 86 + 30 * Math.sqrt(i)
    const r = 10 + rnd() * 3.5
    return { x: Math.cos(angle) * dist, z: Math.sin(angle) * dist, r, h: 4 + rnd() * 3, seed: hashStr(isl.uid || String(i)) }
  })
}

export async function createWorld(canvas, opts = {}) {
  const THREE = await import('~/vendor/three.module.js')
  const mobile = !!opts.mobile
  const reduced = !!opts.reduced
  const C = (c) => new THREE.Color(c)

  // ---------- Rendu ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = !mobile
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xffffff, 60, 380)
  const camera = new THREE.PerspectiveCamera(mobile ? 68 : 50, 1, 0.1, 2000)

  const toonTex = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat)
  toonTex.minFilter = toonTex.magFilter = THREE.NearestFilter
  toonTex.needsUpdate = true
  const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ color: C(color), gradientMap: toonTex, ...extra })

  // ---------- Ciel ----------
  const skyU = { top: { value: C('#2f8fd8') }, mid: { value: C('#8fd3f4') }, low: { value: C('#e6f7ff') }, sunC: { value: C('#fff') }, sunDir: { value: new THREE.Vector3(0, 0.5, -1).normalize() }, night: { value: 0 } }
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: `uniform vec3 top,mid,low,sunC,sunDir; uniform float night; varying vec3 vDir;
      float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
      void main(){ float y = vDir.y;
        vec3 c = mix(low, mid, smoothstep(-0.02, 0.18, y)); c = mix(c, top, smoothstep(0.15, 0.7, y));
        float d = max(dot(normalize(vDir), sunDir), 0.);
        c += sunC * (smoothstep(0.9985, 0.9991, d) * 1.6 + pow(d, 24.) * 0.45 * (1. - night*0.6) + pow(d, 4.) * 0.12 * (1. - night));
        vec3 q = floor(vDir*420.); float s = step(0.9975, h(q)) * smoothstep(0.05, 0.4, y); c += vec3(s)*0.9*night;
        gl_FragColor = vec4(c,1.); }`,
  }))
  scene.add(sky)

  // ---------- Lumières ----------
  const hemi = new THREE.HemisphereLight(0xffffff, 0x0a5f86, 0.7)
  scene.add(hemi)
  const key = new THREE.DirectionalLight(0xffffff, 2)
  key.castShadow = !mobile
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, far: 420 })
  scene.add(key, key.target)

  // ---------- Océan ----------
  const islVec = Array.from({ length: MAX_ISL }, () => new THREE.Vector3(0, 0, 0))
  const waterU = {
    time: { value: 0 }, shallow: { value: C('#18a6b8') }, deep: { value: C('#0a5f86') }, lagoon: { value: C('#5fe0d0') }, foam: { value: C('#fff') },
    sunDir: { value: skyU.sunDir.value }, sunC: { value: C('#fff') }, fogC: { value: C('#bfe6f5') }, camPos: { value: camera.position }, fogFar: { value: 380 },
    isl: { value: islVec }, islN: { value: 0 }, glint: { value: 1 },
  }
  const oceanSize = 1600
  const ocean = new THREE.Mesh(new THREE.PlaneGeometry(oceanSize, oceanSize, mobile ? 220 : 420, mobile ? 220 : 420), new THREE.ShaderMaterial({
    uniforms: waterU,
    vertexShader: `uniform float time; varying vec3 vW; varying float vH; varying vec3 vN;
      void acc(vec2 p, vec2 d, float f, float a, float s, inout float h, inout vec2 g){ float ph = dot(p,d)*f + time*s; h += sin(ph)*a; g += d*f*a*cos(ph); }
      void main(){ vec4 w = modelMatrix*vec4(position,1.); float h = 0.; vec2 g = vec2(0.);
        acc(w.xz, normalize(vec2(1.,.3)), .16, .6, 1.2, h, g); acc(w.xz, normalize(vec2(-.4,1.)), .23, .35, 1.6, h, g);
        acc(w.xz, normalize(vec2(.8,-.7)), .5, .12, 2.3, h, g); acc(w.xz, normalize(vec2(.2,.9)), .9, .05, 3.1, h, g);
        w.y += h; vH = h; vW = w.xyz; vN = normalize(vec3(-g.x, 1., -g.y)); gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform float time,fogFar,glint; uniform int islN; uniform vec3 shallow,deep,lagoon,foam,sunDir,sunC,fogC,camPos; uniform vec3 isl[${MAX_ISL}];
      varying vec3 vW; varying float vH; varying vec3 vN;
      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
      float fbm(vec2 p){ return noise(p)*.6 + noise(p*2.1)*.3 + noise(p*4.3)*.1; }
      void main(){
        vec3 n = normalize(vN); vec3 v = normalize(camPos - vW);
        float fres = pow(1. - max(dot(n, v), 0.), 4.);
        vec3 col = mix(deep, shallow, smoothstep(-0.7, 0.8, vH));
        float shore = 0., lag = 0.; float wob = (fbm(vW.xz*.25 + time*.1) - .5)*2.2;
        for (int i = 0; i < ${MAX_ISL}; i++) { if (i >= islN) break; float d = length(vW.xz - isl[i].xy) - isl[i].z*1.04;
          lag = max(lag, 1. - smoothstep(0., isl[i].z*.9, d));
          shore = max(shore, 1. - smoothstep(0.3, 1.8, abs(d - 0.6 + wob)));
          shore = max(shore, (1. - smoothstep(3.2, 4., abs(d - 4.5 + wob*1.4)))*0.55); }
        col = mix(col, lagoon, lag*0.85);
        col = mix(col, mix(shallow, vec3(1.), .25), fres*0.45);
        float spec = pow(max(dot(reflect(-sunDir, n), v), 0.), 220.);
        col += sunC * smoothstep(0.2, 0.6, spec) * glint * 0.9;
        float br = fbm(vW.xz*.55 + time*.1); float crest = smoothstep(0.86, 0.95, vH*0.85 + br*0.4) * smoothstep(0.35, 0.6, br);
        float caps = smoothstep(0.8, 0.83, fbm(vW.xz*.16 + vec2(time*.03, 0.))) * smoothstep(.4, .7, vH + .3);
        float dc = length(camPos - vW);
        float f = max(max(crest*0.85, caps*0.5*smoothstep(25., 70., dc)), shore);
        col = mix(col, foam, f*0.9);
        col = mix(col, fogC, smoothstep(50., fogFar, dc));
        gl_FragColor = vec4(col, 1.);
      }`,
  }))
  ocean.rotation.x = -Math.PI / 2
  scene.add(ocean)

  // ---------- Éléments de décor ----------
  const blob = (geo, amp) => { const p = geo.attributes.position; const v = new THREE.Vector3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + (Math.sin(v.x * 1.7) * Math.cos(v.z * 1.3) + Math.sin(v.y * 2.1)) * amp; p.setXYZ(i, v.x * k, v.y, v.z * k) } geo.computeVertexNormals(); return geo }

  function palm(rnd) {
    const g = new THREE.Group()
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.4, 2.5, 0), new THREE.Vector3(1.3, 5, 0)])
    const trunk = new THREE.Mesh(new THREE.TubeGeometry(curve, 6, 0.28, 5), toon('#9a6b43', { flatShading: true }))
    trunk.castShadow = true; g.add(trunk)
    const leaves = mobile ? 5 : 6
    for (let i = 0; i < leaves; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.55, 3.6, 4), toon(i % 2 ? '#3f9a3c' : '#56b84a', { flatShading: true }))
      leaf.position.set(1.3, 5, 0); leaf.rotation.set(0, (i / leaves) * Math.PI * 2 + rnd() * 0.3, 1.15); leaf.translateY(1.6); leaf.castShadow = true; g.add(leaf)
    }
    return g
  }

  function islandMesh(r, h, rnd, { trees = 5, rocks = 4 } = {}) {
    const g = new THREE.Group()
    const sand = new THREE.Mesh(blob(new THREE.CylinderGeometry(r * 0.92, r * 1.12, 2.4, 28, 2), 0.06), toon('#f2d6a2'))
    sand.position.y = 0.2; sand.receiveShadow = true; g.add(sand)
    const hill = new THREE.Mesh(blob(new THREE.SphereGeometry(r * 0.78, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), 0.1), toon('#5fae4e', { flatShading: true }))
    hill.scale.y = h / (r * 0.78); hill.position.y = 1.2; hill.castShadow = hill.receiveShadow = true; g.add(hill)
    for (let i = 0; i < rocks; i++) {
      const a = rnd() * 6.28
      const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8 + rnd() * 1.6, 0), toon('#8b8f99', { flatShading: true }))
      rk.position.set(Math.cos(a) * r * 1.05, 0.3, Math.sin(a) * r * 1.05); rk.rotation.set(rnd(), rnd(), rnd()); rk.castShadow = true; g.add(rk)
    }
    for (let i = 0; i < trees; i++) {
      const a = rnd() * 6.28, d = r * (0.3 + rnd() * 0.45)
      const t = palm(rnd)
      const y = 1.2 + h * Math.sqrt(Math.max(0, 1 - (d / (r * 0.78)) ** 2)) - 0.4
      t.position.set(Math.cos(a) * d, y, Math.sin(a) * d); t.rotation.y = rnd() * 6; t.scale.setScalar(0.8 + rnd() * 0.5); g.add(t)
    }
    return g
  }

  function placeholderTexture(title, colorKey) {
    const pal = PALETTES[colorKey] || PALETTES.coucher
    const c = document.createElement('canvas'); c.width = 640; c.height = 360
    const x = c.getContext('2d')
    const gr = x.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, pal[0]); gr.addColorStop(0.6, pal[1]); gr.addColorStop(1, pal[2])
    x.fillStyle = gr; x.fillRect(0, 0, 640, 360)
    x.strokeStyle = '#fff'; x.lineWidth = 4; const m = 26, L = 46
    ;[[m, m, 1, 1], [640 - m, m, -1, 1], [m, 360 - m, 1, -1], [640 - m, 360 - m, -1, -1]].forEach(([a, b, sx, sy]) => { x.beginPath(); x.moveTo(a, b + L * sy); x.lineTo(a, b); x.lineTo(a + L * sx, b); x.stroke() })
    x.fillStyle = '#e85a2a'; x.beginPath(); x.arc(52, 58, 8, 0, 7); x.fill()
    x.fillStyle = '#fff'; x.font = '600 22px Helvetica, Arial, sans-serif'; x.fillText('REC  ● STUDIO', 70, 66)
    x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.moveTo(300, 140); x.lineTo(350, 172); x.lineTo(300, 204); x.closePath(); x.fill()
    x.font = 'italic 46px Georgia, serif'; x.fillText(title.slice(0, 22), 52, 318)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
    return t
  }

  function screenMesh(title, colorKey) {
    const g = new THREE.Group()
    const frame = new THREE.Mesh(new THREE.BoxGeometry(16.8, 9.8, 0.5), toon('#5a3b24', { flatShading: true }))
    frame.castShadow = true; g.add(frame)
    const placeholder = placeholderTexture(title, colorKey)
    const imgMat = new THREE.MeshBasicMaterial({ map: placeholder, toneMapped: false })
    const img = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), imgMat)
    img.position.z = 0.27; g.add(img)
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 14, 6), toon('#6b4a2e', { flatShading: true }))
      post.position.set(s * 7.6, -7, -0.3); post.castShadow = true; g.add(post)
    }
    return { group: g, imgMat, placeholder }
  }

  function sailTexture() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d')
    x.fillStyle = '#f4ead6'; x.fillRect(0, 0, 512, 512)
    x.strokeStyle = 'rgba(120,90,60,.25)'; x.lineWidth = 3; for (let k = 1; k < 6; k++) { x.beginPath(); x.moveTo(0, k * 85); x.lineTo(512, k * 85); x.stroke() }
    x.strokeStyle = '#e85a2a'; x.lineWidth = 26; x.beginPath(); x.arc(256, 250, 130, 0, Math.PI * 2); x.stroke()
    x.fillStyle = '#16181a'; x.beginPath(); x.moveTo(256, 160); x.lineTo(340, 330); x.lineTo(296, 330); x.lineTo(256, 245); x.lineTo(216, 330); x.lineTo(172, 330); x.fill()
    x.font = '700 40px Helvetica, Arial, sans-serif'; x.textAlign = 'center'; x.fillText('ASCENT', 256, 450)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
  }

  function camRig() {
    const g = new THREE.Group()
    for (let k = 0; k < 3; k++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 5), toon('#222')); const a = k * 2.09; leg.position.set(Math.cos(a) * 0.45, 1, Math.sin(a) * 0.45); leg.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); g.add(leg) }
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.4), toon('#1d1f22')); body.position.y = 2.25; g.add(body)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 0.8, 12), toon('#111')); lens.rotation.x = Math.PI / 2; lens.position.set(0, 2.25, 1.05); g.add(lens)
    const rec = new THREE.Mesh(new THREE.SphereGeometry(0.08), new THREE.MeshBasicMaterial({ color: '#ff3b1f' })); rec.position.set(0.3, 2.65, 0.5); g.add(rec)
    return g
  }

  function shipMesh() {
    const g = new THREE.Group()
    const hs = new THREE.Shape(); hs.moveTo(-6, 0); hs.quadraticCurveTo(-5, -2.4, 0, -2.6); hs.quadraticCurveTo(6, -2.4, 7.5, 1); hs.lineTo(-6.5, 1.2); hs.closePath()
    const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 4, bevelEnabled: true, bevelSize: 0.4, bevelThickness: 0.6, bevelSegments: 2 }), toon('#7a4b2a', { flatShading: true }))
    hull.position.set(0, 0.6, -2); hull.castShadow = true; g.add(hull)
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(13, 0.4, 5.4), toon('#e8c26a')); stripe.position.set(0.5, 1.5, 0); g.add(stripe)
    const deck = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 4.6), toon('#b07a48')); deck.position.set(0.3, 1.7, 0); g.add(deck)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 14, 6), toon('#5c3a20')); mast.position.set(0, 8.5, 0); mast.castShadow = true; g.add(mast)
    const sailGeo = new THREE.PlaneGeometry(8, 8, 10, 10); const sp = sailGeo.attributes.position
    for (let i = 0; i < sp.count; i++) { const xx = sp.getX(i), yy = sp.getY(i); sp.setZ(i, Math.cos(xx / 8 * Math.PI) * 1.4 * (0.6 + 0.4 * Math.cos(yy / 8 * Math.PI))) }
    sailGeo.computeVertexNormals()
    const stex = sailTexture()
    const sail = new THREE.Mesh(sailGeo, new THREE.MeshToonMaterial({ map: stex, gradientMap: toonTex, side: THREE.FrontSide }))
    sail.position.set(0, 9.5, 0.4); sail.rotation.y = Math.PI / 2; sail.castShadow = true; g.add(sail)
    const stex2 = stex.clone(); stex2.wrapS = THREE.RepeatWrapping; stex2.repeat.x = -1; stex2.needsUpdate = true
    const sailB = new THREE.Mesh(sailGeo, new THREE.MeshToonMaterial({ map: stex2, gradientMap: toonTex, side: THREE.BackSide }))
    sailB.position.copy(sail.position); sailB.rotation.copy(sail.rotation); g.add(sailB)
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.2), toon('#e85a2a', { side: THREE.DoubleSide })); flag.position.set(0, 15.6, 1.1); flag.rotation.y = Math.PI / 2; g.add(flag)
    const cam = camRig(); cam.position.set(5.2, 1.85, 0); cam.rotation.y = -Math.PI / 2; cam.scale.setScalar(0.9); g.add(cam)
    return g
  }

  function droneMesh() {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 2), toon('#e9e6df')))
    const rotors = []
    for (const [ax, az] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 1.8), toon('#2a2c30')); arm.position.set(ax * 0.85, 0, az * 0.85); arm.rotation.y = ax * az * Math.PI / 4; g.add(arm)
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.04, 20), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35 })); rotor.position.set(ax * 1.45, 0.2, az * 1.45); g.add(rotor); rotors.push(rotor)
    }
    const gimbal = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), toon('#16181a')); gimbal.position.set(0, -0.4, 0.8); g.add(gimbal)
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.09), new THREE.MeshBasicMaterial({ color: '#e85a2a' })); led.position.set(0, 0.1, -1.05); g.add(led)
    return g
  }

  function lighthouseMesh() {
    const g = new THREE.Group()
    for (let k = 0; k < 4; k++) { const seg = new THREE.Mesh(new THREE.CylinderGeometry(2.2 - k * 0.35, 2.5 - k * 0.35, 4, 10), toon(k % 2 ? '#e85a2a' : '#f4ead6', { flatShading: true })); seg.position.y = 2 + k * 4; seg.castShadow = true; g.add(seg) }
    const lampMat = new THREE.MeshBasicMaterial({ color: '#fff3c0' })
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2, 10), lampMat); top.position.y = 18; g.add(top)
    const roof = new THREE.Mesh(new THREE.ConeGeometry(2, 2.2, 10), toon('#16181a')); roof.position.y = 20.1; g.add(roof)
    const geo = new THREE.ConeGeometry(7, 90, 32, 1, true); geo.translate(0, -45, 0); geo.rotateX(-Math.PI / 2)
    const beamMat = new THREE.MeshBasicMaterial({ color: '#fff1c0', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false, blending: THREE.AdditiveBlending })
    const beam = new THREE.Mesh(geo, beamMat); beam.position.y = 18; beam.rotation.x = -0.12
    const pivot = new THREE.Group(); pivot.position.y = 0; pivot.add(beam); g.add(pivot)
    return { group: g, pivot, beamMat }
  }

  function dockMesh(len = 16) {
    const g = new THREE.Group()
    for (let k = 0; k < len; k++) { const plank = new THREE.Mesh(new THREE.BoxGeometry(4, 0.25, 0.9), toon(k % 3 ? '#a87545' : '#94653b')); plank.position.set(0, 1.4, k); plank.castShadow = plank.receiveShadow = true; g.add(plank) }
    for (let k = 0; k <= len; k += 4) for (const s of [-1, 1]) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.4, 6), toon('#6b4a2e')); p.position.set(s * 1.9, 0.2, k); g.add(p) }
    return g
  }

  const cloudMat = toon('#fff8ee', { emissive: C('#e6f7ff'), emissiveIntensity: 0.4, fog: false })
  function cloudMesh(rnd, s) {
    const g = new THREE.Group(); g.scale.setScalar(s)
    const n = mobile ? 8 : 12
    for (let i = 0; i < n; i++) { const r = 2.2 + rnd() * 3; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, mobile ? 1 : 2), cloudMat); const t = i / (n - 1); m.position.set((t - 0.5) * 18 + rnd() * 2, Math.sin(t * Math.PI) * 4 + rnd() * 2, rnd() * 4 - 2); m.scale.y = 0.8; g.add(m) }
    const base = new THREE.Mesh(new THREE.CylinderGeometry(9, 8, 1.5, 16), cloudMat); base.scale.z = 0.4; base.position.y = -1.2; g.add(base)
    return g
  }

  // ---------- Île centrale (le « port » d'Ascent) ----------
  const hubRnd = seeded(7)
  const hub = islandMesh(HUB_R, 9, hubRnd, { trees: mobile ? 6 : 9, rocks: 6 })
  scene.add(hub)
  const lh = lighthouseMesh(); lh.group.position.set(-12, 1.2, -6); hub.add(lh.group)
  const dock = dockMesh(16); dock.position.set(10, 0, 18); dock.rotation.y = -0.5; scene.add(dock)
  const ship = shipMesh(); ship.position.set(22, 0.3, 34); ship.rotation.y = 2.5; scene.add(ship)
  const drone = droneMesh(); drone.scale.setScalar(1.3); scene.add(drone)
  const lanterns = []
  for (const p of [[9, 3.5, 24], [13, 3.5, 31], [-6, 3, 20]]) {
    const l = mobile ? { intensity: 0 } : new THREE.PointLight('#ffb35a', 0, 18); if (!mobile) { l.position.set(...p); scene.add(l) }
    const bulbMat = new THREE.MeshBasicMaterial({ color: '#8a6a3a' })
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 8), bulbMat); b.position.set(...p); scene.add(b)
    lanterns.push({ l, bulbMat })
  }

  // Mouettes
  const birds = []
  const birdGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1, 0.4, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.4, 0)])
  const birdMat = new THREE.LineBasicMaterial({ color: '#2b2b2b' })
  for (let i = 0; i < 7; i++) { const l = new THREE.Line(birdGeo, birdMat); l.userData = { r: 14 + hubRnd() * 16, a: hubRnd() * 6.28, y: 24 + hubRnd() * 8, s: 0.15 + hubRnd() * 0.1 }; l.scale.setScalar(0.8 + hubRnd() * 0.6); scene.add(l); birds.push(l) }

  // Nuages
  const clouds = new THREE.Group(); scene.add(clouds)

  // ---------- Îles Storyblok ----------
  let islands = [] // { data, layout, group, screen, hit[] }
  const islandRoot = new THREE.Group(); scene.add(islandRoot)
  let extent = 120

  function disposeObject(obj) {
    obj.traverse((o) => {
      if (o.geometry) o.geometry.dispose()
      if (o.material) { const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => { if (m.map && m.map !== toonTex) m.map.dispose(); m.dispose() }) }
    })
  }

  function setIslands(list) {
    stopAllVideos()
    islands.forEach((i) => { islandRoot.remove(i.group); disposeObject(i.group) })
    const layouts = layoutIslands(list)
    islands = list.map((data, idx) => {
      const L = layouts[idx]
      const rnd = seeded(L.seed)
      const group = islandMesh(L.r, L.h, rnd, { trees: mobile ? 3 : 4 + Math.floor(rnd() * 3), rocks: 3 + Math.floor(rnd() * 3) })
      group.position.set(L.x, 0, L.z)
      const dir = new THREE.Vector2(-L.x, -L.z).normalize() // vers l'île centrale
      const sc = screenMesh(data.title || 'Extrait', data.color)
      const scale = 0.72
      sc.group.scale.setScalar(scale)
      sc.group.position.set(dir.x * L.r * 0.88, 6.9, dir.y * L.r * 0.88)
      sc.group.rotation.y = Math.atan2(dir.x, dir.y)
      group.add(sc.group)
      islandRoot.add(group)
      const hit = []; group.traverse((o) => { if (o.isMesh) { o.userData.island = idx; hit.push(o) } })
      return { data, layout: L, group, screen: sc, hit, dir }
    })
    // Lagons et écume (shader de l'eau)
    islVec[0].set(0, 0, HUB_R)
    islands.slice(0, MAX_ISL - 1).forEach((isl, i) => islVec[i + 1].set(isl.layout.x, isl.layout.z, isl.layout.r))
    waterU.islN.value = Math.min(MAX_ISL, islands.length + 1)
    extent = Math.max(120, ...islands.map((i) => Math.hypot(i.layout.x, i.layout.z) + i.layout.r))
    // Couronne de nuages autour de l'archipel
    while (clouds.children.length) { const c = clouds.children.pop(); disposeObject(c) }
    const crnd = seeded(42)
    const count = mobile ? 10 : 18
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + crnd() * 0.3
      const d = extent + 160 + crnd() * 120
      const c = cloudMesh(crnd, 2.2 + crnd() * 1.6)
      c.position.set(Math.cos(a) * d, 55 + crnd() * 35, Math.sin(a) * d)
      c.lookAt(0, c.position.y, 0)
      clouds.add(c)
    }
    activeIndex = -2
  }

  // ---------- Vidéos (chargées seulement près d'une île) ----------
  const videos = new Map() // index → { el, tex }
  function videoFor(idx) {
    const isl = islands[idx]
    if (!isl?.data.video) return null
    if (videos.has(idx)) return videos.get(idx)
    const el = document.createElement('video')
    el.crossOrigin = 'anonymous'; el.muted = true; el.loop = true; el.playsInline = true
    el.setAttribute('playsinline', ''); el.setAttribute('muted', ''); el.preload = 'auto'
    el.src = isl.data.video
    const tex = new THREE.VideoTexture(el); tex.colorSpace = THREE.SRGBColorSpace
    const entry = { el, tex, ready: false }
    // Cadrage « cover » : une vidéo verticale ou carrée remplit l'écran 16/9 sans être déformée
    el.addEventListener('loadedmetadata', () => {
      const a = el.videoWidth / el.videoHeight, target = 16 / 9
      if (!a) return
      if (a < target) { tex.repeat.set(1, a / target); tex.offset.set(0, (1 - a / target) / 2) }
      else { tex.repeat.set(target / a, 1); tex.offset.set((1 - target / a) / 2, 0) }
    }, { once: true })
    el.addEventListener('playing', () => { entry.ready = true; isl.screen.imgMat.map = tex; isl.screen.imgMat.needsUpdate = true }, { once: true })
    el.addEventListener('error', () => { videos.delete(idx) }, { once: true })
    videos.set(idx, entry)
    // Une seule vidéo à la fois en plus de la précédente : on libère les autres
    for (const [k, v] of videos) if (k !== idx && k !== lastActive) releaseVideo(k, v)
    return entry
  }
  function releaseVideo(k, v) {
    v.el.pause(); v.el.removeAttribute('src'); v.el.load(); v.tex.dispose()
    const isl = islands[k]; if (isl) { isl.screen.imgMat.map = isl.screen.placeholder; isl.screen.imgMat.needsUpdate = true }
    videos.delete(k)
  }
  function stopAllVideos() { for (const [k, v] of videos) releaseVideo(k, v) }

  // ---------- Caméra et déplacements ----------
  const nav = { pos: new THREE.Vector3(0, 10, 82), yaw: 0, pitch: -0.06, input: { forward: 0, turn: 0 }, flight: null, overview: false }
  let activeIndex = -2, lastActive = -1

  function lookDir(yaw, pitch) { return new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)) }
  function yawPitchTo(from, to) { const d = to.clone().sub(from); return { yaw: Math.atan2(d.x, -d.z), pitch: Math.atan2(d.y, Math.hypot(d.x, d.z)) } }

  function flyTo(idx) {
    nav.overview = false
    let target, look
    if (idx === -1 || !islands[idx]) {
      target = new THREE.Vector3(0, 10, 82); look = new THREE.Vector3(0, 6, 0)
    } else {
      const isl = islands[idx]; const L = isl.layout
      const sp = new THREE.Vector3(); isl.screen.group.getWorldPosition(sp)
      target = new THREE.Vector3(L.x + isl.dir.x * (L.r + (mobile ? 30 : 26)), 9, L.z + isl.dir.y * (L.r + (mobile ? 30 : 26)))
      look = sp.clone().add(new THREE.Vector3(0, -0.5, 0))
    }
    const end = yawPitchTo(target, look)
    let dyaw = end.yaw - nav.yaw; dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw))
    nav.flight = { start: performance.now(), t: 0, dur: reduced ? 0.001 : Math.min(3.2, 1.2 + nav.pos.distanceTo(target) / 90), from: nav.pos.clone(), to: target, yaw0: nav.yaw, dyaw, pitch0: nav.pitch, pitch1: end.pitch }
  }

  // Vue du ciel : toute l'archipel vue d'en haut (la hauteur s'adapte au nombre d'îles)
  function flyOverview() {
    const pts = [{ x: 0, z: 0, r: HUB_R }, ...islands.map((i) => i.layout)]
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
    pts.forEach((p) => { minX = Math.min(minX, p.x - p.r); maxX = Math.max(maxX, p.x + p.r); minZ = Math.min(minZ, p.z - p.r); maxZ = Math.max(maxZ, p.z + p.r) })
    const cx = (minX + maxX) / 2, cz = (minZ + maxZ) / 2
    const halfW = (maxX - minX) / 2 + 8, halfD = (maxZ - minZ) / 2 + 8
    // Hauteur calculée pour que tout l'archipel tienne dans l'écran (portrait comme paysage)
    const vfov = camera.fov * Math.PI / 180
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect)
    const alt = Math.min(700, Math.max(halfW / Math.tan(hfov / 2), halfD / Math.tan(vfov / 2)) * 1.18)
    const target = new THREE.Vector3(cx, alt, cz + alt * 0.32)
    const lookAt = new THREE.Vector3(cx, 0, cz)
    const end = yawPitchTo(target, lookAt)
    let dyaw = end.yaw - nav.yaw; dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw))
    nav.overview = true
    nav.flight = { start: performance.now(), t: 0, dur: reduced ? 0.001 : 2.6, from: nav.pos.clone(), to: target, yaw0: nav.yaw, dyaw, pitch0: nav.pitch, pitch1: end.pitch }
  }

  function look(dx, dy) {
    if (nav.flight) return
    nav.yaw += dx * 0.0042
    nav.pitch = Math.max(nav.overview ? -1.3 : -0.45, Math.min(0.25, nav.pitch - dy * 0.003))
  }

  const raycaster = new THREE.Raycaster(); const ndc = new THREE.Vector2()
  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect()
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    const hits = raycaster.intersectObjects(islands.flatMap((i) => i.hit), false)
    if (hits.length) return hits[0].object.userData.island
    const hubHit = raycaster.intersectObject(hub, true)
    return hubHit.length ? -1 : null
  }

  function collide() {
    const all = [{ x: 0, z: 0, r: HUB_R }, ...islands.map((i) => i.layout)]
    for (const L of all) {
      const dx = nav.pos.x - L.x, dz = nav.pos.z - L.z, d = Math.hypot(dx, dz), min = L.r + 9
      if (d < min && d > 0.001) { nav.pos.x = L.x + (dx / d) * min; nav.pos.z = L.z + (dz / d) * min }
    }
    const d0 = Math.hypot(nav.pos.x, nav.pos.z), max = extent + 110
    if (d0 > max) { nav.pos.x *= max / d0; nav.pos.z *= max / d0 }
  }

  // ---------- Lumière selon l'heure ----------
  let timeOverride = opts.hour ?? null
  let night = 0
  let baseFar = 380
  const sunDir = skyU.sunDir.value
  const moonDir = new THREE.Vector3(0.45, 0.32, -1).normalize()
  function currentDate() {
    if (timeOverride == null) return new Date()
    const d = new Date(); d.setHours(Math.floor(timeOverride), Math.round((timeOverride % 1) * 60), 0, 0); return d
  }
  function applyTime() {
    const { elevation, azimuth } = sunPosition(currentDate())
    const w = moodWeights(elevation)
    const m = blendMood(THREE, w)
    night = w.night
    const th = (azimuth - 270) * Math.PI / 180
    const e = elevation * Math.PI / 180
    const sun = new THREE.Vector3(Math.sin(th) * Math.cos(e), Math.sin(e), -Math.cos(th) * Math.cos(e)).normalize()
    const useMoon = elevation < -3
    const ld = useMoon ? moonDir : sun
    sunDir.copy(ld)
    skyU.top.value.copy(m.skyTop); skyU.mid.value.copy(m.skyMid); skyU.low.value.copy(m.skyLow); skyU.sunC.value.copy(m.sun); skyU.night.value = night
    waterU.shallow.value.copy(m.water); waterU.deep.value.copy(m.waterDeep); waterU.lagoon.value.copy(m.lagoon); waterU.foam.value.copy(m.foam)
    waterU.sunC.value.copy(m.sun); waterU.fogC.value.copy(m.fog); waterU.glint.value = useMoon ? 0.35 : 1
    const far = 380 - 120 * night; baseFar = far; waterU.fogFar.value = far
    scene.fog.color.copy(m.fog); scene.fog.far = far
    hemi.color.copy(m.skyMid); hemi.groundColor.copy(m.waterDeep); hemi.intensity = m.amb
    key.color.copy(m.key); key.intensity = useMoon ? 0.9 : m.keyI * Math.min(1, 0.35 + Math.max(0, elevation + 4) / 12)
    key.userData.dir = new THREE.Vector3(ld.x, Math.max(ld.y, 0.12), ld.z).normalize()
    cloudMat.color.copy(m.cloud); cloudMat.emissive.copy(m.cloudGlow); cloudMat.emissiveIntensity = 0.08 + 0.3 * (1 - night)
    birdMat.color.set(night > 0.5 ? '#9fb0d0' : '#2b2b2b')
    lanterns.forEach(({ l, bulbMat }) => { l.intensity = 40 * night; bulbMat.color.set(night > 0.3 ? '#ffd28a' : '#8a6a3a') })
    lh.beamMat.opacity = 0.07 * night
    opts.onMood?.({ label: moodLabel(elevation, azimuth), elevation, night })
  }
  function setHour(h) { timeOverride = h; applyTime() }

  // ---------- Boucle ----------
  let raf = 0, running = false, last = performance.now(), clock = 0, timeAcc = 0, nearAcc = 0
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
  }

  function updateActive() {
    let best = -1, bestD = Infinity
    islands.forEach((isl, i) => {
      const d = Math.hypot(nav.pos.x - isl.layout.x, nav.pos.z - isl.layout.z) - isl.layout.r
      isl.group.visible = nav.overview || d < 430 // les îles lointaines (dans la brume) ne sont pas dessinées
      if (d < bestD) { bestD = d; best = i }
    })
    const idx = !nav.overview && bestD < (mobile ? 58 : 50) ? best : -1
    if (idx !== activeIndex) {
      if (activeIndex >= 0) { lastActive = activeIndex; const v = videos.get(activeIndex); v?.el.pause() }
      activeIndex = idx
      const entry = idx >= 0 ? videoFor(idx) : null
      entry?.el.play().catch(() => {})
      opts.onActive?.(idx, entry?.el || null)
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    if (!reduced) clock += dt
    waterU.time.value = 7.3 + clock

    // Déplacement
    if (nav.flight) {
      const f = nav.flight; f.t = (now - f.start) / 1000 / f.dur; const k = ease(Math.min(1, f.t))
      nav.pos.lerpVectors(f.from, f.to, k)
      nav.pos.y = f.from.y + (f.to.y - f.from.y) * k + Math.sin(k * Math.PI) * Math.min(14, f.from.distanceTo(f.to) / 10)
      nav.yaw = f.yaw0 + f.dyaw * k; nav.pitch = f.pitch0 + (f.pitch1 - f.pitch0) * k
      if (f.t >= 1) nav.flight = null
    } else {
      const { forward, turn } = nav.input
      nav.yaw += turn * dt * 1.4
      if (forward) { const d = lookDir(nav.yaw, 0); nav.pos.addScaledVector(d, forward * dt * 26) }
      if (nav.overview && (forward || turn)) nav.overview = false // on redescend dès qu'on se déplace
      if (!nav.overview) {
        nav.pos.y += (10 - nav.pos.y) * Math.min(1, dt * 2)
        if (nav.pitch < -0.45) nav.pitch += (-0.06 - nav.pitch) * Math.min(1, dt * 2)
        collide()
      }
    }
    // En altitude, la brume recule pour qu'on voie tout l'archipel (sans dépasser le bord de l'océan)
    const altK = 1 + Math.max(0, nav.pos.y - 12) / 70
    const fogFar = Math.min(baseFar * altK, oceanSize * 0.46)
    scene.fog.near = 60 * altK; scene.fog.far = fogFar; waterU.fogFar.value = fogFar
    const bob = reduced ? 0 : Math.sin(clock * 0.8) * 0.25
    camera.position.set(nav.pos.x, nav.pos.y + bob, nav.pos.z)
    camera.lookAt(camera.position.clone().add(lookDir(nav.yaw, nav.pitch)))

    // L'océan et l'ombre suivent la caméra
    ocean.position.x = Math.round(nav.pos.x / 40) * 40; ocean.position.z = Math.round(nav.pos.z / 40) * 40
    sky.position.copy(camera.position)
    const ld = key.userData.dir || sunDir
    key.target.position.set(nav.pos.x, 0, nav.pos.z - 30); key.position.copy(key.target.position).addScaledVector(ld, 150)

    // Animations du décor
    const t = clock
    drone.position.set(Math.cos(t * 0.35) * 30, 16 + Math.sin(t * 1.3) * 0.8, Math.sin(t * 0.35) * 30 + 6)
    drone.rotation.set(0.12, -t * 0.35 + Math.PI, -0.1)
    drone.children.forEach((c) => { if (c.geometry?.type === 'CylinderGeometry') c.rotation.y += dt * 40 })
    ship.position.y = 0.3 + Math.sin(t * 1.1) * 0.25; ship.rotation.z = Math.sin(t * 0.9) * 0.035; ship.rotation.x = Math.sin(t * 0.7) * 0.025
    birds.forEach((b) => { const u = b.userData; const a = u.a + t * u.s; b.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * 2 + u.a) * 0.6, Math.sin(a) * u.r + 4); b.rotation.y = -a; b.scale.y = 0.8 + Math.sin(t * 6 + u.a) * 0.3 })
    clouds.rotation.y = t * 0.004
    lh.pivot.rotation.y = t * 0.6

    // Heure (toutes les 30 s) et île active (4 fois par seconde)
    timeAcc += dt; if (timeAcc > 30) { timeAcc = 0; if (timeOverride == null) applyTime() }
    nearAcc += dt; if (nearAcc > 0.25) { nearAcc = 0; updateActive() }

    renderer.render(scene, camera)
  }
  function start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame) }
  function stop() { running = false; cancelAnimationFrame(raf) }

  function dispose() {
    stop(); stopAllVideos(); disposeObject(scene); renderer.dispose()
  }

  // Init
  setIslands(opts.islands || [])
  applyTime()
  resize()
  camera.position.copy(nav.pos); camera.lookAt(0, 6, 0)
  { const yp = yawPitchTo(nav.pos, new THREE.Vector3(0, 6, 0)); nav.yaw = yp.yaw; nav.pitch = yp.pitch }
  renderer.render(scene, camera)

  return {
    nav, start, stop, resize, dispose, setIslands, flyTo, flyOverview, look, pick, setHour,
    renderOnce: () => renderer.render(scene, camera),
    get activeIndex() { return activeIndex },
    get count() { return islands.length },
  }
}
