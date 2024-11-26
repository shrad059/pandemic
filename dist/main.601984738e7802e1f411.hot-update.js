self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");
Object(function webpackMissingModule() { var e = new Error("Cannot find module './files/output.geojson'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());



 // GeoJSON data for countries
 // Travel data (replace or omit if unnecessary)
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
  renderer = new three__WEBPACK_IMPORTED_MODULE_4__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new three__WEBPACK_IMPORTED_MODULE_4__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_4__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x040d21);

  // Initialize camera, light
  camera = new three__WEBPACK_IMPORTED_MODULE_4__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_4__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_4__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_4__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);

  // Additional effects
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_4__.Fog(0x535ef3, 400, 2000);

  // Initialize controls
  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_5__.OrbitControls(camera, renderer.domElement);
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

  setTimeout(() => {
    Globe.arcsData(_files_my_flights_json__WEBPACK_IMPORTED_MODULE_2__.flights)
      .arcColor((e) => (e.status ? "#9cff00" : "#FF4000"))
      .arcAltitude((e) => e.arcAlt)
      .arcStroke((e) => (e.status ? 0.5 : 0.3))
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000);
  }, 1000);

  setTimeout(() => {
    Globe.pointsData(Object.values(covidData))
      .pointAltitude((e) => Math.min(e.total_cases / 1000000, 0.5))
      .pointRadius((e) => Math.min(e.new_cases / 100000, 0.1))
      .pointColor((e) => `rgba(255, ${255 - e.new_cases / 1000}, ${255 - e.new_cases / 1000}, 1)`)
      .pointsMerge(true)
      .pointsTransitionDuration(2000);
  }, 1500);

  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x3a228a);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

  scene.add(Globe);
}

// Load COVID data
async function loadCovidData() {
  const response = await fetch("/Users/shraddha/Desktop/github-globe-main/src/output.geojson"); // Replace with the correct path to your file
  if (!response.ok) {
    console.log(response);
    throw new Error(`Failed to fetch GeoJSON file: ${response.statusText}`);
  }
    const geojson = await response.json();

  geojson.features.forEach((feature) => {
    const countryCode = feature.properties.ISO_A3;
    const covidInfo = {
      total_cases: feature.properties.total_cases,
      new_cases: feature.properties.new_cases,
    };

    covidData[countryCode] = covidInfo;

    // Log the data for verification
    console.log(`Country: ${countryCode}, Data:`, covidInfo);
  });

  console.log("All COVID data loaded:", covidData); // Log entire dataset
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
/******/ 		__webpack_require__.h = () => "d2243186d4255ddac709"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFxQztBQUNtRjtBQUMzQztBQUN6QjtBQUNBO0FBQ1I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLHdDQUFLO0FBQ25CLGdCQUFnQiwrQ0FBWTtBQUM1Qix5QkFBeUIsd0NBQUs7O0FBRTlCO0FBQ0EsZUFBZSxvREFBaUI7QUFDaEM7QUFDQTs7QUFFQSxtQkFBbUIsbURBQWdCO0FBQ25DO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQjtBQUNwQztBQUNBOztBQUVBLG9CQUFvQiw2Q0FBVTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGtCQUFrQixzQ0FBRzs7QUFFckI7QUFDQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxnREFBVSxFQUFFLDJDQUEyQztBQUNyRSxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0JBQXNCLElBQUksc0JBQXNCO0FBQzVFLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG1CQUFtQiwyREFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyx5QkFBeUIsSUFBSSx5QkFBeUI7QUFDNUY7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0ZBQStGO0FBQy9GO0FBQ0E7QUFDQSxxREFBcUQsb0JBQW9CO0FBQ3pFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNEJBQTRCLFlBQVk7QUFDeEMsR0FBRzs7QUFFSCxtREFBbUQ7QUFDbkQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHLFFBQVE7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0M3TEEsb0QiLCJmaWxlIjoibWFpbi42MDE5ODQ3MzhlNzgwMmUxZjQxMS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSwgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7IC8vIEdlb0pTT04gZGF0YSBmb3IgY291bnRyaWVzXG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjsgLy8gVHJhdmVsIGRhdGEgKHJlcGxhY2Ugb3Igb21pdCBpZiB1bm5lY2Vzc2FyeSlcbmltcG9ydCBvdXRwdXQgZnJvbSBcIi4vZmlsZXMvb3V0cHV0Lmdlb2pzb25cIjsgLy8gVHJhdmVsIGRhdGEgKHJlcGxhY2Ugb3Igb21pdCBpZiB1bm5lY2Vzc2FyeSlcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMCwgbW91c2VZID0gMDtcbmxldCB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbmxldCB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG52YXIgR2xvYmU7XG5sZXQgY292aWREYXRhID0ge307IC8vIFN0b3JlIENPVklEIGNhc2UgZGF0YSBmb3IgY291bnRyaWVzXG5cbmluaXQoKTtcbmluaXRHbG9iZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIEluaXRpYWxpemUgcmVuZGVyZXJcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBzY2VuZSwgbGlnaHRcbiAgc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgc2NlbmUuYWRkKG5ldyBBbWJpZW50TGlnaHQoMHhiYmJiYmIsIDAuMykpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IENvbG9yKDB4MDQwZDIxKTtcblxuICAvLyBJbml0aWFsaXplIGNhbWVyYSwgbGlnaHRcbiAgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICB2YXIgZExpZ2h0ID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuOCk7XG4gIGRMaWdodC5wb3NpdGlvbi5zZXQoLTgwMCwgMjAwMCwgNDAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQpO1xuXG4gIHZhciBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICBkTGlnaHQxLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgdmFyIGRMaWdodDIgPSBuZXcgUG9pbnRMaWdodCgweDg1NjZjYywgMC41KTtcbiAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDIpO1xuXG4gIGNhbWVyYS5wb3NpdGlvbi56ID0gNDAwO1xuICBjYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICAvLyBBZGRpdGlvbmFsIGVmZmVjdHNcbiAgc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAvLyBJbml0aWFsaXplIGNvbnRyb2xzXG4gIGNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcbiAgY29udHJvbHMuZW5hYmxlRGFtcGluZyA9IHRydWU7XG4gIGNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgY29udHJvbHMuZW5hYmxlUGFuID0gZmFsc2U7XG4gIGNvbnRyb2xzLm1pbkRpc3RhbmNlID0gMjAwO1xuICBjb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgY29udHJvbHMucm90YXRlU3BlZWQgPSAwLjg7XG4gIGNvbnRyb2xzLnpvb21TcGVlZCA9IDE7XG4gIGNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcblxuICBjb250cm9scy5taW5Qb2xhckFuZ2xlID0gTWF0aC5QSSAvIDMuNTtcbiAgY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UpO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG9uTW91c2VNb3ZlKTtcbn1cblxuLy8gU0VDVElPTiBHbG9iZVxuZnVuY3Rpb24gaW5pdEdsb2JlKCkge1xuICBHbG9iZSA9IG5ldyBUaHJlZUdsb2JlKHsgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsIGFuaW1hdGVJbjogdHJ1ZSB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICBjb25zdCBjb3VudHJ5Q29kZSA9IGUucHJvcGVydGllcy5JU09fQTM7XG4gICAgICBjb25zdCBjb3ZpZEluZm8gPSBjb3ZpZERhdGFbY291bnRyeUNvZGVdO1xuXG4gICAgICBpZiAoY292aWRJbmZvKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsQ2FzZXMgPSBjb3ZpZEluZm8udG90YWxfY2FzZXM7XG4gICAgICAgIGNvbnN0IG1heENhc2VzID0gMTAwMDAwMDA7XG4gICAgICAgIGNvbnN0IGludGVuc2l0eSA9IE1hdGgubWluKHRvdGFsQ2FzZXMgLyBtYXhDYXNlcywgMSk7XG4gICAgICAgIHJldHVybiBgcmdiYSgyNTUsICR7MjU1IC0gaW50ZW5zaXR5ICogMjU1fSwgJHsyNTUgLSBpbnRlbnNpdHkgKiAyNTV9LCAxKWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAwLjcpXCI7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgR2xvYmUuYXJjc0RhdGEodHJhdmVsSGlzdG9yeS5mbGlnaHRzKVxuICAgICAgLmFyY0NvbG9yKChlKSA9PiAoZS5zdGF0dXMgPyBcIiM5Y2ZmMDBcIiA6IFwiI0ZGNDAwMFwiKSlcbiAgICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4gZS5hcmNBbHQpXG4gICAgICAuYXJjU3Ryb2tlKChlKSA9PiAoZS5zdGF0dXMgPyAwLjUgOiAwLjMpKVxuICAgICAgLmFyY0Rhc2hMZW5ndGgoMC45KVxuICAgICAgLmFyY0Rhc2hHYXAoNClcbiAgICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMCk7XG4gIH0sIDEwMDApO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLnBvaW50c0RhdGEoT2JqZWN0LnZhbHVlcyhjb3ZpZERhdGEpKVxuICAgICAgLnBvaW50QWx0aXR1ZGUoKGUpID0+IE1hdGgubWluKGUudG90YWxfY2FzZXMgLyAxMDAwMDAwLCAwLjUpKVxuICAgICAgLnBvaW50UmFkaXVzKChlKSA9PiBNYXRoLm1pbihlLm5ld19jYXNlcyAvIDEwMDAwMCwgMC4xKSlcbiAgICAgIC5wb2ludENvbG9yKChlKSA9PiBgcmdiYSgyNTUsICR7MjU1IC0gZS5uZXdfY2FzZXMgLyAxMDAwfSwgJHsyNTUgLSBlLm5ld19jYXNlcyAvIDEwMDB9LCAxKWApXG4gICAgICAucG9pbnRzTWVyZ2UodHJ1ZSlcbiAgICAgIC5wb2ludHNUcmFuc2l0aW9uRHVyYXRpb24oMjAwMCk7XG4gIH0sIDE1MDApO1xuXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gTG9hZCBDT1ZJRCBkYXRhXG5hc3luYyBmdW5jdGlvbiBsb2FkQ292aWREYXRhKCkge1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL1VzZXJzL3NocmFkZGhhL0Rlc2t0b3AvZ2l0aHViLWdsb2JlLW1haW4vc3JjL291dHB1dC5nZW9qc29uXCIpOyAvLyBSZXBsYWNlIHdpdGggdGhlIGNvcnJlY3QgcGF0aCB0byB5b3VyIGZpbGVcbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBmZXRjaCBHZW9KU09OIGZpbGU6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgfVxuICAgIGNvbnN0IGdlb2pzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgZ2VvanNvbi5mZWF0dXJlcy5mb3JFYWNoKChmZWF0dXJlKSA9PiB7XG4gICAgY29uc3QgY291bnRyeUNvZGUgPSBmZWF0dXJlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgIGNvbnN0IGNvdmlkSW5mbyA9IHtcbiAgICAgIHRvdGFsX2Nhc2VzOiBmZWF0dXJlLnByb3BlcnRpZXMudG90YWxfY2FzZXMsXG4gICAgICBuZXdfY2FzZXM6IGZlYXR1cmUucHJvcGVydGllcy5uZXdfY2FzZXMsXG4gICAgfTtcblxuICAgIGNvdmlkRGF0YVtjb3VudHJ5Q29kZV0gPSBjb3ZpZEluZm87XG5cbiAgICAvLyBMb2cgdGhlIGRhdGEgZm9yIHZlcmlmaWNhdGlvblxuICAgIGNvbnNvbGUubG9nKGBDb3VudHJ5OiAke2NvdW50cnlDb2RlfSwgRGF0YTpgLCBjb3ZpZEluZm8pO1xuICB9KTtcblxuICBjb25zb2xlLmxvZyhcIkFsbCBDT1ZJRCBkYXRhIGxvYWRlZDpcIiwgY292aWREYXRhKTsgLy8gTG9nIGVudGlyZSBkYXRhc2V0XG59XG5cblxuLy8gQW5pbWF0ZSBDT1ZJRCBkYXRhXG5mdW5jdGlvbiBhbmltYXRlQ292aWREYXRhKCkge1xuICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgY29uc3QgdXBkYXRlZENvdmlkRGF0YSA9IE9iamVjdC52YWx1ZXMoY292aWREYXRhKS5tYXAoKGRhdGEpID0+ICh7XG4gICAgICAuLi5kYXRhLFxuICAgICAgbmV3X2Nhc2VzOiBNYXRoLnJhbmRvbSgpICogMTAwMDAwLCAvLyBFeGFtcGxlIHVwZGF0ZSBmb3IgYW5pbWF0aW9uXG4gICAgfSkpO1xuXG4gICAgR2xvYmUucG9pbnRzRGF0YSh1cGRhdGVkQ292aWREYXRhKTtcbiAgfSwgNTAwMCk7IC8vIFVwZGF0ZSBldmVyeSA1IHNlY29uZHNcbn1cblxuLy8gTG9hZCBDT1ZJRCBkYXRhIGFuZCBpbml0aWFsaXplXG5sb2FkQ292aWREYXRhKCkudGhlbigoKSA9PiB7XG4gIGluaXRHbG9iZSgpO1xuICBhbmltYXRlQ292aWREYXRhKCk7XG59KTtcblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPSAoTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDIgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1IDogMCk7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJkMjI0MzE4NmQ0MjU1ZGRhYzcwOVwiIl0sInNvdXJjZVJvb3QiOiIifQ==