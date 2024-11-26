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
  // scene.fog = new Fog(0x535ef3, 400, 2000);

  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_3__.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false; // Disable zooming entirely
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = true;
  controls.minDistance = 300;
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
  // globeMaterial.emissive = new Color(0xAAAAFF); // Light blue emissive color
  // globeMaterial.emissiveIntensity = 0.1; // Slight emissive intensity for glow effect
  
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
/******/ 		__webpack_require__.h = () => "4ced1e6143f2d54bdb2c"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNxQztBQUNRO0FBQ3FEO0FBQ3JCO0FBQ3pCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFDQUFxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQscUNBQXFDO0FBQ3JDLDBCQUEwQjs7QUFFMUI7QUFDQTtBQUNBLDhDQUE4QztBQUM5Qyw4Q0FBOEM7QUFDOUMsK0NBQStDO0FBQy9DLCtDQUErQztBQUMvQyxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFDakQsdUJBQXVCO0FBQ3ZCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTs7QUFFckQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkIsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3RUFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBLGNBQWMsd0NBQUs7QUFDbkIsZ0RBQWdEO0FBQ2hELHlCQUF5Qix3Q0FBSyxXQUFXOztBQUV6QyxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0IsZ0JBQWdCO0FBQ25EO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQixnQkFBZ0I7QUFDcEQ7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVUsZ0JBQWdCO0FBQzlDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxnREFBVTtBQUN4QjtBQUNBO0FBQ0EsR0FBRztBQUNILHFCQUFxQixnRUFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsS0FBSzs7QUFFTDtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNEJBQTRCLHdDQUFLLFdBQVc7O0FBRTVDO0FBQ0Esa0RBQWtEO0FBQ2xELDJDQUEyQzs7QUFFM0M7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQ2hRQSxvRCIsImZpbGUiOiJtYWluLjdjMTg3YmQzZGVmZGNmMTM4ODRjLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaHJlZS5qcyBHbG9iZSBzZXR1cFxuaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7IC8vIENvdW50cnkgZ2VvbG9jYXRpb24gZGF0YVxuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5cbi8vIEZldGNoIGFuZCBwcm9jZXNzIENPVklEIGRhdGFcbmZldGNoKCcuL2ZpbmFsLmpzb24nKVxuICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gIC50aGVuKGRhdGEgPT4ge1xuICAgIC8vIENyZWF0ZSBhIG1hcHBpbmcgb2YgY291bnRyeSBjYXNlcyB3aXRoIElTT19BMyBhcyB0aGUga2V5XG4gICAgY29uc3QgY291bnRyeUNhc2VzTWFwID0ge307XG5cbiAgICAvLyBSZW9yZ2FuaXplIHRoZSBkYXRhIGJ5IElTT19BM1xuICAgIGRhdGEuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICBjb25zdCB7IGNvdW50cnksIElTT19BMywgZGF0YTogY291bnRyeURhdGEgfSA9IGVudHJ5O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHRoZSBkYXRhIHN0cnVjdHVyZSBmb3IgdGhpcyBjb3VudHJ5IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICAgIGlmICghY291bnRyeUNhc2VzTWFwW0lTT19BM10pIHtcbiAgICAgICAgY291bnRyeUNhc2VzTWFwW0lTT19BM10gPSB7XG4gICAgICAgICAgY291bnRyeSxcbiAgICAgICAgICBkYXRlczogW10sXG4gICAgICAgICAgdG90YWxDYXNlczogW10sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUgY291bnRyeSBkYXRhIGVudHJpZXNcbiAgICAgIGNvdW50cnlEYXRhLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgICAgY29uc3QgeyBkYXRlLCB0b3RhbF9jYXNlcyB9ID0gcmVjb3JkO1xuICAgICAgICBjb25zdCBwYXJzZWRUb3RhbENhc2VzID0gcGFyc2VJbnQodG90YWxfY2FzZXMpO1xuXG4gICAgICAgIC8vIE9ubHkgYWRkIHZhbGlkIHRvdGFsX2Nhc2VzIChpZiBwYXJzaW5nIHdhcyBzdWNjZXNzZnVsKVxuICAgICAgICBpZiAoIWlzTmFOKHBhcnNlZFRvdGFsQ2FzZXMpKSB7XG4gICAgICAgICAgY291bnRyeUNhc2VzTWFwW0lTT19BM10uZGF0ZXMucHVzaChkYXRlKTtcbiAgICAgICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXS50b3RhbENhc2VzLnB1c2gocGFyc2VkVG90YWxDYXNlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc29sZS5sb2coY291bnRyeUNhc2VzTWFwKTsgLy8gRGVidWc6IExvZyB0aGUgY291bnRyeSBjYXNlcyBtYXAgdG8gY2hlY2sgaWYgZGF0YSBpcyBiZWluZyBhZGRlZCBjb3JyZWN0bHlcblxuICAgIC8vIFNldCB1cCB0aGUgc2xpZGVyXG4gICAgY29uc3QgY29sb3JTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG9yU2xpZGVyXCIpO1xuICAgIGNvbnN0IGRhdGVEaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlRGlzcGxheVwiKTtcblxuICAgIGNvbnN0IGZpcnN0Q291bnRyeUlTT19BMyA9IE9iamVjdC5rZXlzKGNvdW50cnlDYXNlc01hcClbMF07XG4gICAgY29uc29sZS5sb2coZmlyc3RDb3VudHJ5SVNPX0EzKTsgLy8gVGhpcyBzaG91bGQgcHJpbnQgJ0FGRydcbiAgICBjb25zdCBmaXJzdENvdW50cnlEYXRhID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM107XG4gICAgY29uc29sZS5sb2coZmlyc3RDb3VudHJ5RGF0YSk7XG4gICAgY29uc3QgbWF4U2xpZGVyVmFsdWUgPSBmaXJzdENvdW50cnlEYXRhLmRhdGVzLmxlbmd0aCAtIDE7XG4gICAgY29uc29sZS5sb2coJ01heCBTbGlkZXIgVmFsdWU6JywgbWF4U2xpZGVyVmFsdWUpOyAvLyBDaGVjayB0aGUgbWF4IHZhbHVlIGJlaW5nIHNldFxuICAgIFxuICAgIGNvbG9yU2xpZGVyLm1heCA9IG1heFNsaWRlclZhbHVlOyAvLyBVcGRhdGUgc2xpZGVyJ3MgbWF4IHZhbHVlXG4gICAgY29sb3JTbGlkZXIudmFsdWUgPSAwOyAvLyBEZWZhdWx0IHNsaWRlciB2YWx1ZVxuXG4gICAgLy8gRnVuY3Rpb24gdG8gbWFwIHRvdGFsIGNhc2VzIHRvIGEgY29sb3JcbiAgICBmdW5jdGlvbiBnZXRDb2xvckZvckNhc2VzKHRvdGFsQ2FzZXMpIHtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMCkgcmV0dXJuIFwiI2UxZjNmOFwiOyAvLyBMaWdodCBibHVlXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDApIHJldHVybiBcIiNlOWU5YmJcIjsgLy8gUGFsZSB5ZWxsb3dcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDApIHJldHVybiBcIiNlOWQ5OTRcIjsgLy8gTGlnaHQgbXVzdGFyZCB5ZWxsb3dcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDApIHJldHVybiBcIiNmZWQ5NzZcIjsgLy8gTGlnaHQgZ29sZFxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDApIHJldHVybiBcIiNmZWIyNGNcIjsgLy8gQnJpZ2h0IG9yYW5nZVxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDApIHJldHVybiBcIiNmZDhkM2RcIjsgLy8gT3JhbmdlXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMDApIHJldHVybiBcIiNmYzRmMmFcIjsgLy8gU3Ryb25nIG9yYW5nZS1yZWRcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwMCkgcmV0dXJuIFwiI2UzMWExY1wiOyAvLyBSZWRcbiAgICAgIHJldHVybiBcIiNiZDAwMjZcIjsgLy8gRGFyayByZWRcbiAgICB9XG4gICAgXG5cbiAgICAvLyBGdW5jdGlvbiB0byB1cGRhdGUgZGF0ZSBhbmQgY29sb3IgYmFzZWQgb24gc2xpZGVyIHZhbHVlXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKSB7XG4gICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdLmRhdGVzW3NsaWRlclZhbHVlXTtcbiAgICAgIGRhdGVEaXNwbGF5LnRleHRDb250ZW50ID0gYERhdGU6ICR7Y3VycmVudERhdGV9YDtcbiAgICBcbiAgICAgIC8vIFVwZGF0ZSBjb2xvciBmb3IgZWFjaCBjb3VudHJ5IG9uIHRoZSBnbG9iZVxuICAgICAgR2xvYmUuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlJU09fQTMgPSBlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXSkge1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlEYXRhID0gY291bnRyeUNhc2VzTWFwW2NvdW50cnlJU09fQTNdO1xuICAgICAgICAgIGNvbnN0IGNvdW50cnlUb3RhbENhc2VzID0gY291bnRyeURhdGEudG90YWxDYXNlc1tzbGlkZXJWYWx1ZV07XG4gICAgICAgICAgY29uc3QgY29sb3IgPSBnZXRDb2xvckZvckNhc2VzKGNvdW50cnlUb3RhbENhc2VzKTtcbiAgICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJ3aGl0ZVwiOyAvLyBEZWZhdWx0IGNvbG9yIGZvciBjb3VudHJpZXMgd2l0aG91dCBkYXRhXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIGNvbG9yIGFuZCBkYXRlIHdoZW4gdGhlIHNsaWRlciB2YWx1ZSBjaGFuZ2VzXG4gICAgY29sb3JTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHNsaWRlclZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgY29uc29sZS5sb2coXCJTbGlkZXIgdmFsdWUgY2hhbmdlZDpcIiwgc2xpZGVyVmFsdWUpOyAvLyBEZWJ1ZyBsb2dcbiAgICAgIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIGZpcnN0IHNsaWRlciB2YWx1ZVxuICAgIHVwZGF0ZURhdGVBbmRDb2xvcihjb2xvclNsaWRlci52YWx1ZSk7XG4gIH0pXG4gIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIENPVklEIGRhdGE6JywgZXJyb3IpKTtcblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IG5hbWVzIHRvIGNvb3JkaW5hdGVzIGZyb20gZ2xvYmUgZGF0YVxuY29uc3QgY291bnRyeUNvb3JkaW5hdGVzTWFwID0ge307XG5cbi8vIEZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBjZW50cm9pZCAoZm9yIGNvdW50cmllcyB3aXRoIG11bHRpcGxlIGNvb3JkaW5hdGVzKVxuZnVuY3Rpb24gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGxhdFN1bSA9IDA7XG4gIGxldCBsbmdTdW0gPSAwO1xuICBsZXQgdG90YWxQb2ludHMgPSAwO1xuXG4gIGNvb3JkaW5hdGVzLmZvckVhY2gocG9seWdvbiA9PiB7XG4gICAgcG9seWdvbi5mb3JFYWNoKGNvb3JkID0+IHtcbiAgICAgIGxhdFN1bSArPSBjb29yZFswXTtcbiAgICAgIGxuZ1N1bSArPSBjb29yZFsxXTtcbiAgICAgIHRvdGFsUG9pbnRzICs9IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbGF0OiBsYXRTdW0gLyB0b3RhbFBvaW50cyxcbiAgICBsbmc6IGxuZ1N1bSAvIHRvdGFsUG9pbnRzLFxuICB9O1xufVxuXG4vLyBMb2FkIGNvb3JkaW5hdGVzIGRhdGEgaW50byBtYXBcbmNvdW50cmllcy5mZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZmVhdHVyZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBjb3VudHJ5Q29vcmRpbmF0ZXNNYXBbY291bnRyeUlTT19BM10gPSBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcyk7XG59KTtcblxuLy8gSW5pdGlhbGl6ZSBldmVyeXRoaW5nXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgLy8gc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHg1NTU1NTUsIDAuNCkpOyAvLyBEaW1tZXIgYW1iaWVudCBsaWdodFxuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTsgLy8gQmxhY2sgYmFja2dyb3VuZFxuXG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjYpOyAvLyBSZWR1Y2VkIGludGVuc2l0eVxuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAwLjUpOyAvLyBCbHVlIGxpZ2h0IHdpdGggbG93ZXIgaW50ZW5zaXR5XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjQpOyAvLyBEaW1tZWQgcG9pbnQgbGlnaHRcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcbiAgLy8gc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5lbmFibGVab29tID0gZmFsc2U7IC8vIERpc2FibGUgem9vbWluZyBlbnRpcmVseVxuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IHRydWU7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMzAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDQwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIEdsb2JlIFNldHVwXG4vLyBHbG9iZSBTZXR1cFxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHtcbiAgICB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSxcbiAgICBhbmltYXRlSW46IHRydWUsXG4gIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICByZXR1cm4gXCJibGFja1wiOyAvLyBLZWVwIGNvdW50cnkgY29sb3JzIHdoaXRlXG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG5cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgXG4gIC8vIFNldCB0aGUgZ2xvYmUgY29sb3IgdG8gd2hpdGVcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweEZGRkZGRik7IC8vIFdoaXRlIGNvbG9yXG4gIFxuICAvLyBTZXQgdGhlIGVtaXNzaXZlIGNvbG9yIHRvIGEgc3VidGxlIGxpZ2h0IGJsdWUgdG8gbWFrZSB0aGUgZ2xvYmUgc3RhbmQgb3V0IHNsaWdodGx5XG4gIC8vIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHhBQUFBRkYpOyAvLyBMaWdodCBibHVlIGVtaXNzaXZlIGNvbG9yXG4gIC8vIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7IC8vIFNsaWdodCBlbWlzc2l2ZSBpbnRlbnNpdHkgZm9yIGdsb3cgZWZmZWN0XG4gIFxuICAvLyBSZWR1Y2Ugc2hpbmluZXNzIHRvIG1ha2UgaXQgbWF0dGVcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjE7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuXG4vLyBVcGRhdGUgbW91c2UgcG9zaXRpb25cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xufVxuXG4vLyBIYW5kbGUgd2luZG93IHJlc2l6ZVxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbi8vIEFuaW1hdGlvbiBsb29wXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyXG4gICAgICA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDVcbiAgICAgIDogMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcIjRjZWQxZTYxNDNmMmQ1NGJkYjJjXCIiXSwic291cmNlUm9vdCI6IiJ9