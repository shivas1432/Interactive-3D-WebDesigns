const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Background with stars
const bgGeometry = new THREE.PlaneGeometry(500, 500);
const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x00001d });
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.position.set(0, 0, -21);
bgMesh.receiveShadow = true;
scene.add(bgMesh);

for (let i = 0; i < 20; i++) {
  let starGeometry = new THREE.CircleGeometry(0.15, 5);
  let starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let starSphere = new THREE.Mesh(starGeometry, starMaterial);
  starSphere.position.set(
    Math.random() * 100 - 50,
    Math.random() * 80 - 40,
    -20
  );

  scene.add(starSphere);
}

// Globe
const texture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/earth-texture.jpg"
);
const alphaTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/earth-alpha-map.jpg"
);

const geometry = new THREE.SphereGeometry(15, 32, 16);

const material = new THREE.MeshPhysicalMaterial({
  color: 0x80c0a1,
  map: texture,
  roughness: 0.4,
  transmission: 0.5,
  thickness: 1,
  reflectivity: 0.7,
  iridescence: 0.7,
  transparent: true,
  side: THREE.DoubleSide,
  alphaMap: alphaTexture
});

const globe = new THREE.Mesh(geometry, material);
globe.name = "globe";
globe.castShadow = true;
globe.receiveShadow = true;
scene.add(globe);

// Internal Light
const lantern = new THREE.PointLight(0xeb80b1, 50000, 20);
lantern.name = "lantern";
lantern.castShadow = true;
lantern.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects

let lanternGeometry = new THREE.SphereGeometry(0.2, 6, 6);
let lanternMaterial = new THREE.MeshBasicMaterial({ color: 0xeb80b1 });
lanternMaterial.color.multiplyScalar(50000);
let lanternSphere = new THREE.Mesh(lanternGeometry, lanternMaterial);
lantern.add(lanternSphere);

scene.add(lantern);

// Clouds sphere
const cloudsTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/clouds-texture.jpg"
);

const cloudsGeometry = new THREE.SphereGeometry(15.1, 32, 16);

const cloudsMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  opacity: 0.8,
  transparent: true,
  side: THREE.DoubleSide,
  alphaMap: cloudsTexture
});

const cloudsGlobe = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
cloudsGlobe.castShadow = true;
cloudsGlobe.receiveShadow = true;
scene.add(cloudsGlobe);

// Adding moon
const moonTexture = new THREE.TextureLoader().load(
  "https://raw.githubusercontent.com/PedroOndh/personal-projects-assets/main/globe/moon-texture.jpg"
);

const moonMaterial = new THREE.MeshLambertMaterial({
  map: moonTexture,
  roughness: 0.8,
  transmission: 0.5,
  reflectivity: 0.7
});

const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 8), moonMaterial);
moon.castShadow = true;
moon.receiveShadow = true;
moon.position.set(20, 0, 0);

scene.add(moon);

// Base of the lamp
const lampBase = new THREE.Mesh(
  new THREE.CylinderGeometry(8, 10, 1, 16),
  new THREE.MeshPhysicalMaterial({
    color: 0x00001d,
    roughness: 0.4
  })
);

lampBase.position.set(0, -15.5, 0);

scene.add(lampBase);

// Final conditions for scene
const light = new THREE.PointLight(0xffffff, 100000);
light.position.set(100, 100, 100);
scene.add(light);

camera.position.z = 30;

let t = 0;
function animate() {
  requestAnimationFrame(animate);

  globe.rotation.y += 0.0015;
  cloudsGlobe.rotation.y += 0.001;

  moon.rotation.y += 0.0015;
  t += 0.0025;
  moon.position.x = -20 * Math.cos(t) + 0;
  moon.position.z = 20 * Math.sin(t) + 0;
  moon.position.y = 5 * Math.cos(t) + 0;

  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
  camera.aspect = window.innerWidth / window.innerHeight;
});

window.addEventListener("click", () => {
  if (scene.getObjectByName("lantern")) {
    scene.remove(lantern);
  } else {
    scene.add(lantern);
  }
});

// Waiting a little before animating for thumbnail purposes
setTimeout(() => {
  animate();
}, 100);
