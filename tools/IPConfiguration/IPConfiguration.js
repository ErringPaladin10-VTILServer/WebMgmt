﻿function IpConfigViewer(){function i(){var n=new WebbRest;n.getIpConfig().done(function(n){r(n)}).fail(function(){$("#networkAdaptersInformation").empty()})}function r(n){var i=$("#networkAdaptersInformation"),t,r;if(i.empty(),n.Adapters)for(t=0;t<n.Adapters.length;t++)r=n.Adapters[t],e(r,i)}function t(n,t,i){for(var r,f,e,u=0;u<n.length;u++)r=n[u],f=$("<div>").append($("<label>").text(i.ipFieldText)),t.append(f),i.showLinkToIp?f.append($("<a>").attr("href","http://"+r.IpAddress).attr("tabindex",0).attr("aria-label",i.ipFieldText+": "+r.IpAddress).text(r.IpAddress)):f.append($("<p>").attr("aria-label",i.ipFieldText+": "+r.IpAddress).text(r.IpAddress)),i.showSubnetMask&&(e=$("<div>"),t.append(e),e.append($("<label>").text(i.maskFieldText)),e.append($("<p>").attr("aria-label",i.maskFieldText+": "+r.Mask).text(r.Mask)))}function u(n,t){for(var f=!1,u,i,r=0;r<n.length;r++)u=n[r],i=$("<div>"),t.append(i),f?i.append($("<label>")):(i.append($("<label>").text("DNS:")),f=!0),i.append($("<p>").attr("aria-label","DNS: "+u).text(u))}function f(n){var t="unknown";n.responseJSON&&n.responseJSON.ErrorCode&&(t=n.responseJSON.ErrorCode);n.responseJSON&&n.responseJSON.ErrorMessage&&(t=n.responseJSON.ErrorMessage);alert("Error code: "+t+", Message: Unknown error.")}function e(r,e){function v(t){var u=document.querySelector("."+cssClassPopup+"ipconfig-ipv4properties"),s=u.wdpControl,h=u.querySelector("#ipconfig-ipv4properties-ipAddress-auto").checked,c=u.querySelector("#ipconfig-ipv4properties-dns-auto").checked,e={AdapterName:r.Name},o;h||(e.IPAddress=u.querySelector("#ipconfig-ipv4properties-ipaddress").value,e.SubnetMask=u.querySelector("#ipconfig-ipv4properties-subnetMask").value,e.DefaultGateway=u.querySelector("#ipconfig-ipv4properties-defaultGateway").value);c||(e.PrimaryDNS=u.querySelector("#ipconfig-ipv4properties-preferredDNS").value,o=u.querySelector("#ipconfig-ipv4properties-alternateDNS").value,""!==o&&(e.SecondaryDNS=o));Wdp.Utils._showProgress(u);window.confirm("Changing TCP/IPv4 properties can cause the connection to the device to be lost. Are you sure you want to change the properties?")?$.ajax({url:"/api/networking/ipV4config",cache:!1,type:"put",data:JSON.stringify(e),datatype:"json",contentType:"application/json"}).fail(function(n){f(n)}).always(function(){setTimeout(function(){i()},1e4);Wdp.Utils._hideProgress(u);s._hide()}):s._hide();t.preventDefault();t.stopPropagation();n&&n.focus()}function a(){var t=document.querySelector("."+cssClassPopup+"ipconfig-ipv4properties"),r=t.querySelector("#ipconfig-ipv4properties-ipAddress-static").checked,f=t.querySelector("#ipconfig-ipv4properties-dns-static"),e,u,i,n,o,s;for(t.querySelector("#ipconfig-ipv4properties-dns-auto").disabled=r,r&&(f.checked=!0),e=f.checked,u=t.querySelectorAll("input[checkedParent]"),i=0;i<u.length;i++)n=u[i],o=n.getAttribute("checkedParent"),s="ipconfig-ipv4properties-ipAddress-static"===o?r:e,s?n.disabled=!1:(n.value="",n.disabled=!0)}function y(){Wdp.Utils._hideVisibleOverlays();n&&n.focus()}function p(t){var i,s,h,f,c,e,u,l,o;for(n=t.target,i=document.createElement("div"),i.className=cssClassPopup+"ipconfig-ipv4properties",s='<h4>Internet Protocol Version 4 (TCP/IPv4) Properties<\/h4><form><div class="LabeledInput"><input id="ipconfig-ipv4properties-ipAddress-auto" type="radio" name="ipAddress" value="auto"><label for="ipconfig-ipv4properties-ipAddress-auto">Obtain an IP address automatically<\/label><\/div><div class="LabeledInput"><input id="ipconfig-ipv4properties-ipAddress-static" type="radio" name="ipAddress" value="static"><label for="ipconfig-ipv4properties-ipAddress-static">Use the following IP address<\/label><\/div><table><tr><td><label for="ipconfig-ipv4properties-ipaddress">IP address:<\/label><\/td><td><input id="ipconfig-ipv4properties-ipaddress" checkedParent="ipconfig-ipv4properties-ipAddress-static" required type="text" pattern="^([0-9]{1,3}.){3}[0-9]{1,3}$"/><\/td><\/tr><tr><td><label for="ipconfig-ipv4properties-subnetMask">Subnet mask:<\/label><\/td><td><input id="ipconfig-ipv4properties-subnetMask" checkedParent="ipconfig-ipv4properties-ipAddress-static" required type="text" pattern="^([0-9]{1,3}.){3}[0-9]{1,3}$"/><\/td><\/tr><tr><td><label for="ipconfig-ipv4properties-defaultGateway">Default gateway:<\/label><\/td><td><input id="ipconfig-ipv4properties-defaultGateway" checkedParent="ipconfig-ipv4properties-ipAddress-static" required type="text" pattern="^([0-9]{1,3}.){3}[0-9]{1,3}$"/><\/td><\/tr><\/table><div class="LabeledInput"><input id="ipconfig-ipv4properties-dns-auto" type="radio" name="dns" value="auto"><label for="ipconfig-ipv4properties-dns-auto"> Obtain DNS server addresses automatically<\/label><\/div><div class="LabeledInput"><input id="ipconfig-ipv4properties-dns-static" type="radio" name="dns" value="static"><label for="ipconfig-ipv4properties-dns-static">Use the following DNS server addresses<\/label><\/div><table><tr><td><label for="ipconfig-ipv4properties-preferredDNS">Preferred DNS:<\/label><\/td><td><input id="ipconfig-ipv4properties-preferredDNS" checkedParent="ipconfig-ipv4properties-dns-static" required type="text" pattern="^([0-9]{1,3}.){3}[0-9]{1,3}$"/><\/td><\/tr><tr><td><label for="ipconfig-ipv4properties-alternateDNS">Alternate DNS:<\/label><\/td><td><input id="ipconfig-ipv4properties-alternateDNS" checkedParent="ipconfig-ipv4properties-dns-static" type="text" pattern="^([0-9]{1,3}.){3}[0-9]{1,3}$"/><\/td><\/tr><\/table><button id="ipconfig-ipv4properties-savecommand" class="'+cssClassPrimaryCommand+'" type="submit">Save<\/button><button id="ipconfig-ipv4properties-cancelcommand" class="'+cssClassPrimaryCommand+'" type="button">Cancel<\/button><\/form>',h=new Wdp._Overlay(i,{html:s}),h._show(),f=i.querySelectorAll("input[type='text']"),u=0;u<f.length;u++)f[u].oninvalid=function(n){n.target.setCustomValidity("");n.target.validity.valid||n.target.setCustomValidity("Please enter an IP address. \n(ex. 155.155.155.155)")},f[u].oninput=function(n){n.target.setCustomValidity("")};for(r.DHCP?i.querySelector("#ipconfig-ipv4properties-ipAddress-auto").checked=!0:(i.querySelector("#ipconfig-ipv4properties-ipAddress-static").checked=!0,i.querySelector("#ipconfig-ipv4properties-ipaddress").value=r.IpAddresses[0].IpAddress,i.querySelector("#ipconfig-ipv4properties-subnetMask").value=r.IpAddresses[0].Mask,i.querySelector("#ipconfig-ipv4properties-defaultGateway").value=r.Gateways[0].IpAddress),r.DDNSEnabled==="true"?i.querySelector("#ipconfig-ipv4properties-dns-auto").checked=!0:(i.querySelector("#ipconfig-ipv4properties-dns-static").checked=!0,r.DNSAddresses&&(i.querySelector("#ipconfig-ipv4properties-preferredDNS").value=r.DNSAddresses[0],r.DNSAddresses[1]&&(i.querySelector("#ipconfig-ipv4properties-alternateDNS").value=r.DNSAddresses[1]))),c=i.querySelector("form"),c.addEventListener("submit",v,!1),e=i.querySelectorAll("input[type='radio']"),a(),u=0;u<e.length;u++)e[u].addEventListener("change",a,!1);$("#ipconfig-ipv4properties-cancelcommand").click(y);i.querySelector("input").focus();l=i.querySelector("h4");o=i.querySelector("#ipconfig-ipv4properties-cancelcommand");i.querySelector("input").addEventListener("keydown",function(n){n.which!=9||!n.shiftKey||n.altKey||n.ctrlKey||(n.preventDefault(),n.stopPropagation(),o.focus())});o.addEventListener("keydown",function(n){n.which!=9||n.shiftKey||n.altKey||n.ctrlKey||(n.preventDefault(),n.stopPropagation(),i.querySelector("input").focus())})}var o,s,h,c,l;$("<p>").text(r.Name).appendTo(e);o=$("<div>").addClass("indentSection").appendTo(e);s=$("<div>");o.append(s);s.append($("<label>").text("Description:"));s.append($("<p>").attr("aria-label","Description: "+r.Description).text(r.Description));h=$("<div>");o.append(h);h.append($("<label>").text("Type:"));h.append($("<p>").attr("aria-label","Type: "+r.Type).text(r.Type));c=$("<div>");o.append(c);c.append($("<label>").text("Physical address:"));c.append($("<p>").attr("aria-label","Physical address: "+r.HardwareAddress).text(r.HardwareAddress));t(r.IpAddresses,o,{showSubnetMask:!0,ipFieldText:"IPv4 address:",maskFieldText:"Subnet mask:",showLinkToIp:!0});t(r.Gateways,o,{showSubnetMask:!1,ipFieldText:"Gateway address:"});r.DHCP&&t([r.DHCP.Address],o,{showSubnetMask:!1,ipFieldText:"DHCP server:"});r.WINS&&t([r.WINS.Primary,r.WINS.Secondary],o,{showSubnetMask:!1,ipFieldText:"WINS:"});r.DNSAddresses&&u(r.DNSAddresses,o);l=$("<tr>");o.append(l);$('<input type="button" class="commonButton" value="IPv4 Configuration" />').click(p).appendTo(l).attr("aria-label"," IPv4 Configuration for"+r.Description)}$("#reloadIpConfig").click(i);i();var n}var createSmallSpin,WebbRest,wdpPsuedoNamespace="wdp-",cssClassPopup=wdpPsuedoNamespace+"popup",cssClassPrimaryCommand="btn-primary";$(function(){IpConfigViewer()});
/*!
//@ sourceURL=tools/IPConfiguration/IPConfiguration.js
*/
