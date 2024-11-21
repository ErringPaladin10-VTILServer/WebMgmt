(function () {
    
    "use strict";

    var _callbacks = [];
    var _runningAppPackageName;
    var _socket;
    var _refreshProcessInfoTimerCookie;

    function _init() {
        // Listen for process info updates
        var websocketProtocol = (document.location.protocol === 'https:' ? 'wss://' : 'ws://');
        var host = websocketProtocol + window.location.host + '/api/resourcemanager/processes';
        try {
            _socket = new WebSocket(host);
        } catch (ex) {
            // This means too many sockets have been opened and to be safe we reload
            // the page.
            if (ex.code === 18) {
                location.reload();
            }
        }

        _socket.addEventListener("message", _handleProcessesSocketOnMessage, false);
        window.addEventListener("beforeunload", _dispose, false);
    };

    function _registerCallback(callback) {
        _callbacks.push(callback);
    };

    function _dispose() {
        clearInterval(_refreshProcessInfoTimerCookie);
        _socket.close();
    };

    function _updateRunningAppPerformanceData(processes) {
        var appPerformanceData;

        var noRunningApp = true;
        for (var i = 0, len = processes.length; i < len; i++) {
            var process = processes[i];

            // Ignore eraproxyapp (ERA titles) until we support stats on the ERA VM.
            // Otherwise these stats will be basically zero as they will only report
            // the proxy EXE running in the system OS.
            var packageFullName = process.PackageFullName;
            if (packageFullName &&
                process.IsRunning &&
                process.ImageName &&
                process.ImageName.toLowerCase() !== "eraproxyapp.exe") {
                noRunningApp = false;
                appPerformanceData = {};
                // If the current running app has changed, then
                // refresh the graph data.
                if (_runningAppPackageName !== packageFullName) {
                    _runningAppPackageName = packageFullName;
                    appPerformanceData.runningAppChanged = true;
                } else {
                    appPerformanceData.runningAppChanged = false;
                }
                appPerformanceData.CPUUsage = process.CPUUsage;
                appPerformanceData.PrivateWorkingSet = process.PrivateWorkingSet;
                appPerformanceData.WorkingSetSize = process.WorkingSetSize;
                appPerformanceData.TotalCommit = process.TotalCommit;
                appPerformanceData.AppName = process.AppName;
                break;
            }
        }
        return appPerformanceData;
    };

    function _handleProcessesSocketOnMessage(messageEvent) {
        var processData = JSON.parse(messageEvent.data);
        var performanceData = _updateRunningAppPerformanceData(processData.Processes);
        for (var i = 0, len = _callbacks.length; i < len; i++) {
            _callbacks[i].apply(this, [performanceData]);
        }
    };

    function _setWidthAndHeightFromParent(elementId) {
        var element = document.getElementById(elementId);
        if (!element) {
            return;
        }

        var parent = element.parentNode;
        if (parent) {
            var elementRect = parent.getBoundingClientRect();
            if (elementRect.height &&
                elementRect.width) {
                element.height = elementRect.height;
                element.width = elementRect.width;
            }
        }
    };

    function _highlightHover(label, timeseries, chart) {
        var fill = chart.getTimeSeriesOptions(timeseries).fillStyle;
        var width = chart.getTimeSeriesOptions(timeseries).lineWidth;
        $(label).hover(function () {
            chart.getTimeSeriesOptions(timeseries).fillStyle = 'rgba(255,255,255,1)';
            chart.getTimeSeriesOptions(timeseries).lineWidth = 5;
        },
        function () {
            chart.getTimeSeriesOptions(timeseries).fillStyle = fill;
            chart.getTimeSeriesOptions(timeseries).lineWidth = width;
        });

    };

    function _bytesToDisplayValue(bytesInput) {
        if (isNaN(bytesInput)) {
            return "N/A";
        }

        bytesInput = parseFloat(bytesInput);
        var sizes = ["bytes", "KB", "MB", "GB"];
        var i = 0;

        while (bytesInput > 1024 && i < sizes.length - 1) {
            bytesInput /= 1024;
            i++;
        }

        return bytesInput.toFixed(1) + " " + sizes[i];
    };

    _init();

    var Wdp = window.Wdp || {};
    Wdp.Xbox = Wdp.Xbox || {};
    Wdp.Xbox.Performance = Wdp.Xbox.Performance || {};
    Wdp.Xbox.Performance.registerCallback = _registerCallback;
    Wdp.Xbox.Performance.setWidthAndHeightFromParent = _setWidthAndHeightFromParent;
    Wdp.Xbox.Performance.highlightHover = _highlightHover;
    Wdp.Xbox.Performance.bytesToDisplayValue = _bytesToDisplayValue;
})();
//@ sourceURL=tools/XboxPerformanceCommon/XboxPerformanceCommon.js