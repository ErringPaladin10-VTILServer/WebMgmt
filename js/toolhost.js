(function() {

    // These GUIDs are a backwards compatible contract.
    // Removing any of these will break existing tools.
    var tools = [];
    tools["{B27E555E-5961-4044-A456-6853908A4C07}"] = {
        name: "Audio settings",
        uri: "/tools/XboxAudioSettings/XboxAudioSettings.htm"
    };
    tools["{02BA121F-AE10-49F2-A6F8-3C5C45B48A84}"] = {
        name: "Available networks",
        uri: "/tools/AvailableNetworks/AvailableNetworks.htm"
    };
    tools["{A7AC7BFC-5305-47CE-9288-01D1A9F16A1B}"] = {
        name: "Change sandbox",
        uri: "/tools/XboxLiveSandbox/XboxLiveSandbox.htm"
    };
    tools["{461EACAC-D8B4-4A45-BCB2-93E809F68F41}"] = {
        name: "Crash data",
        uri: "/tools/CrashData/CrashData.htm"
    };
    tools["{D7D67AA0-A986-4787-9EF5-D458150640AB}}"] = {
        name: "Crash dumps",
        uri: "/tools/CrashDumps/CrashDumps.htm"
    };
    tools["dbgs"] = {
        name: "Debug settings",
        uri: "/tools/XboxDebugSettings/XboxDebugSettings.htm"
    };
    tools["{AB90792B-0343-4D06-BEE6-FF23A57B184B}"] = {
        name: "Device information",
        uri: "/tools/XboxDeviceInfo/XboxDeviceInfo.htm"
    };
    tools["{2433CDBD-5CBF-4CB2-A877-7F0ECB3BEF89}"] = {
        name: "Display settings",
        uri: "/tools/XboxDisplaySettings/XboxDisplaySettings.htm"
    };
    tools["{0EF985B5-94F7-41F0-94E5-B223B039CE9B}"] = {
        name: "Fiddler tracing",
        uri: "/tools/Fiddler/Fiddler.htm"
    };
    tools["{41F1744C-19AE-4104-BDEF-86DE23C40BAD}"] = {
        name: "File explorer",
        uri: "/tools/FileExplorer/FileExplorer.htm"
    };
    tools["{A17D9D84-6736-4CB3-A361-4FF32B6E6D82}"] = {
        name: "Game event data",
        uri: "/tools/GameEventData/GameEventData.htm"
    };
    tools["{7141EF83-5F49-4192-B88D-F0BB2FD4E673}"] = {
        name: "IO performance",
        uri: "/tools/IOPerformance/IOPerformance.htm"
    };
    tools["{6E88B241-2094-4182-AD4B-7CD0E1A7C7C2}"] = {
        name: "IP configuration",
        uri: "/tools/IPConfiguration/IPConfiguration.htm"
    };
    tools["{7987BE3A-7578-40E6-B613-7B78DC96460D}"] = {
        name: "Legacy settings",
        uri: "/tools/XboxLegacySettings/XboxLegacySettings.htm"
    };
    tools["{6CC9066F-50B9-432B-BBB5-23862D48C082}"] = {
        name: "Localization settings",
        uri: "/tools/XboxLocalizationSettings/XboxLocalizationSettings.htm"
    };
    tools["{9A3BA247-29FA-4F9B-870A-9D0910820012}"] = {
        name: "Manage network credentials",
        uri: "/tools/XboxNetworkCredentials/XboxNetworkCredentials.htm"
    };
    tools["{861CE4A8-4FA9-4B3F-9455-FC6EBB48B300}"] = {
        name: "Media capture",
        uri: "/tools/XboxMediaCapture/XboxMediaCapture.htm"
    };
    tools["{3E9497C0-AD12-4BC5-BB83-51AFA303B48A}"] = {
        name: "My games & apps",
        uri: "/tools/XboxAppLauncher/XboxAppLauncher.htm"
    };
    tools["{A0DAC9E5-268E-4F7A-84E5-17CA947994F4}"] = {
        name: "Network settings",
        uri: "/tools/XboxNetworkSettings/XboxNetworkSettings.htm"
    };
    tools["{E5F08997-1989-4DD8-AA78-5A972A613710}"] = {
        name: "Xbox network",
        uri: "/tools/XboxNetwork/XboxNetwork.htm"
    };
    tools["{D5A5FCA8-9DA2-4FD6-A3BE-D065219ECBF0}"] = {
        name: "Overall system CPU performance",
        uri: "/tools/CpuPerformance/CpuPerformance.htm"
    };
    tools["{81493974-BF70-42C3-8DE9-B2294FEEBF04}"] = {
        name: "Overall system GPU performance",
        uri: "/tools/GPUPerformance/GPUPerformance.htm"
    };
    tools["{B64D0E21-20C3-435F-88F0-BC0AD05212DD}"] = {
        name: "Overall system memory performance",
        uri: "/tools/MemoryPerformance/MemoryPerformance.htm"
    };
    tools["{83C5AF37-EB82-441F-9B3D-634258F09291}"] = {
        name: "Overall system network performance",
        uri: "/tools/NetworkPerformance/NetworkPerformance.htm"
    };
    tools["{F16A7969-73F1-49A2-8C1B-8EC076AD169B}"] = {
        name: "Power settings",
        uri: "/tools/XboxPowerSettings/XboxPowerSettings.htm"
    };
    tools["{36911CA2-EE25-4B20-B5D2-9D44C3133537}"] = {
        name: "Remote front panel",
        uri: "/tools/XboxRemoteFrontPanel/XboxRemoteFrontPanel.htm"
    };
    tools["{9FB53BEB-659D-4633-AA6D-84DB411CAC53}"] = {
        name: "Running app CPU performance",
        uri: "/tools/XboxRunningAppCpuPerformance/XboxRunningAppCpuPerformance.htm"
    };
    tools["{2C2A8E25-DC2A-41E7-82F7-44423A10CE30}"] = {
        name: "Running app list",
        uri: "/tools/RunningApps/RunningApps.htm"
    };
    tools["{8916FAD5-7C59-49B0-9A62-A20CB85CB50D}"] = {
        name: "Running app memory usage",
        uri: "/tools/XboxRunningAppMemoryPerformance/XboxRunningAppMemoryPerformance.htm"
    };
    tools["{82C5C206-22F6-41C7-90F3-2E437E7F3702}"] = {
        name: "Test accounts",
        uri: "/tools/XboxLiveTestAccounts/XboxLiveTestAccounts.htm"
    };
    tools["{104E9071-17F7-4564-9D6C-5FD0D8BA296D}"] = {
        name: "Update console OS recovery",
        uri: "/tools/XboxRemoteRecovery/XboxRemoteRecovery.htm"
    };
    tools["{466CBA0D-8FD3-4E0E-95E1-A29E61E137C4}"] = {
        name: "User settings",
        uri: "/tools/XboxUserSettings/XboxUserSettings.htm"
    };
    tools["{362277C6-2AEB-4CAB-A3BF-B9E545FC1519}"] = {
        name: "UWP streaming install debugger",
        uri: "/tools/StreamingInstallDebugger/StreamingInstallDebugger.htm"
    };
    tools["{FC016386-3901-45B1-9851-9F95E70BDDD2}"] = {
        name: "Wifi adapters",
        uri: "/tools/WifiAdapters/WifiAdapters.htm"
    };
    tools["{861214FE-25D1-4145-B8E5-1A7E20842CD7}"] = {
        name: "Wireless settings",
        uri: "/tools/XboxWirelessSettings/XboxWirelessSettings.htm"
    };
    tools["{2D763D0A-3D8D-4462-B5E6-4397C09DCB5D}"] =  {
        name: "Xbox Live game saves",
        uri: "/tools/XblGameSave/XblGameSave.htm"
    };
    tools["{77E36B3A-EBDD-4470-9BA7-D56640D8BEBA}"] = {
        name: "Xbox Live status",
        uri: "tools/XboxLiveStatus/XboxLiveStatus.htm"
    };
    tools["{23FEDD27-E692-4442-8ADA-C895A8337254}"] =  {
        name: "Xbox settings",
        uri: "/tools/XboxSettings/XboxSettings.htm"
    };
    tools["{D8A872F2-01AE-4A69-969F-E4E4CDFDB67D}"] =  {
        name: "Xbox unattended setup",
        uri: "/tools/XboxUnattendedSetup/XboxUnattendedSetup.htm"
    };
    tools["{AFB681CB-0BF1-43EB-A466-1D8DA9B2AA5B}"] = {
        name: "Xbox unattended settings",
        uri: "/tools/XboxUnattendedSetup/XboxUnattendedSettings.htm"
    };
    tools["{D59141BB-F5EA-4605-8D4C-5EB757A1D843}"] = {
        name: "Visual Studio settings",
        uri: "/tools/XboxVsSettings/XboxVsSettings.htm"
    };
    tools["{A5204FD4-6A20-4A9B-8AD6-0204555236CB}"] = {
        name: "Game Streaming settings",
        uri: "/tools/XboxGameStreamingSettings/XboxGameStreamingSettings.htm"
    };

    $().ready(function () {        
        var toolGuid = decodeURIComponent(location.hash.replace('#', ''));
        if (toolGuid)
        {
            var tool = tools[toolGuid];
            if (tool)
            {
                $("#root").load(tool.uri, function(response, status, xhr) {
                    if (status == "error")
                    {
                        alert("Error loading tool: " + tool.name);
                    }
                });
            }
            else
            {
                alert("Unknown tool: " + toolGuid);
            }
        }
        else
        {
            alert("Invalid tool guid: " + location.hash);
        }
    });
})();
