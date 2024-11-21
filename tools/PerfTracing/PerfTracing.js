﻿function WprTracingPage(n){function nt(){t.html(w);e(f);c(!0);i.traceFileViewer.refreshGrid()}function tt(){t.html(b);e(f);c(!0)}function it(){var n=$("#customProfileCheckbox").prop("checked"),t=n?$("#profileFile").prop("files")[0]:$("#availableProfiles option:selected").val();n?ut(t):rt(t)}function rt(n){h()?r.startWPRBootTrace(n).done(function(){u()}).fail(function(){t.html(a)}):r.startWPRTrace(n).done(function(){u()}).fail(function(){t.html(l)})}function ut(n){h()?r.startCustomWPRBootTrace(n).done(function(){u()}).fail(function(){t.html(a)}):r.startCustomWPRTrace(n).done(function(){u()}).fail(function(){t.html(l)})}function u(){t.html(p);e(d);s.spin(document.getElementById("content"))}function h(){return i.showBootTraceOption?$("#autoLoggerCheckbox")[0].checked:!1}function e(n){$("#traceControl").html(n);const t=n===f;o=t;i.disableBootTracing||$("#autoLoggerCheckbox").attr("disabled",!t)}function c(n){$("#traceControl").prop("disabled",!n)}function ft(){r.getWPRTraceState().done(function(n){n.SessionType==="boot"&&$("#autoLoggerCheckbox").prop("checked",!0);(n.State==="Running"||n.State==="Rebooting")&&u()}).fail(function(){e(f)})}var i=this,r=new WebbRest,o,s,v,g,y;i.showBootTraceOption=n;o=!0;s=new Spinner({lines:13,length:5,width:4,radius:10,corners:1,rotate:0,direction:1,color:"#000",speed:1,trail:60,shadow:!1,hwaccel:!1,className:"spinner",zIndex:2e9,top:"50%",left:"50%"});i.traceFileViewer=new TraceFileViewer("#TraceFileViewer",{gridLabel:"Saved performance traces",rowHeaderName:"Name"});enableSlickGridTabbing("TraceFileViewer",!0);const t=$("#traceMessage"),p="Performance trace is in progress.",w="Trace was completed.",l="Failed to start WPR tracing.",a="Failed to start WPR boot trace. Make sure that the current profile can be run as a boot trace.",b="Failed to complete your trace. This may be because the trace was interrupted by another process.",k="Please wait while WPR trace is processed.",f="Start Trace",d="Stop Trace";i.showBootTraceOption&&(v='<p class="sectionHeader" role="heading" aria-level="4">Options<\/p>                 <input type="checkbox" id="autoLoggerCheckbox"/><label for="autoLoggerCheckbox">Enable boot tracing and restart<\/label>',$("#tracingOptions").html(v));g=$("#availableProfileCheckbox");y=$("#customProfileCheckbox");$("#traceControl").bind("click",function(){if(o)it();else{var n=h()?r.stopWPRBootTrace:r.stopWPRTrace;c(!1);t.html(k).attr("tabindex","0");n().done(function(){nt()}).fail(function(){tt()}).always(function(){s.stop()})}});$("#profileFile").change(function(){$(y).prop("checked",!0)});$.getJSON("/perfprofiles/profiles.json").done(function(n){for(var t in n.Profiles)$("#availableProfiles").append($("<option>",{value:n.Profiles[t].FileName,text:n.Profiles[t].Name}))});ft();i.traceFileViewer.refreshGrid()}function TraceFileViewer(n,t){function r(){return'<center><span class="symbol link" style="text-decoration: none;" aria-label="delete" role="button" tabindex="0">&#xe74d;<\/span><\/center>'}function u(n,t,i,r,u){return""+(u.FileSize/1048576).toFixed(2)+"MB"}function f(){return'<center><a class="symbol link" style="text-decoration: none;" aria-label="download" role="button" tabindex="0">&#xe74e;<\/a><\/center>'}function s(n){var u=[],r=n.Items,t;if(r){for(t=0;t<r.length;++t)u.push({Name:r[t].Name,FileSize:r[t].FileSize,Path:r[t].SubPath});i.grid.setData(u,!0);i.grid.render()}}function h(n){var t=i.grid,r=t.getCellFromEvent(n),u=i.grid.getData()[r.row];t.getColumns()[r.cell].id==="Delete"&&confirm("Permanently delete "+u.Name+"?")&&c(u.Name);t.getColumns()[r.cell].id==="Download"&&(window.location="/api/wpr/tracefile?filename="+u.Name)}function c(n){var t=new WebbRest;t.deleteWPRTrace(n).done(function(){i.refreshGrid()}).fail(function(t){t&&t.responseText?alert("Failed to delete "+n+". Error:"+t.responseJSON.Reason):alert("Failed to delete "+n+". Reason unknown")})}var e=[{id:"Delete",name:"Delete",field:"Delete",sortable:!0,width:50,cssClass:"tableCell",headerCssClass:"tableHeaderHidden",formatter:r},{id:"Name",name:"Name",field:"Name",sortable:!0,width:500,cssClass:"tableCell",headerCssClass:"tableHeader"},{id:"FileSize",name:"File Size",field:"FileSize",sortable:!0,width:100,cssClass:"tableCell",headerCssClass:"tableHeader",formatter:u},{id:"Download",name:"Save",field:"Download",sortable:!0,width:50,cssClass:"tableCell",headerCssClass:"tableHeader",formatter:f}],i=this,o={selectedCellCssClass:"rowSelected",enableCellNavigation:!0,enableColumnReorder:!1,showHeaderRow:!0,syncColumnCellResize:!0,scaleHeightToDockContentParent:!0,enableTextSelectionOnCells:!0,rowHeight:36.5,headerRowHeight:40.45,gridLabel:t.gridLabel,rowHeaderName:t.rowHeaderName,rowHeaderId:t.rowHeaderId,rowHeaderColumn:t.rowHeaderColumn};i.grid=new Slick.Grid(n,[],e,o);$(window).resize(i.grid.resizeCanvas.bind(i.grid));i.grid.onClick.subscribe(h.bind(i));i.refreshGrid=function(){var n=new WebbRest;n.getWPRTraces().done(function(n){s(n,i.grid)})}}var WebbRest;$(function(){var n=!0;window.DeviceSettings&&window.DeviceSettings.disableBootTracing&&(n=!1);new WprTracingPage(n)});
/*!
//@ sourceURL=tools/PerfTracing/PerfTracing.js
*/
