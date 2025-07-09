 // --- Configuration ---
 const GLOBE_RADIUS = 5;
 const GLOBE_ROTATION_SPEED = 0.0005;
 const LINE_ANIMATION_DURATION = 1.5; // seconds
 const LINE_STAGGER = 0.1; // seconds delay between line animations
 const NUMBER_OF_LINES = 15;
 const POINT_COLOR = 0x000000;
 const LINE_COLOR = 0x4488ff;

 // --- Scene Setup ---
 const scene = new THREE.Scene();
 const canvas = document.querySelector('.webgl canvas');
 const renderer = new THREE.WebGLRenderer({
     canvas: canvas,
     antialias: true,
     alpha: true // Make background transparent if needed
 });
 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 // renderer.setClearColor(0xffffff, 1); // Set background if not transparent

 // --- Camera Setup ---
 const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
 camera.position.z = 15;
 scene.add(camera);

 // --- Controls (Optional) ---
 const controls = new THREE.OrbitControls(camera, renderer.domElement);
 controls.enableDamping = true;
 controls.enablePan = false; // Disable panning if you only want rotation/zoom
 controls.minDistance = 7;
 controls.maxDistance = 30;
 controls.autoRotate = false; // We'll handle rotation manually
 controls.autoRotateSpeed = 0.5;

 // --- Lighting ---
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
 scene.add(ambientLight);
 const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
 directionalLight.position.set(5, 5, 5);
 scene.add(directionalLight);

// --- Globe ---
const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// --- Load the Earth texture from the URL ---
const earthTextureUrl = 'https://dariush-hassani.github.io/react-threejs-globe/texture.png'; // <-- URL provided
const earthTexture = textureLoader.load(
 earthTextureUrl,
 () => {
     console.log("Earth texture loaded successfully from URL");
     renderer.render(scene, camera); // Optional: Re-render once loaded
 },
 undefined, // onProgress callback (optional)
 (err) => {
     console.error('Error loading Earth texture from URL:', err);
     // Optional: Fallback color if texture fails
     globeMaterial.color.setHex(0x5599dd); // Blue color
     globeMaterial.map = null; // Ensure no map is set
     globeMaterial.needsUpdate = true;
 }
);
earthTexture.encoding = THREE.sRGBEncoding; // Important for correct colors

const globeMaterial = new THREE.MeshStandardMaterial({
 // color: 0xd0e0f0, // Base color if texture is semi-transparent or fails
 map: earthTexture,     // Apply the loaded texture here
 metalness: 0.1,
 roughness: 0.8,
 transparent: true,     // Keep transparent if you want atmosphere/lines visible through oceans
 opacity: 1.0          // Make globe fully opaque if desired
});

const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globeMesh);

// --- Atmosphere (Optional) ---
// ... (Keep the atmosphere code as it was) ...
const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 64, 64);
const atmosphereMaterial = new THREE.ShaderMaterial({
 vertexShader: `
     varying vec3 vNormal;
     void main() {
         vNormal = normalize( normalMatrix * normal );
         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
     }
 `,
 fragmentShader: `
     varying vec3 vNormal;
     void main() {
         float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0 );
         gl_FragColor = vec4( 0.5, 0.7, 1.0, 1.0 ) * intensity * 0.4;
     }
 `,
 blending: THREE.AdditiveBlending,
 side: THREE.BackSide,
 transparent: true
});
const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphereMesh);


 // --- Points and Lines Data (Sample) ---
 // Replace with actual data if available
 const locations = [
     { lat: 34.05, lon: -118.24 }, { lat: 40.71, lon: -74.00 }, // USA
     { lat: 48.85, lon: 2.35 }, { lat: 51.50, lon: -0.12 }, // Europe
     { lat: -33.86, lon: 151.20 }, { lat: 35.68, lon: 139.69 }, // Asia/Oceania
     { lat: -23.55, lon: -46.63 }, { lat: 19.43, lon: -99.13 }, // S/Central America
     { lat: 39.90, lon: 116.40}, // Beijing
     { lat: 6.52, lon: 3.37}, // Lagos
     { lat: 4.71, lon: -74.07} // Bogota
     // Add more locations
 ];

 // --- Helper Functions ---
 function latLonToVector3(lat, lon, radius) {
     const phi = (90 - lat) * Math.PI / 180;
     const theta = (lon + 180) * Math.PI / 180;
     const x = -radius * Math.sin(phi) * Math.cos(theta);
     const y = radius * Math.cos(phi);
     const z = radius * Math.sin(phi) * Math.sin(theta);
     return new THREE.Vector3(x, y, z);
 }

 // Create 3D points
 const points3D = locations.map(loc => latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS));

 // --- Draw Points ---
 const pointsMaterial = new THREE.PointsMaterial({
     color: POINT_COLOR,
     size: 0.08, // Adjust size as needed
     sizeAttenuation: true
 });
 const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points3D);
 const pointsObject = new THREE.Points(pointsGeometry, pointsMaterial);
 globeMesh.add(pointsObject); // Add points as children of the globe

 // --- Draw Lines ---
 const linesGroup = new THREE.Group();
 globeMesh.add(linesGroup); // Add lines as children of the globe

 function createCurve(startVec, endVec) {
     const distance = startVec.distanceTo(endVec);
     const midPoint = startVec.clone().add(endVec).normalize().multiplyScalar(GLOBE_RADIUS + distance * 0.3); // Control point lifts off the surface

     const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
     const points = curve.getPoints(50); // Number of segments
     const geometry = new THREE.BufferGeometry().setFromPoints(points);
     geometry.setDrawRange(0, 0); // Initially draw nothing

     const material = new THREE.LineBasicMaterial({
          color: LINE_COLOR,
          linewidth: 1, // Note: linewidth > 1 only works with LineMaterial from examples/jsm/lines
          transparent: true,
          opacity: 0.7
     });
     const line = new THREE.Line(geometry, material);
     linesGroup.add(line);
     return line;
 }

 const lines = [];
 for (let i = 0; i < NUMBER_OF_LINES; i++) {
     const startIdx = Math.floor(Math.random() * points3D.length);
     let endIdx = Math.floor(Math.random() * points3D.length);
     // Ensure start and end points are different
     while (endIdx === startIdx) {
         endIdx = Math.floor(Math.random() * points3D.length);
     }
     lines.push(createCurve(points3D[startIdx], points3D[endIdx]));
 }

 // --- Animation ---
 const clock = new THREE.Clock();

 function animateLines() {
     const tl = gsap.timeline({ repeat: -1, delay: 1 }); // Add delay before repeating

     lines.forEach((line, index) => {
         const drawRange = { count: 0 };
         const totalPoints = line.geometry.attributes.position.count;

         tl.to(drawRange, {
             count: totalPoints,
             duration: LINE_ANIMATION_DURATION,
             ease: "power1.inOut",
             onUpdate: () => {
                 line.geometry.setDrawRange(0, Math.floor(drawRange.count));
             },
             onComplete: () => {
                  // Optional: Fade out or reset after drawing
                  gsap.to(line.material, {
                      opacity: 0,
                      duration: 0.5,
                      delay: 0.2, // Wait a bit before fading
                      onComplete: () => {
                          // Reset for next loop
                          line.geometry.setDrawRange(0, 0);
                          line.material.opacity = 0.7; // Reset opacity
                      }
                  });
             }
         }, index * LINE_STAGGER); // Stagger the start of each line animation
     });
 }

 animateLines(); // Start the line animation loop

 function animate() {
     requestAnimationFrame(animate);

     const elapsedTime = clock.getElapsedTime();

     // Rotate the globe mesh itself
     globeMesh.rotation.y += GLOBE_ROTATION_SPEED;

     controls.update(); // Update controls if enabled
     renderer.render(scene, camera);
 }

 animate();

 // --- Handle Resize ---
 window.addEventListener('resize', () => {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 });