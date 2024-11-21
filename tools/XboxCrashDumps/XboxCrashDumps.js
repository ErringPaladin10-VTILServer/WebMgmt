// JavaScript source code
///<reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2-vsdoc.js" />

// Globals
var WebbRest;

function deleteDump(packageFullName, fileName) {
    var webb = new WebbRest();
    var settings = {};
    settings["packageFullName"] = packageFullName;
    settings["fileName"] = fileName;

    webb.deleteCrashDump(settings);

    CrashDumpList();
}

function CrashDumpList() {
    // creates a download link for the crash dump
    function getDownloadDumpLinkFormatter(row, cell, value, columnDef, dataContext) {
        var downloadUri = "/api/debug/dump/usermode/crashdump?" + $.param({
            packageFullName: dataContext.PackageFullName,
            fileName: dataContext.FileName
        });
        return '<center><a class="symbol link" style="text-decoration: none;" aria-label="Download" role="button" tabindex="0">&#xe74e;</a></center>';
    }

    // creates a delete file link for the crash dump
    function getDeleteDumpLinkFormatter(row, cell, value, columnDef, dataContext) {
        return '<center><a class="symbol link" style="text-decoration: none;" aria-label="Delete" role="button" tabindex="0">&#xe74d;</a></center>';
    }

    function getFileSizeFormatter(row, cell, value, columnDef, dataContext) {
        return '' + Math.ceil(dataContext.FileSize / 1024);
    }

    function createDumpListView(settings) {
        var dumpTableColumns = [
            { id: "FileName", name: "File Name", field: "FileName", sortable: true, width: 460, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "FileSize", name: "File Size (KB)", sortable: true, width: 100, cssClass: "tableCell", headerCssClass: "tableHeader", formatter: getFileSizeFormatter },
            { id: "FileDate", name: "Timestamp", field: "FileDate", sortable: true, width: 200, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "DownloadDumpFile", name: "Save", field: "Download", width: 50, cssClass: "tableCell", headerCssClass: "tableHeader", formatter: getDownloadDumpLinkFormatter },
            { id: "DeleteDumpFile", name: "Delete", width: 60, cssClass: "tableCell", headerCssClass: "tableHeader", formatter: getDeleteDumpLinkFormatter }
        ];

        var dumpTableOptions = {
            enableCellNavigation: true,
            enableColumnReorder: false,
            showHeaderRow: true,
            syncColumnCellResize: true,
            autoHeight: true,
            rowHeight: 36.5,
            headerRowHeight: 40.45,
            gridLabel: settings.gridLabel,
            rowHeaderName: settings.rowHeaderName,
            rowHeaderId: settings.rowHeaderId,
            rowHeaderColumn: settings.rowHeaderColumn
        };

        var dataView = new Slick.Data.DataView();
        var dumpGrid = new Slick.Grid("#developerAppsDumps", dataView, dumpTableColumns, dumpTableOptions);

        dataView.onRowCountChanged.subscribe(function () {
            dumpGrid.updateRowCount();
            dumpGrid.render();
        });

        dataView.onRowsChanged.subscribe(function (e, args) {
            dumpGrid.invalidateRows(args.rows);
            dumpGrid.render();
        });

        dumpGrid.onSort.subscribe(function (e, args) {
            var comparer = function (a, b) {
                return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
            };
            dataView.sort(comparer, args.sortAsc);
        });

        dumpGrid.setSortColumn("FileName", true);

        dumpGrid.onClick.subscribe(function onClick(e) {
            var grid = dumpGrid;
            var cell = grid.getCellFromEvent(e);
            var clickedFile = dataView.getItems()[cell.row];
            if (grid.getColumns()[cell.cell].id === "DeleteDumpFile") {
                if (clickedFile.Type === self.fileType) {
                    if (confirm("Permanently delete " + clickedFile.FileName + "?")) {
                        deleteDump(clickedFile.PackageFullName, clickedFile.FileName);
                    }
                }
            }
            if (grid.getColumns()[cell.cell].id === "DownloadDumpFile") {
                var downloadUri = "/api/debug/dump/usermode/crashdump?" + $.param({
                    packageFullName: clickedFile.PackageFullName,
                    fileName: clickedFile.FileName
                });
                window.location = downloadUri;
            }
        });


        getDumpDetails(dataView);
    }

    function getDumpDetails(dataView) {
        var webb = new WebbRest();
        webb.getCrashDumpList()
            .done(function (data) {
                dataView.setItems(data.CrashDumps, "FileName");
                dataView.reSort();
            })
            .fail(function () {
                dataView.setItems([]);
            });
    }

    createDumpListView({ gridLabel: 'Saved crash dumps', rowHeaderName: 'File Name' });

    enableSlickGridTabbing("developerAppsDumps", true);

    var eraDiv = document.getElementById("wdp-crashdumps-era");

    Xbox.Utils.GetXboxInfoAsync()
        .then(function success(data) {
            if (data.DevMode !== "Retail") {
                eraDiv.hidden = false;
            }
        });
}

$(function () {
    CrashDumpList();
});
/*!
//@ sourceURL=tools/XboxCrashDumps/XboxCrashDumps.js
*/