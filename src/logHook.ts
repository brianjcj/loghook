
export enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    Silent,
}

const noop = function () {
};

export interface LogObject {
    message?: any;
    optionalParams: any[];
}

export type PluginHookFnType = (logger: LogHook, level: LogLevel, logObject: LogObject) => void;

export function Hook_AddNameAndTime(logger: LogHook, level: LogLevel, logObject: LogObject): void {
    let prefix = getPrefix(logger.name) + " " + LogLevel[level];
    if (typeof logObject.message == 'string') {
        // message is string. it might contain format flags like %d, %s
        logObject.message = prefix +  " " + logObject.message;
    } else {
        if (logObject.message != undefined) {
            logObject.optionalParams.unshift(logObject.message);
        }
        logObject.message = prefix;
    }
}

export class LogHook {
    readonly name: string;
    logLevel: LogLevel;
    hooks: PluginHookFnType[];

    constructor(name?: string) {
        this.name = name || '';
        this.logLevel = LogLevel.Info;
        this.hooks = [];

        this.addDefaultHooks();
    }

    addDefaultHooks() {
        this.addHook(Hook_AddNameAndTime);
        // this.addHook(Hook_LogView);
        // this.addHook(Hook_WxLog);
    }

    addHook(hook: PluginHookFnType) {
        this.hooks.push(hook);
    }

    clearAllHook() {
        this.hooks = [];
    }

    setLogLevel(level: LogLevel) {
        this.logLevel = level;
    }

    // https://news.ycombinator.com/item?id=5540716
    logTemplate(level: LogLevel, fn: Function, message?: any, ...optionalParams: any[]) {
        if (level < this.logLevel) {
            return noop;
        }

        let logObject: LogObject = {
            message: message,
            optionalParams: optionalParams
        }

        for (let hook of this.hooks) {
            message = hook(this, level, logObject);
        }

        return fn.bind.call(fn, console, logObject.message, ...logObject.optionalParams);
    }

    trace(message?: any, ...optionalParams: any[]) {
        return this.logTemplate(LogLevel.Trace, console.trace, message, ...optionalParams);
    }

    debug(message?: any, ...optionalParams: any[]) {
        // use console.info for debug
        return this.logTemplate(LogLevel.Debug, console.info, message, ...optionalParams);
    }

    info(message?: any, ...optionalParams: any[]) {
        return this.logTemplate(LogLevel.Info, console.info, message, ...optionalParams);
    }

    warn(message?: any, ...optionalParams: any[]) {
        return this.logTemplate(LogLevel.Warn, console.warn, message, ...optionalParams);
    }

    error(message?: any, ...optionalParams: any[]) {
        return this.logTemplate(LogLevel.Error, console.error, message, ...optionalParams);
    }
}

function padMs(ms: number) {
    if (ms < 10) {
        return "00" + ms.toString();
    } else if (ms < 100) {
        return "0" + ms.toString();
    } else {
        return ms.toString();
    }
}

function getPrefix(name: string) {
    let date = new Date();
    return date.toLocaleString('en-US', {hour12: false}) + '.' +
        padMs(date.getMilliseconds()) + (name === '' ? '' : ' ' + name + ":");
}

export function setLogLevel(level: LogLevel, name?: string) {
    if (name == undefined) {
        log.setLogLevel(level);
    } else {
        getLogger(name).setLogLevel(level);
    }
}

export function setLogLevelForAllLoggers(level: LogLevel) {
    for (let k in _loggersByName) {
        _loggersByName[k].setLogLevel(level);
    }
}

export const log = new LogHook();

let _loggersByName: { [k: string]: LogHook } = {};

export function getLogger(name: string) {
    if (name === "") {
        throw new TypeError("You must supply a name when creating a logger.");
    }

    let logger = _loggersByName[name];
    if (!logger) {
        logger = _loggersByName[name] = new LogHook(name);
    }
    return logger;
}

const logHookObj = {
    setLogLevel: setLogLevel,
    setLogLevelForAllLoggers: setLogLevelForAllLoggers,
};

export function exportContrlWithName(name: string) {
    try {
        if (window) {
            (window as any)[name] = logHookObj;
        }
    } catch (err) { }
}

