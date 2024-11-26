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
/* harmony import */ var _files_my_airports_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files/my-airports.json */ "./src/files/my-airports.json");







var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;
let covidData = {}; // To store COVID case data for countries

init();
initGlobe();
onWindowResize();
animate();

// Initialize ThreeJS elements
function init() {
  // Renderer
  renderer = new three__WEBPACK_IMPORTED_MODULE_4__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Scene
  scene = new three__WEBPACK_IMPORTED_MODULE_4__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_4__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x040d21);

  // Camera
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
  scene.add(camera);

  // Fog
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_4__.Fog(0x535ef3, 400, 2000);

  // Controls
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

// Initialize Globe
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

  // Add animated arcs for travel history
  // setTimeout(() => {
  //   Globe.arcsData(travelHistory.flights)
  //     .arcColor((e) => (e.status ? "#9cff00" : "#FF4000"))
  //     .arcAltitude((e) => e.arcAlt)
  //     .arcStroke((e) => (e.status ? 0.5 : 0.3))
  //     .arcDashLength(0.9)
  //     .arcDashGap(4)
  //     .arcDashAnimateTime(1000);
  // }, 1000);

  // Add animated points for COVID data
  setTimeout(() => {
    Globe.pointsData(Object.values(covidData))
      .pointAltitude((e) => Math.min(e.total_cases / 1000000, 0.5))
      .pointRadius((e) => Math.min(e.new_cases / 100000, 0.1))
      .pointColor((e) => `rgba(255, ${255 - e.new_cases / 1000}, ${255 - e.new_cases / 1000}, 1)`)
      .pointsMerge(true)
      .pointsTransitionDuration(2000);
  }, 1500);

  // Add globe material
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x3a228a);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_4__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

  scene.add(Globe);
}

// Load COVID data
async function loadCovidData() {
  const response = await fetch("./output.geojson");
  const geojson = await response.json();

  geojson.features.forEach((feature) => {
    const countryCode = feature.properties.ISO_A3;
    const covidInfo = {
      total_cases: feature.properties.total_cases,
      new_cases: feature.properties.new_cases,
    };

    covidData[countryCode] = covidInfo;
  });
}

// Load COVID data and initialize the globe
loadCovidData().then(() => {
  initGlobe();
});

// Event Listeners
function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  camera.position.x += (mouseX / 2 - camera.position.x) * 0.005;
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
/******/ 		__webpack_require__.h = () => "b32409134fb1a4a9b6d3"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFxQztBQUNtRjtBQUMzQztBQUN6QjtBQUNBO0FBQ0U7O0FBRXREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ2xEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSzs7QUFFOUI7QUFDQSxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixzQ0FBRzs7QUFFckI7QUFDQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxnREFBVSxFQUFFLDJDQUEyQztBQUNyRSxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0JBQXNCLElBQUksc0JBQXNCO0FBQzVFLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLElBQUkseUJBQXlCO0FBQzVGO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0N4S0Esb0QiLCJmaWxlIjoibWFpbi5lZmY3MGRhYWY0Y2Y0Y2U0NmI4NS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSwgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjtcbmltcG9ydCBhaXJwb3J0SGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1haXJwb3J0cy5qc29uXCI7XG5cbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcbmxldCBjb3ZpZERhdGEgPSB7fTsgLy8gVG8gc3RvcmUgQ09WSUQgY2FzZSBkYXRhIGZvciBjb3VudHJpZXNcblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBJbml0aWFsaXplIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIFJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIC8vIFNjZW5lXG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG5cbiAgLy8gQ2FtZXJhXG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgLy8gRm9nXG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgLy8gQ29udHJvbHNcbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBJbml0aWFsaXplIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoeyB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSwgYW5pbWF0ZUluOiB0cnVlIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgIGNvbnN0IGNvdW50cnlDb2RlID0gZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICAgIGNvbnN0IGNvdmlkSW5mbyA9IGNvdmlkRGF0YVtjb3VudHJ5Q29kZV07XG5cbiAgICAgIGlmIChjb3ZpZEluZm8pIHtcbiAgICAgICAgY29uc3QgdG90YWxDYXNlcyA9IGNvdmlkSW5mby50b3RhbF9jYXNlcztcbiAgICAgICAgY29uc3QgbWF4Q2FzZXMgPSAxMDAwMDAwMDtcbiAgICAgICAgY29uc3QgaW50ZW5zaXR5ID0gTWF0aC5taW4odG90YWxDYXNlcyAvIG1heENhc2VzLCAxKTtcbiAgICAgICAgcmV0dXJuIGByZ2JhKDI1NSwgJHsyNTUgLSBpbnRlbnNpdHkgKiAyNTV9LCAkezI1NSAtIGludGVuc2l0eSAqIDI1NX0sIDEpYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNylcIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICAvLyBBZGQgYW5pbWF0ZWQgYXJjcyBmb3IgdHJhdmVsIGhpc3RvcnlcbiAgLy8gc2V0VGltZW91dCgoKSA9PiB7XG4gIC8vICAgR2xvYmUuYXJjc0RhdGEodHJhdmVsSGlzdG9yeS5mbGlnaHRzKVxuICAvLyAgICAgLmFyY0NvbG9yKChlKSA9PiAoZS5zdGF0dXMgPyBcIiM5Y2ZmMDBcIiA6IFwiI0ZGNDAwMFwiKSlcbiAgLy8gICAgIC5hcmNBbHRpdHVkZSgoZSkgPT4gZS5hcmNBbHQpXG4gIC8vICAgICAuYXJjU3Ryb2tlKChlKSA9PiAoZS5zdGF0dXMgPyAwLjUgOiAwLjMpKVxuICAvLyAgICAgLmFyY0Rhc2hMZW5ndGgoMC45KVxuICAvLyAgICAgLmFyY0Rhc2hHYXAoNClcbiAgLy8gICAgIC5hcmNEYXNoQW5pbWF0ZVRpbWUoMTAwMCk7XG4gIC8vIH0sIDEwMDApO1xuXG4gIC8vIEFkZCBhbmltYXRlZCBwb2ludHMgZm9yIENPVklEIGRhdGFcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgR2xvYmUucG9pbnRzRGF0YShPYmplY3QudmFsdWVzKGNvdmlkRGF0YSkpXG4gICAgICAucG9pbnRBbHRpdHVkZSgoZSkgPT4gTWF0aC5taW4oZS50b3RhbF9jYXNlcyAvIDEwMDAwMDAsIDAuNSkpXG4gICAgICAucG9pbnRSYWRpdXMoKGUpID0+IE1hdGgubWluKGUubmV3X2Nhc2VzIC8gMTAwMDAwLCAwLjEpKVxuICAgICAgLnBvaW50Q29sb3IoKGUpID0+IGByZ2JhKDI1NSwgJHsyNTUgLSBlLm5ld19jYXNlcyAvIDEwMDB9LCAkezI1NSAtIGUubmV3X2Nhc2VzIC8gMTAwMH0sIDEpYClcbiAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgLnBvaW50c1RyYW5zaXRpb25EdXJhdGlvbigyMDAwKTtcbiAgfSwgMTUwMCk7XG5cbiAgLy8gQWRkIGdsb2JlIG1hdGVyaWFsXG4gIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSBHbG9iZS5nbG9iZU1hdGVyaWFsKCk7XG4gIGdsb2JlTWF0ZXJpYWwuY29sb3IgPSBuZXcgQ29sb3IoMHgzYTIyOGEpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZUludGVuc2l0eSA9IDAuMTtcbiAgZ2xvYmVNYXRlcmlhbC5zaGluaW5lc3MgPSAwLjc7XG5cbiAgc2NlbmUuYWRkKEdsb2JlKTtcbn1cblxuLy8gTG9hZCBDT1ZJRCBkYXRhXG5hc3luYyBmdW5jdGlvbiBsb2FkQ292aWREYXRhKCkge1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiLi9vdXRwdXQuZ2VvanNvblwiKTtcbiAgY29uc3QgZ2VvanNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICBnZW9qc29uLmZlYXR1cmVzLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICBjb25zdCBjb3VudHJ5Q29kZSA9IGZlYXR1cmUucHJvcGVydGllcy5JU09fQTM7XG4gICAgY29uc3QgY292aWRJbmZvID0ge1xuICAgICAgdG90YWxfY2FzZXM6IGZlYXR1cmUucHJvcGVydGllcy50b3RhbF9jYXNlcyxcbiAgICAgIG5ld19jYXNlczogZmVhdHVyZS5wcm9wZXJ0aWVzLm5ld19jYXNlcyxcbiAgICB9O1xuXG4gICAgY292aWREYXRhW2NvdW50cnlDb2RlXSA9IGNvdmlkSW5mbztcbiAgfSk7XG59XG5cbi8vIExvYWQgQ09WSUQgZGF0YSBhbmQgaW5pdGlhbGl6ZSB0aGUgZ2xvYmVcbmxvYWRDb3ZpZERhdGEoKS50aGVuKCgpID0+IHtcbiAgaW5pdEdsb2JlKCk7XG59KTtcblxuLy8gRXZlbnQgTGlzdGVuZXJzXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz0gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNTtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcImIzMjQwOTEzNGZiMWE0YTliNmQzXCIiXSwic291cmNlUm9vdCI6IiJ9