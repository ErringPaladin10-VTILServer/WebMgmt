﻿function XboxLiveSandboxControl(n){function u(n){var t="unknown",i="Unknown error.",r;n.responseJSON&&n.responseJSON.ErrorCode&&(t=n.responseJSON.ErrorCode);n.responseJSON&&n.responseJSON.ErrorMessage&&(i=n.responseJSON.ErrorMessage);r=new Wdp.Utils._showPopUp("Something went wrong","Error code: "+t+"<br/>Message: "+i)}function e(){$.ajax({url:sandboxUrl,cache:!1,type:"get"}).done(function(n){var i=n.Sandbox;i&&(t.value=i,f=i)}).fail(function(n){u(n)})}function l(){i.disabled=f!==t.value?!1:!0}function a(){c?o():webbRest.httpGetExpect200("/api/os/devicefamily").done(function(n){r=n.DeviceType==="Windows.Xbox";o()}).fail(function(n){u(n)})}function v(){Wdp.Utils._hideVisibleOverlays();e()}function o(){if(r)var n=new Wdp.Utils._showPopUp("Restart","Changing Sandbox requires the console to restart",{label:"Restart",callback:s},{label:"Cancel",callback:v});else s()}function s(){Wdp.Utils._hideVisibleOverlays();var n=t.value,i=JSON.stringify({Sandbox:n});$.ajax({url:sandboxUrl,cache:!1,type:"put",data:i,dataType:"json"}).done(function(n){if(r)$.post("/api/control/restart").fail(function(){var n=new Wdp.Utils._showPopUp("Error","We could not restart the target device.")});else var t=new Wdp.Utils._showPopUp("Sandbox updated",'The sandbox has been changed to "'+n.Sandbox+'"')}).fail(function(n){u(n)})}var c="",f="",t,i,r=!1,h=$("#"+n);h.length!==0&&(createTextInputWithButton(h,{labelText:"Sandbox ID",fieldId:"xboxlivesandbox-sandboxvalue_2",buttonId:"xboxlivesandbox-sandboxbutton_2",buttonText:"Save",errorId:"changeSandboxErrorText"}),t=document.getElementById("xboxlivesandbox-sandboxvalue_2"),i=document.getElementById("xboxlivesandbox-sandboxbutton_2"),i.addEventListener("click",a,!1),t.addEventListener("keyup",l,!1),t.setAttribute("placeholder","Enter sandbox"),t.setAttribute("aria-label","Save sandbox"),i.disabled=!0,e())}var sandboxUrl="/ext/xboxlive/sandbox",webbRest=new WebbRest;$(function(){new XboxLiveSandboxControl("XboxLiveSandboxSection")});
/*!
//@ sourceURL=tools/XboxLiveSandbox/XboxLiveSandbox.js
*/
