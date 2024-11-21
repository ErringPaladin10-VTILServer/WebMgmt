/// <reference path="jquery/jquery.js" />

function KeyCheck(id) {
    var KeyID = event.keyCode;
    if (event.keyCode == 38)
    {
        $(id).selectedIndex = $(id).selectedIndex - 1;
    }
    else if (event.keyCode == 40)
    {
        $(id).selectedIndex = $(id).selectedIndex + 1;
    }
}

(function () {
    "use strict"

    window.Xbox = window.Xbox || {};
    Xbox.Utils = Xbox.Utils || {};


    /// <summary>
    /// Shows a pop up dialog with error information
    /// </summary>
    /// <param name="data">
    /// The error data to parse for details.
    /// </param>
    Xbox.Utils._showError = function (data) {
        var errorCode = 0;
        var errorMessage;
        var optionalExtendedInfo = "";
        var extendedErrorHighPart = 0;
        var extendedErrorLowPart = 0;

        if (data) {

            if (!data.responseJSON && !data.ErrorCode) {
                try {
                    if (data.responseText) {
                        data = JSON.parse(data.responseText);
                    } else {
                        data = JSON.parse(data);
                    }
                } catch (e) {
                    // Do nothing if this isn't valid JSON.
                }
            }

            var rawErrorCode;
            if (data.ErrorCode) {
                rawErrorCode = data.ErrorCode;
            } else if (data.responseJSON &&
                data.responseJSON.ErrorCode) {
                rawErrorCode = data.responseJSON.ErrorCode;
            }

            if (rawErrorCode) {
                var unsignedCode = (rawErrorCode >>> 32);
                errorCode = rawErrorCode + " (0x" + unsignedCode.toString(16) + ")";
            }

            if (data.ErrorMessage) {
                errorMessage = data.ErrorMessage;
            } else if (data.Reason) {
                errorMessage = data.Reason;
            } else if (data.responseJSON &&
                data.responseJSON.ErrorMessage) {
                errorMessage = data.responseJSON.ErrorMessage;
            }

            if (data.ExtendedErrorHighPart ||
                data.ExtendedErrorLowPart) {
                extendedErrorHighPart = data.ExtendedErrorHighPart;
                extendedErrorLowPart = data.ExtendedErrorLowPart;
            } else if (data.responseJSON &&
                (data.responseJSON.ExtendedErrorHighPart ||
                 data.responseJSON.ExtendedErrorLowPart)) {
                extendedErrorHighPart = data.responseJSON.ExtendedErrorHighPart;
                extendedErrorLowPart = data.responseJSON.ExtendedErrorLowPart;
            }

            if (extendedErrorHighPart || extendedErrorLowPart) {
                if (!extendedErrorHighPart) {
                    extendedErrorHighPart = 0;
                }
                if (!extendedErrorLowPart) {
                    extendedErrorLowPart = 0;
                }
                optionalExtendedInfo = "<br/>Extended error info: 0x" + extendedErrorHighPart.toString(16) + " 0x" + extendedErrorLowPart.toString(16);
            }

            if (!errorMessage) {
                // This is an HTTP error
                if (data.readyState === 4) {
                    errorCode = data.status;
                }
                // (connection refused, etc. Not an HTTP error).
                else if (data.readyState === 0) {
                    errorMessage = "Failed to connect to the device.";
                }
            }
        }

        var message = "";

        if (errorCode != 0) {
            message += "Error code: " + errorCode + optionalExtendedInfo + "<br/>";
        }

        // If we don't have an error code or message, send an unknown message.
        // These should be replaced with more useful messaging whenever possible.
        if (!errorMessage && errorCode === 0) {
            errorMessage = "Unknown error.";
        }

        if (errorMessage) {
            message += "Message: " + errorMessage;
        }

        var dialog = new Wdp.Utils._showPopUp(
            "Something went wrong",
            message
        );
    };

    // EnhancedToolTip - used for first run.
    var EnhancedToolTip = (function () {
        function EnhancedToolTip(element, options) {
            var self = this;
            // Private variables
            self._domInitialized = false;
            self._element = element || createElement("div");
            self._elementInitialized = false;
            self._fader;
            self._handleKeyUpBound = self._handleKeyUp.bind(this);
            self._open = false;

            self._element.wdpControl = this;

            if (options &&
                options.html) {
                self._html = options.html;
            }

            // Events
            self._element.addEventListener("keyup", self._handleKeyUpBound, false);
        };
        var enhancedToolTipPrototype = EnhancedToolTip.prototype;
        enhancedToolTipPrototype._dispose = function () {
            var self = this;
            if (self._disposed) {
                return;
            }
            self._disposed = true;
            if (getParent(self._fader)) {
                self._fader.parentNode.removeChild(self._fader);
            }
            if (self._element) {
                self._element.parentNode.removeChild(self._element);
            }
        };
        enhancedToolTipPrototype._handleKeyUp = function (e) {
            var self = this;
            if (e.keyCode === _KEYCODE_ESCAPE) {
                self._hide();
            }
        };
        enhancedToolTipPrototype._hide = function () {
            var self = this;
            if (self._element &&
                self._element.parentNode) {
                self._element.parentNode.removeChild(self._element);
            }

            this._anchor.style.border = this._cachedBorderStyle;
            this._anchor = null;

            self._open = false;
        };
        enhancedToolTipPrototype._hideVisibleOverlays = function () {
            var overlays = document.body.querySelectorAll(".wdp-overlay");
            for (var i = 0, len = overlays.length; i < len; i++) {
                var overlay = overlays[i];
                if (overlay &&
                    overlay.wdpControl &&
                    overlay.wdpControl._open) {
                    overlay.wdpControl._hide();
                }
            }
        };
        enhancedToolTipPrototype._show = function (anchor) {
            var self = this;
            // Hide any other overlays
            self._hideVisibleOverlays();

            if (!self._elementInitialized) {
                self._element.id = "wdp-overlay";
                self._element.classList.add("wdp-overlay");
                self._element.classList.add("wdp-enhancedtooltip");
                self._element.classList.add("slideDown");
                self._elementInitialized = true;
            }

            // Draw a big border around the anchor
            this._anchor = anchor;
            this._cachedBorderStyle = anchor.style.border;
            anchor.style.border = "3px solid rgb(0, 120, 215)";

            self._element.innerHTML = self._html;
            var arrowIndicator = document.createElement("div");
            arrowIndicator.id = "wdp-overlay-arrowindicator";
            arrowIndicator.className = "wdp-overlay-arrowindicator";
            self._element.appendChild(arrowIndicator);
            document.body.appendChild(self._element);

            // Find placement if placement is specified
            self._findPosition(anchor);

            self._open = true;
        };
        enhancedToolTipPrototype._findPosition = function (anchor) {
            if (!anchor) {
                return;
            }

            var self = this;

            var overlayRect = this._element.getBoundingClientRect();
            var anchorRect = anchor.getBoundingClientRect();

            var screenHeight = document.body.offsetHeight;
            var screenWidth = document.body.offsetWidth;

            var top = anchorRect.bottom;
            var left = anchorRect.left;

            // We need to make sure the flyout is fully visible on screen
            if (top + overlayRect.height > screenHeight) {
                top = screenHeight - overlayRect.height;
            } else if (top < 0) {
                top = 0;
            }
            if (left + overlayRect.width > screenWidth) {
                left = screenWidth - overlayRect.width;
            } else if (left < 0) {
                left = 0;
            }

            this._element.style.top = top + "px";
            this._element.style.left = left + "px";
        };
        return EnhancedToolTip;
    })();
    Xbox.Utils.EnhancedToolTip = EnhancedToolTip;

    function showFirstRunIfApplicable() {
        return; // Always return for now. When the E2E experience is ready, I'll enable this code path.

        // Check local storage to see if they've seen the first run experience as well as checking
        // the devkit to see if OOBECompleted has been marked as true.
        var shouldSkipFirstRun = localStorage.getItem("wdp-xbox-notfirstTimeLaunch");
        if (shouldSkipFirstRun === "true") {
            return;
        }
        localStorage.setItem("wdp-xbox-notfirstTimeLaunch", "true");

        var SETTINGS_WORKSPACE_ID = "{6049D1B7-A605-4591-B30B-9125AA3770DB}";

        // Show first run experience.

        // TODO: We'll need to land WDP's home page before doing more work here.

        // Find the console name
        var consoleNameField = document.getElementById("");
        if (consoleNameField) {
            // Check if it's value is "XboxOne"

            // If yes, show the tooltip
        }

        // Wait for us to switch workspaces
        window.addEventListener("loadingcompleted", function settingsWorkspaceLoaded() {
            window.removeEventListener("loadingcompleted", settingsWorkspaceLoaded);
            // Find the localization settings
            var localizationSettingsContainer = document.querySelector("[data-dock-uri='tools/XboxLocalizationSettings/XboxLocalizationSettings.htm']");
            if (localizationSettingsContainer) {
                // Show the tooltip
                var localizationOverlayRoot = document.createElement("div");
                var htmlString =
                    '<h3>Did we get this right?</h3>' +
                    '<p>' +
                    '  We guessed what you might want.' +
                    '</p>' +
                    '<p>' +
                    '  Don\'t worry, you can always come back here and change these settings later.' +
                    '</p>' +
                    '<button id="firstRunLocSettingsSkipButton">Got it</button>';
                var localizationOverlay = new Xbox.Utils.EnhancedToolTip(localizationOverlayRoot, { html: htmlString });
                localizationOverlay._show(localizationSettingsContainer);

                // Hook up event handlers
                var locSettingsSkipButton = document.getElementById("firstRunLocSettingsSkipButton");
                locSettingsSkipButton.addEventListener("click", function () {
                    localizationOverlay._hide();
                }, false);
            }
        }, false);

        // Switch to the console settings workspace
        var workspaceManager = Wdp.Utils._workspaceManager;
        workspaceManager._switchWorkspace(SETTINGS_WORKSPACE_ID);
    };

    document.addEventListener("DOMContentLoaded", function () {

        // When idle check if we should show the 1st run experience. We don't want to delay
        // startup, which is why this is delayed.
        setTimeout(showFirstRunIfApplicable, 1000);
    }, false);

    var _cachedXboxInfoData;
    Xbox.Utils.GetXboxInfoAsync = function () {
        var deferred = $.Deferred();
        if (_cachedXboxInfoData) {
            deferred.resolve(_cachedXboxInfoData);
        } else {
            $.ajax({
                url: "/ext/xbox/info",
                contentType: "application/json",
                type: "get",
                cache: false
            })
            .done(function (result) {
                _cachedXboxInfoData = result;
                deferred.resolve(_cachedXboxInfoData);
            })
            .fail(function (data, textStatus, error) {
                deferred.reject(data);
            });
        }
        return deferred;
    };

    var _statusBarSocketInitialized = false;
    var _statusBarSocket;
    var _statusBarMessageTimer;
    Xbox.Utils.InitializeStatusBar = function () {

        if (_statusBarSocketInitialized) {
            return;
        }

        // Listen for status bar updates
        var websocketProtocol = (document.location.protocol === 'https:' ? 'wss://' : 'ws://');
        var host = websocketProtocol + window.location.host + '/ext/status';
        try {
            _statusBarSocket = new WebSocket(host);
        } catch (ex) {
            // This means too many sockets have been opened and to be safe we reload
            // the page.
            if (ex.code === 18) {
                location.reload();
            }
        }

        _statusBarSocket.addEventListener("message", handleStatusBarSocketOnMessage, false);

        _statusBarSocketInitialized = true;
    };

    function updateStatusBarStyle(isConnected) {

        if (_statusBarMessageTimer) {
            clearTimeout(_statusBarMessageTimer);
            _statusBarMessageTimer = 0;
        }

        var nameElement = document.getElementById("wdp-statusbar-name");
        var infoElement = document.getElementById("wdp-statusbar-info");
        var checkIcon = document.getElementById("wdp-statusbar-checkmark");
        var errorIcon = document.getElementById("wdp-statusbar-erroricon");

        if (!nameElement ||
            !infoElement ||
            !checkIcon ||
            !errorIcon) {
            return;
        }

        var disconnectedNameStyle = "wdp-statusbar-name-disconnected";
        var disconnectedInfoStyle = "wdp-statusbar-info-disconnected";
        var connectedNameStyle = "wdp-statusbar-name-connected";
        var connectedInfoStyle = "wdp-statusbar-info-connected";

        // Only update styles if we need to. This keeps the status bar static allowing
        // copy/paste.
        if (checkIcon.hidden === isConnected){
            nameElement.classList.toggle(connectedNameStyle, isConnected);
            nameElement.classList.toggle(disconnectedNameStyle, !isConnected);

            infoElement.classList.toggle(connectedInfoStyle, isConnected);
            infoElement.classList.toggle(disconnectedInfoStyle, !isConnected);

            checkIcon.hidden = !isConnected;
            checkIcon.classList.toggle(connectedNameStyle, isConnected);
            errorIcon.classList.toggle(disconnectedNameStyle, !isConnected);
            errorIcon.hidden = isConnected;
            errorIcon.classList.toggle(connectedNameStyle, isConnected);
            errorIcon.classList.toggle(disconnectedNameStyle, !isConnected);
        }

        // If we go 2 seconds or more without a status update,
        // we'll update our status to reflect that we are no longer
        // connected.
        _statusBarMessageTimer = setTimeout(function () {
            updateStatusBarStyle(false);
        }, 2000);
    };

    var _feedbackRedirected = false;
    var _shutdownRedirected = false;
    function handleStatusBarSocketOnMessage(messageEvent) {

        var nameElement = document.getElementById("wdp-statusbar-name");
        var infoElement = document.getElementById("wdp-statusbar-info");

        if (!nameElement || !infoElement) {
            return;
        }

        var statusBarData = JSON.parse(messageEvent.data);

        if (!statusBarData) {
            return;
        }

        updateStatusBarStyle(true);

        // Fill in our status elements. Only update text if we need to. This keeps the 
        // status bar static allowing copy/paste.
        var nameText = statusBarData.SystemIp + ' (' + statusBarData.Hostname + ')';
        if (nameElement.innerHTML !== nameText) {
            nameElement.innerHTML = nameText;
        }
        var infoText = '<div class="wdp-statusbar-node">' + statusBarData.SandboxId + '</div>' +
                                '<div class="wdp-statusbar-node"></div>' + // Empty div for spacing
                                '<div class="wdp-statusbar-node">' + statusBarData.OsFriendlyEdition + ' ' + statusBarData.OsVersion + '</div>';
        if (infoElement.innerHTML !== infoText) {
            infoElement.innerHTML = infoText;
        }

        if (!_feedbackRedirected){
            // Update the feedback link to instead be a 'mailto'. We have to clone
            // and replace the existing button to prevent the shared click handler
            // from also activating.
            Xbox.Utils.GetXboxInfoAsync()
            .then(function success(data) {
                var feedbackButton = document.getElementById("feedback");

                if (feedbackButton) {
                    var feedbackButtonClone = feedbackButton.cloneNode(true);
                    feedbackButton.parentNode.replaceChild(feedbackButtonClone, feedbackButton);
                    if (data.DevMode === "Universal Windows App Devkit") {
                        var feedbackLink = 'mailto:xwdpfeedback@microsoft.com?subject=Xbox Device Portal feedback: (' + statusBarData.OsVersion + ')';
                        feedbackButtonClone.title = feedbackLink;
                    } else {
                        var feedbackLink = 'mailto:xbomfeedback@microsoft.com?subject=Xbox Device Portal feedback: (' + statusBarData.OsVersion + ')';
                        feedbackButtonClone.title = feedbackLink;
                    }

                    feedbackButtonClone.addEventListener("click", function (event) {
                        window.location.href = feedbackLink;
                    });

                    _feedbackRedirected = true;
                }
            });
        }

        if (!_shutdownRedirected){
            var shutdownButton = document.getElementById("wdp-powermenu-shutdown");

            if (shutdownButton) {
                var shutdownButtonClone = shutdownButton.cloneNode(true);
                shutdownButton.parentNode.replaceChild(shutdownButtonClone, shutdownButton);

                shutdownButtonClone.addEventListener("click", function (event) {
                    var warningMessage = "Are you sure you want to shutdown the target device? You cannot turn it back on remotely.";
                    $.ajax({
                        url: "/ext/settings/alwayson",
                        contentType: "application/json",
                        type: "get",
                        cache: false
                    })
                    .done(function (data, textStatus, error) {
                        var value = data.Value.toLowerCase();
                        
                        if (value === "true"){
                            warningMessage = "Are you sure you want to shutdown the target device? Due to your 'AlwaysOn' setting the console will automatically power back up again.";
                        }

                        Wdp.Utils._hideVisibleOverlays();
                        if (window.confirm(warningMessage)) {
                            var webbRest = new WebbRest();
                            webbRest.shutdown()
                            .fail(function (data, textStatus, error) {
                                if (error.status === 501) {
                                    alert("Shutdown is not supported.");
                                } else {
                                    alert("Failed to shutdown.");
                                }
                            });
                        }
                    })
                    .fail(function (data, textStatus, error) {
                        Xbox.Utils._showError(data);
                    });
                });

                _shutdownRedirected = true;
            }
        }
    };
})();
