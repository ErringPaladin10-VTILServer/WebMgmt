(function workspaceInit() {

    "use strict"

    // Add any new tools to toolhost.js as well with a GUID in case we ever decide
    // to host them in another tool.

    // These lists should be sorted alphabetically by name.

    var nonRetailDevModeTools = [
    {
        name: "Game event data",
        uri: "tools/GameEventData/GameEventData.htm"
    },
    {
        name: "Remote front panel",
        uri: "tools/XboxRemoteFrontPanel/XboxRemoteFrontPanel.htm"
    },
    {
        name: "Update console OS recovery",
        uri: "tools/XboxRemoteRecovery/XboxRemoteRecovery.htm"
    }, {
        name: "Xbox automation",
        uri: "tools/XboxUnattendedSetup/XboxUnattendedSetup.htm"
    }, {
        name: "Xbox network",
        uri: "tools/XboxNetwork/XboxNetwork.htm"
    }, {
        name: "Xbox unattended settings",
        uri: "tools/XboxUnattendedSetup/XboxUnattendedSettings.htm"
    }];

    var XboxOneXDevkitTools = [];

    var tools = [{
        name: "Audio settings",
        uri: "tools/XboxAudioSettings/XboxAudioSettings.htm"
    }, {
        name: "Available networks",
        uri: "tools/AvailableNetworks/AvailableNetworks.htm"
    }, {
        name: "Change sandbox",
        uri: "tools/XboxLiveSandbox/XboxLiveSandbox.htm"
    }, {
        name: "Crash data",
        uri: "tools/XboxCrashData/XboxCrashData.htm"
    }, {
        name: "Crash dumps",
        uri: "tools/XboxCrashDumps/XboxCrashDumps.htm"
    }, {
        name: "Debug settings",
        uri: "tools/XboxDebugSettings/XboxDebugSettings.htm"
    }, {
        name: "Device information",
        uri: "tools/XboxDeviceInfo/XboxDeviceInfo.htm"
    }, {
        name: "Display settings",
        uri: "tools/XboxDisplaySettings/XboxDisplaySettings.htm"
    }, {
        name: "Fiddler tracing",
        uri: "tools/Fiddler/Fiddler.htm"
    }, {
        name: "File explorer",
        uri: "tools/FileExplorer/FileExplorer.htm"
    }, {
        name: "File IO performance",
        uri: "tools/IOPerformance/IOPerformance.htm"
    }, {
        name: "Game Streaming settings",
        uri: "tools/XboxGameStreamingSettings/XboxGameStreamingSettings.htm"
    }, {
        name: "HTTP monitor",
        uri: "tools/XboxHttpMonitor/XboxHttpMonitor.htm"
    }, {
        name: "IP Configuration",
        uri: "tools/IPConfiguration/IPConfiguration.htm"
    }, {
        name: "Legacy settings",
        uri: "tools/XboxLegacySettings/XboxLegacySettings.htm"
    }, {
        name: "Localization settings",
        uri: "tools/XboxLocalizationSettings/XboxLocalizationSettings.htm"
    }, {
        name: "Manage network credentials",
        uri: "tools/XboxNetworkCredentials/XboxNetworkCredentials.htm"
    }, {
        name: "Media capture",
        uri: "tools/XboxMediaCapture/XboxMediaCapture.htm"
    }, {
        name: "My games & apps",
        uri: "tools/XboxAppLauncher/XboxAppLauncher.htm"
    }, {
        name: "Network settings",
        uri: "tools/XboxNetworkSettings/XboxNetworkSettings.htm"
    }, {
        name: "Overall system CPU performance",
        uri: "tools/CpuPerformance/CpuPerformance.htm"
    }, {
        name: "Overall system GPU performance",
        uri: "tools/GPUPerformance/GPUPerformance.htm"
    }, {
        name: "Overall system memory performance",
        uri: "tools/MemoryPerformance/MemoryPerformance.htm"
    }, {
        name: "Overall system network performance",
        uri: "tools/NetworkPerformance/NetworkPerformance.htm"
    }, {
        name: "Power settings",
        uri: "tools/XboxPowerSettings/XboxPowerSettings.htm"
    }, {
        name: "Preference settings",
        uri: "tools/XboxPreferenceSettings/XboxPreferenceSettings.htm"
    }, {
        name: "Running app CPU performance",
        uri: "tools/XboxRunningAppCpuPerformance/XboxRunningAppCpuPerformance.htm"
    }, {
        name: "Running app list",
        uri: "tools/RunningApps/RunningApps.htm"
    }, {
        name: "Running app memory usage",
        uri: "tools/XboxRunningAppMemoryPerformance/XboxRunningAppMemoryPerformance.htm"
    }, {
        name: "User settings",
        uri: "tools/XboxUserSettings/XboxUserSettings.htm"
    }, {
        name: "UWP streaming install debugger",
        uri: "tools/StreamingInstallDebugger/StreamingInstallDebugger.htm"
    }, {
        name: "Wifi adapters",
        uri: "tools/WifiAdapters/WifiAdapters.htm"
    }, {
        name: "Xbox Live game saves",
        uri: "tools/XblGameSave/XblGameSave.htm"
    }, {
        name: "Xbox Live status",
        uri: "tools/XboxLiveStatus/XboxLiveStatus.htm"
    }, {
        name: "Xbox Live test accounts",
        uri: "tools/XboxLiveTestAccounts/XboxLiveTestAccounts.htm"
    }, {
        name: "Visual Studio settings",
        uri: "tools/XboxVsSettings/XboxVsSettings.htm"
    }];

    var nonRetailDevModeWorkspaceElements = [
        {
            // This has the same id as the Media capture element for Retail Devkits
            // Our merge code will cause it to replace that workspace, so changes made there
            // that should also be on regular Devkits need to be made in both places.
            id: "{34EA280C-B9D5-400D-9A3B-5AE4AB009357}",
            name: "Media capture",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Remote front panel",
                    uri: "tools/XboxRemoteFrontPanel/XboxRemoteFrontPanel.htm",
                    width: 100,
                    height: 35
                }, {
                    nodeType: "panel",
                    title: "Media capture",
                    uri: "tools/XboxMediaCapture/XboxMediaCapture.htm",
                    width: 100,
                    height: 65
                }]
            }]
        },
        {
            id: "{77D116AA-D99C-4DD0-A440-08B02FDF13B4}",
            name: "Automation",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Xbox automation",
                    uri: "tools/XboxUnattendedSetup/XboxUnattendedSetup.htm",
                    width: 100,
                    height: 80
                }, {
                    nodeType: "panel",
                    title: "Unattended script settings",
                    uri: "tools/XboxUnattendedSetup/XboxUnattendedSettings.htm",
                    width: 100,
                    height: 20
                }]
            }]
        },
        {
            id: "{7BD984BB-4072-442E-8D0A-E58D0D547E5F}",
            name: "OS update",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Update console OS recovery",
                    uri: "tools/XboxRemoteRecovery/XboxRemoteRecovery.htm",
                    width: 100,
                    height: 50
                }, {
                    nodeType: "panel",
                    title: "Manage network credentials",
                    uri: "tools/XboxNetworkCredentials/XboxNetworkCredentials.htm",
                    width: 100,
                    height: 50
                }]
            }]
        }
    ];

    var xboxOneXDevkitWorkspaceElements = [];
    var xboxKeyStoneToolsToRemove = [ // list of uri that shouldn't be shown for keystone
        "tools/XboxLegacySettings/XboxLegacySettings.htm",
        "tools/XboxMediaCapture/XboxMediaCapture.htm",
        "tools/XboxRemoteFrontPanel/XboxRemoteFrontPanel.htm",
        "tools/XboxGameStreamingSettings/XboxGameStreamingSettings.htm",
        "tools/XblGameSave/XblGameSave.htm", // NOTE: may come back when UWP XblGameSave is working
        "tools/XboxHttpMonitor/XboxHttpMonitor.htm",
        "tools/XboxCrashData/XboxCrashData.htm",
        "tools/XboxCrashDumps/XboxCrashDumps.htm",
        "tools/XboxUnattendedSetup/XboxUnattendedSetup.htm",
        "tools/XboxUnattendedSetup/XboxUnattendedSettings.htm",
        "tools/XboxNetworkCredentials/XboxNetworkCredentials.htm",
    ]; 
    var workspaceData = {
        workspaces: [
        {
            id: "{EC17131F-68D8-4428-AE9F-4C0514BA6F0E}",
            name: "Home",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "My games & apps",
                    uri: "tools/XboxAppLauncher/XboxAppLauncher.htm",
                    width: 100,
                    height: 50
                }, {
                    nodeType: "panel",
                    title: "Xbox Live test accounts",
                    uri: "tools/XboxLiveTestAccounts/XboxLiveTestAccounts.htm",
                    width: 100,
                    height: 50
                }]
            }]
        },
        {
            id: "{2B34CC58-C2C0-4E0C-A505-CEA2CBCDA3D9}",
            name: "Xbox Live",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Sandbox",
                    uri: "tools/XboxLiveSandbox/XboxLiveSandbox.htm",
                    width: 100,
                    height: 8
                }, {
                    nodeType: "panel",
                    title: "Xbox Live status",
                    uri: "tools/XboxLiveStatus/XboxLiveStatus.htm",
                    width: 100,
                    height: 7
                }, {
                    nodeType: "panel",
                    title: "Xbox Live game saves",
                    uri: "tools/XblGameSave/XblGameSave.htm",
                    width: 100,
                    height: 85
                }]
            }]
        },
        {
            id: "{DD42EE1E-3F56-47A4-B454-6662D75FC777}",
            name: "File explorer",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "File explorer",
                    uri: "tools/FileExplorer/FileExplorer.htm",
                    width: 100,
                    height: 100
                }]
            }]
        },
        {
            id: "{AFC61B62-2B06-46EA-816D-47F8EB6B3DB5}",
            name: "Performance",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "horizontal",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "container",
                    flow: "vertical",
                    width: 40,
                    height: 100,
                    children: [{
                        nodeType: "stack",
                        flow: "vertical",
                        width: 100,
                        height: 50,
                        children: [{
                            nodeType: "panel",
                            title: "Running app CPU",
                            uri: "tools/XboxRunningAppCpuPerformance/XboxRunningAppCpuPerformance.htm",
                            width: 100,
                            height: 100
                        },
                        {
                            nodeType: "panel",
                            title: "Overall system CPU",
                            uri: "tools/CpuPerformance/CpuPerformance.htm",
                            width: 100,
                            height: 100
                        }]
                    }, {
                        nodeType: "stack",
                        flow: "vertical",
                        width: 100,
                        height: 50,
                        children: [{
                            nodeType: "panel",
                            title: "Running app memory",
                            uri: "tools/XboxRunningAppMemoryPerformance/XboxRunningAppMemoryPerformance.htm",
                            width: 100,
                            height: 100
                        }, {
                            nodeType: "panel",
                            title: "Overall system memory",
                            uri: "tools/MemoryPerformance/MemoryPerformance.htm",
                            width: 100,
                            height: 100
                        }]
                    }]
                }, {
                    nodeType: "container",
                    flow: "vertical",
                    width: 30,
                    height: 100,
                    children: [{
                        nodeType: "panel",
                        title: "Overall system file I/O",
                        uri: "tools/IOPerformance/IOPerformance.htm",
                        width: 100,
                        height: 50
                    }, {
                        nodeType: "panel",
                        title: "Overall system Network",
                        uri: "tools/NetworkPerformance/NetworkPerformance.htm",
                        width: 100,
                        height: 50
                    }]
                }, {
                    nodeType: "panel",
                    title: "Overall system GPU",
                    uri: "tools/GPUPerformance/GPUPerformance.htm",
                    width: 30,
                    height: 100
                }]
            }]
        },
        {
            id: "{33C9D1D7-5A39-4A90-9896-F76A54616D72}",
            name: "HTTP monitor",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "horizontal",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "HTTP monitor",
                    uri: "tools/XboxHttpMonitor/XboxHttpMonitor.htm",
                    width: 100,
                    height: 100
                }]
            }]
        },
        {
            id: "{3B4F41F3-AB63-4E15-A041-B4F61437BFA8}",
            name: "Network",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "horizontal",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "container",
                    flow: "vertical",
                    width: 66.666,
                    height: 100,
                    children: [{
                        nodeType: "panel",
                        title: "Available networks",
                        uri: "tools/AvailableNetworks/AvailableNetworks.htm",
                        width: 100,
                        height: 52
                    }, {
                        nodeType: "panel",
                        title: "Fiddler tracing",
                        uri: "tools/Fiddler/Fiddler.htm",
                        width: 100,
                        height: 48
                    }]
                }, {
                    nodeType: "panel",
                    title: "IP configuration",
                    uri: "tools/IPConfiguration/IPConfiguration.htm",
                    width: 33.333,
                    height: 100
                }]
            }]
        },
        {
            // Note: This workspace is replaced on Xbox One X Devkits so any changes
            // which need to apply to all devkit types need to be made in that devkit's
            // workspace definition as well.
            id: "{34EA280C-B9D5-400D-9A3B-5AE4AB009357}",
            name: "Media capture",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "horizontal",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Media capture",
                    uri: "tools/XboxMediaCapture/XboxMediaCapture.htm",
                    width: 100,
                    height: 100
                }]
            }]
        },
        {
            id: "{BAF8879F-14CA-4E8F-97D2-4CCDD5415950}",
            name: "Crash data",
            version: 2.3,
            editable: false,
            data: [{
                nodeType: "container",
                flow: "vertical",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Crash data",
                    uri: "tools/XboxCrashData/XboxCrashData.htm",
                    width: 100,
                    height: 50
                }, {
                    nodeType: "panel",
                    title: "Crash dumps",
                    uri: "tools/XboxCrashDumps/XboxCrashDumps.htm",
                    width: 100,
                    height: 50
                }]
            }]
        },
        {
            id: "{C22700E0-7D54-4DE8-BA5F-32B426BB13C8}",
            name: "Settings",
            version: 2.3,
            data: [{
                nodeType: "container",
                flow: "horizontal",
                width: 100,
                height: 100,
                children: [{
                    nodeType: "panel",
                    title: "Settings",
                    uri: "tools/XboxSettings/XboxSettings.htm",
                    width: 100,
                    height: 100
                }]
            }]
        }, {
            id: "{F8FD92CF-21CF-42F5-8ACD-7F3F54D110EC}",
            name: "Scratch",
            editable: true,
            data: []
        }]
    };

    /*
     * Unused for now until device cert is fixed.
     *
    var extraSettings = [{
        name: "Device Certificate",
        uri: "menu/devicecert/devicecert.htm"
    }];
    */

    // Assumes both arrays are sorted in case-insensitive alphabetical order by name.
    function mergeArraysAlphabetically(targetArray, sourceArray) {
        var targetIndex = 0;
        var sourceIndex = 0;

        while (targetIndex < targetArray.length && sourceIndex < sourceArray.length)
        {
            if (sourceArray[sourceIndex].name.toLowerCase() < targetArray[targetIndex].name.toLowerCase()) {
                targetArray.splice(targetIndex, 0, sourceArray[sourceIndex]);
                sourceIndex++;
            }
            targetIndex++
        }

        while (sourceIndex < sourceArray.length) {
                targetArray.push(sourceArray[sourceIndex]);
                sourceIndex++;
        }
    }

    function removeHiddenTool(workspaceChildren, hiddenUris) {
        var newChildren = [];
        for (var i = 0; i < workspaceChildren.length; i++){
            var hideTool = false;
            for (var k = 0; k < hiddenUris.length; k++){
                if (workspaceChildren[i].nodeType === "panel") {
                    if (workspaceChildren[i].uri == hiddenUris[k]) {
                        hideTool = true;
                        break;
                    }
                } else if ((workspaceChildren[i].children || []).length !== 0) {
                    workspaceChildren[i].children = removeHiddenTool(workspaceChildren[i].children, hiddenUris);
                    if (workspaceChildren[i].children.length === 0) {
                        hideTool = true;
                    }
                    break;
                }
            }
            if (!hideTool) {
                newChildren.push(workspaceChildren[i]);
            }
        }
        return newChildren;
    }

    function removeWorkspaceTools(workspaces, hiddenTools) {
        // search across the workspaces and remove each of the hiddenTools
        var outputWS = [];
        for (var i = 0; i < workspaces.length; i++){
            if ((workspaces[i].data || []).length > 0) {
                var c = removeHiddenTool(workspaces[i].data[0].children, hiddenTools);
                if ((c || []).length != 0) {
                    workspaces[i].data[0].children = c;
                    outputWS.push(workspaces[i]);
                }
            }
        }
        return outputWS;
    }

    $(document).ready(function () {
        var content = document.getElementById("wdp-content");
        content.innerHTML = "<h3>Loading...please wait.</h3>";

        Xbox.Utils.InitializeStatusBar();

        Xbox.Utils.GetXboxInfoAsync()
        .then(function success(data) {
            var mergedWorkspaceData = workspaceData;
            var mergedTools = tools;

            // Insert the non-retail devkit tools and workspace elements
            if (data.DevMode !== "Universal Windows App Devkit") {
                mergeArraysAlphabetically(mergedTools, nonRetailDevModeTools);

                // Replace any workspaces that have a non-Retail specific version
                for (var i = 0; i < mergedWorkspaceData.workspaces.length; ++i) {
                    for (var j = nonRetailDevModeWorkspaceElements.length - 1; j >= 0; --j) {
                        if (mergedWorkspaceData.workspaces[i].id === nonRetailDevModeWorkspaceElements[j].id) {
                            mergedWorkspaceData.workspaces[i] = nonRetailDevModeWorkspaceElements[j];
                            nonRetailDevModeWorkspaceElements.splice(j, 1);
                        }
                    }
                }

                // Insert anything left one from the end (just above Scratch).
                var insertIndex = mergedWorkspaceData.workspaces.length - 1;
                for (var i = 0; i < nonRetailDevModeWorkspaceElements.length; ++i) {
                    mergedWorkspaceData.workspaces.splice(insertIndex, 0, nonRetailDevModeWorkspaceElements[i]);
                    ++insertIndex;
                }

                // Insert the Xbox One X devkit specific elements
                if (data.ConsoleType === "Xbox One X Devkit") {
                    mergeArraysAlphabetically(mergedTools, XboxOneXDevkitTools);

                    // Replace any workspaces that have an Xbox One X specific version
                    for (var i = 0; i < mergedWorkspaceData.workspaces.length; ++i) {
                        for (var j = xboxOneXDevkitWorkspaceElements.length - 1; j >= 0; --j) {
                            if (mergedWorkspaceData.workspaces[i].id === xboxOneXDevkitWorkspaceElements[j].id) {
                                mergedWorkspaceData.workspaces[i] = xboxOneXDevkitWorkspaceElements[j];
                                xboxOneXDevkitWorkspaceElements.splice(j, 1);
                            }
                        }
                    }

                    // Insert anything left one from the end (just above Scratch).
                    insertIndex = mergedWorkspaceData.workspaces.length - 1;
                    for (var i = 0; i < xboxOneXDevkitWorkspaceElements.length; ++i) {
                        mergedWorkspaceData.workspaces.splice(insertIndex, 0, xboxOneXDevkitWorkspaceElements[i]);
                        ++insertIndex;
                    }
                }
            }
            if (data.ConsoleType === "Keystone") {
                var keystoneTools = [];
                // remove any tools not available for keystone
                for (var i = 0; i < mergedTools.length; ++i) {
                    var hideTool = false;
                    for (var j = xboxKeyStoneToolsToRemove.length - 1; j >= 0; --j) {
                        if (mergedTools[i].uri === xboxKeyStoneToolsToRemove[j]) {
                            hideTool = true;
                            break;
                        }
                    }
                    if (!hideTool) {
                        keystoneTools.push(mergedTools[i]);
                    }
                }
                mergedTools = keystoneTools;
                mergedWorkspaceData.workspaces = removeWorkspaceTools(mergedWorkspaceData.workspaces, xboxKeyStoneToolsToRemove);;
            }

            var workspaceManager = new Wdp.WorkspaceManager(content, mergedWorkspaceData);
            var menu = new Wdp.Menu(document.getElementById("wdp-menu"), {
                workspaceManager: workspaceManager,
                tools: mergedTools
            });
        })
        .fail(function success(data) {
            content.innerHTML = "<h3>Failed to initialize. If this error persists, try rebooting your console.</h3>";
        })
    });
})();
