(function () {

    var self = this;

    self.networkShare = "";
    self.networkUser = "";
    self.networkPassword = "";
    self.allowSameBuild = true;
    self.isRecoveryInProgress = false;

    var wdpPsuedoNamespace = "wdp-",
    cssClassPopup = wdpPsuedoNamespace + "popup",
    cssClassPrimaryCommand = "btn-primary";

    function getNetworkCredentials(userAndPasswordProvided) {
        // Show the dialog to get network credentials
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxremoterecovery-getnetworkcreds";

        var innerHtml = '<h4>The provided network share requires login credentials.</h4>';
        if (userAndPasswordProvided) {
            innerHtml = '<h4>The provided credentials were invalid. Please try again.</h4>';
        }
        innerHtml +=
            '<form> \
                <label>Enter your username</label> \
                <div id="xboxremoterecovery-getnetworkcreds-networkusersection"> \
                    <input id="xboxremoterecovery-getnetworkcreds-networkuser" /> \
                </div> \
                <label>Enter your password</label> \
                <div id="xboxremoterecovery-getnetworkcreds-networkpasswordsection"> \
                    <input id="xboxremoterecovery-getnetworkcreds-networkpassword" type="password" /> \
                    <a href="#" id="xboxremoterecovery-getnetworkcreds-showpassword-button" >show</a > \
                </div> \
                <div class="form-group"> \
                    <button id="xboxremoterecovery-getnetworkcreds-startrecovery" class="' + cssClassPrimaryCommand + '" type="submit">Start</button> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        // Prepopulate the text fields.
        var networkUserElement = overlayRoot.querySelector("#xboxremoterecovery-getnetworkcreds-networkuser");
        var networkPasswordElement = overlayRoot.querySelector("#xboxremoterecovery-getnetworkcreds-networkpassword");
        networkUserElement.value = self.networkUser;
        networkPasswordElement.value = self.networkPassword;

        var showPasswordButton = overlayRoot.querySelector("#xboxremoterecovery-getnetworkcreds-showpassword-button");
        showPasswordButton.addEventListener("click", function (e) {
            if (networkPasswordElement.getAttribute("type") === "password") {
                networkPasswordElement.setAttribute("type", "text");
                showPasswordButton.innerHTML = "hide";
            } else {
                networkPasswordElement.setAttribute("type", "password");
                showPasswordButton.innerHTML = "show";
            }
        });

        var form = overlayRoot.querySelector("form");
        form.addEventListener("submit", onEnterNetworkCreds, false);

        networkUserElement.focus();
    };

    function onEnterNetworkCreds(e) {
        var rootOverlay = document.querySelector(".xboxremoterecovery-getnetworkcreds");
        var overlay = rootOverlay.wdpControl;
        var networkUserElement = rootOverlay.querySelector("#xboxremoterecovery-getnetworkcreds-networkuser");
        var networkPasswordElement = rootOverlay.querySelector("#xboxremoterecovery-getnetworkcreds-networkpassword");

        self.networkUser = networkUserElement.value;
        self.networkPassword = networkPasswordElement.value;
        startRemoteRecovery();

        overlay._hide();
        e.preventDefault();
        e.stopPropagation();
    };

    function startRemoteRecovery() {
        Wdp.Utils._showProgress(toolRootElement);
        self.isRecoveryInProgress = true;

        var requestBody = { RecoverOptions: recoveryOptions, AllowSameBuild: self.allowSameBuild, username: self.networkUser, password: self.networkPassword };
        var params = { networkshare: window.btoa(self.networkShare) };
        var url = "/ext/update/remote?" + $.param(params);
        $.ajax({ url: url, cache: false, type: 'post', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
        .fail(function (data, textStatus, error) {
            if (data && data.responseText) {
                var parsedData = JSON.parse(data.responseText);
                var unsignedCode;
                if (parsedData && parsedData.ErrorCode) {
                    unsignedCode = (parsedData.ErrorCode >>> 32);
                }
                // If this is ERROR_BAD_NET_RESP, ERROR_INVALID_PASSWORD, ERROR_NO_SUCH_LOGON_SESSION, ERROR_LOGON_FAILURE, ERROR_BAD_USERNAME, or ACCESS_DENIED, we need credentials to connect to the share.
                if (unsignedCode === 0x8007003A ||
                    unsignedCode === 0x80070056 ||
                    unsignedCode === 0x80070520 ||
                    unsignedCode === 0x8007052e ||
                    unsignedCode === 0x8007089a ||
                    unsignedCode === 0x80070005) {
                    getNetworkCredentials();
                } else if (unsignedCode === 0x80190193) {
                    parsedData.ErrorMessage = "Likely cause is attempting to manually update a console which " +
                        "is set to auto-install the latest recovery. Please change your " +
                        "OS recovery update policy to \"I install OS recovery updates manually\" and try again. " +
                        "There may be a delay of up to 24 hours after changing this setting before it takes effect.";
                    Xbox.Utils._showError(parsedData);
                } else {
                    Xbox.Utils._showError(parsedData);
                }
            } else {
                Xbox.Utils._showError({ ErrorMessage: "Unexpected error encountered." });
            }
        })
        .always(function (data, textStatus, error) {
            Wdp.Utils._hideProgress(toolRootElement);
            self.isRecoveryInProgress = false;
        });
    };

    function populateOptionsForRecovery(e) {

        if (self.isRecoveryInProgress) {
            return;
        }

        var rootOverlay = document.querySelector(".xboxremoterecovery-updateos");
        var overlay = rootOverlay.wdpControl;
        var networkShareElement = rootOverlay.querySelector("#xboxremoterecovery-networkshare");
        var factoryResetElement = rootOverlay.querySelector("#xboxremoterecovery-factoryreset");
        var allowSameBuildElement = rootOverlay.querySelector("#xboxremoterecovery-allowsamebuild");
        var sandboxElement = rootOverlay.querySelector("#xboxremoterecovery-sandbox");

        self.networkShare = networkShareElement.value;
        self.allowSameBuild = allowSameBuildElement.checked;

        if (!self.networkShare) {
            Xbox.Utils._showError({ ErrorMessage: "Please provide a network share path." });
            return;
        }

        // Populate sandbox and factory reset options.
        for (var index = 0; index < recoveryOptions.length; ++index) {
            if (recoveryOptions[index].ParamName === "X-ForceFactoryReset") {
                if (factoryResetElement.checked) {
                    recoveryOptions[index].ParamValue = "true";
                } else {
                    recoveryOptions[index].ParamValue = "false";
                }
            }
            if (recoveryOptions[index].ParamName === "X-FactoryResetOptions") {
                if (factoryResetElement.checked) {
                    recoveryOptions[index].ParamValue = "0xdededede";
                } else {
                    recoveryOptions[index].ParamValue = "0";
                }
            }
            if (recoveryOptions[index].ParamName === "X-SandboxId") {
                recoveryOptions[index].ParamValue = sandboxElement.value || sandboxElement.placeholder;
            }
        }


        overlay._hide();

        e.stopPropagation();

        startRemoteRecovery();
    };

    function updateUiBasedOnSystemUpdateGroup(currentGroup) {
        if (currentGroup === "noupdate") {
            updateOsButton.disabled = false;
            buttonExplanationElement.innerHTML = "";
        } else {
            updateOsButton.disabled = true;
            buttonExplanationElement.innerHTML = "Your update policy must be set to \"I install OS recovery updates manually\" in order to update your console OS recovery.";
        }
    }

    // If this console is a member of a system update group, don't allow
    // update since it will be blocked anyways.
    function checkForSystemUpdateGroup() {

        // This element won't be available when the page first loads so we need to
        // get it here and make the settings call ourselves if it isn't available yet.
        var selectElement = document.getElementById("xboxsettings-osupdatepolicy");
        if (selectElement) {
            var value = selectElement.value.toLowerCase();
            updateUiBasedOnSystemUpdateGroup(value);
        } else {
            $.ajax({
                url: "/ext/settings/osupdatepolicy",
                contentType: "application/json",
                type: "get",
                cache: false
            })
            .done(function (data, textStatus, error) {
                var value = data.Value.toLowerCase();
                updateUiBasedOnSystemUpdateGroup(value);
            })
            .fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            });
        }
    }

    function handleUpdateOsButton() {

        // Show the dialog to update the OS
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxremoterecovery-updateos";

        var innerHtml =
            '<h3>Update console OS recovery</h3> \
            <form> \
                <br /> \
                <div class="form-group"> \
                    <input id="xboxremoterecovery-networkshare" type="text" placeholder="Specify a network path to the update files." /> \
                </div> \
                <br /> \
                <div style="display: flex;"> \
                    <label style="margin-left: 5px; margin-right: 10px; margin-top: 5px;">Sandbox Id:</label> \
                    <input id="xboxremoterecovery-sandbox" type="text" placeholder="XDKS.1" /> \
                </div> \
                <div class="form-group"> \
                    <input id="xboxremoterecovery-factoryreset" type="checkbox" /> \
                    <label>Perform Factory Reset</label> \
                </div> \
                <div class="form-group"> \
                    <input id="xboxremoterecovery-allowsamebuild" type="checkbox" checked="checked" /> \
                    <label>Allow updating to same build</label> \
                </div> \
                <div class="form-group"> \
                    <button id="xboxremoterecovery-cancel" type="button">Cancel</button> \
                    <button id="xboxremoterecovery-installrecovery" disabled="disabled" type="button">Update console</button> \
                </div> \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var installRecoveryButton = overlayRoot.querySelector("#xboxremoterecovery-installrecovery");
        installRecoveryButton.addEventListener("click", populateOptionsForRecovery, false);

        var networkShareElement = overlayRoot.querySelector("#xboxremoterecovery-networkshare");
        networkShareElement.addEventListener("keyup",
            // Only enable the button if there is text in the textbox.
            function () {
                if (networkShareElement.value) {
                    installRecoveryButton.disabled = false;
                } else {
                    installRecoveryButton.disabled = true;
                }
            },
            false);

        // Close the overlay on cancel.
        $('#xboxremoterecovery-cancel').click(function () {
            var rootOverlay = document.querySelector(".xboxremoterecovery-updateos");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        networkShareElement.focus();
    };

    var buttonExplanationElement = document.getElementById("xboxremoterecovery-update-explanation");

    var updateOsButton = document.getElementById("xboxremoterecovery-update-button");
    updateOsButton.addEventListener("click", handleUpdateOsButton, false);

    var updatePolicyElement = document.getElementById("xboxremoterecovery-systemupdategroup-setting");
    updatePolicyElement.addEventListener("change", checkForSystemUpdateGroup, false);

    var toolRootElement = updateOsButton.parentNode;

    var recoveryOptions = [
        { ParamName: "X-UpdateDownloadPolicy", ParamValue: "1" },      // Suppress prompt
        { ParamName: "X-ForceFactoryReset", ParamValue: "false" },  // Allow factory reset
        { ParamName: "X-FactoryResetOptions", ParamValue: "0" },      // not doing a reset = 0, full = 0xadadadad, refresh = 0xecececec, keepXconfig = 0xdededede
        { ParamName: "X-HostName", ParamValue: "<save>" }, // Preserves hostname even in factory resets
        { ParamName: "X-InhibitIdleTimeout", ParamValue: "true" },   // Prevents screen from dimming
        { ParamName: "X-SandboxId", ParamValue: "XDKS.1" }, // Sandbox
    ];

    Xbox.Utils.GetXboxInfoAsync()
        .then(function success(data) {
            if (data.DevMode !== "Shared Resource Devkit") {
                checkForSystemUpdateGroup();
            } else {
                // SRA kits are always in a manual update group, and
                // can't change that group.
                updateUiBasedOnSystemUpdateGroup("noupdate");

                updatePolicyElement.hidden = true;
            }
        });
})();
//# sourceURL=tools/XboxRemoteRecovery/XboxRemoteRecovery.js