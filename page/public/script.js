// Init AOS
AOS.init({
  duration: 1200,
  once: true
});

// GSAP animation for hero
gsap.from(".hero-title", {opacity: 0, y: -50, duration: 1});
gsap.from(".hero-subtitle", {opacity: 0, y: 50, delay: 0.5, duration: 1});
gsap.from(".btn", {scale: 0, delay: 1, duration: 0.5, ease: "back.out(1.7)"});

// Three.js 3D Background
const canvas = document.querySelector("#bg");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Create 3D objects
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x00f5ff, wireframe: true });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

camera.position.z = 50;

function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
