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

    // Ensure the slider works even if it's not the first country
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
      if (totalCases <= 100) return "#e1f3f8"; // Very light blue
      if (totalCases <= 300) return "#e9e9bb"; // Pale yellow
      if (totalCases <= 1000) return "#e9d994"; // Soft yellow
      if (totalCases <= 3000) return "#fed976"; // Light orange
      if (totalCases <= 10000) return "#feb24c"; // Medium orange
      if (totalCases <= 30000) return "#fd8d3d"; // Dark orange
      if (totalCases <= 100000) return "#fc4f2a"; // Red-orange
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
  scene.add(new three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight(0xbbbbbb, 0.6));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0xffff); // Black background

  camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  // var dLight1 = new DirectionalLight(0x7982f6, 1);
  // dLight1.position.set(-200, 500, 200);
  // camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_2__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  // scene.fog = new Fog(0x535ef3, 400, 2000);

  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_3__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = true;
  controls.minDistance = 200;
  controls.maxDistance = 500;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 1;
  controls.autoRotate = false;
  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3;

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}

// Globe Setup
function initGlobe() {
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    // .showAtmosphere(true)
    // .atmosphereColor("#3a228a")
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      return "white";
    });

  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x3a228a);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

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
/******/ 		__webpack_require__.h = () => "b9024d5e3de115682f15"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNxQztBQUNRO0FBQ3FEO0FBQ3JCO0FBQ3pCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFDQUFxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQSxrQztBQUNBO0FBQ0EscURBQXFEOztBQUVyRCxxQ0FBcUM7QUFDckMsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QywrQ0FBK0M7QUFDL0MsK0NBQStDO0FBQy9DLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsaURBQWlEO0FBQ2pELGlEQUFpRDtBQUNqRCx1QkFBdUI7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7O0FBRXJEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUEsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLLFNBQVM7O0FBRXZDLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0N6UEEsb0QiLCJmaWxlIjoibWFpbi4xNzBkNjc5ZDY0YzZkZDBjOWY3MS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhyZWUuanMgR2xvYmUgc2V0dXBcbmltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiOyAvLyBDb3VudHJ5IGdlb2xvY2F0aW9uIGRhdGFcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuXG4vLyBGZXRjaCBhbmQgcHJvY2VzcyBDT1ZJRCBkYXRhXG5mZXRjaCgnLi9maW5hbC5qc29uJylcbiAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAudGhlbihkYXRhID0+IHtcbiAgICAvLyBDcmVhdGUgYSBtYXBwaW5nIG9mIGNvdW50cnkgY2FzZXMgd2l0aCBJU09fQTMgYXMgdGhlIGtleVxuICAgIGNvbnN0IGNvdW50cnlDYXNlc01hcCA9IHt9O1xuXG4gICAgLy8gUmVvcmdhbml6ZSB0aGUgZGF0YSBieSBJU09fQTNcbiAgICBkYXRhLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgY29uc3QgeyBjb3VudHJ5LCBJU09fQTMsIGRhdGE6IGNvdW50cnlEYXRhIH0gPSBlbnRyeTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoaXMgY291bnRyeSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICBpZiAoIWNvdW50cnlDYXNlc01hcFtJU09fQTNdKSB7XG4gICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdID0ge1xuICAgICAgICAgIGNvdW50cnksXG4gICAgICAgICAgZGF0ZXM6IFtdLFxuICAgICAgICAgIHRvdGFsQ2FzZXM6IFtdLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBJdGVyYXRlIG92ZXIgdGhlIGNvdW50cnkgZGF0YSBlbnRyaWVzXG4gICAgICBjb3VudHJ5RGF0YS5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICAgIGNvbnN0IHsgZGF0ZSwgdG90YWxfY2FzZXMgfSA9IHJlY29yZDtcbiAgICAgICAgY29uc3QgcGFyc2VkVG90YWxDYXNlcyA9IHBhcnNlSW50KHRvdGFsX2Nhc2VzKTtcblxuICAgICAgICAvLyBPbmx5IGFkZCB2YWxpZCB0b3RhbF9jYXNlcyAoaWYgcGFyc2luZyB3YXMgc3VjY2Vzc2Z1bClcbiAgICAgICAgaWYgKCFpc05hTihwYXJzZWRUb3RhbENhc2VzKSkge1xuICAgICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICAgICAgY291bnRyeUNhc2VzTWFwW0lTT19BM10udG90YWxDYXNlcy5wdXNoKHBhcnNlZFRvdGFsQ2FzZXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKGNvdW50cnlDYXNlc01hcCk7IC8vIERlYnVnOiBMb2cgdGhlIGNvdW50cnkgY2FzZXMgbWFwIHRvIGNoZWNrIGlmIGRhdGEgaXMgYmVpbmcgYWRkZWQgY29ycmVjdGx5XG5cbiAgICAvLyBTZXQgdXAgdGhlIHNsaWRlclxuICAgIGNvbnN0IGNvbG9yU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2xvclNsaWRlclwiKTtcbiAgICBjb25zdCBkYXRlRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZURpc3BsYXlcIik7XG5cbiAgICAvLyBFbnN1cmUgdGhlIHNsaWRlciB3b3JrcyBldmVuIGlmIGl0J3Mgbm90IHRoZSBmaXJzdCBjb3VudHJ5XG4gICAgY29uc3QgZmlyc3RDb3VudHJ5SVNPX0EzID0gT2JqZWN0LmtleXMoY291bnRyeUNhc2VzTWFwKVswXTtcbiAgICBjb25zb2xlLmxvZyhmaXJzdENvdW50cnlJU09fQTMpOyAvLyBUaGlzIHNob3VsZCBwcmludCAnQUZHJ1xuICAgIGNvbnN0IGZpcnN0Q291bnRyeURhdGEgPSBjb3VudHJ5Q2FzZXNNYXBbZmlyc3RDb3VudHJ5SVNPX0EzXTtcbiAgICBjb25zb2xlLmxvZyhmaXJzdENvdW50cnlEYXRhKTsgXG4gICAgY29uc3QgbWF4U2xpZGVyVmFsdWUgPSBmaXJzdENvdW50cnlEYXRhLmRhdGVzLmxlbmd0aCAtIDE7XG4gICAgY29uc29sZS5sb2coJ01heCBTbGlkZXIgVmFsdWU6JywgbWF4U2xpZGVyVmFsdWUpOyAvLyBDaGVjayB0aGUgbWF4IHZhbHVlIGJlaW5nIHNldFxuICAgIFxuICAgIGNvbG9yU2xpZGVyLm1heCA9IG1heFNsaWRlclZhbHVlOyAvLyBVcGRhdGUgc2xpZGVyJ3MgbWF4IHZhbHVlXG4gICAgY29sb3JTbGlkZXIudmFsdWUgPSAwOyAvLyBEZWZhdWx0IHNsaWRlciB2YWx1ZVxuXG4gICAgLy8gRnVuY3Rpb24gdG8gbWFwIHRvdGFsIGNhc2VzIHRvIGEgY29sb3JcbiAgICBmdW5jdGlvbiBnZXRDb2xvckZvckNhc2VzKHRvdGFsQ2FzZXMpIHtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMCkgcmV0dXJuIFwiI2UxZjNmOFwiOyAvLyBWZXJ5IGxpZ2h0IGJsdWVcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMCkgcmV0dXJuIFwiI2U5ZTliYlwiOyAvLyBQYWxlIHllbGxvd1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMCkgcmV0dXJuIFwiI2U5ZDk5NFwiOyAvLyBTb2Z0IHllbGxvd1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMCkgcmV0dXJuIFwiI2ZlZDk3NlwiOyAvLyBMaWdodCBvcmFuZ2VcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDAwKSByZXR1cm4gXCIjZmViMjRjXCI7IC8vIE1lZGl1bSBvcmFuZ2VcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmQ4ZDNkXCI7IC8vIERhcmsgb3JhbmdlXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMDApIHJldHVybiBcIiNmYzRmMmFcIjsgLy8gUmVkLW9yYW5nZVxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDAwKSByZXR1cm4gXCIjZTMxYTFjXCI7IC8vIFJlZFxuICAgICAgcmV0dXJuIFwiI2JkMDAyNlwiOyAvLyBEYXJrIHJlZFxuICAgIH1cbiAgICBcbiAgICAvLyBGdW5jdGlvbiB0byB1cGRhdGUgZGF0ZSBhbmQgY29sb3IgYmFzZWQgb24gc2xpZGVyIHZhbHVlXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdLmRhdGVzW3NsaWRlclZhbHVlXTtcbiAgICAgIGRhdGVEaXNwbGF5LnRleHRDb250ZW50ID0gYERhdGU6ICR7Y3VycmVudERhdGV9YDtcbiAgICBcbiAgICAgIC8vIFVwZGF0ZSBjb2xvciBmb3IgZWFjaCBjb3VudHJ5IG9uIHRoZSBnbG9iZVxuICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlJU09fQTMgPSBlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXSkge1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlEYXRhID0gY291bnRyeUNhc2VzTWFwW2NvdW50cnlJU09fQTNdO1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlUb3RhbENhc2VzID0gY291bnRyeURhdGEudG90YWxDYXNlc1tzbGlkZXJWYWx1ZV07XG4gICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvckNhc2VzKGNvdW50cnlUb3RhbENhc2VzKTtcbiAgICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJ3aGl0ZVwiOyAvLyBEZWZhdWx0IGNvbG9yIGZvciBjb3VudHJpZXMgd2l0aG91dCBkYXRhXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIGNvbG9yIGFuZCBkYXRlIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBjaGFuZ2VzXG4gICAgY29sb3JTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHNsaWRlclZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgY29uc29sZS5sb2coXCJTbGlkZXIgdmFsdWUgY2hhbmdlZDpcIiwgc2xpZGVyVmFsdWUpOyAvLyBEZWJ1ZyBsb2dcbiAgICAgIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIGZpcnN0IHNsaWRlciB2YWx1ZVxuICAgIHVwZGF0ZURhdGVBbmRDb2xvcihjb2xvclNsaWRlci52YWx1ZSk7XG5cbiAgfSlcbiAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgQ09WSUQgZGF0YTonLCBlcnJvcikpO1xuXG4vLyBDcmVhdGUgYSBtYXBwaW5nIG9mIGNvdW50cnkgbmFtZXMgdG8gY29vcmRpbmF0ZXMgZnJvbSBnbG9iZSBkYXRhXG5jb25zdCBjb3VudHJ5Q29vcmRpbmF0ZXNNYXAgPSB7fTtcblxuLy8gRnVuY3Rpb24gdG8gY2FsY3VsYXRlIGNlbnRyb2lkIChmb3IgY291bnRyaWVzIHdpdGggbXVsdGlwbGUgY29vcmRpbmF0ZXMpXG5mdW5jdGlvbiBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcykge1xuICBsZXQgbGF0U3VtID0gMDtcbiAgbGV0IGxuZ1N1bSA9IDA7XG4gIGxldCB0b3RhbFBvaW50cyA9IDA7XG5cbiAgY29vcmRpbmF0ZXMuZm9yRWFjaChwb2x5Z29uID0+IHtcbiAgICBwb2x5Z29uLmZvckVhY2goY29vcmQgPT4ge1xuICAgICAgbGF0U3VtICs9IGNvb3JkWzBdO1xuICAgICAgbG5nU3VtICs9IGNvb3JkWzFdO1xuICAgICAgdG90YWxQb2ludHMgKz0gMTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBsYXQ6IGxhdFN1bSAvIHRvdGFsUG9pbnRzLFxuICAgIGxuZzogbG5nU3VtIC8gdG90YWxQb2ludHMsXG4gIH07XG59XG5cbi8vIExvYWQgY29vcmRpbmF0ZXMgZGF0YSBpbnRvIG1hcFxuY291bnRyaWVzLmZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gIGNvbnN0IGNvdW50cnlJU09fQTMgPSBmZWF0dXJlLnByb3BlcnRpZXMuSVNPX0EzO1xuICBjb25zdCBjb29yZGluYXRlcyA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIGNvdW50cnlDb29yZGluYXRlc01hcFtjb3VudHJ5SVNPX0EzXSA9IGNhbGN1bGF0ZUNlbnRyb2lkKGNvb3JkaW5hdGVzKTtcbn0pO1xuXG4vLyBJbml0aWFsaXplIGV2ZXJ5dGhpbmdcbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC42KSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHhmZmZmKTsgLy8gQmxhY2sgYmFja2dyb3VuZFxuXG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICAvLyB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgLy8gZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAvLyBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG4gIC8vIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSB0cnVlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBHbG9iZSBTZXR1cFxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC8vIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgIC8vIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgIHJldHVybiBcIndoaXRlXCI7XG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gVXBkYXRlIG1vdXNlIHBvc2l0aW9uXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuLy8gSGFuZGxlIHdpbmRvdyByZXNpemVcbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBBbmltYXRpb24gbG9vcFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJiOTAyNGQ1ZTNkZTExNTY4MmYxNVwiIl0sInNvdXJjZVJvb3QiOiIifQ==