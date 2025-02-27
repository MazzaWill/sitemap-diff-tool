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
exports.id = "pages/api/compare-sitemaps";
exports.ids = ["pages/api/compare-sitemaps"];
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

/***/ "(api)/./pages/api/compare-sitemaps.js":
/*!***************************************!*\
  !*** ./pages/api/compare-sitemaps.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst execPromise = (0,util__WEBPACK_IMPORTED_MODULE_1__.promisify)(child_process__WEBPACK_IMPORTED_MODULE_0__.exec);\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { files  } = req.body;\n            if (!files || !Array.isArray(files) || files.length !== 2) {\n                return res.status(400).json({\n                    error: \"\\u8BF7\\u63D0\\u4F9B\\u4E24\\u4E2A\\u7AD9\\u70B9\\u5730\\u56FE\\u6587\\u4EF6\\u8FDB\\u884C\\u6BD4\\u8F83\"\n                });\n            }\n            const [file1, file2] = files;\n            const { stdout , stderr  } = await execPromise(`python sitemap_diff.py compare --files \"${file1}\" \"${file2}\"`);\n            if (stderr) {\n                console.error(\"Error:\", stderr);\n                return res.status(500).json({\n                    error: stderr\n                });\n            }\n            return res.status(200).json({\n                success: true,\n                output: stdout\n            });\n        } catch (error) {\n            console.error(\"Exception:\", error);\n            return res.status(500).json({\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvY29tcGFyZS1zaXRlbWFwcy5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFxQztBQUNKO0FBRWpDLE1BQU1FLFdBQVcsR0FBR0QsK0NBQVMsQ0FBQ0QsK0NBQUksQ0FBQztBQUVwQixlQUFlRyxPQUFPLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQzlDLElBQUlELEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLE1BQU0sRUFBRTtRQUN6QixJQUFJO1lBQ0YsTUFBTSxFQUFFQyxLQUFLLEdBQUUsR0FBR0gsR0FBRyxDQUFDSSxJQUFJO1lBRTFCLElBQUksQ0FBQ0QsS0FBSyxJQUFJLENBQUNFLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSCxLQUFLLENBQUMsSUFBSUEsS0FBSyxDQUFDSSxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN6RCxPQUFPTixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxLQUFLLEVBQUUsNEZBQWlCO2lCQUFFLENBQUMsQ0FBQzthQUMzRDtZQUVELE1BQU0sQ0FBQ0MsS0FBSyxFQUFFQyxLQUFLLENBQUMsR0FBR1QsS0FBSztZQUM1QixNQUFNLEVBQUVVLE1BQU0sR0FBRUMsTUFBTSxHQUFFLEdBQUcsTUFBTWhCLFdBQVcsQ0FBQyxDQUFDLHdDQUF3QyxFQUFFYSxLQUFLLENBQUMsR0FBRyxFQUFFQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFNUcsSUFBSUUsTUFBTSxFQUFFO2dCQUNWQyxPQUFPLENBQUNMLEtBQUssQ0FBQyxRQUFRLEVBQUVJLE1BQU0sQ0FBQyxDQUFDO2dCQUNoQyxPQUFPYixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxLQUFLLEVBQUVJLE1BQU07aUJBQUUsQ0FBQyxDQUFDO2FBQ2hEO1lBRUQsT0FBT2IsR0FBRyxDQUFDTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztnQkFBRU8sT0FBTyxFQUFFLElBQUk7Z0JBQUVDLE1BQU0sRUFBRUosTUFBTTthQUFFLENBQUMsQ0FBQztTQUNoRSxDQUFDLE9BQU9ILEtBQUssRUFBRTtZQUNkSyxPQUFPLENBQUNMLEtBQUssQ0FBQyxZQUFZLEVBQUVBLEtBQUssQ0FBQyxDQUFDO1lBQ25DLE9BQU9ULEdBQUcsQ0FBQ08sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQUVDLEtBQUssRUFBRUEsS0FBSyxDQUFDUSxPQUFPO2FBQUUsQ0FBQyxDQUFDO1NBQ3ZEO0tBQ0YsTUFBTTtRQUNMakIsR0FBRyxDQUFDa0IsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUFDLE1BQU07U0FBQyxDQUFDLENBQUM7UUFDakNsQixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ1ksR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFcEIsR0FBRyxDQUFDRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUN6RDtDQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2l0ZW1hcC1kaWZmLXdlYi8uL3BhZ2VzL2FwaS9jb21wYXJlLXNpdGVtYXBzLmpzPzdlYTYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IGV4ZWNQcm9taXNlID0gcHJvbWlzaWZ5KGV4ZWMpO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzKSB7XG4gIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBmaWxlcyB9ID0gcmVxLmJvZHk7XG4gICAgICBcbiAgICAgIGlmICghZmlsZXMgfHwgIUFycmF5LmlzQXJyYXkoZmlsZXMpIHx8IGZpbGVzLmxlbmd0aCAhPT0gMikge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogJ+ivt+aPkOS+m+S4pOS4quermeeCueWcsOWbvuaWh+S7tui/m+ihjOavlOi+gycgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGNvbnN0IFtmaWxlMSwgZmlsZTJdID0gZmlsZXM7XG4gICAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjUHJvbWlzZShgcHl0aG9uIHNpdGVtYXBfZGlmZi5weSBjb21wYXJlIC0tZmlsZXMgXCIke2ZpbGUxfVwiIFwiJHtmaWxlMn1cImApO1xuICAgICAgXG4gICAgICBpZiAoc3RkZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIHN0ZGVycik7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBzdGRlcnIgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7IHN1Y2Nlc3M6IHRydWUsIG91dHB1dDogc3Rkb3V0IH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFeGNlcHRpb246JywgZXJyb3IpO1xuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydQT1NUJ10pO1xuICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE1ldGhvZCAke3JlcS5tZXRob2R9IE5vdCBBbGxvd2VkYCk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbImV4ZWMiLCJwcm9taXNpZnkiLCJleGVjUHJvbWlzZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJmaWxlcyIsImJvZHkiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJzdGF0dXMiLCJqc29uIiwiZXJyb3IiLCJmaWxlMSIsImZpbGUyIiwic3Rkb3V0Iiwic3RkZXJyIiwiY29uc29sZSIsInN1Y2Nlc3MiLCJvdXRwdXQiLCJtZXNzYWdlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/compare-sitemaps.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/compare-sitemaps.js"));
module.exports = __webpack_exports__;

})();