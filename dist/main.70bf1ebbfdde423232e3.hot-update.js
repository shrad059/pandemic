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
fetch('./files/afghanistan.json')
  .then(response => response.json())
  .then(data => {
    console.log("Afghanistan Data:", data); // Log the data to the console
    
    const dates = data.map(entry => entry.date); // Extract the dates
    const totalCases = data.map(entry => parseInt(entry.total_cases)); // Extract total cases
    const minDate = new Date(dates[0]); // First date in data
    const maxDate = new Date(dates[dates.length - 1]); // Last date in data
    
    // Set up the slider
    const colorSlider = document.getElementById("colorSlider");
    const dateDisplay = document.getElementById("dateDisplay");

    // Set the slider's max value based on the number of entries (dates)
    colorSlider.max = dates.length - 1;
    
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

    // Function to update the date and color based on the slider
    function updateDateAndColor(sliderValue) {
      const currentDate = dates[sliderValue];
      const currentTotalCases = totalCases[sliderValue];
      const color = getColorForCases(currentTotalCases);
      
      // Update date display
      dateDisplay.textContent = `Date: ${currentDate}`;
      
      // Change color based on total cases
      Globe.hexPolygonColor((e) => {
        if (e.properties.ISO_A3 === "AFG") {
          return color; // Apply dynamic color based on total cases
        }
        return "white"; // Default color for other countries
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
  .catch(error => console.error('Error loading Afghanistan data:', error));


// Three.js Globe setup




 // Country geolocation data

var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;

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
/******/ 		__webpack_require__.h = () => "d67fa49a0dfeaa019773"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDOztBQUUzQyxnREFBZ0Q7QUFDaEQsc0VBQXNFO0FBQ3RFLHVDQUF1QztBQUN2QyxzREFBc0Q7O0FBRXREO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDLCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCxpREFBaUQ7QUFDakQsaURBQWlEO0FBQ2pELHVCQUF1QjtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUNBQXlDLFlBQVk7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBLHVCQUF1QjtBQUN2QixPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7OztBQUdBO0FBQ3FDO0FBQ1E7QUFDcUQ7QUFDckI7QUFDekI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSyxXQUFXOztBQUV6QyxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNDQUFHOztBQUVyQixpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQzFOQSxvRCIsImZpbGUiOiJtYWluLjcwYmYxZWJiZmRkZTQyMzIzMmUzLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMb2FkIEFmZ2hhbmlzdGFuIGRhdGEgKEpTT04pXG4vLyBMb2FkIEFmZ2hhbmlzdGFuIGRhdGEgKEpTT04pXG5mZXRjaCgnLi9maWxlcy9hZmdoYW5pc3Rhbi5qc29uJylcbiAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAudGhlbihkYXRhID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkFmZ2hhbmlzdGFuIERhdGE6XCIsIGRhdGEpOyAvLyBMb2cgdGhlIGRhdGEgdG8gdGhlIGNvbnNvbGVcbiAgICBcbiAgICBjb25zdCBkYXRlcyA9IGRhdGEubWFwKGVudHJ5ID0+IGVudHJ5LmRhdGUpOyAvLyBFeHRyYWN0IHRoZSBkYXRlc1xuICAgIGNvbnN0IHRvdGFsQ2FzZXMgPSBkYXRhLm1hcChlbnRyeSA9PiBwYXJzZUludChlbnRyeS50b3RhbF9jYXNlcykpOyAvLyBFeHRyYWN0IHRvdGFsIGNhc2VzXG4gICAgY29uc3QgbWluRGF0ZSA9IG5ldyBEYXRlKGRhdGVzWzBdKTsgLy8gRmlyc3QgZGF0ZSBpbiBkYXRhXG4gICAgY29uc3QgbWF4RGF0ZSA9IG5ldyBEYXRlKGRhdGVzW2RhdGVzLmxlbmd0aCAtIDFdKTsgLy8gTGFzdCBkYXRlIGluIGRhdGFcbiAgICBcbiAgICAvLyBTZXQgdXAgdGhlIHNsaWRlclxuICAgIGNvbnN0IGNvbG9yU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2xvclNsaWRlclwiKTtcbiAgICBjb25zdCBkYXRlRGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGF0ZURpc3BsYXlcIik7XG5cbiAgICAvLyBTZXQgdGhlIHNsaWRlcidzIG1heCB2YWx1ZSBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIGVudHJpZXMgKGRhdGVzKVxuICAgIGNvbG9yU2xpZGVyLm1heCA9IGRhdGVzLmxlbmd0aCAtIDE7XG4gICAgXG4gICAgLy8gRnVuY3Rpb24gdG8gbWFwIHRvdGFsIGNhc2VzIHRvIGEgY29sb3JcbiAgICBmdW5jdGlvbiBnZXRDb2xvckZvckNhc2VzKHRvdGFsQ2FzZXMpIHtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMCkgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBMaWdodCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDApIHJldHVybiBcIiNmZjliYjBcIjsgLy8gU29mdCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwKSByZXR1cm4gXCIjZmY4OGEwXCI7IC8vIE1lZGl1bSBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwKSByZXR1cm4gXCIjZmY2NDkwXCI7IC8vIERlZXAgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDApIHJldHVybiBcIiNmZjQ5N2ZcIjsgLy8gU3Ryb25nIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmYyNjcwXCI7IC8vIERhcmsgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDAwKSByZXR1cm4gXCIjZmYwMDU5XCI7IC8vIENyaW1zb24gcmVkXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMDApIHJldHVybiBcIiNlNjAwNGRcIjsgLy8gQnJpZ2h0IHJlZFxuICAgICAgcmV0dXJuIFwiI2NjMDA0MFwiOyAvLyBEYXJrIHJlZFxuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgZGF0ZSBhbmQgY29sb3IgYmFzZWQgb24gdGhlIHNsaWRlclxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSkge1xuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBkYXRlc1tzbGlkZXJWYWx1ZV07XG4gICAgICBjb25zdCBjdXJyZW50VG90YWxDYXNlcyA9IHRvdGFsQ2FzZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvckNhc2VzKGN1cnJlbnRUb3RhbENhc2VzKTtcbiAgICAgIFxuICAgICAgLy8gVXBkYXRlIGRhdGUgZGlzcGxheVxuICAgICAgZGF0ZURpc3BsYXkudGV4dENvbnRlbnQgPSBgRGF0ZTogJHtjdXJyZW50RGF0ZX1gO1xuICAgICAgXG4gICAgICAvLyBDaGFuZ2UgY29sb3IgYmFzZWQgb24gdG90YWwgY2FzZXNcbiAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICBpZiAoZS5wcm9wZXJ0aWVzLklTT19BMyA9PT0gXCJBRkdcIikge1xuICAgICAgICAgIHJldHVybiBjb2xvcjsgLy8gQXBwbHkgZHluYW1pYyBjb2xvciBiYXNlZCBvbiB0b3RhbCBjYXNlc1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIndoaXRlXCI7IC8vIERlZmF1bHQgY29sb3IgZm9yIG90aGVyIGNvdW50cmllc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIG9uIHNsaWRlciBpbnB1dFxuICAgIGNvbG9yU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBzbGlkZXJWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIGZpcnN0IHZhbHVlXG4gICAgdXBkYXRlRGF0ZUFuZENvbG9yKGNvbG9yU2xpZGVyLnZhbHVlKTtcbiAgfSlcbiAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGxvYWRpbmcgQWZnaGFuaXN0YW4gZGF0YTonLCBlcnJvcikpO1xuXG5cbi8vIFRocmVlLmpzIEdsb2JlIHNldHVwXG5pbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBQZXJzcGVjdGl2ZUNhbWVyYSwgQW1iaWVudExpZ2h0LCBEaXJlY3Rpb25hbExpZ2h0LCBDb2xvciwgRm9nLCBQb2ludExpZ2h0IH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjsgLy8gQ291bnRyeSBnZW9sb2NhdGlvbiBkYXRhXG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IG5hbWVzIHRvIGNvb3JkaW5hdGVzIGZyb20gZ2xvYmUgZGF0YVxuY29uc3QgY291bnRyeUNvb3JkaW5hdGVzTWFwID0ge307XG5cbi8vIEZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBjZW50cm9pZCAoZm9yIGNvdW50cmllcyB3aXRoIG11bHRpcGxlIGNvb3JkaW5hdGVzKVxuZnVuY3Rpb24gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGxhdFN1bSA9IDA7XG4gIGxldCBsbmdTdW0gPSAwO1xuICBsZXQgdG90YWxQb2ludHMgPSAwO1xuXG4gIGNvb3JkaW5hdGVzLmZvckVhY2gocG9seWdvbiA9PiB7XG4gICAgcG9seWdvbi5mb3JFYWNoKGNvb3JkID0+IHtcbiAgICAgIGxhdFN1bSArPSBjb29yZFswXTtcbiAgICAgIGxuZ1N1bSArPSBjb29yZFsxXTtcbiAgICAgIHRvdGFsUG9pbnRzICs9IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbGF0OiBsYXRTdW0gLyB0b3RhbFBvaW50cyxcbiAgICBsbmc6IGxuZ1N1bSAvIHRvdGFsUG9pbnRzLFxuICB9O1xufVxuXG4vLyBMb2FkIGNvb3JkaW5hdGVzIGRhdGEgaW50byBtYXBcbmNvdW50cmllcy5mZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICBjb25zdCBjb3VudHJ5TmFtZSA9IGZlYXR1cmUucHJvcGVydGllcy5TT1ZFUkVJR05UO1xuICBjb25zdCBjb29yZGluYXRlcyA9IGZlYXR1cmUuZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIGNvdW50cnlDb29yZGluYXRlc01hcFtjb3VudHJ5TmFtZV0gPSBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcyk7XG59KTtcblxuLy8gSW5pdGlhbGl6ZSBldmVyeXRoaW5nXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTsgLy8gQmxhY2sgYmFja2dyb3VuZFxuXG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cblxuLy8gR2xvYmUgU2V0dXBcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICBpZiAoZS5wcm9wZXJ0aWVzLklTT19BMyA9PT0gXCJBRkdcIikge1xuICAgICAgICByZXR1cm4gXCIjZmZiNmMxXCI7IC8vIFNldCBpbml0aWFsIGNvbG9yIGZvciBBZmdoYW5pc3RhblxuICAgICAgfVxuICAgICAgcmV0dXJuIFwid2hpdGVcIjtcbiAgICB9KTtcblxuICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyA5KSk7XG4gIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG4vLyBVcGRhdGUgbW91c2UgcG9zaXRpb25cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xufVxuXG4vLyBIYW5kbGUgd2luZG93IHJlc2l6ZVxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbi8vIEFuaW1hdGlvbiBsb29wXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyXG4gICAgICA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDVcbiAgICAgIDogMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImQ2N2ZhNDlhMGRmZWFhMDE5NzczXCIiXSwic291cmNlUm9vdCI6IiJ9