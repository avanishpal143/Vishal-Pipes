/**
 * Vishal Pipes Limited - Design Concept A
 * Three.js 3D Industrial Steel Structure Visualizer
 */

function initHero3D() {
  const container = document.getElementById('hero3dCanvas');
  if (!container || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
  keyLight.position.set(10, 15, 10);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x88bbff, 0.8);
  rimLight.position.set(-10, -10, -10);
  scene.add(rimLight);

  // Red Industrial Accent Point Light
  const redLight = new THREE.PointLight(0xd71920, 2.5, 30);
  redLight.position.set(4, -2, 4);
  scene.add(redLight);

  // Group containing the engineered steel assembly
  const steelAssembly = new THREE.Group();
  scene.add(steelAssembly);

  // Realistic Metallic Steel Material
  const steelMaterial = new THREE.MeshStandardMaterial({
    color: 0x8e9297,
    metalness: 0.92,
    roughness: 0.26,
  });

  const darkSteelMaterial = new THREE.MeshStandardMaterial({
    color: 0x24272c,
    metalness: 0.88,
    roughness: 0.35,
  });

  const redAccentMaterial = new THREE.MeshStandardMaterial({
    color: 0xd71920,
    emissive: 0xd71920,
    emissiveIntensity: 0.6,
    metalness: 0.5,
    roughness: 0.2,
  });

  // 1. Large Central Steel Pipe
  const mainPipeGeom = new THREE.CylinderGeometry(1.6, 1.6, 10, 48, 1, true);
  const mainPipe = new THREE.Mesh(mainPipeGeom, steelMaterial);
  steelAssembly.add(mainPipe);

  // 2. Heavy Flange Collars
  const flangeGeom = new THREE.CylinderGeometry(1.85, 1.85, 0.35, 48);
  const flange1 = new THREE.Mesh(flangeGeom, darkSteelMaterial);
  flange1.position.y = 3.2;
  steelAssembly.add(flange1);

  const flange2 = new THREE.Mesh(flangeGeom, darkSteelMaterial);
  flange2.position.y = -3.2;
  steelAssembly.add(flange2);

  // 3. Precision Red Accent Rings
  const ringGeom = new THREE.TorusGeometry(1.7, 0.04, 16, 64);
  const ring1 = new THREE.Mesh(ringGeom, redAccentMaterial);
  ring1.rotation.x = Math.PI / 2;
  ring1.position.y = 1.2;
  steelAssembly.add(ring1);

  const ring2 = new THREE.Mesh(ringGeom, redAccentMaterial);
  ring2.rotation.x = Math.PI / 2;
  ring2.position.y = -1.2;
  steelAssembly.add(ring2);

  // 4. Secondary Structural Pipes forming an Engineered Cluster
  const subPipeGeom = new THREE.CylinderGeometry(0.55, 0.55, 8.5, 32);
  const subPositions = [
    { x: 2.3, z: 0 },
    { x: -1.15, z: 2.0 },
    { x: -1.15, z: -2.0 }
  ];

  subPositions.forEach(pos => {
    const subPipe = new THREE.Mesh(subPipeGeom, steelMaterial);
    subPipe.position.set(pos.x, 0, pos.z);
    steelAssembly.add(subPipe);

    // Connecting Bracing Struts
    const braceGeom = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 16);
    const brace = new THREE.Mesh(braceGeom, darkSteelMaterial);
    brace.position.set(pos.x * 0.5, 2.0, pos.z * 0.5);
    brace.rotation.z = Math.PI / 3;
    steelAssembly.add(brace);

    const brace2 = new THREE.Mesh(braceGeom, darkSteelMaterial);
    brace2.position.set(pos.x * 0.5, -2.0, pos.z * 0.5);
    brace2.rotation.z = -Math.PI / 3;
    steelAssembly.add(brace2);
  });

  // 5. Surrounding Engineering Measurement Cage / Geometric Grid
  const cageGeom = new THREE.IcosahedronGeometry(4.8, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const cage = new THREE.Mesh(cageGeom, wireMaterial);
  steelAssembly.add(cage);

  // Tilt the entire assembly for architectural perspective
  steelAssembly.rotation.x = 0.45;
  steelAssembly.rotation.z = -0.25;

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    mouseX = (e.clientX - halfW) / halfW;
    mouseY = (e.clientY - halfH) / halfH;
  }, { passive: true });

  // Handle Resize
  const onWindowResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', onWindowResize);

  // Animation Loop with Performance Optimization
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(container);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    // Smooth continuous rotation
    steelAssembly.rotation.y += 0.005;

    // Mouse tilt interpolation
    targetX += (mouseX * 0.4 - targetX) * 0.05;
    targetY += (mouseY * 0.3 - targetY) * 0.05;

    steelAssembly.rotation.x = 0.45 + targetY;
    steelAssembly.rotation.z = -0.25 + targetX;

    renderer.render(scene, camera);
  }

  animate();
}

// Initialize on DOM load or fallback
document.addEventListener('DOMContentLoaded', () => {
  // Give Three.js script a brief moment to evaluate
  if (typeof THREE !== 'undefined') {
    initHero3D();
  } else {
    window.addEventListener('load', () => {
      if (typeof THREE !== 'undefined') initHero3D();
    });
  }
});
