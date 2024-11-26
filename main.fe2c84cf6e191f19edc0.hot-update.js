self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
// Three.js Globe setup




 // Country geolocation data

var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;

// Fetch and process COVID data
fetch('./final.json')
  .then(response => response.json())
  .then(data => {
    // Create a mapping of country cases with ISO_A3 as the key
    const countryCasesMap = {};

    // Reorganize the data by ISO_A3
    data.forEach(entry => {
      const { country, ISO_A3, data: countryData } = entry;

      // Initialize the data structure for this country if it doesn't exist
      if (!countryCasesMap[ISO_A3]) {
        countryCasesMap[ISO_A3] = {
          country,
          dates: [],
          totalCases: [],
        };
      }

      // Iterate over the country data entries
      countryData.forEach(record => {
        const { date, total_cases } = record;
        const parsedTotalCases = parseInt(total_cases);

        // Only add valid total_cases (if parsing was successful)
        if (!isNaN(parsedTotalCases)) {
          countryCasesMap[ISO_A3].dates.push(date);
          countryCasesMap[ISO_A3].totalCases.push(parsedTotalCases);
        }
      });
    });

    console.log(countryCasesMap); // Debug: Log the country cases map to check if data is being added correctly

    // Set up the slider
    const colorSlider = document.getElementById("colorSlider");
    const dateDisplay = document.getElementById("dateDisplay");

    const firstCountryISO_A3 = Object.keys(countryCasesMap)[0];
    console.log(firstCountryISO_A3); // This should print 'AFG'
    const firstCountryData = countryCasesMap[firstCountryISO_A3];
    console.log(firstCountryData);
    const maxSliderValue = firstCountryData.dates.length - 1;
    console.log('Max Slider Value:', maxSliderValue); // Check the max value being set
    
    colorSlider.max = maxSliderValue; // Update slider's max value
    colorSlider.value = 0; // Default slider value

    // Function to map total cases to a color
    function getColorForCases(totalCases) {
      if (totalCases <= 100) return "#ffff99"; // Soft bright yellow
      if (totalCases <= 300) return "#33cc33"; // Bright lime green
      if (totalCases <= 1000) return "#ffcc00"; // Bright golden yellow
      if (totalCases <= 3000) return "#ff9900"; // Bright tangerine orange
      if (totalCases <= 10000) return "#ff6600"; // Vivid orange
      if (totalCases <= 30000) return "#ff3300"; // Bright scarlet orange
      if (totalCases <= 100000) return "#28a745"; // Fresh grass green
      if (totalCases <= 300000) return "#1e7e34"; // Deep forest green
      return "#bd0026"; // Dark red
    }

    // Function to update date and color based on slider value
    function updateDateAndColor(sliderValue) {
      const currentDate = countryCasesMap[firstCountryISO_A3].dates[sliderValue];
      dateDisplay.textContent = `Date: ${currentDate}`;
    
      // Update color for each country on the globe
      Globe.hexPolygonColor((e) => {
        const countryISO_A3 = e.properties.ISO_A3;
        
        if (countryCasesMap[countryISO_A3]) {
          const countryData = countryCasesMap[countryISO_A3];
          const countryTotalCases = countryData.totalCases[sliderValue];
          const color = getColorForCases(countryTotalCases);
          return color;
        }

        return "white"; // Default color for countries without data
      });
    }

    // Update the color and date when the slider value changes
    colorSlider.addEventListener('input', (event) => {
      const sliderValue = event.target.value;
      console.log("Slider value changed:", sliderValue); // Debug log
      updateDateAndColor(sliderValue);
    });

    // Initialize with the first slider value
    updateDateAndColor(colorSlider.value);
  })
  .catch(error => console.error('Error loading COVID data:', error));

// Create a mapping of country names to coordinates from globe data
const countryCoordinatesMap = {};

// Function to calculate centroid (for countries with multiple coordinates)
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

// Load coordinates data into map
_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features.forEach(feature => {
  const countryISO_A3 = feature.properties.ISO_A3;
  const coordinates = feature.geometry.coordinates;
  countryCoordinatesMap[countryISO_A3] = calculateCentroid(coordinates);
});

// Initialize everything
init();
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight(0x555555, 0.4)); // Dimmer ambient light
  scene.background = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x000000); // Black background

  camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // var dLight = new DirectionalLight(0xffffff, 0.6); // Reduced intensity
  // dLight.position.set(-800, 2000, 400);
  // camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0x7982f6, 0.5); // Blue light with lower intensity
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_2__.PointLight(0x8566cc, 0.4); // Dimmed point light
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_2__.Fog(0x535ef3, 400, 2000);

  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_3__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false; // Disable zooming entirely
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

// Globe Setup
// Globe Setup
function initGlobe() {
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      return "black"; // Keep country colors white
    });

  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);

  const globeMaterial = Globe.globeMaterial();
  
  // Set the globe color to white
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0xFFFFFF); // White color
  
  // Set the emissive color to a subtle light blue to make the globe stand out slightly
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0xAAAAFF); // Light blue emissive color
  globeMaterial.emissiveIntensity = 0.1; // Slight emissive intensity for glow effect
  
  // Reduce shininess to make it matte
  globeMaterial.shininess = 0.1;

  scene.add(Globe);
}


// Update mouse position
function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
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


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "a255e702a4bd7851d5e9"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNxQztBQUNRO0FBQ3FEO0FBQ3JCO0FBQ3pCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFDQUFxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQscUNBQXFDO0FBQ3JDLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsK0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFDakQsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZOztBQUVyRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QixPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUEsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVksaUJBQWlCO0FBQzdDLHlCQUF5Qix3Q0FBSyxXQUFXOztBQUV6QyxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLHNEQUFzRDtBQUN0RDtBQUNBOztBQUVBLG9CQUFvQixtREFBZ0IsZ0JBQWdCO0FBQ3BEO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVLGdCQUFnQjtBQUM5QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixzQ0FBRzs7QUFFckIsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxnREFBVTtBQUN4QjtBQUNBO0FBQ0EsR0FBRztBQUNILHFCQUFxQixnRUFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNEJBQTRCLHdDQUFLLFdBQVc7O0FBRTVDO0FBQ0EsK0JBQStCLHdDQUFLLFdBQVc7QUFDL0Msd0NBQXdDOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDL1BBLG9EIiwiZmlsZSI6Im1haW4uZmUyYzg0Y2Y2ZTE5MWYxOWVkYzAuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRocmVlLmpzIEdsb2JlIHNldHVwXG5pbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBQZXJzcGVjdGl2ZUNhbWVyYSwgQW1iaWVudExpZ2h0LCBEaXJlY3Rpb25hbExpZ2h0LCBDb2xvciwgRm9nLCBQb2ludExpZ2h0IH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjsgLy8gQ291bnRyeSBnZW9sb2NhdGlvbiBkYXRhXG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcblxuLy8gRmV0Y2ggYW5kIHByb2Nlc3MgQ09WSUQgZGF0YVxuZmV0Y2goJy4vZmluYWwuanNvbicpXG4gIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IGNhc2VzIHdpdGggSVNPX0EzIGFzIHRoZSBrZXlcbiAgICBjb25zdCBjb3VudHJ5Q2FzZXNNYXAgPSB7fTtcblxuICAgIC8vIFJlb3JnYW5pemUgdGhlIGRhdGEgYnkgSVNPX0EzXG4gICAgZGF0YS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGNvbnN0IHsgY291bnRyeSwgSVNPX0EzLCBkYXRhOiBjb3VudHJ5RGF0YSB9ID0gZW50cnk7XG5cbiAgICAgIC8vIEluaXRpYWxpemUgdGhlIGRhdGEgc3RydWN0dXJlIGZvciB0aGlzIGNvdW50cnkgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgaWYgKCFjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXSkge1xuICAgICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXSA9IHtcbiAgICAgICAgICBjb3VudHJ5LFxuICAgICAgICAgIGRhdGVzOiBbXSxcbiAgICAgICAgICB0b3RhbENhc2VzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBjb3VudHJ5IGRhdGEgZW50cmllc1xuICAgICAgY291bnRyeURhdGEuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICBjb25zdCB7IGRhdGUsIHRvdGFsX2Nhc2VzIH0gPSByZWNvcmQ7XG4gICAgICAgIGNvbnN0IHBhcnNlZFRvdGFsQ2FzZXMgPSBwYXJzZUludCh0b3RhbF9jYXNlcyk7XG5cbiAgICAgICAgLy8gT25seSBhZGQgdmFsaWQgdG90YWxfY2FzZXMgKGlmIHBhcnNpbmcgd2FzIHN1Y2Nlc3NmdWwpXG4gICAgICAgIGlmICghaXNOYU4ocGFyc2VkVG90YWxDYXNlcykpIHtcbiAgICAgICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXS5kYXRlcy5wdXNoKGRhdGUpO1xuICAgICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLnRvdGFsQ2FzZXMucHVzaChwYXJzZWRUb3RhbENhc2VzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhjb3VudHJ5Q2FzZXNNYXApOyAvLyBEZWJ1ZzogTG9nIHRoZSBjb3VudHJ5IGNhc2VzIG1hcCB0byBjaGVjayBpZiBkYXRhIGlzIGJlaW5nIGFkZGVkIGNvcnJlY3RseVxuXG4gICAgLy8gU2V0IHVwIHRoZSBzbGlkZXJcbiAgICBjb25zdCBjb2xvclNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29sb3JTbGlkZXJcIik7XG4gICAgY29uc3QgZGF0ZURpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVEaXNwbGF5XCIpO1xuXG4gICAgY29uc3QgZmlyc3RDb3VudHJ5SVNPX0EzID0gT2JqZWN0LmtleXMoY291bnRyeUNhc2VzTWFwKVswXTtcbiAgICBjb25zb2xlLmxvZyhmaXJzdENvdW50cnlJU09fQTMpOyAvLyBUaGlzIHNob3VsZCBwcmludCAnQUZHJ1xuICAgIGNvbnN0IGZpcnN0Q291bnRyeURhdGEgPSBjb3VudHJ5Q2FzZXNNYXBbZmlyc3RDb3VudHJ5SVNPX0EzXTtcbiAgICBjb25zb2xlLmxvZyhmaXJzdENvdW50cnlEYXRhKTtcbiAgICBjb25zdCBtYXhTbGlkZXJWYWx1ZSA9IGZpcnN0Q291bnRyeURhdGEuZGF0ZXMubGVuZ3RoIC0gMTtcbiAgICBjb25zb2xlLmxvZygnTWF4IFNsaWRlciBWYWx1ZTonLCBtYXhTbGlkZXJWYWx1ZSk7IC8vIENoZWNrIHRoZSBtYXggdmFsdWUgYmVpbmcgc2V0XG4gICAgXG4gICAgY29sb3JTbGlkZXIubWF4ID0gbWF4U2xpZGVyVmFsdWU7IC8vIFVwZGF0ZSBzbGlkZXIncyBtYXggdmFsdWVcbiAgICBjb2xvclNsaWRlci52YWx1ZSA9IDA7IC8vIERlZmF1bHQgc2xpZGVyIHZhbHVlXG5cbiAgICAvLyBGdW5jdGlvbiB0byBtYXAgdG90YWwgY2FzZXMgdG8gYSBjb2xvclxuICAgIGZ1bmN0aW9uIGdldENvbG9yRm9yQ2FzZXModG90YWxDYXNlcykge1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwKSByZXR1cm4gXCIjZmZmZjk5XCI7IC8vIFNvZnQgYnJpZ2h0IHllbGxvd1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwKSByZXR1cm4gXCIjMzNjYzMzXCI7IC8vIEJyaWdodCBsaW1lIGdyZWVuXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwKSByZXR1cm4gXCIjZmZjYzAwXCI7IC8vIEJyaWdodCBnb2xkZW4geWVsbG93XG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwKSByZXR1cm4gXCIjZmY5OTAwXCI7IC8vIEJyaWdodCB0YW5nZXJpbmUgb3JhbmdlXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMCkgcmV0dXJuIFwiI2ZmNjYwMFwiOyAvLyBWaXZpZCBvcmFuZ2VcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmYzMzAwXCI7IC8vIEJyaWdodCBzY2FybGV0IG9yYW5nZVxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDAwKSByZXR1cm4gXCIjMjhhNzQ1XCI7IC8vIEZyZXNoIGdyYXNzIGdyZWVuXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMDApIHJldHVybiBcIiMxZTdlMzRcIjsgLy8gRGVlcCBmb3Jlc3QgZ3JlZW5cbiAgICAgIHJldHVybiBcIiNiZDAwMjZcIjsgLy8gRGFyayByZWRcbiAgICB9XG5cbiAgICAvLyBGdW5jdGlvbiB0byB1cGRhdGUgZGF0ZSBhbmQgY29sb3IgYmFzZWQgb24gc2xpZGVyIHZhbHVlXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdLmRhdGVzW3NsaWRlclZhbHVlXTtcbiAgICAgIGRhdGVEaXNwbGF5LnRleHRDb250ZW50ID0gYERhdGU6ICR7Y3VycmVudERhdGV9YDtcbiAgICBcbiAgICAgIC8vIFVwZGF0ZSBjb2xvciBmb3IgZWFjaCBjb3VudHJ5IG9uIHRoZSBnbG9iZVxuICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlJU09fQTMgPSBlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXSkge1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlEYXRhID0gY291bnRyeUNhc2VzTWFwW2NvdW50cnlJU09fQTNdO1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlUb3RhbENhc2VzID0gY291bnRyeURhdGEudG90YWxDYXNlc1tzbGlkZXJWYWx1ZV07XG4gICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvckNhc2VzKGNvdW50cnlUb3RhbENhc2VzKTtcbiAgICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJ3aGl0ZVwiOyAvLyBEZWZhdWx0IGNvbG9yIGZvciBjb3VudHJpZXMgd2l0aG91dCBkYXRhXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIGNvbG9yIGFuZCBkYXRlIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBjaGFuZ2VzXG4gICAgY29sb3JTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHNsaWRlclZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgY29uc29sZS5sb2coXCJTbGlkZXIgdmFsdWUgY2hhbmdlZDpcIiwgc2xpZGVyVmFsdWUpOyAvLyBEZWJ1ZyBsb2dcbiAgICAgIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIGZpcnN0IHNsaWRlciB2YWx1ZVxuICAgIHVwZGF0ZURhdGVBbmRDb2xvcihjb2xvclNsaWRlci52YWx1ZSk7XG4gIH0pXG4gIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIENPVklEIGRhdGE6JywgZXJyb3IpKTtcblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IG5hbWVzIHRvIGNvb3JkaW5hdGVzIGZyb20gZ2xvYmUgZGF0YVxuY29uc3QgY291bnRyeUNvb3JkaW5hdGVzTWFwID0ge307XG5cbi8vIEZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBjZW50cm9pZCAoZm9yIGNvdW50cmllcyB3aXRoIG11bHRpcGxlIGNvb3JkaW5hdGVzKVxuZnVuY3Rpb24gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGxhdFN1bSA9IDA7XG4gIGxldCBsbmdTdW0gPSAwO1xuICBsZXQgdG90YWxQb2ludHMgPSAwO1xuXG4gIGNvb3JkaW5hdGVzLmZvckVhY2gocG9seWdvbiA9PiB7XG4gICAgcG9seWdvbi5mb3JFYWNoKGNvb3JkID0+IHtcbiAgICAgIGxhdFN1bSArPSBjb29yZFswXTtcbiAgICAgIGxuZ1N1bSArPSBjb29yZFsxXTtcbiAgICAgIHRvdGFsUG9pbnRzICs9IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbGF0OiBsYXRTdW0gLyB0b3RhbFBvaW50cyxcbiAgICBsbmc6IGxuZ1N1bSAvIHRvdGFsUG9pbnRzLFxuICB9O1xufVxuXG4vLyBMb2FkIGNvb3JkaW5hdGVzIGRhdGEgaW50byBtYXBcbmNvdW50cmllcy5mZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZmVhdHVyZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBjb3VudHJ5Q29vcmRpbmF0ZXNNYXBbY291bnRyeUlTT19BM10gPSBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcyk7XG59KTtcblxuLy8gSW5pdGlhbGl6ZSBldmVyeXRoaW5nXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHg1NTU1NTUsIDAuNCkpOyAvLyBEaW1tZXIgYW1iaWVudCBsaWdodFxuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTsgLy8gQmxhY2sgYmFja2dyb3VuZFxuXG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgLy8gdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjYpOyAvLyBSZWR1Y2VkIGludGVuc2l0eVxuICAvLyBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIC8vIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAwLjUpOyAvLyBCbHVlIGxpZ2h0IHdpdGggbG93ZXIgaW50ZW5zaXR5XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjQpOyAvLyBEaW1tZWQgcG9pbnQgbGlnaHRcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5lbmFibGVab29tID0gZmFsc2U7IC8vIERpc2FibGUgem9vbWluZyBlbnRpcmVseVxuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IHRydWU7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gNDAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDQwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIEdsb2JlIFNldHVwXG4vLyBHbG9iZSBTZXR1cFxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICByZXR1cm4gXCJibGFja1wiOyAvLyBLZWVwIGNvdW50cnkgY29sb3JzIHdoaXRlXG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG5cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgXG4gIC8vIFNldCB0aGUgZ2xvYmUgY29sb3IgdG8gd2hpdGVcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweEZGRkZGRik7IC8vIFdoaXRlIGNvbG9yXG4gIFxuICAvLyBTZXQgdGhlIGVtaXNzaXZlIGNvbG9yIHRvIGEgc3VidGxlIGxpZ2h0IGJsdWUgdG8gbWFrZSB0aGUgZ2xvYmUgc3RhbmQgb3V0IHNsaWdodGx5XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHhBQUFBRkYpOyAvLyBMaWdodCBibHVlIGVtaXNzaXZlIGNvbG9yXG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7IC8vIFNsaWdodCBlbWlzc2l2ZSBpbnRlbnNpdHkgZm9yIGdsb3cgZWZmZWN0XG4gIFxuICAvLyBSZWR1Y2Ugc2hpbmluZXNzIHRvIG1ha2UgaXQgbWF0dGVcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjE7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuXG4vLyBVcGRhdGUgbW91c2UgcG9zaXRpb25cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xufVxuXG4vLyBIYW5kbGUgd2luZG93IHJlc2l6ZVxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbi8vIEFuaW1hdGlvbiBsb29wXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyXG4gICAgICA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDVcbiAgICAgIDogMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImEyNTVlNzAyYTRiZDc4NTFkNWU5XCIiXSwic291cmNlUm9vdCI6IiJ9