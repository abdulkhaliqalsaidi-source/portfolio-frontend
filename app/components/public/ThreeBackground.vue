<template>
  <canvas ref="canvas" class="three-bg" aria-hidden="true" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useTheme } from '~/composables/useTheme'

const props = withDefaults(defineProps<{ variant?: string }>(), { variant: 'constellation' })
const canvas = ref<HTMLCanvasElement | null>(null)
const { isDark } = useTheme()
let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let points: THREE.Points | undefined
let pointMaterial: THREE.PointsMaterial | undefined
let auroraMaterial: THREE.ShaderMaterial | undefined
let auroraMesh: THREE.Mesh | undefined
let waveGeometry: THREE.PlaneGeometry | undefined
let wavePositions: Float32Array | undefined
let orbitGroup: THREE.Group | undefined
let frameId = 0
let mouseX = 0
let mouseY = 0
let cleanup: (() => void) | undefined

function createConstellation() {
  if (!scene) return
  const count = 350
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const palette = ['#7db6a1', '#89a8d9', '#c6b87f', '#a5c7b0'].map(color => new THREE.Color(color))

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 260
    positions[index * 3 + 1] = (Math.random() - 0.5) * 200
    positions[index * 3 + 2] = (Math.random() - 0.5) * 180
    const color = palette[index % palette.length]
    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
    sizes[index] = Math.random() * 1.3 + 0.4
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  pointMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: isDark.value ? 0.5 : 0.3,
    sizeAttenuation: true,
    depthWrite: false
  })
  points = new THREE.Points(geometry, pointMaterial)
  scene.add(points)
}

function createAurora() {
  if (!scene) return
  const geometry = new THREE.PlaneGeometry(340, 150, 128, 48)
  auroraMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uIntensity: { value: isDark.value ? 0.66 : 0.4 } },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec3 p = position;
        float waveA = sin(p.x * 0.027 + uTime * 0.24) * 7.0;
        float waveB = sin(p.x * 0.012 - uTime * 0.16) * 11.0;
        p.y += waveA + waveB;
        p.z += cos(p.x * 0.018 + uTime * 0.2) * 12.0;
        vWave = waveA * 0.035 + 0.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        float edge = smoothstep(0.0, 0.24, vUv.y) * (1.0 - smoothstep(0.68, 1.0, vUv.y));
        float veil = 0.48 + 0.52 * sin(vUv.x * 8.0 - uTime * 0.18 + vWave);
        vec3 green = vec3(0.22, 0.62, 0.48);
        vec3 blue = vec3(0.40, 0.46, 0.76);
        vec3 brass = vec3(0.70, 0.61, 0.35);
        vec3 color = mix(green, blue, smoothstep(0.1, 0.85, vUv.x + vWave * 0.25));
        color = mix(color, brass, smoothstep(0.72, 1.0, vUv.x) * 0.38);
        gl_FragColor = vec4(color, edge * veil * uIntensity);
      }
    `
  })
  auroraMesh = new THREE.Mesh(geometry, auroraMaterial)
  auroraMesh.position.set(0, 5, -20)
  auroraMesh.rotation.x = -0.08
  scene.add(auroraMesh)
}

function createOrbits() {
  if (!scene) return
  orbitGroup = new THREE.Group()
  const ringColors = ['#83b49d', '#8b9fd5', '#c4b77f']
  const ringConfigs = [
    { radius: 61, tube: 0.13, x: 0.88, y: 0.2, z: -0.38 },
    { radius: 78, tube: 0.1, x: 1.12, y: -0.26, z: 0.48 },
    { radius: 96, tube: 0.08, x: 0.72, y: 0.48, z: 0.2 }
  ]
  ringConfigs.forEach((config, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(config.radius, config.tube, 8, 220),
      new THREE.MeshBasicMaterial({ color: ringColors[index], transparent: true, opacity: 0.34 - index * 0.06 })
    )
    ring.rotation.set(config.x, config.y, config.z)
    orbitGroup?.add(ring)

    const satellite = new THREE.Mesh(
      new THREE.SphereGeometry(index === 0 ? 1.5 : 1.05, 16, 12),
      new THREE.MeshBasicMaterial({ color: ringColors[index] })
    )
    satellite.position.set(config.radius * 0.74, 0, 0)
    satellite.userData.orbitRing = ring
    satellite.userData.phase = index * 2.1
    satellite.userData.radius = config.radius
    orbitGroup?.add(satellite)
  })
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(3.6, 32, 24),
    new THREE.MeshBasicMaterial({ color: '#d7cc9c', transparent: true, opacity: 0.78 })
  )
  orbitGroup.add(core)
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(7, 32, 24),
    new THREE.MeshBasicMaterial({ color: '#7db6a1', transparent: true, opacity: 0.1, side: THREE.BackSide })
  )
  orbitGroup.add(halo)
  orbitGroup.position.set(30, -3, -12)
  scene.add(orbitGroup)
}

function createHorizon() {
  if (!scene) return
  const columns = 100
  const rows = 54
  waveGeometry = new THREE.PlaneGeometry(330, 175, columns, rows)
  wavePositions = waveGeometry.attributes.position.array as Float32Array
  const grid = new THREE.Mesh(
    waveGeometry,
    new THREE.MeshBasicMaterial({ color: '#82ad9c', wireframe: true, transparent: true, opacity: isDark.value ? 0.17 : 0.12, depthWrite: false })
  )
  grid.position.set(0, -31, -22)
  grid.rotation.x = -0.18
  scene.add(grid)
  const horizon = new THREE.Mesh(
    new THREE.PlaneGeometry(320, 28),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main(){
          float fade = smoothstep(0.0,0.55,vUv.y) * (1.0-smoothstep(0.78,1.0,vUv.y));
          float sweep = 0.72 + 0.28*sin(vUv.x*11.0-uTime*0.18);
          gl_FragColor=vec4(0.31,0.62,0.51,fade*sweep*0.2);
        }
      `
    })
  )
  horizon.position.set(0, -22, -18)
  scene.add(horizon)
}

onMounted(() => {
  const el = canvas.value
  if (!el) return

  try {
    const bounds = el.getBoundingClientRect()
    const width = Math.max(1, bounds.width || window.innerWidth)
    const height = Math.max(1, bounds.height || window.innerHeight)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(56, width / height, 0.1, 1000)
    camera.position.z = 120
    renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))

    if (props.variant === 'aurora') createAurora()
    else if (props.variant === 'orbit') createOrbits()
    else if (props.variant === 'horizon') createHorizon()
    else createConstellation()

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.25
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.25
    }
    const onResize = () => {
      const rect = el.getBoundingClientRect()
      const w = Math.max(1, rect.width || window.innerWidth)
      const h = Math.max(1, rect.height || window.innerHeight)
      if (!camera || !renderer) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    const clock = new THREE.Clock()
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      if (points) {
        points.rotation.y = time * 0.015 + mouseX * 0.3
        points.rotation.x = time * 0.008 + mouseY * 0.2
      }
      if (auroraMaterial) auroraMaterial.uniforms.uTime.value = time
      if (orbitGroup) {
        orbitGroup.rotation.y = time * 0.055 + mouseX * 0.14
        orbitGroup.rotation.x = Math.sin(time * 0.14) * 0.045 + mouseY * 0.08
        orbitGroup.children.forEach(child => {
          if (!(child instanceof THREE.Mesh) || !child.userData.orbitRing) return
          const phase = time * 0.28 + child.userData.phase
          const radius = child.userData.radius
          child.position.set(Math.cos(phase) * radius, Math.sin(phase * 0.72) * radius * 0.16, Math.sin(phase) * radius * 0.34)
        })
      }
      if (waveGeometry && wavePositions) {
        const position = waveGeometry.attributes.position
        for (let index = 0; index < wavePositions.length; index += 3) {
          const x = wavePositions[index]
          const y = wavePositions[index + 1]
        position.array[index + 2] = Math.sin(x * 0.032 + time * 0.38) * 2.2 + Math.cos(y * 0.045 - time * 0.3) * 1.25
        }
        position.needsUpdate = true
      }
      if (auroraMesh) {
        auroraMesh.rotation.y = mouseX * 0.08
        auroraMesh.rotation.x = -0.08 + mouseY * 0.035
      }
      renderer?.render(scene!, camera!)
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) renderer.render(scene, camera)
    else animate()
    const stopThemeWatch = watch(isDark, value => {
      if (pointMaterial) pointMaterial.opacity = value ? 0.5 : 0.3
      if (auroraMaterial) auroraMaterial.uniforms.uIntensity.value = value ? 0.66 : 0.4
    })

    cleanup = () => {
      stopThemeWatch()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  } catch (error) {
    console.warn('[AnimatedBackground] WebGL background is unavailable.', error)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  cleanup?.()
  scene?.traverse(object => {
    if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return
    object.geometry.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.forEach(material => material.dispose())
  })
  renderer?.dispose()
})
</script>

<style scoped>
.three-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
