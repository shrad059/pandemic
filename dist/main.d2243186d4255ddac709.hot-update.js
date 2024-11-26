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
/* harmony import */ var _output_geojson__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./output.geojson */ "./src/output.geojson");
/* harmony import */ var _output_geojson__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_output_geojson__WEBPACK_IMPORTED_MODULE_3__);



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


/***/ }),

/***/ "./src/output.geojson":
/*!****************************!*\
  !*** ./src/output.geojson ***!
  \****************************/
/***/ (() => {

throw new Error("Module parse failed: Unexpected token (2:6)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n| {\n> \"type\": \"FeatureCollection\",\n| \"name\": \"output\",\n| \"crs\": { \"type\": \"name\", \"properties\": { \"name\": \"urn:ogc:def:crs:OGC:1.3:CRS84\" } },");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "2810b6f80278561868a5"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDbUY7QUFDM0M7QUFDekI7QUFDQTtBQUNkO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7O0FBRW5CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0RBQWEsRUFBRSxrQkFBa0I7QUFDbEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyx3Q0FBSztBQUNuQixnQkFBZ0IsK0NBQVk7QUFDNUIseUJBQXlCLHdDQUFLOztBQUU5QjtBQUNBLGVBQWUsb0RBQWlCO0FBQ2hDO0FBQ0E7O0FBRUEsbUJBQW1CLG1EQUFnQjtBQUNuQztBQUNBOztBQUVBLG9CQUFvQixtREFBZ0I7QUFDcEM7QUFDQTs7QUFFQSxvQkFBb0IsNkNBQVU7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxrQkFBa0Isc0NBQUc7O0FBRXJCO0FBQ0EsaUJBQWlCLHVGQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWMsZ0RBQVUsRUFBRSwyQ0FBMkM7QUFDckUscUJBQXFCLGdFQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHNCQUFzQixJQUFJLHNCQUFzQjtBQUM1RSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQkFBbUIsMkRBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MseUJBQXlCLElBQUkseUJBQXlCO0FBQzVGO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtGQUErRjtBQUMvRjtBQUNBO0FBQ0EscURBQXFELG9CQUFvQjtBQUN6RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDRCQUE0QixZQUFZO0FBQ3hDLEdBQUc7O0FBRUgsbURBQW1EO0FBQ25EOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRyxRQUFRO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQzdMQSxvRCIsImZpbGUiOiJtYWluLmQyMjQzMTg2ZDQyNTVkZGFjNzA5LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGhyZWVHbG9iZSBmcm9tIFwidGhyZWUtZ2xvYmVcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFNjZW5lLCBQZXJzcGVjdGl2ZUNhbWVyYSwgQW1iaWVudExpZ2h0LCBEaXJlY3Rpb25hbExpZ2h0LCBDb2xvciwgRm9nLCBQb2ludExpZ2h0IH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBPcmJpdENvbnRyb2xzIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9jb250cm9scy9PcmJpdENvbnRyb2xzLmpzXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjsgLy8gR2VvSlNPTiBkYXRhIGZvciBjb3VudHJpZXNcbmltcG9ydCB0cmF2ZWxIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWZsaWdodHMuanNvblwiOyAvLyBUcmF2ZWwgZGF0YSAocmVwbGFjZSBvciBvbWl0IGlmIHVubmVjZXNzYXJ5KVxuaW1wb3J0IG91dHB1dCBmcm9tIFwiLi9vdXRwdXQuZ2VvanNvblwiOyAvLyBUcmF2ZWwgZGF0YSAocmVwbGFjZSBvciBvbWl0IGlmIHVubmVjZXNzYXJ5KVxudmFyIHJlbmRlcmVyLCBjYW1lcmEsIHNjZW5lLCBjb250cm9scztcbmxldCBtb3VzZVggPSAwLCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcbmxldCBjb3ZpZERhdGEgPSB7fTsgLy8gU3RvcmUgQ09WSUQgY2FzZSBkYXRhIGZvciBjb3VudHJpZXNcblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5hbmltYXRlKCk7XG5cbi8vIFNFQ1RJT04gSW5pdGlhbGl6aW5nIGNvcmUgVGhyZWVKUyBlbGVtZW50c1xuZnVuY3Rpb24gaW5pdCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSByZW5kZXJlclxuICByZW5kZXJlciA9IG5ldyBXZWJHTFJlbmRlcmVyKHsgYW50aWFsaWFzOiB0cnVlIH0pO1xuICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAvLyBJbml0aWFsaXplIHNjZW5lLCBsaWdodFxuICBzY2VuZSA9IG5ldyBTY2VuZSgpO1xuICBzY2VuZS5hZGQobmV3IEFtYmllbnRMaWdodCgweGJiYmJiYiwgMC4zKSk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwNDBkMjEpO1xuXG4gIC8vIEluaXRpYWxpemUgY2FtZXJhLCBsaWdodFxuICBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuXG4gIHZhciBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgZExpZ2h0LnBvc2l0aW9uLnNldCgtODAwLCAyMDAwLCA0MDApO1xuICBjYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgdmFyIGRMaWdodDEgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweDc5ODJmNiwgMSk7XG4gIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQxKTtcblxuICB2YXIgZExpZ2h0MiA9IG5ldyBQb2ludExpZ2h0KDB4ODU2NmNjLCAwLjUpO1xuICBkTGlnaHQyLnBvc2l0aW9uLnNldCgtMjAwLCA1MDAsIDIwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0Mik7XG5cbiAgY2FtZXJhLnBvc2l0aW9uLnogPSA0MDA7XG4gIGNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gIC8vIEFkZGl0aW9uYWwgZWZmZWN0c1xuICBzY2VuZS5mb2cgPSBuZXcgRm9nKDB4NTM1ZWYzLCA0MDAsIDIwMDApO1xuXG4gIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgY29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICBjb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgY29udHJvbHMuZHluYW1pY0RhbXBpbmdGYWN0b3IgPSAwLjAxO1xuICBjb250cm9scy5lbmFibGVQYW4gPSBmYWxzZTtcbiAgY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gIGNvbnRyb2xzLm1heERpc3RhbmNlID0gNTAwO1xuICBjb250cm9scy5yb3RhdGVTcGVlZCA9IDAuODtcbiAgY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgY29udHJvbHMuYXV0b1JvdGF0ZSA9IGZhbHNlO1xuXG4gIGNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICBjb250cm9scy5tYXhQb2xhckFuZ2xlID0gTWF0aC5QSSAtIE1hdGguUEkgLyAzO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIG9uV2luZG93UmVzaXplLCBmYWxzZSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgb25Nb3VzZU1vdmUpO1xufVxuXG4vLyBTRUNUSU9OIEdsb2JlXG5mdW5jdGlvbiBpbml0R2xvYmUoKSB7XG4gIEdsb2JlID0gbmV3IFRocmVlR2xvYmUoeyB3YWl0Rm9yR2xvYmVSZWFkeTogdHJ1ZSwgYW5pbWF0ZUluOiB0cnVlIH0pXG4gICAgLmhleFBvbHlnb25zRGF0YShjb3VudHJpZXMuZmVhdHVyZXMpXG4gICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgLmhleFBvbHlnb25NYXJnaW4oMC43KVxuICAgIC5zaG93QXRtb3NwaGVyZSh0cnVlKVxuICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgLmF0bW9zcGhlcmVBbHRpdHVkZSgwLjI1KVxuICAgIC5oZXhQb2x5Z29uQ29sb3IoKGUpID0+IHtcbiAgICAgIGNvbnN0IGNvdW50cnlDb2RlID0gZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICAgIGNvbnN0IGNvdmlkSW5mbyA9IGNvdmlkRGF0YVtjb3VudHJ5Q29kZV07XG5cbiAgICAgIGlmIChjb3ZpZEluZm8pIHtcbiAgICAgICAgY29uc3QgdG90YWxDYXNlcyA9IGNvdmlkSW5mby50b3RhbF9jYXNlcztcbiAgICAgICAgY29uc3QgbWF4Q2FzZXMgPSAxMDAwMDAwMDtcbiAgICAgICAgY29uc3QgaW50ZW5zaXR5ID0gTWF0aC5taW4odG90YWxDYXNlcyAvIG1heENhc2VzLCAxKTtcbiAgICAgICAgcmV0dXJuIGByZ2JhKDI1NSwgJHsyNTUgLSBpbnRlbnNpdHkgKiAyNTV9LCAkezI1NSAtIGludGVuc2l0eSAqIDI1NX0sIDEpYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNylcIjtcbiAgICAgIH1cbiAgICB9KTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5hcmNzRGF0YSh0cmF2ZWxIaXN0b3J5LmZsaWdodHMpXG4gICAgICAuYXJjQ29sb3IoKGUpID0+IChlLnN0YXR1cyA/IFwiIzljZmYwMFwiIDogXCIjRkY0MDAwXCIpKVxuICAgICAgLmFyY0FsdGl0dWRlKChlKSA9PiBlLmFyY0FsdClcbiAgICAgIC5hcmNTdHJva2UoKGUpID0+IChlLnN0YXR1cyA/IDAuNSA6IDAuMykpXG4gICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAuYXJjRGFzaEdhcCg0KVxuICAgICAgLmFyY0Rhc2hBbmltYXRlVGltZSgxMDAwKTtcbiAgfSwgMTAwMCk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgR2xvYmUucG9pbnRzRGF0YShPYmplY3QudmFsdWVzKGNvdmlkRGF0YSkpXG4gICAgICAucG9pbnRBbHRpdHVkZSgoZSkgPT4gTWF0aC5taW4oZS50b3RhbF9jYXNlcyAvIDEwMDAwMDAsIDAuNSkpXG4gICAgICAucG9pbnRSYWRpdXMoKGUpID0+IE1hdGgubWluKGUubmV3X2Nhc2VzIC8gMTAwMDAwLCAwLjEpKVxuICAgICAgLnBvaW50Q29sb3IoKGUpID0+IGByZ2JhKDI1NSwgJHsyNTUgLSBlLm5ld19jYXNlcyAvIDEwMDB9LCAkezI1NSAtIGUubmV3X2Nhc2VzIC8gMTAwMH0sIDEpYClcbiAgICAgIC5wb2ludHNNZXJnZSh0cnVlKVxuICAgICAgLnBvaW50c1RyYW5zaXRpb25EdXJhdGlvbigyMDAwKTtcbiAgfSwgMTUwMCk7XG5cbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcblxuICBzY2VuZS5hZGQoR2xvYmUpO1xufVxuXG4vLyBMb2FkIENPVklEIGRhdGFcbmFzeW5jIGZ1bmN0aW9uIGxvYWRDb3ZpZERhdGEoKSB7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvVXNlcnMvc2hyYWRkaGEvRGVza3RvcC9naXRodWItZ2xvYmUtbWFpbi9zcmMvb3V0cHV0Lmdlb2pzb25cIik7IC8vIFJlcGxhY2Ugd2l0aCB0aGUgY29ycmVjdCBwYXRoIHRvIHlvdXIgZmlsZVxuICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZldGNoIEdlb0pTT04gZmlsZTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICB9XG4gICAgY29uc3QgZ2VvanNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICBnZW9qc29uLmZlYXR1cmVzLmZvckVhY2goKGZlYXR1cmUpID0+IHtcbiAgICBjb25zdCBjb3VudHJ5Q29kZSA9IGZlYXR1cmUucHJvcGVydGllcy5JU09fQTM7XG4gICAgY29uc3QgY292aWRJbmZvID0ge1xuICAgICAgdG90YWxfY2FzZXM6IGZlYXR1cmUucHJvcGVydGllcy50b3RhbF9jYXNlcyxcbiAgICAgIG5ld19jYXNlczogZmVhdHVyZS5wcm9wZXJ0aWVzLm5ld19jYXNlcyxcbiAgICB9O1xuXG4gICAgY292aWREYXRhW2NvdW50cnlDb2RlXSA9IGNvdmlkSW5mbztcblxuICAgIC8vIExvZyB0aGUgZGF0YSBmb3IgdmVyaWZpY2F0aW9uXG4gICAgY29uc29sZS5sb2coYENvdW50cnk6ICR7Y291bnRyeUNvZGV9LCBEYXRhOmAsIGNvdmlkSW5mbyk7XG4gIH0pO1xuXG4gIGNvbnNvbGUubG9nKFwiQWxsIENPVklEIGRhdGEgbG9hZGVkOlwiLCBjb3ZpZERhdGEpOyAvLyBMb2cgZW50aXJlIGRhdGFzZXRcbn1cblxuXG4vLyBBbmltYXRlIENPVklEIGRhdGFcbmZ1bmN0aW9uIGFuaW1hdGVDb3ZpZERhdGEoKSB7XG4gIHNldEludGVydmFsKCgpID0+IHtcbiAgICBjb25zdCB1cGRhdGVkQ292aWREYXRhID0gT2JqZWN0LnZhbHVlcyhjb3ZpZERhdGEpLm1hcCgoZGF0YSkgPT4gKHtcbiAgICAgIC4uLmRhdGEsXG4gICAgICBuZXdfY2FzZXM6IE1hdGgucmFuZG9tKCkgKiAxMDAwMDAsIC8vIEV4YW1wbGUgdXBkYXRlIGZvciBhbmltYXRpb25cbiAgICB9KSk7XG5cbiAgICBHbG9iZS5wb2ludHNEYXRhKHVwZGF0ZWRDb3ZpZERhdGEpO1xuICB9LCA1MDAwKTsgLy8gVXBkYXRlIGV2ZXJ5IDUgc2Vjb25kc1xufVxuXG4vLyBMb2FkIENPVklEIGRhdGEgYW5kIGluaXRpYWxpemVcbmxvYWRDb3ZpZERhdGEoKS50aGVuKCgpID0+IHtcbiAgaW5pdEdsb2JlKCk7XG4gIGFuaW1hdGVDb3ZpZERhdGEoKTtcbn0pO1xuXG5mdW5jdGlvbiBvbk1vdXNlTW92ZShldmVudCkge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYIC0gd2luZG93SGFsZlg7XG4gIG1vdXNlWSA9IGV2ZW50LmNsaWVudFkgLSB3aW5kb3dIYWxmWTtcbn1cblxuZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoKSB7XG4gIGNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDEuNTtcbiAgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAxLjU7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XG4gIGNhbWVyYS5wb3NpdGlvbi54ICs9IChNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMiA/IChtb3VzZVggLyAyIC0gY2FtZXJhLnBvc2l0aW9uLngpICogMC4wMDUgOiAwKTtcbiAgY2FtZXJhLnBvc2l0aW9uLnkgKz0gKC1tb3VzZVkgLyAyIC0gY2FtZXJhLnBvc2l0aW9uLnkpICogMC4wMDU7XG4gIGNhbWVyYS5sb29rQXQoc2NlbmUucG9zaXRpb24pO1xuICBjb250cm9scy51cGRhdGUoKTtcbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG59XG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSAoKSA9PiBcIjI4MTBiNmY4MDI3ODU2MTg2OGE1XCIiXSwic291cmNlUm9vdCI6IiJ9