self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");



 // GeoJSON data for countries
 // Travel data (replace or omit if unnecessary)

var renderer, camera, scene, controls;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
let covidData = {}; // Store COVID case data for countries

init();
initGlobe();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  // Initialize renderer
  renderer = new three__WEBPACK_IMPORTED_MODULE_3__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new three__WEBPACK_IMPORTED_MODULE_3__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_3__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x040d21);

  // Initialize camera, light
  camera = new three__WEBPACK_IMPORTED_MODULE_3__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_3__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);

  // Additional effects
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_3__.Fog(0x535ef3, 400, 2000);

  // Initialize controls
  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_4__.OrbitControls(camera, renderer.domElement);
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

// SECTION Globe
function initGlobe() {
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({ waitForGlobeReady: true, animateIn: true })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(true)
    .atmosphereColor("#3a228a")
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      const countryCode = e.properties.ISO_A3;
      const covidInfo = covidData[countryCode];

      if (covidInfo) {
        const totalCases = covidInfo.total_cases;
        const maxCases = 10000000;
        const intensity = Math.min(totalCases / maxCases, 1);
        return `rgba(255, ${255 - intensity * 255}, ${255 - intensity * 255}, 1)`;
      } else {
        return "rgba(255,255,255, 0.7)";
      }
    });

  // setTimeout(() => {
  //   Globe.arcsData(travelHistory.flights)
  //     .arcColor((e) => (e.status ? "#9cff00" : "#FF4000"))
  //     .arcAltitude((e) => e.arcAlt)
  //     .arcStroke((e) => (e.status ? 0.5 : 0.3))
  //     .arcDashLength(0.9)
  //     .arcDashGap(4)
  //     .arcDashAnimateTime(1000);
  // }, 1000);

  setTimeout(() => {
    Globe.pointsData(Object.values(covidData))
      .pointAltitude((e) => Math.min(e.total_cases / 1000000, 0.5))
      .pointRadius((e) => Math.min(e.new_cases / 100000, 0.1))
      .pointColor((e) => `rgba(255, ${255 - e.new_cases / 1000}, ${255 - e.new_cases / 1000}, 1)`)
      .pointsMerge(true)
      .pointsTransitionDuration(2000);
  }, 1500);

  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x3a228a);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

  scene.add(Globe);
}
function appendLog(message) {
  const logContent = document.getElementById("logContent");
  if (logContent) {
    logContent.innerHTML += `<div>${message}</div>`;
  }
}

async function loadCovidData() {
  const response = await fetch("./output.geojson"); // Replace with the correct path to your file
  const geojson = await response.json();

  geojson.features.forEach((feature) => {
    const countryCode = feature.properties.ISO_A3;
    const covidInfo = {
      total_cases: feature.properties.total_cases,
      new_cases: feature.properties.new_cases,
    };

    covidData[countryCode] = covidInfo;

    // Log the data on the screen
    appendLog(`Country: ${countryCode}, Total Cases: ${covidInfo.total_cases}, New Cases: ${covidInfo.new_cases}`);
  });

  appendLog("All COVID data loaded.");
  console.log("All COVID data loaded:", covidData); // Also log to console for future use
}

// Animate COVID data
function animateCovidData() {
  setInterval(() => {
    const updatedCovidData = Object.values(covidData).map((data) => ({
      ...data,
      new_cases: Math.random() * 100000, // Example update for animation
    }));

    Globe.pointsData(updatedCovidData);
  }, 5000); // Update every 5 seconds
}

// Load COVID data and initialize
loadCovidData().then(() => {
  initGlobe();
  animateCovidData();
});

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  camera.position.x += (Math.abs(mouseX) <= windowHalfX / 2 ? (mouseX / 2 - camera.position.x) * 0.005 : 0);
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
/******/ 		__webpack_require__.h = () => "bd694bd2f1c56dc934eb"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ21GO0FBQzNDO0FBQ3pCO0FBQ0E7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVUsRUFBRSwyQ0FBMkM7QUFDckUscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHNCQUFzQixJQUFJLHNCQUFzQjtBQUM1RSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLElBQUkseUJBQXlCO0FBQzVGO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBOztBQUVBO0FBQ0EsbURBQW1EO0FBQ25EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDBCQUEwQixZQUFZLGlCQUFpQixzQkFBc0IsZUFBZSxvQkFBb0I7QUFDaEgsR0FBRzs7QUFFSDtBQUNBLG1EQUFtRDtBQUNuRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRyxRQUFRO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDOUxBLG9EIiwiZmlsZSI6Im1haW4uMDJmMWY3ZTAyNjc4NTAwNDYwNGMuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUsIFBlcnNwZWN0aXZlQ2FtZXJhLCBBbWJpZW50TGlnaHQsIERpcmVjdGlvbmFsTGlnaHQsIENvbG9yLCBGb2csIFBvaW50TGlnaHQgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHMuanNcIjtcbmltcG9ydCBjb3VudHJpZXMgZnJvbSBcIi4vZmlsZXMvZ2xvYmUtZGF0YS1taW4uanNvblwiOyAvLyBHZW9KU09OIGRhdGEgZm9yIGNvdW50cmllc1xuaW1wb3J0IHRyYXZlbEhpc3RvcnkgZnJvbSBcIi4vZmlsZXMvbXktZmxpZ2h0cy5qc29uXCI7IC8vIFRyYXZlbCBkYXRhIChyZXBsYWNlIG9yIG9taXQgaWYgdW5uZWNlc3NhcnkpXG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMCwgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5sZXQgY292aWREYXRhID0ge307IC8vIFN0b3JlIENPVklEIGNhc2UgZGF0YSBmb3IgY291bnRyaWVzXG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIEluaXRpYWxpemUgcmVuZGVyZXJcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cblxuLy8gU0VDVElPTiBHbG9iZVxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHsgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsIGFuaW1hdGVJbjogdHJ1ZSB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICBjb25zdCBjb3VudHJ5Q29kZSA9IGUucHJvcGVydGllcy5JU09fQTM7XG4gICAgICBjb25zdCBjb3ZpZEluZm8gPSBjb3ZpZERhdGFbY291bnRyeUNvZGVdO1xuXG4gICAgICBpZiAoY292aWRJbmZvKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsQ2FzZXMgPSBjb3ZpZEluZm8udG90YWxfY2FzZXM7XG4gICAgICAgIGNvbnN0IG1heENhc2VzID0gMTAwMDAwMDA7XG4gICAgICAgIGNvbnN0IGludGVuc2l0eSA9IE1hdGgubWluKHRvdGFsQ2FzZXMgLyBtYXhDYXNlcywgMSk7XG4gICAgICAgIHJldHVybiBgcmdiYSgyNTUsICR7MjU1IC0gaW50ZW5zaXR5ICogMjU1fSwgJHsyNTUgLSBpbnRlbnNpdHkgKiAyNTV9LCAxKWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAwLjcpXCI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgLy8gc2V0VGltZW91dCgoKSA9PiB7XG4gIC8vICAgR2xvYmUuYXJjc0RhdGEodHJhdmVsSGlzdG9yeS5mbGlnaHRzKVxuICAvLyAgICAgLmFyY0NvbG9yKChlKSA9PiAoZS5zdGF0dXMgPyBcIiM5Y2ZmMDBcIiA6IFwiI0ZGNDAwMFwiKSlcbiAgLy8gICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4gZS5hcmNBbHQpXG4gIC8vICAgICAuYXJjU3Ryb2tlKChlKSA9PiAoZS5zdGF0dXMgPyAwLjUgOiAwLjMpKVxuICAvLyAgICAgLmFyY0Rhc2hMZW5ndGgoMC45KVxuICAvLyAgICAgLmFyY0Rhc2hHYXAoNClcbiAgLy8gICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMCk7XG4gIC8vIH0sIDEwMDApO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLnBvaW50c0RhdGEoT2JqZWN0LnZhbHVlcyhjb3ZpZERhdGEpKVxuICAgICAgLnBvaW50QWx0aXR1ZGUoKGUpID0+IE1hdGgubWluKGUudG90YWxfY2FzZXMgLyAxMDAwMDAwLCAwLjUpKVxuICAgICAgLnBvaW50UmFkaXVzKChlKSA9PiBNYXRoLm1pbihlLm5ld19jYXNlcyAvIDEwMDAwMCwgMC4xKSlcbiAgICAgIC5wb2ludENvbG9yKChlKSA9PiBgcmdiYSgyNTUsICR7MjU1IC0gZS5uZXdfY2FzZXMgLyAxMDAwfSwgJHsyNTUgLSBlLm5ld19jYXNlcyAvIDEwMDB9LCAxKWApXG4gICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgIC5wb2ludHNUcmFuc2l0aW9uRHVyYXRpb24oMjAwMCk7XG4gIH0sIDE1MDApO1xuXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cbmZ1bmN0aW9uIGFwcGVuZExvZyhtZXNzYWdlKSB7XG4gIGNvbnN0IGxvZ0NvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ0NvbnRlbnRcIik7XG4gIGlmIChsb2dDb250ZW50KSB7XG4gICAgbG9nQ29udGVudC5pbm5lckhUTUwgKz0gYDxkaXY+JHttZXNzYWdlfTwvZGl2PmA7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZENvdmlkRGF0YSgpIHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi4vb3V0cHV0Lmdlb2pzb25cIik7IC8vIFJlcGxhY2Ugd2l0aCB0aGUgY29ycmVjdCBwYXRoIHRvIHlvdXIgZmlsZVxuICBjb25zdCBnZW9qc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gIGdlb2pzb24uZmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgIGNvbnN0IGNvdW50cnlDb2RlID0gZmVhdHVyZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICBjb25zdCBjb3ZpZEluZm8gPSB7XG4gICAgICB0b3RhbF9jYXNlczogZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2Nhc2VzLFxuICAgICAgbmV3X2Nhc2VzOiBmZWF0dXJlLnByb3BlcnRpZXMubmV3X2Nhc2VzLFxuICAgIH07XG5cbiAgICBjb3ZpZERhdGFbY291bnRyeUNvZGVdID0gY292aWRJbmZvO1xuXG4gICAgLy8gTG9nIHRoZSBkYXRhIG9uIHRoZSBzY3JlZW5cbiAgICBhcHBlbmRMb2coYENvdW50cnk6ICR7Y291bnRyeUNvZGV9LCBUb3RhbCBDYXNlczogJHtjb3ZpZEluZm8udG90YWxfY2FzZXN9LCBOZXcgQ2FzZXM6ICR7Y292aWRJbmZvLm5ld19jYXNlc31gKTtcbiAgfSk7XG5cbiAgYXBwZW5kTG9nKFwiQWxsIENPVklEIGRhdGEgbG9hZGVkLlwiKTtcbiAgY29uc29sZS5sb2coXCJBbGwgQ09WSUQgZGF0YSBsb2FkZWQ6XCIsIGNvdmlkRGF0YSk7IC8vIEFsc28gbG9nIHRvIGNvbnNvbGUgZm9yIGZ1dHVyZSB1c2Vcbn1cblxuLy8gQW5pbWF0ZSBDT1ZJRCBkYXRhXG5mdW5jdGlvbiBhbmltYXRlQ292aWREYXRhKCkge1xuICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgY29uc3QgdXBkYXRlZENvdmlkRGF0YSA9IE9iamVjdC52YWx1ZXMoY292aWREYXRhKS5tYXAoKGRhdGEpID0+ICh7XG4gICAgICAuLi5kYXRhLFxuICAgICAgbmV3X2Nhc2VzOiBNYXRoLnJhbmRvbSgpICogMTAwMDAwLCAvLyBFeGFtcGxlIHVwZGF0ZSBmb3IgYW5pbWF0aW9uXG4gICAgfSkpO1xuXG4gICAgR2xvYmUucG9pbnRzRGF0YSh1cGRhdGVkQ292aWREYXRhKTtcbiAgfSwgNTAwMCk7IC8vIFVwZGF0ZSBldmVyeSA1IHNlY29uZHNcbn1cblxuLy8gTG9hZCBDT1ZJRCBkYXRhIGFuZCBpbml0aWFsaXplXG5sb2FkQ292aWREYXRhKCkudGhlbigoKSA9PiB7XG4gIGluaXRHbG9iZSgpO1xuICBhbmltYXRlQ292aWREYXRhKCk7XG59KTtcblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPSAoTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDIgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1IDogMCk7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJiZDY5NGJkMmYxYzU2ZGM5MzRlYlwiIl0sInNvdXJjZVJvb3QiOiIifQ==