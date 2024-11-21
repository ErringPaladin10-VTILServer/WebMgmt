(function () {

    var fiddlerUrl = "/ext/fiddler";
    var enableFiddlerButton;
    var disableFiddlerButton;
    var fiddlerEnabledWarning;
    var addressTextbox;
    var portTextbox;
    var webbRest = new WebbRest();
    var addressLocalStorageKey = "wdp-data-fiddler-address";
    var portLocalStorageKey = "wdp-data-fiddler-port";

    function init() {
        enableFiddlerButton = document.getElementById("fiddler-enablefiddlerbutton");
        disableFiddlerButton = document.getElementById("fiddler-disablefiddlerbutton");
        enableFiddlerButton.addEventListener("click", enableFiddlerWithWarning, false);
        disableFiddlerButton.addEventListener("click", disableFiddlerWithWarning, false);

        fiddlerEnabledWarning = document.getElementById("fiddler-proxyenabledwarning");

        addressTextbox = document.getElementById("fiddler-proxyAddress");
        portTextbox = document.getElementById("fiddler-proxyPort");

        if (localStorage) {
            var localData = localStorage.getItem(addressLocalStorageKey);
            if (localData) {
                addressTextbox.value = localData;
            }
            localData = localStorage.getItem(portLocalStorageKey);
            if (localData) {
                portTextbox.value = localData;
            }
        }

        addressTextbox.addEventListener("change", checkEnableButtonState, false);
        portTextbox.addEventListener("change", checkEnableButtonState, false);
        addressTextbox.addEventListener("keyup", checkEnableButtonState, false);
        portTextbox.addEventListener("keyup", checkEnableButtonState, false);

        checkEnableButtonState();

        updateProxyEnabledWarning();
    };

    function checkEnableButtonState() {
        if (addressTextbox.value && portTextbox.value) {
            enableFiddlerButton.disabled = false;
        } else {
            enableFiddlerButton.disabled = true;
        }
    };

    function updateProxyEnabledWarning() {
        $.ajax({ url: '/ext/fiddler', cache: false, type: 'get', contentType: 'application/json' })
        .done(function (data, textStatus, error) {
            if (data.IsProxyEnabled) {
                fiddlerEnabledWarning.style.display = "block";
                disableFiddlerButton.disabled = false;

                addressTextbox.value = data.ProxyAddress;
                portTextbox.value = data.ProxyPort;
            } else {
                fiddlerEnabledWarning.style.display = "none";
                disableFiddlerButton.disabled = true;
            }
        })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        });
    };

    function rebootDevice() {
        $.post("/api/control/restart")
            .fail(function () {
                var dialog = new Wdp.Utils._showPopUp(
                    "Error",
                    "We could not restart the target device."
                );
            });
    };

    function enableFiddlerWithWarning() {

        if (!addressTextbox.value || !portTextbox.value) {
            return;
        }

        var dialog = new Wdp.Utils._showPopUp(
            "Restart",
            "Enabling Fiddler requires the console to restart",
            {
                label: "Restart",
                callback: enableFiddler
            }, {
                label: "Cancel"
            }
        );
    };

    function enableFiddler() {
        Wdp.Utils._hideVisibleOverlays();

        var certFile = $("#certificateFile").prop("files")[0];

        if (localStorage) {
            localStorage.setItem(addressLocalStorageKey, addressTextbox.value);
            localStorage.setItem(portLocalStorageKey, portTextbox.value);
        }

        webbRest.enableFiddler(certFile, addressTextbox.value, portTextbox.value)
            .done(function (data) {
                rebootDevice();
            }).fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            });
    };

    function disableFiddlerWithWarning() {
        var dialog = new Wdp.Utils._showPopUp(
            "Restart",
            "Disabling Fiddler requires the console to restart",
            {
                label: "Restart",
                callback: disableFiddler
            }, {
                label: "Cancel"
            }
        );
    };
    
    function disableFiddler() {
        Wdp.Utils._hideVisibleOverlays();
        webbRest.disableFiddler()
            .done(function (data) {
                rebootDevice();
            }).fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            });
    };

    init();
})();
    
//@ sourceURL=tools/Fiddler/Fiddler.js