// JavaScript source code
///<reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2-vsdoc.js" />

var enableButton;

function HttpMonitorConnection(callbacks) {
    var self = this;
    self.callbacks = callbacks;

    var websocketProtocol = (document.location.protocol === 'https:' ? 'wss://' : 'ws://');
    var host = websocketProtocol + window.location.host + '/ext/httpmonitor/sessions';

    self.socket = new WebSocket(host);

    self.socket.onmessage = function (messageEvent) {
        self.callbacks.onmessage(JSON.parse(messageEvent.data));
    };

    self.socket.onerror = function () {
        if (self.callbacks.onerror) {
            self.callbacks.onerror();
        }
    };

    self.socket.onclose = function () {
        if (self.callbacks.onclose) {
            var e = {};
            e.pageUnloading = self.pageUnloading;
            self.callbacks.onclose(e);
        }
    };

    self.socket.onopen = function () {
        if (self.callbacks.onopen) {
            self.callbacks.onopen();
        }
    };

    this.enable = function () {
        var message = "enable";
        self.socket.send(message);
    };

    this.disable = function () {
        self.socket.send("disable");
    };

    this.stop = function () {
        closeConnection();
    }

    function isAlive() {
        return (self.socket &&
                (self.socket.readyState === WebSocket.OPEN || self.socket.readyState === WebSocket.CONNECTING));
    }

    this.IsAlive = isAlive;

    function closeConnection() {

        if (isAlive()) {
            self.socket.close();
        }
    }

    // We need to close the socket on page unload of the page fragment.
    window.addEventListener("unload", closeConnection, false);
};

function toggleStartStop() {
    var currentValue = enableButton.textContent;
    if (currentValue === "Start") {
        enableButton.textContent = "Stop";
        this.httpMonitorConnection.enable();
    } else {
        enableButton.textContent = "Start";
        this.httpMonitorConnection.disable();
    }
};

function HttpMonitor() {
    var self = this;

    enableButton = document.getElementById("toggleStartStopButton");
    enableButton.addEventListener("click", toggleStartStop.bind(this), false);

    Wdp = Wdp || {};
    Wdp.Utils = Wdp.Utils || {};
    Wdp.Utils.Xbox = Wdp.Utils.Xbox || {};
    Wdp.Utils.Xbox.HttpMonitor = Wdp.Utils.Xbox.HttpMonitor || {};

    if (!Wdp.Utils.Xbox.HttpMonitor.dataView) {
        Wdp.Utils.Xbox.HttpMonitor.dataView = new Slick.Data.DataView();
        Wdp.Utils.Xbox.HttpMonitor.dataView.setItems([]);

        Wdp.Utils.Xbox.HttpMonitor.autoScroll = true;
    }

    self.sessionsViewer = new HttpSessionsViewer("#httpSessionsGrid", Wdp.Utils.Xbox.HttpMonitor.dataView, { gridLabel: 'HTTP Sessions', rowHeaderName: 'Provider' });

    if (!Wdp.Utils.Xbox.HttpMonitor.connection || !Wdp.Utils.Xbox.HttpMonitor.connection.IsAlive()) {
        function onMessage(data) { self.sessionsViewer.onSessionsAvailable(data); }

        function onError() {
            $('#httpMonitorConnectionStatus')
                .text("Connection to device lost. Refresh the page to reconnect.")
                .removeClass("hidden");
        };

        function onOpen() {
            // Default to enabled
            self.httpMonitorConnection.enable();
        };

        function onClose() {
            $('#httpMonitorConnectionStatus')
                .text("Connection to device lost. Refresh the page to reconnect.")
                .removeClass("hidden");
        };

        Wdp.Utils.Xbox.HttpMonitor.connection = new HttpMonitorConnection({ onopen: onOpen, onerror: onError, onclose: onClose, onmessage: onMessage });
    }

    self.httpMonitorConnection = Wdp.Utils.Xbox.HttpMonitor.connection;

    enableSlickGridTabbing("httpSessionsGrid", true);
};

function HttpSessionsViewer(parentElementId, dataView, settings) {

    var self = this;
    self.maxSessionCount = 50000;
    // privates
    var httpSessionsGrid;
    var sessionCounter = 0;

    var webbAwareFields = ['WebbEventCounter', 'WebbCompletePayload'];

    function showSessionSelection(showSessionSelection) {
        if (showSessionSelection) {
            $('#httpMonitor-session-selection').show();
            $('#httpMonitor-session-noSelection').hide();
        }
        else {
            $('#httpMonitor-session-selection').hide();
            $('#httpMonitor-session-noSelection').show();
        }
    }

    // Tabs for session selection
    $('input[type=radio]').click(function () {
        if ($(this).is(':checked')) {
            var id = $(this).get(0).id;

            if (id == 'httpMonitor-session-selection-tabDisplay-headersOption') {
                $('#httpMonitor-session-selection-headers').show();
                $('#httpMonitor-session-selection-body').hide();
            }
            else if ('httpMonitor-session-selection-tabDisplay-bodyOption') {
                $('#httpMonitor-session-selection-body').show();
                $('#httpMonitor-session-selection-headers').hide();
            }
        }
    });

    function initializeTableAndViews(dataView) {

        // initializeSessionsTable
        var sessionsTableColumns = [
            { id: "RequestURL", name: "Request URL", field: "RequestURL", sortable: true, width: 560, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "RequestMethod", name: "Request Method", field: "RequestMethod", sortable: true, width: 132, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "StatusCode", name: "Status Code", field: "StatusCode", sortable: true, width: 132, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "ResponseContentType", name: "Response Content Type", field: "ResponseContentType", sortable: true, width: 208, cssClass: "tableCell", headerCssClass: "tableHeader" }
        ];

        var sessionsTableOptions = {
            selectedCellCssClass: "rowSelected",
            enableCellNavigation: true,
            enableColumnReorder: false,
            showHeaderRow: true,
            syncColumnCellResize: true,
            rowHeight: 36.5,
            headerRowHeight: 40.45,
            gridLabel: settings.gridLabel,
            rowHeaderName: settings.rowHeaderName,
            rowHeaderId: settings.rowHeaderId,
            rowHeaderColumn: settings.rowHeaderColumn,
            multiSelect: false
        };

        httpSessionsGrid = new Slick.Grid(parentElementId, dataView, sessionsTableColumns, sessionsTableOptions);
        httpSessionsGrid.setSelectionModel(new Slick.RowSelectionModel());


        httpSessionsGrid.onSort.subscribe(function (e, args) {
            var comparer = function (a, b) {
                return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
            };
            dataView.sort(comparer, args.sortAsc);
            Wdp.Utils.Xbox.HttpMonitor.sortColumns = httpSessionsGrid.getSortColumns();
        });

        if (Wdp.Utils.Xbox.HttpMonitor.sortColumns) {
            httpSessionsGrid.setSortColumns(Wdp.Utils.Xbox.HttpMonitor.sortColumns);
        }

        function generateHeadersDom(headersObject, parentElementId) {
            if (headersObject) {
                var innerHtml = '';
                var sortedKeys = Object.keys(headersObject).sort()

                if (sortedKeys.length > 0) {
                    for (index in sortedKeys) {
                        var name = sortedKeys[index];
                        var value = headersObject[name];
                        innerHtml += '<div class="httpMonitor-session-field"><label class="httpMonitor-session-field-name displayInlineBlock">' + name + ':&nbsp;</label><div class="httpMonitor-session-field-value displayInlineBlock">' + value + '</div></div>';
                    }
                }
            }
            $(parentElementId).html(innerHtml ? innerHtml : '');
        }

        function generateBodyDom(bodyObject, parentElementId, typeName) {
            if (bodyObject) {
                var jsonText = null;

                // pretty print JSON
                try {
                    var json = JSON.parse(bodyObject);
                    jsonText = JSON.stringify(json, null, 2);
                } catch (e) {
                    // Do nothing if this isn't valid JSON.
                }

                // If this isn't valid JSON then fallback on unformatted text.
                if (jsonText) {
                    $(parentElementId).html('<pre>' + jsonText + '</pre>');
                }
                else {
                    $(parentElementId).text(bodyObject);
                }
            }
            else {
                $(parentElementId).text('This resource has no ' + typeName + ' payload data');
            }
        }

        httpSessionsGrid.onSelectedRowsChanged.subscribe(function onChange(e, args) {
            // Only allow 1 row to be selected due to shift + arrow keys bug in slick grid.
            if (args.rows.length > 1) {
                httpSessionsGrid.setSelectedRows([args.rows[args.rows.length-1]])
            } else {
                var clickedSession = httpSessionsGrid.getDataItem(args.rows[0]);

                // Persist selection
                Wdp.Utils.Xbox.HttpMonitor.selectedRowIDs = dataView.mapRowsToIds(httpSessionsGrid.getSelectedRows());


                if (clickedSession) {

                    var responseHeaders = Object.assign(clickedSession['ResponseHeaders'], clickedSession['ResponseContentHeaders']);
                    var requestHeaders = Object.assign(clickedSession['RequestHeaders'], clickedSession['RequestContentHeaders']);

                    generateHeadersDom(responseHeaders, '#httpMonitor-session-selection-headers-response');
                    generateHeadersDom(requestHeaders, '#httpMonitor-session-selection-headers-request');
                    generateBodyDom(clickedSession['ResponseMessage'], '#httpMonitor-session-selection-body-response', 'response');
                    generateBodyDom(clickedSession['RequestMessage'], '#httpMonitor-session-selection-body-request', 'request');

                    showSessionSelection(true);
                }
            }
        });

        // After page is loaded resize grid canvas.
        setTimeout(function () {
            httpSessionsGrid.resizeCanvas();
        }, 100);


        $(window).resize(function () {
            httpSessionsGrid.resizeCanvas();
        });

        if(Wdp.Utils.Xbox.HttpMonitor.selectedRowIDs) {
            httpSessionsGrid.setSelectedRows(dataView.mapIdsToRows(Wdp.Utils.Xbox.HttpMonitor.selectedRowIDs));
        }

        var slickViewPort = $(".slick-viewport").get()[0];

        // If autoscroll persisted then scroll to the bottom, else use scroll top.
        if (Wdp.Utils.Xbox.HttpMonitor.autoScroll) {
            slickViewPort.scrollTop = slickViewPort.scrollHeight;
        } else {
            // If persisted restore scroll position.
            if (Wdp.Utils.Xbox.HttpMonitor.scrollTop) {
                slickViewPort.scrollTop = Wdp.Utils.Xbox.HttpMonitor.scrollTop;
            }
        }

        Wdp.Utils.Xbox.HttpMonitor.scrollTop = slickViewPort.scrollTop;

        slickViewPort.onscroll = function () {
            if (Wdp.Utils.Xbox.HttpMonitor.autoScroll) {
                // If scrolled up then stop auto scrolling.
                // Minus 30 for margin of error for loading page while auto scrolling
                if (slickViewPort.scrollTop < Wdp.Utils.Xbox.HttpMonitor.scrollTop - 30) {
                    Wdp.Utils.Xbox.HttpMonitor.autoScroll = false;
                }
            } else {
                // Enable auto-scroll if scrolled to the bottom.
                if (slickViewPort.scrollHeight - slickViewPort.scrollTop - slickViewPort.clientHeight < 5) {
                    Wdp.Utils.Xbox.HttpMonitor.autoScroll = true;
                }
            }

            Wdp.Utils.Xbox.HttpMonitor.scrollTop = slickViewPort.scrollTop;
        };

        dataView.onRowCountChanged.subscribe(function () {
            httpSessionsGrid.updateRowCount();
            httpSessionsGrid.render();

            if (Wdp.Utils.Xbox.HttpMonitor.autoScroll) {
                slickViewPort.scrollTop = slickViewPort.scrollHeight;
            }

            Wdp.Utils.Xbox.HttpMonitor.scrollTop = slickViewPort.scrollTop;
        });

        dataView.onRowsChanged.subscribe(function (e, args) {

            httpSessionsGrid.invalidateRows(args.rows);
            httpSessionsGrid.render();
        });
    };

    function wireButtons() {
        $("#clearSessions").bind('click', (function () {
            showSessionSelection(false);
            dataView.setItems([]);
            sessionCounter = 0;
            updateSessionCounter(0, 0);
        }));

        $("#saveTrace").bind('click', SaveTraceToFile);
    };

    function updateSessionCounter(sessionCount, maxSessionCount) {
        var $sessionsCounter = $('#sessionsCounter');

        if (sessionCount > maxSessionCount) {
            $sessionsCounter.text('Sessions: ' + sessionCounter + ' (truncated to last ' + maxSessionCount + ').');
            $sessionsCounter.addClass('warning');
        }
        else {
            $sessionsCounter.text('Sessions: ' + sessionCounter );
            $sessionsCounter.removeClass('warning');
        }
    };

    function SaveTraceToFile() {
        if (typeof Blob === "undefined") {
            alert("Operation failed - browser does not support blob format, please update your browser");
            return;
        }

        var traceSessions = dataView.getItems();

        var columnFieldsAndNames = [['RequestHeaders', 'Request Headers'],
                           ['RequestContentHeaders', 'Request Content Headers'],
                           ['RequestURL', 'Request URL'],
                           ['RequestMethod', 'Request Method'],
                           ['RequestMessage', 'Request Message'],
                           ['ResponseHeaders', 'Response Headers'],
                           ['ResponseContentHeaders', 'Response Content Headers'],
                           ['StatusCode', 'Status Code'],
                           ['ReasonPhrase', 'Reason Phrase'],
                           ['ResponseMessage', 'Response Message'],
                           ['ResponseContentType', 'Response Content Type']];

        var commaSeparatedTrace = [];
        var headerString = '';

        // Prepare header
        for (var i in columnFieldsAndNames) {
            headerString += columnFieldsAndNames[i][1] + ','
        }

        headerString += '\r\n';
        commaSeparatedTrace.push(headerString);

        for (var i in traceSessions) {

            var sessionString = '';

            for (var j in columnFieldsAndNames) {

                var field = columnFieldsAndNames[j][0];
                if (field && traceSessions[i][field]) {

                    if (field != 'WebbEventCounter' && field != 'WebbCompletePayload' && !field.endsWith('Headers')) {
                        sessionString += '"' + traceSessions[i][field].toString().replace(/"/g, '""') + '",';
                    }
                    else if (field.endsWith('Headers')) {
                        var headersString = '';
                        var headers = traceSessions[i][field];
                        for (var headerName in headers) {
                            headersString += headerName + ':' + headers[headerName] + ';';
                        }
                        sessionString += '"' + headersString.replace(/"/g, '""') + '",';
                    }
                }
                else {
                    sessionString += ',';
                }
            }

            sessionString += '\r\n';
            commaSeparatedTrace.push(sessionString);
        }

        var blob1 = new Blob(commaSeparatedTrace, { type: "text/plain", endings: "native" });
        var fileName = 'HttpTrafficTrace.csv';

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob1, fileName);
        } else {
            var fileLink = document.createElement('a');
            fileLink.download = fileName;
            fileLink.href = window.URL.createObjectURL(blob1);
            fileLink.onclick = removeFileLink;
            fileLink.style.display = 'none';
            document.body.appendChild(fileLink);
            fileLink.click();
        }
    }

    function removeFileLink(event) {
        document.body.removeChild(event.target);
    }

    this.onSessionsAvailable = function (data) {

        if (data.hasOwnProperty('IsGameCore')) {
            if (data.IsGameCore) {
                $('#httpMonitorGameCoreWarning')
                    .text("HTTP monitor does not support Game Core titles.")
                    .removeClass("hidden");
            } else {
                $('#httpMonitorGameCoreWarning')
                    .addClass("hidden");
            }
        }

        if (data.hasOwnProperty('Sessions')) {
            for (var i in data.Sessions) {
                data.Sessions[i].WebbEventCounter = sessionCounter;
                sessionCounter++;

                data.Sessions[i].WebbCompletePayload = '';

                // Extract RequestContentType from RequestContentHeaders 
                if (data.Sessions[i]['RequestContentHeaders']) {
                    if (data.Sessions[i]['RequestContentHeaders']['Content-Type']) {
                        data.Sessions[i]['RequestContentType'] = data.Sessions[i]['RequestContentHeaders']['Content-Type'].toString();
                    }
                }

                // Extract ResponseContentType from ResponseContentHeaders 
                if (data.Sessions[i]['ResponseContentHeaders']) {
                    if (data.Sessions[i]['ResponseContentHeaders']['Content-Type']) {
                        data.Sessions[i]['ResponseContentType'] = data.Sessions[i]['ResponseContentHeaders']['Content-Type'].toString();
                    }
                }

                for (var field in data.Sessions[i]) {
                    if (webbAwareFields.indexOf(field) === -1 && field != 'RequestContentHeaders' && field != 'ResponseContentHeaders') {
                        data.Sessions[i].WebbCompletePayload += field.toLowerCase() + ':' + data.Sessions[i][field].toString().toLowerCase() + ', ';
                    }
                }
            }

            var existingSessions = dataView.getItems();
            existingSessions = existingSessions.concat(data.Sessions);

            if (existingSessions.length > self.maxSessionCount) {
                existingSessions.splice(0, existingSessions.length - self.maxSessionCount);
            }

            updateSessionCounter(sessionCounter, self.maxSessionCount);
            dataView.setItems(existingSessions, 'WebbEventCounter');
        }
    };

    // initialize the viewer
    initializeTableAndViews(dataView);
    wireButtons();
    $('#sessionsCounter').text('Sessions: ' + sessionCounter);
}

$(function () {
    var httpMonitorRoot = document.querySelector('#httpMonitorRoot');
    Wdp.Utils._showProgress(httpMonitorRoot);

    $.ajax({
        url: "/ext/httpmonitor/sessions",
        contentType: "application/json",
        type: "get",
        cache: false
    })
    .done(function (data, textStatus, error) {
        if (data.Enabled) {
            $('#httpMonitorDisabled').hide();

            $('#httpMonitorEnabled').show();

            new HttpMonitor();
        }
        else {
            Xbox.Utils.GetXboxInfoAsync()
                .then(function success(data) {
                    // Non-UWA devkits have the http monitor tool in Networking and not Settings.
                    if (data.DevMode !== "Universal Windows App Devkit") {
                        var instructionsElement = $("#httpMonitorDisabledInstructions")
                        instructionsElement.text(instructionsElement.text().replace("Settings", "Networking"));
                    }
                });
        }
    })
    .always(function () {
        Wdp.Utils._hideProgress(httpMonitorRoot);
    });
});
//@ sourceURL=tools/XboxHttpMonitor/XboxHttpMonitor.js
