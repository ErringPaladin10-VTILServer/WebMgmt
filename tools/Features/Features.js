﻿$(function(){function t(){var t=$(this).attr("data-fid"),i=$(this).attr("data-RequireReboot"),r=!$(this).attr("checked");n($(this),t,i,r)}function n(n,t,i,r){var u=new WebbRest;u.setFeatureState(t,r?1:0);n.attr("checked",r);n.siblings(".toggleText").text(r?"Enabled":"Disabled");i&&$("#rebootText"+t).css("visibility","visible")}function i(){var r=$(".featureToggle"),t;if(r.length>0)for(t=0;t<r.length;t++){var i=$(r[t]),u=i.attr("data-fid"),f=i.attr("data-RequireReboot"),e=!i.attr("data-isEnabledByDefault");n(i,u,f,e)}}function r(n){var i=$(document.createElement("div")).addClass("featureContainer"),r=$(document.createElement("div")).addClass("toggleContainer").appendTo(i),e=$(document.createElement("input")).attr("id","toggle"+n.Id).attr("data-fid",n.Id).attr("data-requireReboot",n.RequiresReboot).attr("data-isEnabledByDefault",n.IsEnabledByDefault).attr("type","checkbox").attr("checked",n.IsEnabled).attr("tabindex","0").addClass("toggle roundToggle featureToggle").focus(function(){$("#toggleLabel"+n.Id).css("outline","thin dotted invert")}).blur(function(){$("#toggleLabel"+n.Id).css("outline","0")}).keypress(function(n){n.which==13&&$(this).click()}).change(t).appendTo(r),o=$(document.createElement("label")).attr("id","toggleLabel"+n.Id).addClass("toggleLabel").keypress(function(n){n.which==13&&$(this).click()}).click(function(){$("#toggle"+n.Id).trigger("click")}).appendTo(r),s=$(document.createElement("div")).addClass("toggleText").text(n.IsEnabled?"Enabled":"Disabled").appendTo(r),u=$(document.createElement("div")).attr("id","descriptionContainer"+n.Id).addClass("descriptionContainer").appendTo(i),f=$(document.createElement("h5")).addClass("featureName").attr("style","font-size: 20px; line-height: 24px;").appendTo(u),h=$(document.createElement("label")).text(n.Name).attr("for","toggle"+n.Id).appendTo(f),c=$(document.createElement("div")).addClass("featureDescription").text(n.Description).appendTo(u),l=$(document.createElement("div")).addClass("rebootText").attr("id","rebootText"+n.Id).attr("role","alert").css("visibility","hidden").text("Enabling / disabling this feature requires a reboot of the machine to take effect").appendTo(u),a=$(document.createElement("div")).addClass("clr").appendTo(i);return i}function u(){var n=new WebbRest;n.getFeatures().done(function(n){var f,e,a,t,u,l,y;if(n!=null)if(f=n.FeatureCategories,e=f.length,e>0)for(a=$(document.createElement("button")).attr("id","resetButton").text("Reset All").click(i).appendTo($("#featuresBody")),t=0;t<e;++t){var o=f[t],s=o.Features,h=s.length;if(h>0){var c=$(document.createElement("div")).appendTo($("#featuresBody")),p=$(document.createElement("h4")).addClass("featureCategory").text(o.CategoryName).appendTo(c),v=$(document.createElement("div")).addClass("featureList").appendTo(c);for(u=0;u<h;++u)l=s[u],r(l).appendTo(v)}}else y=$(document.createElement("h4")).text("No features are available").appendTo($("#featuresBody"))})}u()});
/*!
//@ sourceURL=tools/features/features.js
*/
