export declare enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Silent = 5
}
export declare type PluginHookFnType = (logger: LogHook, level: LogLevel, ...message: any[]) => any[];
export declare function Hook_AddNameAndTime(logger: LogHook, level: LogLevel, ...message: any[]): any[];
export declare class LogHook {
    readonly name: string;
    logLevel: LogLevel;
    hooks: PluginHookFnType[];
    constructor(name?: string);
    addDefaultHooks(): void;
    addHook(hook: PluginHookFnType): void;
    clearAllHook(): void;
    setLogLevel(level: LogLevel): void;
    logTemplate(level: LogLevel, fn: Function, ...message: any[]): any;
    trace(...message: any[]): any;
    debug(...message: any[]): any;
    info(...message: any[]): any;
    warn(...message: any[]): any;
    error(...message: any[]): any;
}
export declare function setLogLevel(level: LogLevel, name?: string): void;
export declare const log: LogHook;
export declare function getLogger(name: string): LogHook;
