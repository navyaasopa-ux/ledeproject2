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
   2. THREE.JS ENGINE SETUP
   ========================================== */
const threeContainer = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
threeContainer.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const virusGroup = new THREE.Group();
const coreGeo = new THREE.SphereGeometry(2, 32, 32);
const coreMat = new THREE.MeshStandardMaterial({ color: 0x990000, roughness: 0.8 });
const core = new THREE.Mesh(coreGeo, coreMat);
virusGroup.add(core);

const spikes = [];
const spikeMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
const spikeBody = new THREE.CylinderGeometry(0.04, 0.08, 0.5, 8);
spikeBody.translate(0, 0.25, 0); 
const spikeHead = new THREE.SphereGeometry(0.12, 8, 8);
spikeHead.translate(0, 0.5, 0); 

const singleSpike = new THREE.Group();
singleSpike.add(new THREE.Mesh(spikeBody, spikeMat));
singleSpike.add(new THREE.Mesh(spikeHead, spikeMat));

const numSpikes = 70;
for(let i = 0; i < numSpikes; i++) {
    const spike = singleSpike.clone();
    const phi = Math.acos(-1 + (2 * i) / numSpikes);
    const theta = Math.sqrt(numSpikes * Math.PI) * phi;
    spike.position.setFromSphericalCoords(2, phi, theta);
    spike.lookAt(new THREE.Vector3(0,0,0));
    spike.rotateX(Math.PI / 2);
    spikes.push(spike);
    virusGroup.add(spike);
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
    'intro': { visual: 'map', center: [0, 20], zoom: 1.8, pitch: 0, bearing: 0 },
    'china': { visual: 'map', center: [104.1954, 35.8617], zoom: 4.2, pitch: 40, bearing: -10 },
    'us':    { visual: 'map', center: [-95.7129, 37.0902], zoom: 4.0, pitch: 30, bearing: 5 },
    'india': { visual: 'map', center: [78.9629, 20.5937], zoom: 4.5, pitch: 45, bearing: 15 },
    'virus': { visual: 'three' },
    'globe': { visual: 'map', center: [0, 20], zoom: 1.8, pitch: 0, bearing: 0 },
    'ending':{ visual: 'three_transform' },
    'chart-why': { visual: 'three_transform' },        
    'chart-motive': { visual: 'three_transform' },     
    'chart-spreaders': { visual: 'three_transform' },  
    'chart-platform': { visual: 'three_transform' }    
};

let currentChapter = 'intro';

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const chapterId = entry.target.id;
            const config = chapters[chapterId];
            if (!config) return;

            currentChapter = chapterId;
            
            document.querySelectorAll('.chapter').forEach(el => el.classList.remove('active'));
            entry.target.classList.add('active');
            
            const mapEl = document.getElementById('map');
            const threeEl = document.getElementById('three-canvas');

            if (config.visual === 'three') {
                mapEl.style.opacity = 0;
                threeEl.style.opacity = 1;
                spikes.forEach(s => s.scale.set(1, 1, 1));
                coreMat.color.setHex(0x990000); 
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
            else if (config.visual === 'three_transform') {
                mapEl.style.opacity = 0;
                threeEl.style.opacity = 1;
                spikes.forEach(s => s.scale.set(1, 0.01, 1));
                coreMat.color.setHex(0x5a6268);
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
    
    virusGroup.rotation.y += 0.003;
    virusGroup.rotation.x += 0.001;
    
    if (currentChapter === 'ending' || 
        currentChapter === 'chart-why' || 
        currentChapter === 'chart-motive' || 
        currentChapter === 'chart-spreaders' || 
        currentChapter === 'chart-platform') {
        
        spikes.forEach(spike => {
            if (spike.scale.y < 1) {
                spike.scale.set(1, spike.scale.y + 0.015, 1);
            }
        });
        coreMat.color.lerp(new THREE.Color(0x990000), 0.01);
    }
    
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    if(camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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
