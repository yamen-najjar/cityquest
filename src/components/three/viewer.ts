// A small three.js viewer shared by every 3D element in the game. It draws only when something changes
// (a drag, a tween, a slow idle spin), so a phone is not kept busy rendering a still frame, and it
// releases the GPU context when the element goes away.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { prefersReducedMotion } from './support';

/** A film look: darker corners and a fine moving grain. Runs before tone mapping, in linear light. */
const FilmShader = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null }, time: { value: 0 }, vignette: { value: 1.15 }, grain: { value: 0.035 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float time; uniform float vignette; uniform float grain; varying vec2 vUv;
    float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5;
      float v = smoothstep(0.85, 0.2, length(d) * vignette);
      float n = (rand(vUv * 731.0 + fract(time)) - 0.5) * grain;
      gl_FragColor = vec4(c.rgb * v + n * (0.4 + c.rgb), c.a);
    }`,
};

export interface ViewerOptions {
  fov?: number;
  camera: [number, number, number];
  target?: [number, number, number];
  /** Drag rotates `root`: yaw without limit unless given, pitch within the range (radians). */
  drag?: { yaw?: [number, number]; pitch: [number, number] };
  /** Radians per second while idle; ignored with reduced motion. */
  idleSpin?: number;
  initialPitch?: number;
  initialYaw?: number;
  /** 'pan-y' (default) lets a vertical swipe still scroll the page on a phone; 'none' keeps every gesture. */
  touchAction?: 'pan-y' | 'none';
  /** false: no built-in lights (a cutscene set lights itself). */
  lights?: boolean;
  /** Strength of the generated environment light; lower for dark, moody scenes. */
  environmentIntensity?: number;
  /** Film rendering for cutscenes: soft shadows, glow around bright lights, vignette and grain. */
  cinematic?: boolean;
}

/** A per-frame callback; return false when it has finished. */
export type Tween = (dt: number) => boolean;

export class Viewer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  /** Everything that rotates with a drag goes in here. */
  readonly root = new THREE.Group();
  readonly reducedMotion = prefersReducedMotion();

  private yaw: number;
  private pitch: number;
  private velocity = 0;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private frame = 0;
  private lastTime = 0;
  private tweens = new Set<Tween>();
  private resizeObserver: ResizeObserver;
  private visible = true;
  private intersection: IntersectionObserver;
  private disposed = false;
  /** Pointer handlers a component adds (the lock's dials); they run before the rotate drag and may claim it. */
  onPointerDown?: (e: PointerEvent, ndc: THREE.Vector2) => boolean;
  private composer?: EffectComposer;
  private bloom?: UnrealBloomPass;
  private film?: ShaderPass;
  private clock = 0;
  private frameTimes: number[] = [];
  private degraded = false;

  private static readonly QUALITY_KEY = 'cityquest:quality';

  /**
   * Low quality: a device that reports little memory or few cores, or one where an earlier scene ran
   * slowly (remembered on the device).
   */
  static lowQuality(): boolean {
    try {
      if (window.localStorage.getItem(Viewer.QUALITY_KEY) === 'low') return true;
    } catch {
      /* fall through to the hardware hints */
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    return (nav.deviceMemory ?? 8) <= 3 || (nav.hardwareConcurrency ?? 8) <= 4;
  }

  /** Drops the expensive parts: shadows, bloom and high-density pixels. Remembered when `persist`. */
  private degrade(persist: boolean) {
    if (this.degraded) return;
    this.degraded = true;
    this.renderer.shadowMap.enabled = false;
    if (this.bloom) this.bloom.enabled = false;
    this.renderer.setPixelRatio(1);
    this.scene.traverse((o) => {
      const m = (o as THREE.Mesh).material;
      for (const mm of Array.isArray(m) ? m : m ? [m] : []) mm.needsUpdate = true;
    });
    this.resize();
    if (persist) {
      try {
        window.localStorage.setItem(Viewer.QUALITY_KEY, 'low');
      } catch {
        /* this page only */
      }
    }
  }

  /** Lights the scene with an HDR image (reflections and soft ambient light). */
  setEnvironment(equirect: THREE.Texture, intensity: number) {
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment?.dispose();
    this.scene.environment = pmrem.fromEquirectangular(equirect).texture;
    this.scene.environmentIntensity = intensity;
    pmrem.dispose();
    this.invalidate();
  }

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly opts: ViewerOptions,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.camera = new THREE.PerspectiveCamera(opts.fov ?? 35, 1, 0.1, 100);
    this.camera.position.set(...opts.camera);
    this.camera.lookAt(new THREE.Vector3(...(opts.target ?? [0, 0, 0])));

    // A soft generated environment, so metal reads as metal without downloading an HDR file.
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environmentIntensity = opts.environmentIntensity ?? 1;

    if (opts.lights !== false) {
      const key = new THREE.DirectionalLight(0xffe2b0, 2.2);
      key.position.set(3, 5, 4);
      const rim = new THREE.DirectionalLight(0x8fb0ff, 1.2);
      rim.position.set(-4, 2, -3);
      this.scene.add(new THREE.HemisphereLight(0xf8f4ec, 0x0b1324, 0.6), key, rim);
    }
    this.scene.add(this.root);

    if (opts.cinematic) {
      this.renderer.shadowMap.enabled = !Viewer.lowQuality();
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      // Glow only around what is really bright: lamps, lit windows, flames.
      this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.45, 0.94);
      this.composer.addPass(this.bloom);
      this.film = new ShaderPass(FilmShader);
      this.composer.addPass(this.film);
      this.composer.addPass(new OutputPass());
      if (Viewer.lowQuality()) this.degrade(false);
    }

    this.pitch = opts.initialPitch ?? 0;
    this.yaw = opts.initialYaw ?? 0;
    this.applyRotation();

    if (opts.drag) {
      canvas.style.touchAction = opts.touchAction ?? 'pan-y';
      canvas.addEventListener('pointerdown', this.down);
      window.addEventListener('pointermove', this.move);
      window.addEventListener('pointerup', this.up);
      window.addEventListener('pointercancel', this.up);
    }

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = !!entry?.isIntersecting;
      if (this.visible) this.invalidate();
    });
    this.intersection.observe(canvas);
    this.resize();
  }

  private applyRotation() {
    this.root.rotation.set(this.pitch, this.yaw, 0, 'XYZ');
  }

  private resize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
      // Bloom at half resolution: it is a blur anyway, and phones thank us.
      this.bloom?.setSize((w * this.renderer.getPixelRatio()) / 2, (h * this.renderer.getPixelRatio()) / 2);
    }
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.invalidate();
  }

  private ndc(e: PointerEvent): THREE.Vector2 {
    const r = this.canvas.getBoundingClientRect();
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }

  private down = (e: PointerEvent) => {
    if (this.onPointerDown?.(e, this.ndc(e))) return;
    this.dragging = true;
    this.velocity = 0;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.canvas.setPointerCapture?.(e.pointerId);
  };

  private move = (e: PointerEvent) => {
    if (!this.dragging || !this.opts.drag) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.rotateBy(dx * 0.01, dy * 0.008);
    this.velocity = dx * 0.01;
  };

  private up = () => {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.reducedMotion) this.velocity = 0;
    this.invalidate();
  };

  /** Turns the model, within the drag limits. Also used by the keyboard. */
  rotateBy(dYaw: number, dPitch: number) {
    const d = this.opts.drag;
    if (!d) return;
    this.yaw += dYaw;
    if (d.yaw) this.yaw = Math.min(d.yaw[1], Math.max(d.yaw[0], this.yaw));
    this.pitch = Math.min(d.pitch[1], Math.max(d.pitch[0], this.pitch + dPitch));
    this.applyRotation();
    this.invalidate();
  }

  addTween(t: Tween) {
    if (this.reducedMotion) {
      // Jump to the end: run the tween with a large step until it reports done.
      for (let i = 0; i < 1000 && t(10); i++);
      this.invalidate();
      return;
    }
    this.tweens.add(t);
    this.invalidate();
  }

  /** Schedules a frame if one is not already scheduled. */
  invalidate() {
    if (this.disposed || this.frame) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (time: number) => {
    this.frame = 0;
    const dt = this.lastTime ? Math.min(0.05, (time - this.lastTime) / 1000) : 1 / 60;
    this.lastTime = time;
    let busy = false;

    for (const t of this.tweens) {
      if (!t(dt)) this.tweens.delete(t);
    }
    busy ||= this.tweens.size > 0;

    if (!this.dragging && Math.abs(this.velocity) > 0.0005) {
      this.rotateBy(this.velocity, 0);
      this.velocity *= 0.92;
      busy = true;
    } else if (!this.dragging && this.opts.idleSpin && !this.reducedMotion) {
      this.rotateBy(this.opts.idleSpin * dt, 0);
      busy = true;
    }

    if (this.composer) {
      this.clock += dt;
      if (this.film) this.film.uniforms.time!.value = this.clock;
      this.composer.render(dt);
      // Watch the first second or so of continuous playback; under ~28 fps, drop to low quality.
      if (busy && !this.degraded && this.lastTime && this.frameTimes.length < 45) {
        this.frameTimes.push(dt);
        if (this.frameTimes.length === 45) {
          const sorted = [...this.frameTimes.slice(5)].sort((x, y) => x - y);
          if (sorted[Math.floor(sorted.length / 2)]! > 1 / 28) this.degrade(true);
        }
      }
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    if (busy && this.visible) this.invalidate();
    else this.lastTime = 0;
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersection.disconnect();
    this.canvas.removeEventListener('pointerdown', this.down);
    window.removeEventListener('pointermove', this.move);
    window.removeEventListener('pointerup', this.up);
    window.removeEventListener('pointercancel', this.up);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
        mat.dispose();
      }
    });
    this.scene.environment?.dispose();
    // No forceContextLoss(): React can mount the same canvas again (Strict Mode does), and a lost context
    // cannot be reused. The browser frees the context with the canvas.
    this.composer?.dispose();
    this.renderer.dispose();
  }
}

/** Eases a value toward a target; returns a tween for Viewer.addTween. */
export function approach(get: () => number, set: (v: number) => void, target: number, speed = 10): Tween {
  return (dt) => {
    const v = get();
    const next = v + (target - v) * Math.min(1, dt * speed);
    if (Math.abs(target - next) < 0.001) {
      set(target);
      return false;
    }
    set(next);
    return true;
  };
}
