
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

export type PluginHookFnType = (logger: LogHook, level: LogLevel, ...message: any[]) => any[];

export function Hook_AddNameAndTime(logger: LogHook, level: LogLevel, ...message: any[]): any[] {
    let args: any = [].slice.call(message);
    args.unshift(getPrefix(logger.name));
    args.unshift(LogLevel[level]);
    return args;
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
    logTemplate(level: LogLevel, fn: Function, ...message: any[]) {
        if (level < this.logLevel) {
            return noop;
        }

        for (let hook of this.hooks) {
            message = hook(this, level, ...message);
        }

        message.unshift(console);

        return fn.bind.apply(fn, message as any);
    }

    trace(...message: any[]) {
        return this.logTemplate(LogLevel.Trace, console.trace, ...message);
    }

    debug(...message: any[]) {
        // return this.logTemplate(LogLevel.Debug, console.debug, ...message);
        return this.logTemplate(LogLevel.Debug, console.info, ...message);
    }

    info(...message: any[]) {
        return this.logTemplate(LogLevel.Info, console.info, ...message);
    }

    warn(...message: any[]) {
        return this.logTemplate(LogLevel.Warn, console.warn, ...message);
    }

    error(...message: any[]) {
        return this.logTemplate(LogLevel.Error, console.error, ...message);
    }
}

function getPrefix(name: string) {
    let date = new Date();
    return date.toLocaleString('en-US', {hour12: false}) + '.' +
        date.getMilliseconds() + (name === '' ? '' : ' ' + name + ":");
}

export function setLogLevel(level: LogLevel, name?: string) {
    if (name == undefined) {
        log.setLogLevel(level);
    } else {
        getLogger(name).setLogLevel(level);
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
    setLogLevel: setLogLevel
};

try {
    if (window) {
        (window as any).LOGHOOK = logHookObj;
    }
} catch (err) { }
