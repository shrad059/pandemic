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
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x3a228a);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

  scene.add(Globe);
}

// Load COVID data
async function loadCovidData() {
  const response = await fetch("./output.geojson"); // Replace with the correct path to your file
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON file: ${response.statusText}`);
  }  const geojson = await response.json();

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
/******/ 		__webpack_require__.h = () => "8153607695d3f34c03e1"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ21GO0FBQzNDO0FBQ3pCO0FBQ0E7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVUsRUFBRSwyQ0FBMkM7QUFDckUscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHNCQUFzQixJQUFJLHNCQUFzQjtBQUM1RSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQkFBbUIsMkRBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLElBQUkseUJBQXlCO0FBQzVGO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRDtBQUNBLHFEQUFxRCxvQkFBb0I7QUFDekUsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSw0QkFBNEIsWUFBWTtBQUN4QyxHQUFHOztBQUVILG1EQUFtRDtBQUNuRDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUcsUUFBUTtBQUNYOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztXQzNMQSxvRCIsImZpbGUiOiJtYWluLmFiY2FlZGJkZjYxM2FhNDQ0ODIyLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lLCBQZXJzcGVjdGl2ZUNhbWVyYSwgQW1iaWVudExpZ2h0LCBEaXJlY3Rpb25hbExpZ2h0LCBDb2xvciwgRm9nLCBQb2ludExpZ2h0IH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjsgLy8gR2VvSlNPTiBkYXRhIGZvciBjb3VudHJpZXNcbmltcG9ydCB0cmF2ZWxIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWZsaWdodHMuanNvblwiOyAvLyBUcmF2ZWwgZGF0YSAocmVwbGFjZSBvciBvbWl0IGlmIHVubmVjZXNzYXJ5KVxuXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDAsIG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGNvdmlkRGF0YSA9IHt9OyAvLyBTdG9yZSBDT1ZJRCBjYXNlIGRhdGEgZm9yIGNvdW50cmllc1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgLy8gQWRkaXRpb25hbCBlZmZlY3RzXG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7IHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLCBhbmltYXRlSW46IHRydWUgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgY29uc3QgY291bnRyeUNvZGUgPSBlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgICAgY29uc3QgY292aWRJbmZvID0gY292aWREYXRhW2NvdW50cnlDb2RlXTtcblxuICAgICAgaWYgKGNvdmlkSW5mbykge1xuICAgICAgICBjb25zdCB0b3RhbENhc2VzID0gY292aWRJbmZvLnRvdGFsX2Nhc2VzO1xuICAgICAgICBjb25zdCBtYXhDYXNlcyA9IDEwMDAwMDAwO1xuICAgICAgICBjb25zdCBpbnRlbnNpdHkgPSBNYXRoLm1pbih0b3RhbENhc2VzIC8gbWF4Q2FzZXMsIDEpO1xuICAgICAgICByZXR1cm4gYHJnYmEoMjU1LCAkezI1NSAtIGludGVuc2l0eSAqIDI1NX0sICR7MjU1IC0gaW50ZW5zaXR5ICogMjU1fSwgMSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC43KVwiO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLmFyY3NEYXRhKHRyYXZlbEhpc3RvcnkuZmxpZ2h0cylcbiAgICAgIC5hcmNDb2xvcigoZSkgPT4gKGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIikpXG4gICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IGUuYXJjQWx0KVxuICAgICAgLmFyY1N0cm9rZSgoZSkgPT4gKGUuc3RhdHVzID8gMC41IDogMC4zKSlcbiAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApO1xuICB9LCAxMDAwKTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5wb2ludHNEYXRhKE9iamVjdC52YWx1ZXMoY292aWREYXRhKSlcbiAgICAgIC5wb2ludEFsdGl0dWRlKChlKSA9PiBNYXRoLm1pbihlLnRvdGFsX2Nhc2VzIC8gMTAwMDAwMCwgMC41KSlcbiAgICAgIC5wb2ludFJhZGl1cygoZSkgPT4gTWF0aC5taW4oZS5uZXdfY2FzZXMgLyAxMDAwMDAsIDAuMSkpXG4gICAgICAucG9pbnRDb2xvcigoZSkgPT4gYHJnYmEoMjU1LCAkezI1NSAtIGUubmV3X2Nhc2VzIC8gMTAwMH0sICR7MjU1IC0gZS5uZXdfY2FzZXMgLyAxMDAwfSwgMSlgKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRzVHJhbnNpdGlvbkR1cmF0aW9uKDIwMDApO1xuICB9LCAxNTAwKTtcblxuICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbi8vIExvYWQgQ09WSUQgZGF0YVxuYXN5bmMgZnVuY3Rpb24gbG9hZENvdmlkRGF0YSgpIHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi4vb3V0cHV0Lmdlb2pzb25cIik7IC8vIFJlcGxhY2Ugd2l0aCB0aGUgY29ycmVjdCBwYXRoIHRvIHlvdXIgZmlsZVxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmV0Y2ggR2VvSlNPTiBmaWxlOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gIH0gIGNvbnN0IGdlb2pzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgZ2VvanNvbi5mZWF0dXJlcy5mb3JFYWNoKChmZWF0dXJlKSA9PiB7XG4gICAgY29uc3QgY291bnRyeUNvZGUgPSBmZWF0dXJlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgIGNvbnN0IGNvdmlkSW5mbyA9IHtcbiAgICAgIHRvdGFsX2Nhc2VzOiBmZWF0dXJlLnByb3BlcnRpZXMudG90YWxfY2FzZXMsXG4gICAgICBuZXdfY2FzZXM6IGZlYXR1cmUucHJvcGVydGllcy5uZXdfY2FzZXMsXG4gICAgfTtcblxuICAgIGNvdmlkRGF0YVtjb3VudHJ5Q29kZV0gPSBjb3ZpZEluZm87XG5cbiAgICAvLyBMb2cgdGhlIGRhdGEgZm9yIHZlcmlmaWNhdGlvblxuICAgIGNvbnNvbGUubG9nKGBDb3VudHJ5OiAke2NvdW50cnlDb2RlfSwgRGF0YTpgLCBjb3ZpZEluZm8pO1xuICB9KTtcblxuICBjb25zb2xlLmxvZyhcIkFsbCBDT1ZJRCBkYXRhIGxvYWRlZDpcIiwgY292aWREYXRhKTsgLy8gTG9nIGVudGlyZSBkYXRhc2V0XG59XG5cblxuLy8gQW5pbWF0ZSBDT1ZJRCBkYXRhXG5mdW5jdGlvbiBhbmltYXRlQ292aWREYXRhKCkge1xuICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgY29uc3QgdXBkYXRlZENvdmlkRGF0YSA9IE9iamVjdC52YWx1ZXMoY292aWREYXRhKS5tYXAoKGRhdGEpID0+ICh7XG4gICAgICAuLi5kYXRhLFxuICAgICAgbmV3X2Nhc2VzOiBNYXRoLnJhbmRvbSgpICogMTAwMDAwLCAvLyBFeGFtcGxlIHVwZGF0ZSBmb3IgYW5pbWF0aW9uXG4gICAgfSkpO1xuXG4gICAgR2xvYmUucG9pbnRzRGF0YSh1cGRhdGVkQ292aWREYXRhKTtcbiAgfSwgNTAwMCk7IC8vIFVwZGF0ZSBldmVyeSA1IHNlY29uZHNcbn1cblxuLy8gTG9hZCBDT1ZJRCBkYXRhIGFuZCBpbml0aWFsaXplXG5sb2FkQ292aWREYXRhKCkudGhlbigoKSA9PiB7XG4gIGluaXRHbG9iZSgpO1xuICBhbmltYXRlQ292aWREYXRhKCk7XG59KTtcblxuZnVuY3Rpb24gb25Nb3VzZU1vdmUoZXZlbnQpIHtcbiAgbW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHdpbmRvd0hhbGZYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZIC0gd2luZG93SGFsZlk7XG59XG5cbmZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCkge1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gIHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMS41O1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKCkge1xuICBjYW1lcmEucG9zaXRpb24ueCArPSAoTWF0aC5hYnMobW91c2VYKSA8PSB3aW5kb3dIYWxmWCAvIDIgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1IDogMCk7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI4MTUzNjA3Njk1ZDNmMzRjMDNlMVwiIl0sInNvdXJjZVJvb3QiOiIifQ==