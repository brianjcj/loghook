A log lib preserves right (console) line number, supports setting log level and supports plugins.

It preserves all the characters of consloe info(associate file and line number where call
the log function, display logged object nicely in browser), and enable to add hooks to
custom the log behaviors, such as changing the log format, adding prefix, recording logs
to local memory or sending over networking.

The default enabled hook is to add timestamp and log level string to log message.

# Usage

## Use the default log

Please NOTE: there are two parentheses needed to call log functions. The first
parenthese is to call the hooks and the second is to finally call the console log
function. We don't wrap console info in function to make the right file and line
number information associated with the log. If calling the console log function
inside the wrapper function, the file and line number will associate with wrapper
function. It is obviously not we expect.

hope it is not too disturbing.


```ts
import { log, LogLevel } from "loghook"

log.setLogLevel(LogLevel.Trace);

log.info("test default log", [1,2,3], [4,5,6])();
log.info("test format %f is a float.", 1.1, [1,2,3])();
log.warn([1,2,3,4])();
log.warn()();
log.info({a:1, b:2}, [1,2,3])();
```

Will output shomething like that:
```
9/14/2019, 15:11:11.002 Info test default log [ 1, 2, 3 ] [ 4, 5, 6 ]
9/14/2019, 15:11:11.123 Info test format 1.1 is a float. [ 1, 2, 3 ]
9/14/2019, 15:11:11.125 Warn [ 1, 2, 3, 4 ]
9/14/2019, 15:11:11.127 Warn
9/14/2019, 15:11:11.129 Info { a: 1, b: 2 } [ 1, 2, 3 ]
```

Default level of a logger is Info. You can change it via setLogLevel function.

## getLogger

You can make a new logger, with a log name and new log level set.
Given the same log name, the same logger will always return.

```ts
import { getLogger, LogLevel } from "loghook"

let logger = getLogger("App");
logger.setLogLevel(LogLevel.Debug);

logger.info("test logger", [1,2,3], [7,8,9])();
```

Will output shomething like that:
```
9/14/2019, 15:11:11.122 App: Info test logger [ 1, 2, 3 ] [ 7, 8, 9 ]
```

# Add your hook (to add customize behaviors)

Hook function prototype:
```ts
export type PluginHookFnType = (logger: LogHook, level: LogLevel, logObject: LogObject) => void;
```

The default hook (to add time and log level string to log message) is
implemented as below, for your referrence.
```ts
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
```

Add hook to default logger.

```ts
log.addHook(your_hook_function);
```
or:
```ts
let logger = getLogger("App");
logger.addHook(your_hook_function);

```

To clear all hook of default logger:
```ts
log.clearAllHook()
```

Or clear all hook of a named logger:
```ts
let logger = getLogger("App");
logger.clearAllHook();

```


# Set log level in browser console

You can export setLogLevel function to window object. e.g.,

```ts
import { exportContrlWithName } from "loghook"
exportContrlWithName("MY_LOG_HOOK_CTL");
```

Then you can set log level in browser control like that:
```ts
window.MY_LOG_HOOK_CTL.setLogLevel(1);  // set the default logger's level to debug
window.MY_LOG_HOOK_CTL.setLogLevel(0, "App");  // set the level of logger name "App" to trace

window.MY_LOG_HOOK_CTL.setLogLevelForAllLoggers(3); // set log level for all loggers to warn
```

You can use it to turn on/off logging on fly when running your app in the
browser.


The loglevel definitions:
```ts
export enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Silent = 5,
}
```

