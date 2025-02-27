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
exports.id = "pages/api/list-sitemaps";
exports.ids = ["pages/api/list-sitemaps"];
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

/***/ "(api)/./pages/api/list-sitemaps.js":
/*!************************************!*\
  !*** ./pages/api/list-sitemaps.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst execPromise = (0,util__WEBPACK_IMPORTED_MODULE_1__.promisify)(child_process__WEBPACK_IMPORTED_MODULE_0__.exec);\nasync function handler(req, res) {\n    if (req.method === \"GET\") {\n        try {\n            const { stdout , stderr  } = await execPromise(\"python sitemap_diff.py list\");\n            if (stderr) {\n                console.error(\"Error:\", stderr);\n                return res.status(500).json({\n                    error: stderr\n                });\n            }\n            // 解析输出以获取站点地图文件列表\n            const lines = stdout.split(\"\\n\");\n            const sitemapFiles = [];\n            let startCollecting = false;\n            for (const line of lines){\n                if (line.includes(\"\\u627E\\u5230\") && line.includes(\"\\u4E2ASitemap\\u6587\\u4EF6\")) {\n                    startCollecting = true;\n                    continue;\n                }\n                if (startCollecting && line.trim()) {\n                    // 提取文件名\n                    const match = line.match(/^(.+?)(\\s+\\(\\d+\\.\\d+\\s+KB\\))?$/);\n                    if (match) {\n                        sitemapFiles.push(match[1].trim());\n                    }\n                }\n            }\n            return res.status(200).json({\n                success: true,\n                sitemaps: sitemapFiles\n            });\n        } catch (error) {\n            console.error(\"Exception:\", error);\n            return res.status(500).json({\n                error: error.message\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"GET\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvbGlzdC1zaXRlbWFwcy5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFxQztBQUNKO0FBRWpDLE1BQU1FLFdBQVcsR0FBR0QsK0NBQVMsQ0FBQ0QsK0NBQUksQ0FBQztBQUVwQixlQUFlRyxPQUFPLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxFQUFFO0lBQzlDLElBQUlELEdBQUcsQ0FBQ0UsTUFBTSxLQUFLLEtBQUssRUFBRTtRQUN4QixJQUFJO1lBQ0YsTUFBTSxFQUFFQyxNQUFNLEdBQUVDLE1BQU0sR0FBRSxHQUFHLE1BQU1OLFdBQVcsQ0FBQyw2QkFBNkIsQ0FBQztZQUUzRSxJQUFJTSxNQUFNLEVBQUU7Z0JBQ1ZDLE9BQU8sQ0FBQ0MsS0FBSyxDQUFDLFFBQVEsRUFBRUYsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLE9BQU9ILEdBQUcsQ0FBQ00sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7b0JBQUVGLEtBQUssRUFBRUYsTUFBTTtpQkFBRSxDQUFDLENBQUM7YUFDaEQ7WUFFRDtZQUM4QixNQUF4QkssS0FBSyxHQUFHTixNQUFNLENBQUNPLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDaEMsTUFBTUMsWUFBWSxHQUFHLEVBQUU7WUFFdkIsSUFBSUMsZUFBZSxHQUFHLEtBQUs7WUFDM0IsS0FBSyxNQUFNQyxJQUFJLElBQUlKLEtBQUssQ0FBRTtnQkFDeEIsSUFBSUksSUFBSSxDQUFDQyxRQUFRLENBQUMsY0FBSSxDQUFLLElBQUlELElBQUksQ0FBQ0MsUUFBUSxDQUFDLDJCQUFZLENBQU8sRUFBRTtvQkFDdERGLGVBQUssR0FBRyxJQUFJLENBQUM7b0JBQ3ZCLFNBQVM7aUJBQ1Y7Z0JBRUQsSUFBSUEsZUFBZSxJQUFJQyxJQUFJLENBQUNFLElBQUksRUFBRSxFQUFFO29CQUNsQztvQkFDQSxNQUFNQyxLQUFLLEdBQUdILElBQUksQ0FBQ0csS0FBSyxrQ0FBa0M7b0JBQzFELElBQUlBLEtBQUssRUFBRTt3QkFDVEwsWUFBWSxDQUFDTSxJQUFJLENBQUNELEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQ0QsSUFBSSxFQUFFLENBQUMsQ0FBQztxQkFDcEM7aUJBQ0Y7YUFDRjtZQUVELE9BQU9kLEdBQUcsQ0FBQ00sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7Z0JBQUVVLE9BQU8sRUFBRSxJQUFJO2dCQUFFQyxRQUFRLEVBQUVSLFlBQVk7YUFBRSxDQUFDLENBQUM7U0FDeEUsQ0FBQyxPQUFPTCxLQUFLLEVBQUU7WUFDZEQsT0FBTyxDQUFDQyxLQUFLLENBQUMsWUFBWSxFQUFFQSxLQUFLLENBQUMsQ0FBQztZQUNuQyxPQUFPTCxHQUFHLENBQUNNLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUFFRixLQUFLLEVBQUVBLEtBQUssQ0FBQ2MsT0FBTzthQUFFLENBQUMsQ0FBQztTQUN2RDtLQUNGLE1BQU07UUFDTG5CLEdBQUcsQ0FBQ29CLFNBQVMsQ0FBQyxPQUFPLEVBQUU7WUFBQyxLQUFLO1NBQUMsQ0FBQyxDQUFDO1FBQ2hDcEIsR0FBRyxDQUFDTSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNlLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRXRCLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDekQ7Q0FDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3NpdGVtYXAtZGlmZi13ZWIvLi9wYWdlcy9hcGkvbGlzdC1zaXRlbWFwcy5qcz8xZjlmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBleGVjUHJvbWlzZSA9IHByb21pc2lmeShleGVjKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ0dFVCcpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY1Byb21pc2UoJ3B5dGhvbiBzaXRlbWFwX2RpZmYucHkgbGlzdCcpO1xuICAgICAgXG4gICAgICBpZiAoc3RkZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIHN0ZGVycik7XG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBzdGRlcnIgfSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIOino+aekOi+k+WHuuS7peiOt+WPluermeeCueWcsOWbvuaWh+S7tuWIl+ihqFxuICAgICAgY29uc3QgbGluZXMgPSBzdGRvdXQuc3BsaXQoJ1xcbicpO1xuICAgICAgY29uc3Qgc2l0ZW1hcEZpbGVzID0gW107XG4gICAgICBcbiAgICAgIGxldCBzdGFydENvbGxlY3RpbmcgPSBmYWxzZTtcbiAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcykge1xuICAgICAgICBpZiAobGluZS5pbmNsdWRlcygn5om+5YiwJykgJiYgbGluZS5pbmNsdWRlcygn5LiqU2l0ZW1hcOaWh+S7ticpKSB7XG4gICAgICAgICAgc3RhcnRDb2xsZWN0aW5nID0gdHJ1ZTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHN0YXJ0Q29sbGVjdGluZyAmJiBsaW5lLnRyaW0oKSkge1xuICAgICAgICAgIC8vIOaPkOWPluaWh+S7tuWQjVxuICAgICAgICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaCgvXiguKz8pKFxccytcXChcXGQrXFwuXFxkK1xccytLQlxcKSk/JC8pO1xuICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgc2l0ZW1hcEZpbGVzLnB1c2gobWF0Y2hbMV0udHJpbSgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgc2l0ZW1hcHM6IHNpdGVtYXBGaWxlcyB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXhjZXB0aW9uOicsIGVycm9yKTtcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiBlcnJvci5tZXNzYWdlIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXMuc2V0SGVhZGVyKCdBbGxvdycsIFsnR0VUJ10pO1xuICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE1ldGhvZCAke3JlcS5tZXRob2R9IE5vdCBBbGxvd2VkYCk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbImV4ZWMiLCJwcm9taXNpZnkiLCJleGVjUHJvbWlzZSIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJtZXRob2QiLCJzdGRvdXQiLCJzdGRlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGF0dXMiLCJqc29uIiwibGluZXMiLCJzcGxpdCIsInNpdGVtYXBGaWxlcyIsInN0YXJ0Q29sbGVjdGluZyIsImxpbmUiLCJpbmNsdWRlcyIsInRyaW0iLCJtYXRjaCIsInB1c2giLCJzdWNjZXNzIiwic2l0ZW1hcHMiLCJtZXNzYWdlIiwic2V0SGVhZGVyIiwiZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/list-sitemaps.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/list-sitemaps.js"));
module.exports = __webpack_exports__;

})();