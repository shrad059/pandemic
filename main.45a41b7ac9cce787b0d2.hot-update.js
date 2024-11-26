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
    console.log("color"+colorSlider); // Should print the slider element
    const dateDisplay = document.getElementById("dateDisplay");

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
          console.log(`Updating color for ${countryISO_A3}: ${color}`); // Debug log to check if the color is being set
          return color; // Apply dynamic color based on total cases for each country
        }

        console.log(`No data for country ${countryISO_A3}, setting to default white`); // Debug log for countries without data
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
/******/ 		__webpack_require__.h = () => "f603932512c013f24b1a"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ3FDO0FBQ1E7QUFDcUQ7QUFDckI7QUFDekI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEscUNBQXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsK0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFDakQsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0EseURBQXlEOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxjQUFjLElBQUksTUFBTSxHQUFHO0FBQ3ZFLHVCQUF1QjtBQUN2Qjs7QUFFQSwyQ0FBMkMsY0FBYyw2QkFBNkI7QUFDdEYsdUJBQXVCO0FBQ3ZCLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUEsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLLFdBQVc7O0FBRXpDLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDeE9BLG9EIiwiZmlsZSI6Im1haW4uNDVhNDFiN2FjOWNjZTc4N2IwZDIuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSAoSlNPTilcbi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSAoSlNPTilcblxuLy8gVGhyZWUuanMgR2xvYmUgc2V0dXBcbmltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiOyAvLyBDb3VudHJ5IGdlb2xvY2F0aW9uIGRhdGFcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuZmV0Y2goJy4vY292aWRfZmluYWwuanNvbicpXG4gIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IGNhc2VzIHdpdGggSVNPX0EzIGFzIHRoZSBrZXlcbiAgICBjb25zdCBjb3VudHJ5Q2FzZXNNYXAgPSB7fTtcbiAgICBkYXRhLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgY29uc3QgeyBjb3VudHJ5LCBkYXRlLCB0b3RhbF9jYXNlcywgSVNPX0EzIH0gPSBlbnRyeTtcblxuICAgICAgLy8gVXNlIElTT19BMyBhcyB0aGUga2V5XG4gICAgICBpZiAoIWNvdW50cnlDYXNlc01hcFtJU09fQTNdKSB7XG4gICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdID0ge1xuICAgICAgICAgIGRhdGVzOiBbXSxcbiAgICAgICAgICB0b3RhbENhc2VzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXS50b3RhbENhc2VzLnB1c2gocGFyc2VJbnQodG90YWxfY2FzZXMpKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBTZXQgdXAgdGhlIHNsaWRlclxuICAgIGNvbnN0IGNvbG9yU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2xvclNsaWRlclwiKTtcbiAgICBjb25zb2xlLmxvZyhcImNvbG9yXCIrY29sb3JTbGlkZXIpOyAvLyBTaG91bGQgcHJpbnQgdGhlIHNsaWRlciBlbGVtZW50XG4gICAgY29uc3QgZGF0ZURpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVEaXNwbGF5XCIpO1xuXG4gICAgLy8gU2V0IHRoZSBzbGlkZXIncyBtYXggdmFsdWUgYmFzZWQgb24gdGhlIG51bWJlciBvZiBlbnRyaWVzIChkYXRlcylcbiAgICBjb25zdCBmaXJzdENvdW50cnlJU09fQTMgPSBPYmplY3Qua2V5cyhjb3VudHJ5Q2FzZXNNYXApWzBdO1xuICAgIC8vIGNvbnNvbGUubG9nKGZpcnN0Q291bnRyeUlTT19BMyk7XG4gICAgY29sb3JTbGlkZXIubWF4ID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM10uZGF0ZXMubGVuZ3RoIC0gMTtcblxuICAgIC8vIEZ1bmN0aW9uIHRvIG1hcCB0b3RhbCBjYXNlcyB0byBhIGNvbG9yXG4gICAgZnVuY3Rpb24gZ2V0Q29sb3JGb3JDYXNlcyh0b3RhbENhc2VzKSB7XG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDApIHJldHVybiBcIiNmZmI2YzFcIjsgLy8gTGlnaHQgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwKSByZXR1cm4gXCIjZmY5YmIwXCI7IC8vIFNvZnQgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMCkgcmV0dXJuIFwiI2ZmODhhMFwiOyAvLyBNZWRpdW0gcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMCkgcmV0dXJuIFwiI2ZmNjQ5MFwiOyAvLyBEZWVwIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDAwKSByZXR1cm4gXCIjZmY0OTdmXCI7IC8vIFN0cm9uZyBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMCkgcmV0dXJuIFwiI2ZmMjY3MFwiOyAvLyBEYXJrIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDAwMCkgcmV0dXJuIFwiI2ZmMDA1OVwiOyAvLyBDcmltc29uIHJlZFxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDAwKSByZXR1cm4gXCIjZTYwMDRkXCI7IC8vIEJyaWdodCByZWRcbiAgICAgIHJldHVybiBcIiNjYzAwNDBcIjsgLy8gRGFyayByZWRcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM10uZGF0ZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgZGF0ZURpc3BsYXkudGV4dENvbnRlbnQgPSBgRGF0ZTogJHtjdXJyZW50RGF0ZX1gO1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggZWFjaCBjb3VudHJ5IGFuZCB1cGRhdGUgaXRzIGNvbG9yXG4gICAgICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgICAgY29uc3QgY291bnRyeUlTT19BMyA9IGUucHJvcGVydGllcy5JU09fQTM7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ291bnRyeSBJU09fQTM6XCIsIGNvdW50cnlJU09fQTMpOyAvLyBEZWJ1ZyBsb2cgdG8gY2hlY2sgaWYgSVNPX0EzIGV4aXN0c1xuXG4gICAgICAgIGlmIChjb3VudHJ5Q2FzZXNNYXBbY291bnRyeUlTT19BM10pIHtcbiAgICAgICAgICBjb25zdCBjb3VudHJ5RGF0YSA9IGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXTtcbiAgICAgICAgICBjb25zdCBjb3VudHJ5VG90YWxDYXNlcyA9IGNvdW50cnlEYXRhLnRvdGFsQ2FzZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3JGb3JDYXNlcyhjb3VudHJ5VG90YWxDYXNlcyk7XG4gICAgICAgICAgY29uc29sZS5sb2coYFVwZGF0aW5nIGNvbG9yIGZvciAke2NvdW50cnlJU09fQTN9OiAke2NvbG9yfWApOyAvLyBEZWJ1ZyBsb2cgdG8gY2hlY2sgaWYgdGhlIGNvbG9yIGlzIGJlaW5nIHNldFxuICAgICAgICAgIHJldHVybiBjb2xvcjsgLy8gQXBwbHkgZHluYW1pYyBjb2xvciBiYXNlZCBvbiB0b3RhbCBjYXNlcyBmb3IgZWFjaCBjb3VudHJ5XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgTm8gZGF0YSBmb3IgY291bnRyeSAke2NvdW50cnlJU09fQTN9LCBzZXR0aW5nIHRvIGRlZmF1bHQgd2hpdGVgKTsgLy8gRGVidWcgbG9nIGZvciBjb3VudHJpZXMgd2l0aG91dCBkYXRhXG4gICAgICAgIHJldHVybiBcIndoaXRlXCI7IC8vIERlZmF1bHQgY29sb3IgZm9yIGNvdW50cmllcyB3aXRob3V0IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBvbiBzbGlkZXIgaW5wdXRcbiAgICBjb2xvclNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgY29uc3Qgc2xpZGVyVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSBmaXJzdCB2YWx1ZVxuICAgIHVwZGF0ZURhdGVBbmRDb2xvcihjb2xvclNsaWRlci52YWx1ZSk7XG4gIH0pXG4gIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIENPVklEIGRhdGE6JywgZXJyb3IpKTtcblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IG5hbWVzIHRvIGNvb3JkaW5hdGVzIGZyb20gZ2xvYmUgZGF0YVxuY29uc3QgY291bnRyeUNvb3JkaW5hdGVzTWFwID0ge307XG5cbi8vIEZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBjZW50cm9pZCAoZm9yIGNvdW50cmllcyB3aXRoIG11bHRpcGxlIGNvb3JkaW5hdGVzKVxuZnVuY3Rpb24gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGxhdFN1bSA9IDA7XG4gIGxldCBsbmdTdW0gPSAwO1xuICBsZXQgdG90YWxQb2ludHMgPSAwO1xuXG4gIGNvb3JkaW5hdGVzLmZvckVhY2gocG9seWdvbiA9PiB7XG4gICAgcG9seWdvbi5mb3JFYWNoKGNvb3JkID0+IHtcbiAgICAgIGxhdFN1bSArPSBjb29yZFswXTtcbiAgICAgIGxuZ1N1bSArPSBjb29yZFsxXTtcbiAgICAgIHRvdGFsUG9pbnRzICs9IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbGF0OiBsYXRTdW0gLyB0b3RhbFBvaW50cyxcbiAgICBsbmc6IGxuZ1N1bSAvIHRvdGFsUG9pbnRzLFxuICB9O1xufVxuXG4vLyBMb2FkIGNvb3JkaW5hdGVzIGRhdGEgaW50byBtYXBcbmNvdW50cmllcy5mZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZmVhdHVyZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBjb3VudHJ5Q29vcmRpbmF0ZXNNYXBbY291bnRyeUlTT19BM10gPSBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcyk7XG59KTtcbi8vIEluaXRpYWxpemUgZXZlcnl0aGluZ1xuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7IC8vIEJsYWNrIGJhY2tncm91bmRcblxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIEdsb2JlIFNldHVwXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgaWYgKGUucHJvcGVydGllcy5JU09fQTMgPT09IFwiQUZHXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBTZXQgaW5pdGlhbCBjb2xvciBmb3IgQWZnaGFuaXN0YW5cbiAgICAgIH1cbiAgICAgIHJldHVybiBcIndoaXRlXCI7XG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gVXBkYXRlIG1vdXNlIHBvc2l0aW9uXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuLy8gSGFuZGxlIHdpbmRvdyByZXNpemVcbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBBbmltYXRpb24gbG9vcFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJmNjAzOTMyNTEyYzAxM2YyNGIxYVwiIl0sInNvdXJjZVJvb3QiOiIifQ==