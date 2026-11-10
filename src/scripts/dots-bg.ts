// Fondo de puntos vivo: reproduce exactamente la cuadrícula CSS del body (22px, navy al 35%)
// y aparta suavemente los puntos alrededor del cursor. En reposo se ve igual que el fondo original.
import * as THREE from 'three';

const SPACING = 22; // igual que background-size en global.css
const RADIUS = 140; // radio de influencia del cursor (px)
const PUSH = 16; // desplazamiento máximo (px)

const vertexShader = /* glsl */ `
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uActive;
  uniform float uDpr;
  varying float vNear;

  void main() {
    // Centro de cada celda de 22px, siguiendo el scroll como lo hace el fondo CSS
    vec2 p = vec2(
      ${SPACING / 2}.0 + position.x * ${SPACING}.0,
      ${SPACING / 2}.0 + position.y * ${SPACING}.0 - uScroll
    );

    vec2 d = p - uMouse;
    float dist = length(d);
    float near = (1.0 - smoothstep(0.0, ${RADIUS}.0, dist)) * uActive;
    p += (dist > 0.001 ? d / dist : vec2(0.0)) * near * ${PUSH}.0;
    vNear = near;

    gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0);
    gl_PointSize = (3.0 + near * 2.2) * uDpr;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vNear;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.42, 0.5, r);
    // navy #13284a; un poco más opaco cerca del cursor
    gl_FragColor = vec4(0.0745, 0.157, 0.290, a * (0.35 + vNear * 0.3));
  }
`;

export function mountDots(): void {
  const canvas = document.createElement('canvas');
  canvas.className = 'dots-bg';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);

  const uniforms = {
    uRes: { value: new THREE.Vector2() },
    uMouse: { value: new THREE.Vector2(-9999, -9999) },
    uScroll: { value: 0 },
    uActive: { value: 0 },
    uDpr: { value: dpr },
  };
  const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true, depthTest: false });
  const points = new THREE.Points(new THREE.BufferGeometry(), material);
  points.frustumCulled = false;

  const scene = new THREE.Scene();
  scene.add(points);
  const camera = new THREE.Camera();

  // La cuadrícula cubre el viewport más una fila extra para el desplazamiento del scroll
  const build = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
    const cols = Math.ceil(w / SPACING) + 1;
    const rows = Math.ceil(h / SPACING) + 2;
    const pos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        pos[k++] = i;
        pos[k++] = j;
        pos[k++] = 0;
      }
    }
    points.geometry.dispose();
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    points.geometry = g;
  };

  let raf = 0;
  let mouse = { x: -9999, y: -9999 };
  let inside = false;

  const render = () => {
    raf = 0;
    const u = uniforms;
    // Seguimiento suave del cursor y aparición/desaparición del efecto
    if (u.uMouse.value.x < -9000) u.uMouse.value.set(mouse.x, mouse.y);
    u.uMouse.value.x += (mouse.x - u.uMouse.value.x) * 0.18;
    u.uMouse.value.y += (mouse.y - u.uMouse.value.y) * 0.18;
    u.uActive.value += ((inside ? 1 : 0) - u.uActive.value) * 0.1;
    u.uScroll.value = window.scrollY % SPACING;
    renderer.render(scene, camera);

    const moving =
      Math.abs(mouse.x - u.uMouse.value.x) > 0.3 ||
      Math.abs(mouse.y - u.uMouse.value.y) > 0.3 ||
      Math.abs((inside ? 1 : 0) - u.uActive.value) > 0.002;
    if (moving) schedule();
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse = { x: e.clientX, y: e.clientY };
      inside = e.pointerType === 'mouse';
      schedule();
    },
    { passive: true },
  );
  document.documentElement.addEventListener('pointerleave', () => {
    inside = false;
    schedule();
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    build();
    schedule();
  });

  build();
  render();
  // Una vez dibujado, se quita el patrón CSS para no duplicar puntos
  document.documentElement.classList.add('dots-3d');
}
