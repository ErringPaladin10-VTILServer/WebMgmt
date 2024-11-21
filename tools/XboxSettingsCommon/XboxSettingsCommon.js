(function () {
    var requiresRebootAttribute = "data-requiresreboot";

    var _targetSettingElement;
    var _devkitType;

    // 15 seconds
    var CHECK_SETTINGS_INTERVAL = 15000;

    // 2 minutes
    var REBOOT_CHECK_SETTINGS_INTERVAL = 120000;

    Wdp = Wdp || {};
    Wdp.Utils = Wdp.Utils || {};
    Wdp.Utils.Xbox = Wdp.Utils.Xbox || {};
    Wdp.Utils.Xbox.Settings = Wdp.Utils.Xbox.Settings || {};

    if (!Wdp.Utils.Xbox.Settings.settingLabelsByDisplayCategory) {

        // settingLabelsByDisplayCategory determines the order the settings will be displayed in.
        Wdp.Utils.Xbox.Settings.settingLabelsByDisplayCategory = {
            audio:
                [
                    // Free-form & Dropdown
                    ["hdmiaudio", "HDMI audio"],
                    ["opticalaudio", "Optical audio"],
                    ["headsetformat", "Headset format"],
                    // Checkboxes
                    ["allowpassthrough", "Allow passthrough streams"],
                    ["monooutput", "Mono output"],
                    ["ishdaudiomutedwithheadset", "Speakers are muted if headset is plugged in"],
                    ["mutenavigations", "Mute navigation sounds"],
                    ["mutenotifications", "Mute notification sounds"]
                ],
            updates:
                [
                    // Free-form & Dropdown
                    ["osupdatepolicy", "OS recovery update policy"]
                ],
            localization:
                [
                    // Free-form & Dropdown
                    ["geographicregion", "Geographic region"],
                    ["preferredlanguages", "Preferred language(s)"],
                    ["timezone", "Time zone"]
                ],
            power:
                [
                    // Free-form & Dropdown
                    ["dimtimeout", "When idle, dim screen after (minutes)"],
                    ["shutdowntimeout", "When idle, turn off after"],
                    ["powermode", "Power mode"],
                    // Checkboxes
                    ["autoboot", "Automatically boot console when connected to power"],
                    ["usbselectivesuspend", "Enable USB selective suspend"],
                    ["alwayson", "Reboot the console on power down"],
                ],
            video:
                [
                    // Free-form & Dropdown
                    ["colordepth", "Color depth"],
                    ["colorspace", "Color space"],
                    ["tvresolution", "Display resolution"],
                    ["displayconnection", "Display connection"],
                    // Checkboxes
                    ["allowhdr", "Allow high dynamic range (HDR)"],
                    ["allow4k", "Allow 4K"],
                    ["allowvrr", "Allow Variable Refresh Rate (AMD FreeSync™)"],
                    ["allowycc", "Allow YCC 4:2:2"],
                    ["allowallm", "Allow auto low-latency mode (ALLM)"],
                    ["allowdolbyvision", "Allow Dolby Vision"],
                    ["allowdolbyvisiongaming", "Allow Dolby Vision for Gaming"]
                ],
            user:
                [
                    // Free-form & Dropdown
                    ["autosigninuser", "Auto sign in user"],
                    ["autosigninusercontrollerpairing", "Auto sign in user controller"],
                    // Checkboxes
                    ["headlessxuser", "Execute calls to XUserAddAsync without UI"]
                ],
            debug:
                [
                    // Free-form & Dropdown
                    ["extratitlememory", "Additional memory for title (MBs)"],
                    ["consolemode", "Console mode"],
                    ["crashdumptype", "Crash dump type"],
                    ["eragraphicsdrivermode", "Graphics driver mode"],
                    // Checkboxes
                    ["crashdumpupload", "Crash dump upload"],
                    ["enabledebugmemory", "Enable debug memory (profiling mode)"],
                    ["enableeventlimittoast", "Enable event limit toast alert setting"],
                    ["enablefastgamelaunch", "Enable fast game launch"],
                    ["enablevideocrashdumps", "Enable GameDVR recordings on game crashes"],
                    ["enablekerneldebugging", "Enable kernel debugging"],
                    ["enablepixmemory", "Enable PIX memory (profiling mode)"],
                    ["profilingmode", "Enable profiling mode (both debug and PIX memory)"],
                    ["titleperformanceoverlay", "Enable title performance overlay"],
                    ["toolingmemoryoverflow", "Tooling memory overflow"]
                ],
            legacy:
                [
                    // Free-form & Dropdown
                    ["debugmemorymode", "Debug memory mode (deprecated)"],
                    ["sragraphicsdrivermode", "SRA graphic driver mode"],
                    // Checkboxes
                    ["allowarbitrarycodegeneration", "Allow arbitrary code generation"],
                    ["kinectsensorenabled", "Enable Kinect"],
                    ["simulateversionswitch", "Force Kinect reload on app change"],
                    ["legacygpuperformancemode", "Legacy GPU performance mode"],
                    ["titlecompatoverride", "Override title compatibility cloud settings"]
                ],
            network:
                [
                    // Free-form & Dropdown
                    ["currentpreferredlocaludpmultiplayerportstate", "Current preferred local UDP multiplayer port state"],
                    ["desiredpreferredlocaludpmultiplayerport", "Desired preferred local UDP multiplayer port"],
                    ["networkinitdelayinseconds", "Network initialization delay in seconds"],
                    ["wirelessradiosettings", "Wireless radio settings"],
                    // Checkboxes
                    ["debugnicenable", "Enable debug NIC proxying"],
                    ["forceguestsmb", "Force \"Guest\" account access to file shares"]
                ],
            unattended:
                [
                    // Checkboxes
                    ["allowunattendscript", "Allow scripts"],
                    ["allowusbunattendscript", "Allow scripts from a USB drive"],
                    ["rununattendscriptimmediately", "Run scripts immediately on startup (removes cancellation option)"]
                ],
            storage:
                [
                    // Free-form & Dropdown
                    ["defaultstoragedevice", "Default storage device"],
                    ["runfrompcdatacachesizeingb", "Run from PC data cache maximum size in GB"],
                    // Checkboxes
                    ["enableinternalssd", "Enable internal SSD"],
                    ["enableunifiedscratch", "Enable unified scratch"],
                    ["enablerunfrompcdatacache", "Enable Run from PC data cache"]
                ],
            preferences:
                [
                    // Free-form & Dropdown
                    ["defaultapp", "Default home experience"],
                    // Checkboxes
                    ["allowxboxappconnections", "Allow connections from the Xbox app"],
                    ["autoacceptconsentprompts", "Automatically accept consent prompts"],
                    ["defaultuwpcontenttypetogame", "Treat UWP apps as games by default"]
                ],
            gamestreaming:
                [
                    // Free-form & Dropdown
                    ["gamestreamingserverlocation", "Game Streaming server location"],
                    // Checkboxes
                ],
            remote:
                [
                    // All coming from Simple Settings.
                ],
            devkitagent:
                [
                    // All coming from Simple Settings.
                ]
        };
    }

    if (!Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting) {
        Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting = {
            consolemode:
            {
                "xbox one x retail": "Xbox One X Test Mode",
                "xbox one x devkit": "Xbox One X Dev Kit Mode with 40 CUs",
                "xbox one x devkit with 44 cus": "Xbox One X Dev Kit Mode with 44 CUs",
                "xbox one s": "Xbox One S Test Mode",
                "xbox one": "Xbox One Test Mode",
// TODO: Final branding for Lockhart/Anaconda (TFS 23410665)
                "lockhart": "Lockhart Mode",
                "anaconda": "Anaconda Mode",
                "lockhartprofiling": "Lockhart Profiling Mode",
                "anacondaprofiling": "Anaconda Profiling Mode",
                "lockhart 40 gb" : "Lockhart 40 GB Mode",
                "scarlett 40 gb" : "Scarlett 40 GB Mode",
                "game streaming": "Game Streaming Server Test Mode"
            },
            shutdowntimeout:
            {
                none: "Never"
            },
            hdmiaudio:
            {
                51: "5.1 surround",
                71: "7.1 surround",
                dolbydigital: "Dolby Digital",
                dolbyatmos: "Dolby Atmos for home theater",
                dtsx: "DTS:X for home theater",
                headsetformat: "Headset Format"
            },
            opticalaudio:
            {
                dolbydigital: "Dolby Digital",
                headsetformat: "Headset Format"
            },
            headsetformat:
            {
                stereoheadset: "Stereo",
                windowssonicheadset: "Windows Sonic for Headphones",
                dolbyatmosheadset: "Dolby Atmos for Headphones",
                dtsxheadset: "DTS Headphone:X"
            },
            osupdatepolicy:
            {
                noupdate: "I install OS recovery updates manually",
                current: "Auto-install latest production OS recovery",
                preview: "Auto-install latest developer preview OS recovery",
                xboxonexpreview: "Auto-install the latest Xbox One X preview",
                scarlettpreview: "Auto-install the latest Game Core preview"
            }
        };

        Xbox.Utils.GetXboxInfoAsync()
            .then(function success(data) {
                if (data.ConsoleType) {
                    var defaultDescription = data.ConsoleType;

                    if (data.ConsoleType === "Xbox One X Devkit") {
                        defaultDescription += " Mode with 40 CUs";
                    } else {
                        defaultDescription += " Test Mode";
                    }

                    defaultDescription += " (Default)";

                    Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting["consolemode"]["default"] = defaultDescription;

                    // On a Scarlett devkit, Anaconda profiling is the default mode.
                    if (data.ConsoleType === "Scarlett Devkit") {
                        Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting["consolemode"]["anacondaprofiling"] += " (Default)";
                    }
                }
            });
    }

    if (!Wdp.Utils.Xbox.Settings.settingOptionDescriptionsBySetting) {
        Wdp.Utils.Xbox.Settings.settingOptionDescriptionsBySetting = {
            consolemode:
                {
                    "default": "Default console mode based on the current hardware.",
                    "xbox one x retail": "Constrains CPU, GPU and memory resources to resemble an Xbox One X retail console.",
                    "xbox one x devkit": "Xbox One X development kit with unconstrained CPU and memory resources.",
                    "xbox one x devkit with 44 cus": "Xbox One X development kit with unconstrained CPU, GPU (44 CUs) and memory resources.",
                    "xbox one s": "Constrains CPU, GPU and memory resources to resemble an Xbox One S retail console, but should not be considered an exact match for performance nor a replacement for testing on an Xbox One S.",
                    "xbox one": "Constrains CPU, GPU and memory resources to resemble an Xbox One retail console, but should not be considered an exact match for performance nor a replacement for testing on an Xbox One.",
// TODO: Final branding for Lockhart/Anaconda (TFS 23410665)
                    "lockhart": "Constrains CPU, GPU and memory resources to resemble a Lockhart retail console, but should not be considered an exact match for performance nor a replacement for testing on a Lockhart.",
                    "lockhartprofiling": "Constrains CPU, GPU and memory resources to resemble a Lockhart retail console, but with additional debug memory available.",
                    "anacondaprofiling": "Constrains CPU, GPU and memory resources to resemble an Anaconda retail console.",
                    "lockhart 40 gb": "Constrains CPU and GPU resources to resemble a Lockhart retail console, but with the full 40 GB of memory available to the Scarlett Devkit.",
                    "scarlett 40 gb" : "Scarlett development kit with unconstrained CPU, GPU, and memory resources.",
                    "game streaming": ""
                },
            osupdatepolicy:
                {
                    current: "Typically once a month",
                    preview: "Typically 2-3 times a week",
                    xboxonexpreview: "Typically once a month"
                },
            extratitlememory: "Increases title memory by decreasing tools memory and vice versa",
            forceguestsmb: "Some security policies may block file share access if this is enabled",
            gamestreamingserverlocation: "Simulate the data center location of the devkit as if it were a game streaming server. Meant for development/debugging purposes. Allows testing of code that queries the server location. Does not modify any network conditions."
        };

        Xbox.Utils.GetXboxInfoAsync()
            .then(function success(data) {
                if (data.ConsoleType) {
                    Wdp.Utils.Xbox.Settings.settingOptionDescriptionsBySetting["consolemode"]["default"] += " (" + data.ConsoleType + ")";
                }
            });
    }

    if (!Wdp.Utils.Xbox.Settings.settingNotification) {
        Wdp.Utils.Xbox.Settings.settingNotificationsBySetting = {
        };
    }

    if (!Wdp.Utils.Xbox.Settings.disabledSettingOptionsBySetting) {
        Wdp.Utils.Xbox.Settings.disabledSettingOptionsBySetting = {
        };
    }

    if (!Wdp.Utils.Xbox.Settings.settingDisabledTextBySetting) {
        Wdp.Utils.Xbox.Settings.settingDisabledTextBySetting = {
            allowvrr: "The current display does not support VRR",
            allowhdr: "The current display does not support HDR",
            allow4k: "The current display does not support 4K",
            allowycc: "This console hardware does not support YCC 4:2:2",
            allowallm: "The current display does not support ALLM",
            allowdolbyvision: "The current display does not support Dolby Vision",
            allowdolbyvisiongaming: "The current display does not support Dolby Vision for Gaming",
            simulateversionswitch: "A Kinect sensor is not connected to the console",
            allowusbunattendscript: "Unattended scripts must be allowed in order to run them from a USB drive",
            defaultstoragedevice: "Only one storage device was found. Attach an external SSD for additional deployment options.",
            profilingmode: "The currently selected Console Mode does not allow changing this setting.",
            extratitlememory: "Disabled when debug memory is disabled or the selected Console Mode does not allow extra title memory.",
            enabledebugmemory: "The currently selected Console Mode does not allow changing this setting.",
            enablepixmemory: "The currently selected Console Mode does not allow changing this setting.",
            enablerunfrompcdatacache: "The currently selected Console Mode does not allow changing this setting.",
            enablevideocrashdumps: "Disabled when crash dump type is set to None",
            runfrompcdatacachesizeingb: "The currently selected Console Mode does not allow changing this setting."
        };
    }

    if (!Wdp.Utils.Xbox.Settings.settingPartialSupportTextBySetting) {
        Wdp.Utils.Xbox.Settings.settingPartialSupportTextBySetting = {
            autoboot: "Some console hardware may not support automatically booting when connected to power."
        };
    }

    if (!Wdp.Utils.Xbox.Settings.displayCategoriesbyCategory) {
        Wdp.Utils.Xbox.Settings.displayCategoriesbyCategory = {
        };
    }

    if (!Wdp.Utils.Xbox.Settings.dependentSettingsBySetting) {
        Wdp.Utils.Xbox.Settings.dependentSettingsBySetting = {
            allowunattendscript: ["allowusbunattendscript"],
        };
    }

    if (!Wdp.Utils.Xbox.Settings.pendingChangesBySettingName) {
        Wdp.Utils.Xbox.Settings.pendingChangesBySettingName = {
        };
    }

    if (!Wdp.Utils.Xbox.Settings.settingPrereqHandlersBySetting) {
        Wdp.Utils.Xbox.Settings.settingPrereqHandlersBySetting = {
            osupdatepolicy: function(requiresReboot, changeSettingHandler){
                var params = { DesiredGroup: _targetSettingElement.value };
                var url = "/ext/update/check?" + $.param(params);
                $.ajax({
                    url: url,
                    contentType: "application/json",
                    type: "get",
                    cache: false
                })
                .done(function (data, textStatus, error) {
                    var response = JSON.parse(data);
                    if (response && response.IsDowngrade){
                        var dialog = new Wdp.Utils._showPopUp(
                            "Warning",
                            "Choosing this update policy will cause your console to automatically install an older OS version (" + response.VersionId + "). Are you sure you want to continue?",
                            {
                                label: "Yes",
                                callback: function () {
                                    Wdp.Utils._hideVisibleOverlays();
                                    changeSettingHandler(requiresReboot);
                                }
                            }, {
                                label: "No",
                                callback: function () {
                                    Wdp.Utils._hideVisibleOverlays();
                                    refreshSettingValues();
                                }
                            }
                        );
                    }
                    else if (response && response.IsUpgrade){
                        var dialog = new Wdp.Utils._showPopUp(
                            "Warning",
                            "Choosing this update policy will cause your console to automatically install a newer OS version (" + response.VersionId + "). Are you sure you want to continue?",
                            {
                                label: "Yes",
                                callback: function () {
                                    Wdp.Utils._hideVisibleOverlays();
                                    changeSettingHandler(requiresReboot);
                                }
                            }, {
                                label: "No",
                                callback: function () {
                                    Wdp.Utils._hideVisibleOverlays();
                                    refreshSettingValues();
                                }
                            }
                        );
                    }
                    else {
                        changeSettingHandler(requiresReboot);
                    }
                })
                .fail(function (data, textStatus, error) {
                    Xbox.Utils._showError(data);
                });
            }
        };
    }

    if (!Wdp.Utils.Xbox.Settings.settingPostQueryUpdaterBySetting) {
        Wdp.Utils.Xbox.Settings.settingPostQueryUpdaterBySetting = {
            osupdatepolicy: function(groupName, elementId){
                if (groupName.toLowerCase() === "noupdate"){
                    // Special case no-op noupdate to save the HTTP call
                    return;
                }
                var params = { DesiredGroup: groupName };
                var url = "/ext/update/check?" + $.param(params);
                $.ajax({
                    url: url,
                    contentType: "application/json",
                    type: "get",
                    cache: false
                })
                .done(function (data, textStatus, error) {
                    var response = JSON.parse(data);
                    if (response && response.VersionId){
                        // Update setting name with this versionId
                        var optionElement = document.getElementById(elementId);
                        optionElement.innerHTML += " (" + response.VersionId + ")";
                    }
                })
                .fail(function (data, textStatus, error) {
                    // Fail silently if we can't update with more info.
                });
            }
        };
    }

    function showLoadingAnimation() {
        $(".wdp-xbox-setting:not([data-load-init=true])").each(function () {
            Wdp.Utils._showProgress($(this).get()[0]);
            $(this).attr("data-load-init", true);
        });
    };

    function updateSettingValue(setting) {
        var settingDisplayCategory = Wdp.Utils.Xbox.Settings.displayCategoriesbyCategory[setting.Category.toLowerCase()];

        if (!settingDisplayCategory) {
            settingDisplayCategory = setting.Category.toLowerCase()
        }

        if (!Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[settingDisplayCategory]) {
            Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[settingDisplayCategory] = {};
        }

        Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[settingDisplayCategory][setting.Name.toLowerCase()] = setting;
    };

    function updateSetting(settingName) {
        $.ajax({
            url: "/ext/settings/" + settingName,
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data, textStatus, error) {
            updateSettingValue(data);
            refreshSettingValues();
        })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        });
    };

    function refreshSettings() {
        getSettings(true);
    };

    function handleToolUnloaded() {
        Wdp.Utils.Xbox.Settings.polling = false;
        window.removeEventListener("beforeunload", handleToolUnloaded);
        clearInterval(Wdp.Utils.Xbox.Settings.refreshSettingsTimerCookie);
    };

    function getSettings(refreshing) {
        $.ajax({
            url: "/ext/settings",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data, textStatus, error) {
            if (Wdp.Utils.Xbox.Settings.rebooting) {
                // Reload page to avoid 403 on put requests
                location.reload();
            }

            Wdp.Utils.Xbox.Settings.settingsByDisplayCategory = {};
            var settings = data.Settings;

            for (var i = 0, len = settings.length; i < len; i++) {
                updateSettingValue(settings[i]);
            }

            if (refreshing) {
                refreshSettingValues();
            }
            else {
                generateDOM();
            }
        })
        .fail(function (data, textStatus, error) {
            if (!refreshing) {
                Xbox.Utils._showError(data);
            }
        });

    }

    function startPolling() {
        if (!Wdp.Utils.Xbox.Settings.polling) {
            Wdp.Utils.Xbox.Settings.polling = true;
            Wdp.Utils.Xbox.Settings.refreshSettingsTimerCookie = setInterval(refreshSettings, CHECK_SETTINGS_INTERVAL);
            window.addEventListener("beforeunload", handleToolUnloaded, false);
        }
    }

    function areAllSettingsElementsExpanded() {

        var areAllItemsExpanded = true;
        $(".settings-category").each(function () {
            var rootElement = $(this).get()[0];

            if (rootElement) {

                var header = rootElement.querySelector(".wdp-xbox-setting-header");

                if (header && header.classList.contains('wdp-xbox-settings-minimized')) {
                    areAllItemsExpanded = false;
                }
            }
        });

        return areAllItemsExpanded;
    }

    function toggleSettingElement(rootElement, action) {
        var header = rootElement.querySelector(".wdp-xbox-setting-header");
        var setting = rootElement.querySelector(".wdp-xbox-setting");

        // If this isn't a command managed setting, see if it's an external managed setting.
        if (!setting) {
            setting = rootElement.querySelector(".wdp-xbox-setting-external");
        }

        if (header && setting) {

            if (action === "show") {
                header.classList.remove('wdp-xbox-settings-minimized');
                setting.style.display = "block";
            } else if (action === "hide") {
                header.classList.add('wdp-xbox-settings-minimized');
                setting.style.display = "none";
            } else if (action === "toggle") {
                if (header.classList.toggle('wdp-xbox-settings-minimized')) {
                    setting.style.display = "none";

                    // If we collapse something, ensure the option is to expand all.
                    var expandAllDiv = document.getElementById("wdp-xbox-expandcategories");
                    var collapseAllDiv = document.getElementById("wdp-xbox-collapsecategories");

                    if (collapseAllDiv && expandAllDiv) {
                        collapseAllDiv.style.display = "none";
                        expandAllDiv.style.display = "inline-flex";
                    }
                } else {
                    setting.style.display = "block";

                    // If we expand something it's harder, we have to check if it was the last
                    // collapsed thing and ensure the option changes to collapse all if so.
                    var expandAllDiv = document.getElementById("wdp-xbox-expandcategories");
                    var collapseAllDiv = document.getElementById("wdp-xbox-collapsecategories");

                    if (collapseAllDiv && expandAllDiv && areAllSettingsElementsExpanded()) {
                        collapseAllDiv.style.display = "inline-flex";
                        expandAllDiv.style.display = "none";
                    }
                }
            }
        }
    }

    function xboxSettingsControl() {

        showLoadingAnimation();

        // If this page has an export button, hook up the handler
        var exportSettingsButton = document.getElementById("wdp-xbox-exportsettings");
        if (exportSettingsButton) {
            exportSettingsButton.addEventListener("click", handleExportSettings, false);
        }

        // If this page has an import button, hook up the handler
        var importSettingsButton = document.getElementById("wdp-xbox-importsettings");
        var importSettingsFilepicker = document.getElementById("wdp-xbox-importsettingsfilepicker");
        if (importSettingsButton && importSettingsFilepicker) {

            importSettingsFilepicker.addEventListener("change", handleImportSettings, false);

            importSettingsButton.addEventListener(
                "click",
                function (e) {
                    importSettingsFilepicker.click();
                },
                false);
        }

        // Set up the expand/collapse all button
        var expandAllDiv = document.getElementById("wdp-xbox-expandcategories");
        var collapseAllDiv = document.getElementById("wdp-xbox-collapsecategories");

        
        function ExpandAllCategories() {
            $(".settings-category").each(function () {
                var rootElement = $(this).get()[0];

                if (rootElement) {

                    toggleSettingElement(rootElement, "show");

                    if (collapseAllDiv && expandAllDiv) {
                        collapseAllDiv.style.display = "inline-flex";
                        expandAllDiv.style.display = "none";
                    }
                }
            });
        }
        if (expandAllDiv) {
            expandAllDiv.addEventListener(
                "click",
                function (e) {
                    ExpandAllCategories();
                },
                false);
                expandAllDiv.addEventListener(
                    "keyup",
                    function (e) {
                        if (e.key  == 'Enter' || e.key  == 'Space') {
                            ExpandAllCategories();
                        }
                    },
                    false);
        }

        function CollapseAllCategories() {
            $(".settings-category").each(function () {
                var rootElement = $(this).get()[0];

                if (rootElement) {

                    toggleSettingElement(rootElement, "hide");

                    if (collapseAllDiv && expandAllDiv) {
                        collapseAllDiv.style.display = "none";
                        expandAllDiv.style.display = "inline-flex";
                    }
                }
            });
        }

        if (collapseAllDiv) {
            collapseAllDiv.addEventListener(
                "click",
                function (e) {
                    CollapseAllCategories();
                },
                false);
                collapseAllDiv.addEventListener(
                    "keyup",
                    function (e) {
                        if (e.key  == 'Enter' || e.key  == 'Space') {
                            CollapseAllCategories();
                        }
                    },
                    false);
        }

        // Set up the expand/collapse handler for each category
        $(".settings-category").each(function () {
            var rootElement = $(this).get()[0];
            if (rootElement) {
                var expandCollapseToggle = rootElement.querySelector(".wdp-xbox-setting-header");
                if (expandCollapseToggle) {
                    expandCollapseToggle.addEventListener("click",
                        function (e) {
                            toggleSettingElement(rootElement, "toggle");
                        },
                        false);
                        expandCollapseToggle.addEventListener("keyup",
                            function (e) {
                                if (e.key  == 'Enter' || e.key  == 'Space') {
                                    toggleSettingElement(rootElement, "toggle");
                                }
                            },
                            false);
                }
            }
        });

        if (!Wdp.Utils.Xbox.Settings.initialized) {
            Wdp.Utils.Xbox.Settings.initialized = true;
            Wdp.Utils.Xbox.Settings.ForceRefresh = refreshSettings;
            getSettings(false);
            startPolling();
            return;
        }

        if (Wdp.Utils.Xbox.Settings.settingsByDisplayCategory) {
            startPolling();
            generateDOM();
        }
    }

    function shouldDisableOption(setting, option) {
        var disabledOptions = Wdp.Utils.Xbox.Settings.disabledSettingOptionsBySetting[setting.Name.toLowerCase()];

        if (disabledOptions) {
            for (var i = 0, len = disabledOptions.length; i < len; i++) {
                if (option.toLowerCase() === disabledOptions[i]) {
                    return true;
                }
            }
        }

        return false;
    }

    function generateDOMForSetting(rootElement) {
        var hasSettings = false;
        var displayCategory = rootElement.getAttribute("data-wdp-xbox-setting-category");
        var targetSettings = rootElement.getAttribute("data-wdp-xbox-setting-target-settings");

        var settingsInCategoryByName = Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[displayCategory.toLowerCase()];
        var settingLabelsInCategory = Wdp.Utils.Xbox.Settings.settingLabelsByDisplayCategory[displayCategory.toLowerCase()];

        var postQueryUpdaters = [];

        if (settingsInCategoryByName && settingLabelsInCategory) {

            // Insert any 'Simple Setting' values in the appropriate alphabetical location
            for (var settingName in settingsInCategoryByName) {
                var setting = settingsInCategoryByName[settingName];
                if (setting.SimpleDisplayName) {
                    var inserted = false;
                    for (var i = 0, len = settingLabelsInCategory.length; i < len; ++i) {
                        var curSetting = settingsInCategoryByName[settingLabelsInCategory[i][0]];
                        if (curSetting) {
                            // If our setting isn't a bool, insert it as soon as it fits alphabetically, before the first bool.
                            if (setting.Type !== "Bool") {
                                if (curSetting.Type === "Bool" || settingLabelsInCategory[i][1].localeCompare(setting.SimpleDisplayName) > 0) {
                                    settingLabelsInCategory.splice(i, 0, [setting.Name.toLowerCase(), setting.SimpleDisplayName]);
                                    inserted = true;
                                    break;
                                }
                            // If our setting is a bool, insert it as soon as it fits in the bool settings.
                            } else if (curSetting.Type === "Bool" &&
                                       settingLabelsInCategory[i][1].localeCompare(setting.SimpleDisplayName) > 0) {
                                settingLabelsInCategory.splice(i, 0, [setting.Name.toLowerCase(), setting.SimpleDisplayName]);
                                inserted = true;
                                break;
                            }
                        }
                    }
                    if (!inserted) {
                        // add it at the end if there wasn't anything that came after it.
                        settingLabelsInCategory.splice(settingLabelsInCategory.length, 0, [setting.Name.toLowerCase(), setting.SimpleDisplayName]);
                    }
                }
            }

            var innerHtml = "";

            // Loop through the settings in the current category, create the DOM and set the values
            for (var i = 0, len = settingLabelsInCategory.length; i < len; ++i) {
                if (settingLabelsInCategory[i] && settingLabelsInCategory[i].length > 1) {
                    var settingName = settingLabelsInCategory[i][0];
                    var settingLabel = settingLabelsInCategory[i][1];
                    var setting = settingsInCategoryByName[settingName];

                    // If the HTML specifies only a subset of settings for this category, check if
                    // this is one of them.
                    if (targetSettings) {
                        var isDesiredSetting = false;
                        var targetSettingsArr = targetSettings.split(";");
                        for (var j = 0, len2 = targetSettingsArr.length; j < len2; ++j) {
                            if (targetSettingsArr[j] === settingName) {
                                isDesiredSetting = true;
                            }
                        }
                        if (!isDesiredSetting) {
                            continue;
                        }
                    }

                    if (setting) {
                        hasSettings = true;
                        var inputId = '"xboxsettings-' + setting.Name.toLowerCase() + '"';

                        if (setting.Type !== "Bool") {
                            innerHtml += '<div><label for=' + inputId + ' >' + settingLabel + '</label>';
                        } else {
                            innerHtml += '<div>';
                        }

                        var settingDescriptions = Wdp.Utils.Xbox.Settings.settingOptionDescriptionsBySetting[settingName];
                        if (setting.Type !== "Bool") {
                            innerHtml += '<div style="width:100%;display:inline;">';
                        }

                        if (setting.Type === "Text") {
                            innerHtml += '<input id=' + inputId + ' value="' + setting.Value + '" type="text"/>';
                        } else if (setting.Type === "Number") {
                            innerHtml += '<input id=' + inputId + ' value="' + setting.Value + '" type="number" min="' + setting.Min + '" max="' + setting.Max + '"/>';
                        } else if (setting.Type === "Select") {
                            innerHtml += '<select onkeydown="KeyCheck(id)" id=' + inputId + '>';

                            for (var j = 0, len2 = setting.Options.length; j < len2; j++) {
                                var option = setting.Options[j];

                                var optionDisplayText = undefined;

                                var optionDisplayTextForSetting = Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting[setting.Name.toLowerCase()];

                                if (optionDisplayTextForSetting) {
                                    optionDisplayText = optionDisplayTextForSetting[option.toLowerCase()];
                                }

                                if (!optionDisplayText) {
                                    optionDisplayText = option;
                                }

                                // Disable this option if it should be disabled.
                                var disabled = "";
                                if (shouldDisableOption(setting, option)) {
                                    disabled = "disabled";
                                }

                                var optionId = "wdp-xbox-settingOption-" + setting.Name + "-" + option;

                                innerHtml += '<option id="' + optionId + '" value="' + option + '" ' + disabled + '>' + optionDisplayText + '</option>';

                                // Add a post-query updater if needed (async function that will update the option string with more information as we receive it)
                                var settingValuePostQueryUpdater = Wdp.Utils.Xbox.Settings.settingPostQueryUpdaterBySetting[settingName];
                                if (settingValuePostQueryUpdater) {
                                    var updater = {Updater:settingValuePostQueryUpdater, Option:option, OptionId:optionId};
                                    postQueryUpdaters.push(updater);
                                }
                            }

                            innerHtml += '</select>';
                        } else if (setting.Type === "Bool") {
                            innerHtml += '<input id=' + inputId + ' type="checkbox" />' + '<label for=' + inputId + '>' + settingLabel + '</label>';
                        }

                        if (settingDescriptions) {
                            var settingDescriptionText = '';

                            if (typeof settingDescriptions === "string") {
                                settingDescriptionText = settingDescriptions;
                            }
                            else if (settingDescriptions[setting.Value.toLowerCase()]) {
                                settingDescriptionText = settingDescriptions[setting.Value.toLowerCase()];
                            }

                            if (setting.Type === "Bool") {
                                innerHtml += '</div><div>';
                            }

                            innerHtml += '<div class="wdp-xbox-settings-descriptionText" wdp-xbox-settings-descriptionSetting="' + setting.Name.toLowerCase() + '">' + settingDescriptionText + '</div></div>';
                        } else if (setting.Type !== "Bool") {
                            // Still need to close the div
                            innerHtml += '</div>';
                        }

                        innerHtml += '</div>';

                        if (setting.Disabled === "Yes") {
                            var disabledText = Wdp.Utils.Xbox.Settings.settingDisabledTextBySetting[setting.Name.toLowerCase()];

                            if (disabledText) {
                                innerHtml += '<div class="wdp-xbox-settings-disabledText" wdp-xbox-settings-disabledSetting="' + setting.Name.toLowerCase() + '">' + disabledText + '</div>';
                            }
                        }

                        if (setting.PartialSupport === "Yes") {
                            var partialSupportWarning = Wdp.Utils.Xbox.Settings.settingPartialSupportTextBySetting[setting.Name.toLowerCase()];

                            if (partialSupportWarning) {
                                innerHtml += '<div class="wdp-xbox-settings-disabledText" wdp-xbox-settings-disabledSetting="' + setting.Name.toLowerCase() + '">' + partialSupportWarning + '</div>';
                            }
                        }
                    }
                }
            }

            rootElement.innerHTML = innerHtml;

            for (var i = 0, len = rootElement.childNodes.length; i < len; i++) {
                var settingElement = rootElement.childNodes[i].querySelector("input, select");

                if (settingElement) {
                    var settingName = settingElement.id.replace("xboxsettings-", "");
                    var setting = settingsInCategoryByName[settingName];

                    if (setting) {
                        if (setting.Type === "Select") {
                            settingElement.value = setting.Value;
                        } else if (setting.Type === "Bool" && (setting.Value === "true")) {
                            settingElement.checked = true;
                        }

                        var requiresReboot = setting.RequiresReboot === "Yes";

                        var changePrereqHandler = Wdp.Utils.Xbox.Settings.settingPrereqHandlersBySetting[settingName];
                        addSettingsChangedHandler(settingElement, requiresReboot, changePrereqHandler);

                        if (setting.Disabled === "Yes") {
                            settingElement.disabled = true;
                        }
                    }
                }
            }

            // Start async calls to update any values that need more info post query.
            for (var i = 0; i < postQueryUpdaters.length; i++) {
                postQueryUpdaters[i].Updater(postQueryUpdaters[i].Option, postQueryUpdaters[i].OptionId);
            }
        }

        if (hasSettings) {
            var parentNode = rootElement.parentNode;

            if (parentNode && parentNode.className == "settings-category") {
                parentNode.setAttribute("data-containsSettings", true);
                parentNode.style.display = "block";
            }
        }

        Wdp.Utils._hideProgress(rootElement);

        rootElement.setAttribute("data-initialized", true);
    }

    function isDisplayCategoryHidden(data, displayCategory) {
        var hiddenCategories = [
            "debug",
            "legacy",
            "network",
            "remote",
            "gamestreaming",
            "storage",
            "unattended",
        ];
        if (data.ConsoleType === "Keystone") {
            for (var i = 0; i < hiddenCategories.length; ++i) {
                if (displayCategory == hiddenCategories[i]) {
                    return true;
                }
            }
        } 
        return false;
    }

    function generateDOM() {

        $(".wdp-xbox-setting:not([data-initialized=true])").each(function () {
            var rootElement = $(this).get()[0];

            var displayCategory = rootElement.getAttribute("data-wdp-xbox-setting-category");
            Xbox.Utils.GetXboxInfoAsync()
                .then(function success(data) {
                    if (!isDisplayCategoryHidden(data, displayCategory)) {
                        generateDOMForSetting(rootElement);
                    }
                });
        });
    }

    function updateSettingDescription(settingParentDiv, settingName, settingValue) {
        var descriptionTextElement = settingParentDiv.querySelector('.wdp-xbox-settings-descriptionText[wdp-xbox-settings-descriptionSetting=' + settingName.toLowerCase() + ']');
        if (descriptionTextElement) {
            var settingDescriptions = Wdp.Utils.Xbox.Settings.settingOptionDescriptionsBySetting[settingName.toLowerCase()];
            var settingDescriptionText = '';
            if (typeof settingDescriptions === "string") {
                settingDescriptionText = settingDescriptions;
                descriptionTextElement.innerHTML = settingDescriptionText;
            } else if (settingDescriptions[settingValue.toLowerCase()]) {
                settingDescriptionText = settingDescriptions[settingValue.toLowerCase()];
                descriptionTextElement.innerHTML = settingDescriptionText;
            } else {
                descriptionTextElement.innerHTML = "";
            }
        }
    }

    function refreshSettingValues() {
        $(".wdp-xbox-setting[data-initialized=true]").each(function () {
            var displayCategory = $(this).attr("data-wdp-xbox-setting-category");
            var rootElement = $(this).get()[0];

            var settingsInCategoryByName = Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[displayCategory.toLowerCase()];

            if (settingsInCategoryByName) {
                // Loop through the settings in the DOM, update their values
                for (var i = 0, len = rootElement.childNodes.length; i < len; i++) {
                    var settingElement = null;

                    // Handle removed wdp-xbox-settings-disabledText scenario.
                    if(rootElement.childNodes[i])
                    {
                        settingElement = rootElement.childNodes[i].querySelector("input, select");
                    }

                    if (settingElement) {
                        var settingName = settingElement.id.replace("xboxsettings-", "");
                        var setting = settingsInCategoryByName[settingName];

                        if (setting) {
                            // Only update setting if it is not being edited in UI
                            if (!Wdp.Utils.Xbox.Settings.pendingChangesBySettingName[setting]) {
                                if (settingElement.tagName === "SELECT") {

                                    if (setting.OptionsVariable === "Yes") {
                                        settingElement.options.length = 0;

                                        for (var j = 0, len2 = setting.Options.length; j < len2; j++) {
                                            var option = setting.Options[j];

                                            var optionDisplayText = undefined;

                                            var optionDisplayTextForSetting = Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting[setting.Name.toLowerCase()];

                                            if (optionDisplayTextForSetting) {
                                                optionDisplayText = optionDisplayTextForSetting[option.toLowerCase()];
                                            }

                                            if (!optionDisplayText) {
                                                optionDisplayText = option;
                                            }

                                            var optionElement = new Option()
                                            optionElement.text = optionDisplayText;
                                            optionElement.value = option;
                                            optionElement.disabled = shouldDisableOption(setting, option);
                                            settingElement.options.add(optionElement);
                                        }
                                    }

                                    settingElement.value = setting.Value;
                                } else if (settingElement.tagName === "INPUT") {
                                    if (settingElement.type === "text") {
                                        settingElement.value = setting.Value;
                                    } else if (settingElement.type === "number") {
                                        settingElement.value = Number(setting.Value);
                                    } else if (settingElement.type === "checkbox") {
                                        settingElement.checked = (setting.Value === "true");
                                    }
                                }

                                // Setting description
                                var parentDiv = settingElement.parentNode.parentNode;
                                updateSettingDescription(parentDiv, setting.Name, setting.Value);

                                // Disabled logic
                                var updatedDisabled = (setting.Disabled === "Yes");
                                if (settingElement.disabled != updatedDisabled) {
                                    if (updatedDisabled) {
                                        settingElement.disabled = true;

                                        var disabledText = Wdp.Utils.Xbox.Settings.settingDisabledTextBySetting[setting.Name.toLowerCase()];

                                        if (disabledText) {
                                            var divElement = document.createElement("div");
                                            divElement.className = "wdp-xbox-settings-disabledText";
                                            divElement.setAttribute("wdp-xbox-settings-disabledSetting", setting.Name.toLowerCase());
                                            divElement.textContent = disabledText;

                                            settingElement.parentNode.parentNode.insertBefore(divElement, settingElement.parentNode.nextSibling);
                                        }
                                    }
                                    else {
                                        var parentDiv = settingElement.parentNode.parentNode;
                                        var disabledTextElement = parentDiv.querySelector('.wdp-xbox-settings-disabledText[wdp-xbox-settings-disabledSetting=' + setting.Name.toLowerCase() + ']');
                                        if (disabledTextElement) {
                                            parentDiv.removeChild(disabledTextElement);
                                        }

                                        settingElement.disabled = false;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        });
    }

    function addSettingsChangedHandler(element, requiresReboot, changePrereqHandler) {
        var setting;
        var value;

        function changeSettingAsync(e) {
            _targetSettingElement = e.target;
            if (changePrereqHandler){
                return changePrereqHandler(requiresReboot, changeSettingInternalAsync);
            } else {
                return changeSettingInternalAsync(requiresReboot);
            }
        };

        if (element.tagName === "SELECT" ||
            element.tagName === "INPUT") {
            element.addEventListener("change", changeSettingAsync, false);
        }
    };

    function displaySettingNotification(settingName) {
        if (settingName) {
            var settingNotification = Wdp.Utils.Xbox.Settings.settingNotificationsBySetting[settingName.toLowerCase()];
            if (settingNotification) {
                var dialog = new Wdp.Utils._showPopUp(
                    settingNotification[0],
                    settingNotification[1]
                );
            }
        }
    };

    function refreshDependentSettings(settingData, settingName) {
        if (settingName) {
            var dependentSettings = Wdp.Utils.Xbox.Settings.dependentSettingsBySetting[settingName.toLowerCase()];
            if (dependentSettings && dependentSettings.length) {

                // Update this setting with the value we retrieved since we're
                // about to update the UI.
                updateSettingValue(settingData);

                for (var i = 0, len = dependentSettings.length; i < len; ++i) {
                    updateSetting(dependentSettings[i]);
                }
            }
        }
    };

    function rebootConsoleAsync() {
        $.post("/api/control/restart")
                .done(function () {
                    Wdp.Utils.Xbox.Settings.rebooting = true;
                    clearInterval(Wdp.Utils.Xbox.Settings.refreshSettingsTimerCookie);
                    Wdp.Utils.Xbox.Settings.refreshSettingsTimerCookie = setInterval(refreshSettings, REBOOT_CHECK_SETTINGS_INTERVAL);
                })
                .fail(function () {
                    var dialog = new Wdp.Utils._showPopUp(
                        "Error",
                        "Could not restart the target device."
                    );
                });
    }

    function changeSettingInternalAsync(requiresReboot) {
        var setting = _targetSettingElement.id.replace("xboxsettings-", "");
        var value;
        if (_targetSettingElement.type !== "checkbox") {
            value = _targetSettingElement.value;
        } else {
            value = _targetSettingElement.checked ? "True" : "False";
        }

        // Mark setting as being edited.
        Wdp.Utils.Xbox.Settings.pendingChangesBySettingName[setting] = true;

        $.ajax({
            url: "/ext/settings/" + setting,
            contentType: "application/json",
            type: "PUT",
            dataType: "json",
            data: JSON.stringify({ "Value": value })
        })
        .done(function (data) {
            refreshDependentSettings(data, setting);
            displaySettingNotification(setting);
            updateSettingDescription(_targetSettingElement.parentNode.parentNode, setting, value);

            if (requiresReboot) {
                var dialog = new Wdp.Utils._showPopUp(
                    "Restart",
                    "You need to restart the console for some settings to take effect.",
                    {
                        label: "Restart now",
                        callback: function () {
                            rebootConsoleAsync();
                            Wdp.Utils._hideVisibleOverlays();
                        }
                    }, {
                        label: "Later",
                        callback: Wdp.Utils._hideVisibleOverlays
                    }
                );
            }
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function () {
            // Mark setting as no longer being edited.
            if (Wdp.Utils.Xbox.Settings.pendingChangesBySettingName[setting]) {
                delete Wdp.Utils.Xbox.Settings.pendingChangesBySettingName[setting];
            }
        });
    };

    function handleExportSettings() {
        var link = document.createElement('a');
        link.href = "/ext/settings/export";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function handleImportReboot() {
        Wdp.Utils._hideVisibleOverlays();
        rebootConsoleAsync();
    }

    function handleImportSettings() {
        var elementRoot = document.getElementById("wdp-xbox-importsettingsdiv");
        var importSettingsFilepicker = document.getElementById("wdp-xbox-importsettingsfilepicker");
        if (elementRoot &&
            importSettingsFilepicker &&
            importSettingsFilepicker.files &&
            importSettingsFilepicker.files[0]) {

            Wdp.Utils._showProgress(elementRoot);

            doImportSettings(importSettingsFilepicker.files[0])
            .done(function (data) {
                // Prompt for reboot as we could have changed settings
                // which require it.
                var dialog = new Wdp.Utils._showPopUp(
                    "Restart",
                    "You need to restart the console for some settings to take effect.",
                    {
                        label: "Restart now",
                        callback: handleImportReboot
                    }, {
                        label: "Later",
                        callback: Wdp.Utils._hideVisibleOverlays
                    }
                );
            })
            .fail(function (data) {
                Xbox.Utils._showError(data);
            })
            .always(function (data) {
                Wdp.Utils._hideProgress(elementRoot);
            });
        }
    };

    function doImportSettings(settingsFile) {

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

        var form_data = new FormData();

        // add settings file
        form_data.append(settingsFile.name, settingsFile);

        xhr.open('post', "/ext/settings/import", true);
        xhr.send(form_data);

        return deferred;
    };

    xboxSettingsControl();
})();
//@ sourceURL=tools/XboxSettingsCommon/XboxSettingsCommon.js
