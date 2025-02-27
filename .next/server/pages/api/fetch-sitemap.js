"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/fetch-sitemap";
exports.ids = ["pages/api/fetch-sitemap"];
exports.modules = {

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(api)/./pages/api/fetch-sitemap.js":
/*!************************************!*\
  !*** ./pages/api/fetch-sitemap.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst execPromise = (0,util__WEBPACK_IMPORTED_MODULE_1__.promisify)(child_process__WEBPACK_IMPORTED_MODULE_0__.exec);\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { url  } = req.body;\n            if (!url) {\n                return res.status(400).json({\n                    error: \"\\u8BF7\\u63D0\\u4F9BURL\"\n                });\n            }\n            const { stdout , stderr  } = await execPromise(`python sitemap_diff.py fetch ${url}`);\n            if (stderr) {\n                console.error(\"Error:\", stderr);\n                return res.status(500).json({\n                    error: stderr\n                });\n            }\n            return res.status(200).json({\n                success: true,\n                output: stdout\n            });\n        } catch (error) {\n            console.error(\"Exception:\", error);\n            return res.status(500).json({\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZmV0Y2gtc2l0ZW1hcC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFxQztBQUNKO0FBRWpDLE1BQU1FLFdBQVcsR0FBR0QsK0NBQVMsQ0FBQ0QsK0NBQUksQ0FBQztBQUVwQixlQUFlRyxPQUFPLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQzlDLElBQUlELEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUN6QixJQUFJO1lBQ0YsTUFBTSxFQUFFQyxHQUFHLEdBQUUsR0FBR0gsR0FBRyxDQUFDSSxJQUFJO1lBRXhCLElBQUksQ0FBQ0QsR0FBRyxFQUFFO2dCQUNSLE9BQU9GLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7b0JBQUVDLEtBQUssRUFBRSx1QkFBUTtpQkFBRSxDQUFDLENBQUM7YUFDbEQ7WUFFRCxNQUFNLEVBQUVDLE1BQU0sR0FBRUMsTUFBTSxHQUFFLEdBQUcsTUFBTVgsV0FBVyxDQUFDLENBQUMsNkJBQTZCLEVBQUVLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFbkYsSUFBSU0sTUFBTSxFQUFFO2dCQUNWQyxPQUFPLENBQUNILEtBQUssQ0FBQyxRQUFRLEVBQUVFLE1BQU0sQ0FBQyxDQUFDO2dCQUNoQyxPQUFPUixHQUFHLENBQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxLQUFLLEVBQUVFLE1BQU07aUJBQUUsQ0FBQyxDQUFDO2FBQ2hEO1lBRUQsT0FBT1IsR0FBRyxDQUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztnQkFBRUssT0FBTyxFQUFFLElBQUk7Z0JBQUVDLE1BQU0sRUFBRUosTUFBTTthQUFFLENBQUMsQ0FBQztTQUNoRSxDQUFDLE9BQU9ELEtBQUssRUFBRTtZQUNkRyxPQUFPLENBQUNILEtBQUssQ0FBQyxZQUFZLEVBQUVBLEtBQUssQ0FBQyxDQUFDO1lBQ25DLE9BQU9OLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQUVDLEtBQUssRUFBRUEsS0FBSyxDQUFDTSxPQUFPO2FBQUUsQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0YsTUFBTTtRQUNMWixHQUFHLENBQUNhLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFBQyxNQUFNO1NBQUMsQ0FBQyxDQUFDO1FBQ2pDYixHQUFHLENBQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ1UsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFZixHQUFHLENBQUNFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0tBQ3pEO0NBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXRlbWFwLWRpZmYtd2ViLy4vcGFnZXMvYXBpL2ZldGNoLXNpdGVtYXAuanM/Y2I0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tICd1dGlsJztcblxuY29uc3QgZXhlY1Byb21pc2UgPSBwcm9taXNpZnkoZXhlYyk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHVybCB9ID0gcmVxLmJvZHk7XG4gICAgICBcbiAgICAgIGlmICghdXJsKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiAn6K+35o+Q5L6bVVJMJyB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY1Byb21pc2UoYHB5dGhvbiBzaXRlbWFwX2RpZmYucHkgZmV0Y2ggJHt1cmx9YCk7XG4gICAgICBcbiAgICAgIGlmIChzdGRlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3I6Jywgc3RkZXJyKTtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IHN0ZGVyciB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgb3V0cHV0OiBzdGRvdXQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0V4Y2VwdGlvbjonLCBlcnJvcik7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ1BPU1QnXSk7XG4gICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgfVxufSAiXSwibmFtZXMiOlsiZXhlYyIsInByb21pc2lmeSIsImV4ZWNQcm9taXNlIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInVybCIsImJvZHkiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJjb25zb2xlIiwic3VjY2VzcyIsIm91dHB1dCIsIm1lc3NhZ2UiLCJzZXRIZWFkZXIiLCJlbmQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/fetch-sitemap.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/fetch-sitemap.js"));
module.exports = __webpack_exports__;

})();