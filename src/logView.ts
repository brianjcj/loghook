
import { LogHook, LogLevel } from "./logHook"

let logViewVisible = false;
let shouldRecordLog = false;
const logViewElementId = 'com.logHook.__logHook';
const maxLogLength = 1000;
let recordLines: string[] = [];


export function Hook_LogView(logger: LogHook, level: LogLevel, ...message: any[]): any[] {
    record(message);
    return message;
}

function record(message: any[]) {
    if (!shouldRecordLog) {
        return;
    }

    if (recordLines.length === maxLogLength + 100) {
        recordLines.splice(0, 100);
    }
    let line = message.join(" ");
    recordLines.push(line);

    if (logViewVisible) {
        let logWindow = <HTMLTextAreaElement>document.getElementById(logViewElementId);
        logWindow.value += line + '\r\n';
        logWindow.scrollTop = logWindow.scrollHeight;
    }
}

export function setRecordLog(boo: boolean) {
    shouldRecordLog = boo;
}

export function setLogVisible(visible: boolean) {
    logViewVisible = visible;

    let logView = <HTMLTextAreaElement>document.getElementById(logViewElementId);
    if (visible) {
        shouldRecordLog = true;

        if (!logView) {
            logView = document.createElement('textarea');
            logView.id = logViewElementId;

            logView.style.display = 'block';
            logView.style.position = 'absolute';
            logView.style.top = '0';
            logView.style.width = '500px';
            logView.style.height = '300px';

            document.body.appendChild(logView);
        }

        if (recordLines.length > 0) {
            logView.value = recordLines.join('\r\n') + '\r\n';
        }

        logView.scrollTop = logView.scrollHeight;
    } else {
        if (logView) {
            if (logView.parentNode != null) {
                logView.parentNode.removeChild(logView);
            }
        }
    }
}

const logViewObj = {
    setLogVisible: setLogVisible,
    setRecordLog: setRecordLog,
};

try {
    if (window) {
        (window as any).LOGVIEW = logViewObj;
    }
} catch (err) {}