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

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst execPromise = (0,util__WEBPACK_IMPORTED_MODULE_1__.promisify)(child_process__WEBPACK_IMPORTED_MODULE_0__.exec);\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { url  } = req.body;\n            if (!url) {\n                return res.status(400).json({\n                    error: \"\\u8BF7\\u63D0\\u4F9BURL\"\n                });\n            }\n            // 获取脚本的绝对路径\n            const scriptPath = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"sitemap_diff.py\");\n            // 执行命令，指定工作目录\n            const { stdout , stderr  } = await execPromise(`python \"${scriptPath}\" fetch ${url}`, {\n                cwd: process.cwd()\n            });\n            // 检查是否找到URL\n            if (stdout.includes(\"\\u672A\\u627E\\u5230\\u4EFB\\u4F55URL\")) {\n                return res.status(404).json({\n                    success: false,\n                    error: \"\\u672A\\u627E\\u5230\\u4EFB\\u4F55URL\\uFF0C\\u8BF7\\u68C0\\u67E5\\u7F51\\u7AD9\\u662F\\u5426\\u6709\\u7AD9\\u70B9\\u5730\\u56FE\",\n                    output: stdout\n                });\n            }\n            return res.status(200).json({\n                success: true,\n                output: stdout\n            });\n        } catch (error) {\n            console.error(\"Exception:\", error);\n            return res.status(500).json({\n                error: \"\\u6267\\u884C\\u811A\\u672C\\u65F6\\u51FA\\u9519\",\n                details: error.message,\n                stdout: error.stdout,\n                stderr: error.stderr\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZmV0Y2gtc2l0ZW1hcC5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXFDO0FBQ0o7QUFDVDtBQUV4QixNQUFNRyxXQUFXLEdBQUdGLCtDQUFTLENBQUNELCtDQUFJLENBQUM7QUFFcEIsZUFBZUksT0FBTyxDQUFDQyxHQUFHLEVBQUVDLEdBQUcsRUFBRTtJQUM5QyxJQUFJRCxHQUFHLENBQUNFLE1BQU0sS0FBSyxNQUFNLEVBQUU7UUFDekIsSUFBSTtZQUNGLE1BQU0sRUFBRUMsR0FBRyxHQUFFLEdBQUdILEdBQUcsQ0FBQ0ksSUFBSTtZQUV4QixJQUFJLENBQUNELEdBQUcsRUFBRTtnQkFDUixPQUFPRixHQUFHLENBQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxLQUFLLEVBQUUsdUJBQVE7aUJBQVEsQ0FBQyxDQUFDO2FBQ2xEO1lBRVA7WUFDa0IsTUFBWkMsVUFBVSxHQUFHWCxnREFBUyxDQUFDYSxPQUFPLENBQUNDLEdBQUcsRUFBRSxFQUFFLGlCQUFpQixDQUFDO1lBRTlEO1lBQ3NCLE1BQWhCLEVBQUVDLE1BQU0sR0FBRUMsTUFBTSxHQUFFLEdBQUcsTUFBTWYsV0FBVyxDQUFDLENBQUMsUUFBUSxFQUFFVSxVQUFVLENBQUMsUUFBUSxFQUFFTCxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNsRlEsR0FBRyxFQUFFRCxPQUFPLENBQUNDLEdBQUcsRUFBRTthQUNuQixDQUFDO1lBRUY7WUFDWSxJQUFSQyxNQUFNLENBQUNFLFFBQVEsQ0FBQyxtQ0FBVSxDQUFXLEVBQUU7Z0JBQy9CLE9BQUhiLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7b0JBQzFCUyxPQUFPLEVBQUUsS0FBSztvQkFDZFIsS0FBSyxFQUFFLGlIQUF1QjtvQkFDTVMsTUFBOUIsRUFBRUosTUFBTTtpQkFDZixDQUFDLENBQUM7YUFDSjtZQUVELE9BQU9YLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQUVTLE9BQU8sRUFBRSxJQUFJO2dCQUFFQyxNQUFNLEVBQUVKLE1BQU07YUFBRSxDQUFDLENBQUM7U0FDaEUsQ0FBQyxPQUFPTCxLQUFLLEVBQUU7WUFDZFUsT0FBTyxDQUFDVixLQUFLLENBQUMsWUFBWSxFQUFFQSxLQUFLLENBQUMsQ0FBQztZQUNuQyxPQUFPTixHQUFHLENBQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMxQkMsS0FBSyxFQUFFLDRDQUFTO2dCQUNoQlcsT0FBTyxFQUFFWCxLQUFLLENBQUNZLE9BQU87Z0JBQ3RCUCxNQUFNLEVBQUVMLEtBQUssQ0FBQ0ssTUFBTTtnQkFDcEJDLE1BQU0sRUFBRU4sS0FBSyxDQUFDTSxNQUFNO2FBQ3JCLENBQUMsQ0FBQztTQUNKO0tBQ0YsTUFBTTtRQUNMWixHQUFHLENBQUNtQixTQUFTLENBQUMsT0FBTyxFQUFFO1lBQUMsTUFBTTtTQUFDLENBQUMsQ0FBQztRQUNqQ25CLEdBQUcsQ0FBQ0ksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDZ0IsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFckIsR0FBRyxDQUFDRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUN6RDtDQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2l0ZW1hcC1kaWZmLXdlYi8uL3BhZ2VzL2FwaS9mZXRjaC1zaXRlbWFwLmpzP2NiNGUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgZXhlY1Byb21pc2UgPSBwcm9taXNpZnkoZXhlYyk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxLCByZXMpIHtcbiAgaWYgKHJlcS5tZXRob2QgPT09ICdQT1NUJykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHVybCB9ID0gcmVxLmJvZHk7XG4gICAgICBcbiAgICAgIGlmICghdXJsKSB7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiAn6K+35o+Q5L6bVVJMJyB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8g6I635Y+W6ISa5pys55qE57ud5a+56Lev5b6EXG4gICAgICBjb25zdCBzY3JpcHRQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdzaXRlbWFwX2RpZmYucHknKTtcbiAgICAgIFxuICAgICAgLy8g5omn6KGM5ZG95Luk77yM5oyH5a6a5bel5L2c55uu5b2VXG4gICAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjUHJvbWlzZShgcHl0aG9uIFwiJHtzY3JpcHRQYXRofVwiIGZldGNoICR7dXJsfWAsIHtcbiAgICAgICAgY3dkOiBwcm9jZXNzLmN3ZCgpXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy8g5qOA5p+l5piv5ZCm5om+5YiwVVJMXG4gICAgICBpZiAoc3Rkb3V0LmluY2x1ZGVzKCfmnKrmib7liLDku7vkvZVVUkwnKSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZSwgXG4gICAgICAgICAgZXJyb3I6ICfmnKrmib7liLDku7vkvZVVUkzvvIzor7fmo4Dmn6XnvZHnq5nmmK/lkKbmnInnq5nngrnlnLDlm74nLFxuICAgICAgICAgIG91dHB1dDogc3Rkb3V0IFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgb3V0cHV0OiBzdGRvdXQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0V4Y2VwdGlvbjonLCBlcnJvcik7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBcbiAgICAgICAgZXJyb3I6ICfmiafooYzohJrmnKzml7blh7rplJknLCBcbiAgICAgICAgZGV0YWlsczogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgc3Rkb3V0OiBlcnJvci5zdGRvdXQsXG4gICAgICAgIHN0ZGVycjogZXJyb3Iuc3RkZXJyXG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ1BPU1QnXSk7XG4gICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgfVxufSAiXSwibmFtZXMiOlsiZXhlYyIsInByb21pc2lmeSIsInBhdGgiLCJleGVjUHJvbWlzZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJ1cmwiLCJib2R5Iiwic3RhdHVzIiwianNvbiIsImVycm9yIiwic2NyaXB0UGF0aCIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwic3Rkb3V0Iiwic3RkZXJyIiwiaW5jbHVkZXMiLCJzdWNjZXNzIiwib3V0cHV0IiwiY29uc29sZSIsImRldGFpbHMiLCJtZXNzYWdlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/fetch-sitemap.js\n");

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