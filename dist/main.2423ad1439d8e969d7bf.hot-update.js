self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./node_modules/three-glow-mesh/dist/index.module.js":
/*!***********************************************************!*\
  !*** ./node_modules/three-glow-mesh/dist/index.module.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createGlowGeometry": () => /* binding */ c,
/* harmony export */   "createGlowMaterial": () => /* binding */ a,
/* harmony export */   "createGlowMesh": () => /* binding */ v,
/* harmony export */   "defaultOptions": () => /* binding */ t
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
var t={backside:!0,coefficient:.5,color:"gold",size:2,power:1};function a(o,n,i){return new three__WEBPACK_IMPORTED_MODULE_0__.ShaderMaterial({depthWrite:!1,fragmentShader:"\nuniform vec3 color;\nuniform float coefficient;\nuniform float power;\nvarying vec3 vVertexNormal;\nvarying vec3 vVertexWorldPosition;\nvoid main() {\n  vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;\n  vec3 viewCameraToVertex\t= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;\n  viewCameraToVertex = normalize(viewCameraToVertex);\n  float intensity\t= pow(\n    coefficient + dot(vVertexNormal, viewCameraToVertex),\n    power\n  );\n  gl_FragColor = vec4(color, intensity);\n}",transparent:!0,uniforms:{coefficient:{value:o},color:{value:new three__WEBPACK_IMPORTED_MODULE_0__.Color(n)},power:{value:i}},vertexShader:"\nvarying vec3 vVertexWorldPosition;\nvarying vec3 vVertexNormal;\nvoid main() {\n  vVertexNormal\t= normalize(normalMatrix * normal);\n  vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;\n  gl_Position\t= projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"})}function c(e,r){var n=e.clone(),i=new Array(n.vertices.length);return n.faces.forEach(function(e){e instanceof three__WEBPACK_IMPORTED_MODULE_0__.Face3?(i[e.a]=e.vertexNormals[0],i[e.b]=e.vertexNormals[1],i[e.c]=e.vertexNormals[2]):console.error("Face needs to be an instance of THREE.Face3.")}),n.vertices.forEach(function(e,o){var n=i[o],t=n.y,a=n.z;e.x+=n.x*r,e.y+=t*r,e.z+=a*r}),n}function v(e,r){void 0===r&&(r=t);var o=r.backside,v=r.coefficient,l=r.color,f=r.power,m=c(e,r.size),x=a(v,l,f);return o&&(x.side=three__WEBPACK_IMPORTED_MODULE_0__.BackSide),new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(m,x)}
//# sourceMappingURL=index.module.js.map


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three_globe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three-globe */ "./node_modules/three-globe/dist/three-globe.module.js");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_glow_mesh__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three-glow-mesh */ "./node_modules/three-glow-mesh/dist/index.module.js");
/* harmony import */ var _files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./files/globe-data-min.json */ "./src/files/globe-data-min.json");
/* harmony import */ var _files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./files/my-flights.json */ "./src/files/my-flights.json");
/* harmony import */ var _files_my_airports_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./files/my-airports.json */ "./src/files/my-airports.json");








var renderer, camera, scene, controls;
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var Globe;

init();
initGlobe();
onWindowResize();
animate();

// SECTION Initializing core ThreeJS elements
function init() {
  // Initialize renderer
  renderer = new three__WEBPACK_IMPORTED_MODULE_5__.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Initialize scene, light
  scene = new three__WEBPACK_IMPORTED_MODULE_5__.Scene();
  scene.add(new three__WEBPACK_IMPORTED_MODULE_5__.AmbientLight(0xbbbbbb, 0.3));
  scene.background = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x040d21);

  // Initialize camera, light
  camera = new three__WEBPACK_IMPORTED_MODULE_5__.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new three__WEBPACK_IMPORTED_MODULE_5__.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new three__WEBPACK_IMPORTED_MODULE_5__.PointLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);

  // Additional effects
  scene.fog = new three__WEBPACK_IMPORTED_MODULE_5__.Fog(0x535ef3, 400, 2000);

  // Helpers
  // const axesHelper = new AxesHelper(800);
  // scene.add(axesHelper);
  // var helper = new DirectionalLightHelper(dLight);
  // scene.add(helper);
  // var helperCamera = new CameraHelper(dLight.shadow.camera);
  // scene.add(helperCamera);

  // Initialize controls
  controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_6__.OrbitControls(camera, renderer.domElement);
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
  // Initialize the Globe
  Globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(_files_globe_data_min_json__WEBPACK_IMPORTED_MODULE_2__.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(true)
    .atmosphereColor("#3a228a")
    .atmosphereAltitude(0.25)
    .hexPolygonColor((e) => {
      if (
        ["KGZ", "KOR", "THA", "RUS", "UZB", "IDN", "KAZ", "MYS"].includes(
          e.properties.ISO_A3
        )
      ) {
        return "rgba(255,255,255, 1)";
      } else return "rgba(255,255,255, 0.7)";
    });

  // NOTE Arc animations are followed after the globe enters the scene
  setTimeout(() => {
    Globe.arcsData(_files_my_flights_json__WEBPACK_IMPORTED_MODULE_3__.flights)
      .arcColor((e) => {
        return e.status ? "#9cff00" : "#FF4000";
      })
      .arcAltitude((e) => {
        return e.arcAlt;
      })
      .arcStroke((e) => {
        return e.status ? 0.5 : 0.3;
      })
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap((e) => e.order * 1)
      // .labelsData(airportHistory.airports)
      .labelColor(() => "#ffcb21")
      .labelDotOrientation((e) => {
        return e.text === "ALA" ? "top" : "right";
      })
      .labelDotRadius(0.3)
      .labelSize((e) => e.size)
      .labelText("city")
      .labelResolution(6)
      .labelAltitude(0.01)
      // .pointsData(airportHistory.airports)
      .pointColor(() => "#ffffff")
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);
  }, 1000);

  Globe.rotateY(-Math.PI * (5 / 9));
  Globe.rotateZ(-Math.PI / 6);
  const globeMaterial = Globe.globeMaterial();
  globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x3a228a);
  globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_5__.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

  // NOTE Cool stuff
  // globeMaterial.wireframe = true;

  scene.add(Globe);
}

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
  // console.log("x: " + mouseX + " y: " + mouseY);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
  renderer.setSize(window.innerWidth, window.innerHeight);
}

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
/******/ 		__webpack_require__.h = () => "bb3d3d5de05f1e1e6319"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL25vZGVfbW9kdWxlcy90aHJlZS1nbG93LW1lc2gvZGlzdC9pbmRleC5tb2R1bGUuanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFuZGVtaWMtZ2xvYmUvd2VicGFjay9ydW50aW1lL2dldEZ1bGxIYXNoIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXFGLE9BQU8sd0RBQXdELGtCQUFrQixXQUFXLGlEQUFDLEVBQUUsbURBQW1ELDRCQUE0QixzQkFBc0IsNkJBQTZCLG9DQUFvQyxlQUFlLHFFQUFxRSxpRkFBaUYsdURBQXVELHVHQUF1RywwQ0FBMEMsR0FBRywyQkFBMkIsYUFBYSxRQUFRLFFBQVEsVUFBVSx3Q0FBQyxJQUFJLFFBQVEsU0FBUyxtREFBbUQsNkJBQTZCLGVBQWUsc0RBQXNELG1FQUFtRSw0RUFBNEUsR0FBRyxJQUFJLEVBQUUsZ0JBQWdCLCtDQUErQyxtQ0FBbUMsYUFBYSx3Q0FBQywrSUFBK0ksbUNBQW1DLHVCQUF1Qiw2QkFBNkIsSUFBSSxnQkFBZ0Isa0JBQWtCLDhFQUE4RSxrQkFBa0IsMkNBQUMsTUFBTSx1Q0FBQyxNQUFzRztBQUN6cEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRHFDO0FBQ1E7QUFZOUI7QUFDOEQ7QUFDNUI7QUFDRztBQUNBO0FBQ0U7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixnREFBYSxFQUFFLGtCQUFrQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsd0NBQUs7QUFDbkIsZ0JBQWdCLCtDQUFZO0FBQzVCLHlCQUF5Qix3Q0FBSzs7QUFFOUI7QUFDQSxlQUFlLG9EQUFpQjtBQUNoQztBQUNBOztBQUVBLG1CQUFtQixtREFBZ0I7QUFDbkM7QUFDQTs7QUFFQSxvQkFBb0IsbURBQWdCO0FBQ3BDO0FBQ0E7O0FBRUEsb0JBQW9CLDZDQUFVO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esa0JBQWtCLHNDQUFHOztBQUVyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQix1RkFBYTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsZ0RBQVU7QUFDeEI7QUFDQTtBQUNBLEdBQUc7QUFDSCxxQkFBcUIsZ0VBQWtCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQSxtQkFBbUIsMkRBQXFCO0FBQ3hDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLHdDQUFLO0FBQ2pDLCtCQUErQix3Q0FBSztBQUNwQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O1dDaE1BLG9EIiwiZmlsZSI6Im1haW4uMjQyM2FkMTQzOWQ4ZTk2OWQ3YmYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydHtTaGFkZXJNYXRlcmlhbCBhcyBlLENvbG9yIGFzIHIsRmFjZTMgYXMgbyxCYWNrU2lkZSBhcyBuLE1lc2ggYXMgaX1mcm9tXCJ0aHJlZVwiO3ZhciB0PXtiYWNrc2lkZTohMCxjb2VmZmljaWVudDouNSxjb2xvcjpcImdvbGRcIixzaXplOjIscG93ZXI6MX07ZnVuY3Rpb24gYShvLG4saSl7cmV0dXJuIG5ldyBlKHtkZXB0aFdyaXRlOiExLGZyYWdtZW50U2hhZGVyOlwiXFxudW5pZm9ybSB2ZWMzIGNvbG9yO1xcbnVuaWZvcm0gZmxvYXQgY29lZmZpY2llbnQ7XFxudW5pZm9ybSBmbG9hdCBwb3dlcjtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleE5vcm1hbDtcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFdvcmxkUG9zaXRpb247XFxudm9pZCBtYWluKCkge1xcbiAgdmVjMyB3b3JsZENhbWVyYVRvVmVydGV4ID0gdlZlcnRleFdvcmxkUG9zaXRpb24gLSBjYW1lcmFQb3NpdGlvbjtcXG4gIHZlYzMgdmlld0NhbWVyYVRvVmVydGV4XFx0PSAodmlld01hdHJpeCAqIHZlYzQod29ybGRDYW1lcmFUb1ZlcnRleCwgMC4wKSkueHl6O1xcbiAgdmlld0NhbWVyYVRvVmVydGV4ID0gbm9ybWFsaXplKHZpZXdDYW1lcmFUb1ZlcnRleCk7XFxuICBmbG9hdCBpbnRlbnNpdHlcXHQ9IHBvdyhcXG4gICAgY29lZmZpY2llbnQgKyBkb3QodlZlcnRleE5vcm1hbCwgdmlld0NhbWVyYVRvVmVydGV4KSxcXG4gICAgcG93ZXJcXG4gICk7XFxuICBnbF9GcmFnQ29sb3IgPSB2ZWM0KGNvbG9yLCBpbnRlbnNpdHkpO1xcbn1cIix0cmFuc3BhcmVudDohMCx1bmlmb3Jtczp7Y29lZmZpY2llbnQ6e3ZhbHVlOm99LGNvbG9yOnt2YWx1ZTpuZXcgcihuKX0scG93ZXI6e3ZhbHVlOml9fSx2ZXJ0ZXhTaGFkZXI6XCJcXG52YXJ5aW5nIHZlYzMgdlZlcnRleFdvcmxkUG9zaXRpb247XFxudmFyeWluZyB2ZWMzIHZWZXJ0ZXhOb3JtYWw7XFxudm9pZCBtYWluKCkge1xcbiAgdlZlcnRleE5vcm1hbFxcdD0gbm9ybWFsaXplKG5vcm1hbE1hdHJpeCAqIG5vcm1hbCk7XFxuICB2VmVydGV4V29ybGRQb3NpdGlvbiA9IChtb2RlbE1hdHJpeCAqIHZlYzQocG9zaXRpb24sIDEuMCkpLnh5ejtcXG4gIGdsX1Bvc2l0aW9uXFx0PSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNChwb3NpdGlvbiwgMS4wKTtcXG59XFxuXCJ9KX1mdW5jdGlvbiBjKGUscil7dmFyIG49ZS5jbG9uZSgpLGk9bmV3IEFycmF5KG4udmVydGljZXMubGVuZ3RoKTtyZXR1cm4gbi5mYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UgaW5zdGFuY2VvZiBvPyhpW2UuYV09ZS52ZXJ0ZXhOb3JtYWxzWzBdLGlbZS5iXT1lLnZlcnRleE5vcm1hbHNbMV0saVtlLmNdPWUudmVydGV4Tm9ybWFsc1syXSk6Y29uc29sZS5lcnJvcihcIkZhY2UgbmVlZHMgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgVEhSRUUuRmFjZTMuXCIpfSksbi52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uKGUsbyl7dmFyIG49aVtvXSx0PW4ueSxhPW4uejtlLngrPW4ueCpyLGUueSs9dCpyLGUueis9YSpyfSksbn1mdW5jdGlvbiB2KGUscil7dm9pZCAwPT09ciYmKHI9dCk7dmFyIG89ci5iYWNrc2lkZSx2PXIuY29lZmZpY2llbnQsbD1yLmNvbG9yLGY9ci5wb3dlcixtPWMoZSxyLnNpemUpLHg9YSh2LGwsZik7cmV0dXJuIG8mJih4LnNpZGU9biksbmV3IGkobSx4KX1leHBvcnR7YyBhcyBjcmVhdGVHbG93R2VvbWV0cnksYSBhcyBjcmVhdGVHbG93TWF0ZXJpYWwsdiBhcyBjcmVhdGVHbG93TWVzaCx0IGFzIGRlZmF1bHRPcHRpb25zfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgU2NlbmUgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7XG4gIFBlcnNwZWN0aXZlQ2FtZXJhLFxuICBBbWJpZW50TGlnaHQsXG4gIERpcmVjdGlvbmFsTGlnaHQsXG4gIENvbG9yLFxuICBGb2csXG4gIC8vIEF4ZXNIZWxwZXIsXG4gIC8vIERpcmVjdGlvbmFsTGlnaHRIZWxwZXIsXG4gIC8vIENhbWVyYUhlbHBlcixcbiAgUG9pbnRMaWdodCxcbiAgU3BoZXJlR2VvbWV0cnksXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IHsgY3JlYXRlR2xvd01lc2ggfSBmcm9tIFwidGhyZWUtZ2xvdy1tZXNoXCI7XG5pbXBvcnQgY291bnRyaWVzIGZyb20gXCIuL2ZpbGVzL2dsb2JlLWRhdGEtbWluLmpzb25cIjtcbmltcG9ydCB0cmF2ZWxIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWZsaWdodHMuanNvblwiO1xuaW1wb3J0IGFpcnBvcnRIaXN0b3J5IGZyb20gXCIuL2ZpbGVzL215LWFpcnBvcnRzLmpzb25cIjtcbnZhciByZW5kZXJlciwgY2FtZXJhLCBzY2VuZSwgY29udHJvbHM7XG5sZXQgbW91c2VYID0gMDtcbmxldCBtb3VzZVkgPSAwO1xubGV0IHdpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAyO1xubGV0IHdpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbnZhciBHbG9iZTtcblxuaW5pdCgpO1xuaW5pdEdsb2JlKCk7XG5vbldpbmRvd1Jlc2l6ZSgpO1xuYW5pbWF0ZSgpO1xuXG4vLyBTRUNUSU9OIEluaXRpYWxpemluZyBjb3JlIFRocmVlSlMgZWxlbWVudHNcbmZ1bmN0aW9uIGluaXQoKSB7XG4gIC8vIEluaXRpYWxpemUgcmVuZGVyZXJcbiAgcmVuZGVyZXIgPSBuZXcgV2ViR0xSZW5kZXJlcih7IGFudGlhbGlhczogdHJ1ZSB9KTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIC8vIHJlbmRlcmVyLm91dHB1dEVuY29kaW5nID0gVEhSRUUuc1JHQkVuY29kaW5nO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gIC8vIEluaXRpYWxpemUgc2NlbmUsIGxpZ2h0XG4gIHNjZW5lID0gbmV3IFNjZW5lKCk7XG4gIHNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBDb2xvcigweDA0MGQyMSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjYW1lcmEsIGxpZ2h0XG4gIGNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICBjYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG5cbiAgdmFyIGRMaWdodCA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xuICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gIGNhbWVyYS5hZGQoZExpZ2h0KTtcblxuICB2YXIgZExpZ2h0MSA9IG5ldyBEaXJlY3Rpb25hbExpZ2h0KDB4Nzk4MmY2LCAxKTtcbiAgZExpZ2h0MS5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICBjYW1lcmEuYWRkKGRMaWdodDEpO1xuXG4gIHZhciBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gIGRMaWdodDIucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICBjYW1lcmEucG9zaXRpb24ueiA9IDQwMDtcbiAgY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICBjYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgc2NlbmUuYWRkKGNhbWVyYSk7XG5cbiAgLy8gQWRkaXRpb25hbCBlZmZlY3RzXG4gIHNjZW5lLmZvZyA9IG5ldyBGb2coMHg1MzVlZjMsIDQwMCwgMjAwMCk7XG5cbiAgLy8gSGVscGVyc1xuICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IEF4ZXNIZWxwZXIoODAwKTtcbiAgLy8gc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuICAvLyB2YXIgaGVscGVyID0gbmV3IERpcmVjdGlvbmFsTGlnaHRIZWxwZXIoZExpZ2h0KTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlcik7XG4gIC8vIHZhciBoZWxwZXJDYW1lcmEgPSBuZXcgQ2FtZXJhSGVscGVyKGRMaWdodC5zaGFkb3cuY2FtZXJhKTtcbiAgLy8gc2NlbmUuYWRkKGhlbHBlckNhbWVyYSk7XG5cbiAgLy8gSW5pdGlhbGl6ZSBjb250cm9sc1xuICBjb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGNvbnRyb2xzLmVuYWJsZURhbXBpbmcgPSB0cnVlO1xuICBjb250cm9scy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMDE7XG4gIGNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICBjb250cm9scy5taW5EaXN0YW5jZSA9IDIwMDtcbiAgY29udHJvbHMubWF4RGlzdGFuY2UgPSA1MDA7XG4gIGNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICBjb250cm9scy56b29tU3BlZWQgPSAxO1xuICBjb250cm9scy5hdXRvUm90YXRlID0gZmFsc2U7XG5cbiAgY29udHJvbHMubWluUG9sYXJBbmdsZSA9IE1hdGguUEkgLyAzLjU7XG4gIGNvbnRyb2xzLm1heFBvbGFyQW5nbGUgPSBNYXRoLlBJIC0gTWF0aC5QSSAvIDM7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgb25XaW5kb3dSZXNpemUsIGZhbHNlKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBvbk1vdXNlTW92ZSk7XG59XG5cbi8vIFNFQ1RJT04gR2xvYmVcbmZ1bmN0aW9uIGluaXRHbG9iZSgpIHtcbiAgLy8gSW5pdGlhbGl6ZSB0aGUgR2xvYmVcbiAgR2xvYmUgPSBuZXcgVGhyZWVHbG9iZSh7XG4gICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgYW5pbWF0ZUluOiB0cnVlLFxuICB9KVxuICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgIC5oZXhQb2x5Z29uUmVzb2x1dGlvbigzKVxuICAgIC5oZXhQb2x5Z29uTWFyZ2luKDAuNylcbiAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAuYXRtb3NwaGVyZUNvbG9yKFwiIzNhMjI4YVwiKVxuICAgIC5hdG1vc3BoZXJlQWx0aXR1ZGUoMC4yNSlcbiAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICBpZiAoXG4gICAgICAgIFtcIktHWlwiLCBcIktPUlwiLCBcIlRIQVwiLCBcIlJVU1wiLCBcIlVaQlwiLCBcIklETlwiLCBcIktBWlwiLCBcIk1ZU1wiXS5pbmNsdWRlcyhcbiAgICAgICAgICBlLnByb3BlcnRpZXMuSVNPX0EzXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gXCJyZ2JhKDI1NSwyNTUsMjU1LCAxKVwiO1xuICAgICAgfSBlbHNlIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNylcIjtcbiAgICB9KTtcblxuICAvLyBOT1RFIEFyYyBhbmltYXRpb25zIGFyZSBmb2xsb3dlZCBhZnRlciB0aGUgZ2xvYmUgZW50ZXJzIHRoZSBzY2VuZVxuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICBHbG9iZS5hcmNzRGF0YSh0cmF2ZWxIaXN0b3J5LmZsaWdodHMpXG4gICAgICAuYXJjQ29sb3IoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gXCIjOWNmZjAwXCIgOiBcIiNGRjQwMDBcIjtcbiAgICAgIH0pXG4gICAgICAuYXJjQWx0aXR1ZGUoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuYXJjQWx0O1xuICAgICAgfSlcbiAgICAgIC5hcmNTdHJva2UoKGUpID0+IHtcbiAgICAgICAgcmV0dXJuIGUuc3RhdHVzID8gMC41IDogMC4zO1xuICAgICAgfSlcbiAgICAgIC5hcmNEYXNoTGVuZ3RoKDAuOSlcbiAgICAgIC5hcmNEYXNoR2FwKDQpXG4gICAgICAuYXJjRGFzaEFuaW1hdGVUaW1lKDEwMDApXG4gICAgICAuYXJjc1RyYW5zaXRpb25EdXJhdGlvbigxMDAwKVxuICAgICAgLmFyY0Rhc2hJbml0aWFsR2FwKChlKSA9PiBlLm9yZGVyICogMSlcbiAgICAgIC8vIC5sYWJlbHNEYXRhKGFpcnBvcnRIaXN0b3J5LmFpcnBvcnRzKVxuICAgICAgLmxhYmVsQ29sb3IoKCkgPT4gXCIjZmZjYjIxXCIpXG4gICAgICAubGFiZWxEb3RPcmllbnRhdGlvbigoZSkgPT4ge1xuICAgICAgICByZXR1cm4gZS50ZXh0ID09PSBcIkFMQVwiID8gXCJ0b3BcIiA6IFwicmlnaHRcIjtcbiAgICAgIH0pXG4gICAgICAubGFiZWxEb3RSYWRpdXMoMC4zKVxuICAgICAgLmxhYmVsU2l6ZSgoZSkgPT4gZS5zaXplKVxuICAgICAgLmxhYmVsVGV4dChcImNpdHlcIilcbiAgICAgIC5sYWJlbFJlc29sdXRpb24oNilcbiAgICAgIC5sYWJlbEFsdGl0dWRlKDAuMDEpXG4gICAgICAvLyAucG9pbnRzRGF0YShhaXJwb3J0SGlzdG9yeS5haXJwb3J0cylcbiAgICAgIC5wb2ludENvbG9yKCgpID0+IFwiI2ZmZmZmZlwiKVxuICAgICAgLnBvaW50c01lcmdlKHRydWUpXG4gICAgICAucG9pbnRBbHRpdHVkZSgwLjA3KVxuICAgICAgLnBvaW50UmFkaXVzKDAuMDUpO1xuICB9LCAxMDAwKTtcblxuICBHbG9iZS5yb3RhdGVZKC1NYXRoLlBJICogKDUgLyA5KSk7XG4gIEdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcbiAgY29uc3QgZ2xvYmVNYXRlcmlhbCA9IEdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgZ2xvYmVNYXRlcmlhbC5jb2xvciA9IG5ldyBDb2xvcigweDNhMjI4YSk7XG4gIGdsb2JlTWF0ZXJpYWwuZW1pc3NpdmUgPSBuZXcgQ29sb3IoMHgyMjAwMzgpO1xuICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICBnbG9iZU1hdGVyaWFsLnNoaW5pbmVzcyA9IDAuNztcblxuICAvLyBOT1RFIENvb2wgc3R1ZmZcbiAgLy8gZ2xvYmVNYXRlcmlhbC53aXJlZnJhbWUgPSB0cnVlO1xuXG4gIHNjZW5lLmFkZChHbG9iZSk7XG59XG5cbmZ1bmN0aW9uIG9uTW91c2VNb3ZlKGV2ZW50KSB7XG4gIG1vdXNlWCA9IGV2ZW50LmNsaWVudFggLSB3aW5kb3dIYWxmWDtcbiAgbW91c2VZID0gZXZlbnQuY2xpZW50WSAtIHdpbmRvd0hhbGZZO1xuICAvLyBjb25zb2xlLmxvZyhcIng6IFwiICsgbW91c2VYICsgXCIgeTogXCIgKyBtb3VzZVkpO1xufVxuXG5mdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICBjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB3aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMS41O1xuICB3aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICBNYXRoLmFicyhtb3VzZVgpIDw9IHdpbmRvd0hhbGZYIC8gMlxuICAgICAgPyAobW91c2VYIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICA6IDA7XG4gIGNhbWVyYS5wb3NpdGlvbi55ICs9ICgtbW91c2VZIC8gMiAtIGNhbWVyYS5wb3NpdGlvbi55KSAqIDAuMDA1O1xuICBjYW1lcmEubG9va0F0KHNjZW5lLnBvc2l0aW9uKTtcbiAgY29udHJvbHMudXBkYXRlKCk7XG4gIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xufVxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCJiYjNkM2Q1ZGUwNWYxZTFlNjMxOVwiIl0sInNvdXJjZVJvb3QiOiIifQ==