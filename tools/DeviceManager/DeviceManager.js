﻿function DeviceTree(n){function e(n,t){var r=$(document.createElement("div")).addClass("indentSection").attr("role","tree").appendTo(n);i(r,t.root,0)}function i(n,r,u){var f=r.FriendlyName?r.FriendlyName:r.Description?r.Description:r.ID,l="WindowsDevicePortalDeviceManager"+t,e,h,p,c,y;if(t++,e=$(document.createElement("div")),r.children.length>0&&e.attr("aria-owns",l).attr("role","presentation"),e.appendTo(n),$(document.createElement("span")).text(f).attr("role","treeitem").appendTo(e),h=$(document.createElement("div")).hide().addClass("deviceDescription indentSection").appendTo(e),o(r,h),p=$(document.createElement("button")).text("").addClass("blackTextButton symbol").click(function(){h.toggle();$(this).attr("aria-label").indexOf("Show")==0?$(this).attr("aria-label","Hide details: "+f):$(this).attr("aria-label","Show details: "+f)}).attr("aria-label","Show details: "+f).prependTo(e),c=$(document.createElement("button")).text("").addClass("blackTextButton symbol").prependTo(e),r.children.length>0){var s=$(document.createElement("div")).addClass("indentSection treeViewBorder").attr("role","group").attr("id",l).appendTo(n),a="",v="";c.text(u==0?v:a).click(function(){$(this).text(s.is(":visible")?a:v);s.toggle();s.is(":visible")?$(this).attr("aria-label","Collapse: "+f):$(this).attr("aria-label","Expand: "+f)}).attr("aria-label","Expand: "+f);u!=0&&s.toggle();for(y in r.children)i(s,r.children[y],++u)}else c.attr("tabindex","-1").attr("role","presentation")}function o(n,t){var u=["ID","Description","FriendlyName","Class","Manufacturer","StatusCode","ProblemCode"],f,i,r;$(document.createElement("p")).text("Properties:").appendTo(t);for(f in u)i=u[f],r=n[i],r&&$(document.createElement("p")).text(i+" : "+r).appendTo(t)}function s(n){var f={},u,t,e,i,o,s;for(t in n)n[t].children=[];for(t in n)if(!n[t].ParentID){f.root=n[t];n.splice(t,1);break}for(e=[f.root],i=[];n.length>0||i.length>0;){o=!1;for(t in n){for(u in e)if(n[t].ParentID===e[u].ID){i.push(n[t]);n.splice(t,1);o=!0;break}if(o)break}if(o)continue;else{for(u in i)s=r(f.root,i[u].ParentID),s.children.push(i[u]);e=i.splice(0);i=[]}}return f}function r(n,t){var u,e,i,f;if(n.ID===t)return n;for(u=n.children,e=u.length,i=0;i<e;i++)if(f=r(u[i],t),f)return f}function u(n,t,i){var h=n.Description?!0:!1,f,r,c,e,o,s,l;t.push(i+">"+(h?n.Description:n.ID)+"\r\n");f=[h?"ID":"Description","FriendlyName","Class","Manufacturer","StatusCode","ProblemCode"];r=!0;for(c in f)e=f[c],o=n[e],o&&(r?(t.push(i+"("),r=!1):t.push(", "),t.push(e+":"+o));r||t.push(")\r\n");s=n.children;for(l in s)u(s[l],t,i+"    ")}function h(n){var i,r,f,t;if(typeof Blob=="undefined"){alert("Operation failed - browser does not support blob format");return}i=[];u(n.root,i,"");r=new Blob(i,{type:"text/plain",endings:"native"});f="DeviceTree.txt";window.navigator.msSaveOrOpenBlob?window.navigator.msSaveOrOpenBlob(r,f):(t=document.createElement("a"),t.download=f,t.href=window.URL.createObjectURL(r),t.onclick=c,t.style.display="none",document.body.appendChild(t),t.click())}function c(n){document.body.removeChild(n.target)}var f=new WebbRest,t=0;f.getDeviceList().done(function(t){var i=s(t.DeviceList),r=$("#"+n);e(r,i);$("#saveDeviceTree").click(function(){h(i)})})}var WebbRest;$(function(){DeviceTree("deviceTree")});
/*!
//@ sourceURL=js/DeviceManager.js
*/