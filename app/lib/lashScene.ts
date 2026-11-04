import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export interface LashSceneState {
  /** 0 → 1 conforme o hero sai da tela */
  scroll: number
}

/** Fio de cílio: tubo afinando da raiz até a ponta, ao longo de uma curva com curvatura. */
function lashGeometry(segments = 20, radial = 5) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.18, 0.55),
    new THREE.Vector3(0, 1, 0.42),
  )
  const frames = curve.computeFrenetFrames(segments, false)
  const positions: number[] = []
  const normals: number[] = []
  const ts: number[] = []
  const indices: number[] = []
  const p = new THREE.Vector3()
  const n = new THREE.Vector3()

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    curve.getPointAt(t, p)
    const r = 0.011 * Math.pow(1 - t, 0.85) + 0.0006
    for (let j = 0; j < radial; j++) {
      const a = (j / radial) * Math.PI * 2
      const N = frames.normals[i]!
      const B = frames.binormals[i]!
      n.set(
        Math.cos(a) * N.x + Math.sin(a) * B.x,
        Math.cos(a) * N.y + Math.sin(a) * B.y,
        Math.cos(a) * N.z + Math.sin(a) * B.z,
      ).normalize()
      positions.push(p.x + n.x * r, p.y + n.y * r, p.z + n.z * r)
      normals.push(n.x, n.y, n.z)
      ts.push(t)
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j
      const b = i * radial + ((j + 1) % radial)
      const c = (i + 1) * radial + j
      const d = (i + 1) * radial + ((j + 1) % radial)
      indices.push(a, c, b, b, c, d)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  g.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1))
  g.setIndex(indices)
  return g
}

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

export function createLashScene(canvas: HTMLCanvasElement, state: LashSceneState, opts: { reduced: boolean }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.set(0, 0.2, 6.2)

  // Luzes de recorte em rosa e dourado, como o brilho dos stories
  const rimPink = new THREE.DirectionalLight('#ff8fb4', 4.2)
  rimPink.position.set(-3, 2, -2)
  const rimGold = new THREE.DirectionalLight('#ffd27a', 3.4)
  rimGold.position.set(3, 1.5, 1.5)
  const fill = new THREE.AmbientLight('#ffd9e3', 0.35)
  scene.add(rimPink, rimGold, fill)

  const root = new THREE.Group()
  scene.add(root)
  const eye = new THREE.Group()
  root.add(eye)

  // ---------- Linha da pálpebra ----------
  const lidPoint = (x: number) => new THREE.Vector3(x, -0.22 * x * x, -0.32 * x * x)
  const lidCurve = new THREE.CatmullRomCurve3(Array.from({ length: 24 }, (_, i) => lidPoint(-1.62 + (3.24 * i) / 23)))
  const lidGeo = new THREE.TubeGeometry(lidCurve, 120, 0.028, 10, false)
  const lashMat = new THREE.MeshPhysicalMaterial({
    color: '#0d0306',
    roughness: 0.38,
    envMapIntensity: 0.7,
    metalness: 0.05,
    clearcoat: 0.7,
    clearcoatRoughness: 0.3,
    sheen: 1,
    sheenColor: new THREE.Color('#ff6f9d'),
    sheenRoughness: 0.4,
  })
  const lid = new THREE.Mesh(lidGeo, lashMat)
  eye.add(lid)

  // ---------- Leques de cílios (volume) ----------
  const geo = lashGeometry()
  const bases = 58
  const perFan = 3
  const count = bases * perFan
  const uniforms = { uTime: { value: 0 }, uGrow: { value: opts.reduced ? 1 : 0 } }

  const instMat = lashMat.clone()
  instMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime
    shader.uniforms.uGrow = uniforms.uGrow
    shader.vertexShader = `attribute float aT;\nuniform float uTime;\nuniform float uGrow;\n${shader.vertexShader}`.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
      #ifdef USE_INSTANCING
        float ix = instanceMatrix[3].x;
      #else
        float ix = 0.0;
      #endif
      float g = clamp(uGrow * 1.8 - ((ix + 1.7) / 3.4) * 0.8, 0.0, 1.0);
      g = 1.0 - pow(1.0 - g, 3.0);
      transformed *= g;
      float sway = sin(uTime * 1.7 + ix * 2.3) * 0.045 + sin(uTime * 3.1 + ix * 5.0) * 0.015;
      transformed.x += sway * aT * aT;
      transformed.z += sway * 0.6 * aT * aT;`,
    )
  }
  const lashes = new THREE.InstancedMesh(geo, instMat, count)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const s = new THREE.Vector3()
  let k = 0
  for (let i = 0; i < bases; i++) {
    const u = i / (bases - 1)
    const x = -1.55 + u * 3.1
    const base = lidPoint(x)
    // Comprimento estilo "gatinho": cresce até o canto externo e suaviza no fim
    const len = 0.4 + 0.62 * Math.pow(u, 1.35) * (1 - 0.35 * Math.pow(Math.max(0, u - 0.86) / 0.14, 2))
    for (let f = 0; f < perFan; f++) {
      const seed = i * 13.7 + f * 3.1
      const spread = (f - (perFan - 1) / 2) * 0.09
      e.set(
        -0.1 + (rand(seed) - 0.5) * 0.18,
        x * 0.35,
        -x * 0.42 + spread + (rand(seed + 1) - 0.5) * 0.05,
      )
      q.setFromEuler(e)
      const l = len * (0.82 + rand(seed + 2) * 0.28)
      s.set(1, l, l)
      m.compose(base.clone().add(new THREE.Vector3((rand(seed + 3) - 0.5) * 0.02, 0, 0)), q, s)
      lashes.setMatrixAt(k++, m)
    }
  }
  lashes.instanceMatrix.needsUpdate = true
  eye.add(lashes)

  // Cílios inferiores, curtinhos
  const lowerCount = 46
  const lower = new THREE.InstancedMesh(geo, instMat, lowerCount)
  for (let i = 0; i < lowerCount; i++) {
    const u = i / (lowerCount - 1)
    const x = -1.35 + u * 2.7
    const base = new THREE.Vector3(x + (rand(i + 4) - 0.5) * 0.05, -0.6 + 0.17 * x * x, -0.3 * x * x)
    e.set(Math.PI + 0.35, -x * 0.3, x * 0.35 + (rand(i) - 0.5) * 0.08)
    q.setFromEuler(e)
    const l = 0.06 + 0.07 * Math.sin(u * Math.PI) + rand(i + 9) * 0.03
    m.compose(base, q, s.set(1, l, l))
    lower.setMatrixAt(i, m)
  }
  lower.instanceMatrix.needsUpdate = true
  eye.add(lower)

  eye.rotation.set(0.12, -0.18, 0.04)

  // ---------- Pérolas iridescentes ----------
  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: '#ffe3ea',
    roughness: 0.12,
    metalness: 0.25,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1.6,
    iridescenceThicknessMinimum: 180,
    iridescenceThicknessMaximum: 620,
  })
  const goldMat = new THREE.MeshPhysicalMaterial({ color: '#f4c04d', roughness: 0.22, metalness: 1, clearcoat: 0.6 })
  const sphere = new THREE.SphereGeometry(1, 48, 48)
  const pearls = [
    { mesh: new THREE.Mesh(sphere, pearlMat), pos: [1.75, 1.05, -0.6], r: 0.19, sp: 0.7 },
    { mesh: new THREE.Mesh(sphere, goldMat), pos: [-0.45, 1.15, -0.8], r: 0.08, sp: 1.1 },
    { mesh: new THREE.Mesh(sphere, pearlMat), pos: [0.35, -1.15, 0.3], r: 0.12, sp: 0.9 },
    { mesh: new THREE.Mesh(sphere, goldMat), pos: [1.55, -0.85, 0.6], r: 0.06, sp: 1.4 },
  ]
  pearls.forEach((p) => {
    p.mesh.scale.setScalar(p.r)
    p.mesh.position.set(p.pos[0]!, p.pos[1]!, p.pos[2]!)
    root.add(p.mesh)
  })

  // ---------- Poeira dourada ----------
  const dustCount = 700
  const dustPos = new Float32Array(dustCount * 3)
  const dustSeed = new Float32Array(dustCount)
  for (let i = 0; i < dustCount; i++) {
    const r = 1.4 + Math.pow(rand(i * 1.3), 0.6) * 3.2
    const th = rand(i * 2.1) * Math.PI * 2
    const ph = (rand(i * 3.7) - 0.5) * Math.PI * 0.9
    dustPos[i * 3] = Math.cos(th) * Math.cos(ph) * r * 1.4
    dustPos[i * 3 + 1] = Math.sin(ph) * r * 0.9
    dustPos[i * 3 + 2] = Math.sin(th) * Math.cos(ph) * r * 0.7 - 1
    dustSeed[i] = rand(i * 7.7)
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1))
  const dustMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: uniforms.uTime, uPx: { value: renderer.getPixelRatio() }, uScroll: { value: 0 } },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime; uniform float uPx; uniform float uScroll;
      varying float vSeed; varying float vTw;
      void main(){
        vec3 p = position;
        p.y += sin(uTime * 0.3 + aSeed * 40.0) * 0.12 + uScroll * (0.8 + aSeed * 1.5);
        p.x += cos(uTime * 0.25 + aSeed * 30.0) * 0.08;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        vTw = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 2.0) + aSeed * 60.0);
        gl_PointSize = (2.0 + aSeed * 5.0) * uPx * (5.5 / -mv.z);
        vSeed = aSeed;
      }`,
    fragmentShader: `
      varying float vSeed; varying float vTw;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        vec3 gold = vec3(1.0, 0.82, 0.45);
        vec3 pink = vec3(1.0, 0.62, 0.75);
        vec3 c = mix(gold, pink, step(0.7, vSeed));
        gl_FragColor = vec4(c, a * a * vTw * 0.85);
      }`,
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  root.add(dust)

  // ---------- Loop ----------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  const onPointer = (ev: PointerEvent) => {
    pointer.tx = (ev.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (ev.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let layout = { x: 0, y: 0, scale: 1 }
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const mobile = w / h < 0.9
    layout = mobile ? { x: 0.08, y: 1.18, scale: 0.4 } : { x: 0.95, y: 0.05, scale: 0.92 }
  }
  resize()
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  let raf = 0
  let running = false
  let t = 0
  let last = performance.now()
  const born = performance.now()

  const frame = () => {
    const now = performance.now()
    t += Math.min(0.05, (now - last) / 1000)
    last = now
    if (!opts.reduced) uniforms.uGrow.value = Math.min(1, Math.max(0, (now - born) / 1000 - 0.3) / 2.6)
    uniforms.uTime.value = opts.reduced ? 0 : t

    pointer.x += (pointer.tx - pointer.x) * 0.05
    pointer.y += (pointer.ty - pointer.y) * 0.05

    const sc = state.scroll
    root.position.set(layout.x - sc * 0.4, layout.y + sc * 1.1, -sc * 1.2)
    root.scale.setScalar(layout.scale * (1 + sc * 0.15))
    root.rotation.y = pointer.x * 0.32 + Math.sin(t * 0.25) * 0.06
    root.rotation.x = pointer.y * 0.16 + sc * 0.55
    eye.rotation.z = 0.04 + Math.sin(t * 0.4) * 0.03

    pearls.forEach((p, i) => {
      p.mesh.position.y = p.pos[1]! + Math.sin(t * p.sp + i) * 0.12
      p.mesh.rotation.y = t * 0.4
    })
    dustMat.uniforms.uScroll!.value = sc

    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) return
    running = true
    last = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const stop = () => {
    running = false
    cancelAnimationFrame(raf)
  }

  if (opts.reduced) {
    frame()
  }

  return {
    start: opts.reduced ? () => frame() : start,
    stop,
    dispose() {
      stop()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        mesh.geometry?.dispose?.()
      })
      ;[lashMat, instMat, pearlMat, goldMat, dustMat].forEach(mt => mt.dispose())
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
