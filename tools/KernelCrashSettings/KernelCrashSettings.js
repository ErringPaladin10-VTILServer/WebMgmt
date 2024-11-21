﻿function CrashControlSettingsManager(){var n=new WebbRest,t={},r,i;t[n.CrashControlSettings.AutoReboot]=$("#autoRebootOnBugcheck");t[n.CrashControlSettings.DumpType]=$("#crashDumpType");t[n.CrashControlSettings.Overwrite]=$("#crashDumpOverwrite");t[n.CrashControlSettings.MaxDumpCount]=$("#maxDumpCount");t[n.CrashControlSettings.DumpFileSize]=$("#dumpFileSize");$("#saveCrashControlSettings").bind("click",function(){var i={};$("#installedPackages").find("option:selected").val();i[n.CrashControlSettings.AutoReboot]=t[n.CrashControlSettings.AutoReboot].prop("checked")?1:0;i[n.CrashControlSettings.Overwrite]=t[n.CrashControlSettings.Overwrite].prop("checked")?1:0;i[n.CrashControlSettings.DumpType]=t[n.CrashControlSettings.DumpType].find("option:selected").val();i[n.CrashControlSettings.MaxDumpCount]=t[n.CrashControlSettings.MaxDumpCount].val();i[n.CrashControlSettings.DumpFileSize]=t[n.CrashControlSettings.DumpFileSize].val();n.setCrashControlSettings(i).done(function(){alert("Successfully saved crash control settings")}).fail(function(){alert("Failed to save crash control settings")})});n.getCrashControlSettings().done(function(i){t[n.CrashControlSettings.AutoReboot].prop("checked",i[n.CrashControlSettings.AutoReboot]===1);t[n.CrashControlSettings.DumpType].val(i[n.CrashControlSettings.DumpType]);t[n.CrashControlSettings.MaxDumpCount].val(i[n.CrashControlSettings.MaxDumpCount]);t[n.CrashControlSettings.Overwrite].prop("checked",i[n.CrashControlSettings.Overwrite]===1);t[n.CrashControlSettings.DumpFileSize].val(i[n.CrashControlSettings.DumpFileSize])});r=$("#crashDumpType");for(i in n.CrashControlDumpTypes)r.append($("<option>",{value:n.CrashControlDumpTypes[i].value,text:n.CrashControlDumpTypes[i].Description}))}var WebbRest;$(function(){CrashControlSettingsManager()});
/*!
//@ sourceURL=tools/KernelCrashSettings/KernelCrashSettings.js
*/
