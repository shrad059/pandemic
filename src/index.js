import ThreeGlobe from "three-globe";
import { WebGLRenderer, Scene } from "three";
import { PerspectiveCamera, AmbientLight, DirectionalLight, Color, Fog, PointLight } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import countries from "./files/globe-data-min.json";

var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;

fetch('./final.json')
  .then(response => response.json())
  .then(data => {
    const countryCasesMap = {};

    data.forEach(entry => {
      const { country, ISO_A3, data: countryData } = entry;

      if (!countryCasesMap[ISO_A3]) {
        countryCasesMap[ISO_A3] = {
          country,
          dates: [],
          totalCases: [],
        };
      }

      countryData.forEach(record => {
        const { date, total_cases } = record;
        const parsedTotalCases = parseInt(total_cases);

        if (!isNaN(parsedTotalCases)) {
          countryCasesMap[ISO_A3].dates.push(date);
          countryCasesMap[ISO_A3].totalCases.push(parsedTotalCases);
        }
      });
    });

    console.log(countryCasesMap);

    const colorSlider = document.getElementById("colorSlider");
    const dateDisplay = document.getElementById("dateDisplay");

    const firstCountryISO_A3 = Object.keys(countryCasesMap)[0];
    console.log(firstCountryISO_A3);
    const firstCountryData = countryCasesMap[firstCountryISO_A3];
    console.log(firstCountryData);
    const maxSliderValue = firstCountryData.dates.length - 1;
    console.log('Max Slider Value:', maxSliderValue);
    
    colorSlider.max = maxSliderValue;
    colorSlider.value = 0;

    function getColorForCases(totalCases) {
      if (totalCases <= 100) return "#e1f3f8";
      if (totalCases <= 300) return "#e9e9bb";
      if (totalCases <= 1000) return "#e9d994";
      if (totalCases <= 3000) return "#fed976";
      if (totalCases <= 10000) return "#feb24c";
      if (totalCases <= 30000) return "#fd8d3d";
      if (totalCases <= 100000) return "#fc4f2a";
      if (totalCases <= 300000) return "#e31a1c";
      return "#bd0026";
    }
    
    function updateDateAndColor(sliderValue) {
      const currentDate = countryCasesMap[firstCountryISO_A3].dates[sliderValue];
      dateDisplay.textContent = `Date: ${currentDate}`;
    
      Globe.hexPolygonColor((e) => {
        const countryISO_A3 = e.properties.ISO_A3;
        
        if (countryCasesMap[countryISO_A3]) {
          const countryData = countryCasesMap[countryISO_A3];
          const countryTotalCases = countryData.totalCases[sliderValue];
          const color = getColorForCases(countryTotalCases);
          return color;
        }

        return "white";
      });
    }

    colorSlider.addEventListener('input', (event) => {
      const sliderValue = event.target.value;
      console.log("Slider value changed:", sliderValue);
      updateDateAndColor(sliderValue);
    });

    updateDateAndColor(colorSlider.value);
  })
  .catch(error => console.error('Error loading COVID data:', error));

const countryCoordinatesMap = {};

function calculateCentroid(coordinates) {
  let latSum = 0;
  let lngSum = 0;
  let totalPoints = 0;

  coordinates.forEach(polygon => {
    polygon.forEach(coord => {
      latSum += coord[0];
      lngSum += coord[1];
      totalPoints += 1;
    });
  });

  return {
    lat: latSum / totalPoints,
    lng: lngSum / totalPoints,
  };
}

countries.features.forEach(feature => {
  const countryISO_A3 = feature.properties.ISO_A3;
  const coordinates = feature.geometry.coordinates;
  countryCoordinatesMap[countryISO_A3] = calculateCentroid(coordinates);
});

init();
initGlobe();
onWindowResize();
animate();

function init() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new Scene();
  scene.add(new AmbientLight(0x555555, 0.4));
  scene.background = new Color(0x000000);

  camera = new PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new DirectionalLight(0xffffff, 0.6);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new DirectionalLight(0x7982f6, 0.5);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new PointLight(0x8566cc, 0.4);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  scene.fog = new Fog(0x535ef3, 400, 2000);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = true;
  controls.minDistance = 400;
  controls.maxDistance = 400;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;
  controls.autoRotate = false;
  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}

function initGlobe() {
  Globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      return "white";
    });

  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new Color(0x3a228a);
  globeMaterial.emissive = new Color(0x220038);
  globeMaterial.emissiveIntensity = 0.05;
  globeMaterial.shininess = 0.7;

  scene.add(Globe);
}

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  camera.position.x +=
    Math.abs(mouseX) <= windowHalfX / 2
      ? (mouseX / 2 - camera.position.x) * 0.005
      : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
