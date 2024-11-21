(function () {
    
    "use strict";

    var _memoryGraph;
    var _memoryTimeline;
    var _noRunningAppLabel;

    function _init() {
        _memoryGraph = document.getElementById("wdp-xbox-perf-memory");
        _noRunningAppLabel = document.getElementById("wdp-xbox-perf-memory-norunningapplabel");

        // setup the DOM for this control
        var controlHtml =
            '<div class="expandToAvailableSpace">' +
            '   <div class="expandToAvailableSpace">' +
            '       <canvas id="wdp-xbox-performance-memory-chart"></canvas>' +
            '   </div>' +
            '   <div id="wdp-xbox-performance-memory-totalcommit" class="wdp-performancegraph-label chartLegend">' +
            '   </div>' +
            '</div>';
        _memoryGraph.innerHTML = controlHtml;
        Wdp.Xbox.Performance.registerCallback(updatePerformanceData);

        // Grab a few frames before adjusting the initial width and height.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    Wdp.Xbox.Performance.setWidthAndHeightFromParent('wdp-xbox-performance-memory-chart');
                });
            });
        });
    };

    function createMemoryChart() {
        // Create chart
        var memoryChart;
        _memoryTimeline = new TimeSeries();

        var memoryChartOptions = {
            interpolation: 'linear',
            minValue: 0,
            enableDpiScaling: false,
            grid: {
                fillStyle: '#fff',
                strokeStyle: 'rgb(236, 222, 240)',
                verticalSections: 10
            },
            labels: {
                fillStyle: 'rgb(58, 58, 58)',
                fontSize: 15
            }
        };

        memoryChart = new SmoothieChart(memoryChartOptions);
        memoryChart.streamTo(document.getElementById("wdp-xbox-performance-memory-chart"), 1000);
        memoryChart.addTimeSeries(_memoryTimeline,
            { strokeStyle: 'rgb(232, 71, 87)', fillStyle: 'rgba(232, 71, 87, 0.05)', lineWidth: 1 });

        $(window).resize(function () {
            Wdp.Xbox.Performance.setWidthAndHeightFromParent('wdp-xbox-performance-memory-chart');
        });

        $(document).ready(function () {
            Wdp.Xbox.Performance.setWidthAndHeightFromParent('wdp-xbox-performance-memory-chart');
        });
    };

    function updatePerformanceData(performanceData) {
        if (performanceData) {
            if (performanceData.runningAppChanged) {
                createMemoryChart();
            }

            var formattedCommitSize = Wdp.Xbox.Performance.bytesToDisplayValue(performanceData.TotalCommit);

            var currentChartTime = new Date();
            _memoryTimeline.append(currentChartTime, performanceData.TotalCommit);
            $('#wdp-xbox-performance-memory-totalcommit').html("Commit size: " + formattedCommitSize + " (" + performanceData.AppName + ")");

            _memoryGraph.style.display = "block";
            _noRunningAppLabel.style.display = "none";
        } else {
            _memoryGraph.style.display = "none";
            _noRunningAppLabel.style.display = "block";
        }
    };

    _init();
})();
//@ sourceURL=tools/XboxRunningAppMemoryPerformance/XboxRunningAppMemoryPerformance.js