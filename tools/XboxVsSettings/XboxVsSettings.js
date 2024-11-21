(function () {

    var self = this;

    function doPairingsDeletion() {
        $.ajax({
            url: "/ext/app/sshpins",
            type: "delete",
            cache: false
        })
        .fail(function (data) {
            Xbox.Utils._showError(data);
        });
    };

    function handleDeleteAllPairings() {

        var dialog = new Wdp.Utils._showPopUp(
            "Are you sure you want to remove all Visual Studio pairings?",
            "Users will have to re-pair to connect to this console with Visual Studio to deploy UWPs.",
            {
                label: "OK",
                callback: function () {
                    doPairingsDeletion();
                    Wdp.Utils._hideVisibleOverlays();
                }
            }, {
                label: "Cancel",
                callback: Wdp.Utils._hideVisibleOverlays
            }
        );
    };

    var deletePairingsButton = document.getElementById("xbox-vssettings-deleteall");
    deletePairingsButton.addEventListener("click", handleDeleteAllPairings, false);
})();
//# sourceURL=tools/XboxVsSettings/XboxVsSettings.js