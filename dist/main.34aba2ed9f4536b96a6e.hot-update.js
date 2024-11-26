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
      if (totalCases <= 100) return "#e1f3f8"; // Light blue
      if (totalCases <= 300) return "#e9e9bb"; // Pale yellow
      if (totalCases <= 1000) return "#e9d994"; // Light mustard yellow
      if (totalCases <= 3000) return "#fed976"; // Light gold
      if (totalCases <= 10000) return "#feb24c"; // Bright orange
      if (totalCases <= 30000) return "#fd8d3d"; // Orange
      if (totalCases <= 100000) return "#fc4f2a"; // Strong orange-red
      if (totalCases <= 300000) return "#e31a1c"; // Red
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
  // scene.add(new AmbientLight(0x555555, 0.4)); // Dimmer ambient light
  scene.background = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x000000); // Black background

  camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff, 0.6); // Reduced intensity
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

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
/******/ 		__webpack_require__.h = () => "4906efab58b401edf965"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNxQztBQUNRO0FBQ3FEO0FBQ3JCO0FBQ3pCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFDQUFxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQscUNBQXFDO0FBQ3JDLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsK0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFDakQsdUJBQXVCO0FBQ3ZCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTs7QUFFckQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkIsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBLGNBQWMsd0NBQUs7QUFDbkIsZ0RBQWdEO0FBQ2hELHlCQUF5Qix3Q0FBSyxXQUFXOztBQUV6QyxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0IsZ0JBQWdCO0FBQ25EO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQixnQkFBZ0I7QUFDcEQ7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVUsZ0JBQWdCO0FBQzlDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNDQUFHOztBQUVyQixpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw0QkFBNEIsd0NBQUssV0FBVzs7QUFFNUM7QUFDQSwrQkFBK0Isd0NBQUssV0FBVztBQUMvQyx3Q0FBd0M7O0FBRXhDO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NoUUEsb0QiLCJmaWxlIjoibWFpbi4zNGFiYTJlZDlmNDUzNmI5NmE2ZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhyZWUuanMgR2xvYmUgc2V0dXBcbmltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiOyAvLyBDb3VudHJ5IGdlb2xvY2F0aW9uIGRhdGFcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuXG4vLyBGZXRjaCBhbmQgcHJvY2VzcyBDT1ZJRCBkYXRhXG5mZXRjaCgnLi9maW5hbC5qc29uJylcbiAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAudGhlbihkYXRhID0+IHtcbiAgICAvLyBDcmVhdGUgYSBtYXBwaW5nIG9mIGNvdW50cnkgY2FzZXMgd2l0aCBJU09fQTMgYXMgdGhlIGtleVxuICAgIGNvbnN0IGNvdW50cnlDYXNlc01hcCA9IHt9O1xuXG4gICAgLy8gUmVvcmdhbml6ZSB0aGUgZGF0YSBieSBJU09fQTNcbiAgICBkYXRhLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgY29uc3QgeyBjb3VudHJ5LCBJU09fQTMsIGRhdGE6IGNvdW50cnlEYXRhIH0gPSBlbnRyeTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoaXMgY291bnRyeSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICBpZiAoIWNvdW50cnlDYXNlc01hcFtJU09fQTNdKSB7XG4gICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdID0ge1xuICAgICAgICAgIGNvdW50cnksXG4gICAgICAgICAgZGF0ZXM6IFtdLFxuICAgICAgICAgIHRvdGFsQ2FzZXM6IFtdLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGNvdW50cnkgZGF0YSBlbnRyaWVzXG4gICAgICBjb3VudHJ5RGF0YS5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgIGNvbnN0IHsgZGF0ZSwgdG90YWxfY2FzZXMgfSA9IHJlY29yZDtcbiAgICAgICAgY29uc3QgcGFyc2VkVG90YWxDYXNlcyA9IHBhcnNlSW50KHRvdGFsX2Nhc2VzKTtcblxuICAgICAgICAvLyBPbmx5IGFkZCB2YWxpZCB0b3RhbF9jYXNlcyAoaWYgcGFyc2luZyB3YXMgc3VjY2Vzc2Z1bClcbiAgICAgICAgaWYgKCFpc05hTihwYXJzZWRUb3RhbENhc2VzKSkge1xuICAgICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICAgICAgY291bnRyeUNhc2VzTWFwW0lTT19BM10udG90YWxDYXNlcy5wdXNoKHBhcnNlZFRvdGFsQ2FzZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGNvdW50cnlDYXNlc01hcCk7IC8vIERlYnVnOiBMb2cgdGhlIGNvdW50cnkgY2FzZXMgbWFwIHRvIGNoZWNrIGlmIGRhdGEgaXMgYmVpbmcgYWRkZWQgY29ycmVjdGx5XG5cbiAgICAvLyBTZXQgdXAgdGhlIHNsaWRlclxuICAgIGNvbnN0IGNvbG9yU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2xvclNsaWRlclwiKTtcbiAgICBjb25zdCBkYXRlRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZURpc3BsYXlcIik7XG5cbiAgICBjb25zdCBmaXJzdENvdW50cnlJU09fQTMgPSBPYmplY3Qua2V5cyhjb3VudHJ5Q2FzZXNNYXApWzBdO1xuICAgIGNvbnNvbGUubG9nKGZpcnN0Q291bnRyeUlTT19BMyk7IC8vIFRoaXMgc2hvdWxkIHByaW50ICdBRkcnXG4gICAgY29uc3QgZmlyc3RDb3VudHJ5RGF0YSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdO1xuICAgIGNvbnNvbGUubG9nKGZpcnN0Q291bnRyeURhdGEpO1xuICAgIGNvbnN0IG1heFNsaWRlclZhbHVlID0gZmlyc3RDb3VudHJ5RGF0YS5kYXRlcy5sZW5ndGggLSAxO1xuICAgIGNvbnNvbGUubG9nKCdNYXggU2xpZGVyIFZhbHVlOicsIG1heFNsaWRlclZhbHVlKTsgLy8gQ2hlY2sgdGhlIG1heCB2YWx1ZSBiZWluZyBzZXRcbiAgICBcbiAgICBjb2xvclNsaWRlci5tYXggPSBtYXhTbGlkZXJWYWx1ZTsgLy8gVXBkYXRlIHNsaWRlcidzIG1heCB2YWx1ZVxuICAgIGNvbG9yU2xpZGVyLnZhbHVlID0gMDsgLy8gRGVmYXVsdCBzbGlkZXIgdmFsdWVcblxuICAgIC8vIEZ1bmN0aW9uIHRvIG1hcCB0b3RhbCBjYXNlcyB0byBhIGNvbG9yXG4gICAgZnVuY3Rpb24gZ2V0Q29sb3JGb3JDYXNlcyh0b3RhbENhc2VzKSB7XG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDApIHJldHVybiBcIiNlMWYzZjhcIjsgLy8gTGlnaHQgYmx1ZVxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwKSByZXR1cm4gXCIjZTllOWJiXCI7IC8vIFBhbGUgeWVsbG93XG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwKSByZXR1cm4gXCIjZTlkOTk0XCI7IC8vIExpZ2h0IG11c3RhcmQgeWVsbG93XG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwKSByZXR1cm4gXCIjZmVkOTc2XCI7IC8vIExpZ2h0IGdvbGRcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDAwKSByZXR1cm4gXCIjZmViMjRjXCI7IC8vIEJyaWdodCBvcmFuZ2VcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmQ4ZDNkXCI7IC8vIE9yYW5nZVxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDAwKSByZXR1cm4gXCIjZmM0ZjJhXCI7IC8vIFN0cm9uZyBvcmFuZ2UtcmVkXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMDApIHJldHVybiBcIiNlMzFhMWNcIjsgLy8gUmVkXG4gICAgICByZXR1cm4gXCIjYmQwMDI2XCI7IC8vIERhcmsgcmVkXG4gICAgfVxuICAgIFxuXG4gICAgLy8gRnVuY3Rpb24gdG8gdXBkYXRlIGRhdGUgYW5kIGNvbG9yIGJhc2VkIG9uIHNsaWRlciB2YWx1ZVxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSkge1xuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBjb3VudHJ5Q2FzZXNNYXBbZmlyc3RDb3VudHJ5SVNPX0EzXS5kYXRlc1tzbGlkZXJWYWx1ZV07XG4gICAgICBkYXRlRGlzcGxheS50ZXh0Q29udGVudCA9IGBEYXRlOiAke2N1cnJlbnREYXRlfWA7XG4gICAgXG4gICAgICAvLyBVcGRhdGUgY29sb3IgZm9yIGVhY2ggY291bnRyeSBvbiB0aGUgZ2xvYmVcbiAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICAgICAgXG4gICAgICAgIGlmIChjb3VudHJ5Q2FzZXNNYXBbY291bnRyeUlTT19BM10pIHtcbiAgICAgICAgICBjb25zdCBjb3VudHJ5RGF0YSA9IGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXTtcbiAgICAgICAgICBjb25zdCBjb3VudHJ5VG90YWxDYXNlcyA9IGNvdW50cnlEYXRhLnRvdGFsQ2FzZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3JGb3JDYXNlcyhjb3VudHJ5VG90YWxDYXNlcyk7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwid2hpdGVcIjsgLy8gRGVmYXVsdCBjb2xvciBmb3IgY291bnRyaWVzIHdpdGhvdXQgZGF0YVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBjb2xvciBhbmQgZGF0ZSB3aGVuIHRoZSBzbGlkZXIgdmFsdWUgY2hhbmdlc1xuICAgIGNvbG9yU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBzbGlkZXJWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIGNvbnNvbGUubG9nKFwiU2xpZGVyIHZhbHVlIGNoYW5nZWQ6XCIsIHNsaWRlclZhbHVlKTsgLy8gRGVidWcgbG9nXG4gICAgICB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSBmaXJzdCBzbGlkZXIgdmFsdWVcbiAgICB1cGRhdGVEYXRlQW5kQ29sb3IoY29sb3JTbGlkZXIudmFsdWUpO1xuICB9KVxuICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBDT1ZJRCBkYXRhOicsIGVycm9yKSk7XG5cbi8vIENyZWF0ZSBhIG1hcHBpbmcgb2YgY291bnRyeSBuYW1lcyB0byBjb29yZGluYXRlcyBmcm9tIGdsb2JlIGRhdGFcbmNvbnN0IGNvdW50cnlDb29yZGluYXRlc01hcCA9IHt9O1xuXG4vLyBGdW5jdGlvbiB0byBjYWxjdWxhdGUgY2VudHJvaWQgKGZvciBjb3VudHJpZXMgd2l0aCBtdWx0aXBsZSBjb29yZGluYXRlcylcbmZ1bmN0aW9uIGNhbGN1bGF0ZUNlbnRyb2lkKGNvb3JkaW5hdGVzKSB7XG4gIGxldCBsYXRTdW0gPSAwO1xuICBsZXQgbG5nU3VtID0gMDtcbiAgbGV0IHRvdGFsUG9pbnRzID0gMDtcblxuICBjb29yZGluYXRlcy5mb3JFYWNoKHBvbHlnb24gPT4ge1xuICAgIHBvbHlnb24uZm9yRWFjaChjb29yZCA9PiB7XG4gICAgICBsYXRTdW0gKz0gY29vcmRbMF07XG4gICAgICBsbmdTdW0gKz0gY29vcmRbMV07XG4gICAgICB0b3RhbFBvaW50cyArPSAxO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGxhdDogbGF0U3VtIC8gdG90YWxQb2ludHMsXG4gICAgbG5nOiBsbmdTdW0gLyB0b3RhbFBvaW50cyxcbiAgfTtcbn1cblxuLy8gTG9hZCBjb29yZGluYXRlcyBkYXRhIGludG8gbWFwXG5jb3VudHJpZXMuZmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgY29uc3QgY291bnRyeUlTT19BMyA9IGZlYXR1cmUucHJvcGVydGllcy5JU09fQTM7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgY291bnRyeUNvb3JkaW5hdGVzTWFwW2NvdW50cnlJU09fQTNdID0gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpO1xufSk7XG5cbi8vIEluaXRpYWxpemUgZXZlcnl0aGluZ1xuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIC8vIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4NTU1NTU1LCAwLjQpKTsgLy8gRGltbWVyIGFtYmllbnQgbGlnaHRcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7IC8vIEJsYWNrIGJhY2tncm91bmRcblxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC42KTsgLy8gUmVkdWNlZCBpbnRlbnNpdHlcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMC41KTsgLy8gQmx1ZSBsaWdodCB3aXRoIGxvd2VyIGludGVuc2l0eVxuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC40KTsgLy8gRGltbWVkIHBvaW50IGxpZ2h0XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZW5hYmxlWm9vbSA9IGZhbHNlOyAvLyBEaXNhYmxlIHpvb21pbmcgZW50aXJlbHlcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSB0cnVlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDQwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA0MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBHbG9iZSBTZXR1cFxuLy8gR2xvYmUgU2V0dXBcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgcmV0dXJuIFwiYmxhY2tcIjsgLy8gS2VlcCBjb3VudHJ5IGNvbG9ycyB3aGl0ZVxuICAgIH0pO1xuXG4gIEdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDkpKTtcbiAgR2xvYmUucm90YXRlWigtTWF0aC5QSSAvIDYpO1xuXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIFxuICAvLyBTZXQgdGhlIGdsb2JlIGNvbG9yIHRvIHdoaXRlXG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHhGRkZGRkYpOyAvLyBXaGl0ZSBjb2xvclxuICBcbiAgLy8gU2V0IHRoZSBlbWlzc2l2ZSBjb2xvciB0byBhIHN1YnRsZSBsaWdodCBibHVlIHRvIG1ha2UgdGhlIGdsb2JlIHN0YW5kIG91dCBzbGlnaHRseVxuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4QUFBQUZGKTsgLy8gTGlnaHQgYmx1ZSBlbWlzc2l2ZSBjb2xvclxuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xOyAvLyBTbGlnaHQgZW1pc3NpdmUgaW50ZW5zaXR5IGZvciBnbG93IGVmZmVjdFxuICBcbiAgLy8gUmVkdWNlIHNoaW5pbmVzcyB0byBtYWtlIGl0IG1hdHRlXG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC4xO1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cblxuLy8gVXBkYXRlIG1vdXNlIHBvc2l0aW9uXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuLy8gSGFuZGxlIHdpbmRvdyByZXNpemVcbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBBbmltYXRpb24gbG9vcFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI0OTA2ZWZhYjU4YjQwMWVkZjk2NVwiIl0sInNvdXJjZVJvb3QiOiIifQ==