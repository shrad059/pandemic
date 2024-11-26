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
fetch('./covid.json')
  .then(response => response.json())
  .then(data => {
    // console.log("Afghanistan Data:", data); // Log the data to the console
    
    const countryCasesMap = {};
    data.forEach(entry => {
      const { country, date, total_cases } = entry;
      if (!countryCasesMap[country]) {
        countryCasesMap[country] = {
          dates: [],
          totalCases: [],
        };
      }
      countryCasesMap[country].dates.push(date);
      countryCasesMap[country].totalCases.push(parseInt(total_cases));
    });
    
    // Set up the slider
    const colorSlider = document.getElementById("colorSlider");
    const dateDisplay = document.getElementById("dateDisplay");

    // Set the slider's max value based on the number of entries (dates)
    const firstCountry = Object.keys(countryCasesMap)[0];
    console.log(firstCountry)
    colorSlider.max = countryCasesMap[firstCountry].dates.length - 1;
    
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
      const currentDate = countryCasesMap[firstCountry].dates[sliderValue];
      dateDisplay.textContent = `Date: ${currentDate}`;

      // Loop through each country and update its color
      Globe.hexPolygonColor((e) => {
        const countryName = e.properties.SOVEREIGNT;
        if (countryCasesMap[countryName]) {
          const countryData = countryCasesMap[countryName];
          const countryTotalCases = countryData.totalCases[sliderValue];
          const color = getColorForCases(countryTotalCases);
          return color; // Apply dynamic color based on total cases for each country
        }
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
  const countryName = feature.properties.SOVEREIGNT;
  const coordinates = feature.geometry.coordinates;
  countryCoordinatesMap[countryName] = calculateCentroid(coordinates);
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
/******/ 		__webpack_require__.h = () => "1884263046b49784b1ed"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ3FDO0FBQ1E7QUFDcUQ7QUFDckI7QUFDekI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4Qzs7QUFFOUM7QUFDQTtBQUNBLGFBQWEsNkJBQTZCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QywrQ0FBK0M7QUFDL0MsK0NBQStDO0FBQy9DLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsaURBQWlEO0FBQ2pELGlEQUFpRDtBQUNqRCx1QkFBdUI7QUFDdkI7O0FBRUE7QUFDQTtBQUNBLHlDQUF5QyxZQUFZOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBLHVCQUF1QjtBQUN2QixPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUEsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLLFdBQVc7O0FBRXpDLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDbk9BLG9EIiwiZmlsZSI6Im1haW4uMTEwOTVlNDQ4MWU3MjdiODg3NjMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSAoSlNPTilcbi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSAoSlNPTilcblxuLy8gVGhyZWUuanMgR2xvYmUgc2V0dXBcbmltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiOyAvLyBDb3VudHJ5IGdlb2xvY2F0aW9uIGRhdGFcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xuZmV0Y2goJy4vY292aWQuanNvbicpXG4gIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgLy8gY29uc29sZS5sb2coXCJBZmdoYW5pc3RhbiBEYXRhOlwiLCBkYXRhKTsgLy8gTG9nIHRoZSBkYXRhIHRvIHRoZSBjb25zb2xlXG4gICAgXG4gICAgY29uc3QgY291bnRyeUNhc2VzTWFwID0ge307XG4gICAgZGF0YS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGNvbnN0IHsgY291bnRyeSwgZGF0ZSwgdG90YWxfY2FzZXMgfSA9IGVudHJ5O1xuICAgICAgaWYgKCFjb3VudHJ5Q2FzZXNNYXBbY291bnRyeV0pIHtcbiAgICAgICAgY291bnRyeUNhc2VzTWFwW2NvdW50cnldID0ge1xuICAgICAgICAgIGRhdGVzOiBbXSxcbiAgICAgICAgICB0b3RhbENhc2VzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvdW50cnlDYXNlc01hcFtjb3VudHJ5XS5kYXRlcy5wdXNoKGRhdGUpO1xuICAgICAgY291bnRyeUNhc2VzTWFwW2NvdW50cnldLnRvdGFsQ2FzZXMucHVzaChwYXJzZUludCh0b3RhbF9jYXNlcykpO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFNldCB1cCB0aGUgc2xpZGVyXG4gICAgY29uc3QgY29sb3JTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG9yU2xpZGVyXCIpO1xuICAgIGNvbnN0IGRhdGVEaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlRGlzcGxheVwiKTtcblxuICAgIC8vIFNldCB0aGUgc2xpZGVyJ3MgbWF4IHZhbHVlIGJhc2VkIG9uIHRoZSBudW1iZXIgb2YgZW50cmllcyAoZGF0ZXMpXG4gICAgY29uc3QgZmlyc3RDb3VudHJ5ID0gT2JqZWN0LmtleXMoY291bnRyeUNhc2VzTWFwKVswXTtcbiAgICBjb25zb2xlLmxvZyhmaXJzdENvdW50cnkpXG4gICAgY29sb3JTbGlkZXIubWF4ID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeV0uZGF0ZXMubGVuZ3RoIC0gMTtcbiAgICBcbiAgICAvLyBGdW5jdGlvbiB0byBtYXAgdG90YWwgY2FzZXMgdG8gYSBjb2xvclxuICAgIGZ1bmN0aW9uIGdldENvbG9yRm9yQ2FzZXModG90YWxDYXNlcykge1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwKSByZXR1cm4gXCIjZmZiNmMxXCI7IC8vIExpZ2h0IHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMCkgcmV0dXJuIFwiI2ZmOWJiMFwiOyAvLyBTb2Z0IHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDApIHJldHVybiBcIiNmZjg4YTBcIjsgLy8gTWVkaXVtIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDApIHJldHVybiBcIiNmZjY0OTBcIjsgLy8gRGVlcCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMCkgcmV0dXJuIFwiI2ZmNDk3ZlwiOyAvLyBTdHJvbmcgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDApIHJldHVybiBcIiNmZjI2NzBcIjsgLy8gRGFyayBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMDApIHJldHVybiBcIiNmZjAwNTlcIjsgLy8gQ3JpbXNvbiByZWRcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwMCkgcmV0dXJuIFwiI2U2MDA0ZFwiOyAvLyBCcmlnaHQgcmVkXG4gICAgICByZXR1cm4gXCIjY2MwMDQwXCI7IC8vIERhcmsgcmVkXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnldLmRhdGVzW3NsaWRlclZhbHVlXTtcbiAgICAgIGRhdGVEaXNwbGF5LnRleHRDb250ZW50ID0gYERhdGU6ICR7Y3VycmVudERhdGV9YDtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIGVhY2ggY291bnRyeSBhbmQgdXBkYXRlIGl0cyBjb2xvclxuICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlOYW1lID0gZS5wcm9wZXJ0aWVzLlNPVkVSRUlHTlQ7XG4gICAgICAgIGlmIChjb3VudHJ5Q2FzZXNNYXBbY291bnRyeU5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgY291bnRyeURhdGEgPSBjb3VudHJ5Q2FzZXNNYXBbY291bnRyeU5hbWVdO1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlUb3RhbENhc2VzID0gY291bnRyeURhdGEudG90YWxDYXNlc1tzbGlkZXJWYWx1ZV07XG4gICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvckNhc2VzKGNvdW50cnlUb3RhbENhc2VzKTtcbiAgICAgICAgICByZXR1cm4gY29sb3I7IC8vIEFwcGx5IGR5bmFtaWMgY29sb3IgYmFzZWQgb24gdG90YWwgY2FzZXMgZm9yIGVhY2ggY291bnRyeVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIndoaXRlXCI7IC8vIERlZmF1bHQgY29sb3IgZm9yIGNvdW50cmllcyB3aXRob3V0IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBvbiBzbGlkZXIgaW5wdXRcbiAgICBjb2xvclNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgY29uc3Qgc2xpZGVyVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpO1xuICAgIH0pO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSBmaXJzdCB2YWx1ZVxuICAgIHVwZGF0ZURhdGVBbmRDb2xvcihjb2xvclNsaWRlci52YWx1ZSk7XG4gIH0pXG4gIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIENPVklEIGRhdGE6JywgZXJyb3IpKTtcblxuXG4vLyBDcmVhdGUgYSBtYXBwaW5nIG9mIGNvdW50cnkgbmFtZXMgdG8gY29vcmRpbmF0ZXMgZnJvbSBnbG9iZSBkYXRhXG5jb25zdCBjb3VudHJ5Q29vcmRpbmF0ZXNNYXAgPSB7fTtcblxuLy8gRnVuY3Rpb24gdG8gY2FsY3VsYXRlIGNlbnRyb2lkIChmb3IgY291bnRyaWVzIHdpdGggbXVsdGlwbGUgY29vcmRpbmF0ZXMpXG5mdW5jdGlvbiBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcykge1xuICBsZXQgbGF0U3VtID0gMDtcbiAgbGV0IGxuZ1N1bSA9IDA7XG4gIGxldCB0b3RhbFBvaW50cyA9IDA7XG5cbiAgY29vcmRpbmF0ZXMuZm9yRWFjaChwb2x5Z29uID0+IHtcbiAgICBwb2x5Z29uLmZvckVhY2goY29vcmQgPT4ge1xuICAgICAgbGF0U3VtICs9IGNvb3JkWzBdO1xuICAgICAgbG5nU3VtICs9IGNvb3JkWzFdO1xuICAgICAgdG90YWxQb2ludHMgKz0gMTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBsYXQ6IGxhdFN1bSAvIHRvdGFsUG9pbnRzLFxuICAgIGxuZzogbG5nU3VtIC8gdG90YWxQb2ludHMsXG4gIH07XG59XG5cbi8vIExvYWQgY29vcmRpbmF0ZXMgZGF0YSBpbnRvIG1hcFxuY291bnRyaWVzLmZlYXR1cmVzLmZvckVhY2goZmVhdHVyZSA9PiB7XG4gIGNvbnN0IGNvdW50cnlOYW1lID0gZmVhdHVyZS5wcm9wZXJ0aWVzLlNPVkVSRUlHTlQ7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgY291bnRyeUNvb3JkaW5hdGVzTWFwW2NvdW50cnlOYW1lXSA9IGNhbGN1bGF0ZUNlbnRyb2lkKGNvb3JkaW5hdGVzKTtcbn0pO1xuXG4vLyBJbml0aWFsaXplIGV2ZXJ5dGhpbmdcbmluaXQoKTtcbmluaXRHbG9iZSgpO1xub25XaW5kb3dSZXNpemUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwMDAwMDApOyAvLyBCbGFjayBiYWNrZ3JvdW5kXG5cbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBHbG9iZSBTZXR1cFxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgIGlmIChlLnByb3BlcnRpZXMuSVNPX0EzID09PSBcIkFGR1wiKSB7XG4gICAgICAgIHJldHVybiBcIiNmZmI2YzFcIjsgLy8gU2V0IGluaXRpYWwgY29sb3IgZm9yIEFmZ2hhbmlzdGFuXG4gICAgICB9XG4gICAgICByZXR1cm4gXCJ3aGl0ZVwiO1xuICAgIH0pO1xuXG4gIEdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDkpKTtcbiAgR2xvYmUucm90YXRlWigtTWF0aC5QSSAvIDYpO1xuICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbi8vIFVwZGF0ZSBtb3VzZSBwb3NpdGlvblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG59XG5cbi8vIEhhbmRsZSB3aW5kb3cgcmVzaXplXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuLy8gQW5pbWF0aW9uIGxvb3BcbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9XG4gICAgTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDJcbiAgICAgID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNVxuICAgICAgOiAwO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiMTg4NDI2MzA0NmI0OTc4NGIxZWRcIiJdLCJzb3VyY2VSb290IjoiIn0=