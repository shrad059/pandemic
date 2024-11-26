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
/******/ 		__webpack_require__.h = () => "06f4863b7fe2b460c697"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFDbUY7QUFDM0M7QUFDekI7QUFDQTs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjLHdDQUFLO0FBQ25CLGdCQUFnQiwrQ0FBWTtBQUM1Qix5QkFBeUIsd0NBQUs7O0FBRTlCO0FBQ0EsZUFBZSxvREFBaUI7QUFDaEM7QUFDQTs7QUFFQSxtQkFBbUIsbURBQWdCO0FBQ25DO0FBQ0E7O0FBRUEsb0JBQW9CLG1EQUFnQjtBQUNwQztBQUNBOztBQUVBLG9CQUFvQiw2Q0FBVTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGtCQUFrQixzQ0FBRzs7QUFFckI7QUFDQSxpQkFBaUIsdUZBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxnREFBVSxFQUFFLDJDQUEyQztBQUNyRSxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsc0JBQXNCLElBQUksc0JBQXNCO0FBQzVFLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG1CQUFtQiwyREFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyx5QkFBeUIsSUFBSSx5QkFBeUI7QUFDNUY7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSw0QkFBNEIsd0NBQUs7QUFDakMsK0JBQStCLHdDQUFLO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0ZBQStGO0FBQy9GO0FBQ0E7QUFDQSxxREFBcUQsb0JBQW9CO0FBQ3pFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsNEJBQTRCLFlBQVk7QUFDeEMsR0FBRzs7QUFFSCxtREFBbUQ7QUFDbkQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHLFFBQVE7QUFDWDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7V0M3TEEsb0QiLCJmaWxlIjoibWFpbi4yODEwYjZmODAyNzg1NjE4NjhhNS5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRocmVlR2xvYmUgZnJvbSBcInRocmVlLWdsb2JlXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyLCBTY2VuZSwgUGVyc3BlY3RpdmVDYW1lcmEsIEFtYmllbnRMaWdodCwgRGlyZWN0aW9uYWxMaWdodCwgQ29sb3IsIEZvZywgUG9pbnRMaWdodCB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7IC8vIEdlb0pTT04gZGF0YSBmb3IgY291bnRyaWVzXG5pbXBvcnQgdHJhdmVsSGlzdG9yeSBmcm9tIFwiLi9maWxlcy9teS1mbGlnaHRzLmpzb25cIjsgLy8gVHJhdmVsIGRhdGEgKHJlcGxhY2Ugb3Igb21pdCBpZiB1bm5lY2Vzc2FyeSlcbmltcG9ydCBvdXRwdXQgZnJvbSBcIi4vb3V0cHV0Lmdlb2pzb25cIjsgXG52YXIgcmVuZGVyZXIsIGNhbWVyYSwgc2NlbmUsIGNvbnRyb2xzO1xubGV0IG1vdXNlWCA9IDAsIG1vdXNlWSA9IDA7XG5sZXQgd2luZG93SGFsZlggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG5sZXQgd2luZG93SGFsZlkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xudmFyIEdsb2JlO1xubGV0IGNvdmlkRGF0YSA9IHt9OyAvLyBTdG9yZSBDT1ZJRCBjYXNlIGRhdGEgZm9yIGNvdW50cmllc1xuXG5pbml0KCk7XG5pbml0R2xvYmUoKTtcbmFuaW1hdGUoKTtcblxuLy8gU0VDVElPTiBJbml0aWFsaXppbmcgY29yZSBUaHJlZUpTIGVsZW1lbnRzXG5mdW5jdGlvbiBpbml0KCkge1xuICAvLyBJbml0aWFsaXplIHJlbmRlcmVyXG4gIHJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgLy8gQWRkaXRpb25hbCBlZmZlY3RzXG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7IHdhaXRGb3JHbG9iZVJlYWR5OiB0cnVlLCBhbmltYXRlSW46IHRydWUgfSlcbiAgICAuaGV4UG9seWdvbnNEYXRhKGNvdW50cmllcy5mZWF0dXJlcylcbiAgICAuaGV4UG9seWdvblJlc29sdXRpb24oMylcbiAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgLnNob3dBdG1vc3BoZXJlKHRydWUpXG4gICAgLmF0bW9zcGhlcmVDb2xvcihcIiMzYTIyOGFcIilcbiAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgLmhleFBvbHlnb25Db2xvcigoZSkgPT4ge1xuICAgICAgY29uc3QgY291bnRyeUNvZGUgPSBlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgICAgY29uc3QgY292aWRJbmZvID0gY292aWREYXRhW2NvdW50cnlDb2RlXTtcblxuICAgICAgaWYgKGNvdmlkSW5mbykge1xuICAgICAgICBjb25zdCB0b3RhbENhc2VzID0gY292aWRJbmZvLnRvdGFsX2Nhc2VzO1xuICAgICAgICBjb25zdCBtYXhDYXNlcyA9IDEwMDAwMDAwO1xuICAgICAgICBjb25zdCBpbnRlbnNpdHkgPSBNYXRoLm1pbih0b3RhbENhc2VzIC8gbWF4Q2FzZXMsIDEpO1xuICAgICAgICByZXR1cm4gYHJnYmEoMjU1LCAkezI1NSAtIGludGVuc2l0eSAqIDI1NX0sICR7MjU1IC0gaW50ZW5zaXR5ICogMjU1fSwgMSlgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwicmdiYSgyNTUsMjU1LDI1NSwgMC43KVwiO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIEdsb2JlLmFyY3NEYXRhKHRyYXZlbEhpc3RvcnkuZmxpZ2h0cylcbiAgICAgIC5hcmNDb2xvcigoZSkgPT4gKGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIikpXG4gICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IGUuYXJjQWx0KVxuICAgICAgLmFyY1N0cm9rZSgoZSkgPT4gKGUuc3RhdHVzID8gMC41IDogMC4zKSlcbiAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApO1xuICB9LCAxMDAwKTtcblxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5wb2ludHNEYXRhKE9iamVjdC52YWx1ZXMoY292aWREYXRhKSlcbiAgICAgIC5wb2ludEFsdGl0dWRlKChlKSA9PiBNYXRoLm1pbihlLnRvdGFsX2Nhc2VzIC8gMTAwMDAwMCwgMC41KSlcbiAgICAgIC5wb2ludFJhZGl1cygoZSkgPT4gTWF0aC5taW4oZS5uZXdfY2FzZXMgLyAxMDAwMDAsIDAuMSkpXG4gICAgICAucG9pbnRDb2xvcigoZSkgPT4gYHJnYmEoMjU1LCAkezI1NSAtIGUubmV3X2Nhc2VzIC8gMTAwMH0sICR7MjU1IC0gZS5uZXdfY2FzZXMgLyAxMDAwfSwgMSlgKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRzVHJhbnNpdGlvbkR1cmF0aW9uKDIwMDApO1xuICB9LCAxNTAwKTtcblxuICBjb25zdCBnbG9iZU1hdGVyaWFsID0gR2xvYmUuZ2xvYmVNYXRlcmlhbCgpO1xuICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgZ2xvYmVNYXRlcmlhbC5lbWlzc2l2ZSA9IG5ldyBDb2xvcigweDIyMDAzOCk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmVJbnRlbnNpdHkgPSAwLjE7XG4gIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbi8vIExvYWQgQ09WSUQgZGF0YVxuYXN5bmMgZnVuY3Rpb24gbG9hZENvdmlkRGF0YSgpIHtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9Vc2Vycy9zaHJhZGRoYS9EZXNrdG9wL2dpdGh1Yi1nbG9iZS1tYWluL3NyYy9vdXRwdXQuZ2VvanNvblwiKTsgLy8gUmVwbGFjZSB3aXRoIHRoZSBjb3JyZWN0IHBhdGggdG8geW91ciBmaWxlXG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmV0Y2ggR2VvSlNPTiBmaWxlOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gIH1cbiAgICBjb25zdCBnZW9qc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuXG4gIGdlb2pzb24uZmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgIGNvbnN0IGNvdW50cnlDb2RlID0gZmVhdHVyZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICBjb25zdCBjb3ZpZEluZm8gPSB7XG4gICAgICB0b3RhbF9jYXNlczogZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2Nhc2VzLFxuICAgICAgbmV3X2Nhc2VzOiBmZWF0dXJlLnByb3BlcnRpZXMubmV3X2Nhc2VzLFxuICAgIH07XG5cbiAgICBjb3ZpZERhdGFbY291bnRyeUNvZGVdID0gY292aWRJbmZvO1xuXG4gICAgLy8gTG9nIHRoZSBkYXRhIGZvciB2ZXJpZmljYXRpb25cbiAgICBjb25zb2xlLmxvZyhgQ291bnRyeTogJHtjb3VudHJ5Q29kZX0sIERhdGE6YCwgY292aWRJbmZvKTtcbiAgfSk7XG5cbiAgY29uc29sZS5sb2coXCJBbGwgQ09WSUQgZGF0YSBsb2FkZWQ6XCIsIGNvdmlkRGF0YSk7IC8vIExvZyBlbnRpcmUgZGF0YXNldFxufVxuXG5cbi8vIEFuaW1hdGUgQ09WSUQgZGF0YVxuZnVuY3Rpb24gYW5pbWF0ZUNvdmlkRGF0YSgpIHtcbiAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgIGNvbnN0IHVwZGF0ZWRDb3ZpZERhdGEgPSBPYmplY3QudmFsdWVzKGNvdmlkRGF0YSkubWFwKChkYXRhKSA9PiAoe1xuICAgICAgLi4uZGF0YSxcbiAgICAgIG5ld19jYXNlczogTWF0aC5yYW5kb20oKSAqIDEwMDAwMCwgLy8gRXhhbXBsZSB1cGRhdGUgZm9yIGFuaW1hdGlvblxuICAgIH0pKTtcblxuICAgIEdsb2JlLnBvaW50c0RhdGEodXBkYXRlZENvdmlkRGF0YSk7XG4gIH0sIDUwMDApOyAvLyBVcGRhdGUgZXZlcnkgNSBzZWNvbmRzXG59XG5cbi8vIExvYWQgQ09WSUQgZGF0YSBhbmQgaW5pdGlhbGl6ZVxubG9hZENvdmlkRGF0YSgpLnRoZW4oKCkgPT4ge1xuICBpbml0R2xvYmUoKTtcbiAgYW5pbWF0ZUNvdmlkRGF0YSgpO1xufSk7XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz0gKE1hdGguYWJzKG1vdXNlWCkgPD0gd2luZG93SGFsZlggLyAyID8gKG1vdXNlWCAvIDIgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAwNSA6IDApO1xuICBjYW1lcmEucG9zaXRpb24ueSArPSAoLW1vdXNlWSAvIDIgLSBjYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgY2FtZXJhLmxvb2tBdChzY2VuZS5wb3NpdGlvbik7XG4gIGNvbnRyb2xzLnVwZGF0ZSgpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiMDZmNDg2M2I3ZmUyYjQ2MGM2OTdcIiJdLCJzb3VyY2VSb290IjoiIn0=