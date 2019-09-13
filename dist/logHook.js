"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Silent"] = 5] = "Silent";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var noop = function () {
};
function Hook_AddNameAndTime(logger, level) {
    var message = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        message[_i - 2] = arguments[_i];
    }
    var args = [].slice.call(message);
    args.unshift(getPrefix(logger.name));
    args.unshift(LogLevel[level]);
    return args;
}
exports.Hook_AddNameAndTime = Hook_AddNameAndTime;
var LogHook = /** @class */ (function () {
    function LogHook(name) {
        this.name = name || '';
        this.logLevel = LogLevel.Info;
        this.hooks = [];
        this.addDefaultHooks();
    }
    LogHook.prototype.addDefaultHooks = function () {
        this.addHook(Hook_AddNameAndTime);
        // this.addHook(Hook_LogView);
        // this.addHook(Hook_WxLog);
    };
    LogHook.prototype.addHook = function (hook) {
        this.hooks.push(hook);
    };
    LogHook.prototype.clearAllHook = function () {
        this.hooks = [];
    };
    LogHook.prototype.setLogLevel = function (level) {
        this.logLevel = level;
    };
    // https://news.ycombinator.com/item?id=5540716
    LogHook.prototype.logTemplate = function (level, fn) {
        var message = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            message[_i - 2] = arguments[_i];
        }
        if (level < this.logLevel) {
            return noop;
        }
        for (var _a = 0, _b = this.hooks; _a < _b.length; _a++) {
            var hook = _b[_a];
            message = hook.apply(void 0, __spreadArrays([this, level], message));
        }
        message.unshift(console);
        return fn.bind.apply(fn, message);
    };
    LogHook.prototype.trace = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        return this.logTemplate.apply(this, __spreadArrays([LogLevel.Trace, console.trace], message));
    };
    LogHook.prototype.debug = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        // return this.logTemplate(LogLevel.Debug, console.debug, ...message);
        return this.logTemplate.apply(this, __spreadArrays([LogLevel.Debug, console.info], message));
    };
    LogHook.prototype.info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        return this.logTemplate.apply(this, __spreadArrays([LogLevel.Info, console.info], message));
    };
    LogHook.prototype.warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        return this.logTemplate.apply(this, __spreadArrays([LogLevel.Warn, console.warn], message));
    };
    LogHook.prototype.error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        return this.logTemplate.apply(this, __spreadArrays([LogLevel.Error, console.error], message));
    };
    return LogHook;
}());
exports.LogHook = LogHook;
function getPrefix(name) {
    var date = new Date();
    return date.toLocaleString('en-US', { hour12: false }) + '.' +
        date.getMilliseconds() + (name === '' ? '' : ' ' + name + ":");
}
function setLogLevel(level, name) {
    if (name == undefined) {
        exports.log.setLogLevel(level);
    }
    else {
        getLogger(name).setLogLevel(level);
    }
}
exports.setLogLevel = setLogLevel;
exports.log = new LogHook();
var _loggersByName = {};
function getLogger(name) {
    if (name === "") {
        throw new TypeError("You must supply a name when creating a logger.");
    }
    var logger = _loggersByName[name];
    if (!logger) {
        logger = _loggersByName[name] = new LogHook(name);
    }
    return logger;
}
exports.getLogger = getLogger;
var logHookObj = {
    setLogLevel: setLogLevel
};
try {
    if (window) {
        window.LOGHOOK = logHookObj;
    }
}
catch (err) { }
