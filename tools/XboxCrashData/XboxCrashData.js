// JavaScript source code
///<reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2-vsdoc.js" />

// Globals
var WebbRest;

function changeDumpStatus(element, packageFullName) {
    var webb = new WebbRest();
    var settings = {};
    settings["packageFullName"] = packageFullName;

    if (element.checked) {
        webb.setCrashDumpControlSettings(settings);
    }
    else {
        webb.deleteCrashDumpControlSettings(settings);
    }
}

function CrashDumpManager() {
    function getDumpCheckboxFormatter(row, cell, value, columnDef, dataContext) {
        var webb = new WebbRest();
        var settings = {};
        settings["packageFullName"] = dataContext.PackageFullName;

        webb.getCrashDumpControlSettings(settings)
            .done(function (data) {
                document.getElementById(dataContext.PackageFullName + 'Checkbox').checked = data.CrashDumpEnabled;
            });

        return '<input type="checkbox" id="' + dataContext.PackageFullName + 'Checkbox" onChange="changeDumpStatus(this, \'' + dataContext.PackageFullName + '\');" />';
    }

    function createDeveloperAppsView(settings) {
        var processTableColumns = [
            { id: "Name", name: "Name", field: "PackageDisplayName", sortable: true, width: 250, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "PackageFullName", name: "Package Full Name", field: "PackageFullName", sortable: true, width: 500, cssClass: "tableCell", headerCssClass: "tableHeader" },
            { id: "Dump", name: "Crash Dumps", width: 110, cssClass: "tableCell", headerCssClass: "tableHeader", formatter: getDumpCheckboxFormatter }
        ];

        var processTableOptions = {
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
        var processesGrid = new Slick.Grid("#developerAppsGrid", dataView, processTableColumns, processTableOptions);

        dataView.onRowCountChanged.subscribe(function () {
            processesGrid.updateRowCount();
            processesGrid.render();
        });

        dataView.onRowsChanged.subscribe(function (e, args) {
            processesGrid.invalidateRows(args.rows);
            processesGrid.render();
        });

        processesGrid.onSort.subscribe(function (e, args) {
            var comparer = function (a, b) {
                return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
            };
            dataView.sort(comparer, args.sortAsc);
        });

        processesGrid.setSortColumn("ProcessId", true);

        $("#refreshDeveloperApps").bind('click', (function () {
            getDeveloperAppDetails(dataView);
        }));

        getDeveloperAppDetails(dataView);
    }

    function retrieveDeployInfoAsync(newAppData) {
        var deferred = $.Deferred();
        // Push all the PFNs that we want to request deploy information for.
        var requestPackages = [];
        for (var i = 0, len = newAppData.length; i < len; i++) {
            requestPackages.push({ PackageFullName: newAppData[i].PackageFullName });
        }

        $.ajax({ url: '/ext/app/deployinfo', cache: false, type: 'POST', data: JSON.stringify({ DeployInfo: requestPackages }), contentType: 'application/json' })
        .done(function (data, textStatus, error) {
            var parsedData;
            try {
                parsedData = JSON.parse(data);
            } catch (e) {
                deferred.reject(data, error);
                return;
            }

            deferred.resolve(parsedData.DeployInfo);
        })
        .fail(function (data, textStatus, error) {
            deferred.reject(data, error);
        });

        return deferred;
    };

    function getDeveloperAppDetails(dataView) {
        var webbRest = new WebbRest();
        webbRest.getInstalledAppPackages()
            .done(function (data) {
                data.InstalledPackages.sort((a, b) => a.PackageFullName.localeCompare(b.PackageFullName));
                data.InstalledPackages = data.InstalledPackages.filter((pkg, i) => {
                    return (i == 0) || (data.InstalledPackages[i - 1].PackageFullName != pkg.PackageFullName);
                });
                
                retrieveDeployInfoAsync(data.InstalledPackages)
                    .done(function (deployInfo) {

                        if (data.InstalledPackages.length !== deployInfo.length) {
                            Xbox.Utils._showError({ ErrorMessage: "Received unexpected Deployment information." });
                        }
                        for (var i = 0, len = data.InstalledPackages.length; i < len; ++i) {
                            if (data.InstalledPackages[i].PackageFullName !== deployInfo[i].PackageFullName) {
                                // InstalledPackages doesn't match anymore. This is unexpected.
                                Xbox.Utils._showError({ ErrorMessage: "Received unexpected Deployment information." });
                                break;
                            }
                            data.InstalledPackages[i].DeployType = deployInfo[i].DeployType;
                            data.InstalledPackages[i].DeployPathOrSpecifiers = deployInfo[i].DeployPathOrSpecifiers;
                            data.InstalledPackages[i].DeployDrive = deployInfo[i].DeployDrive;
                        }

                        // Filter out non-UWP apps.
                        var i = 0;
                        while (i < data.InstalledPackages.length) {
                            if (data.InstalledPackages[i].DeployType === "UWP" ||
                                data.InstalledPackages[i].DeployType === "UWP Store") {
                                ++i;
                            }
                            else {
                                data.InstalledPackages.splice(i, 1);
                            }
                        }
                        dataView.setItems(data.InstalledPackages, "PackageFullName");
                        dataView.reSort();
                    })
                    .fail(function (data) {
                        Xbox.Utils._showError(data);
                        dataView.setItems([]);
                    });
            })
            .fail(function (data) {
                Xbox.Utils._showError(data);
                dataView.setItems([]);
            });
    }

    createDeveloperAppsView({ gridLabel: 'Applicable apps for enabling crash dump collection', rowHeaderName: 'Name' });

    enableSlickGridTabbing("developerAppsGrid", true);

    var eraDiv = document.getElementById("wdp-crashdata-era");

    Xbox.Utils.GetXboxInfoAsync()
        .then(function success(data) {
            if (data.DevMode !== "Universal Windows App Devkit") {
                eraDiv.hidden = false;
            }
        });
}

$(function () {
    CrashDumpManager();
});
/*!
//@ sourceURL=tools/XboxCrashData/XboxCrashData.js
*/