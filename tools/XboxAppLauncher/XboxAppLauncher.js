(function () {

    "use strict";

    var _appsGrid = false;
    var _appList = [];
    var _filteredAppList = [];
    var _stubApp = null;
    var _runningTitlePfn = null;
    var _dataView = null;
    var _layoutRoot = null;
    var _refreshAppsListTimerCookie = null;
    var _refreshAppMoveProgressTimerCookie = null;
    var _refreshRunningTitleTimerCookie = null;
    var _installIdMap = {};
    var _socket = null;
    var _needsAppRefresh = false;

    var installIdMapLocalStorageKey = "wdp-data-packagemove-installidmap";

    /* Deployment */

    // For Packaged
    var _packageFile;

    // For Loose
    var _looseFiles = [];
    var _looseFilesDestinationFolder;

    var _dependencyDataView;
    var _dependencyGrid;
    var _dependencyFiles = [];

    // For Network share
    var _networkSharename;

    // For Register
    var _folderToRegister;

    var _isCancelled = false;

    var _isRefreshingAppsList = false;
    var _isRefreshingAppMove = false;
    var _isRefreshingRunningTitle = false;

    var _isRetailOrSraDevkit;

    var wdpPsuedoNamespace = "wdp-",
        cssClassPopup = wdpPsuedoNamespace + "popup",
        cssClassPrimaryCommand = "btn-primary";

    var dependencyNameAttribute = "data-dependency-name";

    var lastDeployOptionLocalStorageKey = "wdp-data-deployment-lastmethod";

    var _REFRESH_APPS_POLLING_INTERVAL = 1000;
    var _REFRESH_APP_MOVE_POLLING_INTERVAL = 2000;

    var _availableStorageDevices;

    function persistInstallIdMap() {
        if (localStorage) {
            localStorage.setItem(installIdMapLocalStorageKey, JSON.stringify(_installIdMap));
        }
    };

    function onDataSourceError() {
        _dataView.setItems([], "PackageRelativeId");
        _appsGrid.invalidate();
    };

    function onRowCountChanged() {
        _appsGrid.updateRowCount();
        renderAndUpdateAppActions(true);
    };

    function onRowsChanged(e, args) {
        _appsGrid.invalidateRows(args.rows);
        renderAndUpdateAppActions(true);
    };

    function renderAndUpdateAppActions(dirty) {
        if (!dirty) {
            return;
        }
        _dataView.setItems(_filteredAppList, "PackageRelativeId");
        _appsGrid.invalidate();
        _appsGrid.render();

        var nameHyperlinks = _layoutRoot.querySelectorAll(".wdp-xbox-launcher-appname");
        if (nameHyperlinks.length) {
            for (var i = 0, len = nameHyperlinks.length; i < len; i++) {
                nameHyperlinks[i].removeEventListener("click", handleNameHyperlinkClicked);
                nameHyperlinks[i].addEventListener("click", handleNameHyperlinkClicked, false);
            }
        }

        var actionSelectElements = _layoutRoot.querySelectorAll(".wdp-xbox-launcher-actiondropdown");
        if (actionSelectElements.length) {
            for (var i = 0, len = actionSelectElements.length; i < len; i++) {
                var actionSelectElement = actionSelectElements[i];
                actionSelectElements[i].removeEventListener("change", handleActionSelectionChanged);
                actionSelectElements[i].addEventListener("change", handleActionSelectionChanged, false);

                if (_filteredAppList[i].CanUninstall === false) {
                    var uninstallOption = actionSelectElement.querySelector("[value='uninstall'");
                    uninstallOption.parentNode.removeChild(uninstallOption);
                }
            }
        }
    };

    function onSort(e, args) {
        _dataView.sort(gridCaseInsensitiveObjectComparer.bind(args), args.sortAsc);
    };

    function appNameFormatter(row, cell, value) {
        return '<a class="wdp-xbox-launcher-appname" href="#">' + value + '</a>';
    };

    // creates a suspend/resume action for suspending/resuming apps
    function suspendResumeFormatter(row, cell, value) {
        var packageDetails = packageDetailsFromAumid(value);

        if (packageDetails && packageDetails.IsRunning) {
            if (packageDetails.OverlayFolder) {
                return 'Running with overlay';
            } else {
                return 'Running';
            }
        } else if (packageDetails && packageDetails.OverlayFolder) {
            return 'Not running with overlay';
        } else {
            return 'Not running';
        }
    };

    function actionsFormatter(row, cell, value) {
        var htmlString = "";
        htmlString =
            '<select class="wdp-xbox-launcher-actiondropdown">' +
            '  <option value="actions" disabled="disabled" selected="selected">Actions</option>';

        if (value) {
            htmlString += '<option value="terminate">Terminate</option>' +
                          '<option value="suspend">Suspend</option>';
        } else {
            htmlString += '<option value="activate">Launch/Resume</option>';
        }

        htmlString += '  <option value="uninstall">Uninstall</option>' +
                      '</select>';

        return htmlString;
    };

    function cancelAppMoveAsync(installId) {
        if (installId) {
            var params = { installId: window.btoa(installId) };
            return httpDeleteExpect200("/ext/app/move?" + $.param(params));
        }
    };

    function moveAppAsync(packageName, destinationDrive) {

        var params = { packagefullname: window.btoa(packageName), destinationDrive: destinationDrive };
        return httpPostExpect200("/ext/app/move?" + $.param(params));
    };

    function getAppMoveStatusAsync(installId) {
        var params = { installId: window.btoa(installId) };

        var deferred = $.Deferred();
        $.ajax({ url: "/ext/app/move?" + $.param(params), cache: false, type: 'get', contentType: 'application/json' })
            .done(function (data, textStatus, error) {
                deferred.resolve(data);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data, error);
            });
        return deferred;
    };

    function activateAsync(aumid) {
        var params = { appid: window.btoa(aumid) };
        return httpPostExpect200("/api/taskmanager/app?" + $.param(params));
    };
    function terminateAsync(packageName) {
        var params = { package: window.btoa(packageName) };
        return httpDeleteExpect200("/api/taskmanager/app?" + $.param(params));
    };
    function uninstallAsync(packageName) {
        var params = { package: packageName };
        return httpDeleteExpect200('/ext/app/packagemanager/package?' + $.param(params));
    };
    function suspendAsync(packageName) {
        var params = { package: window.btoa(packageName), state: "suspend" };
        return httpPostExpect200("/api/taskmanager/app/state?" + $.param(params));
    };
    function resumeAsync(packageName) {
        var params = { package: window.btoa(packageName), state: "resume" };
        return httpPostExpect200("/api/taskmanager/app/state?" + $.param(params));
    };
    function protocolActivateAsync(packageName) {
        var foo = packageObjectFromPFN(packageName);
    };
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

    // This calls the same deployInfo endpoint but with an Overlay Folder populated for the PFN.
    function setPackageOverlayAsync(packageFullName, overlayFolder) {
        var deferred = $.Deferred();

        var packageList = [{ PackageFullName: packageFullName, OverlayFolder: overlayFolder }];
        $.ajax({ url: '/ext/app/deployinfo', cache: false, type: 'POST', data: JSON.stringify({ DeployInfo: packageList }), contentType: 'application/json' })
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

    function viewDetails(aumid) {
        var packageDetails = packageDetailsFromAumid(aumid);

        // Show the dialog to view app details
        var overlayRoot = document.createElement("div");
        overlayRoot.className = "wdp-popup wdp-xbox-launcher-details";
        var packageVersion = packageDetails.Version;

        var deployTypeDisplay = packageDetails.DeployType;

        // For some deploy types, we show friendlier user facing strings
        if (deployTypeDisplay === "Folder vnext") {
            deployTypeDisplay = "Folder";
        }

        var innerHtml =
            '<h4>' + packageDetails.Name + '</h4>' +
            '<div class="form-group">' +
            '  <div class="form-group-label">Package family name</div>' +
            '  <label class="form-group-value">' + packageDetails.PackageFamilyName + '</label>' +
            '  <div class="form-group-label">Package full name</div>' +
            '  <label class="form-group-value launcherFieldPFN">' + packageDetails.PackageFullName + '</label>' +
            '  <div class="form-group-label">Publisher</div>' +
            '  <label class="form-group-value">' + packageDetails.Publisher + '</label>' +
            '  <div class="form-group-label">App user model ID (AUMID)</div>' +
            '  <label class="form-group-value">' + packageDetails.PackageRelativeId + '</label>' +
            '  <div class="form-group-label">Version</div>' +
            '  <label class="form-group-value">' +
            packageVersion.Major + '.' +
            packageVersion.Minor + '.' +
            packageVersion.Build + '.' +
            packageVersion.Revision +
            '   </label>' +
            '  <div class="form-group-label">Deploy type</div>' +
            '  <label class="form-group-value">' + deployTypeDisplay + '</label>';

        if (packageDetails.DeployPathOrSpecifiers) {
            if (packageDetails.DeployType === "Folder") {
                var path = "\\\\" + window.location.hostname + "\\TitleScratch\\";
                innerHtml += '  <div class="form-group-label">Deploy folder path</div>' +
                    '  <label class="form-group-value">' + path + packageDetails.DeployPathOrSpecifiers + '</label>';
            } else if (packageDetails.DeployType === "Install") {
                innerHtml += '  <div class="form-group-label">Specifiers</div>' +
                    '  <label class="form-group-value">' + packageDetails.DeployPathOrSpecifiers + '</label>';
            } else if (packageDetails.DeployType === "Push" || packageDetails.DeployType === "UWP" || packageDetails.DeployType === "Folder vnext") {
                var path = "\\\\" + window.location.hostname + "\\";
                innerHtml += '  <div class="form-group-label">Deploy folder path</div>' +
                    '  <label class="form-group-value">' + path + packageDetails.DeployPathOrSpecifiers + '</label>';
            } else if (packageDetails.DeployType === "Network") {
                innerHtml += '  <div class="form-group-label">Network source</div>' +
                    '  <label class="form-group-value">' + packageDetails.DeployPathOrSpecifiers + '</label>';
            }
        }

        if (packageDetails.DeployDrive) {
            innerHtml += '  <div class="form-group-label">Deploy drive</div>';

            var foundDrive = false;
            var selectText = "";

            // If we have a list of available storage devices, let them change this app here.
            if (_availableStorageDevices && _availableStorageDevices.length > 1) {
                selectText += '  <select id="wdp-xbox-launcher-details-deploydriveselect">';

                for (var i = 0, len = _availableStorageDevices.length; i < len; ++i) {
                    if (_availableStorageDevices[i] === packageDetails.DeployDrive) {
                        foundDrive = true;
                        selectText += '      <option selected value="' + _availableStorageDevices[i] + '">' + _availableStorageDevices[i] + '</option>';
                    } else {
                        selectText += '      <option value="' + _availableStorageDevices[i] + '">' + _availableStorageDevices[i] + '</option>';
                    }
                }
                selectText += '  </select>';

                selectText +=
                    '<div class="form-group" hidden id="wdp-xbox-launcher-details-deploydriveselect-progressdiv"> \
                        <progress value="0" max="100" id="wdp-xbox-launcher-details-deploydriveselect-statusbar"> \
                        </progress> \
                        <button id="wdp-xbox-launcher-details-deploydriveselect-cancel" class="' + cssClassPrimaryCommand + '" type="button">Cancel</button> \
                    </div>';
            }

            if (foundDrive) {
                // If we found the drive, we use the select element so users can change the apps drive
                innerHtml += selectText;
            } else {
                // Otherwise just use a label.
                innerHtml += '  <label class="form-group-value">' + packageDetails.DeployDrive + '</label>';
            }
        }

        if (packageDetails.DeploySizeInBytes) {
            var bytesPerKb = 1024;
            var bytesPerMb = bytesPerKb * 1024;
            var bytesPerGb = bytesPerMb * 1024;

            var sizeInGb = (packageDetails.DeploySizeInBytes / bytesPerGb).toFixed(3);

            innerHtml += '  <div class="form-group-label">Deploy size (GB)</div>' +
                '  <label class="form-group-value">' + sizeInGb + '</label>';
        }

        if (packageDetails.PackageAlias) {

            innerHtml += '  <div class="form-group-label">Package alias</div>' +
                '  <label class="form-group-value">' + packageDetails.PackageAlias + '</label>';
        }

        // Show this option for the supported deployment types.
        // If a different tool set an overlay for some other deployment
        // type, we should still allow users to clear that overlay.
        if (packageDetails.DeployType === "Install" ||
            packageDetails.DeployType === "Push" ||
            packageDetails.DeployType === "Folder" ||
            packageDetails.DeployType === "Folder vnext" ||
            packageDetails.DeployType === "Network" ||
            packageDetails.OverlayFolder) {
            innerHtml +=
                '  <div class="form-group-label">Overlay Folder</div>' +
                '  <input type="text" id="wdp-xbox-launcher-overlayfolder" class="wideInputField" placeholder="Optional: Overlay folder" />' +
                '  <button id="wdp-xbox-launcher-save-overlayfolder" disabled="" class="commonButton">Save</button>';
        }

        innerHtml +=
            '  <button id="wdp-xbox-launcher-details-closecommand" class="btn-primary" type="button">Close</button>' +
            '</div>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var saveOverlayButton = overlayRoot.querySelector("#wdp-xbox-launcher-save-overlayfolder");
        var overlayFolderInput = overlayRoot.querySelector("#wdp-xbox-launcher-overlayfolder");

        if (overlayFolderInput && saveOverlayButton) {
            overlayFolderInput.value = packageDetails.OverlayFolder;

            overlayFolderInput.addEventListener("keyup",
                function (e) {
                    saveOverlayButton.disabled = packageDetails.OverlayFolder === overlayFolderInput.value;
                },
                false);

            saveOverlayButton.addEventListener("click",
                function (e) {
                    Wdp.Utils._showProgress(overlayRoot);

                    setPackageOverlayAsync(packageDetails.PackageFullName, overlayFolderInput.value)
                        .done(function (data, textStatus, error) {
                            _needsAppRefresh = true;
                            saveOverlayButton.disabled = true;
                        })
                        .fail(function (data, textStatus, error) {
                            _needsAppRefresh = true;
                            Xbox.Utils._showError(data);
                        })
                        .always(function (data, textStatus, error) {
                            Wdp.Utils._hideProgress(overlayRoot);
                        });
                },
                false);
        }

        var deployDriveSelect = overlayRoot.querySelector("#wdp-xbox-launcher-details-deploydriveselect");

        if (deployDriveSelect) {

            updateAppMoveUI(packageDetails.PackageFullName, overlayRoot, packageDetails.DeployDrive);

            deployDriveSelect.addEventListener("change",
                function (e) {
                    Wdp.Utils._showProgress(overlayRoot);

                    moveAppAsync(packageDetails.PackageFullName, deployDriveSelect.value)
                        .done(function (data, textStatus, error) {

                            _installIdMap[packageDetails.PackageFullName] = {
                                targetDrive: deployDriveSelect.value, installId: data.installId
                            };
                            persistInstallIdMap();

                            updateAppMoveUI(packageDetails.PackageFullName, overlayRoot);
                        })
                        .fail(function (data, textStatus, error) {
                            _needsAppRefresh = true;
                            Xbox.Utils._showError(data);
                        })
                        .always(function (data, textStatus, error) {
                            Wdp.Utils._hideProgress(overlayRoot);
                        });
                },
                false);
        }

        var deployDriveMoveCancel = overlayRoot.querySelector("#wdp-xbox-launcher-details-deploydriveselect-cancel");

        if (deployDriveMoveCancel) {
            deployDriveMoveCancel.addEventListener("click", cancelAppMove, false);
        }

        var closeButton = overlayRoot.querySelector("#wdp-xbox-launcher-details-closecommand");
        closeButton.addEventListener("click", overlay._hide.bind(overlay), false);
        closeButton.focus();
    };

    function updateAppMoveUI(packageFullName, overlayRoot, optionalCurrentDrive) {
        var deployDriveSelect = overlayRoot.querySelector("#wdp-xbox-launcher-details-deploydriveselect");

        if (deployDriveSelect && _installIdMap[packageFullName]) {

            if (_installIdMap[packageFullName].targetDrive !== optionalCurrentDrive) {
                // Disable this element until the move is complete.
                deployDriveSelect.disabled = true;

                deployDriveSelect.value = _installIdMap[packageFullName].targetDrive;

                // Show the progress elements.
                var progressDiv = overlayRoot.querySelector("#wdp-xbox-launcher-details-deploydriveselect-progressdiv");
                progressDiv.hidden = false;

                // Force the first update
                refreshAppMove();

                // Start poll for move completed.
                _refreshAppMoveProgressTimerCookie = setInterval(refreshAppMove, _REFRESH_APP_MOVE_POLLING_INTERVAL);
            }
            else {
                // This move is already complete
                delete _installIdMap[packageFullName];
                persistInstallIdMap();
            }
        }
    };

    function httpPostExpect200(uri) {
        var deferred = $.Deferred();
        $.ajax({ url: uri, cache: false, type: 'post' })
            .done(function (data) {
                deferred.resolve(data);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data, error);
            });

        return deferred;
    };

    function httpDeleteExpect200(uri) {
        var deferred = $.Deferred();
        $.ajax({ url: uri, cache: false, type: 'delete' })
            .done(function (data) {
                deferred.resolve(data);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data, error);
            });

        return deferred;
    };

    function pfnFromAumid(aumid) {
        var packageFullName;
        for (var i = 0, len = _filteredAppList.length; i < len; i++) {
            if (_filteredAppList[i].PackageRelativeId === aumid) {
                packageFullName = _filteredAppList[i].PackageFullName;
                break;
            }
        }
        return packageFullName;
    };

    function packageDetailsFromAumid(aumid) {
        var packageDetails;
        for (var i = 0, len = _filteredAppList.length; i < len; i++) {
            if (_filteredAppList[i].PackageRelativeId === aumid) {
                packageDetails = _filteredAppList[i];
                break;
            }
        }

        return packageDetails;
    };

    function handleNameHyperlinkClicked(e) {
        var row = e.target.parentNode.parentNode;
        var aumid = row.querySelector(".launcherFieldAUMID").textContent;

        viewDetails(aumid);
    };

    function handleActionSelectionChanged(e) {
        var selectElement = e.target;
        var action = selectElement.value;
        var tableRow = selectElement.parentNode.parentNode;
        var aumid = tableRow.querySelector(".launcherFieldAUMID").textContent;
        var PFN = pfnFromAumid(aumid);
        switch (action) {
            case "activate":
                activateAsync(aumid)
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    });
                break;
            case "terminate":
                terminateAsync(PFN)
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    });
                break;
            case "uninstall":
                uninstallAsync(PFN)
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    });
                break;
            case "suspend":
                suspendAsync(PFN)
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    });
                break;
            case "resume":
                resumeAsync(PFN)
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    });
                break;
            default:
                // No-op
                break;
        };
        // Set the action selection back to "action"
        var actionsOption = selectElement.querySelector("[value='actions']");
        actionsOption.selected = true;
    };

    function cancelAppMove() {
        var overlay = document.querySelector(".wdp-xbox-launcher-details");

        // If the overlay has been closed, don't cancel.
        if (!overlay) {
            return;
        }

        var pfn = overlay.querySelector(".launcherFieldPFN").textContent;

        if (_installIdMap[pfn]) {
            cancelAppMoveAsync(_installIdMap[pfn].installId)
                .done(function (status) {

                    delete _installIdMap[pfn];
                    persistInstallIdMap();

                    var dialog = new Wdp.Utils._showPopUp(
                        "Cancelled",
                        "The application move has been cancelled."
                    );
                })
                .fail(function (data, textStatus, error) {
                    Xbox.Utils._showError(data);
                });
        }
    };

    function refreshAppMove() {
        // Just in case our last refresh isn't done when the timer ticks again.
        if (_isRefreshingAppMove) {
            return;
        }

        _isRefreshingAppMove = true;

        var overlay = document.querySelector(".wdp-xbox-launcher-details");

        // If the overlay has been closed, stop polling for progress.
        if (!overlay) {
            clearInterval(_refreshAppMoveProgressTimerCookie);
            _isRefreshingAppMove = false;
            return;
        }

        var selectElement = overlay.querySelector("#wdp-xbox-launcher-details-deploydriveselect");
        var progressDiv = overlay.querySelector("#wdp-xbox-launcher-details-deploydriveselect-progressdiv");
        var statusBar = overlay.querySelector("#wdp-xbox-launcher-details-deploydriveselect-statusbar");

        var pfn = overlay.querySelector(".launcherFieldPFN").textContent;

        // Ensure all elements are present and progress bar is showing.
        if (!selectElement ||
            !statusBar ||
            !progressDiv ||
            progressDiv.hidden ||
            !_installIdMap[pfn]) {

            clearInterval(_refreshAppMoveProgressTimerCookie);
            _isRefreshingAppMove = false;
            return;
        }

        // Refresh the install status
        getAppMoveStatusAsync(_installIdMap[pfn].installId)
            .done(function (status) {
                if (status.isRunning) {
                    statusBar.value = status.installProgress;
                    _isRefreshingAppMove = false;
                } else {
                    // Move is complete or cancelled
                    statusBar.value = 0;
                    progressDiv.hidden = true;
                    selectElement.disabled = false;

                    clearInterval(_refreshAppMoveProgressTimerCookie);
                    _isRefreshingAppMove = false;

                    // Need to do an app refresh now this move is complete/cancelled
                    _needsAppRefresh = true;
                }
            })
            .fail(function (data, textStatus, error) {

                // Don't show an error for ERROR_NOT_FOUND.
                if (data) {
                    try {
                        var errorData = JSON.parse(data.responseText);

                        if (errorData.ErrorCode !== -2147023728) {
                            Xbox.Utils._showError(data);
                        }
                    } catch (e) {
                        Xbox.Utils._showError(data);
                    }
                }

                // Move is complete or cancelled
                statusBar.value = 0;
                progressDiv.hidden = true;
                selectElement.disabled = false;

                // Clear this entry from our install map
                delete _installIdMap[pfn];
                persistInstallIdMap();

                clearInterval(_refreshAppMoveProgressTimerCookie);
                _isRefreshingAppMove = false;

                // Need to do an app refresh now this move is complete/cancelled
                _needsAppRefresh = true;
            });
    }

    function refreshRunningTitle() {
        // Just in case our last refresh isn't done when the timer ticks again.
        if (_isRefreshingRunningTitle) {
            return;
        }

        _isRefreshingRunningTitle = true;

        $.ajax({
            url: '/ext/app/runningtitle',
            cache: false
        })
            .fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            })
            .always(function (data, textStatus, error) {
                _runningTitlePfn = data.PackageFullName;

                _isRefreshingRunningTitle = false;
            });
    };

    function refreshAppsList() {

        // Just in case our last refresh isn't done when the timer ticks again.
        if (_isRefreshingAppsList) {
            return;
        }

        _isRefreshingAppsList = true;

        $.ajax({
            url: '/api/app/packagemanager/packages',
            cache: false
        })
            .fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            })
            .always(function (data, textStatus, error) {
                // Check to see if any relevant data has changed. If not, don't refresh.
                var newAppData = data.InstalledPackages;
                var dirty = false;
                if (!_appList || (newAppData && newAppData.length !== _appList.length)) {
                    dirty = true;
                } else if (newAppData) {
                    for (var i = 0, len = _appList.length; i < len; i++) {
                        var newAppPackageData = newAppData[i];
                        var newPackageFullName = newAppPackageData.PackageFullName;
                        var matchingPackageFound = false;
                        // We need to iterate through the entire _appList because the _appList could be sorted.
                        for (var j = 0, len2 = _appList.length; j < len2; j++) {
                            var oldAppPackageData = _appList[j];
                            var oldAppPackageFullName = oldAppPackageData.PackageFullName;
                            var newPackageVersion = newAppPackageData.Version;
                            var oldPackageVersion = oldAppPackageData.Version;
                            if (newPackageFullName === oldAppPackageFullName) {
                                if (newAppPackageData.Name === oldAppPackageData.Name &&
                                    newAppPackageData.PackageFamilyName === oldAppPackageData.PackageFamilyName &&
                                    newAppPackageData.Publisher === oldAppPackageData.Publisher &&
                                    newPackageVersion.Major === oldPackageVersion.Major &&
                                    newPackageVersion.Minor === oldPackageVersion.Minor &&
                                    newPackageVersion.Build === oldPackageVersion.Build &&
                                    newPackageVersion.Revision === oldPackageVersion.Revision) {
                                    matchingPackageFound = true;
                                    break;
                                }
                            }
                        }
                        if (!matchingPackageFound) {
                            dirty = true;
                            break;
                        }
                    }
                }
                if (dirty || _needsAppRefresh) {
                    _needsAppRefresh = false;
                    retrieveDeployInfoAsync(newAppData)
                        .done(function (deployInfo) {
                            if (newAppData.length !== deployInfo.length) {
                                Xbox.Utils._showError({ ErrorMessage: "Received unexpected Deployment information." });
                            }
                            for (var i = 0, len = newAppData.length; i < len; ++i) {
                                if (newAppData[i].PackageFullName !== deployInfo[i].PackageFullName) {
                                    // newAppData doesn't match anymore. This is unexpected.
                                    Xbox.Utils._showError({ ErrorMessage: "Received unexpected Deployment information." });
                                    break;
                                }

                                // If we fail to get a deploy type, treat this as a system app
                                newAppData[i].DeployType = deployInfo[i].DeployType || "System App";
                                newAppData[i].DeployPathOrSpecifiers = deployInfo[i].DeployPathOrSpecifiers;
                                newAppData[i].DeployDrive = deployInfo[i].DeployDrive;
                                newAppData[i].DeploySizeInBytes = deployInfo[i].DeploySizeInBytes;
                                newAppData[i].PackageAlias = deployInfo[i].PackageAlias;
                                newAppData[i].OverlayFolder = deployInfo[i].OverlayFolder || "";
                            }

                            _appList = newAppData;

                            _filteredAppList = [];

                            for (var i = 0, len = _appList.length; i < len; ++i) {
                                if (_appList[i].DeployType !== "System App" ||
                                    _appList[i].PackageFamilyName === "Microsoft.Xbox.DevHome" ||
                                    _appList[i].PackageFamilyName === "Microsoft.Xbox.Settings" ||
                                    _appList[i].PackageFamilyName === "Xbox.Dashboard") {
                                    AddToFilteredApps(_appList[i]);
                                } else if (_appList[i].PackageFamilyName === "Microsoft.Title.StubApp") {
                                    // We special case this system app
                                    _stubApp = _appList[i];
                                }
                            }

                            renderAndUpdateAppActions(dirty);
                        })
                        .fail(function (data) {
                            Xbox.Utils._showError(data);
                        })
                        .always(function (data) {
                            _isRefreshingAppsList = false;
                        });
                } else {
                    _isRefreshingAppsList = false;
                }
            });
    };

    /* Deployment */
    function hideOtherInstallOptions(optionToShow) {
        // Hide all the items.
        $('#xboxdeployment-deploynewapp-installoptions').hide();
        $('#xboxdeployment-deploynewapp-installoptions-era').hide();
        $('#xboxdeployment-deploynewapp-loosedeployoptions').hide();
        $('#xboxdeployment-deploynewapp-loosedeployoptions-era').hide();
        $('#xboxdeployment-deploynewapp-networkshareoptions').hide();
        $('#xboxdeployment-deploynewapp-registeroptions').hide();
        $('#xboxdeployment-deploynewapp-registerpackageoptions').hide();

        // Now show the desired item.
        if (optionToShow === "install") {
            $('#xboxdeployment-deploynewapp-installoptions').show();
            $('#xboxdeployment-deploynewapp-uwpoption').click();
        } else if (optionToShow === "installera") {
            $('#xboxdeployment-deploynewapp-installoptions-era').show();
            $('#xboxdeployment-deploynewapp-eraoption').click();
        } else if (optionToShow === "loose") {
            $('#xboxdeployment-deploynewapp-loosedeployoptions').show();
            $('#xboxdeployment-deploynewapp-uwpoption').click();
        } else if (optionToShow === "looseera") {
            $('#xboxdeployment-deploynewapp-loosedeployoptions-era').show();
            $('#xboxdeployment-deploynewapp-eraoption').click();
        } else if (optionToShow === "network") {
            $('#xboxdeployment-deploynewapp-networkshareoptions').show();
        } else if (optionToShow === "register") {
            $('#xboxdeployment-deploynewapp-registeroptions').show();
        } else if (optionToShow === "registerpackage") {
            $('#xboxdeployment-deploynewapp-registerpackageoptions').show();
        }
    };

    function showXdkDeploymentMessage() {
        // Show the dialog letting the user know the XDK is being used
        // if installed.
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxdeployment-xdkdeployment";
        var innerHtml =
            '<h4>GDK or XDK deployment in progress</h4> \
            <form> \
                <div id="xboxdeployment-xdkdeployment-info"> \
                    If the Microsoft Game Development Kit (GDK) or Xbox Software Development Kit (XDK) is installed, a GDK or XDK command prompt should automatically begin this deployment. \
                    <p /> \
                    If the GDK or XDK is not installed on this PC or the XDK version is not current enough to support this feature, please install the latest version of the GDK or XDK to continue. \
                    <p /> \
                    You can find the latest GDK and GDK documentation <a href="http://go.microsoft.com/fwlink/?LinkID=243086">here</a>.\
                </div> \
                <br /> \
                <div class="form-group"> \
                    <button id="xboxdeployment-xdkdeployment-confirm" class="' + cssClassPrimaryCommand + '" type="button">OK</button> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var nextButton = overlayRoot.querySelector("#xboxdeployment-xdkdeployment-confirm");
        nextButton.addEventListener(
            "click",
            function (e) {
                overlay._hide();
                e.preventDefault();
                e.stopPropagation();
            },
            false);
        nextButton.focus();
    }

    function handleAddNewApp() {

        _isCancelled = false;

        // Show the dialog to add a new app
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxdeployment-deploynewapp";

        var uwpEraToggleHtml =
            '<div class="form-group" id="xboxdeployment-deploynewapp-toggleerauwp-formgroup" hidden> \
                <input type="radio" name="eraOrUwp" id="xboxdeployment-deploynewapp-eraoption" checked="checked"/> \
                <label for="xboxdeployment-deploynewapp-eraoption" id="xboxdeployment-deploynewapp-eraoption-label" class="xboxdeployment-radiolabel">GDK/XDK Deployment</label> \
                <input type="radio" name="eraOrUwp" id="xboxdeployment-deploynewapp-uwpoption"/> \
                <label for="xboxdeployment-deploynewapp-uwpoption" id="xboxdeployment-deploynewapp-uwpoption-label" class="xboxdeployment-radiolabel">UWP Deployment</label> \
            </div>';

        var uwpInstallHtml =
            '<div class="form-group" id="xboxdeployment-deploynewapp-installpackage-formgroup"> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-installpackage" checked="checked"/> \
                <label id="xboxdeployment-deploynewapp-installlabel">Install packaged application</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-installoptions"> \
                    <input type="file" id="xboxdeployment-deploynewapp-packagefile" class="wideInputField" accept=".appx,.appxbundle,.msix,.msixbundle"/> \
                    <div id="xboxdeployment-deploynewapp-packagefile-dragdrop" class="drag-drop">or drop package file here</div> \
                </div> \
            </div> ';

        var uwpLooseHtml =
            '<div class="form-group" id="xboxdeployment-deploynewapp-loosedeploy-formgroup"> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-loosedeploy" /> \
                <label id="xboxdeployment-deploynewapp-looselabel">Deploy loose app files to console</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-loosedeployoptions"> \
                    <div id="xboxdeployment-deploynewapp-loosedeployoptions-supported" hidden> \
                        <input type="file" id="xboxdeployment-deploynewapp-looseappfiles" class="wideInputField" webkitdirectory mozdirectory msdirectory odirectory directory multiple/> \
                        <div class="form-group"> \
                            <label>Destination: </label> \
                            <input id="xboxdeployment-deploynewapp-looseappfolder" type="text" placeholder="Specify a destination folder name for the application." />\
                        </div> \
                    </div> \
                    <div id="xboxdeployment-deploynewapp-loosedeployoptions-unsupported" hidden> \
                        Your current browser does not support loose deployment. Try using Microsoft Edge for selecting a loose folder. \
                    </div> \
                </div> \
            </div>';

        var eraInstallHtml =
            '<div class="form-group" id="xboxdeployment-deploynewapp-installpackage-era-formgroup" hidden> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-installpackage-era"/> \
                <label id="xboxdeployment-deploynewapp-installlabel-era">Install packaged application</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-installoptions-era"> \
                    <input id="xboxdeployment-deploynewapp-packagefile-era" type="text" placeholder="Specify the full path to the XVC for your application." /> \
                </div> \
             </div>';

        var eraLooseHtml =
            '<div class="form-group" id="xboxdeployment-deploynewapp-loosedeploy-era-formgroup" hidden> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-loosedeploy-era" /> \
                <label id="xboxdeployment-deploynewapp-looselabel-era">Deploy loose app files to console</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-loosedeployoptions-era"> \
                    <div> \
                        <div class="form-group"> \
                            <label>Source: </label> \
                            <input id="xboxdeployment-deploynewapp-looseappfolder-era-source" type="text" placeholder="Specify the full source path to the root folder for the loose application files." />\
                        </div> \
                        <br /> \
                        <div class="form-group"> \
                            <label>Destination: </label> \
                            <input id="xboxdeployment-deploynewapp-looseappfolder-era" type="text" placeholder="Specify a destination folder name for the application." />\
                        </div> \
                    </div> \
                </div> \
            </div> ';

        var networkShareHtml =
            '<div class="form-group"> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-registernetworkshare" /> \
                <label id="xboxdeployment-deploynewapp-networklabel">Register a network share location</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-networkshareoptions"> \
                    <input id="xboxdeployment-deploynewapp-networkshare" type="text" placeholder="Specify a URI to the files."/> \
                </div> \
            </div> ';

        var existingRegisterHtml =
            '<div class="form-group"> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-register" /> \
                <label id="xboxdeployment-deploynewapp-registerlabel">Register legacy title files already on the console</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-registeroptions"> \
                    <select id="xboxdeployment-deploynewapp-registerfolderlist" class="wideInputField"> \
                    </select> \
                </div> \
            </div> ';

        var existingPackageRegisterHtml =
            '<div class="form-group" id="xboxdeployment-deploynewapp-registerpackage-era-formgroup" hidden> \
                <input type="radio" name="deployType" id="xboxdeployment-deploynewapp-registerpackage" /> \
                <label id="xboxdeployment-deploynewapp-registerpackagelabel">Register content already on the console</label> \
                <div class="form-group" id="xboxdeployment-deploynewapp-registerpackageoptions"> \
                    <select id="xboxdeployment-deploynewapp-registerpackagelist" class="wideInputField"> \
                    </select> \
                </div> \
            </div> ';

        var extraOptionsHeaderHtml =
            '<div id="xboxdeployment-deploynewapp-advancedoverview"> \
                <div> \
                    <br> \
                    <header id="xboxdeployment-deploynewapp-showadvancedoptions-header"> \
                        <div> \
                            <label>Advanced Options</label> \
                            <div id="xboxdeployment-deploynewapp-showadvancedoptions-div"> \
                                <a href="#" id="xboxdeployment-deploynewapp-showadvancedoptions">Show options</a> \
                            </div> \
                        </div> \
                    </header> \
                </div> \
                <div> \
                    <p id="xboxdeployment-deploynewapp-showadvancedoptions-description"> \
                        Other deployment options include deploying loose files, registering a network share, and registering existing files. \
                    </p> \
                </div> \
            </div> \
            <div id="xboxdeployment-deploynewapp-advancedoptions">';

        var innerHtml =
            '<h3>Deploy or Install Application</h3> \
            <form>';

        innerHtml += uwpEraToggleHtml;

        // Only one install and one loose will be visible at a time
        // (depending on if we want ERA or UWP)
        innerHtml += eraInstallHtml;
        innerHtml += eraLooseHtml;
        innerHtml += uwpInstallHtml;
        innerHtml += extraOptionsHeaderHtml;
        innerHtml += uwpLooseHtml;
        innerHtml += networkShareHtml;
        innerHtml += existingRegisterHtml;
        innerHtml += existingPackageRegisterHtml;

        innerHtml +=
            '</div> \
                <div class="form-group"> \
                    <button id="xboxdeployment-nextpage" class="' + cssClassPrimaryCommand + '" type="button">Next</button> \
                    <button id="xboxdeployment-cancel" class="' + cssClassPrimaryCommand + '" type="button">Cancel</button> \
                    <br \> \
                    <label id="xboxdeployment-deploynewapp-errorlabel" class="warning" /> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        if (!_isRetailOrSraDevkit) {
            $('#xboxdeployment-deploynewapp-toggleerauwp-formgroup').show();
        }

        $('#xboxdeployment-deploynewapp-eraoption').click(function () {
            if ($(this).is(':checked')) {

                var eraLabel = overlayRoot.querySelector("#xboxdeployment-deploynewapp-eraoption-label");
                eraLabel.className = "xboxdeployment-radiolabel-checked";
                var uwpLabel = overlayRoot.querySelector("#xboxdeployment-deploynewapp-uwpoption-label");
                uwpLabel.className = "xboxdeployment-radiolabel";

                // Hide UWP install options when radio is checked
                $('#xboxdeployment-deploynewapp-installpackage-formgroup').hide();
                $('#xboxdeployment-deploynewapp-loosedeploy-formgroup').hide();

                $('#xboxdeployment-deploynewapp-installpackage-era-formgroup').show();
                $('#xboxdeployment-deploynewapp-loosedeploy-era-formgroup').show();
                $('#xboxdeployment-deploynewapp-registerpackage-era-formgroup').show();

                if ($('#xboxdeployment-deploynewapp-installpackage').is(':checked')) {
                    $('#xboxdeployment-deploynewapp-installoptions-era').show();
                    $('#xboxdeployment-deploynewapp-installpackage-era').click();
                } else if ($('#xboxdeployment-deploynewapp-loosedeploy').is(':checked')) {
                    $('#xboxdeployment-deploynewapp-loosedeployoptions-era').show();
                    $('#xboxdeployment-deploynewapp-loosedeploy-era').click();
                }
            }
        });

        $('#xboxdeployment-deploynewapp-uwpoption').click(function () {
            if ($(this).is(':checked')) {

                var eraLabel = overlayRoot.querySelector("#xboxdeployment-deploynewapp-eraoption-label");
                eraLabel.className = "xboxdeployment-radiolabel";
                var uwpLabel = overlayRoot.querySelector("#xboxdeployment-deploynewapp-uwpoption-label");
                uwpLabel.className = "xboxdeployment-radiolabel-checked";

                // Hide ERA install options when radio is checked
                $('#xboxdeployment-deploynewapp-installpackage-era-formgroup').hide();
                $('#xboxdeployment-deploynewapp-loosedeploy-era-formgroup').hide();
                $('#xboxdeployment-deploynewapp-registerpackage-era-formgroup').hide();
                $('#xboxdeployment-deploynewapp-registerpackageoptions').hide();

                $('#xboxdeployment-deploynewapp-installpackage-formgroup').show();
                $('#xboxdeployment-deploynewapp-loosedeploy-formgroup').show();

                if ($('#xboxdeployment-deploynewapp-installpackage-era').is(':checked')) {
                    $('#xboxdeployment-deploynewapp-installoptions').show();
                    $('#xboxdeployment-deploynewapp-installpackage').click();
                } else if ($('#xboxdeployment-deploynewapp-loosedeploy-era').is(':checked')) {
                    $('#xboxdeployment-deploynewapp-loosedeployoptions').show();
                    $('#xboxdeployment-deploynewapp-loosedeploy').click();
                } else if ($('#xboxdeployment-deploynewapp-registerpackage').is(':checked')) {
                    $('#xboxdeployment-deploynewapp-installoptions').show();
                    $('#xboxdeployment-deploynewapp-installpackage').click();
                }
            }
        });

        // Loose deploy is supported if our browser supports webkit or we are using
        // XDK protocol activation instead of HTTP for the transfer.
        if (navigator.userAgent.toLowerCase().match(/webkit/)) {
            $('#xboxdeployment-deploynewapp-loosedeployoptions-supported').show();
        } else {
            $('#xboxdeployment-deploynewapp-loosedeployoptions-unsupported').show();
        }

        $('#xboxdeployment-deploynewapp-installpackage').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but install options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("install");
            }
        });

        $('#xboxdeployment-deploynewapp-installpackage-era').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but install era options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("installera");
            }
        });

        $('#xboxdeployment-deploynewapp-loosedeploy-era').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but loose era options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("looseera");
            }
        });

        $('#xboxdeployment-deploynewapp-loosedeploy').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but loose deploy options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("loose");
            }
        });

        $('#xboxdeployment-deploynewapp-registernetworkshare').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but register network share options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("network");
            }
        });

        $('#xboxdeployment-deploynewapp-register').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but register options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("register");

                Wdp.Utils._showProgress(overlayRoot);

                // Populate the list with folders from the console.
                getAvailableLooseFoldersAsync()
                    .done(function (availableFolders) {
                        var $folderList = $('#xboxdeployment-deploynewapp-registerfolderlist');
                        // save current selection
                        var selectedFolder = $folderList.val();
                        $folderList.children().remove();

                        if (availableFolders.length) {
                            for (var folderIndex = 0; folderIndex < availableFolders.length; folderIndex++) {
                                var text = availableFolders[folderIndex].Folder + ' (' + availableFolders[folderIndex].PackageFullName + ')';
                                if (availableFolders[folderIndex].IsEra) {
                                    text += " - Title";
                                }
                                // * is not valid in a folder name, so we append a * for ERA folders
                                // so we can identify them later.
                                var value = availableFolders[folderIndex].Folder;
                                if (availableFolders[folderIndex].IsEra) {
                                    value += "*";
                                }
                                $folderList.append(
                                    $('<option>',
                                        {
                                            value: value,
                                            text: text
                                        }));
                            }

                            // re-select the previous selected item if it still exists
                            if (selectedFolder) {
                                $folderList.val(selectedFolder);
                            }
                        } else {
                            overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "There are no folders available for registration on this console.";
                        }
                    })
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    })
                    .always(function (data, textStatus, error) {
                        Wdp.Utils._hideProgress(overlayRoot);
                    });
            }
        });

        $('#xboxdeployment-deploynewapp-registerpackage').click(function () {
            if ($(this).is(':checked')) {
                // Hide all but register package options when radio is checked
                overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "";
                hideOtherInstallOptions("registerpackage");

                Wdp.Utils._showProgress(overlayRoot);

                // Populate the list with unregistered packages from the console.
                getUnregisteredPackagesAsync()
                    .done(function (availablePackages) {
                        var $packageList = $('#xboxdeployment-deploynewapp-registerpackagelist');
                        // save current selection
                        var selectedPackage = $packageList.val();
                        $packageList.children().remove();

                        if (availablePackages.length) {
                            for (var packageIndex = 0; packageIndex < availablePackages.length; ++packageIndex) {
                                var text, value;
                                if (availablePackages[packageIndex].DeployPath) {
                                    text = availablePackages[packageIndex].PackageFullName + ' (' + availablePackages[packageIndex].DeployPath + ')';
                                    value = availablePackages[packageIndex].PackageFullName + ' ' + availablePackages[packageIndex].DeployPath;
                                } else if (availablePackages[packageIndex].PackageAlias){
                                    text = availablePackages[packageIndex].PackageAlias + " - " + availablePackages[packageIndex].PackageFullName + ' (' + availablePackages[packageIndex].DeployDrive + ')';
                                    value = availablePackages[packageIndex].PackageFullName + ' ' + availablePackages[packageIndex].DeployDrive + ' ' + availablePackages[packageIndex].PackageAlias;
                                } else {
                                    text = availablePackages[packageIndex].PackageFullName + ' (' + availablePackages[packageIndex].DeployDrive + ')';
                                    value = availablePackages[packageIndex].PackageFullName + ' ' + availablePackages[packageIndex].DeployDrive;
                                }

                                $packageList.append(
                                    $('<option>',
                                        {
                                            value: value,
                                            text: text
                                        }));
                            }

                            // re-select the previous selected item if it still exists
                            if (selectedPackage) {
                                $packageList.val(selectedPackage);
                            }
                        } else {
                            overlayRoot.querySelector("#xboxdeployment-deploynewapp-errorlabel").innerHTML = "There is no unregistered content available for registration on this console.";
                        }
                    })
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    })
                    .always(function (data, textStatus, error) {
                        Wdp.Utils._hideProgress(overlayRoot);
                    });
            }
        });

        if ($('#xboxdeployment-deploynewapp-looseappfiles')) {

            // If user selects a loose folder, populate the folder destination name automatically
            // if it is empty.
            $('#xboxdeployment-deploynewapp-looseappfiles').change(function (e) {
                var rootOverlay = document.querySelector(".xboxdeployment-deploynewapp");
                var overlay = rootOverlay.wdpControl;
                var files = rootOverlay.querySelector("#xboxdeployment-deploynewapp-looseappfiles").files;
                var foldername = rootOverlay.querySelector("#xboxdeployment-deploynewapp-looseappfolder");

                if (files && files.length > 0 && files[0].webkitRelativePath && !foldername.value) {
                    // Default value is the root folder name.
                    foldername.value = files[0].webkitRelativePath.split("/")[0];
                }
            });
        }

        var showAdvanced = overlayRoot.querySelector("#xboxdeployment-deploynewapp-showadvancedoptions");
        showAdvanced.onclick = showAdvancedOptions;

        // Hide all options except install.
        if (_isRetailOrSraDevkit) {
            hideOtherInstallOptions("install");
        } else {
            hideOtherInstallOptions("installera");

            // Always show advanced options on non-UWP devkits.
            showAdvancedOptions();
        }

        // Retrieve last used option and use that as default shown option.
        if (localStorage) {
            var localData = localStorage.getItem(lastDeployOptionLocalStorageKey);
            if (localData) {
                hideOtherInstallOptions(localData);

                // We show our advanced options if the last deploy came from
                // one of them.
                if (localData !== "install") {
                    showAdvancedOptions();
                }

                // Move the selected radio option.
                if (localData === "install") {
                    $('#xboxdeployment-deploynewapp-installpackage').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-installpackage').click();
                } else if (localData === "installera") {
                    $('#xboxdeployment-deploynewapp-installpackage-era').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-installpackage-era').click();
                } else if (localData === "looseera") {
                    $('#xboxdeployment-deploynewapp-loosedeploy-era').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-loosedeploy-era').click();
                } else if (localData === "loose") {
                    $('#xboxdeployment-deploynewapp-loosedeploy').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-loosedeploy').click();
                } else if (localData === "network") {
                    $('#xboxdeployment-deploynewapp-registernetworkshare').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-registernetworkshare').click();
                } else if (localData === "register") {
                    $('#xboxdeployment-deploynewapp-register').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-register').click();
                } else if (localData === "registerpackage") {
                    $('#xboxdeployment-deploynewapp-registerpackage').prop("checked", true);
                    $('#xboxdeployment-deploynewapp-registerpackage').click();
                }
            }
        }

        // If the browser supports drag and drop
        if (isDragDropSupported()) {
            var dragDrop = overlayRoot.querySelector("#xboxdeployment-deploynewapp-packagefile-dragdrop");
            dragDrop.addEventListener("dragenter", fileDragHover, false);
            dragDrop.addEventListener("dragover", fileDragHover, false);
            dragDrop.addEventListener("dragleave", fileDragHover, false);
            dragDrop.addEventListener("drop", function (e) {

                // Disable the drag hover
                fileDragHover(e);

                // Set a property on our package element to the file we dropped.
                // Some browsers allow updating the input element, which is really nice, so we
                // attempt that as well.
                var rootOverlay = document.querySelector(".xboxdeployment-deploynewapp");
                var packageFileElement = rootOverlay.querySelector("#xboxdeployment-deploynewapp-packagefile");
                if (e.dataTransfer.files.length > 0) {
                    packageFileElement.packageFile = e.dataTransfer.files[0];
                }
                resetField($(packageFileElement));

                try {
                    packageFileElement.files = e.dataTransfer.files;
                } catch (ex) {
                    // Do nothing
                }

                if (packageFileElement.packageFile) {
                    // Update the text for the dragDrop element in case this 
                    // browser doesn't support updating the input element
                    dragDrop.innerHTML = packageFileElement.packageFile.name;
                }
            });
            dragDrop.style.display = "block";

            // If user selects a package manually, make sure to reset the drag/drop text
            $('#xboxdeployment-deploynewapp-packagefile').change(function (e) {
                var rootOverlay = document.querySelector(".xboxdeployment-deploynewapp");
                var packageFileElement = rootOverlay.querySelector("#xboxdeployment-deploynewapp-packagefile");
                if (packageFileElement.files && packageFileElement.files.length > 0) {
                    dragDrop.innerHTML = packageFileElement.files[0].name;
                } else {
                    dragDrop.innerHTML = "or drop package file here";
                }
            });
        } else {
            var dragDrop = overlayRoot.querySelector("#xboxdeployment-deploynewapp-packagefile-dragdrop");
            dragDrop.style.display = "none";
        }

        // Close the overlay on cancel.
        $('#xboxdeployment-cancel').click(function () {
            var rootOverlay = document.querySelector(".xboxdeployment-deploynewapp");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        var nextButton = overlayRoot.querySelector("#xboxdeployment-nextpage");
        nextButton.addEventListener("click", onClickNext, false);
        nextButton.focus();
    };

    function isDragDropSupported() {
        var div = document.createElement('div');
        return 'draggable' in div &&
            'ondragstart' in div &&
            'ondrop' in div;
    }

    function resetField(e) {
        e.wrap('<form>').parent('form').trigger('reset');
        e.unwrap();
    };

    function showAdvancedOptions() {
        var rootOverlay = document.querySelector(".xboxdeployment-deploynewapp");
        var advancedOptions = rootOverlay.querySelector("#xboxdeployment-deploynewapp-advancedoptions");
        var advancedOverview = rootOverlay.querySelector("#xboxdeployment-deploynewapp-advancedoverview");
        var installPackage = rootOverlay.querySelector("#xboxdeployment-deploynewapp-installpackage");

        // Show the advanced options UI and hide the overview.
        advancedOptions.style.display = "block";
        installPackage.style.display = "inline-block";
        advancedOverview.style.display = "none";
    };

    function fileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = ((e.type === "dragenter" || e.type === "dragover") ? "drag-drop-hover" : "drag-drop");
    };

    function getAvailableLooseFoldersAsync() {
        var deferred = $.Deferred();
        $.ajax({ url: '/ext/app/packagemanager/era/available', cache: false, type: 'get', contentType: 'application/json' })
            .done(function (data, textStatus, error) {
                deferred.resolve(data.Folders);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data, error);
            });
        return deferred;
    };

    function getUnregisteredPackagesAsync() {
        var deferred = $.Deferred();
        $.ajax({ url: '/ext/app/unregistered', cache: false, type: 'get', contentType: 'application/json' })
            .done(function (data, textStatus, error) {
                deferred.resolve(data.Packages);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data, error);
            });
        return deferred;
    };

    function addFileToDependencies(file) {
        // Don't allow multiple dependencies with the same name.
        for (var i = 0; i < _dependencyFiles.length; ++i) {
            if (_dependencyFiles[i].name === file.name) {
                return;
            }
        }

        _dependencyFiles.push(file);

        refreshDependencyList();
    };

    function removeDependency(name) {

        for (var i = 0; i < _dependencyFiles.length; ++i) {
            if (_dependencyFiles[i].name === name) {
                _dependencyFiles.splice(i, 1);
                break;
            }
        }
        refreshDependencyList();
    };

    function handleDependencyListClicked(e) {
        var target = e.target;
        var name = target.getAttribute(dependencyNameAttribute);

        // Remove this dependency
        if (target.classList.contains("xboxdeployment-dependency-remove")) {
            removeDependency(name);
        }
    };

    function nameFormatter(row, cell, value, columnDef, dataContext) {
        return dataContext.name;
    };

    function removeFormatter(row, cell, value, columnDef, dataContext) {
        return '<a class="xboxdeployment-dependency-remove" href="#" ' + dependencyNameAttribute + '="' + dataContext.name + '">remove</a>';
    };

    function refreshDependencyList() {

        var rootOverlay = document.querySelector(".xboxdeployment-getdependencies");
        var dependencyList = rootOverlay.querySelector("#xboxdeployment-getdependencies-appdependencies");

        if (_dependencyFiles.length) {
            if (!_dependencyGrid) {
                var dependencyTableColumns = [
                    { id: "name", name: "Dependency Name", field: "Dependency Name", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: nameFormatter },
                    { id: "remove", name: "Remove", field: "Remove", width: 96, cssClass: "tableCell", headerCssClass: "tableHeader tableTextColumn", formatter: removeFormatter }
                ];

                var dependencyTableOptions = {
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

                _dependencyDataView = new Slick.Data.DataView();
                _dependencyDataView.setItems(_dependencyFiles, "name");
                _dependencyGrid = new Slick.Grid(dependencyList, _dependencyDataView, dependencyTableColumns, dependencyTableOptions);
                _dependencyGrid.onClick.subscribe(handleDependencyListClicked);
            }

            _dependencyDataView.setItems(_dependencyFiles, "name");
            _dependencyGrid.invalidate();
            _dependencyGrid.render();
        } else {
            _dependencyGrid = null;
            dependencyList.innerHTML = '';
        }
    };

    function showDependenciesPopup(isPackaged) {
        // Show the dialog to request dependencies for UWP
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxdeployment-getdependencies";
        var innerHtml =
            '<h4>Choose any necessary dependencies</h4> \
            <form> \
                <div id="xboxdeployment-getdependencies-adddependencysection"> \
                    <input type="file" id="xboxdeployment-getdependencies-dependencyfile" class="wideInputField" accept=".appx,.appxbundle,.msix,.msixbundle"/> \
                    <div id="xboxdeployment-getdependencies-dependencyfile-dragdrop" class="drag-drop">or drop dependency file here</div> \
                </div> \
                <div id="xboxdeployment-getdependencies-appdependencies" class="commonTable"></div> \
                <div class="form-group"> \
                    <button id="xboxdeployment-getdependencies-startdeploy" class="' + cssClassPrimaryCommand + '" type="button">Start</button> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        _dependencyFiles = [];

        // If the browser supports drag and drop
        if (isDragDropSupported()) {
            var dragDrop = overlayRoot.querySelector("#xboxdeployment-getdependencies-dependencyfile-dragdrop");
            dragDrop.addEventListener("dragenter", fileDragHover, false);
            dragDrop.addEventListener("dragover", fileDragHover, false);
            dragDrop.addEventListener("dragleave", fileDragHover, false);
            dragDrop.addEventListener("drop", function (e) {

                // Disable the drag hover
                fileDragHover(e);

                // Add this file to our dependencies but leave the dragDrop empty for further dependencies.
                var rootOverlay = document.querySelector(".xboxdeployment-getdependencies");
                var dependencyFileElement = rootOverlay.querySelector("#xboxdeployment-getdependencies-dependencyfile");
                if (e.dataTransfer.files.length > 0) {
                    addFileToDependencies(e.dataTransfer.files[0]);
                }
            });
            dragDrop.style.display = "block";

            // If user selects a dependency manually, add it to the list and reset the file element.
            $('#xboxdeployment-getdependencies-dependencyfile').change(function (e) {
                var rootOverlay = document.querySelector(".xboxdeployment-getdependencies");
                var dependencyFileElement = rootOverlay.querySelector("#xboxdeployment-getdependencies-dependencyfile");
                if (dependencyFileElement.files && dependencyFileElement.files.length > 0) {
                    addFileToDependencies(dependencyFileElement.files[0]);
                    resetField($(dependencyFileElement));
                }
            });
        } else {
            var dragDrop = overlayRoot.querySelector("#xboxdeployment-getdependencies-dependencyfile-dragdrop");
            dragDrop.style.display = "none";
        }

        var form = overlayRoot.querySelector("form");

        var nextButton = overlayRoot.querySelector("#xboxdeployment-getdependencies-startdeploy");
        if (isPackaged) {
            nextButton.addEventListener("click", onGetUwpPackagedDependencies, false);
        } else {
            nextButton.addEventListener("click", onGetUwpLooseDependencies, false);
        }
        nextButton.focus();
    };

    function getNetworkCredentials(userAndPasswordProvided) {
        // Show the dialog to get network credentials
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxdeployment-getnetworkcreds";

        var innerHtml = '<h4>The provided network share requires login credentials.</h4>';
        if (userAndPasswordProvided) {
            innerHtml = '<h4>The provided credentials were invalid. Please try again.</h4>';
        }
        innerHtml +=
            '<form> \
                <label>Enter your username</label> \
                <div id="xboxdeployment-getnetworkcreds-networkusersection"> \
                    <input id="xboxdeployment-getnetworkcreds-networkuser" /> \
                </div> \
                <label>Enter your password</label> \
                <div id="xboxdeployment-getnetworkcreds-networkpasswordsection"> \
                    <input id="xboxdeployment-getnetworkcreds-networkpassword" type="password" /> \
                    <a href="#" id="xboxdeployment-getnetworkcreds-showpassword-button" >show</a > \
                </div> \
                <div class="form-group"> \
                    <button id="xboxdeployment-getnetworkcreds-startdeploy" class="' + cssClassPrimaryCommand + '" type="button">Start</button> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var passwordInput = overlayRoot.querySelector("#xboxdeployment-getnetworkcreds-networkpassword");
        var showPasswordButton = overlayRoot.querySelector("#xboxdeployment-getnetworkcreds-showpassword-button");
        showPasswordButton.addEventListener("click", function (e) {
            if (passwordInput.getAttribute("type") === "password") {
                passwordInput.setAttribute("type", "text");
                showPasswordButton.innerHTML = "hide";
            } else {
                passwordInput.setAttribute("type", "password");
                showPasswordButton.innerHTML = "show";
            }
        });

        var nextButton = overlayRoot.querySelector("#xboxdeployment-getnetworkcreds-startdeploy");
        nextButton.addEventListener("click", onEnterNetworkCreds, false);
        nextButton.focus();
    };

    function updateDeploymentText(desiredText) {
        var rootOverlay = document.querySelector(".xboxdeployment-showinstallationprogress");
        var statusText = rootOverlay.querySelector("#xboxdeployment-showinstallationprogress-statustext");

        statusText.innerHTML = desiredText;
    }

    function changeProgressBarToFailure() {
        var rootOverlay = document.querySelector(".xboxdeployment-showinstallationprogress");
        var statusBar = rootOverlay.querySelector("#xboxdeployment-showinstallationprogress-statusbar");

        statusBar.style.display = "none";
    };

    function updateProgressBar(percent) {
        var rootOverlay = document.querySelector(".xboxdeployment-showinstallationprogress");
        var statusBar = rootOverlay.querySelector("#xboxdeployment-showinstallationprogress-statusbar");

        statusBar.value = percent;
    };

    function showStatusMessage(success, statusData) {
        if (success) {
            updateDeploymentText("Package Successfully Registered");
            updateProgressBar(100);

            triggerPackageInstalledCallback();
        } else {
            updateDeploymentText(WebManagement.ErrorStringFromStatus(statusData || {}));
            changeProgressBarToFailure();
        }

        var rootOverlay = document.querySelector(".xboxdeployment-showinstallationprogress");
        var doneButton = rootOverlay.querySelector("#xboxdeployment-showinstallationprogress-cancelordone");
        doneButton.innerHTML = "Done";
    };

    function uploadProgress(done, total, percent, folderIndex, folderCount) {

        // The progress bar should be split into N + 1 chunks where N is the number of
        // folders (or one for a package) and the final chunk is for the registration step.
        var items = 2;
        var completedItems = 0;

        if (folderCount) {
            items = folderCount + 1;
        }
        // Completed items is our current index.
        if (folderIndex > 0) {
            completedItems = folderIndex;
        }

        // totalPercent is completed items fully filled, plus whatever percent of our current item we have filled.
        var chunkSize = 100 / items;
        var totalPercent = (completedItems * chunkSize) + chunkSize * (percent / 100);

        if (folderCount) {
            var updateText = (folderCount - folderIndex) + " folder(s) remaining";
            updateText += "<br>";
            updateText += totalPercent.toFixed(2) + "% complete";
            updateDeploymentText(updateText);
        } else {
            updateDeploymentText("Upload " + percent + "% complete");
        }

        updateProgressBar(totalPercent);
    };

    function pollForInstallComplete() {
        var webbRest = new WebbRest();
        webbRest.getInstallationState()
            .done(function (data) {
                if (data.installRunning === false) {
                    showStatusMessage(data.Success, data);
                } else {
                    setTimeout(pollForInstallComplete, 1000);
                }
            })
            .fail(function () {
                setTimeout(pollForInstallComplete, 1000);
            });
    };

    function showInstallationProgress(options, dependencyFiles) {
        // Show the installation progress
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxdeployment-showinstallationprogress";
        var innerHtml =
            '<h4>Installation Progress</h4> \
            <form> \
                <div class="form-group"> \
                    <span id="xboxdeployment-showinstallationprogress-statustext" /> \
                </div> \
                <div class="form-group"> \
                    <progress value="0" max="100" id="xboxdeployment-showinstallationprogress-statusbar"> \
                    </progress \
                </div> \
                <div class="form-group"> \
                    <button id="xboxdeployment-showinstallationprogress-cancelordone" class="' + cssClassPrimaryCommand + '" type="button">Cancel</button> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var nextButton = overlayRoot.querySelector("#xboxdeployment-showinstallationprogress-cancelordone");
        nextButton.addEventListener("click", cancelOrComplete, false);
        nextButton.focus();

        // This begins the actual deployment.

        if (options.isPackaged) {
            try {
                var webbRest = new WebbRest();
                webbRest.installApp({ appFile: _packageFile, dependencyFiles: dependencyFiles }, uploadProgress)
                    .done(function () {
                        pollForInstallComplete();
                    })
                    .fail(function (data) {
                        showStatusMessage(false, data);
                    });
            } catch (e) {
                if (e.number === -2147024362) { // Arithmetic overflow
                    Xbox.Utils._showError({ ErrorMessage: "Your current browser does not support packages larger than 4 GB in size. Please try another browser." });
                } else {
                    // Rethrow to avoid masking other errors that we want to be informed about.
                    throw e;
                }
            }
        } else if (options.doCopy) {
            // Get the source folder.
            var sourceFolders = _looseFiles[0].webkitRelativePath.split("/");
            if (sourceFolders && sourceFolders[0]) {
                var sourceRootFolder = sourceFolders[0];

                var appFilesByFolder = {};
                var folderList = [];
                var appFileIndex;

                // Add app files
                for (appFileIndex = 0; appFileIndex < _looseFiles.length; appFileIndex++) {

                    var filePath = _looseFiles[appFileIndex].webkitRelativePath;
                    var relativePath = filePath.substring(0, filePath.lastIndexOf("/"));

                    if (!appFilesByFolder[relativePath]) {
                        appFilesByFolder[relativePath] = [];
                        folderList.push(relativePath);
                    }
                    appFilesByFolder[relativePath].push(_looseFiles[appFileIndex]);
                }

                if (!_looseFilesDestinationFolder) {
                    _looseFilesDestinationFolder = sourceRootFolder;
                }

                uploadFolderAndRegisterAppIfLast(options.isEra, _looseFilesDestinationFolder, sourceRootFolder, 0, folderList, appFilesByFolder, dependencyFiles);
            }
        } else if (options.networkShare) {
            updateDeploymentText("Registering...");
            registerNetworkShare(_networkSharename, options.networkUser, options.networkSharePassword)
                .done(function () {
                    // Network Registration blocks until complete.
                    showStatusMessage(true);
                })
                .fail(function (data) {
                    if (data && data.responseText) {
                        var parsedData = JSON.parse(data.responseText);
                        var unsignedCode;
                        if (parsedData && parsedData.ErrorCode) {
                            unsignedCode = (parsedData.ErrorCode >>> 32);
                        }
                        // If this is ERROR_BAD_NET_RESP, ERROR_INVALID_PASSWORD, ERROR_NO_SUCH_LOGON_SESSION, ERROR_LOGON_FAILURE, ERROR_BAD_USERNAME, or ACCESS_DENIED, we need credentials to connect to the share.
                        if (unsignedCode === 0x8007003A ||
                            unsignedCode === 0x80070056 ||
                            unsignedCode === 0x80070520 ||
                            unsignedCode === 0x8007052e ||
                            unsignedCode === 0x8007089a ||
                            unsignedCode === 0x80070005) {
                            getNetworkCredentials(options.networkUser && options.networkSharePassword);
                        } else if (unsignedCode == 0x80073cf3) { // ERROR_INSTALL_RESOLVE_DEPENDENCY_FAILED
                            parsedData.ErrorMessage = "Failed to resolve one or more dependencies. Check the appxmanifest for PackageDependency nodes and make sure all stated dependencies (vclibs, WinJS, package-specific...) are installed before attempting to register the package.";
                            Xbox.Utils._showError(parsedData);
                        } else {
                            Xbox.Utils._showError(parsedData);
                        }
                    } else {
                        Xbox.Utils._showError({ ErrorMessage: "Unexpected error encountered." });
                    }
                });
        } else if (options.registerPackageOnly) {
            updateDeploymentText("Registering...");
            registerPackagedApp(options.packageName, options.driveValue, options.aliasValue)
                .done(function () {
                    // Package Registration blocks until complete.
                    showStatusMessage(true);
                })
                .fail(function (data) {
                    Xbox.Utils._showError(data);
                });
        } else {
            uploadFolderAndRegisterAppIfLast(options.isEra, _folderToRegister);
        }
    };

    function cancelOrComplete(e) {
        var rootOverlay = document.querySelector(".xboxdeployment-showinstallationprogress");
        var overlay = rootOverlay.wdpControl;
        var doneButton = rootOverlay.querySelector("#xboxdeployment-showinstallationprogress-cancelordone");

        if (doneButton.innerHTML === "Cancel") {
            _isCancelled = true;
        }

        overlay._hide();
        e.preventDefault();
        e.stopPropagation();
    };

    function onGetUwpPackagedDependencies(e) {
        onGetUwpDependencies(e, true)
    };

    function onGetUwpLooseDependencies(e) {
        onGetUwpDependencies(e, false)
    };

    function onGetUwpDependencies(e, isPackaged) {
        var rootOverlay = document.querySelector(".xboxdeployment-getdependencies");
        var overlay = rootOverlay.wdpControl;

        Wdp.Utils._showProgress(rootOverlay);

        showInstallationProgress({ isPackaged: isPackaged, doCopy: !isPackaged }, _dependencyFiles);

        Wdp.Utils._hideProgress(rootOverlay);
        overlay._hide();
        e.preventDefault();
        e.stopPropagation();
    };

    function onEnterNetworkCreds(e) {
        var rootOverlay = document.querySelector(".xboxdeployment-getnetworkcreds");
        var overlay = rootOverlay.wdpControl;
        var networkUser = rootOverlay.querySelector("#xboxdeployment-getnetworkcreds-networkuser");
        var networkPassword = rootOverlay.querySelector("#xboxdeployment-getnetworkcreds-networkpassword");

        showInstallationProgress({ networkShare: true, networkUser: networkUser.value, networkSharePassword: networkPassword.value });

        overlay._hide();
        e.preventDefault();
        e.stopPropagation();
    };

    function onClickNext(e) {

        var stayOnOverlay = false;
        var rootOverlay = document.querySelector(".xboxdeployment-deploynewapp");
        var overlay = rootOverlay.wdpControl;
        var installOption = rootOverlay.querySelector("#xboxdeployment-deploynewapp-installpackage");
        var installOptionEra = rootOverlay.querySelector("#xboxdeployment-deploynewapp-installpackage-era");
        var looseOption = rootOverlay.querySelector("#xboxdeployment-deploynewapp-loosedeploy");
        var looseOptionEra = rootOverlay.querySelector("#xboxdeployment-deploynewapp-loosedeploy-era");
        var networkOption = rootOverlay.querySelector("#xboxdeployment-deploynewapp-registernetworkshare");
        var registerOption = rootOverlay.querySelector("#xboxdeployment-deploynewapp-register");
        var registerPackageOption = rootOverlay.querySelector("#xboxdeployment-deploynewapp-registerpackage");

        // Package elements
        var packagedAppElement = rootOverlay.querySelector("#xboxdeployment-deploynewapp-packagefile");

        var packageAppElementEra = rootOverlay.querySelector("#xboxdeployment-deploynewapp-packagefile-era");

        // Loose elements
        var looseAppElement = rootOverlay.querySelector("#xboxdeployment-deploynewapp-looseappfiles");
        var looseAppFolderElement = rootOverlay.querySelector("#xboxdeployment-deploynewapp-looseappfolder");

        var looseAppSourceFolderEra = rootOverlay.querySelector("#xboxdeployment-deploynewapp-looseappfolder-era-source");
        var looseAppDestFolderElementEra = rootOverlay.querySelector("#xboxdeployment-deploynewapp-looseappfolder-era");

        // Network elements
        var networkShareElement = rootOverlay.querySelector("#xboxdeployment-deploynewapp-networkshare");

        // Register elements
        var registerFolderList = rootOverlay.querySelector("#xboxdeployment-deploynewapp-registerfolderlist");

        // Register package elements
        var registerPackageList = rootOverlay.querySelector("#xboxdeployment-deploynewapp-registerpackagelist");

        var errorLabel = rootOverlay.querySelector("#xboxdeployment-deploynewapp-errorlabel");

        errorLabel.innerHTML = "";

        var validFilename = new RegExp(/^[a-z0-9_-\s]+$/gi);

        Wdp.Utils._showProgress(rootOverlay);

        if (installOption.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "install");
            }
            // Do packaged install
            _packageFile = false;

            if (packagedAppElement && packagedAppElement.files && packagedAppElement.files.length > 0) {
                _packageFile = packagedAppElement.files[0];
            } else if (packagedAppElement && packagedAppElement.packageFile) {
                // Some browsers make files read-only so it isn't updated with drag/drop.
                // Check this property instead to support them.
                _packageFile = packagedAppElement.packageFile;
            }

            if (_packageFile) {
                if (_packageFile.name.toLowerCase().indexOf(".appx") === -1 &&
                    _packageFile.name.toLowerCase().indexOf(".msix") === -1) {
                    // Note: If XVCs are ever supported 'in browser' instead of just protocol activated,
                    // make sure to change the file filter to not filter to msix.
                    // The XVC path will go here (they don't have a file extension so anything that isn't an msix
                    // will have to be assumed to be an XVC until we see otherwise).
                    // We also allow .appx for legacy reasons.
                    stayOnOverlay = true;
                    errorLabel.innerHTML = "Only MSIX packages are currently supported.";
                } else {
                    // The next step in installing an msix package is gathering dependencies.
                    showDependenciesPopup(true);
                }
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "Please select a packaged application.";
            }
        } else if (installOptionEra.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "installera");
            }
            if (packageAppElementEra && packageAppElementEra.value) { // XDK streaming
                setTimeout(function () {
                    showXdkDeploymentMessage();
                }, 200);

                // This will protocol activate the XDK to do the streaming install.
                var iframe = document.createElement("iframe");
                iframe.frameBorder = iframe.width = iframe.height = 0;
                document.body.appendChild(iframe);
                iframe.contentWindow.location = "xbox-dev-install://*PackageName*" + packageAppElementEra.value.split("\\").join("/") + "*Address*" + window.location.hostname;
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "Please specify the full path to an XVC package.";
            }
        } else if (looseOptionEra.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "looseera");
            }
            if (looseAppDestFolderElementEra.value) {
                _looseFilesDestinationFolder = looseAppDestFolderElementEra.value;

                if (validFilename.test(_looseFilesDestinationFolder)) {
                    if (looseAppSourceFolderEra && looseAppSourceFolderEra.value) { // XDK for file transfer

                        setTimeout(function () {
                            showXdkDeploymentMessage();
                        }, 200);

                        // This will protocol activate the XDK to do the deployment.
                        var iframe = document.createElement("iframe");
                        iframe.frameBorder = iframe.width = iframe.height = 0;
                        document.body.appendChild(iframe);
                        iframe.contentWindow.location = "xbox-dev-deploy://*Source*" + looseAppSourceFolderEra.value.split("\\").join("/") + "*Dest*" + _looseFilesDestinationFolder.split("\\").join("/") + "*Address*" + window.location.hostname;;
                    } else {
                        stayOnOverlay = true;
                        errorLabel.innerHTML = "Please specify the root folder with your loose app files.";
                    }
                } else {
                    stayOnOverlay = true;
                    errorLabel.innerHTML = "The destination folder should contain only characters which can be used for a folder name.";
                }
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "Please specify a folder name for the destination.";
            }
        } else if (looseOption.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "loose");
            }
            // Do loose copy + registration
            if (looseAppFolderElement.value) {
                _looseFilesDestinationFolder = looseAppFolderElement.value;

                if (validFilename.test(_looseFilesDestinationFolder)) {
                    if (looseAppElement && looseAppElement.files && looseAppElement.files.length > 0) {
                        _looseFiles = looseAppElement.files;
                        _looseFilesDestinationFolder = looseAppFolderElement.value;

                        // Find the AppXManifest.xml
                        var appFileIndex;
                        var appxmanifest = null;
                        var isEra = false;

                        var sourceFolders = _looseFiles[0].webkitRelativePath.split("/");
                        if (sourceFolders && sourceFolders[0]) {
                            var sourceRootFolder = sourceFolders[0];

                            var appFilesByFolder = {};
                            var folderList = [];
                            // Add app files
                            for (appFileIndex = 0; appFileIndex < _looseFiles.length; appFileIndex++) {

                                var filePath = _looseFiles[appFileIndex].webkitRelativePath;
                                var relativePath = filePath.substring(0, filePath.lastIndexOf("/"));

                                // Only look in the root folder.
                                if (relativePath === sourceRootFolder &&
                                    _looseFiles[appFileIndex].name.toUpperCase() === "APPXMANIFEST.XML") {
                                    appxmanifest = _looseFiles[appFileIndex];
                                    break;
                                }
                            }
                        }

                        if (appxmanifest) {
                            startLooseAppFlow(appxmanifest);
                        } else {
                            stayOnOverlay = true;
                            errorLabel.innerHTML = "Loose file deployment must contain an AppXManifest.xml file in the root folder.";
                        }
                    } else {
                        stayOnOverlay = true;
                        errorLabel.innerHTML = "Please select the root folder with your loose app files.";
                    }
                } else {
                    stayOnOverlay = true;
                    errorLabel.innerHTML = "The destination folder should contain only characters which can be used for a folder name.";
                }
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "Please specify a folder name for the destination.";
            }
        } else if (networkOption.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "network");
            }
            // Do Network registration.
            _networkSharename = networkShareElement.value;

            if (_networkSharename) {
                showInstallationProgress({ networkShare: true });
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "You must provide a network share folder to register.";
            }
        } else if (registerOption.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "register");
            }
            // Do Loose folder registration.
            var selectedFolder = registerFolderList.value;

            if (selectedFolder) {
                _folderToRegister = selectedFolder.replace("*", "");
                var isEra = _folderToRegister !== selectedFolder;
                showInstallationProgress({ isEra: isEra });
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "You must choose a folder to register which is already on the device.";
            }
        } else if (registerPackageOption.checked) {
            if (localStorage) {
                localStorage.setItem(lastDeployOptionLocalStorageKey, "registerpackage");
            }
            // Do package registration.
            var selectedPackage = registerPackageList.value;

            if (selectedPackage && selectedPackage.split(" ").length == 3) {
                showInstallationProgress({ registerPackageOnly: true, packageName: selectedPackage.split(" ")[0], driveValue: selectedPackage.split(" ")[1], aliasValue: selectedPackage.split(" ")[2] });
            } else if (selectedPackage && selectedPackage.split(" ").length == 2) {
                showInstallationProgress({ registerPackageOnly: true, packageName: selectedPackage.split(" ")[0], driveValue: selectedPackage.split(" ")[1] });
            } else {
                stayOnOverlay = true;
                errorLabel.innerHTML = "You must choose content to register which is already on the device.";
            }
        }

        Wdp.Utils._hideProgress(rootOverlay);

        if (!stayOnOverlay) {
            overlay._hide();
        }

        e.preventDefault();
        e.stopPropagation();
    };

    function startLooseAppFlow(appxmanifest) {

        determineIfPackageIsEra(appxmanifest)
            .done(function (data) {
                // Older browsers don't support JSON on the xhr so we'll
                // have to parse the result from plaintext here.
                if (data.IsEra === undefined) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        // Do nothing. This must not be JSON.
                    }
                }

                if (data.IsEra) {
                    showInstallationProgress({ isEra: true, doCopy: true });
                } else {
                    showDependenciesPopup(false);
                }
            })
            .fail(function (data) {
                Xbox.Utils._showError(data);
            });
    };

    function determineIfPackageIsEra(appxmanifest) {

        var deferred = $.Deferred();

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 202) {
                    deferred.resolve(this.response, this.statusText, this.status);
                } else {
                    deferred.reject(this.response, this.statusText, this.status);
                }
            }
        };

        var form_data = new FormData();

        // add package
        form_data.append(appxmanifest.name, appxmanifest);

        xhr.open('post', "/ext/app/packagemanager/era/check", true);
        try {
            xhr.responseType = "json";
        } catch (e) {
            // Do nothing. Some older browsers don't support json as a response type.
        }
        xhr.send(form_data);

        return deferred;
    };

    function registerNetworkShare(networkshare, username, password) {
        var deferred = $.Deferred();

        var requestBody = { username: username, password: password };
        var params = { networkshare: window.btoa(networkshare) };

        var url = "/ext/app/packagemanager/era/registernetwork?" + $.param(params)
        $.ajax({ url: url, cache: false, type: 'post', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
            .done(function (data, textStatus, error) {
                deferred.resolve(data.Folders);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data, error);
            });
        return deferred;
    };

    function registerPackagedApp(packageName, driveValue, aliasValue) {
        var deferred = $.Deferred();

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 202 || this.status == 204) {
                    deferred.resolve(this.response, this.statusText, this.status);
                } else {
                    deferred.reject(this.response, this.statusText, this.status);
                }
            }
        };

        var params = { packagefullname: window.btoa(packageName), deploydrive: driveValue };

        if (aliasValue) {
            params.packagealias = aliasValue;
        }

        xhr.open('post', "/ext/app/packagemanager/era/register?" + $.param(params), true);
        try {
            xhr.responseType = "json";
        } catch (e) {
            // Do nothing. Some older browsers don't support json as a response type.
        }

        xhr.send();

        return deferred;
    };

    function registerLooseApp(isEra, destinationFolder) {
        var deferred = $.Deferred();

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 202 || this.status == 204) {
                    deferred.resolve(this.response, this.statusText, this.status);
                } else {
                    deferred.reject(this.response, this.statusText, this.status);
                }
            }
        };

        var params = { folder: window.btoa(destinationFolder) };

        // ERA and UWP have a different endpoint.
        if (isEra) {
            xhr.open('post', "/ext/app/packagemanager/era/register?" + $.param(params), true);
        } else {
            xhr.open('post', "/api/app/packagemanager/register?" + $.param(params), true);
        }
        try {
            xhr.responseType = "json";
        } catch (e) {
            // Do nothing. Some older browsers don't support json as a response type.
        }

        xhr.send();

        return deferred;
    };

    function uploadLooseFolder(isEra, appParameters, progress, folderIndex, folderCount) {
        var depFileIndex;
        var appFileIndex;

        var deferred = $.Deferred();

        var xhr = new XMLHttpRequest();

        if (xhr.upload && progress) {
            xhr.upload.onprogress = function (e) {
                var done = e.loaded, total = e.total;
                progress(done, total, Math.floor(done / total * 1000) / 10, folderIndex, folderCount);
            };
        }
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 202) {
                    deferred.resolve(this.response, this.statusText, this.status);
                } else {
                    deferred.reject(this.response, this.statusText, this.status);
                }
            }
        };

        var form_data = new FormData();

        // Add app files
        for (appFileIndex = 0; appFileIndex < appParameters.appFiles.length; appFileIndex++) {
            form_data.append(appParameters.appFiles[appFileIndex].name, appParameters.appFiles[appFileIndex]);
        }

        // Add dependency files
        if (appParameters.dependencyFiles) {
            for (depFileIndex = 0; depFileIndex < appParameters.dependencyFiles.length; depFileIndex++) {
                form_data.append(appParameters.dependencyFiles[depFileIndex].name, appParameters.dependencyFiles[depFileIndex]);
            }
        }

        var params = { destinationFolder: window.btoa(appParameters.destinationFolder) };

        // ERA and UWP have a different endpoint.
        if (isEra) {
            xhr.open('post', "/ext/app/packagemanager/era/upload?" + $.param(params), true);
        } else {
            xhr.open('post', "/api/app/packagemanager/upload?" + $.param(params), true);
        }

        try {
            xhr.responseType = "json";
        } catch (e) {
            // Do nothing. Some older browsers don't support json as a response type.
        }
        xhr.send(form_data);

        return deferred;
    };

    // This function is recursive. It uploads each folder in folderList (including dependencyFiles with the root folder)
    // and then it registers the app at the destination root folder.
    function uploadFolderAndRegisterAppIfLast(isEra, destRootFolder, sourceRootFolder, index, folderList, appFilesByFolder, dependencyFiles) {

        if (_isCancelled) {
            return;
        }

        if (!folderList || index >= folderList.length) {
            updateDeploymentText("Registering...");
            registerLooseApp(isEra, destRootFolder)
                .done(function () {
                    if (isEra) {
                        // Era Registration blocks until complete.
                        showStatusMessage(true);
                    } else {
                        pollForInstallComplete();
                    }
                })
                .fail(function (data) {
                    Xbox.Utils._showError(data);
                });
        } else if (folderList[index] === sourceRootFolder) {
            uploadLooseFolder(isEra, { appFiles: appFilesByFolder[sourceRootFolder], dependencyFiles: dependencyFiles, destinationFolder: destRootFolder }, uploadProgress, index, folderList.length)
                .done(function () {
                    uploadFolderAndRegisterAppIfLast(isEra, destRootFolder, sourceRootFolder, index + 1, folderList, appFilesByFolder, dependencyFiles);
                })
                .fail(function (data) {
                    Xbox.Utils._showError(data);
                });
        } else {
            var destFolder = folderList[index].replace(sourceRootFolder, destRootFolder);

            uploadLooseFolder(isEra, { appFiles: appFilesByFolder[folderList[index]], destinationFolder: destFolder }, uploadProgress, index, folderList.length)
                .done(function () {
                    uploadFolderAndRegisterAppIfLast(isEra, destRootFolder, sourceRootFolder, index + 1, folderList, appFilesByFolder, dependencyFiles);
                })
                .fail(function (data) {
                    Xbox.Utils._showError(data);
                });
        }
    };

    function initAvailableStorageDevices() {
        $.ajax({
            url: "/ext/settings/DefaultStorageDevice",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data, textStatus, error) {
            _availableStorageDevices = data.Options;
        })
        .fail(function (data, textStatus, error) {
            if (data.readyState === 4 && data.status === 404) {
                console.log(data);
            } else {
                Xbox.Utils._showError(data);
            }
        });
    };

    function init() {

        if (localStorage) {
            var storedInstallIds = localStorage.getItem(installIdMapLocalStorageKey);

            if (storedInstallIds) {
                try {
                    _installIdMap = JSON.parse(storedInstallIds);
                } catch (e) { }
            }
        }

        _layoutRoot = document.getElementById("wdp-xbox-launcher");

        _isRetailOrSraDevkit = true;
        var deployButton = document.getElementById("wdp-xbox-launcher-deploycommand");
        $.ajax({
            url: "/ext/xbox/info",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data) {
            if (data.DevMode !== "Universal Windows App Devkit" && data.DevMode !== "Shared Resource Devkit") {
                _isRetailOrSraDevkit = false;
            }
        })
        .always(function (data) {
            // Tie up the event listener to our Add App button as soon as this call is complete.
            deployButton.addEventListener("click", handleAddNewApp, false);
        });

        var appsTableColumns = [
            { id: "Name", name: "Name", field: "Name", width: 185, cssClass: "tableCell tableTextColumn launcherFieldName", headerCssClass: "tableHeader", sortable: true, formatter: appNameFormatter },
            { id: "PackageFullName", name: "Package Full Name", field: "PackageFullName", width: 400, cssClass: "tableCell tableTextColumn", sortable: true, headerCssClass: "tableHeader" },
            { id: "Aumid", name: "AUMID", field: "PackageRelativeId", width: 365, cssClass: "tableCell tableTextColumn launcherFieldAUMID", sortable: true, headerCssClass: "tableHeader" },
            { id: "State", name: "State", field: "PackageRelativeId", width: 175, cssClass: "tableCell tableTextColumn launcherFieldState", headerCssClass: "tableHeader", formatter: suspendResumeFormatter },
            { id: "Actions", name: "Actions", field: "IsRunning", width: 160, cssClass: "tableCell tableSelectColumn launcherFieldActions", headerCssClass: "tableHeader", formatter: actionsFormatter },
        ];

        var appsTableOptions = {
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

        _dataView = new Slick.Data.DataView();
        _appsGrid = new Slick.Grid("#wdp-xbox-launcher-appslist", _dataView, appsTableColumns, appsTableOptions);

        window.addEventListener("resize", _appsGrid.resizeCanvas.bind(_appsGrid), false);

        _dataView.onRowCountChanged.subscribe(onRowCountChanged.bind(this));
        _dataView.onRowsChanged.subscribe(onRowsChanged.bind(this));
        _appsGrid.onSort.subscribe(onSort.bind(this));
        _appsGrid.setSortColumn("PackageRelativeId", true);

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

        _socket.addEventListener("message", handleProcessesSocketOnMessage, false);
        window.addEventListener("beforeunload", dispose, false);

        // Init available storage devices for non-UWP devkits.
        Xbox.Utils.GetXboxInfoAsync()
            .then(function success(data) {
                if (data.DevMode !== "Universal Windows App Devkit") {
                    initAvailableStorageDevices();
                }
            });

        refreshAppsList();
        _refreshAppsListTimerCookie = setInterval(refreshAppsList, _REFRESH_APPS_POLLING_INTERVAL);

        refreshRunningTitle();
        _refreshRunningTitleTimerCookie = setInterval(refreshRunningTitle, _REFRESH_APPS_POLLING_INTERVAL);
    };

    function dispose() {
        clearInterval(_refreshAppsListTimerCookie);
        clearInterval(_refreshAppMoveProgressTimerCookie);
        clearInterval(_refreshRunningTitleTimerCookie);
        _socket.close();
    };

    function AddToFilteredApps(app) {

        if (!app.IsInFilteredList) {
            app.IsInFilteredList = true;
            _filteredAppList.push(app);
        }
    }

    function RemoveFromFilteredApps(app) {

        if (app.IsInFilteredList) {
            app.IsInFilteredList = false;

            // Remove this app from our list.
            for (var i = 0; i < _filteredAppList.length; ++i) {
                if (_filteredAppList[i].PackageFullName === app.PackageFullName) {
                    _filteredAppList.splice(i, 1);
                    break;
                }
            }
        }
    }

    function updateAppListProcessInfo(processes) {
        var dirty = false;

        // Iterate through all apps to check their running state.
        for (var i = 0, len = _appList.length; i < len; ++i) {
            var foundApp = false;

            // First check if we have a running title that matches this PFN. We don't
            // need to check the process list (which won't contain Game Core) if this
            // is true.
            if (_runningTitlePfn && _runningTitlePfn === _appList[i].PackageFullName)
            {
                foundApp = true;
                if (!_appList[i].IsRunning) {
                    _appList[i].IsRunning = true;

                    if (_appList[i].IsInFilteredList) {
                        dirty = true;
                    }
                }
            }
            else
            {
                // Iterate through all processes to find this app.
                for (var j = 0, len2 = processes.length; j < len2; ++j) {
                    var process = processes[j];
                    if (process.PackageFullName === _appList[i].PackageFullName) {
                        foundApp = true;
                        if (_appList[i].IsRunning !== process.IsRunning) {
                            _appList[i].IsRunning = process.IsRunning;

                            if (_appList[i].IsInFilteredList) {
                                dirty = true;
                            }
                        }
                        break;
                    }
                }
            }

            // If we didn't find this app, it must not be running.
            if (!foundApp) {
                if (_appList[i].IsRunning) {
                    _appList[i].IsRunning = false;
                    dirty = true;
                }
            }
        }

        // If the stub app just stopped or started running, make sure we add or remove it.
        if (_stubApp &&
            _stubApp.IsInFilteredList !== _stubApp.IsRunning) {

            if (_stubApp.IsRunning) {
                AddToFilteredApps(_stubApp);
            } else {
                RemoveFromFilteredApps(_stubApp);
            }
            dirty = true;
        }

        renderAndUpdateAppActions(dirty);
    };

    function handleProcessesSocketOnMessage(messageEvent) {
        var processData = JSON.parse(messageEvent.data);
        updateAppListProcessInfo(processData.Processes);
    };

    init();
})();
//# sourceURL=tools/XboxAppLauncher/XboxAppLauncher.js