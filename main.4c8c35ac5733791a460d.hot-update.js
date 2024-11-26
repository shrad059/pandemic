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
fetch('./covid_final.json')
  .then(response => response.json())
  .then(data => {
    // Create a mapping of country cases with ISO_A3 as the key
    const countryCasesMap = {};

    // Reorganize the data by ISO_A3
    data.forEach(entry => {
      const { country, date, total_cases, ISO_A3 } = entry;

      // Initialize the data structure for this country if it doesn't exist
      if (!countryCasesMap[ISO_A3]) {
        countryCasesMap[ISO_A3] = {
          country,
          dates: [],
          totalCases: [],
        };
      }

      // Add the date and the corresponding total_cases for this country
      countryCasesMap[ISO_A3].dates.push(date);
      countryCasesMap[ISO_A3].totalCases.push(parseInt(total_cases));
    });

    console.log(countryCasesMap);

    // Set up the slider
    const colorSlider = document.getElementById("colorSlider");
    const dateDisplay = document.getElementById("dateDisplay");

    // Make sure the slider works even if it's not the first country
    const firstCountryISO_A3 = Object.keys(countryCasesMap)[0];
    console.log(firstCountryISO_A3); // This should print 'AFG'
    const firstCountryData = countryCasesMap[firstCountryISO_A3];
    console.log(firstCountryData); 
    const maxSliderValue = countryCasesMap[firstCountryISO_A3].dates.length - 1;
    console.log('Max Slider Value:', maxSliderValue); // Check the max value being set
    
    colorSlider.max = maxSliderValue; // Update slider's max value
    colorSlider.value = 0; // Default slider value

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
/******/ 		__webpack_require__.h = () => "46b81c77543956bd94f6"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNxQztBQUNRO0FBQ3FEO0FBQ3JCO0FBQ3pCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFDQUFxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0Esa0M7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQscUNBQXFDO0FBQ3JDLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsK0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFDakQsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxZQUFZOztBQUVyRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QixPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0RBQXdEO0FBQ3hEO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSyxXQUFXOztBQUV6QyxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLHNDQUFHOztBQUVyQixpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQ3BQQSxvRCIsImZpbGUiOiJtYWluLjRjOGMzNWFjNTczMzc5MWE0NjBkLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaHJlZS5qcyBHbG9iZSBzZXR1cFxuaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7IC8vIENvdW50cnkgZ2VvbG9jYXRpb24gZGF0YVxuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbi8vIEZldGNoIGFuZCBwcm9jZXNzIENPVklEIGRhdGFcbmZldGNoKCcuL2NvdmlkX2ZpbmFsLmpzb24nKVxuICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gIC50aGVuKGRhdGEgPT4ge1xuICAgIC8vIENyZWF0ZSBhIG1hcHBpbmcgb2YgY291bnRyeSBjYXNlcyB3aXRoIElTT19BMyBhcyB0aGUga2V5XG4gICAgY29uc3QgY291bnRyeUNhc2VzTWFwID0ge307XG5cbiAgICAvLyBSZW9yZ2FuaXplIHRoZSBkYXRhIGJ5IElTT19BM1xuICAgIGRhdGEuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBjb25zdCB7IGNvdW50cnksIGRhdGUsIHRvdGFsX2Nhc2VzLCBJU09fQTMgfSA9IGVudHJ5O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHRoZSBkYXRhIHN0cnVjdHVyZSBmb3IgdGhpcyBjb3VudHJ5IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgIGlmICghY291bnRyeUNhc2VzTWFwW0lTT19BM10pIHtcbiAgICAgICAgY291bnRyeUNhc2VzTWFwW0lTT19BM10gPSB7XG4gICAgICAgICAgY291bnRyeSxcbiAgICAgICAgICBkYXRlczogW10sXG4gICAgICAgICAgdG90YWxDYXNlczogW10sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGUgZGF0ZSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgdG90YWxfY2FzZXMgZm9yIHRoaXMgY291bnRyeVxuICAgICAgY291bnRyeUNhc2VzTWFwW0lTT19BM10uZGF0ZXMucHVzaChkYXRlKTtcbiAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLnRvdGFsQ2FzZXMucHVzaChwYXJzZUludCh0b3RhbF9jYXNlcykpO1xuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coY291bnRyeUNhc2VzTWFwKTtcblxuICAgIC8vIFNldCB1cCB0aGUgc2xpZGVyXG4gICAgY29uc3QgY29sb3JTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG9yU2xpZGVyXCIpO1xuICAgIGNvbnN0IGRhdGVEaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlRGlzcGxheVwiKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgc2xpZGVyIHdvcmtzIGV2ZW4gaWYgaXQncyBub3QgdGhlIGZpcnN0IGNvdW50cnlcbiAgICBjb25zdCBmaXJzdENvdW50cnlJU09fQTMgPSBPYmplY3Qua2V5cyhjb3VudHJ5Q2FzZXNNYXApWzBdO1xuICAgIGNvbnNvbGUubG9nKGZpcnN0Q291bnRyeUlTT19BMyk7IC8vIFRoaXMgc2hvdWxkIHByaW50ICdBRkcnXG4gICAgY29uc3QgZmlyc3RDb3VudHJ5RGF0YSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdO1xuICAgIGNvbnNvbGUubG9nKGZpcnN0Q291bnRyeURhdGEpOyBcbiAgICBjb25zdCBtYXhTbGlkZXJWYWx1ZSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdLmRhdGVzLmxlbmd0aCAtIDE7XG4gICAgY29uc29sZS5sb2coJ01heCBTbGlkZXIgVmFsdWU6JywgbWF4U2xpZGVyVmFsdWUpOyAvLyBDaGVjayB0aGUgbWF4IHZhbHVlIGJlaW5nIHNldFxuICAgIFxuICAgIGNvbG9yU2xpZGVyLm1heCA9IG1heFNsaWRlclZhbHVlOyAvLyBVcGRhdGUgc2xpZGVyJ3MgbWF4IHZhbHVlXG4gICAgY29sb3JTbGlkZXIudmFsdWUgPSAwOyAvLyBEZWZhdWx0IHNsaWRlciB2YWx1ZVxuXG4gICAgLy8gRnVuY3Rpb24gdG8gbWFwIHRvdGFsIGNhc2VzIHRvIGEgY29sb3JcbiAgICBmdW5jdGlvbiBnZXRDb2xvckZvckNhc2VzKHRvdGFsQ2FzZXMpIHtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMCkgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBMaWdodCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDApIHJldHVybiBcIiNmZjliYjBcIjsgLy8gU29mdCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwKSByZXR1cm4gXCIjZmY4OGEwXCI7IC8vIE1lZGl1bSBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwKSByZXR1cm4gXCIjZmY2NDkwXCI7IC8vIERlZXAgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDApIHJldHVybiBcIiNmZjQ5N2ZcIjsgLy8gU3Ryb25nIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmYyNjcwXCI7IC8vIERhcmsgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDAwKSByZXR1cm4gXCIjZmYwMDU5XCI7IC8vIENyaW1zb24gcmVkXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMDApIHJldHVybiBcIiNlNjAwNGRcIjsgLy8gQnJpZ2h0IHJlZFxuICAgICAgcmV0dXJuIFwiI2NjMDA0MFwiOyAvLyBEYXJrIHJlZFxuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSBkYXRlIGFuZCBjb2xvciBiYXNlZCBvbiBzbGlkZXIgdmFsdWVcbiAgICBmdW5jdGlvbiB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM10uZGF0ZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgZGF0ZURpc3BsYXkudGV4dENvbnRlbnQgPSBgRGF0ZTogJHtjdXJyZW50RGF0ZX1gO1xuICAgIFxuICAgICAgLy8gVXBkYXRlIGNvbG9yIGZvciBlYWNoIGNvdW50cnkgb24gdGhlIGdsb2JlXG4gICAgICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgICAgY29uc3QgY291bnRyeUlTT19BMyA9IGUucHJvcGVydGllcy5JU09fQTM7XG4gICAgICAgIFxuICAgICAgICBpZiAoY291bnRyeUNhc2VzTWFwW2NvdW50cnlJU09fQTNdKSB7XG4gICAgICAgICAgY29uc3QgY291bnRyeURhdGEgPSBjb3VudHJ5Q2FzZXNNYXBbY291bnRyeUlTT19BM107XG4gICAgICAgICAgY29uc3QgY291bnRyeVRvdGFsQ2FzZXMgPSBjb3VudHJ5RGF0YS50b3RhbENhc2VzW3NsaWRlclZhbHVlXTtcbiAgICAgICAgICBjb25zdCBjb2xvciA9IGdldENvbG9yRm9yQ2FzZXMoY291bnRyeVRvdGFsQ2FzZXMpO1xuICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcIndoaXRlXCI7IC8vIERlZmF1bHQgY29sb3IgZm9yIGNvdW50cmllcyB3aXRob3V0IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgY29sb3IgYW5kIGRhdGUgd2hlbiB0aGUgc2xpZGVyIHZhbHVlIGNoYW5nZXNcbiAgICBjb2xvclNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgY29uc3Qgc2xpZGVyVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICBjb25zb2xlLmxvZyhcIlNsaWRlciB2YWx1ZSBjaGFuZ2VkOlwiLCBzbGlkZXJWYWx1ZSk7IC8vIERlYnVnIGxvZ1xuICAgICAgdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgZmlyc3Qgc2xpZGVyIHZhbHVlXG4gICAgdXBkYXRlRGF0ZUFuZENvbG9yKGNvbG9yU2xpZGVyLnZhbHVlKTtcblxuICB9KVxuICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBDT1ZJRCBkYXRhOicsIGVycm9yKSk7XG5cbi8vIENyZWF0ZSBhIG1hcHBpbmcgb2YgY291bnRyeSBuYW1lcyB0byBjb29yZGluYXRlcyBmcm9tIGdsb2JlIGRhdGFcbmNvbnN0IGNvdW50cnlDb29yZGluYXRlc01hcCA9IHt9O1xuXG4vLyBGdW5jdGlvbiB0byBjYWxjdWxhdGUgY2VudHJvaWQgKGZvciBjb3VudHJpZXMgd2l0aCBtdWx0aXBsZSBjb29yZGluYXRlcylcbmZ1bmN0aW9uIGNhbGN1bGF0ZUNlbnRyb2lkKGNvb3JkaW5hdGVzKSB7XG4gIGxldCBsYXRTdW0gPSAwO1xuICBsZXQgbG5nU3VtID0gMDtcbiAgbGV0IHRvdGFsUG9pbnRzID0gMDtcblxuICBjb29yZGluYXRlcy5mb3JFYWNoKHBvbHlnb24gPT4ge1xuICAgIHBvbHlnb24uZm9yRWFjaChjb29yZCA9PiB7XG4gICAgICBsYXRTdW0gKz0gY29vcmRbMF07XG4gICAgICBsbmdTdW0gKz0gY29vcmRbMV07XG4gICAgICB0b3RhbFBvaW50cyArPSAxO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGxhdDogbGF0U3VtIC8gdG90YWxQb2ludHMsXG4gICAgbG5nOiBsbmdTdW0gLyB0b3RhbFBvaW50cyxcbiAgfTtcbn1cblxuLy8gTG9hZCBjb29yZGluYXRlcyBkYXRhIGludG8gbWFwXG5jb3VudHJpZXMuZmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgY29uc3QgY291bnRyeUlTT19BMyA9IGZlYXR1cmUucHJvcGVydGllcy5JU09fQTM7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgY291bnRyeUNvb3JkaW5hdGVzTWFwW2NvdW50cnlJU09fQTNdID0gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpO1xufSk7XG5cbi8vIEluaXRpYWxpemUgZXZlcnl0aGluZ1xuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7IC8vIEJsYWNrIGJhY2tncm91bmRcblxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIEdsb2JlIFNldHVwXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgaWYgKGUucHJvcGVydGllcy5JU09fQTMgPT09IFwiQUZHXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBTZXQgaW5pdGlhbCBjb2xvciBmb3IgQWZnaGFuaXN0YW5cbiAgICAgIH1cbiAgICAgIHJldHVybiBcIndoaXRlXCI7XG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gVXBkYXRlIG1vdXNlIHBvc2l0aW9uXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuLy8gSGFuZGxlIHdpbmRvdyByZXNpemVcbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBBbmltYXRpb24gbG9vcFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI0NmI4MWM3NzU0Mzk1NmJkOTRmNlwiIl0sInNvdXJjZVJvb3QiOiIifQ==