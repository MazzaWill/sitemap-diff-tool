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

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

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

/***/ "(api)/./pages/api/compare-sitemaps.js":
/*!***************************************!*\
  !*** ./pages/api/compare-sitemaps.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! child_process */ \"child_process\");\n/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\nconst execPromise = (0,util__WEBPACK_IMPORTED_MODULE_1__.promisify)(child_process__WEBPACK_IMPORTED_MODULE_0__.exec);\nasync function handler(req, res) {\n    if (req.method === \"POST\") {\n        try {\n            const { files  } = req.body;\n            if (!files || !Array.isArray(files) || files.length !== 2) {\n                return res.status(400).json({\n                    error: \"\\u8BF7\\u63D0\\u4F9B\\u4E24\\u4E2A\\u7AD9\\u70B9\\u5730\\u56FE\\u6587\\u4EF6\\u8FDB\\u884C\\u6BD4\\u8F83\"\n                });\n            }\n            const [file1, file2] = files;\n            // 检查文件是否存在\n            const dataDir = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"data\");\n            const file1Path = path__WEBPACK_IMPORTED_MODULE_2___default().join(dataDir, file1);\n            const file2Path = path__WEBPACK_IMPORTED_MODULE_2___default().join(dataDir, file2);\n            if (!fs__WEBPACK_IMPORTED_MODULE_3___default().existsSync(file1Path)) {\n                return res.status(404).json({\n                    error: `文件不存在: ${file1}`\n                });\n            }\n            if (!fs__WEBPACK_IMPORTED_MODULE_3___default().existsSync(file2Path)) {\n                return res.status(404).json({\n                    error: `文件不存在: ${file2}`\n                });\n            }\n            // 获取脚本的绝对路径\n            const scriptPath = path__WEBPACK_IMPORTED_MODULE_2___default().join(process.cwd(), \"sitemap_diff.py\");\n            // 构建命令 - 使用绝对路径\n            const command = `python \"${scriptPath}\" compare --files \"${file1Path}\" \"${file2Path}\"`;\n            console.log(`执行命令: ${command}`);\n            const { stdout , stderr  } = await execPromise(command, {\n                cwd: process.cwd(),\n                timeout: 60000 // 60秒\n            });\n            console.log(\"\\u6BD4\\u8F83\\u811A\\u672C\\u8F93\\u51FA:\", stdout);\n            if (stderr) {\n                console.error(\"\\u6BD4\\u8F83\\u811A\\u672C\\u9519\\u8BEF:\", stderr);\n                return res.status(500).json({\n                    error: stderr\n                });\n            }\n            return res.status(200).json({\n                success: true,\n                output: stdout\n            });\n        } catch (error) {\n            console.error(\"\\u6BD4\\u8F83\\u811A\\u672C\\u5F02\\u5E38:\", error);\n            return res.status(500).json({\n                error: \"\\u6267\\u884C\\u6BD4\\u8F83\\u811A\\u672C\\u65F6\\u51FA\\u9519\",\n                details: error.message,\n                stdout: error.stdout,\n                stderr: error.stderr\n            });\n        }\n    } else {\n        res.setHeader(\"Allow\", [\n            \"POST\"\n        ]);\n        res.status(405).end(`Method ${req.method} Not Allowed`);\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvY29tcGFyZS1zaXRlbWFwcy5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBcUM7QUFDSjtBQUNUO0FBQ0o7QUFFcEIsTUFBTUksV0FBVyxHQUFHSCwrQ0FBUyxDQUFDRCwrQ0FBSSxDQUFDO0FBRXBCLGVBQWVLLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFQyxHQUFHLEVBQUU7SUFDOUMsSUFBSUQsR0FBRyxDQUFDRSxNQUFNLEtBQUssTUFBTSxFQUFFO1FBQ3pCLElBQUk7WUFDRixNQUFNLEVBQUVDLEtBQUssR0FBRSxHQUFHSCxHQUFHLENBQUNJLElBQUk7WUFFMUIsSUFBSSxDQUFDRCxLQUFLLElBQUksQ0FBQ0UsS0FBSyxDQUFDQyxPQUFPLENBQUNILEtBQUssQ0FBQyxJQUFJQSxLQUFLLENBQUNJLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3pELE9BQU9OLEdBQUcsQ0FBQ08sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUM7b0JBQUVDLEtBQUssRUFBRSw0RkFBaUI7aUJBQWdDLENBQUMsQ0FBQzthQUMzRDtZQUUvQixNQUFNLENBQUNDLEtBQUssRUFBRUMsS0FBSyxDQUFDLEdBQUdULEtBQUs7WUFFNUI7WUFDZ0IsTUFBVlUsT0FBTyxHQUFHakIsZ0RBQVMsQ0FBQ21CLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDO1lBQ2hELE1BQU1DLFNBQVMsR0FBR3JCLGdEQUFTLENBQUNpQixPQUFPLEVBQUVGLEtBQUssQ0FBQztZQUMzQyxNQUFNTyxTQUFTLEdBQUd0QixnREFBUyxDQUFDaUIsT0FBTyxFQUFFRCxLQUFLLENBQUM7WUFFM0MsSUFBSSxDQUFDZixvREFBYSxDQUFDb0IsU0FBUyxDQUFDLEVBQUU7Z0JBQzdCLE9BQU9oQixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxLQUFLLEVBQUUsQ0FBQztpQkFBNEIsQ0FBQyxDQUFDO2FBQzNEO1lBRVgsSUFBSSxDQUFDYixvREFBYSxDQUFDcUIsU0FBUyxDQUFDLEVBQUU7Z0JBQzdCLE9BQU9qQixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO29CQUFFQyxLQUFLLEVBQUUsQ0FBQztpQkFBNEIsQ0FBQyxDQUFDO2FBQzNEO1lBRVg7WUFDa0IsTUFBWlUsVUFBVSxHQUFHeEIsZ0RBQVMsQ0FBQ21CLE9BQU8sQ0FBQ0MsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLENBQUM7WUFFOUQ7WUFDb0IsTUFBZEssT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFRCxVQUFVLENBQUMsbUJBQW1CLEVBQUVILFNBQVMsQ0FBQyxHQUFHLEVBQUVDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdEZJLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUMsY0FBTSxFQUFVRjtZQUVyQixNQUFGLEVBQUVHLE1BQU0sR0FBRUMsTUFBTSxHQUFFLEdBQUcsTUFBTTNCLFdBQVcsQ0FBQ3VCLE9BQU8sRUFBRTtnQkFDcERMLEdBQUcsRUFBRUQsT0FBTyxDQUFDQyxHQUFHLEVBQUU7Z0JBQ2xCVSxPQUFPLEVBQUUsS0FBSyxDQUFDO2FBQ2QsQ0FBRDtZQUVGSixPQUFPLENBQUNDLEdBQUcsQ0FBQyx1Q0FBUyxFQUFjQyxNQUFNLENBQUMsQ0FBQztZQUUvQixJQUFSQyxNQUFNLEVBQUU7Z0JBQ1ZILE9BQU8sQ0FBQ1osS0FBSyxDQUFDLHVDQUFTLEVBQWNlLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxPQUFMeEIsR0FBRyxDQUFDTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUNDLElBQUksQ0FBQztvQkFBRUMsS0FBSyxFQUFFZSxNQUFNO2lCQUFFLENBQUMsQ0FBQzthQUNoRDtZQUVELE9BQU94QixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUFFa0IsT0FBTyxFQUFFLElBQUk7Z0JBQUVDLE1BQU0sRUFBRUosTUFBTTthQUFFLENBQUMsQ0FBQztTQUNoRSxDQUFDLE9BQU9kLEtBQUssRUFBRTtZQUNkWSxPQUFPLENBQUNaLEtBQUssQ0FBQyx1Q0FBUyxFQUFjQSxLQUFLLENBQUMsQ0FBQztZQUNoQyxPQUFMVCxHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ0MsSUFBSSxDQUFDO2dCQUMxQkMsS0FBSyxFQUFFLHdEQUFXO2dCQUNsQm1CLE9BQU8sRUFBRW5CLEtBQUssQ0FBQ29CLE9BQU87Z0JBQ3RCTixNQUFNLEVBQUVkLEtBQUssQ0FBQ2MsTUFBTTtnQkFDcEJDLE1BQU0sRUFBRWYsS0FBSyxDQUFDZSxNQUFNO2FBQ3JCLENBQUMsQ0FBQztTQUNKO0tBQ0YsTUFBTTtRQUNMeEIsR0FBRyxDQUFDOEIsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUFDLE1BQU07U0FBQyxDQUFDLENBQUM7UUFDakM5QixHQUFHLENBQUNPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQ3dCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRWhDLEdBQUcsQ0FBQ0UsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDekQ7Q0FDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3NpdGVtYXAtZGlmZi13ZWIvLi9wYWdlcy9hcGkvY29tcGFyZS1zaXRlbWFwcy5qcz83ZWE2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5jb25zdCBleGVjUHJvbWlzZSA9IHByb21pc2lmeShleGVjKTtcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICBpZiAocmVxLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHsgZmlsZXMgfSA9IHJlcS5ib2R5O1xuICAgICAgXG4gICAgICBpZiAoIWZpbGVzIHx8ICFBcnJheS5pc0FycmF5KGZpbGVzKSB8fCBmaWxlcy5sZW5ndGggIT09IDIpIHtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6ICfor7fmj5DkvpvkuKTkuKrnq5nngrnlnLDlm77mlofku7bov5vooYzmr5TovoMnIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjb25zdCBbZmlsZTEsIGZpbGUyXSA9IGZpbGVzO1xuICAgICAgXG4gICAgICAvLyDmo4Dmn6Xmlofku7bmmK/lkKblrZjlnKhcbiAgICAgIGNvbnN0IGRhdGFEaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2RhdGEnKTtcbiAgICAgIGNvbnN0IGZpbGUxUGF0aCA9IHBhdGguam9pbihkYXRhRGlyLCBmaWxlMSk7XG4gICAgICBjb25zdCBmaWxlMlBhdGggPSBwYXRoLmpvaW4oZGF0YURpciwgZmlsZTIpO1xuICAgICAgXG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZTFQYXRoKSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogYOaWh+S7tuS4jeWtmOWcqDogJHtmaWxlMX1gIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZmlsZTJQYXRoKSkge1xuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBlcnJvcjogYOaWh+S7tuS4jeWtmOWcqDogJHtmaWxlMn1gIH0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyDojrflj5bohJrmnKznmoTnu53lr7not6/lvoRcbiAgICAgIGNvbnN0IHNjcmlwdFBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NpdGVtYXBfZGlmZi5weScpO1xuICAgICAgXG4gICAgICAvLyDmnoTlu7rlkb3ku6QgLSDkvb/nlKjnu53lr7not6/lvoRcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSBgcHl0aG9uIFwiJHtzY3JpcHRQYXRofVwiIGNvbXBhcmUgLS1maWxlcyBcIiR7ZmlsZTFQYXRofVwiIFwiJHtmaWxlMlBhdGh9XCJgO1xuICAgICAgY29uc29sZS5sb2coYOaJp+ihjOWRveS7pDogJHtjb21tYW5kfWApO1xuICAgICAgXG4gICAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjUHJvbWlzZShjb21tYW5kLCB7XG4gICAgICAgIGN3ZDogcHJvY2Vzcy5jd2QoKSxcbiAgICAgICAgdGltZW91dDogNjAwMDAgLy8gNjDnp5JcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLmxvZyhcIuavlOi+g+iEmuacrOi+k+WHujpcIiwgc3Rkb3V0KTtcbiAgICAgIFxuICAgICAgaWYgKHN0ZGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCfmr5TovoPohJrmnKzplJnor686Jywgc3RkZXJyKTtcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IHN0ZGVyciB9KTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgc3VjY2VzczogdHJ1ZSwgb3V0cHV0OiBzdGRvdXQgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ+avlOi+g+iEmuacrOW8guW4uDonLCBlcnJvcik7XG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oeyBcbiAgICAgICAgZXJyb3I6ICfmiafooYzmr5TovoPohJrmnKzml7blh7rplJknLCBcbiAgICAgICAgZGV0YWlsczogZXJyb3IubWVzc2FnZSxcbiAgICAgICAgc3Rkb3V0OiBlcnJvci5zdGRvdXQsXG4gICAgICAgIHN0ZGVycjogZXJyb3Iuc3RkZXJyXG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ1BPU1QnXSk7XG4gICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTWV0aG9kICR7cmVxLm1ldGhvZH0gTm90IEFsbG93ZWRgKTtcbiAgfVxufSAiXSwibmFtZXMiOlsiZXhlYyIsInByb21pc2lmeSIsInBhdGgiLCJmcyIsImV4ZWNQcm9taXNlIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsImZpbGVzIiwiYm9keSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsImZpbGUxIiwiZmlsZTIiLCJkYXRhRGlyIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJmaWxlMVBhdGgiLCJmaWxlMlBhdGgiLCJleGlzdHNTeW5jIiwic2NyaXB0UGF0aCIsImNvbW1hbmQiLCJjb25zb2xlIiwibG9nIiwic3Rkb3V0Iiwic3RkZXJyIiwidGltZW91dCIsInN1Y2Nlc3MiLCJvdXRwdXQiLCJkZXRhaWxzIiwibWVzc2FnZSIsInNldEhlYWRlciIsImVuZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./pages/api/compare-sitemaps.js\n");

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