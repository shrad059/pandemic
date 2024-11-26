self["webpackHotUpdatepandemic_globe"]("main",{

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', function () {
  const colorSlider = document.getElementById("colorSlider");
  const dateDisplay = document.getElementById("dateDisplay");

  // This should be your data
  const dates = [
    '2020-01-05', '2020-01-06', '2020-01-07', '2020-01-08' // Sample dates
  ];

  // Initialize slider max
  colorSlider.max = dates.length - 1;
  
  // Update date and color when slider value changes
  colorSlider.addEventListener('input', function (event) {
    const index = event.target.value;
    dateDisplay.textContent = `Date: ${dates[index]}`;

    // You can add more logic here to update the color as needed
  });

  // Initialize with the first value
  dateDisplay.textContent = `Date: ${dates[colorSlider.value]}`;
});


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => "454083fda6ccc27e6e17"
/******/ 	})();
/******/ 	
/******/ }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYW5kZW1pYy1nbG9iZS93ZWJwYWNrL3J1bnRpbWUvZ2V0RnVsbEhhc2giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsYUFBYTs7QUFFcEQ7QUFDQSxHQUFHOztBQUVIO0FBQ0EscUNBQXFDLHlCQUF5QjtBQUM5RCxDQUFDOzs7Ozs7Ozs7OztXQ3RCRCxvRCIsImZpbGUiOiJtYWluLmM4ZTFjMTYxYjIzOWI5YjlkMmViLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCBjb2xvclNsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29sb3JTbGlkZXJcIik7XG4gIGNvbnN0IGRhdGVEaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkYXRlRGlzcGxheVwiKTtcblxuICAvLyBUaGlzIHNob3VsZCBiZSB5b3VyIGRhdGFcbiAgY29uc3QgZGF0ZXMgPSBbXG4gICAgJzIwMjAtMDEtMDUnLCAnMjAyMC0wMS0wNicsICcyMDIwLTAxLTA3JywgJzIwMjAtMDEtMDgnIC8vIFNhbXBsZSBkYXRlc1xuICBdO1xuXG4gIC8vIEluaXRpYWxpemUgc2xpZGVyIG1heFxuICBjb2xvclNsaWRlci5tYXggPSBkYXRlcy5sZW5ndGggLSAxO1xuICBcbiAgLy8gVXBkYXRlIGRhdGUgYW5kIGNvbG9yIHdoZW4gc2xpZGVyIHZhbHVlIGNoYW5nZXNcbiAgY29sb3JTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICBkYXRlRGlzcGxheS50ZXh0Q29udGVudCA9IGBEYXRlOiAke2RhdGVzW2luZGV4XX1gO1xuXG4gICAgLy8gWW91IGNhbiBhZGQgbW9yZSBsb2dpYyBoZXJlIHRvIHVwZGF0ZSB0aGUgY29sb3IgYXMgbmVlZGVkXG4gIH0pO1xuXG4gIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgZmlyc3QgdmFsdWVcbiAgZGF0ZURpc3BsYXkudGV4dENvbnRlbnQgPSBgRGF0ZTogJHtkYXRlc1tjb2xvclNsaWRlci52YWx1ZV19YDtcbn0pO1xuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5oID0gKCkgPT4gXCI0NTQwODNmZGE2Y2NjMjdlNmUxN1wiIl0sInNvdXJjZVJvb3QiOiIifQ==