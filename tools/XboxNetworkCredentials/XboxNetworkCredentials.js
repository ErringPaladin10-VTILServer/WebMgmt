(function () {

    var wdpPsuedoNamespace = "wdp-",
    cssClassPopup = wdpPsuedoNamespace + "popup",
    cssClassPrimaryCommand = "btn-primary";

    var networkNameAttribute = "data-xboxnetworkcredentials-networkname";

    var dataView;
    var credsGrid;

    var firstTime = true;

    var CHECK_CREDENTIALS_STATUS_INTERVAL = 1000;

    var credentials;

    function addCredentialImpl(e) {
        var rootOverlay = document.querySelector(".xboxnetworkcredentials-addcred");
        var overlay = rootOverlay.wdpControl;
        var pathInput = rootOverlay.querySelector("#xboxnetworkcredentials-addcred-path");
        var usernameInput = rootOverlay.querySelector("#xboxnetworkcredentials-addcred-username");
        var passwordInput = rootOverlay.querySelector("#xboxnetworkcredentials-addcred-password");

        Wdp.Utils._showProgress(rootOverlay);

        var params = { NetworkPath: window.btoa(pathInput.value)};
        var url = "/ext/networkcredential?" + $.param(params);
        var requestBody = { Username: usernameInput.value, Password: passwordInput.value };
        $.ajax({ url: url, cache: false, type: 'post', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json'  })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        })
        .done(function (data) {
            refreshCredentialsList();
        })
        .always(function (data) {
            Wdp.Utils._hideProgress(rootOverlay);
            overlay._hide();
        });
        e.preventDefault();
        e.stopPropagation();
    };

    function handleAddOrUpdateCred(e, existingPath) {
        // Show the dialog to add a user
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xboxnetworkcredentials-addcred";
        var innerHtml =
            '<h4>Edit network credentials</h4>' +
            '<form>' +
            '  <label>Server name</label>' +
            '  <input id="xboxnetworkcredentials-addcred-path" />' +
            '  <label>User name</label>' +
            '  <input id="xboxnetworkcredentials-addcred-username" />' +
            '  <label>Password</label>' +
            '  <input id="xboxnetworkcredentials-addcred-password" type="password" />' +
            '  <a href="#" id="xboxnetworkcredentials-addcred-showpassword-button">show</a>' +
            '  <br/>' +
            '  <button id="xboxnetworkcredentials-addcred-savecommand" class="' + cssClassPrimaryCommand + '" type="submit">Save</button>' +
            '</form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var pathInput = overlayRoot.querySelector("#xboxnetworkcredentials-addcred-path");
        var usernameInput = overlayRoot.querySelector("#xboxnetworkcredentials-addcred-username");
        var passwordInput = overlayRoot.querySelector("#xboxnetworkcredentials-addcred-password");

        var showPasswordButton = overlayRoot.querySelector("#xboxnetworkcredentials-addcred-showpassword-button");
        showPasswordButton.addEventListener("click", function (e) {
            if (passwordInput.getAttribute("type") === "password") {
                passwordInput.setAttribute("type", "text");
                showPasswordButton.innerHTML = "hide";
            } else {
                passwordInput.setAttribute("type", "password");
                showPasswordButton.innerHTML = "show";
            }
        });

        pathInput.focus();

        if (existingPath) {
            var cred = getCred(existingPath);

            if (cred) {
                pathInput.value = cred.NetworkPath;
                pathInput.readOnly = true;

                usernameInput.value = cred.Username;

                passwordInput.focus();
            }
        }

        var form = overlayRoot.querySelector("form");
        form.addEventListener("submit", addCredentialImpl, false);
    };

    function removeCred(path) {
        Wdp.Utils._showProgress(toolRootElement);
        var params = { NetworkPath: window.btoa(path)};
        var url = "/ext/networkcredential?" + $.param(params);
        $.ajax({ url: url, cache: false, type: 'delete'})
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        })
        .done(function (data) {
            refreshCredentialsList();
        })
        .always(function (data) {
            Wdp.Utils._hideProgress(toolRootElement);
        });
    };

    function getCredentialsAsync() {
        var defered = $.Deferred();
        $.ajax({ url: '/ext/networkcredential', cache: false, type: 'get', contentType: 'application/json' })
        .done(function (data, textStatus, error) {
            var creds = JSON.parse(data).Credentials;

            if (!creds) {
                defered.reject(data, error);
            } else {
                defered.resolve(creds);
            }
        })
        .fail(function (data, textStatus, error) {
            defered.reject(data, error);
        });
        return defered;
    };

    function pathFormatter(row, cell, value, columnDef, dataContext) {
        return '<a class="xboxnetworkcredentials-update" href="#" ' + networkNameAttribute + '="' + dataContext.NetworkPath + '">' + value + '</a>';
    };

    function usernameFormatter(row, cell, value, columnDef, dataContext) {
        return dataContext.Username;
    };

    function removeFormatter(row, cell, value, columnDef, dataContext) {
        return '<a class="xboxnetworkcredentials-remove" href="#" ' + networkNameAttribute + '="' + dataContext.NetworkPath + '">Remove</a>';
    };

    function handleCredentialListClicked(e) {
        var target = e.target;
        var path = target.getAttribute(networkNameAttribute);

        // Update or delete
        if (target.classList.contains("xboxnetworkcredentials-update")) {
            handleAddOrUpdateCred(e, path);
        } else if (target.classList.contains("xboxnetworkcredentials-remove")) {
            removeCred(path);
        }
    };

    function refreshCredentialsList() {
        getCredentialsAsync()
        .done(function (newCredentialList) {

            // The following checks if the credentials array has changed.
            // If not, we early exit.
            if (!firstTime &&
                JSON.stringify(credentials) === JSON.stringify(newCredentialList)) {
                return;
            }

            credentials = newCredentialList;
            if (credentials.length) {
                var credsTableColumns = [
                      { id: "NetworkPath", name: "Server name", field: "NetworkPath", width: 442, cssClass: "tableCell tableCheckBox", headerCssClass: "tableHeader", formatter: pathFormatter },
                      { id: "Username", name: "User name", field: "Username", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: usernameFormatter },
                      { id: "Remove", name: "Remove", field: "Remove", width: 96, cssClass: "tableCell", headerCssClass: "tableHeader tableTextColumn", formatter: removeFormatter }
                ];

                var credsTableOptions = {
                    selectedCellCssClass: "rowSelected",
                    enableCellNavigation: false,
                    enableColumnReorder: false,
                    enableTextSelectionOnCells: true,
                    showHeaderRow: true,
                    syncColumnCellResize: true,
                    autoHeight: true,
                    rowHeight: 36.5,
                    headerRowHeight: 40.45
                };

                dataView = new Slick.Data.DataView();
                dataView.setItems(credentials, "NetworkPath");
                credsGrid = new Slick.Grid(credentialList, dataView, credsTableColumns, credsTableOptions);
                credsGrid.onClick.subscribe(handleCredentialListClicked);

                dataView.setItems(credentials, "NetworkPath");
                credsGrid.invalidate();
                credsGrid.render();
            } else {
                credentialList.innerHTML =
                    '<h3>There are no credentials registered on this console.</h3>' +
                    '<p>To add network credentials, click the New credentials button above.</p>';
            }

            firstTime = false;
        })
        .fail(function (data, textStatus, error) {
            clearInterval(checkCredentialStatusTimerCookie);

            if (!data.ErrorMessage) {
                data.ErrorMessage = "Failed to retrieve the list of existing network credentials.";
            }
            Xbox.Utils._showError(data);
        });
    };

    function getCred(path) {
        if (!credentials.length) {
            return;
        }
        for (var i = 0, len = credentials.length; i < len; i++) {
            if (credentials[i].NetworkPath === path) {
                return credentials[i];
            }
        }
        return;
    };

    function handleToolUnloaded() {
        window.removeEventListener("beforeunload", handleToolUnloaded);
        clearInterval(checkCredentialStatusTimerCookie);
    };

    var addCredButton = document.getElementById("xboxnetworkcredentials-addcredentials");
    addCredButton.addEventListener("click", handleAddOrUpdateCred, false);

    var credentialList = document.getElementById("xboxnetworkcredentials-credentiallist");
    var toolRootElement = credentialList.parentNode;

    var helpMessageElement = document.getElementById("xboxnetworkcredentials-helpmessage");

    $.ajax({
        url: "/ext/xbox/info",
        contentType: "application/json",
        type: "get",
        cache: false
        })
        .done(function (data) {
            if (data.DevMode !== "Universal Windows App Devkit") {
                helpMessageElement.innerHTML = "Add, remove, or change the user name and password that are used to access a network share where a game is run from or a system update is applied from.";
            }
        })

    refreshCredentialsList();

    var checkCredentialStatusTimerCookie = setInterval(refreshCredentialsList, CHECK_CREDENTIALS_STATUS_INTERVAL);
    window.addEventListener("beforeunload", handleToolUnloaded, false);
})();
//# sourceURL=tools/XboxNetworkCredentials/XboxNetworkCredentials.js