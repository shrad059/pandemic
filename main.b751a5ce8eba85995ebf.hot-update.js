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
      if (totalCases <= 100) return "#ffcccc"; // Very light pink (for very low cases)
      if (totalCases <= 300) return "#ff99b3"; // Light pink
      if (totalCases <= 1000) return "#ff6699"; // Medium light pink
      if (totalCases <= 3000) return "#ff3366"; // Strong pink
      if (totalCases <= 10000) return "#ff0033"; // Darker red
      if (totalCases <= 30000) return "#cc0000"; // Dark red
      if (totalCases <= 100000) return "#990000"; // Deeper red
      if (totalCases <= 300000) return "#660000"; // Very dark red
      return "#330000"; // Darkest red
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
/******/ 		__webpack_require__.h = () => "74170d8914cbf2878026"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNxQztBQUNRO0FBQ3FEO0FBQ3JCO0FBQ3pCOztBQUVwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLHFDQUFxQzs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxvQkFBb0I7QUFDbkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMLGlDQUFpQzs7QUFFakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQSxrQztBQUNBO0FBQ0EscURBQXFEOztBQUVyRCxxQ0FBcUM7QUFDckMsMEJBQTBCOztBQUUxQjtBQUNBO0FBQ0EsOENBQThDO0FBQzlDLDhDQUE4QztBQUM5QywrQ0FBK0M7QUFDL0MsK0NBQStDO0FBQy9DLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsaURBQWlEO0FBQ2pELGlEQUFpRDtBQUNqRCx1QkFBdUI7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLFlBQVk7O0FBRXJEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0Q7QUFDeEQ7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdFQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUEsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLLFdBQVc7O0FBRXpDLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDNVBBLG9EIiwiZmlsZSI6Im1haW4uYjc1MWE1Y2U4ZWJhODU5OTVlYmYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRocmVlLmpzIEdsb2JlIHNldHVwXG5pbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBQZXJzcGVjdGl2ZUNhbWVyYSwgQW1iaWVudExpZ2h0LCBEaXJlY3Rpb25hbExpZ2h0LCBDb2xvciwgRm9nLCBQb2ludExpZ2h0IH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjsgLy8gQ291bnRyeSBnZW9sb2NhdGlvbiBkYXRhXG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcblxuLy8gRmV0Y2ggYW5kIHByb2Nlc3MgQ09WSUQgZGF0YVxuZmV0Y2goJy4vZmluYWwuanNvbicpXG4gIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgLnRoZW4oZGF0YSA9PiB7XG4gICAgLy8gQ3JlYXRlIGEgbWFwcGluZyBvZiBjb3VudHJ5IGNhc2VzIHdpdGggSVNPX0EzIGFzIHRoZSBrZXlcbiAgICBjb25zdCBjb3VudHJ5Q2FzZXNNYXAgPSB7fTtcblxuICAgIC8vIFJlb3JnYW5pemUgdGhlIGRhdGEgYnkgSVNPX0EzXG4gICAgZGF0YS5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgIGNvbnN0IHsgY291bnRyeSwgSVNPX0EzLCBkYXRhOiBjb3VudHJ5RGF0YSB9ID0gZW50cnk7XG5cbiAgICAgIC8vIEluaXRpYWxpemUgdGhlIGRhdGEgc3RydWN0dXJlIGZvciB0aGlzIGNvdW50cnkgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgaWYgKCFjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXSkge1xuICAgICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXSA9IHtcbiAgICAgICAgICBjb3VudHJ5LFxuICAgICAgICAgIGRhdGVzOiBbXSxcbiAgICAgICAgICB0b3RhbENhc2VzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIHRoZSBjb3VudHJ5IGRhdGEgZW50cmllc1xuICAgICAgY291bnRyeURhdGEuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgICBjb25zdCB7IGRhdGUsIHRvdGFsX2Nhc2VzIH0gPSByZWNvcmQ7XG4gICAgICAgIGNvbnN0IHBhcnNlZFRvdGFsQ2FzZXMgPSBwYXJzZUludCh0b3RhbF9jYXNlcyk7XG5cbiAgICAgICAgLy8gT25seSBhZGQgdmFsaWQgdG90YWxfY2FzZXMgKGlmIHBhcnNpbmcgd2FzIHN1Y2Nlc3NmdWwpXG4gICAgICAgIGlmICghaXNOYU4ocGFyc2VkVG90YWxDYXNlcykpIHtcbiAgICAgICAgICBjb3VudHJ5Q2FzZXNNYXBbSVNPX0EzXS5kYXRlcy5wdXNoKGRhdGUpO1xuICAgICAgICAgIGNvdW50cnlDYXNlc01hcFtJU09fQTNdLnRvdGFsQ2FzZXMucHVzaChwYXJzZWRUb3RhbENhc2VzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhjb3VudHJ5Q2FzZXNNYXApOyAvLyBEZWJ1ZzogTG9nIHRoZSBjb3VudHJ5IGNhc2VzIG1hcCB0byBjaGVjayBpZiBkYXRhIGlzIGJlaW5nIGFkZGVkIGNvcnJlY3RseVxuXG4gICAgLy8gU2V0IHVwIHRoZSBzbGlkZXJcbiAgICBjb25zdCBjb2xvclNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29sb3JTbGlkZXJcIik7XG4gICAgY29uc3QgZGF0ZURpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRhdGVEaXNwbGF5XCIpO1xuXG4gICAgLy8gRW5zdXJlIHRoZSBzbGlkZXIgd29ya3MgZXZlbiBpZiBpdCdzIG5vdCB0aGUgZmlyc3QgY291bnRyeVxuICAgIGNvbnN0IGZpcnN0Q291bnRyeUlTT19BMyA9IE9iamVjdC5rZXlzKGNvdW50cnlDYXNlc01hcClbMF07XG4gICAgY29uc29sZS5sb2coZmlyc3RDb3VudHJ5SVNPX0EzKTsgLy8gVGhpcyBzaG91bGQgcHJpbnQgJ0FGRydcbiAgICBjb25zdCBmaXJzdENvdW50cnlEYXRhID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM107XG4gICAgY29uc29sZS5sb2coZmlyc3RDb3VudHJ5RGF0YSk7IFxuICAgIGNvbnN0IG1heFNsaWRlclZhbHVlID0gZmlyc3RDb3VudHJ5RGF0YS5kYXRlcy5sZW5ndGggLSAxO1xuICAgIGNvbnNvbGUubG9nKCdNYXggU2xpZGVyIFZhbHVlOicsIG1heFNsaWRlclZhbHVlKTsgLy8gQ2hlY2sgdGhlIG1heCB2YWx1ZSBiZWluZyBzZXRcbiAgICBcbiAgICBjb2xvclNsaWRlci5tYXggPSBtYXhTbGlkZXJWYWx1ZTsgLy8gVXBkYXRlIHNsaWRlcidzIG1heCB2YWx1ZVxuICAgIGNvbG9yU2xpZGVyLnZhbHVlID0gMDsgLy8gRGVmYXVsdCBzbGlkZXIgdmFsdWVcblxuICAgIC8vIEZ1bmN0aW9uIHRvIG1hcCB0b3RhbCBjYXNlcyB0byBhIGNvbG9yXG4gICAgZnVuY3Rpb24gZ2V0Q29sb3JGb3JDYXNlcyh0b3RhbENhc2VzKSB7XG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAxMDApIHJldHVybiBcIiNmZmNjY2NcIjsgLy8gVmVyeSBsaWdodCBwaW5rIChmb3IgdmVyeSBsb3cgY2FzZXMpXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDApIHJldHVybiBcIiNmZjk5YjNcIjsgLy8gTGlnaHQgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMCkgcmV0dXJuIFwiI2ZmNjY5OVwiOyAvLyBNZWRpdW0gbGlnaHQgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMCkgcmV0dXJuIFwiI2ZmMzM2NlwiOyAvLyBTdHJvbmcgcGlua1xuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDApIHJldHVybiBcIiNmZjAwMzNcIjsgLy8gRGFya2VyIHJlZFxuICAgICAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDApIHJldHVybiBcIiNjYzAwMDBcIjsgLy8gRGFyayByZWRcbiAgICAgIGlmICh0b3RhbENhc2VzIDw9IDEwMDAwMCkgcmV0dXJuIFwiIzk5MDAwMFwiOyAvLyBEZWVwZXIgcmVkXG4gICAgICBpZiAodG90YWxDYXNlcyA8PSAzMDAwMDApIHJldHVybiBcIiM2NjAwMDBcIjsgLy8gVmVyeSBkYXJrIHJlZFxuICAgICAgcmV0dXJuIFwiIzMzMDAwMFwiOyAvLyBEYXJrZXN0IHJlZFxuICAgIH1cblxuICAgIC8vIEZ1bmN0aW9uIHRvIHVwZGF0ZSBkYXRlIGFuZCBjb2xvciBiYXNlZCBvbiBzbGlkZXIgdmFsdWVcbiAgICBmdW5jdGlvbiB1cGRhdGVEYXRlQW5kQ29sb3Ioc2xpZGVyVmFsdWUpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gY291bnRyeUNhc2VzTWFwW2ZpcnN0Q291bnRyeUlTT19BM10uZGF0ZXNbc2xpZGVyVmFsdWVdO1xuICAgICAgZGF0ZURpc3BsYXkudGV4dENvbnRlbnQgPSBgRGF0ZTogJHtjdXJyZW50RGF0ZX1gO1xuICAgIFxuICAgICAgLy8gVXBkYXRlIGNvbG9yIGZvciBlYWNoIGNvdW50cnkgb24gdGhlIGdsb2JlXG4gICAgICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgICAgY29uc3QgY291bnRyeUlTT19BMyA9IGUucHJvcGVydGllcy5JU09fQTM7XG4gICAgICAgIFxuICAgICAgICBpZiAoY291bnRyeUNhc2VzTWFwW2NvdW50cnlJU09fQTNdKSB7XG4gICAgICAgICAgY29uc3QgY291bnRyeURhdGEgPSBjb3VudHJ5Q2FzZXNNYXBbY291bnRyeUlTT19BM107XG4gICAgICAgICAgY29uc3QgY291bnRyeVRvdGFsQ2FzZXMgPSBjb3VudHJ5RGF0YS50b3RhbENhc2VzW3NsaWRlclZhbHVlXTtcbiAgICAgICAgICBjb25zdCBjb2xvciA9IGdldENvbG9yRm9yQ2FzZXMoY291bnRyeVRvdGFsQ2FzZXMpO1xuICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcIndoaXRlXCI7IC8vIERlZmF1bHQgY29sb3IgZm9yIGNvdW50cmllcyB3aXRob3V0IGRhdGFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgY29sb3IgYW5kIGRhdGUgd2hlbiB0aGUgc2xpZGVyIHZhbHVlIGNoYW5nZXNcbiAgICBjb2xvclNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmVudCkgPT4ge1xuICAgICAgY29uc3Qgc2xpZGVyVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICBjb25zb2xlLmxvZyhcIlNsaWRlciB2YWx1ZSBjaGFuZ2VkOlwiLCBzbGlkZXJWYWx1ZSk7IC8vIERlYnVnIGxvZ1xuICAgICAgdXBkYXRlRGF0ZUFuZENvbG9yKHNsaWRlclZhbHVlKTtcbiAgICB9KTtcblxuICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgZmlyc3Qgc2xpZGVyIHZhbHVlXG4gICAgdXBkYXRlRGF0ZUFuZENvbG9yKGNvbG9yU2xpZGVyLnZhbHVlKTtcblxuICB9KVxuICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBDT1ZJRCBkYXRhOicsIGVycm9yKSk7XG5cbi8vIENyZWF0ZSBhIG1hcHBpbmcgb2YgY291bnRyeSBuYW1lcyB0byBjb29yZGluYXRlcyBmcm9tIGdsb2JlIGRhdGFcbmNvbnN0IGNvdW50cnlDb29yZGluYXRlc01hcCA9IHt9O1xuXG4vLyBGdW5jdGlvbiB0byBjYWxjdWxhdGUgY2VudHJvaWQgKGZvciBjb3VudHJpZXMgd2l0aCBtdWx0aXBsZSBjb29yZGluYXRlcylcbmZ1bmN0aW9uIGNhbGN1bGF0ZUNlbnRyb2lkKGNvb3JkaW5hdGVzKSB7XG4gIGxldCBsYXRTdW0gPSAwO1xuICBsZXQgbG5nU3VtID0gMDtcbiAgbGV0IHRvdGFsUG9pbnRzID0gMDtcblxuICBjb29yZGluYXRlcy5mb3JFYWNoKHBvbHlnb24gPT4ge1xuICAgIHBvbHlnb24uZm9yRWFjaChjb29yZCA9PiB7XG4gICAgICBsYXRTdW0gKz0gY29vcmRbMF07XG4gICAgICBsbmdTdW0gKz0gY29vcmRbMV07XG4gICAgICB0b3RhbFBvaW50cyArPSAxO1xuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGxhdDogbGF0U3VtIC8gdG90YWxQb2ludHMsXG4gICAgbG5nOiBsbmdTdW0gLyB0b3RhbFBvaW50cyxcbiAgfTtcbn1cblxuLy8gTG9hZCBjb29yZGluYXRlcyBkYXRhIGludG8gbWFwXG5jb3VudHJpZXMuZmVhdHVyZXMuZm9yRWFjaChmZWF0dXJlID0+IHtcbiAgY29uc3QgY291bnRyeUlTT19BMyA9IGZlYXR1cmUucHJvcGVydGllcy5JU09fQTM7XG4gIGNvbnN0IGNvb3JkaW5hdGVzID0gZmVhdHVyZS5nZW9tZXRyeS5jb29yZGluYXRlcztcbiAgY291bnRyeUNvb3JkaW5hdGVzTWFwW2NvdW50cnlJU09fQTNdID0gY2FsY3VsYXRlQ2VudHJvaWQoY29vcmRpbmF0ZXMpO1xufSk7XG5cbi8vIEluaXRpYWxpemUgZXZlcnl0aGluZ1xuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDAwMDAwMCk7IC8vIEJsYWNrIGJhY2tncm91bmRcblxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIEdsb2JlIFNldHVwXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgIHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLFxuICAgIGFuaW1hdGVJbjogdHJ1ZSxcbiAgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgaWYgKGUucHJvcGVydGllcy5JU09fQTMgPT09IFwiQUZHXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiI2ZmYjZjMVwiOyAvLyBTZXQgaW5pdGlhbCBjb2xvciBmb3IgQWZnaGFuaXN0YW5cbiAgICAgIH1cbiAgICAgIHJldHVybiBcIndoaXRlXCI7XG4gICAgfSk7XG5cbiAgR2xvYmUucm90YXRlWSgtTWF0aC5QSSAqICg1IC8gOSkpO1xuICBHbG9iZS5yb3RhdGVaKC1NYXRoLlBJIC8gNik7XG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gVXBkYXRlIG1vdXNlIHBvc2l0aW9uXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuLy8gSGFuZGxlIHdpbmRvdyByZXNpemVcbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG4vLyBBbmltYXRpb24gbG9vcFxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI3NDE3MGQ4OTE0Y2JmMjg3ODAyNlwiIl0sInNvdXJjZVJvb3QiOiIifQ==