﻿function changeDumpStatus(n,t){var r=new WebbRest,i={};i.packageFullName=t;n.checked==1?r.setCrashDumpControlSettings(i):r.deleteCrashDumpControlSettings(i)}function CrashDumpManager(){function i(n,t,i,r,u){var e=new WebbRest,f={};return f.packageFullName=u.PackageFullName,e.getCrashDumpControlSettings(f).done(function(n){document.getElementById(u.PackageFullName+"Checkbox").checked=n.CrashDumpEnabled}),'<input type="checkbox" id="'+u.PackageFullName+'Checkbox" onChange="changeDumpStatus(this, \''+u.PackageFullName+'\');" aria-label="Enable crash dumps for package:'+u.PackageFullName+'"/>'}function r(n){var f=[{id:"Name",name:"Name",field:"PackageDisplayName",sortable:!0,width:250,cssClass:"tableCell",headerCssClass:"tableHeader"},{id:"PackageFullName",name:"Package Full Name",field:"PackageFullName",sortable:!0,width:500,cssClass:"tableCell",headerCssClass:"tableHeader"},{id:"Dump",name:"Crash Dumps",width:110,cssClass:"tableCell",headerCssClass:"tableHeader",formatter:i}],e={enableCellNavigation:!0,enableColumnReorder:!1,showHeaderRow:!0,syncColumnCellResize:!0,scaleHeightToDockContentParent:!0,rowHeight:36.5,headerRowHeight:40.45,gridLabel:n.gridLabel,rowHeaderName:n.rowHeaderName,rowHeaderId:n.rowHeaderId,rowHeaderColumn:n.rowHeaderColumn},r=new Slick.Data.DataView,u=new Slick.Grid("#developerAppsGrid",r,f,e);r.onRowCountChanged.subscribe(function(){u.updateRowCount();u.render()});r.onRowsChanged.subscribe(function(n,t){u.invalidateRows(t.rows);u.render()});u.onSort.subscribe(function(n,t){var i=function(n,i){return n[t.sortCol.field]>i[t.sortCol.field]?1:-1};r.sort(i,t.sortAsc)});u.setSortColumn("ProcessId",!0);$("#refreshDeveloperApps").bind("click",function(){t(r)});t(r)}function t(n){var t=new WebbRest;t.getInstalledAppPackages().done(function(t){t.InstalledPackages.sort((n,t)=>n.PackageFullName.localeCompare(t.PackageFullName));var i=t.InstalledPackages.filter((n,i)=>i>0&&t.InstalledPackages[i-1].PackageFullName==n.PackageFullName?!1:isDeveloperApp(n)?!0:!1);n.setItems(i,"PackageFullName");n.reSort()}).fail(function(){n.setItems([])})}function u(n,t,i,r,u){var f="/api/debug/dump/usermode/crashdump?"+$.param({packageFullName:u.PackageFullName,fileName:u.FileName});return'<center><a class="symbol link" style="text-decoration: none;" aria-label="Download" role="button" tabindex="0">&#xe74e;<\/a><\/center>'}function f(){return'<center><a class="symbol link" style="text-decoration: none;" aria-label="Delete" role="button" tabindex="0">&#xe74d;<\/a><\/center>'}function e(n,t,i,r,u){return""+Math.ceil(u.FileSize/1024)}function o(t){var o=[{id:"FileName",name:"File Name",field:"FileName",sortable:!0,width:360,cssClass:"tableCell",headerCssClass:"tableHeader"},{id:"FileSize",name:"File Size (KB)",sortable:!0,width:100,cssClass:"tableCell",headerCssClass:"tableHeader",formatter:e},{id:"FileDate",name:"Timestamp",field:"FileDate",sortable:!0,width:200,cssClass:"tableCell",headerCssClass:"tableHeader"},{id:"DownloadDumpFile",name:"Save",field:"Download",width:50,cssClass:"tableCell",headerCssClass:"tableHeader",formatter:u},{id:"DeleteDumpFile",name:"Delete",width:60,cssClass:"tableCell",headerCssClass:"tableHeader",formatter:f}],h={enableCellNavigation:!0,enableColumnReorder:!1,showHeaderRow:!0,syncColumnCellResize:!0,scaleHeightToDockContentParent:!0,rowHeight:36.5,headerRowHeight:40.45,gridLabel:t.gridLabel,rowHeaderName:t.rowHeaderName,rowHeaderId:t.rowHeaderId,rowHeaderColumn:t.rowHeaderColumn},i=new Slick.Data.DataView,r=new Slick.Grid("#developerAppsDumps",i,o,h);i.onRowCountChanged.subscribe(function(){r.updateRowCount();r.render()});i.onRowsChanged.subscribe(function(n,t){r.invalidateRows(t.rows);r.render()});r.onSort.subscribe(function(n,t){var r=function(n,i){return n[t.sortCol.field]>i[t.sortCol.field]?1:-1};i.sort(r,t.sortAsc)});r.setSortColumn("FileName",!0);r.onClick.subscribe(function(n){var u=r,f=u.getCellFromEvent(n),t=i.getItems()[f.row],e,o;u.getColumns()[f.cell].id==="DeleteDumpFile"&&t.Type===self.fileType&&confirm("Permanently delete "+t.FileName+"?")&&s(t.PackageFullName,t.FileName,t.ContainerId,i);u.getColumns()[f.cell].id==="DownloadDumpFile"&&(e={packageFullName:t.PackageFullName,fileName:t.FileName},t.ContainerId&&(e.containerId=t.ContainerId),o="/api/debug/dump/usermode/crashdump?"+$.param(e),window.location=o)});$("#refreshDeveloperApps").bind("click",function(){n(i)});n(i)}function s(t,i,r,u){var e=new WebbRest,f={};f.packageFullName=t;f.fileName=i;r&&(f.containerId=r);e.deleteCrashDump(f).done(function(){n(u)})}function n(n){var t=new WebbRest;t.getCrashDumpList().done(function(t){n.setItems(t.CrashDumps,"FileName");n.reSort()}).fail(function(){n.setItems([])})}r({gridLabel:"Applicable apps for enabling crash dump collection",rowHeaderName:"Name"});o({gridLabel:"Saved crash dumps",rowHeaderName:"File Name"});enableSlickGridTabbing("developerAppsGrid",!0);enableSlickGridTabbing("developerAppsDumps",!0)}var WebbRest;$(function(){CrashDumpManager()});
/*!
//@ sourceURL=tools/CrashData/CrashData.js
*/