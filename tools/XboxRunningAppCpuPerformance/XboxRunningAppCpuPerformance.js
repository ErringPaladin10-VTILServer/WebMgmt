(function () {
    
    "use strict";

    var _cpuGraph;
    var _cpuTimeline;
    var _noRunningAppLabel;

    function _init() {
        _cpuGraph = document.getElementById("wdp-xbox-perf-cpu");
        _noRunningAppLabel = document.getElementById("wdp-xbox-perf-cpu-norunningapplabel");

        // setup the DOM for this control
        var controlHtml =
            '<div class="expandToAvailableSpace">' +
            '    <div class="expandToAvailableSpace">' +
            '        <canvas id="wdp-xbox-performance-cpu-chart"></canvas>' +
            '    </div>' +
            '    <div id="wdp-xbox-performance-cpu-utilization" class="wdp-performancegraph-label chartLegend">' +
            '    </div>' +
            '</div>';
        _cpuGraph.innerHTML = controlHtml;
        Wdp.Xbox.Performance.registerCallback(updatePerformanceData);

        // Grab a few frames before adjusting the initial width and height.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    Wdp.Xbox.Performance.setWidthAndHeightFromParent('wdp-xbox-performance-cpu-chart');
                });
            });
        });
    };

    function createCPUChart() {
        // Create chart
        var cpuChart;
        _cpuTimeline = new TimeSeries();

        var cpuChartOptions = {
            fillStyle: '#fff',
            minValue: 0,
            maxValue: 100,
            interpolation: 'linear',
            enableDpiScaling: false,
            grid: {
                fillStyle: 'transparent',
                strokeStyle: 'rgb(217, 234, 244)',
                verticalSections: 10
            },
            labels: {
                fillStyle: 'rgb(58, 58, 58)',
                fontSize: 15
            }
        };

        cpuChart = new SmoothieChart(cpuChartOptions);
        cpuChart.streamTo(document.getElementById("wdp-xbox-performance-cpu-chart"), 1000);
        cpuChart.addTimeSeries(_cpuTimeline, { strokeStyle: 'rgb(17, 125, 187)', fillStyle: 'rgba(17, 125, 187, 0.05)', lineWidth: 1 });

        $(window).resize(function () {
            Wdp.Xbox.Performance.setWidthAndHeightFromParent('wdp-xbox-performance-cpu-chart');
        });

        $(document).ready(function () {
            Wdp.Xbox.Performance.setWidthAndHeightFromParent('wdp-xbox-performance-cpu-chart');
        });
    };

    function updatePerformanceData(performanceData) {
        if (performanceData) {
            if (performanceData.runningAppChanged) {
                createCPUChart();
            }

            var currentChartTime = new Date();
            _cpuTimeline.append(currentChartTime, performanceData.CPUUsage);
            $('#wdp-xbox-performance-cpu-utilization').html("Commit size: " + performanceData.CPUUsage + " (" + performanceData.AppName + ")");

            _cpuGraph.style.display = "block";
            _noRunningAppLabel.style.display = "none";
        } else {
            _cpuGraph.style.display = "none";
            _noRunningAppLabel.style.display = "block";
        }
    };

    _init();
})();
//@ sourceURL=tools/XboxRunningAppCpuPerformance/XboxRunningAppCpuPerformance.js