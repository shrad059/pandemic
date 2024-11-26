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





class GlobeApp {
  constructor() {
    this.renderer = null;
    this.camera = null;
    this.scene = null;
    this.controls = null;
    this.globe = null;
    this.covidData = {}; // To store COVID case data
    this.mouseX = 0;
    this.mouseY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.init();
    this.loadCovidData().then(() => {
      this.initGlobe();
    });
    this.onWindowResize();
    this.animate();
  }

  // Initialize ThreeJS core elements
  init() {
    // Initialize renderer
    this.renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Initialize scene
    this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
    this.scene.add(new three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight(0xbbbbbb, 0.3));
    this.scene.background = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x040d21);

    // Initialize camera
    this.camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera();
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(0, 0, 400);

    // Add lights
    const dLight = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    this.camera.add(dLight);

    const dLight1 = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    this.camera.add(dLight1);

    const dLight2 = new three__WEBPACK_IMPORTED_MODULE_2__.PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    this.camera.add(dLight2);

    this.scene.add(this.camera);

    // Add fog for effect
    this.scene.fog = new three__WEBPACK_IMPORTED_MODULE_2__.Fog(0x535ef3, 400, 2000);

    // Initialize controls
    this.controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_3__.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dynamicDampingFactor = 0.01;
    this.controls.enablePan = false;
    this.controls.minDistance = 200;
    this.controls.maxDistance = 500;
    this.controls.rotateSpeed = 0.8;
    this.controls.zoomSpeed = 1;
    this.controls.autoRotate = false;
    this.controls.minPolarAngle = Math.PI / 3.5;
    this.controls.maxPolarAngle = Math.PI - Math.PI / 3;

    // Event listeners
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  // Initialize the Globe
  initGlobe() {
    this.globe = new three_globe__WEBPACK_IMPORTED_MODULE_0__.default({
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
        const countryCode = e.properties.ISO_A3;
        const covidInfo = this.covidData[countryCode];

        // If there's COVID data for this country, modify its color based on cases
        if (covidInfo) {
          const totalCases = covidInfo.total_cases;
          const maxCases = 10000000; // Adjust this for your needs
          const intensity = Math.min(totalCases / maxCases, 1);
          return `rgba(255, ${255 - intensity * 255}, ${255 - intensity * 255}, 1)`;
        } else {
          return "rgba(255,255,255, 0.7)";
        }
      });

    // Add the globe to the scene
    this.scene.add(this.globe);

    // Rotate globe for better orientation
    this.globe.rotateY(-Math.PI * (5 / 9));
    this.globe.rotateZ(-Math.PI / 6);

    const globeMaterial = this.globe.globeMaterial();
    globeMaterial.color = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x3a228a);
    globeMaterial.emissive = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.7;

    // Start arc animations after the globe is initialized
    setTimeout(() => {
      this.startArcAnimations();
    }, 1000);
  }

  // Load COVID data from the output.geojson
  async loadCovidData() {
    const response = await fetch("./output.geojson");
    const geojson = await response.json();

    geojson.features.forEach((feature) => {
      const countryCode = feature.properties.ISO_A3;
      const covidInfo = {
        total_cases: feature.properties.total_cases,
        new_cases: feature.properties.new_cases,
      };

      this.covidData[countryCode] = covidInfo;
    });
  }

  // Start arc animations
  startArcAnimations() {
    if (!this.globe) return;

    this.globe
      .arcsData([])
      .arcColor(() => "#FF4000")
      .arcAltitude(() => 0.2)
      .arcStroke(() => 0.3)
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000);
  }

  // Handle mouse movement
  onMouseMove(event) {
    this.mouseX = event.clientX - this.windowHalfX;
    this.mouseY = event.clientY - this.windowHalfY;
  }

  // Handle window resize
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.windowHalfX = window.innerWidth / 1.5;
    this.windowHalfY = window.innerHeight / 1.5;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animate the scene
  animate() {
    this.camera.position.x +=
      Math.abs(this.mouseX) <= this.windowHalfX / 2
        ? (this.mouseX / 2 - this.camera.position.x) * 0.005
        : 0;
    this.camera.position.y += (-this.mouseY / 2 - this.camera.position.y) * 0.005;
    this.camera.lookAt(this.scene.position);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Create a new instance of the GlobeApp
new GlobeApp();


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "b62e2ce60b4b65fa40e0"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBcUM7QUFVdEI7QUFDOEQ7QUFDekI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdEQUFhLEVBQUUsa0JBQWtCO0FBQ3pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQix3Q0FBSztBQUMxQix1QkFBdUIsK0NBQVk7QUFDbkMsZ0NBQWdDLHdDQUFLOztBQUVyQztBQUNBLHNCQUFzQixvREFBaUI7QUFDdkM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLG1EQUFnQjtBQUN2QztBQUNBOztBQUVBLHdCQUF3QixtREFBZ0I7QUFDeEM7QUFDQTs7QUFFQSx3QkFBd0IsNkNBQVU7QUFDbEM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHlCQUF5QixzQ0FBRzs7QUFFNUI7QUFDQSx3QkFBd0IsdUZBQWE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQixnREFBVTtBQUMvQjtBQUNBO0FBQ0EsS0FBSztBQUNMLHVCQUF1QixnRUFBa0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0M7QUFDcEM7QUFDQSw4QkFBOEIsc0JBQXNCLElBQUksc0JBQXNCO0FBQzlFLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4Qix3Q0FBSztBQUNuQyxpQ0FBaUMsd0NBQUs7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7O1dDcE1BLG9EIiwiZmlsZSI6Im1haW4uYmU1MTUwMTdjOGE4ODU4ZDE3MTAuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUaHJlZUdsb2JlIGZyb20gXCJ0aHJlZS1nbG9iZVwiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIFBlcnNwZWN0aXZlQ2FtZXJhLFxuICBBbWJpZW50TGlnaHQsXG4gIERpcmVjdGlvbmFsTGlnaHQsXG4gIFBvaW50TGlnaHQsXG4gIENvbG9yLFxuICBGb2csXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scy5qc1wiO1xuaW1wb3J0IGNvdW50cmllcyBmcm9tIFwiLi9maWxlcy9nbG9iZS1kYXRhLW1pbi5qc29uXCI7XG5cbmNsYXNzIEdsb2JlQXBwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xuICAgIHRoaXMuZ2xvYmUgPSBudWxsO1xuICAgIHRoaXMuY292aWREYXRhID0ge307IC8vIFRvIHN0b3JlIENPVklEIGNhc2UgZGF0YVxuICAgIHRoaXMubW91c2VYID0gMDtcbiAgICB0aGlzLm1vdXNlWSA9IDA7XG4gICAgdGhpcy53aW5kb3dIYWxmWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLndpbmRvd0hhbGZZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcblxuICAgIHRoaXMuaW5pdCgpO1xuICAgIHRoaXMubG9hZENvdmlkRGF0YSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5pbml0R2xvYmUoKTtcbiAgICB9KTtcbiAgICB0aGlzLm9uV2luZG93UmVzaXplKCk7XG4gICAgdGhpcy5hbmltYXRlKCk7XG4gIH1cblxuICAvLyBJbml0aWFsaXplIFRocmVlSlMgY29yZSBlbGVtZW50c1xuICBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmVuZGVyZXJcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFdlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBzY2VuZVxuICAgIHRoaXMuc2NlbmUgPSBuZXcgU2NlbmUoKTtcbiAgICB0aGlzLnNjZW5lLmFkZChuZXcgQW1iaWVudExpZ2h0KDB4YmJiYmJiLCAwLjMpKTtcbiAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSBuZXcgQ29sb3IoMHgwNDBkMjEpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBjYW1lcmFcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBQZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMCwgNDAwKTtcblxuICAgIC8vIEFkZCBsaWdodHNcbiAgICBjb25zdCBkTGlnaHQgPSBuZXcgRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMC44KTtcbiAgICBkTGlnaHQucG9zaXRpb24uc2V0KC04MDAsIDIwMDAsIDQwMCk7XG4gICAgdGhpcy5jYW1lcmEuYWRkKGRMaWdodCk7XG5cbiAgICBjb25zdCBkTGlnaHQxID0gbmV3IERpcmVjdGlvbmFsTGlnaHQoMHg3OTgyZjYsIDEpO1xuICAgIGRMaWdodDEucG9zaXRpb24uc2V0KC0yMDAsIDUwMCwgMjAwKTtcbiAgICB0aGlzLmNhbWVyYS5hZGQoZExpZ2h0MSk7XG5cbiAgICBjb25zdCBkTGlnaHQyID0gbmV3IFBvaW50TGlnaHQoMHg4NTY2Y2MsIDAuNSk7XG4gICAgZExpZ2h0Mi5wb3NpdGlvbi5zZXQoLTIwMCwgNTAwLCAyMDApO1xuICAgIHRoaXMuY2FtZXJhLmFkZChkTGlnaHQyKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2FtZXJhKTtcblxuICAgIC8vIEFkZCBmb2cgZm9yIGVmZmVjdFxuICAgIHRoaXMuc2NlbmUuZm9nID0gbmV3IEZvZygweDUzNWVmMywgNDAwLCAyMDAwKTtcblxuICAgIC8vIEluaXRpYWxpemUgY29udHJvbHNcbiAgICB0aGlzLmNvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHModGhpcy5jYW1lcmEsIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgdGhpcy5jb250cm9scy5lbmFibGVEYW1waW5nID0gdHJ1ZTtcbiAgICB0aGlzLmNvbnRyb2xzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4wMTtcbiAgICB0aGlzLmNvbnRyb2xzLmVuYWJsZVBhbiA9IGZhbHNlO1xuICAgIHRoaXMuY29udHJvbHMubWluRGlzdGFuY2UgPSAyMDA7XG4gICAgdGhpcy5jb250cm9scy5tYXhEaXN0YW5jZSA9IDUwMDtcbiAgICB0aGlzLmNvbnRyb2xzLnJvdGF0ZVNwZWVkID0gMC44O1xuICAgIHRoaXMuY29udHJvbHMuem9vbVNwZWVkID0gMTtcbiAgICB0aGlzLmNvbnRyb2xzLmF1dG9Sb3RhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmNvbnRyb2xzLm1pblBvbGFyQW5nbGUgPSBNYXRoLlBJIC8gMy41O1xuICAgIHRoaXMuY29udHJvbHMubWF4UG9sYXJBbmdsZSA9IE1hdGguUEkgLSBNYXRoLlBJIC8gMztcblxuICAgIC8vIEV2ZW50IGxpc3RlbmVyc1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKSwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8vIEluaXRpYWxpemUgdGhlIEdsb2JlXG4gIGluaXRHbG9iZSgpIHtcbiAgICB0aGlzLmdsb2JlID0gbmV3IFRocmVlR2xvYmUoe1xuICAgICAgd2FpdEZvckdsb2JlUmVhZHk6IHRydWUsXG4gICAgICBhbmltYXRlSW46IHRydWUsXG4gICAgfSlcbiAgICAgIC5oZXhQb2x5Z29uc0RhdGEoY291bnRyaWVzLmZlYXR1cmVzKVxuICAgICAgLmhleFBvbHlnb25SZXNvbHV0aW9uKDMpXG4gICAgICAuaGV4UG9seWdvbk1hcmdpbigwLjcpXG4gICAgICAuc2hvd0F0bW9zcGhlcmUodHJ1ZSlcbiAgICAgIC5hdG1vc3BoZXJlQ29sb3IoXCIjM2EyMjhhXCIpXG4gICAgICAuYXRtb3NwaGVyZUFsdGl0dWRlKDAuMjUpXG4gICAgICAuaGV4UG9seWdvbkNvbG9yKChlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50cnlDb2RlID0gZS5wcm9wZXJ0aWVzLklTT19BMztcbiAgICAgICAgY29uc3QgY292aWRJbmZvID0gdGhpcy5jb3ZpZERhdGFbY291bnRyeUNvZGVdO1xuXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgQ09WSUQgZGF0YSBmb3IgdGhpcyBjb3VudHJ5LCBtb2RpZnkgaXRzIGNvbG9yIGJhc2VkIG9uIGNhc2VzXG4gICAgICAgIGlmIChjb3ZpZEluZm8pIHtcbiAgICAgICAgICBjb25zdCB0b3RhbENhc2VzID0gY292aWRJbmZvLnRvdGFsX2Nhc2VzO1xuICAgICAgICAgIGNvbnN0IG1heENhc2VzID0gMTAwMDAwMDA7IC8vIEFkanVzdCB0aGlzIGZvciB5b3VyIG5lZWRzXG4gICAgICAgICAgY29uc3QgaW50ZW5zaXR5ID0gTWF0aC5taW4odG90YWxDYXNlcyAvIG1heENhc2VzLCAxKTtcbiAgICAgICAgICByZXR1cm4gYHJnYmEoMjU1LCAkezI1NSAtIGludGVuc2l0eSAqIDI1NX0sICR7MjU1IC0gaW50ZW5zaXR5ICogMjU1fSwgMSlgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBcInJnYmEoMjU1LDI1NSwyNTUsIDAuNylcIjtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAvLyBBZGQgdGhlIGdsb2JlIHRvIHRoZSBzY2VuZVxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuZ2xvYmUpO1xuXG4gICAgLy8gUm90YXRlIGdsb2JlIGZvciBiZXR0ZXIgb3JpZW50YXRpb25cbiAgICB0aGlzLmdsb2JlLnJvdGF0ZVkoLU1hdGguUEkgKiAoNSAvIDkpKTtcbiAgICB0aGlzLmdsb2JlLnJvdGF0ZVooLU1hdGguUEkgLyA2KTtcblxuICAgIGNvbnN0IGdsb2JlTWF0ZXJpYWwgPSB0aGlzLmdsb2JlLmdsb2JlTWF0ZXJpYWwoKTtcbiAgICBnbG9iZU1hdGVyaWFsLmNvbG9yID0gbmV3IENvbG9yKDB4M2EyMjhhKTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlID0gbmV3IENvbG9yKDB4MjIwMDM4KTtcbiAgICBnbG9iZU1hdGVyaWFsLmVtaXNzaXZlSW50ZW5zaXR5ID0gMC4xO1xuICAgIGdsb2JlTWF0ZXJpYWwuc2hpbmluZXNzID0gMC43O1xuXG4gICAgLy8gU3RhcnQgYXJjIGFuaW1hdGlvbnMgYWZ0ZXIgdGhlIGdsb2JlIGlzIGluaXRpYWxpemVkXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnN0YXJ0QXJjQW5pbWF0aW9ucygpO1xuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgLy8gTG9hZCBDT1ZJRCBkYXRhIGZyb20gdGhlIG91dHB1dC5nZW9qc29uXG4gIGFzeW5jIGxvYWRDb3ZpZERhdGEoKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi4vb3V0cHV0Lmdlb2pzb25cIik7XG4gICAgY29uc3QgZ2VvanNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGdlb2pzb24uZmVhdHVyZXMuZm9yRWFjaCgoZmVhdHVyZSkgPT4ge1xuICAgICAgY29uc3QgY291bnRyeUNvZGUgPSBmZWF0dXJlLnByb3BlcnRpZXMuSVNPX0EzO1xuICAgICAgY29uc3QgY292aWRJbmZvID0ge1xuICAgICAgICB0b3RhbF9jYXNlczogZmVhdHVyZS5wcm9wZXJ0aWVzLnRvdGFsX2Nhc2VzLFxuICAgICAgICBuZXdfY2FzZXM6IGZlYXR1cmUucHJvcGVydGllcy5uZXdfY2FzZXMsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmNvdmlkRGF0YVtjb3VudHJ5Q29kZV0gPSBjb3ZpZEluZm87XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdGFydCBhcmMgYW5pbWF0aW9uc1xuICBzdGFydEFyY0FuaW1hdGlvbnMoKSB7XG4gICAgaWYgKCF0aGlzLmdsb2JlKSByZXR1cm47XG5cbiAgICB0aGlzLmdsb2JlXG4gICAgICAuYXJjc0RhdGEoW10pXG4gICAgICAuYXJjQ29sb3IoKCkgPT4gXCIjRkY0MDAwXCIpXG4gICAgICAuYXJjQWx0aXR1ZGUoKCkgPT4gMC4yKVxuICAgICAgLmFyY1N0cm9rZSgoKSA9PiAwLjMpXG4gICAgICAuYXJjRGFzaExlbmd0aCgwLjkpXG4gICAgICAuYXJjRGFzaEdhcCg0KVxuICAgICAgLmFyY0Rhc2hBbmltYXRlVGltZSgxMDAwKTtcbiAgfVxuXG4gIC8vIEhhbmRsZSBtb3VzZSBtb3ZlbWVudFxuICBvbk1vdXNlTW92ZShldmVudCkge1xuICAgIHRoaXMubW91c2VYID0gZXZlbnQuY2xpZW50WCAtIHRoaXMud2luZG93SGFsZlg7XG4gICAgdGhpcy5tb3VzZVkgPSBldmVudC5jbGllbnRZIC0gdGhpcy53aW5kb3dIYWxmWTtcbiAgfVxuXG4gIC8vIEhhbmRsZSB3aW5kb3cgcmVzaXplXG4gIG9uV2luZG93UmVzaXplKCkge1xuICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICB0aGlzLndpbmRvd0hhbGZYID0gd2luZG93LmlubmVyV2lkdGggLyAxLjU7XG4gICAgdGhpcy53aW5kb3dIYWxmWSA9IHdpbmRvdy5pbm5lckhlaWdodCAvIDEuNTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIH1cblxuICAvLyBBbmltYXRlIHRoZSBzY2VuZVxuICBhbmltYXRlKCkge1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnggKz1cbiAgICAgIE1hdGguYWJzKHRoaXMubW91c2VYKSA8PSB0aGlzLndpbmRvd0hhbGZYIC8gMlxuICAgICAgICA/ICh0aGlzLm1vdXNlWCAvIDIgLSB0aGlzLmNhbWVyYS5wb3NpdGlvbi54KSAqIDAuMDA1XG4gICAgICAgIDogMDtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ICs9ICgtdGhpcy5tb3VzZVkgLyAyIC0gdGhpcy5jYW1lcmEucG9zaXRpb24ueSkgKiAwLjAwNTtcbiAgICB0aGlzLmNhbWVyYS5sb29rQXQodGhpcy5zY2VuZS5wb3NpdGlvbik7XG4gICAgdGhpcy5jb250cm9scy51cGRhdGUoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYSk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0ZS5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG4vLyBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEdsb2JlQXBwXG5uZXcgR2xvYmVBcHAoKTtcbiIsIl9fd2VicGFja19yZXF1aXJlX18uaCA9ICgpID0+IFwiYjYyZTJjZTYwYjRiNjVmYTQwZTBcIiJdLCJzb3VyY2VSb290IjoiIn0=