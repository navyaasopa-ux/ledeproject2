/* ==========================================
   1. EMBEDDED GEODATA
   ========================================== */
var geojsonData = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "country": "China", "cases": 449 }, "geometry": { "type": "Point", "coordinates": [104.1954, 35.8617] } },
        { "type": "Feature", "properties": { "country": "United States", "cases": 441 }, "geometry": { "type": "Point", "coordinates": [-95.7129, 37.0902] } },
        { "type": "Feature", "properties": { "country": "Turkey", "cases": 300 }, "geometry": { "type": "Point", "coordinates": [35.2433, 38.9637] } },
        { "type": "Feature", "properties": { "country": "Spain", "cases": 254 }, "geometry": { "type": "Point", "coordinates": [-3.7492, 40.4637] } },
        { "type": "Feature", "properties": { "country": "Germany", "cases": 229 }, "geometry": { "type": "Point", "coordinates": [10.4515, 51.1657] } },
        { "type": "Feature", "properties": { "country": "Brazil", "cases": 210 }, "geometry": { "type": "Point", "coordinates": [-51.9253, -14.235] } },
        { "type": "Feature", "properties": { "country": "India", "cases": 205 }, "geometry": { "type": "Point", "coordinates": [78.9629, 20.5937] } },
        { "type": "Feature", "properties": { "country": "Egypt", "cases": 196 }, "geometry": { "type": "Point", "coordinates": [30.8025, 26.8206] } },
        { "type": "Feature", "properties": { "country": "Italy", "cases": 149 }, "geometry": { "type": "Point", "coordinates": [12.5674, 41.8719] } }
    ]
};

/* ==========================================
   2. THREE.JS ENGINE SETUP (CDC Realistic Model)
   ========================================== */
const threeContainer = document.getElementById('three-canvas');
const scene = new THREE.Scene();

// Camera aspect ratio for half-screen split
const viewWidth = window.innerWidth > 768 ? window.innerWidth / 2 : window.innerWidth;
const camera = new THREE.PerspectiveCamera(45, viewWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8.8; // Set at 8.8 for smaller virus size

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(viewWidth, window.innerHeight);
threeContainer.appendChild(renderer.domElement);

// Lighting setup for high contrast depth
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
dirLight1.position.set(5, 8, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x445566, 0.5);
dirLight2.position.set(-5, -5, -2);
scene.add(dirLight2);

const virusGroup = new THREE.Group();
const coreRadius = 1.35; 

// 1. Clean Slate-Blue/Grey Core Sphere (No polar pinching)
const coreGeo = new THREE.SphereGeometry(coreRadius, 64, 64);
const coreMat = new THREE.MeshStandardMaterial({ 
    color: 0x4a6572, 
    roughness: 0.85,
    metalness: 0.1
});
const core = new THREE.Mesh(coreGeo, coreMat);
virusGroup.add(core);

// 2. Realistic Triangular Red Crown Spike Template
const spikeMat = new THREE.MeshStandardMaterial({ 
    color: 0xb71c1c, // Crimson Red
    roughness: 0.6 
});
const singleSpike = new THREE.Group();

// Narrow Stem growing along +Y axis
const stemGeo = new THREE.CylinderGeometry(0.07, 0.04, 0.45, 8);
stemGeo.translate(0, 0.225, 0); 
singleSpike.add(new THREE.Mesh(stemGeo, spikeMat));

// Triangular 3-Lobe Top Crown
const crownGroup = new THREE.Group();
crownGroup.position.set(0, 0.45, 0);

for(let j = 0; j < 3; j++) {
    const angle = (j * Math.PI * 2) / 3;
    const lobeGeo = new THREE.DodecahedronGeometry(0.09, 0);
    const lobe = new THREE.Mesh(lobeGeo, spikeMat);
    lobe.position.set(Math.cos(angle) * 0.07, 0.06, Math.sin(angle) * 0.07);
    crownGroup.add(lobe);
}
const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, 0.08, 3), spikeMat);
topCap.position.set(0, 0.05, 0);
crownGroup.add(topCap);
singleSpike.add(crownGroup);

// 3. Distribute Red Spikes Outward Using Vector Quaternion Alignment
const numSpikes = 75;
const spikes = [];
const upVector = new THREE.Vector3(0, 1, 0); // Baseline geometry points up along Y

for(let i = 0; i < numSpikes; i++) {
    const spike = singleSpike.clone();
    
    // Golden spiral distribution across the sphere surface
    const phi = Math.acos(-1 + (2 * i) / numSpikes);
    const theta = Math.sqrt(numSpikes * Math.PI) * phi;
    
    const pos = new THREE.Vector3().setFromSphericalCoords(coreRadius, phi, theta);
    spike.position.copy(pos);
    
    // Point the spike's +Y axis straight outwards along its radial vector
    const normal = pos.clone().normalize();
    spike.quaternion.setFromUnitVectors(upVector, normal);
    
    spikes.push(spike);
    virusGroup.add(spike);
}

// 4. Secondary Yellow/Orange Surface Protein Markers
const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: 0.5 });
const numYellowBumps = 70;
for(let i = 0; i < numYellowBumps; i++) {
    const bump = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), yellowMat);
    const phi = Math.acos(-1 + (2 * i) / numYellowBumps);
    const theta = Math.sqrt(numYellowBumps * Math.PI) * phi + 1.2; 
    bump.position.setFromSphericalCoords(coreRadius + 0.01, phi, theta);
    virusGroup.add(bump);
}

// 5. Secondary Purple Surface Protein Markers
const purpleMat = new THREE.MeshStandardMaterial({ color: 0x8e24aa, roughness: 0.5 });
const numPurpleBumps = 40;
for(let i = 0; i < numPurpleBumps; i++) {
    const bump = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), purpleMat);
    const phi = Math.acos(-1 + (2 * i) / numPurpleBumps);
    const theta = Math.sqrt(numPurpleBumps * Math.PI) * phi + 2.5; 
    bump.position.setFromSphericalCoords(coreRadius + 0.01, phi, theta);
    virusGroup.add(bump);
}

scene.add(virusGroup);

/* ==========================================
   3. MAPLIBRE ENGINE SETUP
   ========================================== */
var map = new maplibregl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', 
    center: [0, 20], 
    zoom: 1.8,
    pitch: 0,
    interactive: false 
});

map.on('load', function () {
    map.addSource('covid-data', { type: 'geojson', data: geojsonData });
    map.addLayer({
        id: 'covid-plots',
        type: 'circle',
        source: 'covid-data',
        paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'cases'], 1, 5, 450, 28],
            'circle-color': ['interpolate', ['linear'], ['get', 'cases'], 1, '#ffc107', 150, '#fd7e14', 300, '#dc3545', 450, '#7a0010'],
            'circle-opacity': 0.8,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff'
        }
    });
});

/* ==========================================
   4. CONSOLIDATED ENGINE CHOREOGRAPHY
   ========================================== */
var chapters = {
    'intro':         { visual: 'map', center: [0, 20], zoom: 1.8, pitch: 0, bearing: 0 },
    'infodemic':     { visual: 'map', center: [0, 20], zoom: 1.8, pitch: 0, bearing: 0 },
    'dataset':       { visual: 'map', center: [0, 20], zoom: 1.8, pitch: 0, bearing: 0 },
    'affected':      { visual: 'map', center: [0, 20], zoom: 1.8, pitch: 0, bearing: 0 },
    'china-detail':  { visual: 'map', center: [104.1954, 35.8617], zoom: 4.2, pitch: 40, bearing: -10 },
    'us-detail':     { visual: 'map', center: [-95.7129, 37.0902], zoom: 4.0, pitch: 30, bearing: 5 },
    'india-detail':  { visual: 'map', center: [78.9629, 20.5937], zoom: 4.5, pitch: 45, bearing: 15 },
    
    // Everything from here down uses the 3D Virus
    'types':           { visual: 'three' },
    'chart-motive':    { visual: 'three' },
    'social':          { visual: 'three' },
    'chart-platform':  { visual: 'three' },
    'individual':      { visual: 'three' },
    'chart-spreaders': { visual: 'three' },
    'narrative':       { visual: 'three' },
    'chart-why':       { visual: 'three' },
    'way-out':         { visual: 'three' }    
};

let currentChapter = 'intro';

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const chapterId = entry.target.id;
            const config = chapters[chapterId];
            if (!config) return;

            // Check if we are transitioning FROM a map TO a 3D visual
            const lastVisual = chapters[currentChapter] ? chapters[currentChapter].visual : 'map';
            currentChapter = chapterId;
            
            document.querySelectorAll('.chapter').forEach(el => el.classList.remove('active'));
            entry.target.classList.add('active');
            
            const mapEl = document.getElementById('map');
            const threeEl = document.getElementById('three-canvas');

            if (config.visual === 'three') {
                mapEl.style.opacity = 0;
                threeEl.style.opacity = 1;
                
                // If the user just scrolled off the map, shrink spikes so they can animate outward
                if (lastVisual === 'map') {
                    spikes.forEach(s => s.scale.set(1, 0.01, 1));
                }
            } 
            else if (config.visual === 'map') {
                mapEl.style.opacity = 1;
                threeEl.style.opacity = 0;
                
                map.flyTo({
                    center: config.center,
                    zoom: config.zoom,
                    pitch: config.pitch,
                    bearing: config.bearing,
                    duration: 2500,
                    essential: true
                });
            }
        }
    });
}, { rootMargin: '-40% 0px -40% 0px' });

document.querySelectorAll('.chapter').forEach(chapter => observer.observe(chapter));

/* ==========================================
   5. 3D RENDER LOOP & RESIZE MANAGEMENT
   ========================================== */
function animate() {
    requestAnimationFrame(animate);
    
    // Constant slow rotation of the virus
    virusGroup.rotation.y += 0.003;
    virusGroup.rotation.x += 0.001;
    
    // If the active chapter is set to 'three', ensure spikes grow to full size
    if (chapters[currentChapter] && chapters[currentChapter].visual === 'three') {
        spikes.forEach(spike => {
            if (spike.scale.y < 1) {
                spike.scale.set(1, spike.scale.y + 0.015, 1);
            }
        });
    }
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    if(camera && renderer) {
        const currentWidth = window.innerWidth > 768 ? window.innerWidth / 2 : window.innerWidth;
        camera.aspect = currentWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentWidth, window.innerHeight);
    }
});

/* ==========================================
   6. DATAWRAPPER HEIGHT HANDLER
   ========================================== */
(function(){
    window.addEventListener("message", function(e){
        if(e.data["datawrapper-height"] !== undefined){
            var t = document.querySelectorAll("iframe");
            for(var n in e.data["datawrapper-height"]) {
                for(var r = 0, i; i = t[r]; r++) {
                    if(i.contentWindow === e.source){
                        var a = e.data["datawrapper-height"][n] + "px";
                        i.style.height = a;
                    }
                }
            }
        }
    });
})();
