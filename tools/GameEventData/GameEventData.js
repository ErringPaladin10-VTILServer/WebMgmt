// JavaScript source code
///<reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2-vsdoc.js" />

var gameEventData = new GameEventDataMonitor();

var dataDisplay = "";

// Default values
var toastFrequency = 0;
var eventCountLimit = 0;
var eventCollectionInterval = 0;

var eventGrid;

var eventGraph;
var eventLimitTimeline;
var eventTimeLine;

function GameEventDataConnection(callbacks) {
    var self = this;
    self.callbacks = callbacks;

    var websocketProtocol = (document.location.protocol === 'https:' ? 'wss://' : 'ws://');
    var host = websocketProtocol + window.location.host + '/ext/gameeventdata';

    self.socket = new WebSocket(host);

    self.socket.onmessage = function (messageEvent) {
        self.callbacks.onmessage(JSON.parse(messageEvent.data));
        return false;
    };

    self.socket.onopen = function () {
    };

    self.socket.onerror = function () {
        if (self.callbacks.onerror) {
            self.callbacks.onerror();
        }
    };

    self.socket.onclose = function () {
        if (self.callbacks.onclose) {
            self.callbacks.onclose();
        }
    };

    this.gameDataRequest = function (jsonData) {
        if (isAlive()) {
            self.socket.send(jsonData);
        }
    };

    function isAlive() {
        return (self.socket &&
                (self.socket.readyState === WebSocket.OPEN || self.socket.readyState === WebSocket.CONNECTING));
    }

    this.IsAlive = isAlive;

    this.closeConnection = function() {
        if (isAlive()) {
            self.socket.close();
        }
    }

    window.addEventListener("unload", self.closeConnection, false);
}

function GameEventDataMonitor() {
    var self = this;
    eventGrid = false;

    clearInterval(eventTableHandle);
    clearInterval(eventChartHandle);

    // The functions in the interval will be called once the game event data monitor is alive
    var gameEventMonitorExists = setInterval(function(){
        if(gameEventData){
            // Setting toast frequency value request
            submitToastFrequencyRequest();
            // Setting event count value request
            submitEventCountLimitRequest();
            // Setting event collection interval value request
            submitEventCollectionIntervalRequest();

            clearInterval(gameEventMonitorExists);
        }
    }, 100);

    // Delayed retrieval of all event data until eventCollectionInterval has been retrieved
    var eventCollectionIntervalExists = setInterval(function(){
        if((gameEventData) && (eventCollectionInterval != 0)){
            // Setting game event data table data requests
            setAllEvents();
            clearInterval(eventCollectionIntervalExists);
        }
    }, 100);

    // Delayed display of game event graph until toastFrequency and eventCountLimit have been retrieved
    var frequencyAndLimitValuesExist = setInterval(function(){
        if((gameEventData) && (toastFrequency != 0) && (eventCountLimit != 0)){
            // Initialize game event data graph
            initEventGraph();
            clearInterval(frequencyAndLimitValuesExist);
        }
    }, 100);

    Wdp = Wdp || {};
    Wdp.Utils = Wdp.Utils || {};
    Wdp.Utils.Xbox = Wdp.Utils.Xbox || {};
    Wdp.Utils.Xbox.GameEventDataMonitor = Wdp.Utils.Xbox.GameEventDataMonitor || {};

    self.dataHandler = new GameEventDataHandler();

    if (!Wdp.Utils.Xbox.GameEventDataMonitor.connection || !Wdp.Utils.Xbox.GameEventDataMonitor.connection.IsAlive()) {
        function onMessage(data) {
            self.dataHandler.processData(data);
        }

        function onError() {
            $('#game-event-status')
                .text("Connection to device lost. Refresh the page to reconnect.")
                .removeClass("hidden");
        };
        
        function onClose() {
            $('#game-event-status')
                .text("Connection to device lost. Refresh the page to reconnect.")
                .removeClass("hidden");
        };

        Wdp.Utils.Xbox.GameEventDataMonitor.connection = new GameEventDataConnection({onerror: onError, onclose: onClose, onmessage: onMessage });
    }

    self.gameEventDataConnection = Wdp.Utils.Xbox.GameEventDataMonitor.connection;
}

function GameEventDataHandler() {
    var self = this;

    this.processData = function(dataResult) {

        switch(dataResult["option-name"]){
            case "all-events":
                displayAllEventsData(dataResult);
                break;
            case "event-count":
                updateEventCount(dataResult);
                break;
            case "toast-frequency":
                updateToastFrequency(dataResult);
                break;
            case "event-count-limit":
                updateEventCountLimit(dataResult);
                break;
            case "event-collection-interval":
                updateEventCollectionInterval(dataResult);
                break;
            default:
                break;
        }
    }
}

function eventNameFormatter(row, cell, value, columnDef, dataContext){
    if(dataContext.EventName){
        return dataContext.EventName;
    } else {
        return "N/A";
    }
}

function eventCountFormatter(row, cell, value, columnDef, dataContext){
    if(dataContext.EventCount){
        return dataContext.EventCount;
    } else {
        return "N/A";
    }
}

function gameTitleIdFormatter(row, cell, value, columnDef, dataContext){
    if(dataContext.GameTitleId){
        return dataContext.GameTitleId;
    } else {
        return "N/A";
    }
}

function buildEventDataTable(tableArray){

    var eventList = document.getElementById("data-table");
    // Setting table columns
    var eventDataTableColumns = [
        { id: "EventName", name: "Game Event Name", field: "EventName", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: eventNameFormatter },
        { id: "EventCount", name: "Game Event Count", field: "EmailCount", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: eventCountFormatter },
        { id: "GameTitleId", name: "Game Title ID", field: "GameTitleId", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: gameTitleIdFormatter }
    ];

    var eventTableOptions = {
        selectedCellCssClass: "rowSelected",
        enableCellNavigation: false,
        enableColumnReorder: false,
        enableTextSelectionOnCells: true,
        showHeaderRow: true,
        syncColumnCellResize: true,
        autoHeight: true,
        rowHeight: 36.5,
        headerRowHeight: 40.45
    };


    var dataView = new Slick.Data.DataView();
    dataView.setItems(tableArray, "ElementId");
    eventGrid = new Slick.Grid(eventList, dataView, eventDataTableColumns, eventTableOptions);
    dataView.setItems(tableArray, "ElementId");
    eventGrid.invalidate();
    eventGrid.render();
}

function displayAllEventsData(dataJson){
    if(document.getElementById("game-event-data-display")){
        if(dataJson["data-available"]){
            // There is data available
    
            dataDisplay = "<div id='data-table' class='event-data-list commonTable'></div>";
            document.getElementById("game-event-data-display").innerHTML = dataDisplay;
    
            var tableArray = [];
            // Add entry for game id
    
            var rowElementJson;
            var elementId = 1;

            var gameTitle = dataJson["game-title"];
    
            for(eventName in dataJson["data"]){
                rowElementJson = {};
                rowElementJson["EventName"] = eventName;
                rowElementJson["EventCount"] = dataJson["data"][eventName];
                rowElementJson["GameTitleId"] = gameTitle;
                rowElementJson["ElementId"] = elementId;

                // Adding element json to array
                tableArray.push(rowElementJson);
                elementId++;
            }
    
            buildEventDataTable(tableArray);
    
        } else {
            // There is no data available
            var intervalInMinutes = eventCollectionInterval / 60;
            dataDisplay = `<div><p> There are currently no game events in the past ${intervalInMinutes} minutes.</p></div><br>`;
            document.getElementById("game-event-data-display").innerHTML = dataDisplay;
        }
    }
    
}

function updateEventCount(dataJson){
    if(dataJson["data-available"]){
        eventCount = Number(dataJson["data"]["count"]);
    }
}

function updateToastFrequency(dataJson){
    if(dataJson["data-available"]){
        
        toastFrequency = Number(dataJson["data"]["frequency"]);
    }

    var eventChartTitle = document.getElementById("chart-title");
    eventChartTitle.innerHTML = `<h3>Game Event Count per ${toastFrequency / 60} Minutes</h3>`;
}

function updateEventCountLimit(dataJson){
    if(dataJson["data-available"]){
        
        eventCountLimit = Number(dataJson["data"]["limit"]);
    }
}

function updateEventCollectionInterval(dataJson){
    if(dataJson["data-available"]){
        
        eventCollectionInterval = Number(dataJson["data"]["interval"]);
    }
    var intervalInMinutes = eventCollectionInterval / 60;
    var allEventsDescription = document.getElementById("all-events-description");
    allEventsDescription.innerHTML = `<p>Retrieves all game event data (name and number of occurrences) over the last ${intervalInMinutes} minutes.</p>`;
}

function submitAllEventsRequest(){
    // Make JSON of data and submit and send it out through socket
    var jsonData = {
        "option-name" : "all-events"
    };

    gameEventData.gameEventDataConnection.gameDataRequest(JSON.stringify(jsonData));

}

function submitEventCountRequest() {
    var jsonData = {
        "option-name" : "event-count"
    };

    gameEventData.gameEventDataConnection.gameDataRequest(JSON.stringify(jsonData));
    
}

function submitToastFrequencyRequest() {
    var jsonData = {
        "option-name" : "toast-frequency"
    };

    gameEventData.gameEventDataConnection.gameDataRequest(JSON.stringify(jsonData));
    
}

function submitEventCountLimitRequest() {
    var jsonData = {
        "option-name" : "event-count-limit"
    };

    gameEventData.gameEventDataConnection.gameDataRequest(JSON.stringify(jsonData));
    
}

function submitEventCollectionIntervalRequest() {
    var jsonData = {
        "option-name" : "event-collection-interval"
    };

    gameEventData.gameEventDataConnection.gameDataRequest(JSON.stringify(jsonData));
    
}

function setAllEvents(){

    submitAllEventsRequest();

    eventTableHandle = setInterval(function(){
        submitAllEventsRequest();
    }, 30000);
}

function initEventGraph() {
    eventGraph = document.getElementById("event-graph-data");

    // setup the DOM for this control
    var controlHtml =
        '<canvas id="event-count-chart" width="1000" height="250"></canvas>' +
        '<div id="event-count-value" class="chartLegend"></div>';
    eventGraph.innerHTML = controlHtml;

    // Creating graph and setting graph options
    createEventGraph();
}

function createEventGraph() {
    // Create chart
    var eventChart;
    eventTimeline = new TimeSeries();
    eventLimitTimeline = new TimeSeries();

    var eventChartOptions = {
        fillStyle: '#fff',
        minValue: 0,
        millisPerPixel: toastFrequency, // 1000 pixel chart displays 5 minutes by default (toast frequency time)
        interpolation: 'linear',
        enableDpiScaling: true,
        grid: {
            fillStyle: 'transparent',
            strokeStyle: 'rgb(217, 234, 244)',
            verticalSections: 10,
        },
        labels: {
            fillStyle: 'rgb(58, 58, 58)',
            fontSize: 15
        }
    };

    var limitLineDelay = toastFrequency * 1000;
    var currTime = new Date().getTime();
    while(limitLineDelay > 0){
        eventLimitTimeline.append(currTime - limitLineDelay, eventCountLimit);
        limitLineDelay -= 5;
    }

    eventChartHandle = setInterval(function (){
        submitEventCountRequest();
        eventLimitTimeline.append(new Date().getTime(), eventCountLimit);
        eventTimeline.append(new Date().getTime(), eventCount);
        $('#event-count-value').html("<b>Event count:</b> " + eventCount + "&nbsp;&nbsp;" + "<b>Event limit alert threshold:</b> " + eventCountLimit);
    }, 5000);

    eventChart = new SmoothieChart(eventChartOptions);
    eventChart.streamTo(document.getElementById("event-count-chart"));
    eventChart.addTimeSeries(eventLimitTimeline, { strokeStyle: 'rgb(221, 22, 22)', 
                                fillStyle: 'rgba(221, 22, 22, 0.00)', lineWidth: 3 });
    eventChart.addTimeSeries(eventTimeline, { strokeStyle: 'rgb(17, 125, 187)', 
                                fillStyle: 'rgba(17, 125, 187, 0.05)', lineWidth: 1 });

    eventGraph.style.display = "block";
}

var eventTableHandle;
var eventChartHandle;
var eventCount = 0;