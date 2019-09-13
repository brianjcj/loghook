"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logViewVisible = false;
var shouldRecordLog = false;
var logViewElementId = 'com.logHook.__logHook';
var maxLogLength = 1000;
var recordLines = [];
function Hook_LogView(logger, level) {
    var message = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        message[_i - 2] = arguments[_i];
    }
    record(message);
    return message;
}
exports.Hook_LogView = Hook_LogView;
function record(message) {
    if (!shouldRecordLog) {
        return;
    }
    if (recordLines.length === maxLogLength + 100) {
        recordLines.splice(0, 100);
    }
    var line = message.join(" ");
    recordLines.push(line);
    if (logViewVisible) {
        var logWindow = document.getElementById(logViewElementId);
        logWindow.value += line + '\r\n';
        logWindow.scrollTop = logWindow.scrollHeight;
    }
}
function setRecordLog(boo) {
    shouldRecordLog = boo;
}
exports.setRecordLog = setRecordLog;
function setLogVisible(visible) {
    logViewVisible = visible;
    var logView = document.getElementById(logViewElementId);
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
    }
    else {
        if (logView) {
            if (logView.parentNode != null) {
                logView.parentNode.removeChild(logView);
            }
        }
    }
}
exports.setLogVisible = setLogVisible;
var logViewObj = {
    setLogVisible: setLogVisible,
    setRecordLog: setRecordLog,
};
try {
    if (window) {
        window.LOGVIEW = logViewObj;
    }
}
catch (err) { }
