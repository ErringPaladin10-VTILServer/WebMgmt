// JavaScript source code
///<reference path="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2-vsdoc.js" />

// Globals
var WebbRest;

function XboxInformationControl(parent) {
    var self = this;
    self.parent = parent;
    $.ajax({
        url: "/ext/xbox/info",
        contentType: "application/json",
        type: "get",
        cache: false
    })
    .done(function (data) {
        var controlHtml = '';

        if (data.HardwareDeprecated && data.HardwareDeprecated === 'Yes') {
            controlHtml += '<div id="hardwareDeprecatedBody">';
            controlHtml += '<p id="hardwareDeprecatedTitle" class="warning">Xbox Series X Dev Kits EV version expires January 2021</p>';
            controlHtml += '<div id="hardwareDeprecatedBodyEnglish">This pre-release EV version of the Xbox Series X Dev Kit will expire in early January 2021. All EV consoles MUST be returned to Microsoft no later than May 2021 using the standard RMA mechanism for individual and bulk returns.<p>Please contact your Xbox representative for questions regarding hardware availability and returns.</div>'
            controlHtml += '<br>';
            controlHtml += '<p id="hardwareDeprecatedTitle" class="warning">Xbox Series X 開発キット EV バージョンは 2021 年 1 月に失効します</p>';
            controlHtml += '<div id="hardwareDeprecatedBodyJapanese">この Xbox Series X 開発キットのプレリリース EV バージョンは、2021 年 1 月上旬に失効となります。すべての EV コンソールは 2021 年 5 月までに Microsoft に返却される必要があります。それぞれの返却、また一括の返却には、標準の RMA の手順をご利用ください。<p>利用可能なハードウェアに関して、またハードウェアの返却に関してご質問がありましたら、Xbox 担当者までご連絡ください。'
            controlHtml += '</div>';
        }

        controlHtml += '<table> <tbody id="HostInfoDataBody">';
        controlHtml += '<tr><td><label for="machineNameField">Device name: </label></td>';
        controlHtml += '<td><div id="deviceNameSection"></div></td>';
        controlHtml += '</tr>';
        controlHtml += '<tr><td><label for="xboxlivesandbox-sandboxvalue_2">Sandbox ID: </label></td>';
        controlHtml += '<td><div id="xboxLiveSandboxSection"></div></td>';
        controlHtml += '</tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Console version: </div></label></td><td><div tabindex="0">' + data.OsVersion + '</div></td></tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Console edition: </div></label></td><td><div tabindex="0">' + data.OsEdition + '</div></td></tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Xbox Live device ID: </div></label></td><td><div tabindex="0">' + data.DeviceId + '</div></td></tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Console ID: </div></label></td><td><div tabindex="0">' + data.ConsoleId + '</div></td></tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Serial number: </div></label></td><td><div tabindex="0">' + data.SerialNumber + '</div></td></tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Console type: </div></label></td><td><div tabindex="0">' + data.ConsoleType + '</div></td></tr>';
        controlHtml += '<tr><td><label><div tabindex="0">Devkit type: </div></label></td><td><div tabindex="0">' + data.DevMode + '</div></td></tr>';
        controlHtml += '</tbody></table>';
        $('#' + parent).html(controlHtml);
        new MachineNameControl('deviceNameSection');
        new XboxLiveSandboxControl('xboxLiveSandboxSection');
    })
    .fail(function () {
        $('#' + parent).append('<p class="warning">Failed to get system information</p>');
    });
}

$(function () {
    new XboxInformationControl('XboxInformationSection');
});
//@ sourceURL=tools/XboxDeviceInfo/XboxDeviceInfo.js
