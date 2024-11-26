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
Object(function webpackMissingModule() { var e = new Error("Cannot find module './afghanistan.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());





// Load Afghanistan data from the JSON file


var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
let currentIndex = 0;
let playInterval;

// Function to get the total cases for Afghanistan based on the selected index
function getTotalCasesForAfghanistan(data, index) {
  const selectedData = data[index];
  return parseInt(selectedData.total_cases, 10); // Convert to number
}

// Function to map total cases to color
function getColorForAfghanistanByCases(totalCases) {
  if (totalCases <= 100) return "#ffb6c1"; // Light pink
  if (totalCases <= 300) return "#ff9bb0"; // Soft pink
  if (totalCases <= 1000) return "#ff88a0"; // Medium pink
  if (totalCases <= 3000) return "#ff6490"; // Deep pink
  if (totalCases <= 10000) return "#ff497f"; // Strong pink
  if (totalCases <= 30000) return "#ff2670"; // Dark pink
  if (totalCases <= 100000) return "#ff0059"; // Crimson red
  if (totalCases <= 300000) return "#e6004d"; // Bright red
  if (totalCases <= 1000000) return "#cc0040"; // Dark red
  return "#cc0040"; // Default to dark red
}

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

  // Setup the slider based on the Afghanistan data length
  const dateSlider = document.getElementById("dateSlider");
  dateSlider.max = Object(function webpackMissingModule() { var e = new Error("Cannot find module './afghanistan.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) - 1; // Max is the number of records in afghanistan.json
  dateSlider.addEventListener("input", updateGlobeColorFromSlider);

  // Play button functionality
  const playButton = document.getElementById("playButton");
  playButton.addEventListener("click", playTimeLapse);
}

// SECTION Globe
function initGlobe() {
  updateGlobeColorFromSlider(); // Update the globe's color on initialization

  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(true)
    .atmosphereColor("#3a228a")
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      if (e.properties.ISO_A3 === "AFG") {
        return getColorForAfghanistanByCases(getTotalCasesForAfghanistan(Object(function webpackMissingModule() { var e = new Error("Cannot find module './afghanistan.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), currentIndex));
      }
      return "white"; // Default color for other countries
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

// Update globe color based on the current slider value
function updateGlobeColorFromSlider() {
  const dateSlider = document.getElementById("dateSlider");
  currentIndex = dateSlider.value;
  Globe.hexPolygonColor((e) => {
    if (e.properties.ISO_A3 === "AFG") {
      const totalCases = getTotalCasesForAfghanistan(Object(function webpackMissingModule() { var e = new Error("Cannot find module './afghanistan.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), currentIndex);
      return getColorForAfghanistanByCases(totalCases);
    }
    return "white"; // Default color for other countries
  });
  renderer.render(scene, camera);
}

// Play time lapse animation
function playTimeLapse() {
  if (playInterval) clearInterval(playInterval); // Clear any previous interval

  playInterval = setInterval(() => {
    const dateSlider = document.getElementById("dateSlider");
    if (currentIndex < Object(function webpackMissingModule() { var e = new Error("Cannot find module './afghanistan.json'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) - 1) {
      currentIndex++;
      dateSlider.value = currentIndex;
      updateGlobeColorFromSlider();
    } else {
      clearInterval(playInterval);
    }
  }, 500); // Adjust interval time to control speed of time lapse
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
/******/ 		__webpack_require__.h = () => "a44cff518953dc8c42ad"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDUTtBQVE5QjtBQUM4RDs7QUFFN0U7QUFDaUQ7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsMENBQTBDO0FBQzFDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsNENBQTRDO0FBQzVDLDRDQUE0QztBQUM1Qyw2Q0FBNkM7QUFDN0MsNkNBQTZDO0FBQzdDLDhDQUE4QztBQUM5QyxtQkFBbUI7QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLHdDQUFLO0FBQ25CLGdCQUFnQiwrQ0FBWTtBQUM1Qix5QkFBeUIsd0NBQUssV0FBVzs7QUFFekMsZUFBZSxvREFBaUI7QUFDaEM7QUFDQTs7QUFFQSxtQkFBbUIsbURBQWdCO0FBQ25DO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQjtBQUNwQztBQUNBOztBQUVBLG9CQUFvQiw2Q0FBVTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixzQ0FBRzs7QUFFckIsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixpSkFBc0IsS0FBSztBQUM5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0JBQStCOztBQUUvQixjQUFjLGdEQUFVO0FBQ3hCO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlFQUF5RSxpSkFBZTtBQUN4RjtBQUNBLHFCQUFxQjtBQUNyQixLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix3Q0FBSztBQUNqQywrQkFBK0Isd0NBQUs7QUFDcEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsaUpBQWU7QUFDcEU7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQixHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdEOztBQUVoRDtBQUNBO0FBQ0EsdUJBQXVCLGlKQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUcsT0FBTztBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0NyTUEsb0QiLCJmaWxlIjoibWFpbi5kNDliN2NmNmRlZDE5YTM3Njk0ZS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHtcbiAgUGVyc3BlY3RpdmVDYW1lcmEsXG4gIEFtYmllbnRMaWdodCxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgQ29sb3IsXG4gIEZvZyxcbiAgUG9pbnRMaWdodCxcbn0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5cbi8vIExvYWQgQWZnaGFuaXN0YW4gZGF0YSBmcm9tIHRoZSBKU09OIGZpbGVcbmltcG9ydCBhZmdoYW5pc3RhbkRhdGEgZnJvbSAnLi9hZmdoYW5pc3Rhbi5qc29uJztcblxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwO1xubGV0IG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGN1cnJlbnRJbmRleCA9IDA7XG5sZXQgcGxheUludGVydmFsO1xuXG4vLyBGdW5jdGlvbiB0byBnZXQgdGhlIHRvdGFsIGNhc2VzIGZvciBBZmdoYW5pc3RhbiBiYXNlZCBvbiB0aGUgc2VsZWN0ZWQgaW5kZXhcbmZ1bmN0aW9uIGdldFRvdGFsQ2FzZXNGb3JBZmdoYW5pc3RhbihkYXRhLCBpbmRleCkge1xuICBjb25zdCBzZWxlY3RlZERhdGEgPSBkYXRhW2luZGV4XTtcbiAgcmV0dXJuIHBhcnNlSW50KHNlbGVjdGVkRGF0YS50b3RhbF9jYXNlcywgMTApOyAvLyBDb252ZXJ0IHRvIG51bWJlclxufVxuXG4vLyBGdW5jdGlvbiB0byBtYXAgdG90YWwgY2FzZXMgdG8gY29sb3JcbmZ1bmN0aW9uIGdldENvbG9yRm9yQWZnaGFuaXN0YW5CeUNhc2VzKHRvdGFsQ2FzZXMpIHtcbiAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwKSByZXR1cm4gXCIjZmZiNmMxXCI7IC8vIExpZ2h0IHBpbmtcbiAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwKSByZXR1cm4gXCIjZmY5YmIwXCI7IC8vIFNvZnQgcGlua1xuICBpZiAodG90YWxDYXNlcyA8PSAxMDAwKSByZXR1cm4gXCIjZmY4OGEwXCI7IC8vIE1lZGl1bSBwaW5rXG4gIGlmICh0b3RhbENhc2VzIDw9IDMwMDApIHJldHVybiBcIiNmZjY0OTBcIjsgLy8gRGVlcCBwaW5rXG4gIGlmICh0b3RhbENhc2VzIDw9IDEwMDAwKSByZXR1cm4gXCIjZmY0OTdmXCI7IC8vIFN0cm9uZyBwaW5rXG4gIGlmICh0b3RhbENhc2VzIDw9IDMwMDAwKSByZXR1cm4gXCIjZmYyNjcwXCI7IC8vIERhcmsgcGlua1xuICBpZiAodG90YWxDYXNlcyA8PSAxMDAwMDApIHJldHVybiBcIiNmZjAwNTlcIjsgLy8gQ3JpbXNvbiByZWRcbiAgaWYgKHRvdGFsQ2FzZXMgPD0gMzAwMDAwKSByZXR1cm4gXCIjZTYwMDRkXCI7IC8vIEJyaWdodCByZWRcbiAgaWYgKHRvdGFsQ2FzZXMgPD0gMTAwMDAwMCkgcmV0dXJuIFwiI2NjMDA0MFwiOyAvLyBEYXJrIHJlZFxuICByZXR1cm4gXCIjY2MwMDQwXCI7IC8vIERlZmF1bHQgdG8gZGFyayByZWRcbn1cblxuLy8gSW5pdGlhbGl6ZSBldmVyeXRoaW5nXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbm9uV2luZG93UmVzaXplKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDAwMDAwKTsgLy8gQmxhY2sgYmFja2dyb3VuZFxuXG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcblxuICAvLyBTZXR1cCB0aGUgc2xpZGVyIGJhc2VkIG9uIHRoZSBBZmdoYW5pc3RhbiBkYXRhIGxlbmd0aFxuICBjb25zdCBkYXRlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlU2xpZGVyXCIpO1xuICBkYXRlU2xpZGVyLm1heCA9IGFmZ2hhbmlzdGFuRGF0YS5sZW5ndGggLSAxOyAvLyBNYXggaXMgdGhlIG51bWJlciBvZiByZWNvcmRzIGluIGFmZ2hhbmlzdGFuLmpzb25cbiAgZGF0ZVNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgdXBkYXRlR2xvYmVDb2xvckZyb21TbGlkZXIpO1xuXG4gIC8vIFBsYXkgYnV0dG9uIGZ1bmN0aW9uYWxpdHlcbiAgY29uc3QgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxheUJ1dHRvblwiKTtcbiAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxheVRpbWVMYXBzZSk7XG59XG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgdXBkYXRlR2xvYmVDb2xvckZyb21TbGlkZXIoKTsgLy8gVXBkYXRlIHRoZSBnbG9iZSdzIGNvbG9yIG9uIGluaXRpYWxpemF0aW9uXG5cbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICBpZiAoZS5wcm9wZXJ0aWVzLklTT19BMyA9PT0gXCJBRkdcIikge1xuICAgICAgICByZXR1cm4gZ2V0Q29sb3JGb3JBZmdoYW5pc3RhbkJ5Q2FzZXMoZ2V0VG90YWxDYXNlc0ZvckFmZ2hhbmlzdGFuKGFmZ2hhbmlzdGFuRGF0YSwgY3VycmVudEluZGV4KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJ3aGl0ZVwiOyAvLyBEZWZhdWx0IGNvbG9yIGZvciBvdGhlciBjb3VudHJpZXNcbiAgICB9KTtcblxuICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyA5KSk7XG4gIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG4vLyBVcGRhdGUgbW91c2UgcG9zaXRpb25cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xufVxuXG4vLyBIYW5kbGUgd2luZG93IHJlc2l6ZVxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbi8vIFVwZGF0ZSBnbG9iZSBjb2xvciBiYXNlZCBvbiB0aGUgY3VycmVudCBzbGlkZXIgdmFsdWVcbmZ1bmN0aW9uIHVwZGF0ZUdsb2JlQ29sb3JGcm9tU2xpZGVyKCkge1xuICBjb25zdCBkYXRlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlU2xpZGVyXCIpO1xuICBjdXJyZW50SW5kZXggPSBkYXRlU2xpZGVyLnZhbHVlO1xuICBHbG9iZS5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICBpZiAoZS5wcm9wZXJ0aWVzLklTT19BMyA9PT0gXCJBRkdcIikge1xuICAgICAgY29uc3QgdG90YWxDYXNlcyA9IGdldFRvdGFsQ2FzZXNGb3JBZmdoYW5pc3RhbihhZmdoYW5pc3RhbkRhdGEsIGN1cnJlbnRJbmRleCk7XG4gICAgICByZXR1cm4gZ2V0Q29sb3JGb3JBZmdoYW5pc3RhbkJ5Q2FzZXModG90YWxDYXNlcyk7XG4gICAgfVxuICAgIHJldHVybiBcIndoaXRlXCI7IC8vIERlZmF1bHQgY29sb3IgZm9yIG90aGVyIGNvdW50cmllc1xuICB9KTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xufVxuXG4vLyBQbGF5IHRpbWUgbGFwc2UgYW5pbWF0aW9uXG5mdW5jdGlvbiBwbGF5VGltZUxhcHNlKCkge1xuICBpZiAocGxheUludGVydmFsKSBjbGVhckludGVydmFsKHBsYXlJbnRlcnZhbCk7IC8vIENsZWFyIGFueSBwcmV2aW91cyBpbnRlcnZhbFxuXG4gIHBsYXlJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICBjb25zdCBkYXRlU2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlU2xpZGVyXCIpO1xuICAgIGlmIChjdXJyZW50SW5kZXggPCBhZmdoYW5pc3RhbkRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgY3VycmVudEluZGV4Kys7XG4gICAgICBkYXRlU2xpZGVyLnZhbHVlID0gY3VycmVudEluZGV4O1xuICAgICAgdXBkYXRlR2xvYmVDb2xvckZyb21TbGlkZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xlYXJJbnRlcnZhbChwbGF5SW50ZXJ2YWwpO1xuICAgIH1cbiAgfSwgNTAwKTsgLy8gQWRqdXN0IGludGVydmFsIHRpbWUgdG8gY29udHJvbCBzcGVlZCBvZiB0aW1lIGxhcHNlXG59XG5cbi8vIEFuaW1hdGlvbiBsb29wXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPVxuICAgIE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyXG4gICAgICA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDVcbiAgICAgIDogMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImE0NGNmZjUxODk1M2RjOGM0MmFkXCIiXSwic291cmNlUm9vdCI6IiJ9