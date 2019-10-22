(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/handler.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/axiosFunctions.ts":
/*!*******************************!*\
  !*** ./src/axiosFunctions.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AxiosSingleton_1 = __webpack_require__(/*! ./singletons/AxiosSingleton */ "./src/singletons/AxiosSingleton.ts");
exports.axiosPost = (serviceUrl, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!serviceUrl) {
        throw new Error("The serviceUrl was not set.  Unable to make POST.");
    }
    const axios = AxiosSingleton_1.AxiosSingleton.getInstance().getAxios();
    const config = {
        baseURL: serviceUrl,
        timeout: 30000,
    };
    console.time("Called " + config.baseURL);
    const axiosPromise = yield axios.post(config.baseURL, body, config);
    axiosPromise.then((axiosResult) => {
        console.timeEnd("Called " + config.baseURL);
        return {
            response: axiosResult.data,
        };
    }).catch((axiosError) => {
        console.timeEnd("Called " + config.baseURL);
        const errorMessage = (`Axios error connecting to ${config.baseURL}.  Error code '${axiosError.code}'.  `);
        // log error response, else config data, else full error.
        // console.error(errorMessage, (axiosError.response || (axiosError.config || axiosError)));
        axiosError.message = errorMessage + axiosError.message; // add url to axios error
    });
    return { response: axiosPromise };
});


/***/ }),

/***/ "./src/buildAriaBodyFunctions/catalogHierarchyBody.ts":
/*!************************************************************!*\
  !*** ./src/buildAriaBodyFunctions/catalogHierarchyBody.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ariaRequestCatalogHierarchyBody = (CDSGCredentials) => {
    let ariaBody = "";
    ariaBody = JSON.stringify({
        rest_call: "get_catalog_hierarchy_m",
        releaseVersion: "24",
        output_format: "json",
        client_no: CDSGCredentials.CDSGClientNumber,
        auth_key: CDSGCredentials.ariaAuthKey,
        promo_code: "",
        include_plan_hierarchy: true,
        parent_plan_no: "",
        // or client_parent_plan_id: "",
        locale_no: "",
        // or locale_name: "",
        include_parent_plan_list: true,
        include_child_plan_list: true,
        include_total_count: true,
        limit: 100,
        offset: 0,
    });
    return ariaBody;
};


/***/ }),

/***/ "./src/buildAriaBodyFunctions/clientPlansAllBody.ts":
/*!**********************************************************!*\
  !*** ./src/buildAriaBodyFunctions/clientPlansAllBody.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ariaRequestClientPlansAllBody = (CDSGCredentials, planNumber) => {
    let ariaBody = "";
    ariaBody = JSON.stringify({
        rest_call: "get_client_plans_all_m",
        releaseVersion: "24",
        output_format: "json",
        client_no: CDSGCredentials.CDSGClientNumber,
        auth_key: CDSGCredentials.ariaAuthKey,
        plan_no: planNumber,
        // or client_plan_id = "",
        // acct_no: 0, // filter by account number
        promo_code: "",
        parent_plan_no: "",
        // or client_parent_plan_id: "",
        supp_field_names: [],
        supp_field_values: [],
        include_all_rate_schedule: true,
        include_plan_hierarchy: true,
        retrieve_bundle_nso: true,
        retrieve_included_nso: true,
        locale_no: "",
        // or locale_name: "",
        include_translations: true,
    });
    return ariaBody;
};


/***/ }),

/***/ "./src/callAria.ts":
/*!*************************!*\
  !*** ./src/callAria.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axiosFunctions_1 = __webpack_require__(/*! ./axiosFunctions */ "./src/axiosFunctions.ts");
const catalogHierarchyBody_1 = __webpack_require__(/*! ./buildAriaBodyFunctions/catalogHierarchyBody */ "./src/buildAriaBodyFunctions/catalogHierarchyBody.ts");
const clientPlansAllBody_1 = __webpack_require__(/*! ./buildAriaBodyFunctions/clientPlansAllBody */ "./src/buildAriaBodyFunctions/clientPlansAllBody.ts");
const utility_1 = __webpack_require__(/*! ./utility */ "./src/utility.ts");
const CDSGCredentials = {
    ariaAuthKey: process.env.ariaAuthKey,
    CDSGClientNumber: 5025386,
};
const URLGetCatalogHierarchy = "https://secure.future.stage.ariasystems.net/v1/core#GetCatalogHierarchyM";
const URLGetClientPlansAll = "https://secure.future.stage.ariasystems.net/v1/core#GetClientPlansAllM";
exports.callAriaApi = (catalogSkuId) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let numericSkuCode;
        let serviceURL;
        let ariaBody;
        // Get catalog Sku Code from Table
        // Build serviceURL
        // Build Aria Request Body
        const catalogSkuCode = utility_1.getCatalogSkuCode(catalogSkuId);
        if (catalogSkuCode === "NotFound") {
            console.log("What need to be done here");
            reject("catalogSkuCodeNOtFound"); // So we don't continue processing
        }
        else {
            numericSkuCode = Number(catalogSkuCode);
            if (numericSkuCode === 0) {
                serviceURL = URLGetCatalogHierarchy;
                ariaBody = catalogHierarchyBody_1.ariaRequestCatalogHierarchyBody(CDSGCredentials);
            }
            else {
                serviceURL = URLGetClientPlansAll;
                ariaBody = clientPlansAllBody_1.ariaRequestClientPlansAllBody(CDSGCredentials, numericSkuCode);
            }
        }
        // Call Aria APIs
        const apiCallResult = axiosFunctions_1.axiosPost(serviceURL, ariaBody);
        apiCallResult.then((axiosResult) => {
            resolve(axiosResult);
        })
            .catch((axiosError) => {
            reject("NoData");
        });
    }));
};


/***/ }),

/***/ "./src/domain/CatalogSKUTable.ts":
/*!***************************************!*\
  !*** ./src/domain/CatalogSKUTable.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SKUs = new Map();
exports.SKUs.set("PROD-CDB", "0"),
    exports.SKUs.set("PROD-CD1", "11274578"),
    exports.SKUs.set("PROD-CD2", "11274994"),
    exports.SKUs.set("PROD-CD3", "11274995"),
    exports.SKUs.set("PROD-CD4", "11274993"),
    exports.SKUs.set("PROD-CD5", "11274992"),
    exports.SKUs.set("PROD-CD6", "11274588"),
    exports.SKUs.set("PROD-CD7", "11274587"),
    exports.SKUs.set("PROD-CD8", "11274586");


/***/ }),

/***/ "./src/handler.ts":
/*!************************!*\
  !*** ./src/handler.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilityFunctions = __importStar(__webpack_require__(/*! ./utility */ "./src/utility.ts"));
const ELASTICACHE_CONFIG_ENDPOINT = "mem-me-ky0mae2xq2zo.ih67sh.0001.use1.cache.amazonaws.com:11211";
const memcached_1 = __importDefault(__webpack_require__(/*! memcached */ "memcached"));
const callAria_1 = __webpack_require__(/*! ./callAria */ "./src/callAria.ts");
memcached_1.default.config.poolSize = 25;
memcached_1.default.config.retries = 2;
memcached_1.default.config.retry = 1;
const memcached = new memcached_1.default(ELASTICACHE_CONFIG_ENDPOINT, {});
exports.MemCachedService = (event, context, callback) => {
    // Global variables
    let keyToSearch = "";
    let keySearchFailed = false;
    let responseData = "";
    let finalResponse;
    // Assemble cache key from event.pathParameters
    keyToSearch = utilityFunctions.keyAssembly(event);
    // Lookup keyToSearch in Memcached
    return utilityFunctions.isKeyInCache(memcached, keyToSearch)
        .then((cachedData) => {
        if (cachedData === "NotFound" || keySearchFailed) {
            const callAriaApiResult = callAria_1.callAriaApi(keyToSearch);
            callAriaApiResult.then((callAriaApiResponse) => {
                const keyToCache = keyToSearch;
                const valueToCache = JSON.stringify(callAriaApiResponse.data);
                const cacheItemTTL = 300; // Time To Live in seconds
                const setItemToCache = utilityFunctions.setItemToCache(memcached, keyToCache, valueToCache, cacheItemTTL);
                setItemToCache.then((SetItemToCacheResponse) => {
                    if (SetItemToCacheResponse === "ItemIsSet") {
                        return responseData = `"Not From Cache" ${valueToCache}`;
                    }
                })
                    .catch((err) => {
                    console.log("memcached.set erred. Error message: ", err);
                    return err;
                });
            })
                .catch((err) => {
                console.log("callAriaApi erred. Error message: ", err);
                return "err";
            });
        }
        else {
            responseData = `"From Cache" ${cachedData}`;
        }
        finalResponse = {
            statusCode: 200,
            body: JSON.stringify({
                message: responseData,
            }),
        };
        return finalResponse;
    })
        .catch((err) => {
        // NOTE: This is communication error with Memcached. For this error, we go back to Database to get what needed
        // and .set it to Memcached then return result to caller.
        // IF that .set also fails return result to caller, pretend like there was no cache exists.
        console.log("memcached.get erred. Error message: ", err);
        keySearchFailed = true;
        finalResponse = {
            statusCode: 400,
            body: JSON.stringify({
                message: err,
            }),
        };
        return finalResponse;
    });
    // callback(null, finalResponse);
};


/***/ }),

/***/ "./src/singletons/AxiosSingleton.ts":
/*!******************************************!*\
  !*** ./src/singletons/AxiosSingleton.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
class AxiosSingleton {
    constructor() {
        // tslint:disable-next-line:no-string-literal
        axios_1.default.defaults.headers.post["Accept"] = "application/json";
        axios_1.default.defaults.headers.post["Content-Type"] = "application/json";
        this.Axios = axios_1.default;
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
    getAxios() {
        return this.Axios;
    }
}
exports.AxiosSingleton = AxiosSingleton;


/***/ }),

/***/ "./src/utility.ts":
/*!************************!*\
  !*** ./src/utility.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const catalogs = __importStar(__webpack_require__(/*! ./domain/CatalogSKUTable */ "./src/domain/CatalogSKUTable.ts"));
exports.getCatalogSkuCode = (catalogSkuId) => {
    let catalogSkuCode = catalogs.SKUs.get(catalogSkuId);
    if (catalogSkuCode === undefined) {
        catalogSkuCode = "NotFound";
    }
    return catalogSkuCode;
};
exports.getUniqueId = () => {
    const utcDate = new Date();
    const timeZoneOffset = utcDate.getTimezoneOffset() * 60 * 1000;
    const localDate = utcDate - timeZoneOffset;
    const myDate = new Date(localDate).toISOString();
    const myId = myDate.concat(String(Math.floor(Math.random() * Math.floor(100000000))));
    return myId;
};
exports.keyAssembly = (event) => {
    const DASH_TEXT = "-";
    const STAGE_TEXT = event.pathParameters.stage.toUpperCase();
    const PRODID_TEXT = event.pathParameters.prodId.toUpperCase();
    const keyToSearch = `${STAGE_TEXT}${DASH_TEXT}${PRODID_TEXT}`;
    return keyToSearch;
};
exports.isKeyInCache = (memcached, cachedKey) => {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
        memcached.get(cachedKey, (err, data) => {
            if (data) {
                const cachedValue = data;
                resolve(cachedValue);
            }
            else {
                resolve("NotFound");
            }
        });
    });
};
exports.setItemToCache = (memcached, cacheInputKey, cacheInputData, cacheInputTTL) => {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
        memcached.set(cacheInputKey, cacheInputData, cacheInputTTL, (err, data) => {
            if (err) {
                resolve("ItemNotSet");
            }
            else {
                resolve("ItemIsSet");
            }
        });
    });
};


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "memcached":
/*!****************************!*\
  !*** external "memcached" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("memcached");

/***/ })

/******/ })));
//# sourceMappingURL=handler.js.map