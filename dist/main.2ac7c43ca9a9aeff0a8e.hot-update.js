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
// Load Afghanistan data (JSON)
// Load Afghanistan data (JSON)

// Three.js Globe setup




 // Country geolocation data

var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
fetch('./covid_final.json')
  .then(response => response.json())
  .then(data => {
    // Create a mapping of country cases with ISO_A3 as the key
    const countryCasesMap = {};
    data.forEach(entry => {
      const { country, date, total_cases, ISO_A3 } = entry;

      // Use ISO_A3 as the key
      if (!countryCasesMap[ISO_A3]) {
        countryCasesMap[ISO_A3] = {
          dates: [],
          totalCases: [],
        };
      }
      countryCasesMap[ISO_A3].dates.push(date);
      countryCasesMap[ISO_A3].totalCases.push(parseInt(total_cases));
    });
    
    // Set up the slider
    const colorSlider = document.getElementById("colorSlider");
    console.log(colorSlider); // Should print the slider element
    const dateDisplay = document.getElementById("dateDisplay");
    console.log(dateDisplay); // Should print the date display element

    // Set the slider's max value based on the number of entries (dates)
    const firstCountryISO_A3 = Object.keys(countryCasesMap)[0];
    // console.log(firstCountryISO_A3);
    colorSlider.max = countryCasesMap[firstCountryISO_A3].dates.length - 1;

    // Function to map total cases to a color
    function getColorForCases(totalCases) {
      if (totalCases <= 100) return "#ffb6c1"; // Light pink
      if (totalCases <= 300) return "#ff9bb0"; // Soft pink
      if (totalCases <= 1000) return "#ff88a0"; // Medium pink
      if (totalCases <= 3000) return "#ff6490"; // Deep pink
      if (totalCases <= 10000) return "#ff497f"; // Strong pink
      if (totalCases <= 30000) return "#ff2670"; // Dark pink
      if (totalCases <= 100000) return "#ff0059"; // Crimson red
      if (totalCases <= 300000) return "#e6004d"; // Bright red
      return "#cc0040"; // Dark red
    }

    function updateDateAndColor(sliderValue) {
      const currentDate = countryCasesMap[firstCountryISO_A3].dates[sliderValue];
      dateDisplay.textContent = `Date: ${currentDate}`;

      // Loop through each country and update its color
      Globe.hexPolygonColor((e) => {
        const countryISO_A3 = e.properties.ISO_A3;
        // console.log("Country ISO_A3:", countryISO_A3); // Debug log to check if ISO_A3 exists

        if (countryCasesMap[countryISO_A3]) {
          const countryData = countryCasesMap[countryISO_A3];
          const countryTotalCases = countryData.totalCases[sliderValue];
          const color = getColorForCases(countryTotalCases);
          // console.log(`Updating color for ${countryISO_A3}: ${color}`); // Debug log to check if the color is being set
          return color; // Apply dynamic color based on total cases for each country
        }

        // console.log(`No data for country ${countryISO_A3}, setting to default white`); // Debug log for countries without data
        return "white"; // Default color for countries without data
      });
    }

    // Update on slider input
    colorSlider.addEventListener('input', (event) => {
      const sliderValue = event.target.value;
      
      updateDateAndColor(sliderValue);
    });
    

    // Initialize with the first value
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
  scene.add(new three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x000000); // Black background

  camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_2__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_2__.Fog(0x535ef3, 400, 2000);

  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_3__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
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
    .showAtmosphere(true)
    .atmosphereColor("#3a228a")
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      if (e.properties.ISO_A3 === "AFG") {
        return "#ffb6c1"; // Set initial color for Afghanistan
      }
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
/******/ 		__webpack_require__.h = () => "cf3c4c7676d07cabadf0"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ3FDO0FBQ1E7QUFDcUQ7QUFDckI7QUFDekI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUNBQXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSw2QkFBNkI7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDLCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCxpREFBaUQ7QUFDakQsaURBQWlEO0FBQ2pELHVCQUF1QjtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsY0FBYyxJQUFJLE1BQU0sR0FBRztBQUMxRSx1QkFBdUI7QUFDdkI7O0FBRUEsOENBQThDLGNBQWMsNkJBQTZCO0FBQ3pGLHVCQUF1QjtBQUN2QixPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7O0FBR0w7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUEsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLLFdBQVc7O0FBRXpDLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDM09BLG9EIiwiZmlsZSI6Im1haW4uMmFjN2M0M2NhOWE5YWVmZjBhOGUuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSAoSlNPTilcbi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSAoSlNPTilcblxuLy8gVGhyZWUuanMgR2xvYmUgc2V0dXBcbmltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiOyAvLyBDb3VudHJ5IGdlb2xvY2F0aW9uIGRhdGFcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuZmV0Y2goJy4vY292aWRfZmluYWwuanNvbicpXG4gIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IGNhc2VzIHdpdGggSVNPX0EzIGFzIHRoZSBrZXlcbiAgICBjb25zdCBjb3VudHJ5Q2FzZXNNYXAgPSB7fTtcbiAgICBkYXRhLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgY29uc3QgeyBjb3VudHJ5LCBkYXRlLCB0b3RhbF9jYXNlcywgSVNPX0EzIH0gPSBlbnRyeTtcblxuICAgICAgLy8gVXNlIElTT19BMyBhcyB0aGUga2V5XG4gICAgICBpZiAoIWNvdW50cnlDYXNlc01hcFtJU09fQTNdKSB7XG4gICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdID0ge1xuICAgICAgICAgIGRhdGVzOiBbXSxcbiAgICAgICAgICB0b3RhbENhc2VzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXS50b3RhbENhc2VzLnB1c2gocGFyc2VJbnQodG90YWxfY2FzZXMpKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBTZXQgdXAgdGhlIHNsaWRlclxuICAgIGNvbnN0IGNvbG9yU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2xvclNsaWRlclwiKTtcbiAgICBjb25zb2xlLmxvZyhjb2xvclNsaWRlcik7IC8vIFNob3VsZCBwcmludCB0aGUgc2xpZGVyIGVsZW1lbnRcbiAgICBjb25zdCBkYXRlRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZURpc3BsYXlcIik7XG4gICAgY29uc29sZS5sb2coZGF0ZURpc3BsYXkpOyAvLyBTaG91bGQgcHJpbnQgdGhlIGRhdGUgZGlzcGxheSBlbGVtZW50XG5cbiAgICAvLyBTZXQgdGhlIHNsaWRlcidzIG1heCB2YWx1ZSBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIGVudHJpZXMgKGRhdGVzKVxuICAgIGNvbnN0IGZpcnN0Q291bnRyeUlTT19BMyA9IE9iamVjdC5rZXlzKGNvdW50cnlDYXNlc01hcClbMF07XG4gICAgLy8gY29uc29sZS5sb2coZmlyc3RDb3VudHJ5SVNPX0EzKTtcbiAgICBjb2xvclNsaWRlci5tYXggPSBjb3VudHJ5Q2FzZXNNYXBbZmlyc3RDb3VudHJ5SVNPX0EzXS5kYXRlcy5sZW5ndGggLSAxO1xuXG4gICAgLy8gRnVuY3Rpb24gdG8gbWFwIHRvdGFsIGNhc2VzIHRvIGEgY29sb3JcbiAgICBmdW5jdGlvbiBnZXRDb2xvckZvckNhc2VzKHRvdGFsQ2FzZXMpIHtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMCkgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBMaWdodCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDApIHJldHVybiBcIiNmZjliYjBcIjsgLy8gU29mdCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwKSByZXR1cm4gXCIjZmY4OGEwXCI7IC8vIE1lZGl1bSBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwKSByZXR1cm4gXCIjZmY2NDkwXCI7IC8vIERlZXAgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDApIHJldHVybiBcIiNmZjQ5N2ZcIjsgLy8gU3Ryb25nIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmYyNjcwXCI7IC8vIERhcmsgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDAwKSByZXR1cm4gXCIjZmYwMDU5XCI7IC8vIENyaW1zb24gcmVkXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMDApIHJldHVybiBcIiNlNjAwNGRcIjsgLy8gQnJpZ2h0IHJlZFxuICAgICAgcmV0dXJuIFwiI2NjMDA0MFwiOyAvLyBEYXJrIHJlZFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSkge1xuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBjb3VudHJ5Q2FzZXNNYXBbZmlyc3RDb3VudHJ5SVNPX0EzXS5kYXRlc1tzbGlkZXJWYWx1ZV07XG4gICAgICBkYXRlRGlzcGxheS50ZXh0Q29udGVudCA9IGBEYXRlOiAke2N1cnJlbnREYXRlfWA7XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCBlYWNoIGNvdW50cnkgYW5kIHVwZGF0ZSBpdHMgY29sb3JcbiAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJDb3VudHJ5IElTT19BMzpcIiwgY291bnRyeUlTT19BMyk7IC8vIERlYnVnIGxvZyB0byBjaGVjayBpZiBJU09fQTMgZXhpc3RzXG5cbiAgICAgICAgaWYgKGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXSkge1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlEYXRhID0gY291bnRyeUNhc2VzTWFwW2NvdW50cnlJU09fQTNdO1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlUb3RhbENhc2VzID0gY291bnRyeURhdGEudG90YWxDYXNlc1tzbGlkZXJWYWx1ZV07XG4gICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvckNhc2VzKGNvdW50cnlUb3RhbENhc2VzKTtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgVXBkYXRpbmcgY29sb3IgZm9yICR7Y291bnRyeUlTT19BM306ICR7Y29sb3J9YCk7IC8vIERlYnVnIGxvZyB0byBjaGVjayBpZiB0aGUgY29sb3IgaXMgYmVpbmcgc2V0XG4gICAgICAgICAgcmV0dXJuIGNvbG9yOyAvLyBBcHBseSBkeW5hbWljIGNvbG9yIGJhc2VkIG9uIHRvdGFsIGNhc2VzIGZvciBlYWNoIGNvdW50cnlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBObyBkYXRhIGZvciBjb3VudHJ5ICR7Y291bnRyeUlTT19BM30sIHNldHRpbmcgdG8gZGVmYXVsdCB3aGl0ZWApOyAvLyBEZWJ1ZyBsb2cgZm9yIGNvdW50cmllcyB3aXRob3V0IGRhdGFcbiAgICAgICAgcmV0dXJuIFwid2hpdGVcIjsgLy8gRGVmYXVsdCBjb2xvciBmb3IgY291bnRyaWVzIHdpdGhvdXQgZGF0YVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIG9uIHNsaWRlciBpbnB1dFxuICAgIGNvbG9yU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBzbGlkZXJWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIFxuICAgICAgdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKTtcbiAgICB9KTtcbiAgICBcblxuICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgZmlyc3QgdmFsdWVcbiAgICB1cGRhdGVEYXRlQW5kQ29sb3IoY29sb3JTbGlkZXIudmFsdWUpO1xuICB9KVxuICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBDT1ZJRCBkYXRhOicsIGVycm9yKSk7XG5cbi8vIENyZWF0ZSBhIG1hcHBpbmcgb2YgY291bnRyeSBuYW1lcyB0byBjb29yZGluYXRlcyBmcm9tIGdsb2JlIGRhdGFcbmNvbnN0IGNvdW50cnlDb29yZGluYXRlc01hcCA9IHt9O1xuXG4vLyBGdW5jdGlvbiB0byBjYWxjdWxhdGUgY2VudHJvaWQgKGZvciBjb3VudHJpZXMgd2l0aCBtdWx0aXBsZSBjb29yZGluYXRlcylcbmZ1bmN0aW9uIGNhbGN1bGF0ZUNlbnRyb2lkKGNvb3JkaW5hdGVzKSB7XG4gIGxldCBsYXRTdW0gPSAwO1xuICBsZXQgbG5nU3VtID0gMDtcbiAgbGV0IHRvdGFsUG9pbnRzID0gMDtcblxuICBjb29yZGluYXRlcy5mb3JFYWNoKHBvbHlnb24gPT4ge1xuICAgIHBvbHlnb24uZm9yRWFjaChjb29yZCA9PiB7XG4gICAgICBsYXRTdW0gKz0gY29vcmRbMF07XG4gICAgICBsbmdTdW0gKz0gY29vcmRbMV07XG4gICAgICB0b3RhbFBvaW50cyArPSAxO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGxhdDogbGF0U3VtIC8gdG90YWxQb2ludHMsXG4gICAgbG5nOiBsbmdTdW0gLyB0b3RhbFBvaW50cyxcbiAgfTtcbn1cblxuLy8gTG9hZCBjb29yZGluYXRlcyBkYXRhIGludG8gbWFwXG5jb3VudHJpZXMuZmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgY29uc3QgY291bnRyeUlTT19BMyA9IGZlYXR1cmUucHJvcGVydGllcy5JU09fQTM7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgY291bnRyeUNvb3JkaW5hdGVzTWFwW2NvdW50cnlJU09fQTNdID0gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpO1xufSk7XG4vLyBJbml0aWFsaXplIGV2ZXJ5dGhpbmdcbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApOyAvLyBCbGFjayBiYWNrZ3JvdW5kXG5cbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBHbG9iZSBTZXR1cFxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgIGlmIChlLnByb3BlcnRpZXMuSVNPX0EzID09PSBcIkFGR1wiKSB7XG4gICAgICAgIHJldHVybiBcIiNmZmI2YzFcIjsgLy8gU2V0IGluaXRpYWwgY29sb3IgZm9yIEFmZ2hhbmlzdGFuXG4gICAgICB9XG4gICAgICByZXR1cm4gXCJ3aGl0ZVwiO1xuICAgIH0pO1xuXG4gIEdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDkpKTtcbiAgR2xvYmUucm90YXRlWigtTWF0aC5QSSAvIDYpO1xuICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbi8vIFVwZGF0ZSBtb3VzZSBwb3NpdGlvblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG59XG5cbi8vIEhhbmRsZSB3aW5kb3cgcmVzaXplXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuLy8gQW5pbWF0aW9uIGxvb3BcbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDJcbiAgICAgID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNVxuICAgICAgOiAwO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiY2YzYzRjNzY3NmQwN2NhYmFkZjBcIiJdLCJzb3VyY2VSb290IjoiIn0=