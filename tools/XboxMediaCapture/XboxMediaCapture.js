(function () {

    var screenshotUrl = "/ext/screenshot";
    var takeScreenshotButton;
    var screenshotPreview;
    var screenshotHDRButton;

    function init() {
        screenshotPreview = document.getElementById("mediacapture-screenshotpreview");
        takeScreenshotButton = document.getElementById("mediacapture-capturescreenshotbutton");
        screenshotHDRButton = document.getElementById("mediacapture-hdr-checkbox");
        takeScreenshotButton.addEventListener("click", takeScreenshotInvoked, false);

        Xbox.Utils.GetXboxInfoAsync()
            .then(function success(data) {
                if (data.ConsoleType === "Xbox One") {
                    document.getElementById("mediacapture-hdr").hidden = true;
                }
            });
    };

    function takeScreenshotInvoked() {
        var requireHDR = screenshotHDRButton.checked;
        var params = { download: true, hdr: requireHDR };
        $.ajax({ url: screenshotUrl + "?" + $.param(params), cache: false, type: 'get' })
            .done(function (data, textStatus, error) {
                var link = document.createElement('a');

                link.href = screenshotUrl + "?" + $.param(params);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                screenshotPreview.innerHTML = null;
                screenshotPreview.style.background = 'url("' + screenshotUrl + "?time=" + new Date().getTime() + '")';
                screenshotPreview.style.backgroundSize = "contain";
                screenshotPreview.style.backgroundRepeat = "no-repeat";
            })
            .fail(function (data, textStatus, error) {
                screenshotPreview.style.background = null;
                var errorMessage = 'Failed to take screenshot.';

                if (data && data.responseText) {
                    var parsedData = JSON.parse(data.responseText);

                    if (parsedData.ErrorMessage) {
                        errorMessage = parsedData.ErrorMessage;
                    }
                }

                screenshotPreview.innerHTML = '<p class="warning">' + errorMessage + '</p>';
            });
    };

    init();
})();
/*!
//@ sourceURL=tools/XboxMediaCapture/XboxMediaCapture.js
*/