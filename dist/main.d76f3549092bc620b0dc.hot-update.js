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

    // Set up the slider
    const colorSlider = document.getElementById("colorSlider");
    const dateDisplay = document.getElementById("dateDisplay");

    // Make sure the slider works even if it's not the first country
    const firstCountryISO_A3 = Object.keys(countryCasesMap)[0];
    console.log(countryCasesMap[firstCountryISO_A3]); // Check the structure of the data
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
/******/ 		__webpack_require__.h = () => "4d56b5a791679384aebc"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBOztBQUVBO0FBQ3FDO0FBQ1E7QUFDcUQ7QUFDckI7QUFDekI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWEscUNBQXFDOztBQUVsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQSxxREFBcUQ7O0FBRXJELHFDQUFxQztBQUNyQywwQkFBMEI7O0FBRTFCO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMsOENBQThDO0FBQzlDLCtDQUErQztBQUMvQywrQ0FBK0M7QUFDL0MsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCxpREFBaUQ7QUFDakQsaURBQWlEO0FBQ2pELHVCQUF1QjtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsWUFBWTs7QUFFckQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkIsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RDtBQUN4RDtBQUNBLEtBQUs7OztBQUdMO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLHdDQUFLO0FBQ25CLGdCQUFnQiwrQ0FBWTtBQUM1Qix5QkFBeUIsd0NBQUssV0FBVzs7QUFFekMsZUFBZSxvREFBaUI7QUFDaEM7QUFDQTs7QUFFQSxtQkFBbUIsbURBQWdCO0FBQ25DO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQjtBQUNwQztBQUNBOztBQUVBLG9CQUFvQiw2Q0FBVTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixzQ0FBRzs7QUFFckIsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxnREFBVTtBQUN4QjtBQUNBO0FBQ0EsR0FBRztBQUNILHFCQUFxQixnRUFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NqUEEsb0QiLCJmaWxlIjoibWFpbi5kNzZmMzU0OTA5MmJjNjIwYjBkYy5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTG9hZCBBZmdoYW5pc3RhbiBkYXRhIChKU09OKVxuLy8gTG9hZCBBZmdoYW5pc3RhbiBkYXRhIChKU09OKVxuXG4vLyBUaHJlZS5qcyBHbG9iZSBzZXR1cFxuaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7IC8vIENvdW50cnkgZ2VvbG9jYXRpb24gZGF0YVxuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDA7XG5sZXQgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5mZXRjaCgnLi9jb3ZpZF9maW5hbC5qc29uJylcbiAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAudGhlbihkYXRhID0+IHtcbiAgICAvLyBDcmVhdGUgYSBtYXBwaW5nIG9mIGNvdW50cnkgY2FzZXMgd2l0aCBJU09fQTMgYXMgdGhlIGtleVxuICAgIGNvbnN0IGNvdW50cnlDYXNlc01hcCA9IHt9O1xuXG4gICAgLy8gUmVvcmdhbml6ZSB0aGUgZGF0YSBieSBJU09fQTNcbiAgICBkYXRhLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgY29uc3QgeyBjb3VudHJ5LCBkYXRlLCB0b3RhbF9jYXNlcywgSVNPX0EzIH0gPSBlbnRyeTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGF0YSBzdHJ1Y3R1cmUgZm9yIHRoaXMgY291bnRyeSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICBpZiAoIWNvdW50cnlDYXNlc01hcFtJU09fQTNdKSB7XG4gICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdID0ge1xuICAgICAgICAgIGNvdW50cnksXG4gICAgICAgICAgZGF0ZXM6IFtdLFxuICAgICAgICAgIHRvdGFsQ2FzZXM6IFtdLFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIGRhdGUgYW5kIHRoZSBjb3JyZXNwb25kaW5nIHRvdGFsX2Nhc2VzIGZvciB0aGlzIGNvdW50cnlcbiAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLmRhdGVzLnB1c2goZGF0ZSk7XG4gICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXS50b3RhbENhc2VzLnB1c2gocGFyc2VJbnQodG90YWxfY2FzZXMpKTtcbiAgICB9KTtcblxuICAgIC8vIFNldCB1cCB0aGUgc2xpZGVyXG4gICAgY29uc3QgY29sb3JTbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG9yU2xpZGVyXCIpO1xuICAgIGNvbnN0IGRhdGVEaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlRGlzcGxheVwiKTtcblxuICAgIC8vIE1ha2Ugc3VyZSB0aGUgc2xpZGVyIHdvcmtzIGV2ZW4gaWYgaXQncyBub3QgdGhlIGZpcnN0IGNvdW50cnlcbiAgICBjb25zdCBmaXJzdENvdW50cnlJU09fQTMgPSBPYmplY3Qua2V5cyhjb3VudHJ5Q2FzZXNNYXApWzBdO1xuICAgIGNvbnNvbGUubG9nKGNvdW50cnlDYXNlc01hcFtmaXJzdENvdW50cnlJU09fQTNdKTsgLy8gQ2hlY2sgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZGF0YVxuICAgIGNvbnN0IG1heFNsaWRlclZhbHVlID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM10uZGF0ZXMubGVuZ3RoIC0gMTtcbiAgICBjb25zb2xlLmxvZygnTWF4IFNsaWRlciBWYWx1ZTonLCBtYXhTbGlkZXJWYWx1ZSk7IC8vIENoZWNrIHRoZSBtYXggdmFsdWUgYmVpbmcgc2V0XG4gICAgXG4gICAgY29sb3JTbGlkZXIubWF4ID0gbWF4U2xpZGVyVmFsdWU7IC8vIFVwZGF0ZSBzbGlkZXIncyBtYXggdmFsdWVcbiAgICBjb2xvclNsaWRlci52YWx1ZSA9IDA7IC8vIERlZmF1bHQgc2xpZGVyIHZhbHVlXG5cbiAgICAvLyBGdW5jdGlvbiB0byBtYXAgdG90YWwgY2FzZXMgdG8gYSBjb2xvclxuICAgIGZ1bmN0aW9uIGdldENvbG9yRm9yQ2FzZXModG90YWxDYXNlcykge1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwKSByZXR1cm4gXCIjZmZiNmMxXCI7IC8vIExpZ2h0IHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMCkgcmV0dXJuIFwiI2ZmOWJiMFwiOyAvLyBTb2Z0IHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDApIHJldHVybiBcIiNmZjg4YTBcIjsgLy8gTWVkaXVtIHBpbmtcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDApIHJldHVybiBcIiNmZjY0OTBcIjsgLy8gRGVlcCBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMCkgcmV0dXJuIFwiI2ZmNDk3ZlwiOyAvLyBTdHJvbmcgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDApIHJldHVybiBcIiNmZjI2NzBcIjsgLy8gRGFyayBwaW5rXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMDApIHJldHVybiBcIiNmZjAwNTlcIjsgLy8gQ3JpbXNvbiByZWRcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwMCkgcmV0dXJuIFwiI2U2MDA0ZFwiOyAvLyBCcmlnaHQgcmVkXG4gICAgICByZXR1cm4gXCIjY2MwMDQwXCI7IC8vIERhcmsgcmVkXG4gICAgfVxuXG4gICAgLy8gRnVuY3Rpb24gdG8gdXBkYXRlIGRhdGUgYW5kIGNvbG9yIGJhc2VkIG9uIHNsaWRlciB2YWx1ZVxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGVBbmRDb2xvcihzbGlkZXJWYWx1ZSkge1xuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBjb3VudHJ5Q2FzZXNNYXBbZmlyc3RDb3VudHJ5SVNPX0EzXS5kYXRlc1tzbGlkZXJWYWx1ZV07XG4gICAgICBkYXRlRGlzcGxheS50ZXh0Q29udGVudCA9IGBEYXRlOiAke2N1cnJlbnREYXRlfWA7XG4gICAgXG4gICAgICAvLyBVcGRhdGUgY29sb3IgZm9yIGVhY2ggY291bnRyeSBvbiB0aGUgZ2xvYmVcbiAgICAgIEdsb2JlLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICAgICAgXG4gICAgICAgIGlmIChjb3VudHJ5Q2FzZXNNYXBbY291bnRyeUlTT19BM10pIHtcbiAgICAgICAgICBjb25zdCBjb3VudHJ5RGF0YSA9IGNvdW50cnlDYXNlc01hcFtjb3VudHJ5SVNPX0EzXTtcbiAgICAgICAgICBjb25zdCBjb3VudHJ5VG90YWxDYXNlcyA9IGNvdW50cnlEYXRhLnRvdGFsQ2FzZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgICAgIGNvbnN0IGNvbG9yID0gZ2V0Q29sb3JGb3JDYXNlcyhjb3VudHJ5VG90YWxDYXNlcyk7XG4gICAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwid2hpdGVcIjsgLy8gRGVmYXVsdCBjb2xvciBmb3IgY291bnRyaWVzIHdpdGhvdXQgZGF0YVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBjb2xvciBhbmQgZGF0ZSB3aGVuIHRoZSBzbGlkZXIgdmFsdWUgY2hhbmdlc1xuICAgIGNvbG9yU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBzbGlkZXJWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIGNvbnNvbGUubG9nKFwiU2xpZGVyIHZhbHVlIGNoYW5nZWQ6XCIsIHNsaWRlclZhbHVlKTsgLy8gRGVidWcgbG9nXG4gICAgICB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpO1xuICAgIH0pO1xuICAgIFxuXG4gICAgLy8gSW5pdGlhbGl6ZSB3aXRoIHRoZSBmaXJzdCBzbGlkZXIgdmFsdWVcbiAgICB1cGRhdGVEYXRlQW5kQ29sb3IoY29sb3JTbGlkZXIudmFsdWUpO1xuXG4gIH0pXG4gIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmVycm9yKCdFcnJvciBsb2FkaW5nIENPVklEIGRhdGE6JywgZXJyb3IpKTtcblxuLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IG5hbWVzIHRvIGNvb3JkaW5hdGVzIGZyb20gZ2xvYmUgZGF0YVxuY29uc3QgY291bnRyeUNvb3JkaW5hdGVzTWFwID0ge307XG5cbi8vIEZ1bmN0aW9uIHRvIGNhbGN1bGF0ZSBjZW50cm9pZCAoZm9yIGNvdW50cmllcyB3aXRoIG11bHRpcGxlIGNvb3JkaW5hdGVzKVxuZnVuY3Rpb24gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpIHtcbiAgbGV0IGxhdFN1bSA9IDA7XG4gIGxldCBsbmdTdW0gPSAwO1xuICBsZXQgdG90YWxQb2ludHMgPSAwO1xuXG4gIGNvb3JkaW5hdGVzLmZvckVhY2gocG9seWdvbiA9PiB7XG4gICAgcG9seWdvbi5mb3JFYWNoKGNvb3JkID0+IHtcbiAgICAgIGxhdFN1bSArPSBjb29yZFswXTtcbiAgICAgIGxuZ1N1bSArPSBjb29yZFsxXTtcbiAgICAgIHRvdGFsUG9pbnRzICs9IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbGF0OiBsYXRTdW0gLyB0b3RhbFBvaW50cyxcbiAgICBsbmc6IGxuZ1N1bSAvIHRvdGFsUG9pbnRzLFxuICB9O1xufVxuXG4vLyBMb2FkIGNvb3JkaW5hdGVzIGRhdGEgaW50byBtYXBcbmNvdW50cmllcy5mZWF0dXJlcy5mb3JFYWNoKGZlYXR1cmUgPT4ge1xuICBjb25zdCBjb3VudHJ5SVNPX0EzID0gZmVhdHVyZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgY29uc3QgY29vcmRpbmF0ZXMgPSBmZWF0dXJlLmdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBjb3VudHJ5Q29vcmRpbmF0ZXNNYXBbY291bnRyeUlTT19BM10gPSBjYWxjdWxhdGVDZW50cm9pZChjb29yZGluYXRlcyk7XG59KTtcbi8vIEluaXRpYWxpemUgZXZlcnl0aGluZ1xuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7IC8vIEJsYWNrIGJhY2tncm91bmRcblxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIEdsb2JlIFNldHVwXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgaWYgKGUucHJvcGVydGllcy5JU09fQTMgPT09IFwiQUZHXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBTZXQgaW5pdGlhbCBjb2xvciBmb3IgQWZnaGFuaXN0YW5cbiAgICAgIH1cbiAgICAgIHJldHVybiBcIndoaXRlXCI7XG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gVXBkYXRlIG1vdXNlIHBvc2l0aW9uXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuLy8gSGFuZGxlIHdpbmRvdyByZXNpemVcbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBBbmltYXRpb24gbG9vcFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI0ZDU2YjVhNzkxNjc5Mzg0YWViY1wiIl0sInNvdXJjZVJvb3QiOiIifQ==