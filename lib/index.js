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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
exports.activate = void 0;
const coc_nvim_1 = __webpack_require__(1);
const commands_1 = __webpack_require__(2);
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        registerCommands(context);
        return Promise.resolve();
    });
}
exports.activate = activate;
function registerCommands(context) {
    context.subscriptions.push(coc_nvim_1.commands.registerCommand(commands_1.Commands.JAVA_DEBUG_VIMSPECTOR_START, startVimspector));
}
function startVimspector() {
    return __awaiter(this, arguments, void 0, function* () {
        coc_nvim_1.workspace.showMessage('Starting Java debug server...');
        const debugPort = yield coc_nvim_1.commands.executeCommand(commands_1.Commands.EXECUTE_WORKSPACE_COMMAND, commands_1.Commands.JAVA_START_DEBUG_SESSION);
        coc_nvim_1.workspace.showMessage(`Java debug server started on port: ${debugPort}`);
        const debugConfig = coc_nvim_1.workspace.getConfiguration('java.debug');
        const profile = debugConfig.get('vimspector.profile');
        const adapterPort = debugConfig.get('vimspector.substitution.adapterPort');
        const overrides = getOverrides(arguments);
        const defaults = {};
        if (profile) {
            defaults['configuration'] = profile;
        }
        const settings = Object.assign(Object.assign({ [adapterPort]: debugPort }, defaults), overrides);
        const vimspectorSettings = JSON.stringify(settings);
        // See https://github.com/puremourning/vimspector#launch-with-options
        coc_nvim_1.workspace.showMessage(`Launching Vimspector with settings: ${vimspectorSettings}`);
        return coc_nvim_1.workspace.nvim.eval(`vimspector#LaunchWithSettings(${vimspectorSettings})`);
    });
}
/**
 * Converts the input command arguments to an object to be applied as
 * Vimspector settings overides.
 *
 * This also handles the possibily of the command args being split by spaces
 * before being passed to the callback.
 */
function getOverrides(rawArguments) {
    let args = '';
    if (rawArguments.length == 0) {
        args = rawArguments[0];
    }
    else if (rawArguments.length >= 1) {
        const a = [];
        for (const v of rawArguments) {
            a.push(v);
        }
        args = a.join(' ');
    }
    return parseOverrides(args);
}
function parseOverrides(args) {
    let overrides = {};
    if (args) {
        try {
            overrides = JSON.parse(args);
        }
        catch (e) {
            coc_nvim_1.workspace.showMessage(`Expected valid JSON for Vimspector settings, but got: ${args}`, 'error');
        }
    }
    return overrides;
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("coc.nvim");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
var Commands;
(function (Commands) {
    /**
     * vscode-java-debug command to start a debug session.
     */
    Commands.JAVA_START_DEBUG_SESSION = 'vscode.java.startDebugSession';
    /**
     * coc command to start a java debugger session and connect vimspector to it.
     */
    Commands.JAVA_DEBUG_VIMSPECTOR_START = 'java.debug.vimspector.start';
    /**
     * Execute Workspace Command
     */
    Commands.EXECUTE_WORKSPACE_COMMAND = 'java.execute.workspaceCommand';
})(Commands = exports.Commands || (exports.Commands = {}));


/***/ })
/******/ ])));