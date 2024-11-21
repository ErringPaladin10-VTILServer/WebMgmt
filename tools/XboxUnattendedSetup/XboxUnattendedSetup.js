(function () {

    var self = this;

    var actions;
    var actionGrid;

    automaticHostnameValue = "XB-%SerialNumber%";
    automaticHostnameFriendly = "[Automatically generated host name]";

    automaticEmailAddressValue = "XB-%SerialNumber%-%RANDOM%"
    automaticEmailAddressFriendly = "[Automatically generated email address]";

    var actionIdAttribute = "data-xboxunattendedsetup-actionid";

    var wdpPsuedoNamespace = "wdp-",
    unattendedSetupPsuedoNamespace = wdpPsuedoNamespace + "unattend-",
    cssClassPopup = wdpPsuedoNamespace + "popup",
    cssClassActive = wdpPsuedoNamespace + "active",
    cssClassActionList = unattendedSetupPsuedoNamespace + "actiontypes";
    cssClassActionListItem = unattendedSetupPsuedoNamespace + "actiontype";

    cssClassActionCategoriesList = unattendedSetupPsuedoNamespace + "categorytypes";
    cssClassActionCategoryListItem = unattendedSetupPsuedoNamespace + "categorytype";

    cssClassPrimaryCommand = "darkButton";

    var driveFieldOptions =
        '<option value="Retail">Retail</option> \
        <option value="Development">Development</option> \
        <option value="Ext1">Ext1</option> \
        <option value="Ext2">Ext2</option> \
        <option value="Ext3">Ext3</option> \
        <option value="Ext4">Ext4</option> \
        <option value="Ext5">Ext5</option> \
        <option value="Ext6">Ext6</option> \
        <option value="Ext7">Ext7</option>';

    // ActiveActions for each category should be sorted alphabetically for ease of update
    // NOTE: If you add an action type here, make sure to add it to the UnattendedSetup
    // request handler (xboxplugin\UnattendedSetupRequest.cpp) in the telemetry callback
    // (see the knownActions variable) or else any telemetry involving that action will
    // not be sent for security reasons.
    CategoryTypes = {
        ALL: {
            Type: "ALL",
            FriendlyName: "All",
            ActiveActions: [
                "ALLOWHDR",
                "ALLOWAPPCONNECT",
                "AUTOBOOT",
                "BLOCKSCRIPTS",
                "BLOCKUSBSCRIPTS",
                "COPYAPP",
                "COPYDRIVE",
                "CRASHDUMP",
                "CREATEUSER",
                "CRED",
                "CUSTOM",
                "DEBUG",
                "DEFAULTAPP",
                "DEFAULTPAIRING",
                "DEFAULTSTORAGE",
                "DEFAULTUSER",
                "DIMTIMEOUT",
                "EXEC",
                "EXTRATITLEMEM",
                "FACTORYRESET",
                "FORCEGUESTSMB",
                "FRONTSCRIPT",
                "GEOREGION",
                "HOSTNAME",
                "IMPORTSETTINGS",
                "INSTALL",
                "LAUNCH",
                "MOVEAPP",
                "MOVEDRIVE",
                "OVERLAYCLEAR",
                "OVERLAYCLEARALL",
                "OVERLAYSET",
                "POWERMODE",
                "PREFLANG",
                "PROFILEMODE",
                "REGAPP",
                "REGDRIVE",
                "REGNET",
                "REGSCRATCH",
                "REGSCRATCHV2",
                "RESOLUTION",
                "RUNSCRIPTSIMMED",
                "SANDBOX",
                "SCRIPT",
                "SHUTDOWNTIMEOUT",
                "SIGNIN",
                "TIMEZONE",
                "TOAST",
                "UPDATE",
                "UPDATELIVE",
                "UPDATEPOLICY",
                "WAIT",
                "WDP",
                "WDPCERT",
                "WDPCERTDEL",
            ]
        },
        COMMON: {
            Type: "COMMON",
            FriendlyName: "Common",
            ActiveActions: [
                "CRED",
                "CUSTOM",
                "SANDBOX",
                "SIGNIN",
                "UPDATE",
                "UPDATELIVE"
            ]
        },
        APPLICATION: {
            Type: "APPLICATION",
            FriendlyName: "Application",
            ActiveActions: [
                "COPYAPP",
                "COPYDRIVE",
                "INSTALL",
                "LAUNCH",
                "MOVEAPP",
                "MOVEDRIVE",
                "OVERLAYCLEAR",
                "OVERLAYCLEARALL",
                "OVERLAYSET",
                "REGAPP",
                "REGDRIVE",
                "REGNET",
                "REGSCRATCH",
                "REGSCRATCHV2"
            ]
        },
        USER: {
            Type: "USER",
            FriendlyName: "User",
            ActiveActions: [
                "CREATEUSER",
                "DEFAULTPAIRING",
                "DEFAULTUSER",
                "SIGNIN"
            ]
        },
        SETTINGS: {
            Type: "SETTINGS",
            FriendlyName: "Settings",
            ActiveActions: [
                "ALLOWHDR",
                "ALLOWAPPCONNECT",
                "AUTOBOOT",
                "BLOCKSCRIPTS",
                "BLOCKUSBSCRIPTS",
                "CRASHDUMP",
                "DEFAULTAPP",
                "DEFAULTPAIRING",
                "DEFAULTSTORAGE",
                "DEFAULTUSER",
                "DIMTIMEOUT",
                "EXTRATITLEMEM",
                "FORCEGUESTSMB",
                "GEOREGION",
                "HOSTNAME",
                "IMPORTSETTINGS",
                "POWERMODE",
                "PREFLANG",
                "PROFILEMODE",
                "RESOLUTION",
                "RUNSCRIPTSIMMED",
                "SANDBOX",
                "SHUTDOWNTIMEOUT",
                "TIMEZONE",
                "UPDATEPOLICY",
            ]
        },
        UTILS: {
            Type: "UTILS",
            FriendlyName: "Utilities",
            ActiveActions: [
                "CUSTOM",
                "DEBUG",
                "EXEC",
                "FACTORYRESET",
                "FRONTSCRIPT",
                "SCRIPT",
                "TOAST",
                "WAIT",
                "WDP",
                "WDPCERT",
                "WDPCERTDEL"
            ]
        },
    }

    // If you add an action type, make sure to add it to the appropriate categories or users won't be able to add it.
    // This list should be roughly in priority order, as it will determine the order that items show up in the UI.
    ActionTypes = {
        IMPORTSETTINGS:     { Type: "IMPORTSETTINGS",   FriendlyName: "Import settings from a file",                                    ToText: importSettingsToText,       AddOrEdit: addOrEditImportSettingsActionDetails,            Parse: parseImportSettingsAction,        DetailsSummary: function(action) { return "Import settings from " + action.Filepath; } },
        SANDBOX:            { Type: "SANDBOX",          FriendlyName: "Set sandbox Id",                                                 ToText: settingToTextHelper,        AddOrEdit: addOrEditSandboxActionDetails,                   Parse: parseSandboxAction,               DetailsSummary: getSettingDetailsSummary },
        AUTOBOOT:           { Type: "AUTOBOOT",         FriendlyName: "Set autoboot setting",                                           ToText: settingToTextHelper,        AddOrEdit: addOrEditAutobootActionDetails,                  Parse: parseAutobootAction,              DetailsSummary: getSettingDetailsSummary },
        DIMTIMEOUT:         { Type: "DIMTIMEOUT",       FriendlyName: "Set screen dim setting",                                         ToText: settingToTextHelper,        AddOrEdit: addOrEditDimtimeoutActionDetails,                Parse: parseDimtimeoutAction,            DetailsSummary: getSettingDetailsSummary },
        POWERMODE:          { Type: "POWERMODE",        FriendlyName: "Set power mode setting",                                         ToText: settingToTextHelper,        AddOrEdit: addOrEditPowermodeActionDetails,                 Parse: parsePowermodeAction,             DetailsSummary: getSettingDetailsSummary },
        SHUTDOWNTIMEOUT:    { Type: "SHUTDOWNTIMEOUT",  FriendlyName: "Set automatic shutdown setting",                                 ToText: settingToTextHelper,        AddOrEdit: addOrEditShutdownActionDetails,                  Parse: parseShutdownAction,              DetailsSummary: getSettingDetailsSummary },
        RESOLUTION:         { Type: "RESOLUTION",       FriendlyName: "Set TV resolution",                                              ToText: settingToTextHelper,        AddOrEdit: addOrEditResolutionActionDetails,                Parse: parseResolutionAction,            DetailsSummary: getSettingDetailsSummary },
        UPDATEPOLICY:       { Type: "UPDATEPOLICY",     FriendlyName: "Set the OS recovery update policy",                              ToText: settingToTextHelper,        AddOrEdit: addOrEditUpdatePolicyActionDetails,              Parse: parseUpdatePolicyAction,          DetailsSummary: getSettingDetailsSummary },
        HOSTNAME:           { Type: "HOSTNAME",         FriendlyName: "Set the host name for the console",                              ToText: settingToTextHelper,        AddOrEdit: addOrEditHostnameActionDetails,                  Parse: parseHostnameAction,              DetailsSummary: getHostnameDetailsSummary },
        DEFAULTAPP:         { Type: "DEFAULTAPP",       FriendlyName: "Set the default home experience for the console",                ToText: settingToTextHelper,        AddOrEdit: addOrEditDefaultAppActionDetails,                Parse: parseDefaultAppAction,            DetailsSummary: getSettingDetailsSummary },
        ALLOWAPPCONNECT:    { Type: "ALLOWAPPCONNECT",  FriendlyName: "Allow connections from the Xbox App and Dev Mode Companion App", ToText: settingToTextHelper,        AddOrEdit: addOrEditAppConnectionActionDetails,             Parse: parseAppConnectionAction,         DetailsSummary: getSettingDetailsSummary },
        PROFILEMODE:        { Type: "PROFILEMODE",      FriendlyName: "Set the profiling mode for PIX",                                 ToText: settingToTextHelper,        AddOrEdit: addOrEditProfilingModeActionDetails,             Parse: parseProfilingModeAction,         DetailsSummary: getSettingDetailsSummary },
        EXTRATITLEMEM:      { Type: "EXTRATITLEMEM",    FriendlyName: "Allow extra memory for titles",                                  ToText: settingToTextHelper,        AddOrEdit: addOrEditExtraMemoryActionDetails,               Parse: parseExtraMemoryAction,           DetailsSummary: getSettingDetailsSummary },
        CRASHDUMP:          { Type: "CRASHDUMP",        FriendlyName: "Set what kind of crash dumps are gathered",                      ToText: settingToTextHelper,        AddOrEdit: addOrEditCrashDumpActionDetails,                 Parse: parseCrashDumpAction,             DetailsSummary: getSettingDetailsSummary },
        DEFAULTSTORAGE:     { Type: "DEFAULTSTORAGE",   FriendlyName: "Set the default storage device for deployments",                 ToText: settingToTextHelper,        AddOrEdit: addOrEditDefaultStorageActionDetails,            Parse: parseDefaultStorageAction,        DetailsSummary: getSettingDetailsSummary },
        ALLOWHDR:           { Type: "ALLOWHDR",         FriendlyName: "Allow high dynamic range if the display supports it",            ToText: settingToTextHelper,        AddOrEdit: addOrEditAllowHdrActionDetails,                  Parse: parseAllowHdrAction,              DetailsSummary: getSettingDetailsSummary },
        DEFAULTPAIRING:     { Type: "DEFAULTPAIRING",   FriendlyName: "Set the default controller pairing",                             ToText: settingToTextHelper,        AddOrEdit: addOrEditDefaultPairingActionDetails,            Parse: parseDefaultPairingAction,        DetailsSummary: getSettingDetailsSummary },
        DEFAULTUSER:        { Type: "DEFAULTUSER",      FriendlyName: "Set the default user",                                           ToText: settingToTextHelper,        AddOrEdit: addOrEditDefaultUserActionDetails,               Parse: parseDefaultUserAction,           DetailsSummary: getSettingDetailsSummary },
        GEOREGION:          { Type: "GEOREGION",        FriendlyName: "Set the geographic region",                                      ToText: settingToTextHelper,        AddOrEdit: addOrEditGeoRegionActionDetails,                 Parse: parseGeoRegionAction,             DetailsSummary: getSettingDetailsSummary },
        PREFLANG:           { Type: "PREFLANG",         FriendlyName: "Set the preferred language",                                     ToText: settingToTextHelper,        AddOrEdit: addOrEditPreferedLanguageActionDetails,          Parse: parsePreferedLanguageAction,      DetailsSummary: getSettingDetailsSummary },
        TIMEZONE:           { Type: "TIMEZONE",         FriendlyName: "Set the preferred timezone",                                     ToText: settingToTextHelper,        AddOrEdit: addOrEditTimezoneActionDetails,                  Parse: parseTimezoneAction,              DetailsSummary: getSettingDetailsSummary },
        FORCEGUESTSMB:      { Type: "FORCEGUESTSMB",    FriendlyName: "Force \"Guest\" account access to file shares",                  ToText: settingToTextHelper,        AddOrEdit: addOrEditForceGuestSmbActionDetails,             Parse: parseForceGuestSmbAction,         DetailsSummary: getSettingDetailsSummary },
        CRED:               { Type: "CRED",             FriendlyName: "Add network credentials",                                        ToText: credActionToText,           AddOrEdit: addOrEditCredActionDetails,                      Parse: parseCredAction,                  DetailsSummary: function(action) { return "Add network credentials for " + action.Username + " to access " + action.NetworkShare; } },
        UPDATE:             { Type: "UPDATE",           FriendlyName: "Update console OS recovery",                                     ToText: updateActionToText,         AddOrEdit: addOrEditUpdateActionDetails,                    Parse: parseUpdateAction,                DetailsSummary: function(action) { return "Updating to OS recovery from share at " + action.NetworkShare; } },
        UPDATELIVE:         { Type: "UPDATELIVE",       FriendlyName: "Update console OS recovery from Xbox Live",                      ToText: updateLiveActionToText,     AddOrEdit: addOrEditUpdateLiveActionDetails,                Parse: parseUpdateLiveAction,            DetailsSummary: function(action) { return "Updating to OS recovery version " + action.UpdateVersion; } },
        CREATEUSER:         { Type: "CREATEUSER",       FriendlyName: "Create and sign in a new Xbox Live account",                     ToText: createUserActionToText,     AddOrEdit: addOrEditCreateUserActionDetails,                Parse: parseCreateUserAction,            DetailsSummary: getCreateNewUserDetailsSummary },
        SIGNIN:             { Type: "SIGNIN",           FriendlyName: "Sign in a user",                                                 ToText: signinActionToText,         AddOrEdit: addOrEditSigninActionDetails,                    Parse: parseSigninAction,                DetailsSummary: function(action) { return "Signin " + action.XblEmailAddress; } },
        REGNET:             { Type: "REGNET",           FriendlyName: "Register an application from a network share",                   ToText: regNetworkActionToText,     AddOrEdit: addOrEditRegNetworkActionDetails,                Parse: parseRegNetworkAction,            DetailsSummary: function(action) { return "Register application at " + action.AppSharePath; } },
        INSTALL:            { Type: "INSTALL",          FriendlyName: "Install a packaged application",                                 ToText: installActionToText,        AddOrEdit: addOrEditInstallActionDetails,                   Parse: parseInstallAction,               DetailsSummary: function(action) { return "Install application at " + action.PackagePath; } },
        REGSCRATCHV2:       { Type: "REGSCRATCHV2",     FriendlyName: "Copy and register an application on the scratch drive",          ToText: regScratchV2ActionToText,   AddOrEdit: addOrEditRegScratchV2ActionDetails,              Parse: parseRegScratchAction,            DetailsSummary: function(action) { return "Copy and register application from " + action.AppSharePath + " to " + action.DestinationFolder; } },
        REGSCRATCH:         { Type: "REGSCRATCH",       FriendlyName: "Copy and register an application on the legacy scratch drive",   ToText: regScratchActionToText,     AddOrEdit: addOrEditRegScratchV1ActionDetails,              Parse: parseRegScratchAction,            DetailsSummary: function(action) { return "Copy and register application from " + action.AppSharePath + " to " + action.DestinationFolder; } },
        MOVEAPP:            { Type: "MOVEAPP",          FriendlyName: "Move an application from one drive to another",                  ToText: moveAppActionToText,        AddOrEdit: addOrEditMoveAppActionDetails,                   Parse: parseMoveAppAction,               DetailsSummary: function(action) { return "Move " + action.PackageFullName + " to " + action.DestinationDrive; } },
        COPYAPP:            { Type: "COPYAPP",          FriendlyName: "Copy an application from one drive to another",                  ToText: copyAppActionToText,        AddOrEdit: addOrEditCopyAppActionDetails,                   Parse: parseCopyAppAction,               DetailsSummary: function(action) { return "Copy " + action.PackageFullName + " to " + action.DestinationDrive; } },
        MOVEDRIVE:          { Type: "MOVEDRIVE",        FriendlyName: "Move all applications from one drive to another",                ToText: moveDriveActionToText,      AddOrEdit: addOrEditMoveDriveActionDetails,                 Parse: parseMoveDriveAction,             DetailsSummary: function(action) { return "Move " + action.SourceDrive + " drive to " +action.DestinationDrive; } },
        COPYDRIVE:          { Type: "COPYDRIVE",        FriendlyName: "Copy all applications from one drive to another",                ToText: copyDriveActionToText,      AddOrEdit: addOrEditCopyDriveActionDetails,                 Parse: parseCopyDriveAction,             DetailsSummary: function(action) { return "Copy " + action.SourceDrive + " drive to " +action.DestinationDrive;  } },
        REGAPP:             { Type: "REGAPP",           FriendlyName: "Register an application already present on a drive",             ToText: registerAppActionToText,    AddOrEdit: addOrEditRegisterAppActionDetails,               Parse: parseRegisterAppAction,           DetailsSummary: function(action) { return "Register " + action.PackageFullName } },
        REGDRIVE:           { Type: "REGDRIVE",         FriendlyName: "Register all applications present on a drive",                   ToText: registerDriveActionToText,  AddOrEdit: addOrEditRegisterDriveActionDetails,             Parse: parseRegisterDriveAction,         DetailsSummary: function(action) { return "Register all applications on " + action.SourceDrive } },
        LAUNCH:             { Type: "LAUNCH",           FriendlyName: "Launch an application",                                          ToText: launchActionToText,         AddOrEdit: addOrEditLaunchActionDetails,                    Parse: parseLaunchAction,                DetailsSummary: function(action) { return "Launch " + action.AppAumid; } },
        OVERLAYCLEAR:       { Type: "OVERLAYCLEAR",     FriendlyName: "Reset an overlay folder for an application",                     ToText: clearOverlayActionToText,   AddOrEdit: addOrEditClearOverlayActionDetails,              Parse: parseClearOverlayAction,          DetailsSummary: function(action) { return "Reset the overlay folder for " + action.PackageFullName; } },
        OVERLAYSET:         { Type: "OVERLAYSET",       FriendlyName: "Set an overlay folder for an application",                       ToText: setOverlayActionToText,     AddOrEdit: addOrEditSetOverlayActionDetails,                Parse: parseSetOverlayAction,            DetailsSummary: function(action) { return "Set " + action.OverlayFolder + " as an overlay folder for " + action.PackageFullName; } },
        OVERLAYCLEARALL:    { Type: "OVERLAYCLEARALL",  FriendlyName: "Reset all overlay folders",                                      ToText: clearAllOverlayActionToText,AddOrEdit: addOrEditClearAllOverlayActionDetails,           Parse: parseClearAllOverlayAction,       DetailsSummary: function(action) { return "Reset all overlay folders"; } },
        FRONTSCRIPT:        { Type: "FRONTSCRIPT",      FriendlyName: "Assign a script to a front panel button",                        ToText: frontScriptActionToText,    AddOrEdit: addOrEditFrontScriptActionDetails,               Parse: parseFrontScriptAction,           DetailsSummary: function(action) { return "Apply " + action.ScriptName + " to button " + action.ButtonNumber; } },
        SCRIPT:             { Type: "SCRIPT",           FriendlyName: "Run another script",                                             ToText: scriptActionToText,         AddOrEdit: addOrEditScriptActionDetails,                    Parse: parseScriptAction,                DetailsSummary: function(action) { return "Run " + action.ExternalScript; } },
        EXEC:               { Type: "EXEC",             FriendlyName: "Run an executable",                                              ToText: execActionToText,           AddOrEdit: addOrEditExecActionDetails,                      Parse: parseExecAction,                  DetailsSummary: function(action) { return "Run " + action.ExternalExecutable; } },
        WDP:                { Type: "WDP",              FriendlyName: "Configure Xbox Device Portal",                                   ToText: wdpActionToText,            AddOrEdit: addOrEditWdpActionDetails,                       Parse: parseWdpAction,                   DetailsSummary: function(action) { if (action.EnabledState === "enable") { return "Enable Xbox Device Portal with " + (action.Username && action.Password ? "" : "no ") + "required credentials"; } else { return "Disable Xbox Device Portal"; } } },
        WDPCERT:            { Type: "WDPCERT",          FriendlyName: "Add Xbox Device Portal custom certificate",                      ToText: wdpCertActionToText,        AddOrEdit: addOrEditWdpCertActionDetails,                   Parse: parseWdpCertAction,               DetailsSummary: function(action) { return "Apply certificate at " + action.CertPath + " to Xbox Device Portal"; } },
        WDPCERTDEL:         { Type: "WDPCERTDEL",       FriendlyName: "Reset Xbox Device Portal certificates",                          ToText: wdpDelCertActionToText,     AddOrEdit: addOrEditDelWdpCertActionDetails,                Parse: parseWdpDelCertAction,            DetailsSummary: function(action) { return "Reset certificates for Xbox Device Portal"; } },
        FACTORYRESET:       { Type: "FACTORYRESET",     FriendlyName: "Restore the console to factory default settings",                ToText: factoryResetActionToText,   AddOrEdit: addOrEditFactoryResetActionDetails,              Parse: parseFactoryResetAction,          DetailsSummary: function(action) { return "Perform a " + (action.FullReset ? "full ": "") + "factory reset on this console"; } },
        BLOCKSCRIPTS:       { Type: "BLOCKSCRIPTS",     FriendlyName: "Block further unattended scripts",                               ToText: settingToTextHelper,        AddOrEdit: addOrEditBlockScriptsActionDetails,              Parse: parseBlockScriptsAction,          DetailsSummary: getSettingDetailsSummary },
        BLOCKUSBSCRIPTS:    { Type: "BLOCKUSBSCRIPTS",  FriendlyName: "Block unattended scripts on USB drives",                         ToText: settingToTextHelper,        AddOrEdit: addOrEditBlockUsbScriptsActionDetails,           Parse: parseBlockUsbScriptsAction,       DetailsSummary: getSettingDetailsSummary },
        RUNSCRIPTSIMMED:    { Type: "RUNSCRIPTSIMMED",  FriendlyName: "Run unattended scripts immediately",                             ToText: settingToTextHelper,        AddOrEdit: addOrEditRunScriptsImmediatelyActionDetails,     Parse: parseRunScriptsImmediatelyAction, DetailsSummary: getSettingDetailsSummary },
        TOAST:              { Type: "TOAST",            FriendlyName: "Show notification",                                              ToText: toastActionToText,          AddOrEdit: addOrEditToastActionDetails,                     Parse: parseToastAction,                 DetailsSummary: function(action) { return action.ToastMessage; } },
        WAIT:               { Type: "WAIT",             FriendlyName: "Add wait",                                                       ToText: waitActionToText,           AddOrEdit: addOrEditWaitActionDetails,                      Parse: parseWaitAction,                  DetailsSummary: function(action) { return "Wait for " + action.WaitTimeInSeconds + " seconds"; } },
        DEBUG:              { Type: "DEBUG",            FriendlyName: "Verbose logging",                                                ToText: debugActionToText,          AddOrEdit: addOrEditDebugActionDetails,                     Parse: parseDebugAction,                 DetailsSummary: function(action) { return "Turn on verbose logging for debugging a script"; } },
        CUSTOM:             { Type: "CUSTOM",           FriendlyName: "Do custom action",                                               ToText: customActionToText,         AddOrEdit: addOrEditCustomActionDetails,                    Parse: parseCustomAction,                DetailsSummary: function(action) { return action.Raw; } },
    };

    function actionsFormatter(row, cell, value, columnDef, dataContext) {
        return '<a class="xboxunattendedsetup-actionlist-moveup" href="#" ' + actionIdAttribute + '="' + dataContext.ActionId + '">&uarr;</a>'  + 
               '<a class="xboxunattendedsetup-actionlist-divider" >|</a>'  + 
               '<a class="xboxunattendedsetup-actionlist-movedown" href="#" ' + actionIdAttribute + '="' + dataContext.ActionId + '">&darr;</a>' +
               '<a class="xboxunattendedsetup-actionlist-divider" >|</a>'  + 
               '<a class="xboxunattendedsetup-actionlist-remove" style="font-size: 15px;" href="#" ' + actionIdAttribute + '="' + dataContext.ActionId + '">X</a>';
    };

    function actionNameFormatter(row, cell, value, columnDef, dataContext) {
        return '<a style="text-decoration:underline; font-weight: bold; vertical-align: -webkit-baseline-middle;" class="xboxunattendedsetup-actionlist-details" href="#" ' + actionIdAttribute + '="' + dataContext.ActionId + '">' + value + '</a>';
    };

    function getHostnameDetailsSummary(action) {
        if (action.SettingValue === automaticHostnameValue) {
            return automaticHostnameFriendly;
        } else {
            return action.SettingName + " = " + action.SettingValue;
        }
    };

    function getCreateNewUserDetailsSummary(action) {
        if (action.EmailAddress === automaticEmailAddressValue) {
            return "Create and sign in a new user with an automatically generated email address";
        } else {
            return "Create and sign in a new user with email " + action.EmailAddress + "@xboxtest.com";
        }
    };

    function getSettingDetailsSummary(action) {
        var summary = action.SettingName + " = " + action.SettingValue;

        var setting = false;
        if (settingInfo) {
            for (var i = 0, len = settingInfo.length; i < len; ++i) {
                if (settingInfo[i].Name.toLowerCase() === action.SettingName.toLowerCase()) {
                    setting = settingInfo[i];

                    // Update the setting in case we have new values.
                    if (setting.Category &&
                        Wdp.Utils.Xbox.Settings.settingsByDisplayCategory &&
                        Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[setting.Category.toLowerCase()][setting.Name.toLowerCase()]) {

                        setting = Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[setting.Category.toLowerCase()][setting.Name.toLowerCase()];
                    }
                    break;
                }
            }
        }

        if (setting && setting.Type === "Select") {
            var optionDisplayTextForSetting = Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting[action.SettingName.toLowerCase()];

            if (optionDisplayTextForSetting) {
                var optionDisplayText = optionDisplayTextForSetting[action.SettingValue.toLowerCase()];

                if (optionDisplayText) {
                    summary = action.SettingName + " = " + optionDisplayText;
                }
            }
        }

        return summary;
    };

    function actionDetailsFormatter(row, cell, value, columnDef, dataContext) {
        for (var i = 0; i < actions.length; ++i) {
            if (actions[i].ActionId === dataContext.ActionId) {
                return "<table style=\"width: -webkit-fill-available; margin-left:10px; margin-right:10px;\"><tr><td style=\"vertical-align: middle; color: #777777 !important;\">" + ActionTypes[actions[i].ActionType].DetailsSummary(actions[i]) + "</td><td style=\"text-align:right\">" + actionsFormatter(row, cell, value, columnDef, dataContext) + "</td></tr></table>";
            }
        }
    };

    function handleActionsListClicked(e) {
        var target = e.target;
        var actionId = target.getAttribute(actionIdAttribute);

        // Edit actions
        if (target.classList.contains("xboxunattendedsetup-actionlist-details")) {
            editAction(actionId);
        } else if (target.classList.contains("xboxunattendedsetup-actionlist-moveup")) {
            moveUpAction(actionId);
        } else if (target.classList.contains("xboxunattendedsetup-actionlist-movedown")) {
            moveDownAction(actionId);
        } else if (target.classList.contains("xboxunattendedsetup-actionlist-remove")) {
            removeAction(actionId);
        }
    };

    function handleScriptImport() {
        $('#xboxunattendedsetup-importscript-input').trigger('click');
    };

    function refreshActionList(parsedActions) {
        if (parsedActions && parsedActions.length > 0) {
            
            if (!actionGrid) {
                var actionsTableColumns = [
                  { id: "Action", name: "SCRIPT ACTION TYPE", field: "ActionName", width: 550, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: actionNameFormatter },
                  { id: "Details", name: "DETAILS", field: "DetailsSummary", width: 587, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: actionDetailsFormatter }
                ];

                var actionsTableOptions = {
                    selectedCellCssClass: "rowSelected",
                    enableCellNavigation: true,
                    enableColumnReorder: false,
                    enableTextSelectionOnCells: true,
                    showHeaderRow: true,
                    syncColumnCellResize: true,
                    autoHeight: true,
                    rowHeight: 36.5,
                    headerRowHeight: 40.45
                };

                dataView = new Slick.Data.DataView();
                dataView.setItems(parsedActions, "ActionId");
                actionGrid = new Slick.Grid(actionList, dataView, actionsTableColumns, actionsTableOptions);
                actionGrid.onClick.subscribe(handleActionsListClicked);
            }

            actions = parsedActions;
            newActionButton.focus();
            dataView.setItems(actions, "ActionId");
            actionGrid.invalidate();
            actionGrid.render();

            newScriptButton.disabled = false;
            runScriptButton.disabled = false;
            exportScriptButton.disabled = false;
            applyButton.disabled = false;
            fpdAddButton.disabled = false;

        } else {
            actions = [];
            actionGrid = null;
            newScriptButton.disabled = true;
            runScriptButton.disabled = true;
            exportScriptButton.disabled = true;
            applyButton.disabled = true;
            fpdAddButton.disabled = true;
            actionList.innerHTML =
                '<table><tr><th style="width:550px" class="emptyTable-th">SCRIPT ACTION TYPE</th><th style="width:570px" class="emptyTable-th">DETAILS</th></tr><tr><td class="emptytable-body">0 actions created</td><td class="emptytable-body"></td></tr></table>';
        }
    };

    function importActionsFromFile() {

        if (importFileInput.files[0]) {
            var fileReader = new FileReader();
            fileReader.onloadstart = function () {
                Wdp.Utils._showProgress(toolRootElement);
            }
            fileReader.onloadend = function () {
                Wdp.Utils._hideProgress(toolRootElement);
            }
            fileReader.onload = function (e) {
                var parsedActions = parseActionsFromText(fileReader.result);

                // Reset the filepicker so we could reload this script if desired.
                resetField($(importFileInput));

                refreshActionList(parsedActions);
            }
            fileReader.readAsText(importFileInput.files[0]);
        }
    };

    function exportActionsToFile(name, actionsToExport) {
        var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
        var exportData = "";

        exportData += "@ECHO OFF\r\n";
        exportData += "SETLOCAL EnableDelayedExpansion\r\n";
        exportData += "REM UNATTENDSCRIPT\r\n";
        exportData += "REM NAME " + name + "\r\n";
        exportData += "ECHO Running script " + name + "\r\n";
        exportData += "ECHO Filename: %0\r\n";
        exportData += "\r\n";
        exportData += "REM NOTE: Manual modifications to this file may prevent it from being imported by Device Portal or may be lost on import.\r\n";
        exportData += "REM       It is highly recommended that it be modified in Device Portal with Custom actions used to accomplish things that can't be done with the regular templates.\r\n";
        exportData += "REM       Once you have a custom action, editing the text within that action in a text editor is fine and will be preserved on import.\r\n";
        exportData += "\r\n";
        exportData += "SET NeedsReboot=false\r\n";
        exportData += "SET SkipReboot=false\r\n";
        exportData += "\r\n";
        exportData += "SET SerialNumber=%1\r\n";
        exportData += "SET ConsoleId=%2\r\n";
        exportData += "SET DeviceId=%3\r\n";
        exportData += "SET UsbRoot=%4\r\n";
        exportData += "if \"%UsbRoot%\" neq \"\" SET PATH=%PATH%;%4";
        exportData += "\r\n";
        exportData += "\r\n";

        for (var i = 0; i < actionsToExport.length; ++i) {
            // Add the action text for each action.
            exportData += ActionTypes[actionsToExport[i].ActionType].ToText(actionsToExport[i]);
        }

        // Add cleanup step.
        exportData += "REM SCRIPTCLEANUP\r\n";
        exportData += ":_Cleanup\r\n";

        // Add reboot if needed. Sleep for 10 seconds or so before the reboot
        // to give the toast a few seconds to appear and about 5 seconds afterwards
        // to be read.
        exportData += "REM If we need to reboot, pop a toast and sleep longer than the toast warns since it takes a toast a couple seconds to display.\r\n";
        exportData += "if \"%SkipReboot%\" neq \"true\" (\r\n";
        exportData += "    if \"%NeedsReboot%\" equ \"true\" (\r\n";
        exportData += "        J:\\unattendedsetuphelper.exe toast Unattended%%20script%%20requires%%20a%%20reboot.%%0ARebooting%%20automatically%%20in%%205%%20seconds.\r\n";
        exportData += "        sleep 10\r\n";
        exportData += "        shutdown /r /t 0\r\n";
        exportData += "    )\r\n";
        exportData += ")\r\n";

        return new Blob([exportData], { type: 'text/plain' });
    };

    function editAction(actionId) {
        for (var i = 0; i < actions.length; ++i) {
            if (actions[i].ActionId === actionId) {
                ActionTypes[actions[i].ActionType].AddOrEdit(actions[i]);
                break;
            }
        }
    };

    function parseScriptValue(type, line, varName, isQuoted) {
        var setter = "SET " + varName + "=";

        if (isQuoted) {
            setter += "\"";
        }
        if (line.split(' ').length < 2) {
            Xbox.Utils._showError({ ErrorMessage: "Failed to parse " + type + " script action. " + varName + " is missing." });
            return;
        }
        if (line.indexOf(setter) === -1) {
            Xbox.Utils._showError({ ErrorMessage: "Failed to parse " + type + " script action. " + varName + " info in wrong format." });
            return;
        }
        var varValue = line.replace(setter, "");
        if (isQuoted) {
            varValue = varValue.slice(0, -1); // Remove the last quotation.
        }

        return varValue;
    };

    function parseActionsFromText(scriptText) {

        var parsedActions = [];
        var scriptLines = scriptText.split('\r\n');

        if (scriptLines.length <= 6) {
            Xbox.Utils._showError({ ErrorMessage: "Failed to parse script file." });
            return;
        }

        if (scriptLines[2] !== "REM UNATTENDSCRIPT") {
            Xbox.Utils._showError({ ErrorMessage: "Failed to parse script file. Missing header." });
            return;
        }

        if (scriptLines[3].split(' ').length < 3){
            Xbox.Utils._showError({ ErrorMessage: "Failed to parse script file. Missing name info." });
            return;
        }
        var scriptName = scriptLines[3].replace("REM NAME ", "");
        var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
        scriptNameElement.value = scriptName;

        var nextActionId = -1;

        // This will skip over all lines until the first action.
        var currentLine = 0;
        while (currentLine < scriptLines.length) {

            if (scriptLines[currentLine] === "") {
                ++currentLine;
                continue;
            }
            var actionStart = scriptLines[currentLine].split(' ');

            // If this is script cleanup, we are done parsing.
            if (actionStart.length >= 2 &&
                actionStart[0] === "REM" &&
                actionStart[1] === "SCRIPTCLEANUP") {
                break;
            }

            // If this isn't an action, skip the line and keep looking for the first action.
            if (actionStart.length < 5 ||
                actionStart[0] !== "REM" ||
                actionStart[1] !== "SCRIPTSTEP" ||
                actionStart[2] !== "START") {
                ++currentLine;
                continue;
            }
            var actionType = actionStart[3];
            var actionVersion = actionStart[4];
            var action;

            if (!ActionTypes[actionType]) {
                Xbox.Utils._showError({ ErrorMessage: "Found an unknown action type. Action type was " + actionType + " (Version " + actionVersion + ")." });
                return;
            }

            // Skip two lines for the action header and the ECHO statement about running that action.
            action = ActionTypes[actionType].Parse(currentLine + 2, actionVersion, scriptLines);

            // Parse will print a more detailed error message about what the parse failure was.
            if (!action) {
                return;
            }

            // Move up to just past the action stop.
            while (currentLine < scriptLines.length && scriptLines[currentLine] !== finalLineOfAction) {
                ++currentLine;
            }
            currentLine+=2; // There is a blank line after a step stop.

            action.ActionId = (++nextActionId).toString();
            parsedActions.push(action);
        }

        return parsedActions;
    };

    function parseExecAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out executable
                action.ExternalExecutable = parseScriptValue(ActionTypes.EXEC.FriendlyName, scriptLines[currentIndex], "ExecutableToRun", true);
                if (!action.ExternalExecutable) {
                    return;
                }
                ++currentIndex;

                // Parse out executable args (optional)
                action.ExecutableArguments = parseScriptValue(ActionTypes.EXEC.FriendlyName, scriptLines[currentIndex], "ExecutableArguments");
                if (action.ExecutableArguments == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.EXEC.FriendlyName;
                action.ActionType = ActionTypes.EXEC.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.EXEC.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseMoveAppAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the package full name
                action.PackageFullName = parseScriptValue(ActionTypes.MOVEAPP.FriendlyName, scriptLines[currentIndex], "PackageFullName", true);
                if (!action.PackageFullName) {
                    return;
                }
                ++currentIndex;

                // Parse out the destination drive
                action.DestinationDrive = parseScriptValue(ActionTypes.MOVEAPP.FriendlyName, scriptLines[currentIndex], "DestinationDrive", false);
                if (!action.DestinationDrive) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.MOVEAPP.FriendlyName;
                action.ActionType = ActionTypes.MOVEAPP.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.MOVEAPP.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseCopyAppAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the package full name
                action.PackageFullName = parseScriptValue(ActionTypes.COPYAPP.FriendlyName, scriptLines[currentIndex], "PackageFullName", true);
                if (!action.PackageFullName) {
                    return;
                }
                ++currentIndex;

                // Parse out the destination drive
                action.DestinationDrive = parseScriptValue(ActionTypes.COPYAPP.FriendlyName, scriptLines[currentIndex], "DestinationDrive", false);
                if (!action.DestinationDrive) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.COPYAPP.FriendlyName;
                action.ActionType = ActionTypes.COPYAPP.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.COPYAPP.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseRegisterAppAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the package full name
                action.PackageFullName = parseScriptValue(ActionTypes.REGAPP.FriendlyName, scriptLines[currentIndex], "PackageFullName", true);
                if (!action.PackageFullName) {
                    return;
                }
                ++currentIndex;

                // Parse out the source drive
                action.SourceDrive = parseScriptValue(ActionTypes.REGAPP.FriendlyName, scriptLines[currentIndex], "SourceDrive", false);
                if (!action.SourceDrive) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.REGAPP.FriendlyName;
                action.ActionType = ActionTypes.REGAPP.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.REGAPP.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseMoveDriveAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the source drive
                action.SourceDrive = parseScriptValue(ActionTypes.MOVEDRIVE.FriendlyName, scriptLines[currentIndex], "SourceDrive", false);
                if (!action.SourceDrive) {
                    return;
                }
                ++currentIndex;

                // Parse out the destination drive
                action.DestinationDrive = parseScriptValue(ActionTypes.MOVEDRIVE.FriendlyName, scriptLines[currentIndex], "DestinationDrive", false);
                if (!action.DestinationDrive) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.MOVEDRIVE.FriendlyName;
                action.ActionType = ActionTypes.MOVEDRIVE.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.MOVEDRIVE.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseCopyDriveAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the source drive
                action.SourceDrive = parseScriptValue(ActionTypes.COPYDRIVE.FriendlyName, scriptLines[currentIndex], "SourceDrive", false);
                if (!action.SourceDrive) {
                    return;
                }
                ++currentIndex;

                // Parse out the destination drive
                action.DestinationDrive = parseScriptValue(ActionTypes.COPYDRIVE.FriendlyName, scriptLines[currentIndex], "DestinationDrive", false);
                if (!action.DestinationDrive) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.COPYDRIVE.FriendlyName;
                action.ActionType = ActionTypes.COPYDRIVE.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.COPYDRIVE.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseRegisterDriveAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the source drive
                action.SourceDrive = parseScriptValue(ActionTypes.REGDRIVE.FriendlyName, scriptLines[currentIndex], "SourceDrive", false);
                if (!action.SourceDrive) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.REGDRIVE.FriendlyName;
                action.ActionType = ActionTypes.REGDRIVE.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.REGDRIVE.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    }

    function parseRegScratchAction(start, version, scriptLines) {
        var action = {};

        // Default to V2
        var type = ActionTypes.REGSCRATCHV2.Type;
        var friendlyName = ActionTypes.REGSCRATCHV2.FriendlyName;

        switch (version) {
            case "V1":
                type = ActionTypes.REGSCRATCH.Type;
                friendlyName = ActionTypes.REGSCRATCH.FriendlyName;
                // Fallthrough
            case "V2":

                var currentIndex = start;

                // Parse out network share
                action.AppSharePath = parseScriptValue(friendlyName, scriptLines[currentIndex], "AppSharePath", true);
                if (!action.AppSharePath) {
                    return;
                }
                ++currentIndex;

                // Parse out folder path
                action.DestinationFolder = parseScriptValue(friendlyName, scriptLines[currentIndex], "DestinationFolder", true);
                if (!action.DestinationFolder) {
                    return;
                }
                ++currentIndex;

                action.ActionName = friendlyName;
                action.ActionType = type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + friendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseInstallAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out package path
                action.PackagePath = parseScriptValue(ActionTypes.INSTALL.FriendlyName, scriptLines[currentIndex], "PackagePath", true);
                if (!action.PackagePath) {
                    return;
                }
                ++currentIndex;

                // Parse out DestinationDrive
                action.DestinationDrive = parseScriptValue(ActionTypes.INSTALL.FriendlyName, scriptLines[currentIndex], "DestinationDrive");
                if (!action.DestinationDrive) {
                    return;
                }
                ++currentIndex;

                // Parse out SpecifierOverrideString
                action.SpecifierOverrideString = parseScriptValue(ActionTypes.INSTALL.FriendlyName, scriptLines[currentIndex], "SpecifierOverrideString", true);
                if (action.SpecifierOverrideString == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.INSTALL.FriendlyName;
                action.ActionType = ActionTypes.INSTALL.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.INSTALL.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseRegNetworkAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out network share
                action.AppSharePath = parseScriptValue(ActionTypes.REGNET.FriendlyName, scriptLines[currentIndex], "AppSharePath", true);
                if (!action.AppSharePath) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.REGNET.FriendlyName;
                action.ActionType = ActionTypes.REGNET.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.REGNET.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseLaunchAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out encoded AUMID
                var encodedAumid = parseScriptValue(ActionTypes.LAUNCH.FriendlyName, scriptLines[currentIndex], "EncodedAppAumid", true);
                if (!encodedAumid) {
                    return;
                }
                ++currentIndex;

                action.AppAumid = window.atob(encodedAumid);

                action.ActionName = ActionTypes.LAUNCH.FriendlyName;
                action.ActionType = ActionTypes.LAUNCH.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.LAUNCH.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseClearOverlayAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the package full name
                action.PackageFullName = parseScriptValue(ActionTypes.OVERLAYCLEAR.FriendlyName, scriptLines[currentIndex], "PackageFullName", true);
                if (!action.PackageFullName) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.OVERLAYCLEAR.FriendlyName;
                action.ActionType = ActionTypes.OVERLAYCLEAR.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.OVERLAYCLEAR.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseSetOverlayAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out the package full name
                action.PackageFullName = parseScriptValue(ActionTypes.OVERLAYSET.FriendlyName, scriptLines[currentIndex], "PackageFullName", true);
                if (!action.PackageFullName) {
                    return;
                }
                ++currentIndex;

                // Parse out the overlay folder
                action.OverlayFolder = parseScriptValue(ActionTypes.OVERLAYSET.FriendlyName, scriptLines[currentIndex], "OverlayFolder", true);
                if (!action.OverlayFolder) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.OVERLAYSET.FriendlyName;
                action.ActionType = ActionTypes.OVERLAYSET.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.OVERLAYSET.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseClearAllOverlayAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                action.ActionName = ActionTypes.OVERLAYCLEARALL.FriendlyName;
                action.ActionType = ActionTypes.OVERLAYCLEARALL.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.OVERLAYCLEARALL.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseFrontScriptAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out file name
                action.FilePath = parseScriptValue(ActionTypes.FRONTSCRIPT.FriendlyName, scriptLines[currentIndex], "FilePath", true);
                if (!action.FilePath) {
                    return;
                }
                ++currentIndex;

                // Parse out script name
                action.ScriptName = parseScriptValue(ActionTypes.FRONTSCRIPT.FriendlyName, scriptLines[currentIndex], "ScriptName");
                if (!action.ScriptName) {
                    return;
                }
                ++currentIndex;

                // Parse out button number
                action.ButtonNumber = parseScriptValue(ActionTypes.FRONTSCRIPT.FriendlyName, scriptLines[currentIndex], "ButtonNumber");
                if (!action.ButtonNumber) {
                    return;
                }
                ++currentIndex;

                // Parse out optional custom tag
                action.CustomFlag = parseScriptValue(ActionTypes.FRONTSCRIPT.FriendlyName, scriptLines[currentIndex], "CustomFlag");
                if (action.CustomFlag == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.FRONTSCRIPT.FriendlyName;
                action.ActionType = ActionTypes.FRONTSCRIPT.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.FRONTSCRIPT.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseCreateUserAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out email
                action.EmailAddress = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "EmailAddress", true);
                if (!action.EmailAddress) {
                    return;
                }
                ++currentIndex;

                // Parse out password
                var encodedPassword = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "Password", true);
                if (!encodedPassword) {
                    return;
                }
                action.Password = window.atob(encodedPassword);
                ++currentIndex;

                // Parse out FirstName
                action.FirstName = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "FirstName", true);
                if (!action.FirstName) {
                    return;
                }
                ++currentIndex;

                // Parse out LastName
                action.LastName = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "LastName", true);
                if (!action.LastName) {
                    return;
                }
                ++currentIndex;

                // Parse out SecurityQuestion
                action.SecurityQuestion = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "SecurityQuestion", true);
                if (!action.SecurityQuestion) {
                    return;
                }
                ++currentIndex;

                // Parse out SecurityAnswer
                action.SecurityAnswer = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "SecurityAnswer", true);
                if (!action.SecurityAnswer) {
                    return;
                }
                ++currentIndex;

                // Parse out Locale
                action.Locale = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "Locale", true);
                if (!action.Locale) {
                    return;
                }
                ++currentIndex;

                // Parse out Subscription
                action.Subscription = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "Subscription", true);
                if (!action.Subscription) {
                    return;
                }
                ++currentIndex;

                // Parse out Keywords (optional
                action.Keywords = parseScriptValue(ActionTypes.CREATEUSER.FriendlyName, scriptLines[currentIndex], "Keywords", true);
                if (action.Keywords == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.CREATEUSER.FriendlyName;
                action.ActionType = ActionTypes.CREATEUSER.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.CREATEUSER.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseSigninAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":
            case "V2":

                var currentIndex = start;

                // Parse out email
                action.XblEmailAddress = parseScriptValue(ActionTypes.SIGNIN.FriendlyName, scriptLines[currentIndex], "XblEmailAddress", true);
                if (!action.XblEmailAddress) {
                    return;
                }
                ++currentIndex;

                // Parse out password (optional)
                var encodedPassword = parseScriptValue(ActionTypes.SIGNIN.FriendlyName, scriptLines[currentIndex], "XblPassword", true);
                if (encodedPassword == undefined) { // optional so could be empty string
                    return;
                } else {
                    action.XblPassword = window.atob(encodedPassword);
                }
                ++currentIndex;

                action.ActionName = ActionTypes.SIGNIN.FriendlyName;
                action.ActionType = ActionTypes.SIGNIN.Type;
                action.SetAsDefault = false; // Unsupported in V1.
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.SIGNIN.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        // The only difference in V2 is the extra SetAsDefault action
        if (version === "V2") {
            // Parse out SetAsDefault
            var setAsDefault = parseScriptValue(ActionTypes.SIGNIN.FriendlyName, scriptLines[currentIndex], "SetUserAsDefault");
            if (!setAsDefault) {
                return;
            }
            ++currentIndex;

            action.SetAsDefault = setAsDefault === "true";
        }

        return action;
    };

    function parseScriptAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out script
                action.ExternalScript = parseScriptValue(ActionTypes.SCRIPT.FriendlyName, scriptLines[currentIndex], "ScriptToRun", true);
                if (!action.ExternalScript) {
                    return;
                }
                ++currentIndex;

                // Parse out script args (optional)
                action.ScriptArguments = parseScriptValue(ActionTypes.SCRIPT.FriendlyName, scriptLines[currentIndex], "ScriptArguments");
                if (action.ScriptArguments == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.SCRIPT.FriendlyName;
                action.ActionType = ActionTypes.SCRIPT.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + ActionTypes.SCRIPT.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseUpdateAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out networkshare
                action.NetworkShare = parseScriptValue(ActionTypes.UPDATE.FriendlyName, scriptLines[currentIndex], "NetworkUpdateShare", true);
                if (!action.NetworkShare) {
                    return;
                }
                ++currentIndex;

                // parse out sandboxid
                action.SandboxId = parseScriptValue(ActionTypes.UPDATE.FriendlyName, scriptLines[currentIndex], "UpdateSandboxId");
                if (action.SandboxId == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                // parse out factoryreset
                action.FactoryReset = parseScriptValue(ActionTypes.UPDATE.FriendlyName, scriptLines[currentIndex], "UpdateFactoryReset");
                if (action.FactoryReset == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.UPDATE.FriendlyName;
                action.ActionType = ActionTypes.UPDATE.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for OS recovery update script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseUpdateLiveAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out UpdateVersion
                action.UpdateVersion = parseScriptValue(ActionTypes.UPDATE.FriendlyName, scriptLines[currentIndex], "UpdateVersion", true);
                if (!action.UpdateVersion) {
                    return;
                }
                ++currentIndex;

                // parse out sandboxid
                action.SandboxId = parseScriptValue(ActionTypes.UPDATE.FriendlyName, scriptLines[currentIndex], "UpdateSandboxId");
                if (action.SandboxId == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                // parse out factoryreset
                action.FactoryReset = parseScriptValue(ActionTypes.UPDATE.FriendlyName, scriptLines[currentIndex], "UpdateFactoryReset");
                if (action.FactoryReset == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.UPDATELIVE.FriendlyName;
                action.ActionType = ActionTypes.UPDATELIVE.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for OS recovery update from live script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseSettingActionHelper(start, version, scriptLines, settingType, settingName) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out Setting name
                action.SettingName = parseScriptValue(settingType.FriendlyName, scriptLines[currentIndex], "SettingName");
                if (!action.SettingName) {
                    return;
                }
                ++currentIndex;

                // Parse out Setting value
                action.SettingValue = parseScriptValue(settingType.FriendlyName, scriptLines[currentIndex], "SettingValue", true);
                if (!action.SettingValue) {
                    return;
                }
                ++currentIndex;

                action.ActionName = settingType.FriendlyName;
                action.ActionType = settingType.Type;

                // Check if this action requires a reboot.
                action.NeedsReboot = false;
                if (settingInfo && settingName) {
                    for (var i = 0, len = settingInfo.length; i < len; ++i) {
                        if (settingInfo[i].Name.toLowerCase() === settingName.toLowerCase()) {
                            if (settingInfo[i].RequiresReboot.toLowerCase() === "yes") {
                                action.NeedsReboot = true;
                            }
                            break;
                        }
                    }
                }

                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for " + settingType.FriendlyName + " script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseHostnameAction(start, version, scriptLines) {
        var action = parseSettingActionHelper(start, version, scriptLines, ActionTypes.HOSTNAME);

        // Hostname isn't a real setting, but we can leverage most of the shared setting code.
        // Still need to ensure it requires a reboot though.
        if (action) {
            action.NeedsReboot = true;
        }

        return action;
    };

    function parseBlockScriptsAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.BLOCKSCRIPTS, "BlockUnattendScript");
    };

    function parseBlockUsbScriptsAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.BLOCKUSBSCRIPTS, "BlockUsbUnattendScript");
    };

    function parseRunScriptsImmediatelyAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.RUNSCRIPTSIMMED, "RunUnattendScriptImmediately");
    };

    function parseAppConnectionAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.ALLOWAPPCONNECT, "AllowXboxAppConnections");
    };

    function parseDefaultAppAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.DEFAULTAPP, "DefaultApp");
    };

    function parseDefaultStorageAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.DEFAULTSTORAGE, "DefaultStorageDevice");
    };

    function parseDefaultUserAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.DEFAULTUSER, "AutoSignInUser");
    };

    function parseTimezoneAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.TIMEZONE, "TimeZone");
    };

    function parseForceGuestSmbAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.FORCEGUESTSMB, "ForceGuestSMB");
    };

    function parsePreferedLanguageAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.PREFLANG, "PreferredLanguages");
    };

    function parseGeoRegionAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.GEOREGION, "GeographicRegion");
    };

    function parseDefaultPairingAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.DEFAULTPAIRING, "AutoSignInUserControllerPairing");
    };

    function parseAllowHdrAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.ALLOWHDR, "AllowHDR");
    };

    function parseCrashDumpAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.CRASHDUMP, "CrashDumpType");
    };

    function parseExtraMemoryAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.EXTRATITLEMEM, "ExtraTitleMemory");
    };

    function parseProfilingModeAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.PROFILEMODE, "ProfilingMode");
    };

    function parseUpdatePolicyAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.UPDATEPOLICY, "OSUpdatePolicy");
    };

    function parseResolutionAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.RESOLUTION, "TVResolution");
    };

    function parseShutdownAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.SHUTDOWNTIMEOUT, "ShutdownTimeout");
    };

    function parsePowermodeAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.POWERMODE, "PowerMode");
    };

    function parseDimtimeoutAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.DIMTIMEOUT, "DimTimeout");
    };

    function parseAutobootAction(start, version, scriptLines) {
        return parseSettingActionHelper(start, version, scriptLines, ActionTypes.AUTOBOOT, "AutoBoot");
    };

    function parseCredAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out networkshare
                action.NetworkShare = parseScriptValue(ActionTypes.CRED.FriendlyName, scriptLines[currentIndex], "NetworkCredShare", true);
                if (!action.NetworkShare) {
                    return;
                }
                ++currentIndex;

                // Parse out username
                action.Username = parseScriptValue(ActionTypes.CRED.FriendlyName, scriptLines[currentIndex], "NetworkCredUsername");
                if (!action.Username) {
                    return;
                }
                ++currentIndex;

                // Parse out password
                var encodedPassword = parseScriptValue(ActionTypes.CRED.FriendlyName, scriptLines[currentIndex], "NetworkCredPassword", true);
                if (!encodedPassword) {
                    return;
                }
                ++currentIndex;

                action.Password = window.atob(encodedPassword);

                action.ActionName = ActionTypes.CRED.FriendlyName;
                action.ActionType = ActionTypes.CRED.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for network credential script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseToastAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out notification text
                var escapedToastMessage = parseScriptValue(ActionTypes.TOAST.FriendlyName, scriptLines[currentIndex], "ToastMessage");
                if (!escapedToastMessage) {
                    return;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.TOAST.FriendlyName;
                action.ActionType = ActionTypes.TOAST.Type;
                action.ToastMessage = escapedToastMessage.split("%%20").join(" ").split("%%0A").join("\n");
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for notification script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseWdpAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out if device portal should be enabled
                action.EnabledState = parseScriptValue(ActionTypes.WDP.FriendlyName, scriptLines[currentIndex], "DevicePortalEnabledState");
                if (!action.EnabledState) {
                    return;
                }
                ++currentIndex;

                // Parse out username
                action.Username = parseScriptValue(ActionTypes.WDP.FriendlyName, scriptLines[currentIndex], "DevicePortalUsername");
                if (action.Username == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                // parse out password
                var encodedPassword = parseScriptValue(ActionTypes.WDP.FriendlyName, scriptLines[currentIndex], "DevicePortalPassword", true);
                if (encodedPassword == undefined) { // optional so could be empty string
                    return;
                }
                ++currentIndex;

                action.Password = window.atob(encodedPassword);

                action.ActionName = ActionTypes.WDP.FriendlyName;
                action.ActionType = ActionTypes.WDP.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for xbox device portal script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseFactoryResetAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out if this is a full reset
                var resetString = parseScriptValue(ActionTypes.FACTORYRESET.FriendlyName, scriptLines[currentIndex], "FullReset", true);
                if (!resetString) {
                    return;
                }
                if (resetString === "true") {
                    action.FullReset = true;
                } else {
                    action.FullReset = false;
                }
                ++currentIndex;

                action.ActionName = ActionTypes.FACTORYRESET.FriendlyName;
                action.ActionType = ActionTypes.FACTORYRESET.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for factory reset script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseWdpDelCertAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                action.ActionName = ActionTypes.WDPCERTDEL.FriendlyName;
                action.ActionType = ActionTypes.WDPCERTDEL.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for clearing device portal certificate action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseWdpCertAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                var currentIndex = start;

                // Parse out cert path
                action.CertPath = parseScriptValue(ActionTypes.WDPCERT.FriendlyName, scriptLines[currentIndex], "CertPath", true);
                if (!action.CertPath) {
                    return;
                }
                ++currentIndex;

                // parse out cert password
                var encodedPassword = parseScriptValue(ActionTypes.WDPCERT.FriendlyName, scriptLines[currentIndex], "CertPassword", true);
                if (!encodedPassword) {
                    return;
                }
                ++currentIndex;

                action.CertPassword = window.atob(encodedPassword);

                action.ActionName = ActionTypes.WDPCERT.FriendlyName;
                action.ActionType = ActionTypes.WDPCERT.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for xbox device portal cert script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseWaitAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                // Parse out the wait time in seconds value.
                var firstLine = scriptLines[start];

                action.WaitTimeInSeconds = parseScriptValue(ActionTypes.WAIT.FriendlyName, firstLine, "WaitTimeInSeconds");
                if (!action.WaitTimeInSeconds) {
                    return;
                }

                action.ActionName = "Wait";
                action.ActionType = ActionTypes.WAIT.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for wait script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseDebugAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                action.ActionName = ActionTypes.DEBUG.FriendlyName;
                action.ActionType = ActionTypes.DEBUG.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for verbose logging script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseImportSettingsAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":

                // Parse out the filepath value.
                var firstLine = scriptLines[start];

                action.Filepath = parseScriptValue(ActionTypes.IMPORTSETTINGS.FriendlyName, firstLine, "Filepath", true);
                if (!action.Filepath) {
                    return;
                }

                action.ActionName = ActionTypes.IMPORTSETTINGS.FriendlyName;
                action.ActionType = ActionTypes.IMPORTSETTINGS.Type;
                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for import settings script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function parseSandboxAction(start, version, scriptLines) {
        var action = parseSettingActionHelper(start, version, scriptLines, ActionTypes.SANDBOX, "SandboxId");

        // SandboxId isn't a real setting, but we can leverage most of the shared setting code.
        // Still need to ensure it requires a reboot though.
        if (action) {
            action.NeedsReboot = true;
        }

        return action;
    };

    function parseCustomAction(start, version, scriptLines) {
        var action = {};

        switch (version) {
            case "V1":
                var firstLine = scriptLines[start];

                if (firstLine.split(' ').length < 3) {
                    Xbox.Utils._showError({ ErrorMessage: "Failed to parse custom script action. Missing name info." });
                    return;
                }
                action.ActionName = firstLine.replace("REM NAME ", "");

                // Move past the script name, and echo statement
                start += 2;

                // Parse the rest of the custom action
                var raw = "";
                while (start < scriptLines.length && scriptLines[start] !== finalLineOfAction) {
                    raw += scriptLines[start];
                    ++start;

                    if (start < scriptLines.length && scriptLines[start] !== finalLineOfAction) {
                        raw += "\r\n";
                    }
                }

                action.Raw = raw;
                action.ActionType = ActionTypes.CUSTOM.Type;

                break;
            default:
                Xbox.Utils._showError({ ErrorMessage: "Unknown version for custom script action (Version " + version + ")." });
                return;
        }

        return action;
    };

    function checkRebootHeader() {
        return "if \"%NeedsReboot%\" neq \"true\" (\r\n";
    }

    function checkRebootFooter() {
        return ") else ECHO Action skipped due to pending reboot.\r\n";
    }

    function actionHeader(action, version) {
        return "REM SCRIPTSTEP START " + action.ActionType + " " + version + "\r\n" +
               "ECHO %TIME%: Starting Action: " + ActionTypes[action.ActionType].FriendlyName + "\r\n";
    };

    var finalLineOfAction = "REM SCRIPTSTEP STOP";

    function actionFooter() {
        return finalLineOfAction + "\r\n\r\n";
    };

    function toastActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET ToastMessage=" + action.ToastMessage.split(" ").join("%%20").split("\n").join("%%0A") + "\r\n";
        actionText += "ECHO Showing notification.\r\n";
        actionText += "J:\\unattendedsetuphelper.exe toast %ToastMessage%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function wdpActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET DevicePortalEnabledState=" + action.EnabledState + "\r\n";
        actionText += "SET DevicePortalUsername=" + action.Username + "\r\n";
        actionText += "SET DevicePortalPassword=\"" + window.btoa(action.Password) + "\"\r\n";
        actionText += "J:\\unattendedsetuphelper.exe wdp %DevicePortalEnabledState% %DevicePortalUsername% %DevicePortalPassword%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function factoryResetActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET FullReset=\"" + action.FullReset + "\"\r\n";
        actionText += "IF %FullReset% equ \"true\" (\r\n"
        actionText += "    J:\\unattendedsetuphelper.exe factoryreset full\r\n";
        actionText += ") else (\r\n";
        actionText += "    J:\\unattendedsetuphelper.exe factoryreset\r\n";
        actionText += ")\r\n";
        actionText += "SET NeedsReboot=true\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function wdpDelCertActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "J:\\unattendedsetuphelper.exe wdpcert reset\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function wdpCertActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET CertPath=\"" + action.CertPath + "\"\r\n";
        actionText += "SET CertPassword=\"" + window.btoa(action.CertPassword) + "\"\r\n";
        actionText += "J:\\unattendedsetuphelper.exe wdpcert %CertPath% %CertPassword%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function waitActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET WaitTimeInSeconds=" + action.WaitTimeInSeconds + "\r\n";
        actionText += "ECHO Waiting for %WaitTimeInSeconds% seconds.\r\n";
        actionText += "Sleep %WaitTimeInSeconds%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function debugActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "ECHO ON\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function installActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET PackagePath=\"" + action.PackagePath + "\"\r\n";
        actionText += "SET DestinationDrive=" + action.DestinationDrive + "\r\n";
        actionText += "SET SpecifierOverrideString=\"" + action.SpecifierOverrideString + "\"\r\n";
        actionText += "ECHO Installing application at %PackagePath%.\r\n";
        actionText += "WdApp.exe install %PackagePath% /Drive=%DestinationDrive% %SpecifierOverrideString%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function regNetworkActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        // Remove any trailing slashes.
        while (action.AppSharePath.endsWith("\\") || action.AppSharePath.endsWith("/")) {
            action.AppSharePath = action.AppSharePath.slice(0, -1);
        }

        actionText += "SET AppSharePath=\"" + action.AppSharePath + "\"\r\n";
        actionText += "ECHO Registering application at %AppSharePath%.\r\n";
        actionText += "WdApp.exe registernetworkshare %AppSharePath%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function moveAppActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET PackageFullName=\"" + action.PackageFullName + "\"\r\n";
        actionText += "SET DestinationDrive=" + action.DestinationDrive + "\r\n";
        actionText += "ECHO Moving application %PackageFullName% to %DestinationDrive%.\r\n";
        actionText += "WdApp.exe move %PackageFullName% %DestinationDrive%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function copyAppActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET PackageFullName=\"" + action.PackageFullName + "\"\r\n";
        actionText += "SET DestinationDrive=" + action.DestinationDrive + "\r\n";
        actionText += "ECHO Copying application %PackageFullName% to %DestinationDrive%.\r\n";
        actionText += "WdApp.exe copy %PackageFullName% %DestinationDrive%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function registerAppActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET PackageFullName=\"" + action.PackageFullName + "\"\r\n";
        actionText += "SET SourceDrive=" + action.SourceDrive + "\r\n";
        actionText += "ECHO Registering application %PackageFullName% on %SourceDrive%.\r\n";
        actionText += "WdApp.exe register %PackageFullName% %SourceDrive%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function registerDriveActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET SourceDrive=" + action.SourceDrive + "\r\n";
        actionText += "ECHO Registering any applications on %SourceDrive%.\r\n";
        actionText += "WdApp.exe registerdrive %SourceDrive%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function moveDriveActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET SourceDrive=" + action.SourceDrive + "\r\n";
        actionText += "SET DestinationDrive=" + action.DestinationDrive + "\r\n";
        actionText += "ECHO Moving applications from %SourceDrive% to %DestinationDrive%.\r\n";
        actionText += "WdApp.exe movedrive %SourceDrive% %DestinationDrive%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function copyDriveActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET SourceDrive=" + action.SourceDrive + "\r\n";
        actionText += "SET DestinationDrive=" + action.DestinationDrive + "\r\n";
        actionText += "ECHO Copying applications from %SourceDrive% to %DestinationDrive%.\r\n";
        actionText += "WdApp.exe copydrive %SourceDrive% %DestinationDrive%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function regScratchV2ActionToText(action) {
        var version = "V2";
        var actionText = "";
        actionText += actionHeader(action, version);

        // Remove any trailing slashes.
        while (action.AppSharePath.endsWith("\\") || action.AppSharePath.endsWith("/")) {
            action.AppSharePath = action.AppSharePath.slice(0, -1);
        }

        actionText += "SET AppSharePath=\"" + action.AppSharePath + "\"\r\n";
        actionText += "SET DestinationFolder=\"" + action.DestinationFolder + "\"\r\n";
        actionText += "SET DestinationFolderNoQuotes=" + action.DestinationFolder + "\r\n";
        actionText += "ECHO Copying application from %AppSharePath% to %DestinationFolder% on the scratch drive.\r\n";
        actionText += "mkdir \"d:\\Titles\\%DestinationFolderNoQuotes%\"\r\n";
        actionText += "xcopy %AppSharePath% \"d:\\Titles\\%DestinationFolderNoQuotes%\" /Y /E\r\n";
        actionText += "wdapp registerscratch \"Titles\\%DestinationFolderNoQuotes%\"\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function regScratchActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        // Remove any trailing slashes.
        while (action.AppSharePath.endsWith("\\") || action.AppSharePath.endsWith("/")) {
            action.AppSharePath = action.AppSharePath.slice(0, -1);
        }

        actionText += "SET AppSharePath=\"" + action.AppSharePath + "\"\r\n";
        actionText += "SET DestinationFolder=\"" + action.DestinationFolder + "\"\r\n";
        actionText += "ECHO Copying application from %AppSharePath% to %DestinationFolder% on the title scratch drive.\r\n";
        actionText += "J:\\unattendedsetuphelper.exe mounttitlescratch\r\n";

        // We could use the return code from above to determine if title scratch exists or not,
        // but then scripts authored on new recoveries would fail on this action when run against
        // old recoveries in situations that might succeed normally, so we best effort check for
        // the directory anyways.
        actionText += "IF EXIST \"t:\\TitleDeveloperStorage\" (\r\n"
        actionText += "    mkdir t:\\TitleDeveloperStorage\\%DestinationFolder%\r\n";
        actionText += "    xcopy %AppSharePath% t:\\TitleDeveloperStorage\\%DestinationFolder% /Y /E\r\n";
        actionText += "    wdapp registertitlescratch %DestinationFolder%\r\n";
        actionText += "    J:\\unattendedsetuphelper.exe unmounttitlescratch\r\n";
        actionText += ") else (\r\n";
        actionText += "    ECHO Ensure a title is not running before performing this action\r\n";
        actionText += ")\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function launchActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET EncodedAppAumid=\"" + window.btoa(action.AppAumid) + "\"\r\n";

        actionText += checkRebootHeader();
        actionText += "ECHO Launching application " + action.AppAumid.replace('!', '^^!') + ".\r\n";
        actionText += "WdApp.exe launch %EncodedAppAumid%\r\n";
        actionText += checkRebootFooter();

        actionText += actionFooter();
        return actionText;
    };

    function clearOverlayActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET PackageFullName=\"" + action.PackageFullName + "\"\r\n";
        actionText += "ECHO Clearing the overlay folder for %PackageFullName%\r\n";
        actionText += "WdApp.exe overlayfolder %PackageFullName% /r\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function setOverlayActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET PackageFullName=\"" + action.PackageFullName + "\"\r\n";
        actionText += "SET OverlayFolder=\"" + action.OverlayFolder + "\"\r\n";
        actionText += "ECHO Setting %OverlayFolder% as an overlay folder for %PackageFullName%\r\n";
        actionText += "WdApp.exe overlayfolder %PackageFullName% %OverlayFolder%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function clearAllOverlayActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "ECHO Clearing all overlay folders.\r\n";
        actionText += "WdApp.exe overlayfolder /R\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function frontScriptActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET FilePath=\"" + action.FilePath + "\"\r\n";
        actionText += "SET ScriptName=" + action.ScriptName + "\r\n";
        actionText += "SET ButtonNumber=" + action.ButtonNumber + "\r\n";
        actionText += "SET CustomFlag=" + action.CustomFlag + "\r\n";

        actionText += "ECHO Applying " + action.ScriptName + " to button " + action.ButtonNumber + ".\r\n";

        if (action.CustomFlag === "custom") {
            actionText += "xcopy %FilePath% \"d:\\QuickActions\\\" /Y\r\n";
        }

        actionText += "WdPanel.exe script %ButtonNumber% %ScriptName% %CustomFlag%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function createUserActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET EmailAddress=\"" + action.EmailAddress + "\"\r\n";
        actionText += "SET Password=\"" + window.btoa(action.Password) + "\"\r\n";
        actionText += "SET FirstName=\"" + action.FirstName + "\"\r\n";
        actionText += "SET LastName=\"" + action.LastName + "\"\r\n";
        actionText += "SET SecurityQuestion=\"" + action.SecurityQuestion + "\"\r\n";
        actionText += "SET SecurityAnswer=\"" + action.SecurityAnswer + "\"\r\n";
        actionText += "SET Locale=\"" + action.Locale + "\"\r\n";
        actionText += "SET Subscription=\"" + action.Subscription + "\"\r\n";
        actionText += "SET Keywords=\"" + action.Keywords + "\"\r\n";
        actionText += "ECHO Creating and signing in %EmailAddress%@xboxtest.com.\r\n";
        actionText += "WdUser.exe createuser %EmailAddress% %FirstName% %LastName% %Password% %SecurityQuestion% %SecurityAnswer% %Locale% %Subscription% %Keywords%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function signinActionToText(action) {
        var version = "V2";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET XblEmailAddress=\"" + action.XblEmailAddress + "\"\r\n";
        actionText += "SET XblPassword=\"" + window.btoa(action.XblPassword) + "\"\r\n";
        actionText += "SET SetUserAsDefault=" + action.SetAsDefault + "\r\n";
        actionText += "ECHO Signing in %XblEmailAddress%.\r\n";
        actionText += "WdUser.exe signin %XblEmailAddress% %XblPassword%\r\n";
        actionText += "if \"%SetUserAsDefault%\" equ \"true\" (\r\n";
        actionText += "    WdConfig.exe set AutoSignInUser=%XblEmailAddress%\r\n";
        actionText += ")\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function execActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET ExecutableToRun=\"" + action.ExternalExecutable + "\"\r\n";
        actionText += "SET ExecutableArguments=" + action.ExecutableArguments + "\r\n";
        actionText += "ECHO Running %ExecutableToRun% %ExecutableArguments%\r\n";
        actionText += "%ExecutableToRun% %ExecutableArguments%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function scriptActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET ScriptToRun=\"" + action.ExternalScript + "\"\r\n";
        actionText += "SET ScriptArguments=" + action.ScriptArguments + "\r\n";
        actionText += "del d:\\boot\\testscripts\\externScript.cmd\r\n";
        actionText += "copy %ScriptToRun% d:\\boot\\testscripts\\externScript.cmd\r\n";
        actionText += "ECHO Running %ScriptToRun% locally.\r\n";
        actionText += "CALL d:\\boot\\testscripts\\externScript.cmd %ScriptArguments%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function updateActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET NetworkUpdateShare=\"" + action.NetworkShare + "\"\r\n";
        actionText += "SET UpdateSandboxId=" + action.SandboxId + "\r\n";
        actionText += "SET UpdateFactoryReset=" + action.FactoryReset + "\r\n";
        actionText += "J:\\unattendedsetuphelper.exe update %NetworkUpdateShare% %UpdateFactoryReset% %UpdateSandboxId%\r\n";
        actionText += "if errorlevel 0 SET SkipReboot=true\r\n"; // Don't want to reboot if we are successfully updating the OS.

        actionText += actionFooter();
        return actionText;
    };

    function updateLiveActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET UpdateVersion=\"" + action.UpdateVersion + "\"\r\n";
        actionText += "SET UpdateSandboxId=" + action.SandboxId + "\r\n";
        actionText += "SET UpdateFactoryReset=" + action.FactoryReset + "\r\n";
        actionText += "J:\\unattendedsetuphelper.exe updatelive %UpdateVersion% %UpdateFactoryReset% %UpdateSandboxId%\r\n";
        actionText += "if errorlevel 0 SET SkipReboot=true\r\n"; // Don't want to reboot if we are successfully updating the OS.

        actionText += actionFooter();
        return actionText;
    };

    function settingToTextHelper(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET SettingName=" + action.SettingName + "\r\n";
        actionText += "SET SettingValue=\"" + action.SettingValue + "\"\r\n";
        actionText += "SET CurrentSettingValue=\r\n";

        actionText += "FOR /F \"usebackq tokens=1-2*\" %%A IN (`WdConfig.exe query %SettingName% 2^>nul`) DO (\r\n";
        actionText += "    SET CurrentSettingValue=%%C\r\n";
        actionText += ")\r\n";
        actionText += "if /i \"%CurrentSettingValue%\" neq %SettingValue% (\r\n";
        actionText += "    WdConfig.exe set %SettingName%=%SettingValue%\r\n";
        if (action.NeedsReboot) {
            actionText += "    SET NeedsReboot=true\r\n";
        }
        actionText += ") else (\r\n";
        actionText += "    ECHO %SettingName% does not need to be changed.\r\n";
        actionText += ")\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function importSettingsToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET Filepath=\"" + action.Filepath + "\"\r\n";
        actionText += "SET NeedsReboot=true\r\n";
        actionText += "wdconfig.exe import %Filepath%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function credActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "SET NetworkCredShare=\"" + action.NetworkShare + "\"\r\n";
        actionText += "SET NetworkCredUsername=" + action.Username + "\r\n";
        actionText += "SET NetworkCredPassword=\"" + window.btoa(action.Password) + "\"\r\n";
        actionText += "J:\\unattendedsetuphelper.exe cred add %NetworkCredShare% %NetworkCredUsername% %NetworkCredPassword%\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function customActionToText(action) {
        var version = "V1";
        var actionText = "";
        actionText += actionHeader(action, version);

        actionText += "REM NAME " + action.ActionName + "\r\n";
        actionText += "ECHO Running custom action " + action.ActionName + " (note: if editing this action in a text editor, anything after this line but before the action end can be modified).\r\n";
        actionText += action.Raw + "\r\n";

        actionText += actionFooter();
        return actionText;
    };

    function handleAddNewAction() {
        // Show the dialog to add a new action
        var idPrefix = "xboxunattendedsetup-addnewaction";
        var actionPrefix = "-action-";
        var categoryPrefix = "-category-";
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " " + idPrefix;

        var innerHtml =
            '<h5 class="xboxunattendedsetup-scriptactions-header"> &lt/&gt Script Actions Editor<button id="xboxunattendedsetup-addnewaction-xButton" aria-label="Close Window" class="xButton">X</button></h5> \
            <form style="height:100%;"> \
                <div style="height:100%;" id ="xboxunattendedsetup-addaction-lists">';

        // Add the list items for all categories.
        innerHtml +=
            '<ul id="xboxunattendedsetup-categorytypelist" class="' + cssClassActionCategoriesList + '">';

        var firstItem = true;
        // Add all our categories.
        for (var key in CategoryTypes) {
            // Add the HTML for each category.
            var id = idPrefix + categoryPrefix + CategoryTypes[key].Type;
            var className = cssClassActionCategoryListItem;

            // Default the first category to being the active one.
            if (firstItem) {
                className += ' ' + cssClassActive;

                innerHtml +=
                    '<li id="' + id + '" class="' + className + '"> \
                            <a href="#" aria-label="selected ' + CategoryTypes[key].FriendlyName + '" id="' + id + '-a">' + CategoryTypes[key].FriendlyName + '</a> \
                        </li>';
                firstItem = false;
            }
            else {
                innerHtml +=
                    '<li id="' + id + '" class="' + className + '"> \
                            <a href="#" aria-label="' + CategoryTypes[key].FriendlyName + '" id="' + id + '-a">' + CategoryTypes[key].FriendlyName + '</a> \
                        </li>';
            }
        }
        innerHtml +=
                    '</ul>';

        innerHtml += '<div style="height:100%; width: 100%;">';
        innerHtml += '<div id="basicScrollbar" style="height: calc(100% - 75px); width: 100%;">';
        // Add the list items for all actions.
        innerHtml +=
            '<ul id="xboxunattendedsetup-actiontypelist" class="' + cssClassActionList + '">';

        firstItem = true;
        // Add all our action types.
        for (var key in ActionTypes) {
            // Add the HTML for each action.
            var id = idPrefix + actionPrefix + ActionTypes[key].Type;
            var className = cssClassActionListItem;

            // Default the first item to being the active one.
            if (firstItem) {
                className += ' ' + cssClassActive;
                firstItem = false;
                innerHtml +=
                    '<li id="' + id + '" class="' + className + '"> \
                            <a href="#" aria-label="selected' + ActionTypes[key].FriendlyName + '">' + ActionTypes[key].FriendlyName + '</a> \
                        </li>';
            }
            else {
                innerHtml +=
                    '<li id="' + id + '" class="' + className + '"> \
                            <a href="#" aria-label="' + ActionTypes[key].FriendlyName + '">' + ActionTypes[key].FriendlyName + '</a> \
                        </li>';
            }
        }
        innerHtml +=
                    '</ul>';
        innerHtml += '</div>';
        innerHtml += ' <div class="form-group" style="float:right; margin-right:20px;"> \
                    <button id="xboxunattendedsetup-addnewaction-cancel" class="' + cssClassPrimaryCommand + '" type="button">Cancel</button> \
                    <button id="xboxunattendedsetup-addnewaction-next" class="' + cssClassPrimaryCommand + '" type="button">Next</button> \
                    </div>';

        innerHtml +=
                '</div> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        $('#xboxunattendedsetup-actiontypelist').on("click", "li", function (event) {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-addnewaction");
            var actionList = overlayRoot.querySelector("#xboxunattendedsetup-actiontypelist");

            for (var i = 0; i < actionList.children.length; ++i) {
                var strippedLabel = "";
                if (actionList.children[i].children[0].ariaLabel != null) {
                    strippedLabel = actionList.children[i].children[0].ariaLabel.replace("selected ", "");
                }
                if (actionList.children[i] === event.currentTarget) {
                    actionList.children[i].className = cssClassActionListItem + ' ' + cssClassActive;
                    actionList.children[i].children[0].ariaLabel = "selected " + strippedLabel;
                } else {
                    actionList.children[i].className = cssClassActionListItem;
                    actionList.children[i].children[0].ariaLabel = strippedLabel;
                }
            };
        });

        $('#xboxunattendedsetup-categorytypelist').on("click", "li", function (event) {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-addnewaction");
            var categoryList = overlayRoot.querySelector("#xboxunattendedsetup-categorytypelist");
            var actionList = overlayRoot.querySelector("#xboxunattendedsetup-actiontypelist");

            var desiredCategory;
            for (var i = 0; i < categoryList.children.length; ++i) {
                var strippedLabel = "";
                if (categoryList.children[i].children[0].ariaLabel != null) {
                    strippedLabel = categoryList.children[i].children[0].ariaLabel.replace("selected ", "");
                }

                if (categoryList.children[i] === event.currentTarget) {
                    categoryList.children[i].className = cssClassActionCategoryListItem + ' ' + cssClassActive;
                    desiredCategory = categoryList.children[i];
                    categoryList.children[i].children[0].ariaLabel = "selected " + strippedLabel;
                } else {
                    categoryList.children[i].className = cssClassActionCategoryListItem;
                    categoryList.children[i].children[0].ariaLabel = strippedLabel;
                }
            };

            // Find the right category and hide actions which don't belong to it.
            var activeActions;
            for (var key in CategoryTypes) {
                var id = idPrefix + categoryPrefix + CategoryTypes[key].Type;
                if (desiredCategory.id === id) {
                    activeActions = CategoryTypes[key].ActiveActions;
                    break;
                }
            }

            firstItem = true;
            for (var i = 0; i < actionList.children.length; ++i) {
                var shouldShow = false;
                for (var j = 0; j < activeActions.length; ++j) {
                    var id = idPrefix + actionPrefix + activeActions[j];

                    if (actionList.children[i].id === id) {
                        shouldShow = true;
                        break;
                    }
                }
                if (shouldShow) {
                    // If this is the first item, make it active.
                    if (firstItem) {
                        actionList.children[i].className = cssClassActionListItem + ' ' + cssClassActive;
                        firstItem = false;
                    } else {
                        actionList.children[i].className = cssClassActionListItem;
                    }
                    actionList.children[i].hidden = false;
                } else {
                    actionList.children[i].hidden = "hidden";
                    actionList.children[i].className = cssClassActionListItem;
                }
            };
        });
        
        // Close the overlay on clicking the x button
        $('#xboxunattendedsetup-addnewaction-xButton').click(function () {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-addnewaction");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        // Close the overlay on cancel
        $('#xboxunattendedsetup-addnewaction-cancel').click(function () {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-addnewaction");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        $('#xboxunattendedsetup-addnewaction-next').click(function () {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-addnewaction");
            var actionList = overlayRoot.querySelector("#xboxunattendedsetup-actiontypelist");

            var desiredType;
            for (var i = 0; i < actionList.children.length; ++i) {
                if (actionList.children[i].classList.contains(cssClassActive)) {
                    desiredType = actionList.children[i];
                    break;
                }
            };

            // Find the right action type and invoke its add method.
            for (var key in ActionTypes) {
                var id = idPrefix + actionPrefix + ActionTypes[key].Type;
                if (desiredType.id === id) {
                    ActionTypes[key].AddOrEdit();
                    break;
                }
            }

            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });


        var addNewAction = document.getElementById("xboxunattendedsetup-addnewaction-category-ALL-a");
        addNewAction.focus();

    };

    // helperParams can contain the following fields:
    // existingAction - An existing action that we are modifying. Used to prepopulate fields and edited in place.
    // header - The text header for the overlay.
    // dataFieldsHtml - (optional) The HTML for gathering the required data for the action.
    // primaryDataFieldId - (optional) The field to give default focus to. If missing, Finish button will have focus.
    // prepopulateDataFieldsFunc - (optional) Function for filling in data fields from an action.
    // parseDataFieldsFunc - Function for populating an action from data fields.
    // requiredDataFieldIds - (optional) Array of fields which are required before enabling the finish button.
    function addOrEditActionHelper(helperParams) {

        // Check for required params
        if (!helperParams.header ||
            !helperParams.parseDataFieldsFunc) {
            return false;
        }

        // Show the dialog to add or edit an action
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxunattendedsetup-editaction";

        var backOrCancelText = "Back";
        if (helperParams.existingAction) {
            backOrCancelText = "Cancel";
        }

        var innerHtml = '<h5 tabindex="0" class="xboxunattendedsetup-scriptactions-header" style="margin-bottom:20px;">&lt/&gt' + helperParams.header + '<button id="xboxunattendedsetup-addnewaction-xButton" aria-label="Close Window" class="xButton">X</button></h4>';

        innerHtml += '<form style="\
            display: flex;\
            margin: 20px;\
            flex-direction: column;\
            height: calc(100%);\">';
            innerHtml += '<h4 tabindex="0" style=\"margin-bottom: 20px;\">' + helperParams.header + '</h4>';
            innerHtml += '<div class="StretchDivHeight" style="\
            display: inline-grid;\">';

            if (helperParams.dataFieldsHtml) {
                // Add the div for gathering the needed data fields.
                innerHtml += helperParams.dataFieldsHtml;
            }
            
            innerHtml += '</div>';
            innerHtml +=
            '<div class="form-group" style="text-align: right; margin-bottom: 33px;"> \
                <button id="xboxunattendedsetup-editaction-back" class="' + cssClassPrimaryCommand + '" type="button">' + backOrCancelText + '</button> \
                <button id="xboxunattendedsetup-editaction-finish" class="' + cssClassPrimaryCommand + '" type="button">Add Action</button> \
            </div> \
        </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var finishButton = overlayRoot.querySelector("#xboxunattendedsetup-editaction-finish");

        // Prepopulate if we have an existing action.
        if (helperParams.existingAction && helperParams.prepopulateDataFieldsFunc) {
            helperParams.prepopulateDataFieldsFunc(overlayRoot, helperParams.existingAction);
        }

        // Close the overlay on cancel
        $('#xboxunattendedsetup-addnewaction-xButton').click(function () {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-editaction");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        // Go back to the category page on Back if this is a new action,
        // or close the overlay if it's an existing action.
        $('#xboxunattendedsetup-editaction-back').click(function () {
            if (helperParams.existingAction) {
                var rootOverlay = document.querySelector(".xboxunattendedsetup-editaction");
                var overlay = rootOverlay.wdpControl;
                overlay._hide();
            } else {
                handleAddNewAction();
            }
        });

        // If this contains a password input, then enable the show/hide button for that field.
        var passwordInput = overlayRoot.querySelector(".password-field");

        if (passwordInput) {
            var showPasswordButton = overlayRoot.querySelector("#showpassword-button");

            if (showPasswordButton) {
                showPasswordButton.addEventListener("click", function (e) {
                    if (passwordInput.getAttribute("type") === "password") {
                        passwordInput.setAttribute("type", "text");
                        showPasswordButton.innerHTML = "hide";
                    } else {
                        passwordInput.setAttribute("type", "password");
                        showPasswordButton.innerHTML = "show";
                    }
                });
            }
        }

        // If we have required datafields, don't enable the finish button until they are filled.
        if (helperParams.requiredDataFieldIds) {
            for (var i = 0; i < helperParams.requiredDataFieldIds.length; ++i) {
                var requiredDataField = overlayRoot.querySelector("#" + helperParams.requiredDataFieldIds[i]);

                function checkRequiredDataFields() {
                    var missingField = false;
                    for (var i = 0; i < helperParams.requiredDataFieldIds.length; ++i) {
                        var requiredDataField = overlayRoot.querySelector("#" + helperParams.requiredDataFieldIds[i]);
                        if (!requiredDataField.value) {
                            missingField = true;
                            break;
                        }
                    }

                    if (missingField) {
                        finishButton.disabled = true;
                    } else {
                        finishButton.disabled = false;
                    }
                };

                // Add event listeners for keyup as well as change (we don't get a keyup in some autocomplete
                // scenarios but we don't get a change until focus changes).
                requiredDataField.addEventListener("keyup",
                    // Only enable the button if there is text in all the required textboxes.
                    checkRequiredDataFields,
                    false);

                requiredDataField.addEventListener("change",
                    // Only enable the button if there is text in all the required textboxes.
                    checkRequiredDataFields,
                    false);
            }

            finishButton.disabled = true;
            // Run this once to initialize the button state if this is for an existing action.
            if (helperParams.existingAction) {
                checkRequiredDataFields();
            }
        }

        // If we have both a free text and normal select field controlled by a radio
        // control, then disable the inactive element.
        if (helperParams.primaryDataFieldId) {
            var primaryDataField = overlayRoot.querySelector("#" + helperParams.primaryDataFieldId);
            var freeFormPrimaryDataField = overlayRoot.querySelector("#" + helperParams.primaryDataFieldId + "-freetext");
            var freeTextRadioElement = overlayRoot.querySelector("#wdp-xbox-setting-value-freeform");
            var normalSelectRadioElement = overlayRoot.querySelector("#wdp-xbox-setting-value-normal");

            if (primaryDataField &&
                freeFormPrimaryDataField &&
                freeTextRadioElement) {

                if (normalSelectRadioElement.checked) {
                    freeFormPrimaryDataField.disabled = true;
                    primaryDataField.disabled = false;
                } else {
                    freeFormPrimaryDataField.disabled = false;
                    primaryDataField.disabled = true;
                }

                freeTextRadioElement.addEventListener("change",
                    // Only enable the button if there is text in all the required textboxes.
                    function(e) {
                        if (freeTextRadioElement.checked) {
                            freeFormPrimaryDataField.disabled = false;
                            primaryDataField.disabled = true;
                        }
                    },
                    false);

                normalSelectRadioElement.addEventListener("change",
                    // Only enable the button if there is text in all the required textboxes.
                    function(e) {
                        if (normalSelectRadioElement.checked) {
                            freeFormPrimaryDataField.disabled = true;
                            primaryDataField.disabled = false;
                        }
                    },
                    false);
            }
        }

        $('#xboxunattendedsetup-editaction-finish').click(function () {
            var rootOverlay = document.querySelector(".xboxunattendedsetup-editaction");

            var action = helperParams.parseDataFieldsFunc(rootOverlay, helperParams.existingAction);

            if (action) {
                if (!helperParams.existingAction) {
                    // Set the action id to one larger than the previous largest action id.
                    var nextActionId = 0;
                    for (var i = 0; i < actions.length; ++i) {
                        if (parseInt(actions[i].ActionId) >= nextActionId) {
                            nextActionId = parseInt(actions[i].ActionId) + 1;
                        }
                    }
                    action.ActionId = nextActionId.toString();
                    actions.push(action);
                }

                refreshActionList(actions);

                // Now close the overlay
                var rootOverlay = document.querySelector(".xboxunattendedsetup-editaction");
                var overlay = rootOverlay.wdpControl;
                overlay._hide();
            }
        });

        if (helperParams.primaryDataFieldId) {
            var primaryDataField = overlayRoot.querySelector("#" + helperParams.primaryDataFieldId);
            primaryDataField.focus();
        } else {
            finishButton.focus();
        }
    };

    function addOrEditSettingActionDetailsHelper(existingAction, settingType, settingName, defaults, allowFreeText) {

        var setting = false;
        if (settingInfo) {
            for (var i = 0, len = settingInfo.length; i < len; ++i) {
                if (settingInfo[i].Name.toLowerCase() === settingName.toLowerCase()) {
                    setting = settingInfo[i];

                    // Update the setting in case we have new values.
                    if (setting.Category &&
                        Wdp.Utils.Xbox.Settings.settingsByDisplayCategory &&
                        Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[setting.Category.toLowerCase()][setting.Name.toLowerCase()]) {

                        setting = Wdp.Utils.Xbox.Settings.settingsByDisplayCategory[setting.Category.toLowerCase()][setting.Name.toLowerCase()];
                    }
                    break;
                }
            }
        }

        if (!setting) {
            if (!defaults) {
                Xbox.Utils._showError({ ErrorMessage: "Failed to get information about this setting from your console. Make sure your console supports this setting so data fields can be populated correctly." });
                return;
            } else {
                setting = defaults;
            }
        }

        var settingLabelsInCategory = Wdp.Utils.Xbox.Settings.settingLabelsByDisplayCategory[setting.Category.toLowerCase()];

        // This will get replaced if we can find a better label
        var header = "Set " + settingName;
        if (settingLabelsInCategory) {
            // Loop through the settings in the current category to find the label for this one.
            for (var i = 0, len = settingLabelsInCategory.length; i < len; ++i) {
                if (settingLabelsInCategory[i][0].toLowerCase() === settingName.toLowerCase()) {
                    header = settingLabelsInCategory[i][1];
                }
            }
        }

        var primaryDataField = "xboxunattendedsetup-action-settingvalue";

        var dataFieldsHtml =
            '<div> \
                <div class="form-group">';

        requiredDataFieldIds = undefined;

        if (allowFreeText) {
            if (setting.Type == "Bool") {
                // This doesn't make sense, so if someone messes up and tries to set this, let's ignore it.
                allowFreeText = false;
            } else {
                dataFieldsHtml += '<div>' +
                                  '<input type="radio" name="settingValueField" id="wdp-xbox-setting-value-normal" checked />' +
                                  '<label for="wdp-xbox-setting-value-normal">Choose a value:</label>';
            }
        }

        if (setting.Type === "Text") {
            dataFieldsHtml += '<input id="' + primaryDataField + '" type="text"/>';
            requiredDataFieldIds = [primaryDataField];
        } else if (setting.Type === "Number") {
            dataFieldsHtml += '<input id="' + primaryDataField + '" type="number" min="' + setting.Min + '" max="' + setting.Max + '" value="' + setting.Min + '"/>';
        } else if (setting.Type === "Select") {
            dataFieldsHtml += '<select id="' + primaryDataField + '">';

            for (var i = 0, len = setting.Options.length; i < len; ++i) {
                var option = setting.Options[i];

                var optionDisplayText = undefined;

                var optionDisplayTextForSetting = Wdp.Utils.Xbox.Settings.settingOptionDisplayNamesBySetting[setting.Name.toLowerCase()];

                if (optionDisplayTextForSetting) {
                    optionDisplayText = optionDisplayTextForSetting[option.toLowerCase()];
                }

                if (!optionDisplayText) {
                    optionDisplayText = option;
                }

                dataFieldsHtml += '<option value="' + option + '">' + optionDisplayText + '</option>';
            }

            dataFieldsHtml += '</select>';
        } else if (setting.Type === "Bool") {
            dataFieldsHtml += '<input id="' + primaryDataField + '" type="checkbox" />' + '<label for="' + primaryDataField + '">' + header + '</label>';
            header = settingType.FriendlyName;
        }

        if (allowFreeText) {
            dataFieldsHtml += '</div>' +
                              '<div>' +
                              '<input type="radio" name="settingValueField" id="wdp-xbox-setting-value-freeform" />' +
                              '<label for="' + primaryDataField + '">Or enter your own value:</label>';
            dataFieldsHtml += '<input id="' + primaryDataField + '-freetext" type="text"/>' +
                              '</div>';
        }

        dataFieldsHtml +=
            '   </div> \
                <br /> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);

            if (setting.Type === "Bool") {
                settingValue.checked = existingAction.SettingValue && existingAction.SettingValue !== "false";
            } else {
                settingValue.value = existingAction.SettingValue;
            }

            if (allowFreeText) {
                var settingValueAlt = overlayRoot.querySelector("#" + primaryDataField + "-freetext");
                var freeTextElement = overlayRoot.querySelector("#wdp-xbox-setting-value-freeform");

                freeTextElement.checked = true;
                settingValueAlt.value = existingAction.SettingValue;
            }
        };

        function parseFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);

            // Take the free text field instead if it's selected.
            if (allowFreeText) {
                var freeTextElement = overlayRoot.querySelector("#wdp-xbox-setting-value-freeform");

                if (freeTextElement.checked) {
                    settingValue = overlayRoot.querySelector("#" + primaryDataField + "-freetext");
                }
            }

            if (!settingValue) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = settingType.FriendlyName;
            action.ActionType = settingType.Type;
            action.SettingName = settingName;

            if (setting.Type === "Bool") {
                action.SettingValue = settingValue.checked;
            } else {
                action.SettingValue = settingValue.value;
            }

            // Check if this action requires a reboot.
            action.NeedsReboot = false;
            if (settingInfo) {
                for (var i = 0, len = settingInfo.length; i < len; ++i) {
                    if (settingInfo[i].Name.toLowerCase() === settingName.toLowerCase()) {
                        if (settingInfo[i].RequiresReboot.toLowerCase() === "yes") {
                            action.NeedsReboot = true;
                        }
                        break;
                    }
                }
            }

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: requiredDataFieldIds
        });
    };

    function addOrEditBlockScriptsActionDetails(existingAction) {
        var header = "Block unattended scripts";
        var primaryDataField = "xboxunattendedsetup-action-settingvalue";

        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <input id="' + primaryDataField + '" type="checkbox" />' + '<label for="' + primaryDataField + '">Block any more unattended scripts from running</label> \
                </div> \
                <br /> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);

            settingValue.checked = existingAction.SettingValue;
        };

        function parseFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);

            if (!settingValue) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.BLOCKSCRIPTS.FriendlyName;
            action.ActionType = ActionTypes.BLOCKSCRIPTS.Type;
            action.SettingName = "BlockUnattendScript";
            action.SettingValue = settingValue.checked;
            action.NeedsReboot = false;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields
        });
    };

    function addOrEditBlockUsbScriptsActionDetails(existingAction) {
        var header = "Block USB unattended scripts";
        var primaryDataField = "xboxunattendedsetup-action-settingvalue";

        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <input id="' + primaryDataField + '" type="checkbox" />' + '<label for="' + primaryDataField +'">Block any more unattended scripts from running if they are on a USB drive</label> \
                </div> \
                <br /> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);

            settingValue.checked = existingAction.SettingValue;
        };

        function parseFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);

            if (!settingValue) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.BLOCKUSBSCRIPTS.FriendlyName;
            action.ActionType = ActionTypes.BLOCKUSBSCRIPTS.Type;
            action.SettingName = "BlockUsbUnattendScript";
            action.SettingValue = settingValue.checked;
            action.NeedsReboot = false;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields
        });
    };

    function addOrEditRunScriptsImmediatelyActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.RUNSCRIPTSIMMED, "RunUnattendScriptImmediately");
    };

    function addOrEditUpdatePolicyActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.UPDATEPOLICY, "OsUpdatePolicy");
    };

    function addOrEditAppConnectionActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.ALLOWAPPCONNECT, "AllowXboxAppConnections");
    }

    function addOrEditDefaultAppActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.DEFAULTAPP, "DefaultApp");
    }

    function addOrEditDefaultStorageActionDetails(existingAction) {
        var sourceDriveDataField = "xboxunattendedsetup-action-sourcedrive";
        var header = "Default storage device";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <select id="' + sourceDriveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);

            sourceDrive.value = existingAction.SettingValue;
        };

        function parseFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.SettingName = "DefaultStorageDevice";
            action.SettingValue = sourceDrive.value;
            action.ActionName = ActionTypes.DEFAULTSTORAGE.FriendlyName;
            action.ActionType = ActionTypes.DEFAULTSTORAGE.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: sourceDriveDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [sourceDriveDataField]
        });
    }

    function addOrEditDefaultUserActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.DEFAULTUSER, "AutoSignInUser", false, true);
    }

    function addOrEditTimezoneActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.TIMEZONE, "TimeZone");
    }

    function addOrEditForceGuestSmbActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.FORCEGUESTSMB, "ForceGuestSMB");
    }

    function addOrEditPreferedLanguageActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.PREFLANG, "PreferredLanguages");
    }

    function addOrEditGeoRegionActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.GEOREGION, "GeographicRegion");
    }

    function addOrEditDefaultPairingActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.DEFAULTPAIRING, "AutoSignInUserControllerPairing");
    }

    function addOrEditAllowHdrActionDetails(existingAction) {
        // setup default for consoles which don't support HDR
        var defaults = {"Category":"Video", "Type":"Bool"};
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.ALLOWHDR, "AllowHDR", defaults);
    }

    function addOrEditCrashDumpActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.CRASHDUMP, "CrashDumpType");
    }

    function addOrEditProfilingModeActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.PROFILEMODE, "ProfilingMode");
    }

    function addOrEditExtraMemoryActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.EXTRATITLEMEM, "ExtraTitleMemory");
    }

    function addOrEditResolutionActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.RESOLUTION, "TVResolution");
    };

    function addOrEditShutdownActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.SHUTDOWNTIMEOUT, "ShutdownTimeout");
    };

    function addOrEditPowermodeActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.POWERMODE, "PowerMode");
    };

    function addOrEditDimtimeoutActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.DIMTIMEOUT, "DimTimeout");
    };

    function addOrEditAutobootActionDetails(existingAction) {
        return addOrEditSettingActionDetailsHelper(existingAction, ActionTypes.AUTOBOOT, "AutoBoot");
    };

    function addOrEditHostnameActionDetails(existingAction) {

        var header = "Set the host name for the console";
        var primaryDataField = "xboxunattendedsetup-action-settingvalue";
        var checkboxDataField = "xboxunattendedsetup-action-autohostname";

        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input id="' + primaryDataField + '" type="text"/> \
                </div> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + checkboxDataField + '"\> \
                    <label for="'+ checkboxDataField +'">Automatically generate the hostname using the console serial number.</label> \
                    <label>(eg. XB-001234567890)</label> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);
            var checkboxValue = overlayRoot.querySelector("#" + checkboxDataField);

            if (existingAction.SettingValue === automaticHostnameValue) {
                checkboxValue.checked = true;
                settingValue.value = automaticHostnameFriendly;
                settingValue.disabled = true;

            } else {
                settingValue.value = existingAction.SettingValue;
            }

        };

        function parseFields(overlayRoot, existingAction) {
            var settingValue = overlayRoot.querySelector("#" + primaryDataField);
            var checkboxValue = overlayRoot.querySelector("#" + checkboxDataField);

            if (!settingValue) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.HOSTNAME.FriendlyName;
            action.ActionType = ActionTypes.HOSTNAME.Type;
            action.SettingName = "Hostname";

            if (checkboxValue.checked) {
                action.SettingValue = automaticHostnameValue;
            } else {
                action.SettingValue = settingValue.value;
            }
            action.NeedsReboot = true;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [primaryDataField]
        });

        var overlayRoot = document.querySelector(".xboxunattendedsetup-editaction");
        var finishButton = overlayRoot.querySelector("#xboxunattendedsetup-editaction-finish");
        var settingValue = overlayRoot.querySelector("#" + primaryDataField);
        var checkboxValue = overlayRoot.querySelector("#" + checkboxDataField);

        checkboxValue.addEventListener("change",
            function (e) {
                if (checkboxValue.checked) {
                    settingValue.value = automaticHostnameFriendly;
                    settingValue.disabled = true;
                    finishButton.disabled = false;
                } else if (settingValue.value === automaticHostnameFriendly) {
                    settingValue.value = "";
                    settingValue.disabled = false;
                    finishButton.disabled = true;
                }
            },
            false);
    };

    function addOrEditToastActionDetails(existingAction) {
        var primaryDataField = "xboxunattendedsetup-action-toastmessage";
        var header = "Display a notification on the console";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <textarea id="' + primaryDataField + '" \></textarea> \
                </div> \
                <br /> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var message = overlayRoot.querySelector("#" + primaryDataField);

            message.value = existingAction.ToastMessage;
        };

        function parseFields(overlayRoot, existingAction) {
            var message = overlayRoot.querySelector("#" + primaryDataField);

            if (!message.value) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.TOAST.FriendlyName;
            action.ActionType = ActionTypes.TOAST.Type;
            action.ToastMessage = message.value;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header, 
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [primaryDataField]});
    };

    function addOrEditWdpActionDetails(existingAction) {
        var primaryDataField = "xboxunattendedsetup-action-enabled";
        var usernameDataField = "xboxunattendedsetup-action-username";
        var passwordDataField = "xboxunattendedsetup-action-password";
        var useCredsDivField = "xboxunattendedsetup-action-usecredentials";
        var useCredsCheckboxField = "xboxunattendedsetup-action-usercreds-checkbox";
        var credsField = "xboxunattendedsetup-action-credentials";
        var header = "Configure Xbox Device Portal";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + primaryDataField + '"\> \
                    <label for="'+ primaryDataField +'">Enable Xbox Device Portal</label> \
                </div> \
                <div class="form-group" id="' + useCredsDivField + '" hidden> \
                    <input type="checkbox" id="' + useCredsCheckboxField + '"\> \
                    <label tabindex="0" >Require authentication</label> \
                    <div class="form-group" id="' + credsField + '" hidden> \
                        <div class="form-group"> \
                            <input type="text" id="' + usernameDataField + '" placeholder="User name"\> \
                        </div> \
                        <br /> \
                        <div class="form-group"> \
                            <input type="password" class="password-field" id="' + passwordDataField + '" placeholder="Password"\> \
                            <a href= "#" id="showpassword-button"> show</a> \
                        </div> \
                    </div> \
                </div> \
            </div>';

        function prepopWdpFields(overlayRoot, existingAction) {
            var enabled = overlayRoot.querySelector("#" + primaryDataField);
            var username = overlayRoot.querySelector("#" + usernameDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);
            var requireAuthCheckbox = overlayRoot.querySelector("#" + useCredsCheckboxField);
            var credentialsElement = overlayRoot.querySelector("#" + credsField);
            var useCredentialsElement = overlayRoot.querySelector("#" + useCredsDivField);

            enabled.checked = existingAction.EnabledState === "enable";
            username.value = existingAction.Username;
            password.value = existingAction.Password;

            if (enabled.checked) {
                useCredentialsElement.hidden = false;
            }

            if (username.value && password.value) {
                requireAuthCheckbox.checked = true;
                credentialsElement.hidden = false;
            }
        };

        function parseWdpFields(overlayRoot, existingAction) {
            var enabled = overlayRoot.querySelector("#" + primaryDataField);
            var username = overlayRoot.querySelector("#" + usernameDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);
            var requireAuthCheckbox = overlayRoot.querySelector("#" + useCredsCheckboxField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.EnabledState = enabled.checked ? "enable" : "disable";
            action.Username = (enabled.checked && requireAuthCheckbox.checked) ? username.value : "";
            action.Password = (enabled.checked && requireAuthCheckbox.checked) ? password.value : "";
            action.ActionName = ActionTypes.WDP.FriendlyName;
            action.ActionType = ActionTypes.WDP.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopWdpFields,
            parseDataFieldsFunc: parseWdpFields
        });

        // Setup listeners for showing/hiding elements when checkboxes are checked.
        var overlayRoot = document.querySelector(".xboxunattendedsetup-editaction");
        var finishButton = overlayRoot.querySelector("#xboxunattendedsetup-editaction-finish");
        var enabledCheckbox = overlayRoot.querySelector("#" + primaryDataField);
        var requireAuthCheckbox = overlayRoot.querySelector("#" + useCredsCheckboxField);
        var credentialsElement = overlayRoot.querySelector("#" + credsField);
        var useCredentialsElement = overlayRoot.querySelector("#" + useCredsDivField);
        var username = overlayRoot.querySelector("#" + usernameDataField);
        var password = overlayRoot.querySelector("#" + passwordDataField);

        function handleFinishButtonEnabledState() {
            if (!credentialsElement.hidden &&
                !useCredentialsElement.hidden &&
                !(username.value && password.value)) {
                finishButton.disabled = true;
            } else {
                finishButton.disabled = false;
            }
        };

        enabledCheckbox.addEventListener("change",
            function(e) {
                useCredentialsElement.hidden = !enabledCheckbox.checked;
                handleFinishButtonEnabledState();
            },
            false);

        requireAuthCheckbox.addEventListener("change",
            function(e) {
                credentialsElement.hidden = !requireAuthCheckbox.checked;
                handleFinishButtonEnabledState();
            },
            false);

        // Add event listeners for keyup as well as change on our username/password fields.
        username.addEventListener("keyup", handleFinishButtonEnabledState, false);
        password.addEventListener("keyup", handleFinishButtonEnabledState, false);
        username.addEventListener("change", handleFinishButtonEnabledState, false);
        password.addEventListener("change", handleFinishButtonEnabledState, false);
    };

    function addOrEditFactoryResetActionDetails(existingAction) {
        var fullResetDataField = "xboxunattendedsetup-action-fullfactoryreset";
        var header = "Perform a factory reset";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + fullResetDataField + '"\> \
                    <label for="'+ fullResetDataField +'">Perform a full reset (including hostname)</label> \
                </div> \
                <label tabindex="0" class="smaller-font">Note: It is recommended that this action only be used from a USB drive and not used in conjunction with other actions. When using this action, make sure to remove the USB drive after the console reboots to avoid performing multiple factory resets.</label> \
            </div>';

        function prepopFactoryResetFields(overlayRoot, existingAction) {
            var fullFactoryReset = overlayRoot.querySelector("#" + fullResetDataField);

            fullFactoryReset.checked = existingAction.FullReset;
        };

        function parseFactoryResetFields(overlayRoot, existingAction) {
            var fullFactoryReset = overlayRoot.querySelector("#" + fullResetDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.FullReset = fullFactoryReset.checked;
            action.ActionName = ActionTypes.FACTORYRESET.FriendlyName;
            action.ActionType = ActionTypes.FACTORYRESET.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            prepopulateDataFieldsFunc: prepopFactoryResetFields,
            parseDataFieldsFunc: parseFactoryResetFields,
        });
    };

    function addOrEditDelWdpCertActionDetails(existingAction) {
        var header = "Reset the Xbox Device Portal certificates.";

        function parseFunc(overlayRoot, existingAction) {
            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.WDPCERTDEL.FriendlyName;
            action.ActionType = ActionTypes.WDPCERTDEL.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            parseDataFieldsFunc: parseFunc
        });
    };

    function addOrEditWdpCertActionDetails(existingAction) {
        var certPathDataField = "xboxunattendedsetup-action-certpath";
        var passwordDataField = "xboxunattendedsetup-action-password";
        var header = "Add a custom certificate to Device Portal to avoid the self-signed certificate warning.";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + certPathDataField + '" placeholder="Path to .pfx file"\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="password" class="password-field" id="' + passwordDataField + '" placeholder="Password to unlock .pfx file"\> \
                    <a href= "#" id="showpassword-button"> show</a> \
                </div> \
            </div>';

        function prepopWdpCertFields(overlayRoot, existingAction) {
            var certpath = overlayRoot.querySelector("#" + certPathDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);

            certpath.value = existingAction.CertPath;
            password.value = existingAction.CertPassword;
        };

        function parseWdpCertFields(overlayRoot, existingAction) {
            var certpath = overlayRoot.querySelector("#" + certPathDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.CertPath = certpath.value;
            action.CertPassword = password.value;
            action.ActionName = ActionTypes.WDPCERT.FriendlyName;
            action.ActionType = ActionTypes.WDPCERT.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: certPathDataField,
            prepopulateDataFieldsFunc: prepopWdpCertFields,
            parseDataFieldsFunc: parseWdpCertFields,
            requiredDataFieldIds: [certPathDataField, passwordDataField]
        });
    };

    function addOrEditWaitActionDetails(existingAction) {
        var primaryDataField = "xboxunattendedsetup-action-waitseconds";
        var header = "Add a delay";
        var dataFieldsHtml =
            '<div> \
                <label for="' + primaryDataField + '">Wait time in seconds</label> \
                <input type="text" id="' + primaryDataField + '"\> \
            </div>';

        function prepopWaitFields(overlayRoot, existingAction) {
            var waitSeconds = overlayRoot.querySelector("#" + primaryDataField);
            waitSeconds.value = existingAction.WaitTimeInSeconds;
        };

        function parseWaitFields(overlayRoot, existingAction) {
            var waitSeconds = overlayRoot.querySelector("#" + primaryDataField);

            if (!waitSeconds.value) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.WaitTimeInSeconds = waitSeconds.value;
            action.ActionName = ActionTypes.WAIT.FriendlyName;
            action.ActionType = ActionTypes.WAIT.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopWaitFields,
            parseDataFieldsFunc: parseWaitFields,
            requiredDataFieldIds: [primaryDataField]
        });
    };

    function addOrEditDebugActionDetails(existingAction) {
        var header = "Enable verbose logging for debugging a script";

        function parseFunc(overlayRoot, existingAction) {
            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.DEBUG.FriendlyName;
            action.ActionType = ActionTypes.DEBUG.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            parseDataFieldsFunc: parseFunc
        });
    };

    function addOrEditExecActionDetails(existingAction) {
        var executablePathOrNameDataField = "xboxunattendedsetup-action-executable";
        var executableArgsDataField = "xboxunattendedsetup-action-args";
        var header = "Run an executable from a network share, USB drive (specified via %UsbRoot%), or local path on the console";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + executablePathOrNameDataField + '" placeholder="Specify the path to the executable."\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + executableArgsDataField + '" placeholder="Executable arguments (optional)"\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var executablePathOrName = overlayRoot.querySelector("#" + executablePathOrNameDataField);
            var executableArgs = overlayRoot.querySelector("#" + executableArgsDataField);

            executablePathOrName.value = existingAction.ExternalExecutable;
            executableArgs.value = existingAction.ExecutableArguments;
        };

        function parseFields(overlayRoot, existingAction) {
            var executablePathOrName = overlayRoot.querySelector("#" + executablePathOrNameDataField);
            var executableArgs = overlayRoot.querySelector("#" + executableArgsDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ExternalExecutable = executablePathOrName.value;
            action.ExecutableArguments = executableArgs.value;
            action.ActionName = ActionTypes.EXEC.FriendlyName;
            action.ActionType = ActionTypes.EXEC.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: executablePathOrNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [executablePathOrNameDataField]
        });
    };

    function addOrEditMoveAppActionDetails(existingAction) {
        var packageFullNameDataField = "xboxunattendedsetup-action-packagefullname";
        var driveDataField = "xboxunattendedsetup-action-drive";
        var header = "Moves a registered application to a different drive.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <input type="text" id="' + packageFullNameDataField + '" placeholder="Specify the Package Full Name of the application."\> \
                    <label for="'+ packageFullNameDataField +'">Destination drive</label> \
                    <select id="' + driveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var destDrive = overlayRoot.querySelector("#" + driveDataField);

            packageFullName.value = existingAction.PackageFullName;
            destDrive.value = existingAction.DestinationDrive;
        };

        function parseFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var destDrive = overlayRoot.querySelector("#" + driveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.PackageFullName = packageFullName.value;
            action.DestinationDrive = destDrive.value;
            action.ActionName = ActionTypes.MOVEAPP.FriendlyName;
            action.ActionType = ActionTypes.MOVEAPP.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: packageFullNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [packageFullNameDataField, driveDataField]
        });
    };

    function addOrEditCopyAppActionDetails(existingAction) {
        var packageFullNameDataField = "xboxunattendedsetup-action-packagefullname";
        var driveDataField = "xboxunattendedsetup-action-drive";
        var header = "Copies a registered application to a different drive.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <input type="text" id="' + packageFullNameDataField + '" placeholder="Specify the Package Full Name of the application."\> \
                    <label for="'+ driveDataField +'">Destination drive</label> \
                    <select id="' + driveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var destDrive = overlayRoot.querySelector("#" + driveDataField);

            packageFullName.value = existingAction.PackageFullName;
            destDrive.value = existingAction.DestinationDrive;
        };

        function parseFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var destDrive = overlayRoot.querySelector("#" + driveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.PackageFullName = packageFullName.value;
            action.DestinationDrive = destDrive.value;
            action.ActionName = ActionTypes.COPYAPP.FriendlyName;
            action.ActionType = ActionTypes.COPYAPP.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: packageFullNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [packageFullNameDataField, driveDataField]
        });
    };

    function addOrEditRegisterAppActionDetails(existingAction) {
        var packageFullNameDataField = "xboxunattendedsetup-action-packagefullname";
        var driveDataField = "xboxunattendedsetup-action-drive";
        var header = "Registers an application already present on a given drive.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <input type="text" id="' + packageFullNameDataField + '" placeholder="Specify the Package Full Name of the application."\> \
                    <label for="'+ driveDataField +'">Drive where this app resides</label> \
                    <select id="' + driveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var sourceDrive = overlayRoot.querySelector("#" + driveDataField);

            packageFullName.value = existingAction.PackageFullName;
            sourceDrive.value = existingAction.SourceDrive;
        };

        function parseFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var sourceDrive = overlayRoot.querySelector("#" + driveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.PackageFullName = packageFullName.value;
            action.SourceDrive = sourceDrive.value;
            action.ActionName = ActionTypes.REGAPP.FriendlyName;
            action.ActionType = ActionTypes.REGAPP.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: packageFullNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [packageFullNameDataField, driveDataField]
        });
    };

    function addOrEditMoveDriveActionDetails(existingAction) {
        var sourceDriveDataField = "xboxunattendedsetup-action-sourcedrive";
        var destDriveDataField = "xboxunattendedsetup-action-destdrive";
        var header = "Moves all applications from one drive to another drive. Registered applications will be registered in the new location.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <label for="' + sourceDriveDataField + '">Source drive</label> \
                    <select id="' + sourceDriveDataField + '">' + driveFieldOptions + '</select> \
                    <label for="' + destDriveDataField + '">Destination drive</label> \
                    <select id="' + destDriveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);
            var destDrive = overlayRoot.querySelector("#" + destDriveDataField);

            sourceDrive.value = existingAction.SourceDrive;
            destDrive.value = existingAction.DestinationDrive;
        };

        function parseFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);
            var destDrive = overlayRoot.querySelector("#" + destDriveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.SourceDrive = sourceDrive.value;
            action.DestinationDrive = destDrive.value;
            action.ActionName = ActionTypes.MOVEDRIVE.FriendlyName;
            action.ActionType = ActionTypes.MOVEDRIVE.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: sourceDriveDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [sourceDriveDataField, destDriveDataField]
        });
    };

    function addOrEditCopyDriveActionDetails(existingAction) {
        var sourceDriveDataField = "xboxunattendedsetup-action-sourcedrive";
        var destDriveDataField = "xboxunattendedsetup-action-destdrive";
        var header = "Copies all applications from one drive to another drive. None of the copied content will be registered.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <label for="' + sourceDriveDataField + '">Source drive</label> \
                    <select id="' + sourceDriveDataField + '">' + driveFieldOptions + '</select> \
                    <label for="' + destDriveDataField + '">Destination drive</label> \
                    <select id="' + destDriveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);
            var destDrive = overlayRoot.querySelector("#" + destDriveDataField);

            sourceDrive.value = existingAction.SourceDrive;
            destDrive.value = existingAction.DestinationDrive;
        };

        function parseFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);
            var destDrive = overlayRoot.querySelector("#" + destDriveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.SourceDrive = sourceDrive.value;
            action.DestinationDrive = destDrive.value;
            action.ActionName = ActionTypes.COPYDRIVE.FriendlyName;
            action.ActionType = ActionTypes.COPYDRIVE.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: sourceDriveDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [sourceDriveDataField, destDriveDataField]
        });
    };

    function addOrEditRegisterDriveActionDetails(existingAction) {
        var sourceDriveDataField = "xboxunattendedsetup-action-sourcedrive";
        var header = "Registers all applications on a given drive.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <label for="' + sourceDriveDataField + '">Drive</label> \
                    <select id="' + sourceDriveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);

            sourceDrive.value = existingAction.SourceDrive;
        };

        function parseFields(overlayRoot, existingAction) {
            var sourceDrive = overlayRoot.querySelector("#" + sourceDriveDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.SourceDrive = sourceDrive.value;
            action.ActionName = ActionTypes.REGDRIVE.FriendlyName;
            action.ActionType = ActionTypes.REGDRIVE.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: sourceDriveDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [sourceDriveDataField]
        });
    };

    function addOrEditRegScratchActionDetails(existingAction, isSystemScratch) {
        var sourcePathDataField = "xboxunattendedsetup-action-sourcepath";
        var folderDataField = "xboxunattendedsetup-action-folderpath";
        var header = "Copy an application from a network share or USB drive (specified via %UsbRoot%) to a folder on the" + (isSystemScratch ? "" : " title") + " scratch drive and then register it";

        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <input type="text" id="' + sourcePathDataField + '" placeholder="Specify the path to the application."\> \
                    <input type="text" id="' + folderDataField + '" placeholder="Specify the relative folder path for application destination."\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var sourcePath = overlayRoot.querySelector("#" + sourcePathDataField);
            var folder = overlayRoot.querySelector("#" + folderDataField);

            sourcePath.value = existingAction.AppSharePath;
            folder.value = existingAction.DestinationFolder;
        };

        function parseFields(overlayRoot, existingAction) {
            var sourcePath = overlayRoot.querySelector("#" + sourcePathDataField);
            var folder = overlayRoot.querySelector("#" + folderDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.AppSharePath = sourcePath.value;
            action.DestinationFolder = folder.value;

            if (isSystemScratch) {
                action.ActionName = ActionTypes.REGSCRATCHV2.FriendlyName;
                action.ActionType = ActionTypes.REGSCRATCHV2.Type;
            } else {
                action.ActionName = ActionTypes.REGSCRATCH.FriendlyName;
                action.ActionType = ActionTypes.REGSCRATCH.Type;
            }

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: sourcePathDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [sourcePathDataField, folderDataField]
        });
    };

    function addOrEditRegScratchV1ActionDetails(existingAction) {
        addOrEditRegScratchActionDetails(existingAction, false);
    };

    function addOrEditRegScratchV2ActionDetails(existingAction) {
        addOrEditRegScratchActionDetails(existingAction, true);
    };

    function addOrEditInstallActionDetails(existingAction) {
        var packageFileDataField = "xboxunattendedsetup-action-packagefile";
        var driveDataField = "xboxunattendedsetup-action-destdrive";
        var specifiersDataField = "xboxunattendedsetup-action-specifiers";
        var header = "Install a packaged application from a network share, USB drive (specified via %UsbRoot%), or local path on the console";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + packageFileDataField + '" placeholder="Specify the path to the package."\> \
                </div> \
                <div> \
                    <label for="' + driveDataField + '">Destination drive</label> \
                    <select id="' + driveDataField + '">' + driveFieldOptions + '</select> \
                </div> \
                <br /> \
                <div> \
                    <label for="' + specifiersDataField + '">Specify any optional specifiers to control which chunks in the package to install by default.</label> \
                    <input type="text" id="' + specifiersDataField + '" placeholder="Specifier string (optional)"\> \
                    <label tabinput="0" class="smaller-font">Specifier string should be in the form /[Type]=[semi-colon delimited list of values]. Available types are Languages, ContentTypes, Devices, and Tags.</label> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var packagePath = overlayRoot.querySelector("#" + packageFileDataField);
            var destDrive = overlayRoot.querySelector("#" + driveDataField);
            var speciferString = overlayRoot.querySelector("#" + specifiersDataField);

            packagePath.value = existingAction.PackagePath;
            destDrive.value = existingAction.DestinationDrive;
            speciferString.value = existingAction.SpecifierOverrideString;
        };

        function parseFields(overlayRoot, existingAction) {
            var packagePath = overlayRoot.querySelector("#" + packageFileDataField);
            var destDrive = overlayRoot.querySelector("#" + driveDataField);
            var speciferString = overlayRoot.querySelector("#" + specifiersDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.PackagePath = packagePath.value;
            action.DestinationDrive = destDrive.value;
            action.SpecifierOverrideString = speciferString.value;
            action.ActionName = ActionTypes.INSTALL.FriendlyName;
            action.ActionType = ActionTypes.INSTALL.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: packageFileDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [packageFileDataField]
        });
    };

    function addOrEditRegNetworkActionDetails(existingAction) {
        var netshareDataField = "xboxunattendedsetup-action-networkshare";
        var header = "Register an application from a network share.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <input type="text" id="' + netshareDataField + '" placeholder="Specify the network path to the application."\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var networkShare = overlayRoot.querySelector("#" + netshareDataField);

            networkShare.value = existingAction.AppSharePath;
        };

        function parseFields(overlayRoot, existingAction) {
            var networkShare = overlayRoot.querySelector("#" + netshareDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.AppSharePath = networkShare.value;
            action.ActionName = ActionTypes.REGNET.FriendlyName;
            action.ActionType = ActionTypes.REGNET.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: netshareDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [netshareDataField]
        });
    };

    function addOrEditLaunchActionDetails(existingAction) {
        var aumidDataField = "xboxunattendedsetup-action-aumid";
        var header = "Launch an application.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <input type="text" id="' + aumidDataField + '" placeholder="Specify the AUMID for the application."\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var aumid = overlayRoot.querySelector("#" + aumidDataField);

            aumid.value = existingAction.AppAumid;
        };

        function parseFields(overlayRoot, existingAction) {
            var aumid = overlayRoot.querySelector("#" + aumidDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.AppAumid = aumid.value;
            action.ActionName = ActionTypes.LAUNCH.FriendlyName;
            action.ActionType = ActionTypes.LAUNCH.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: aumidDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [aumidDataField]
        });
    };

    function addOrEditClearOverlayActionDetails(existingAction) {
        var packageFullNameDataField = "xboxunattendedsetup-action-packagefullname";
        var header = "Clears the overlay folder for a given application.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <input type="text" id="' + packageFullNameDataField + '" placeholder="Specify the Package Full Name of the application."\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);

            packageFullName.value = existingAction.PackageFullName;
        };

        function parseFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.PackageFullName = packageFullName.value;
            action.ActionName = ActionTypes.OVERLAYCLEAR.FriendlyName;
            action.ActionType = ActionTypes.OVERLAYCLEAR.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: packageFullNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [packageFullNameDataField]
        });
    };

    function addOrEditSetOverlayActionDetails(existingAction) {
        var packageFullNameDataField = "xboxunattendedsetup-action-packagefullname";
        var overlayFolderDataField = "xboxunattendedsetup-action-overlayfolder";
        var header = "Set an overlay folder for a given application.";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    </br> \
                    <input type="text" id="' + packageFullNameDataField + '" placeholder="Specify the Package Full Name of the application."\> \
                    <input type="text" id="' + overlayFolderDataField + '" placeholder="Specify the overlay folder of the application."\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var overlayFolder = overlayRoot.querySelector("#" + overlayFolderDataField);

            packageFullName.value = existingAction.PackageFullName;
            overlayFolder.value = existingAction.OverlayFolder;
        };

        function parseFields(overlayRoot, existingAction) {
            var packageFullName = overlayRoot.querySelector("#" + packageFullNameDataField);
            var overlayFolder = overlayRoot.querySelector("#" + overlayFolderDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.PackageFullName = packageFullName.value;
            action.OverlayFolder = overlayFolder.value;
            action.ActionName = ActionTypes.OVERLAYSET.FriendlyName;
            action.ActionType = ActionTypes.OVERLAYSET.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: packageFullNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [packageFullNameDataField, overlayFolderDataField]
        });
    };

    function addOrEditClearAllOverlayActionDetails(existingAction) {
        var header = "Clears all overlay folders on the console.";

        function parseFunc(overlayRoot, existingAction) {
            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = ActionTypes.OVERLAYCLEARALL.FriendlyName;
            action.ActionType = ActionTypes.OVERLAYCLEARALL.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            parseDataFieldsFunc: parseFunc
        });
    };

    function addOrEditFrontScriptActionDetails(existingAction) {
        var filepathDataField = "xboxunattendedsetup-action-filepath";
        var buttonNumberDataField = "xboxunattendedsetup-action-buttonnumber";

        var header = "Assign a script to a front panel button.";
        var dataFieldsHtml =
            '<div> \
                <br/> \
                <div class="form-group"> \
                    <div class="xboxunattendedsetup-inline"> \
                        <label for="' + buttonNumberDataField + '" class="create-user-label">Button Number</label> \
                        <select id="' + buttonNumberDataField + '">';

        for (var i = 1; i <= 5; ++i) {
            dataFieldsHtml += '<option value="' + i + '">' + i + '</option>';
        }

        dataFieldsHtml += '</select> \
                    </div> \
                    <br/> \
                    <br/> \
                    <div class="form-group"> \
                        <label for="' + filepathDataField + '">Path to the script on a network share, USB drive (specified via %UsbRoot%), local path on the console, or the name of a built-in script: </label> \
                        <input type="text" id="' + filepathDataField + '" placeholder="Specify the path to the script."\> \
                    </div> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var filepath = overlayRoot.querySelector("#" + filepathDataField);
            var buttonNumber = overlayRoot.querySelector("#" + buttonNumberDataField);

            filepath.value = existingAction.FilePath;
            buttonNumber.value = existingAction.ButtonNumber;
        };

        function parseFields(overlayRoot, existingAction) {
            var filepath = overlayRoot.querySelector("#" + filepathDataField);
            var buttonNumber = overlayRoot.querySelector("#" + buttonNumberDataField);

            // Parse out the filename (remove any slashes and drop the extension)
            var scriptName = filepath.value.split('\\').pop().split('/').pop();

            if (scriptName.indexOf(".") !== -1) {
                scriptName = scriptName.split(".").slice(0, -1).join(".");
            }

            // If this wasn't a path, it must be a built in script.
            var isBuiltIn = scriptName === filepath.value;

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.FilePath = filepath.value;
            action.ScriptName = scriptName;
            action.ButtonNumber = buttonNumber.value;
            action.CustomFlag = isBuiltIn ? "" : "custom";
            action.ActionName = ActionTypes.FRONTSCRIPT.FriendlyName;
            action.ActionType = ActionTypes.FRONTSCRIPT.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: filepathDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [filepathDataField]
        });
    };

    function addOrEditCreateUserActionDetails(existingAction) {
        var emailDataField = "xboxunattendedsetup-action-email";
        var checkboxDataField = "xboxunattendedsetup-action-autousername";
        var passwordDataField = "xboxunattendedsetup-action-password";
        var firstNameDataField = "xboxunattendedsetup-action-firstname";
        var lastNameDataField = "xboxunattendedsetup-action-lastname";
        var securityQuestionDataField = "xboxunattendedsetup-action-securityquestion";
        var securityAnswerDataField = "xboxunattendedsetup-action-securityanswer";
        var localeDataField = "xboxunattendedsetup-action-locale";
        var subscriptionDataField = "xboxunattendedsetup-action-subscription";
        var keywordsDataField = "xboxunattendedsetup-action-keywords";
        var header = "Create a new Xbox Live user and sign them in on this console.";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="xboxunattendedsetup-inline"> \
                    <label for="' + emailDataField + '" class="create-user-label">Email</label> \
                    <input type="text" id="' + emailDataField + '" placeholder="Specify the email address for the user."\> \
                    <label tabindex="0" class="create-user-label">@xboxtest.com</label> \
                </div> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + checkboxDataField + '"\> \
                    <label for="' + checkboxDataField + '" class="smaller-font">Automatically generate a random account name from the console serial number.</label> \
                    <label tabindex="0" class="smaller-font">(eg. XB-001234567890-123@xboxtest.com)</label> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <div class="xboxunattendedsetup-inline"> \
                        <label for="' + passwordDataField + '" class="create-user-label">Password</label> \
                        <input type="password" class="password-field" id="' + passwordDataField + '" placeholder="Specify the password for the user."\> \
                        <a href= "#" id="showpassword-button"> show</a> \
                    </div> \
                    <label tabindex="0" class="smaller-font">Note: Password must be 8 to 16 characters and contain at least 1 uppercase letter and 1 symbol ($#%^@)</label> \
                </div> \
                <h4>Advanced</h4> \
                <div class="xboxunattendedsetup-inline"> \
                    <label for="' + firstNameDataField + '" class="create-user-label">First name</label> \
                    <input type="text" id="' + firstNameDataField + '" value="Test"\> \
                </div> \
                <div class="xboxunattendedsetup-inline"> \
                    <label for="' + lastNameDataField + '" class="create-user-label">Last name</label> \
                    <input type="text" id="' + lastNameDataField + '" value="Account"\> \
                </div> \
                <div class="xboxunattendedsetup-inline"> \
                    <label for="' + securityQuestionDataField + '" class="create-user-label">Secret question</label> \
                    <input type="text" id="' + securityQuestionDataField + '" value="What is your favorite hobby?"\> \
                </div> \
                <div class="xboxunattendedsetup-inline"> \
                    <label for="' + securityAnswerDataField + '" class="create-user-label">Secret answer</label> \
                    <input type="text" id="' + securityAnswerDataField + '" value="secret123"\> \
                </div> \
                <div class="xboxunattendedsetup-inline-select"> \
                    <label for="' + localeDataField + '" class="create-user-label">Country / Locale</label> \
                    <select class="create-user-select" id="' + localeDataField + '"> \
                        <option value="es-AR">Argentina (es-AR)</option> \
                        <option value="en-AU">Australia (en-AU)</option> \
                        <option value="de-AT">Austria (de-AT)</option> \
                        <option value="fr-BE">Belgium (fr-BE)</option> \
                        <option value="pt-BR">Brazil (pt-BR)</option> \
                        <option value="en-CA">Canada (en-CA)</option> \
                        <option value="es-CL">Chile (es-CL)</option> \
                        <option value="zh-CN">China (zh-CN)</option> \
                        <option value="es-CO">Colombia (es-CO)</option> \
                        <option value="en-CZ">Czech Republic (en-CZ)</option> \
                        <option value="da-DK">Denmark (da-DK)</option> \
                        <option value="fi-FI">Finland (fi-FI)</option> \
                        <option value="fr-FR">France (fr-FR)</option> \
                        <option value="de-DE">Germany (de-DE)</option> \
                        <option value="en-GR">Greece (en-GR)</option> \
                        <option value="en-HK">Hong Kong SAR (en-HK)</option> \
                        <option value="zh-HK">Hong Kong SAR (zh-HK)</option> \
                        <option value="en-HU">Hungary (en-HU)</option> \
                        <option value="en-IN">India (en-IN)</option> \
                        <option value="en-IL">Israel (en-IL)</option> \
                        <option value="it-IT">Italy (it-IT)</option> \
                        <option value="ja-JP">Japan (ja-JP)</option> \
                        <option value="es-MX">Mexico (es-MX)</option> \
                        <option value="nl-NL">Netherlands (nl-NL)</option> \
                        <option value="en-NZ">New Zealand (en-NZ)</option> \
                        <option value="nb-NO">Norway (nb-NO)</option> \
                        <option value="pl-PL">Poland (pl-PL)</option> \
                        <option value="pt-PT">Portugal (pt-PT)</option> \
                        <option value="en-IE">Republic of Ireland (en-IE)</option> \
                        <option value="ru-RU">Russia (ru-RU)</option> \
                        <option value="en-SA">Saudi Arabia (en-SA)</option> \
                        <option value="en-SG">Singapore (en-SG)</option> \
                        <option value="zh-SG">Singapore (zh-SG)</option> \
                        <option value="en-SK">Slovakia (en-SK)</option> \
                        <option value="en-ZA">South Africa (en-ZA)</option> \
                        <option value="ko-KR">South Korea (ko-KR)</option> \
                        <option value="es-ES">Spain (es-ES)</option> \
                        <option value="sv-SE">Sweden (sv-SE)</option> \
                        <option value="de-CH">Switzerland (de-CH)</option> \
                        <option value="fr-CH">Switzerland (fr-CH)</option> \
                        <option value="zh-TW">Taiwan (zh-TW)</option> \
                        <option value="tr-TR">Turkey (tr-TR)</option> \
                        <option value="en-AE">United Arab Emirates (en-AE)</option> \
                        <option value="en-GB">United Kingdom (en-GB)</option> \
                        <option selected value="en-US">United States (en-US)</option> \
                        <option value="es-US">United States (es-US)</option> \
                    </select> \
                </div> \
                <div class="xboxunattendedsetup-inline-select"> \
                    <label for="' + subscriptionDataField + '" class="create-user-label">Account type</label> \
                    <select class="create-user-select" id="' + subscriptionDataField + '"> \
                        <option selected value="Gold">Gold</option> \
                        <option value="Silver">Silver</option> \
                    </select> \
                </div> \
                <div class="form-group"> \
                    <div class="xboxunattendedsetup-inline"> \
                        <label for="' + keywordsDataField + '" class="create-user-label">Keywords</label> \
                        <input type="text" id="' + keywordsDataField + '" value=""\> \
                    </div> \
                    <label tabindex="0" class="smaller-font">Note: separate multiple keywords with a semi-colon</label> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var email = overlayRoot.querySelector("#" + emailDataField);
            var checkbox = overlayRoot.querySelector("#" + checkboxDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);
            var firstName = overlayRoot.querySelector("#" + firstNameDataField);
            var lastName = overlayRoot.querySelector("#" + lastNameDataField);
            var securityQuestion = overlayRoot.querySelector("#" + securityQuestionDataField);
            var securityAnswer = overlayRoot.querySelector("#" + securityAnswerDataField);
            var locale = overlayRoot.querySelector("#" + localeDataField);
            var subscription = overlayRoot.querySelector("#" + subscriptionDataField);
            var keywords = overlayRoot.querySelector("#" + keywordsDataField);

            if (existingAction.EmailAddress === automaticEmailAddressValue) {
                checkbox.checked = true;
                email.value = automaticEmailAddressFriendly;
                email.disabled = true;
            } else {
                email.value = existingAction.EmailAddress;
            }
            password.value = existingAction.Password;
            firstName.value = existingAction.FirstName;
            lastName.value = existingAction.LastName;
            securityQuestion.value = existingAction.SecurityQuestion;
            securityAnswer.value = existingAction.SecurityAnswer;
            locale.value = existingAction.Locale;
            subscription.value = existingAction.Subscription;
            keywords.value = existingAction.Keywords;
        };

        function parseFields(overlayRoot, existingAction) {
            var email = overlayRoot.querySelector("#" + emailDataField);
            var checkbox = overlayRoot.querySelector("#" + checkboxDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);
            var firstName = overlayRoot.querySelector("#" + firstNameDataField);
            var lastName = overlayRoot.querySelector("#" + lastNameDataField);
            var securityQuestion = overlayRoot.querySelector("#" + securityQuestionDataField);
            var securityAnswer = overlayRoot.querySelector("#" + securityAnswerDataField);
            var locale = overlayRoot.querySelector("#" + localeDataField);
            var subscription = overlayRoot.querySelector("#" + subscriptionDataField);
            var keywords = overlayRoot.querySelector("#" + keywordsDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            if (checkbox.checked) {
                action.EmailAddress = automaticEmailAddressValue;
            } else {
                action.EmailAddress = email.value;
            }
            action.Password = password.value;
            action.FirstName = firstName.value;
            action.LastName = lastName.value;
            action.SecurityQuestion = securityQuestion.value;
            action.SecurityAnswer = securityAnswer.value;
            action.Locale = locale.value;
            action.Subscription = subscription.value;
            action.Keywords = keywords.value;
            action.ActionName = ActionTypes.CREATEUSER.FriendlyName;
            action.ActionType = ActionTypes.CREATEUSER.Type;

            return action;
        };

        var requiredDataFields = [emailDataField, passwordDataField, firstNameDataField, lastNameDataField, securityQuestionDataField, securityAnswerDataField, localeDataField, subscriptionDataField];

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: emailDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: requiredDataFields
        });

        var overlayRoot = document.querySelector(".xboxunattendedsetup-editaction");
        var finishButton = overlayRoot.querySelector("#xboxunattendedsetup-editaction-finish");
        var emailValue = overlayRoot.querySelector("#" + emailDataField);
        var checkboxValue = overlayRoot.querySelector("#" + checkboxDataField);

        checkboxValue.addEventListener("change",
            function (e) {
                if (checkboxValue.checked) {
                    emailValue.value = automaticEmailAddressFriendly;
                    emailValue.disabled = true;

                    var missingField = false;
                    for (var i = 0; i < requiredDataFields.length; ++i) {
                        var requiredDataField = overlayRoot.querySelector("#" + requiredDataFields[i]);

                        if (!requiredDataField.value) {
                            missingField = true;
                            break;
                        }
                    }

                    if (missingField) {
                        finishButton.disabled = true;
                    } else {
                        finishButton.disabled = false;
                    }
                } else if (emailValue.value === automaticEmailAddressFriendly) {
                    emailValue.value = "";
                    emailValue.disabled = false;
                    finishButton.disabled = true;
                }
            },
            false);
    };

    function addOrEditSigninActionDetails(existingAction) {
        var emailDataField = "xboxunattendedsetup-action-email";
        var passwordDataField = "xboxunattendedsetup-action-password";
        var setAsDefaultDataField = "xboxunattendedsetup-action-setasdefault";
        var header = "Sign in a user on this console, adding the account if not present.";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + emailDataField + '" placeholder="Specify the email address for the user."\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="password" class="password-field" id="' + passwordDataField + '" placeholder="Specify the password for the user (optional if account is already present)."\> \
                    <a href= "#" id="showpassword-button"> show</a> \
                </div> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + setAsDefaultDataField + '"\> \
                    <label for="' + setAsDefaultDataField + '">Auto sign in</label> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var email = overlayRoot.querySelector("#" + emailDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);
            var setAsDefault = overlayRoot.querySelector("#" + setAsDefaultDataField);

            email.value = existingAction.XblEmailAddress;
            password.value = existingAction.XblPassword;
            setAsDefault.checked = existingAction.SetAsDefault;
        };

        function parseFields(overlayRoot, existingAction) {
            var email = overlayRoot.querySelector("#" + emailDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);
            var setAsDefault = overlayRoot.querySelector("#" + setAsDefaultDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.XblEmailAddress = email.value;
            action.XblPassword = password.value;
            action.SetAsDefault = setAsDefault.checked;
            action.ActionName = ActionTypes.SIGNIN.FriendlyName;
            action.ActionType = ActionTypes.SIGNIN.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: emailDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [emailDataField]
        });
    };

    function addOrEditScriptActionDetails(existingAction) {
        var scriptPathOrNameDataField = "xboxunattendedsetup-action-script";
        var scriptArgsDataField = "xboxunattendedsetup-action-args";
        var header = "Run another script from a network share, USB drive (specified via %UsbRoot%), or local path on the console";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + scriptPathOrNameDataField + '" placeholder="Specify the path to the script."\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + scriptArgsDataField + '" placeholder="Script arguments (optional)"\> \
                </div> \
            </div>';

        function prepopFields(overlayRoot, existingAction) {
            var scriptPathOrName = overlayRoot.querySelector("#" + scriptPathOrNameDataField);
            var scriptArgs = overlayRoot.querySelector("#" + scriptArgsDataField);

            scriptPathOrName.value = existingAction.ExternalScript;
            scriptArgs.value = existingAction.ScriptArguments;
        };

        function parseFields(overlayRoot, existingAction) {
            var scriptPathOrName = overlayRoot.querySelector("#" + scriptPathOrNameDataField);
            var scriptArgs = overlayRoot.querySelector("#" + scriptArgsDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ExternalScript = scriptPathOrName.value;
            action.ScriptArguments = scriptArgs.value;
            action.ActionName = ActionTypes.SCRIPT.FriendlyName;
            action.ActionType = ActionTypes.SCRIPT.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: scriptPathOrNameDataField,
            prepopulateDataFieldsFunc: prepopFields,
            parseDataFieldsFunc: parseFields,
            requiredDataFieldIds: [scriptPathOrNameDataField]
        });
    };

    function addOrEditUpdateLiveActionDetails(existingAction) {
        var updateVersionDataField = "xboxunattendedsetup-action-updateversion";
        var sandboxIdDataField = "xboxunattendedsetup-action-sandboxid";
        var factoryResetDataField = "xboxunattendedsetup-action-factoryreset";
        var header = "Update console OS recovery from Xbox Live to a specified update version";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + updateVersionDataField + '" placeholder="Specify the versionId to update to."\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + sandboxIdDataField + '" placeholder="Sandbox Id (Optional)"\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + factoryResetDataField + '"\> \
                    <label for="' + factoryResetDataField + '">Perform Factory Reset</label> \
                </div> \
            </div>';

        function prepopUpdateLiveFields(overlayRoot, existingAction) {
            var updateVersion = overlayRoot.querySelector("#" + updateVersionDataField);
            var sandboxId = overlayRoot.querySelector("#" + sandboxIdDataField);
            var factoryReset = overlayRoot.querySelector("#" + factoryResetDataField);

            updateVersion.value = existingAction.UpdateVersion;
            sandboxId.value = existingAction.SandboxId;
            factoryReset.checked = existingAction.FactoryReset === "factoryreset";
        };

        function parseUpdateLiveFields(overlayRoot, existingAction) {
            var updateVersion = overlayRoot.querySelector("#" + updateVersionDataField);
            var sandboxId = overlayRoot.querySelector("#" + sandboxIdDataField);
            var factoryReset = overlayRoot.querySelector("#" + factoryResetDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.UpdateVersion = updateVersion.value;
            action.SandboxId = sandboxId.value;
            action.FactoryReset = factoryReset.checked ? "factoryreset" : "";
            action.ActionName = ActionTypes.UPDATELIVE.FriendlyName;
            action.ActionType = ActionTypes.UPDATELIVE.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: updateVersionDataField,
            prepopulateDataFieldsFunc: prepopUpdateLiveFields,
            parseDataFieldsFunc: parseUpdateLiveFields,
            requiredDataFieldIds: [updateVersionDataField]
        });
    };

    function addOrEditUpdateActionDetails(existingAction) {
        var networkShareDataField = "xboxunattendedsetup-action-networkshare";
        var sandboxIdDataField = "xboxunattendedsetup-action-sandboxid";
        var factoryResetDataField = "xboxunattendedsetup-action-factoryreset";
        var header = "Update console OS recovery from a network share or USB drive (specified via %UsbRoot%)";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + networkShareDataField + '" placeholder="Specify the path to the update files."\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + sandboxIdDataField + '" placeholder="Sandbox Id (Optional)"\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="checkbox" id="' + factoryResetDataField + '"\> \
                    <label for="' + factoryResetDataField + '">Perform Factory Reset</label> \
                </div> \
            </div>';

        function prepopUpdateFields(overlayRoot, existingAction) {
            var networkShare = overlayRoot.querySelector("#" + networkShareDataField);
            var sandboxId = overlayRoot.querySelector("#" + sandboxIdDataField);
            var factoryReset = overlayRoot.querySelector("#" + factoryResetDataField);

            networkShare.value = existingAction.NetworkShare;
            sandboxId.value = existingAction.SandboxId;
            factoryReset.checked = existingAction.FactoryReset === "factoryreset";
        };

        function parseUpdateFields(overlayRoot, existingAction) {
            var networkShare = overlayRoot.querySelector("#" + networkShareDataField);
            var sandboxId = overlayRoot.querySelector("#" + sandboxIdDataField);
            var factoryReset = overlayRoot.querySelector("#" + factoryResetDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.NetworkShare = networkShare.value;
            action.SandboxId = sandboxId.value;
            action.FactoryReset = factoryReset.checked ? "factoryreset" : "";
            action.ActionName = ActionTypes.UPDATE.FriendlyName;
            action.ActionType = ActionTypes.UPDATE.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: networkShareDataField,
            prepopulateDataFieldsFunc: prepopUpdateFields,
            parseDataFieldsFunc: parseUpdateFields,
            requiredDataFieldIds: [networkShareDataField]
        });
    };

    function addOrEditCredActionDetails(existingAction) {
        var networkShareDataField = "xboxunattendedsetup-action-networkshare";
        var usernameDataField = "xboxunattendedsetup-action-username";
        var passwordDataField = "xboxunattendedsetup-action-password";
        var header = "Add network credentials";
        var dataFieldsHtml =
            '<div> \
                <div class="form-group"> \
                    <input type="text" id="' + networkShareDataField + '" placeholder="Specify the server name."\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + usernameDataField + '" placeholder="Username"\> \
                </div> \
                <br /> \
                <div class="form-group"> \
                    <input type="password" class="password-field" id="' + passwordDataField + '" placeholder="Password"\> \
                    <a href= "#" id="showpassword-button"> show</a> \
                </div> \
            </div>';

        function prepopCredFields(overlayRoot, existingAction) {
            var networkShare = overlayRoot.querySelector("#" + networkShareDataField);
            var username = overlayRoot.querySelector("#" + usernameDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);

            networkShare.value = existingAction.NetworkShare;
            username.value = existingAction.Username;
            password.value = existingAction.Password;
        };

        function parseCredFields(overlayRoot, existingAction) {
            var networkShare = overlayRoot.querySelector("#" + networkShareDataField);
            var username = overlayRoot.querySelector("#" + usernameDataField);
            var password = overlayRoot.querySelector("#" + passwordDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.NetworkShare = networkShare.value;
            action.Username = username.value;
            action.Password = password.value;
            action.ActionName = ActionTypes.CRED.FriendlyName;
            action.ActionType = ActionTypes.CRED.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: networkShareDataField,
            prepopulateDataFieldsFunc: prepopCredFields,
            parseDataFieldsFunc: parseCredFields,
            requiredDataFieldIds: [networkShareDataField, usernameDataField, passwordDataField]
        });
    };

    function addOrEditImportSettingsActionDetails(existingAction) {
        var filepathDataField = "xboxunattendedsetup-action-filepath";
        var header = "Import settings from a file stored on the device, USB drive (specified via %UsbRoot%), or on a network share";
        var dataFieldsHtml =
            '<div> \
                <br /> \
                <div class="form-group"> \
                    <input type="text" id="' + filepathDataField + '" placeholder="Specify the full file path."\> \
                </div> \
                <br /> \
            </div>';

        function prepopImportSettingsFields(overlayRoot, existingAction) {
            var filepath = overlayRoot.querySelector("#" + filepathDataField);

            filepath.value = existingAction.Filepath;
        };

        function parseImportSettingsFields(overlayRoot, existingAction) {
            var filepath = overlayRoot.querySelector("#" + filepathDataField);

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            // Remove quotes
            var finalFilepath = filepath.value;
            finalFilepath = finalFilepath.split("\"").join("");

            action.Filepath = finalFilepath;
            action.ActionName = ActionTypes.IMPORTSETTINGS.FriendlyName;
            action.ActionType = ActionTypes.IMPORTSETTINGS.Type;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: filepathDataField,
            prepopulateDataFieldsFunc: prepopImportSettingsFields,
            parseDataFieldsFunc: parseImportSettingsFields,
            requiredDataFieldIds: [filepathDataField]
        });
    };

    function addOrEditSandboxActionDetails(existingAction) {
        var primaryDataField = "xboxunattendedsetup-action-sandboxid";
        var header = "Set sandbox";
        var dataFieldsHtml =
            '<div> \
                <label for="' + primaryDataField + '">Sandbox</label> \
                <input type="text" id="' + primaryDataField + '"\> \
            </div>';

        function prepopSandboxFields(overlayRoot, existingAction) {
            var sandbox = overlayRoot.querySelector("#" + primaryDataField);
            sandbox.value = existingAction.SettingValue;
        };

        function parseSandboxFields(overlayRoot, existingAction) {
            var sandbox = overlayRoot.querySelector("#" + primaryDataField);

            if (!sandbox.value) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.SettingName = "SandboxId";
            action.SettingValue = sandbox.value.toUpperCase();
            action.ActionName = ActionTypes.SANDBOX.FriendlyName;
            action.ActionType = ActionTypes.SANDBOX.Type;
            action.NeedsReboot = true;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopSandboxFields,
            parseDataFieldsFunc: parseSandboxFields,
            requiredDataFieldIds: [primaryDataField]
        });
    };

    function addOrEditCustomActionDetails(existingAction) {

        var primaryDataField = "xboxunattendedsetup-action-customname";
        var detailsDataField = "xboxunattendedsetup-action-customdetails";
        var header = "Configure custom action";
        var dataFieldsHtml =
            '<div> \
                <label for="' + primaryDataField + '">Action name</label> \
                <input type="text" id="' + primaryDataField + '"\> \
                <label for="' + detailsDataField + '">Custom actions</label> \
                <br \> \
                <textarea id="' + detailsDataField + '" \></textarea> \
            </div>';

        function prepopCustomFields(overlayRoot, existingAction) {
            var name = overlayRoot.querySelector("#" + primaryDataField);
            var customDetails = overlayRoot.querySelector("#" + detailsDataField);

            name.value = existingAction.ActionName;
            customDetails.value = existingAction.Raw;
        };

        function parseCustomFields(overlayRoot, existingAction) {
            var name = overlayRoot.querySelector("#" + primaryDataField);
            var customDetails = overlayRoot.querySelector("#" + detailsDataField);

            if (!name.value ||
                !customDetails.value) {
                return false;
            }

            var action = {};

            if (existingAction) {
                action = existingAction;
            }

            action.ActionName = name.value;
            action.ActionType = ActionTypes.CUSTOM.Type;
            action.Raw = customDetails.value;

            return action;
        };

        addOrEditActionHelper({
            existingAction: existingAction,
            header: header,
            dataFieldsHtml: dataFieldsHtml,
            primaryDataFieldId: primaryDataField,
            prepopulateDataFieldsFunc: prepopCustomFields,
            parseDataFieldsFunc: parseCustomFields,
            requiredDataFieldIds: [primaryDataField, detailsDataField]
        });
    };

    function resetField(e) {
        e.wrap('<form>').parent('form').trigger('reset');
        e.unwrap();
    };

    function removeAction(actionId) {
        for (var i = 0; i < actions.length; ++i) {
            if (actions[i].ActionId === actionId) {
                actions.splice(i, 1); // Remove the action from the array
                break; // Make sure to break since we just changed the array length
            }
        }

        refreshActionList(actions);
    };

    function moveUpAction(actionId) {
        // Start at index 1. If this item is already first, it can't be moved up.
        for (var i = 1; i < actions.length; ++i) {
            if (actions[i].ActionId === actionId) {
                actions.splice(i - 1, 0, actions.splice(i, 1)[0]); // Splice the action out of the array and insert it again one position back.
                break; // Make sure to break since we just changed the array length
            }
        }

        refreshActionList(actions);
    };

    function moveDownAction(actionId) {
        // Stop one from the end. If this item is already last, it can't be moved down.
        for (var i = 0; i < actions.length - 1; ++i) {
            if (actions[i].ActionId === actionId) {
                actions.splice(i + 1, 0, actions.splice(i, 1)[0]); // Splice the action out of the array and insert it again one position forward.
                break; // Make sure to break since we just changed the array length
            }
        }

        refreshActionList(actions);
    };

    function logActionTypes(actionsToLog) {
        var logActions = "";

        // Build up comma separated list of action types.
        for (var i = 0; i < actionsToLog.length; ++i) {
            if (i != 0) {
                logActions += ", ";
            }
            logActions += actionsToLog[i].ActionType;
        }

        var requestBody = { ActionTypes: logActions };
        $.ajax({
            url: "/ext/unattendedsetup/logging",
            contentType: "application/json",
            type: "post",
            data: JSON.stringify(requestBody),
            datatype: 'json',
            cache: false
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        });
    };

    function handleScriptExport() {
        if (actions) {

            logActionTypes(actions);

            var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
            var filename = (scriptNameElement.value || "UnnamedScript") + ".xboxunattend";

            var file = exportActionsToFile(scriptNameElement.value || "UnnamedScript", actions);

            var a = document.createElement("a");

            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
            else { // Others
                var url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }
        }
    }

    function handleNewScriptWithPrompt() {
        var dialog = new Wdp.Utils._showPopUp(
            "Are you sure?",
            "Starting a new script will remove any existing actions. Make sure you've exported or applied any existing actions that you want to save.",
            {
                label: "OK",
                callback: function () {
                    handleNewScript();
                    Wdp.Utils._hideVisibleOverlays();
                }
            }, {
                label: "Cancel",
                callback: Wdp.Utils._hideVisibleOverlays
            }
        );
    }

    function handleNewScript() {
        var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
        scriptNameElement.value = "";
        scriptNameElement.focus();

        // Set up the default table.
        refreshActionList();
    }

    function handleRunScript() {
        if (actions) {
            var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
            var file = exportActionsToFile(scriptNameElement.value || "TestScript", actions);
            runScriptHelper(file);
        }
    };

    function runScriptHelper(optionalScriptFile) {
        var outputElement = document.getElementById("xboxunattendedsetup-output");

        Wdp.Utils._showProgress(toolRootElement);
        outputElement.value = "Running script...";
        deployScript(optionalScriptFile, true)
        .done(function (data) {
            // Older browsers don't support JSON on the xhr so we'll
            // have to parse the result from plaintext here.
            if (!data.Output && !data.Result) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    // Do nothing. This must not be JSON.
                }
            }

            if (data.Output) {
                outputElement.value = data.Output;
            } else if (data.Result) {
                outputElement.value = "Script failed with errorCode: " + data.Result;
            } else {
                outputElement.value = "No script output was returned.";
            }
        })
        .fail(function (data) {
            outputElement.value = "Script failed to run.";
            Xbox.Utils._showError(data);
        })
        .always(function () {
            Wdp.Utils._hideProgress(toolRootElement);
        });
    };

    function deployScript(scriptFile, testRun, forFrontPanel, destFilename) {

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

        try {
            xhr.responseType = "json";
        } catch (e) {
            // Do nothing. Some older browsers don't support json as a response type.
        }

        var params = {};

        if (destFilename) {
            params = { DestinationFilename: window.btoa(destFilename) };
        }

        if (scriptFile) {
            var form_data = new FormData();
            form_data.append("script", scriptFile);
            if (forFrontPanel) {
                xhr.open('post', "/ext/unattendedsetup/quickaction?" + $.param(params), true);
            } else if (testRun) {
                xhr.open('post', "/ext/unattendedsetup/test", true);
            } else {
                xhr.open('post', "/ext/unattendedsetup/apply", true);
            }
            xhr.send(form_data);
        } else {
            // Run the script on the USB or boot location (default script)
            xhr.open('post', "/ext/unattendedsetup/default", true);
            xhr.send();
        }

        return deferred;
    };

    function handleApplyScriptWithPrompt() {
        if (actions) {

            if (!clearButton.disabled) {
                var dialog = new Wdp.Utils._showPopUp(
                    "Are you sure?",
                    "Applying this script as a boot script will replace your existing boot script. Make sure you've retrieved and exported that script if you want to save it.",
                    {
                        label: "OK",
                        callback: function () {
                            handleApplyScript();
                            Wdp.Utils._hideVisibleOverlays();
                        }
                    }, {
                        label: "Cancel",
                        callback: Wdp.Utils._hideVisibleOverlays
                    }
                );
            } else {
                handleApplyScript();
            }
        }
    };

    function handleApplyScript() {

        var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
        var file = exportActionsToFile(scriptNameElement.value || "TestScript", actions);

        Wdp.Utils._showProgress(toolRootElement);

        deployScript(file)
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function () {
            Wdp.Utils._hideProgress(toolRootElement);

            getScriptConfiguration();
        });
    };

    function handleDownloadScript() {
        Wdp.Utils._showProgress(toolRootElement);

        $.ajax({
            url: "/ext/unattendedsetup/remote",
            contentType: "application/json",
            type: "post",
            cache: false
        })
        .done(function (data) {
            var scriptText = data.Contents;

            if (scriptText) {
                var formattedScriptText = scriptText.split("\n").join("\r\n");
                var parsedActions = parseActionsFromText(formattedScriptText);
                refreshActionList(parsedActions);
            }
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function () {
            Wdp.Utils._hideProgress(toolRootElement);

            getScriptConfiguration();
        });
    };

    function handleRetrieveDefaultScriptWithPrompt() {

        if (actions && actions.length > 0) {
            var dialog = new Wdp.Utils._showPopUp(
                "Are you sure?",
                "Retrieving the default script will remove any existing actions. Make sure you've exported or applied any existing actions that you want to save.",
                {
                    label: "OK",
                    callback: function () {
                        handleRetrieveDefaultScript();
                        Wdp.Utils._hideVisibleOverlays();
                    }
                }, {
                    label: "Cancel",
                    callback: Wdp.Utils._hideVisibleOverlays
                }
            );
        } else {
            handleRetrieveDefaultScript();
        }
    }

    function handleRetrieveDefaultScript() {
        Wdp.Utils._showProgress(toolRootElement);

        $.ajax({
            url: "/ext/unattendedsetup/default",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data) {
            var scriptText = data.Contents;

            if (scriptText) {
                var formattedScriptText = scriptText.split("\n").join("\r\n");
                var parsedActions = parseActionsFromText(formattedScriptText);
                refreshActionList(parsedActions);
            }
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function () {
            Wdp.Utils._hideProgress(toolRootElement);
        });
    };

    function handleDeleteScriptWithPrompt() {
        var dialog = new Wdp.Utils._showPopUp(
            "Are you sure?",
            "Deleting the script stored on the console cannot be undone. Make sure you've retrieved and exported that script if you want to save it.",
            {
                label: "OK",
                callback: function () {
                    handleDeleteScript();
                    Wdp.Utils._hideVisibleOverlays();
                }
            }, {
                label: "Cancel",
                callback: Wdp.Utils._hideVisibleOverlays
            }
        );
    };

    function handleDeleteScript() {
        Wdp.Utils._showProgress(toolRootElement);

        $.ajax({
            url: "/ext/unattendedsetup/default",
            contentType: "application/json",
            type: "delete",
            cache: false
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function () {
            Wdp.Utils._hideProgress(toolRootElement);

            getScriptConfiguration();
        });
    };

    function getSettingsOptions() {
        Wdp.Utils._showProgress(toolRootElement);
        mainPageDiv.disabled = true;

        $.ajax({
            url: "/ext/settings",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data) {
            settingInfo = data.Settings;

            // Force our settings to refresh if possible so they don't
            // lag behind this info.
            if (Wdp.Utils.Xbox.Settings.ForceRefresh) {
                Wdp.Utils.Xbox.Settings.ForceRefresh();
            }
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function (data) {
            mainPageDiv.disabled = false;

            // This will hide the progress element when finished
            getScriptConfiguration(true);
        });

    };

    function getScriptConfiguration(isInitializing) {
        $.ajax({
            url: "/ext/unattendedsetup/configure",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data) {
            clearButton.disabled = !data.HasScript;
            retrieveButton.disabled = !data.HasScript;
            downloadButton.disabled = !data.CallDevCenter;
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function (data) {
            if (isInitializing) {
                Wdp.Utils._hideProgress(toolRootElement);
            }
        });
    };

    function refreshFrontPanelDisplayInfo() {

        $.ajax({
            url: "/ext/unattendedsetup/quickaction",
            contentType: "application/json",
            type: "get",
            cache: false
        })
        .done(function (data) {
            // Only available on certain kit types.
            if (data && data.IsAvailable && data.QuickActions && data.AssignedActions) {
                fpdAddButton.hidden = false;
                fpdMainDiv.hidden = false;

                var tableHtml = "";
                // Populate this for all 5 buttons
                for (var i = 1; i <= 5; ++i) {

                    var id = 'xboxunattendedsetup-fpd-select' + i.toString();
                    var buttonHtml =
                        '<div class="XboxUnattendedSetupButtonGroup" id="xboxunattendedsetup-fpd-' + i.toString() + '">' +
                        '   <label for="' + id + '-load" style="vertical-align: top; background: #cccccc;color: #535353; height: 30px; font-weight: bold;padding: 5px 15px 8.5px 15px;">Button ' + i.toString() + '</label>' +
                        '   <select style="vertical-align: top; color: #535353;font-weight: normal;padding: 9px; height: 30px; padding-top:2px; padding-bottom:2px; font-size: 12px;width:312px;margin-left: -5px; font-weight: 500;" id="' + id+ '">' +
                        '       <option value="None">None</option>';

                    // Add all the available quick actions
                    for (var j = 0; j < data.QuickActions.length; ++j) {
                        if (data.QuickActions[j].IsBuiltIn) {
                            // * is not valid in a file name, so we append a * for built-in actions
                            // so we can identify them later.
                            buttonHtml += '<option value="' + data.QuickActions[j].Name + '*">' + data.QuickActions[j].Name + ' (built-in)</option>';
                        } else {
                            buttonHtml += '<option value="' + data.QuickActions[j].Name + '">' + data.QuickActions[j].Name + '</option>';
                        }
                    }

                    var quickActionButtonElementPrefix = "xboxunattendedsetup-fpd-button" + i.toString();
                    buttonHtml +=
                        '   </select>' +
                        '   <button aria-label="Load to front panel button ' + i +  '" id="' + quickActionButtonElementPrefix + '-load" class="loadButton darkButton" disabled>Load</button>' +
                        '</div>';

                    tableHtml += buttonHtml;
                }

                fpdTableDiv.innerHTML = tableHtml;

                // Setup all the event listeners for the buttons, as well as defaults for the select
                for (var i = 1; i <= 5; ++i) {
                    var quickActionButtonElementPrefix = "xboxunattendedsetup-fpd-button" + i.toString();
                    var loadQuickActionButton = document.getElementById(quickActionButtonElementPrefix + "-load");
                    loadQuickActionButton.removeEventListener("click", handleLoadQuickActionWithPrompt);
                    loadQuickActionButton.addEventListener("click", handleLoadQuickActionWithPrompt, false);
                    var quickActionSelectElement = document.getElementById("xboxunattendedsetup-fpd-select" + i.toString());
                    quickActionSelectElement.removeEventListener("change", handleQuickActionChange);
                    quickActionSelectElement.addEventListener("change", handleQuickActionChange, false);

                    // Set default for the select element
                    if (data.AssignedActions.length >= i) {
                        var expectedName;
                        if (data.AssignedActions[i - 1].IsBuiltIn) {
                            expectedName = data.AssignedActions[i - 1].Name + '*';
                        } else {
                            expectedName = data.AssignedActions[i - 1].Name;
                        }

                        var foundMatch = false;
                        for (var j = 0; j < data.QuickActions.length; ++j) {
                            if (data.AssignedActions[i - 1].Name === data.QuickActions[j].Name &&
                                data.AssignedActions[i - 1].IsBuiltIn === data.QuickActions[j].IsBuiltIn) {
                                quickActionSelectElement.value = expectedName;
                                foundMatch = true;
                                break;
                            }
                        }

                        if (foundMatch && data.AssignedActions[i - 1].Name !== "None") {
                            loadQuickActionButton.disabled = false;
                        }
                    }
                }
            }
        });
    };

    function handleLoadQuickActionWithPrompt(e) {
        if (actions && actions.length > 0) {
            var dialog = new Wdp.Utils._showPopUp(
                "Are you sure?",
                "Loading a front panel button script will remove any existing actions. Make sure you've exported or applied any existing actions that you want to save.",
                {
                    label: "OK",
                    callback: function () {
                        handleLoadQuickAction(e);
                        Wdp.Utils._hideVisibleOverlays();
                    }
                }, {
                    label: "Cancel",
                    callback: Wdp.Utils._hideVisibleOverlays
                }
            );
        } else {
            handleLoadQuickAction(e);
        }
    };

    function handleLoadQuickAction(e) {
        var buttonElement = e.target;

        var buttonDiv = buttonElement.parentNode;
        var buttonIdPrefix = "xboxunattendedsetup-fpd-";
        var buttonNumber = buttonDiv.id.replace(buttonIdPrefix, "");
        var quickActionSelectElement = document.getElementById("xboxunattendedsetup-fpd-select" + buttonNumber);
        var scriptName = quickActionSelectElement.value;

        if (scriptName !== "None") {
            var scriptToLoad = scriptName.replace("*", "");
            var isBuiltIn = scriptToLoad !== scriptName;

            // Make the call to load this script
            Wdp.Utils._showProgress(toolRootElement);

            var params = { Name: window.btoa(scriptToLoad), IsBuiltIn: isBuiltIn };

            $.ajax({
                url: "/ext/unattendedsetup/quickaction?" + $.param(params),
                contentType: "application/json",
                type: "get",
                cache: false
            })
            .done(function (data) {
                var scriptText = data.Contents;

                if (scriptText) {
                    var formattedScriptText = scriptText.split("\n").join("\r\n");
                    var parsedActions = parseActionsFromText(formattedScriptText);
                    refreshActionList(parsedActions);
                }
            })
            .fail(function (data) {
                Xbox.Utils._showError(data);
            })
            .always(function () {
                Wdp.Utils._hideProgress(toolRootElement);
            });
        }
    };

    function handleQuickActionChange(e) {
        var selectElement = e.target;
        var buttonDiv = selectElement.parentNode;
        var scriptName = selectElement.value;

        var buttonIdPrefix = "xboxunattendedsetup-fpd-";
        var buttonNumber = buttonDiv.id.replace(buttonIdPrefix, "");

        var quickActionButtonElementPrefix = "xboxunattendedsetup-fpd-button" + buttonNumber;
        var loadQuickActionButton = document.getElementById(quickActionButtonElementPrefix + "-load");

        if (scriptName === "None") {
            loadQuickActionButton.disabled = true;
        } else {
            loadQuickActionButton.disabled = false;
        }

        var scriptToAssign = scriptName.replace("*", "");
        var isBuiltIn = scriptToAssign !== scriptName;

        // Make REST call to apply this script to this button
        Wdp.Utils._showProgress(toolRootElement);

        var params = { ButtonNumber: buttonNumber, Name: window.btoa(scriptToAssign), IsBuiltIn: isBuiltIn };

        $.ajax({
            url: "/ext/unattendedsetup/quickaction?" + $.param(params),
            contentType: "application/json",
            type: "post",
            cache: false
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        })
        .always(function () {
            Wdp.Utils._hideProgress(toolRootElement);
        });
    };

    function handleAddFpdScript() {
        if (actions) {
            var scriptNameElement = document.getElementById("xboxunattendedsetup-scriptname");
            var file = exportActionsToFile(scriptNameElement.value || "TestScript", actions);

            Wdp.Utils._showProgress(toolRootElement);

            deployScript(file, false, true, (scriptNameElement.value || "TestScript") + ".xboxunattend")
            .fail(function (data) {
                Xbox.Utils._showError(data);
            })
            .always(function () {
                Wdp.Utils._hideProgress(toolRootElement);

                refreshFrontPanelDisplayInfo();
            });
        }
    };

    $('.remote-front-panel-element').load('/tools/XboxRemoteFrontPanel/XboxRemoteFrontPanel.htm');

    var runScriptButton = document.getElementById("xboxunattendedsetup-runscript");
    runScriptButton.addEventListener("click", handleRunScript, false);

    var importScriptButton = document.getElementById("xboxunattendedsetup-import");
    importScriptButton.addEventListener("click", handleScriptImport, false);

    var newScriptButton = document.getElementById("xboxunattendedsetup-newscript");
    newScriptButton.addEventListener("click", handleNewScriptWithPrompt, false);

    var exportScriptButton = document.getElementById("xboxunattendedsetup-export");
    exportScriptButton.addEventListener("click", handleScriptExport, false);

    var newActionButton = document.getElementById("xboxunattendedsetup-newaction");
    newActionButton.addEventListener("click", handleAddNewAction, false);

    var importFileInput = document.getElementById("xboxunattendedsetup-importscript-input");
    importFileInput.addEventListener("change", importActionsFromFile, false);

    var applyButton = document.getElementById("xboxunattendedsetup-apply");
    applyButton.addEventListener("click", handleApplyScriptWithPrompt, false);

    var clearButton = document.getElementById("xboxunattendedsetup-delete");
    clearButton.addEventListener("click", handleDeleteScriptWithPrompt, false);

    var downloadButton = document.getElementById("xboxunattendedsetup-download");
    downloadButton.addEventListener("click", handleDownloadScript, false);

    var retrieveButton = document.getElementById("xboxunattendedsetup-retrieve");
    retrieveButton.addEventListener("click", handleRetrieveDefaultScriptWithPrompt, false);

    var actionList = document.getElementById("xboxunattendedsetup-actionlist");
    var toolRootElement = actionList.parentNode;

    var mainPageDiv = document.getElementById("xboxunattendedsetup-mainpagediv");

    var fpdAddButton = document.getElementById("xboxunattendedsetup-fpd-add");
    fpdAddButton.addEventListener("click", handleAddFpdScript, false);

    var fpdMainDiv = document.getElementById("xboxunattendedsetup-fpd-maindiv");
    var fpdTableDiv = document.getElementById("xboxunattendedsetup-fpd-buttonmappings");

    refreshFrontPanelDisplayInfo();

    var settingInfo = false;
    getSettingsOptions();

    handleNewScript();
})();
//# sourceURL=tools/XboxUnattendedSetup/XboxUnattendedSetup.js
