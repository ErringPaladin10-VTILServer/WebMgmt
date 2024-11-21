(function () {

    var wdpPsuedoNamespace = "wdp-",
    cssClassPopup = wdpPsuedoNamespace + "popup",
    cssClassPrimaryCommand = "btn-primary";

    var userIdAttribute = "data-xbltestaccounts-userid";

    var dataView;
    var firstTime = true;
    var usersGrid;

    var users;

    Wdp = Wdp || {};
    Wdp.Utils = Wdp.Utils || {};
    Wdp.Utils.Xbox = Wdp.Utils.Xbox || {};
    Wdp.Utils.Xbox.Users = Wdp.Utils.Xbox.Users || {};

    var CHECK_USER_STATUS_INTERVAL = 1000;

    function handleUsersChanged() {
        refreshUsersList();
    };

    function createUserImpl(e) {
        var rootOverlay = document.querySelector(".xbltestaccounts-createuser");
        var overlay = rootOverlay.wdpControl;

        var email = rootOverlay.querySelector("#xbltestaccounts-createuser-email");
        var password = rootOverlay.querySelector("#xbltestaccounts-createuser-password");
        var firstName = rootOverlay.querySelector("#xbltestaccounts-createuser-firstname");
        var lastName = rootOverlay.querySelector("#xbltestaccounts-createuser-lastname");
        var securityQuestion = rootOverlay.querySelector("#xbltestaccounts-createuser-securityquestion");
        var securityAnswer = rootOverlay.querySelector("#xbltestaccounts-createuser-securityanswer");
        var locale = rootOverlay.querySelector("#xbltestaccounts-createuser-locale");
        var subscription = rootOverlay.querySelector("#xbltestaccounts-createuser-subscription");
        var keywords = rootOverlay.querySelector("#xbltestaccounts-createuser-keywords");

        Wdp.Utils._showProgress(rootOverlay);

        var requestBody = { "Users": [
            {
                "CreateNew": true,
                "EmailTemplate": email.value,
                "Password": password.value,
                "FirstName": firstName.value,
                "LastName": lastName.value,
                "SecurityQuestion": securityQuestion.value,
                "SecurityAnswer": securityAnswer.value,
                "Locale": locale.value,
                "Subscription": subscription.value,
                "Keywords": keywords.value
            }] };

        $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        })
        .always(function (data, textStatus, error) {
            refreshUsersList();
            Wdp.Utils._hideProgress(rootOverlay);
            overlay._hide();
        });
        e.preventDefault();
        e.stopPropagation();
    };

    function handleCreateUser() {
        // Show the dialog to create a user
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xbltestaccounts-createuser";
        var innerHtml =
            '<h4>Create a new Xbox Live user and sign them in on this console.</h4> \
            <br /> \
            <form> \
                <div class="xbltestaccounts-inline"> \
                    <label class="create-user-label">Email</label> \
                    <input type="text" id="xbltestaccounts-createuser-email" placeholder="Specify the email address for the user."> \
                    <label class="create-user-label">@xboxtest.com</label> \
                </div> \
                <div class="form-group"> \
                    <div class="xbltestaccounts-inline"> \
                        <label class="create-user-label">Password</label> \
                        <input type="password" id="xbltestaccounts-createuser-password" placeholder="Specify the password for the user."> \
                        <a href="#" id="xbltestaccounts-createuser-showpassword-button">show</a> \
                    </div> \
                    <label class="smaller-font">Note: Password must be 8 to 16 characters and contain at least 1 uppercase letter and 1 symbol ($#%^@)</label> \
                </div> \
                <h4>Advanced</h4> \
                <div class="xbltestaccounts-inline"> \
                    <label class="create-user-label">First name</label> \
                    <input type="text" id="xbltestaccounts-createuser-firstname" value="Test"> \
                </div> \
                <div class="xbltestaccounts-inline"> \
                    <label class="create-user-label">Last name</label> \
                    <input type="text" id="xbltestaccounts-createuser-lastname" value="Account"> \
                </div> \
                <div class="xbltestaccounts-inline"> \
                    <label class="create-user-label">Secret question</label> \
                    <input type="text" id="xbltestaccounts-createuser-securityquestion" value="What is your favorite hobby?"> \
                </div> \
                <div class="xbltestaccounts-inline"> \
                    <label class="create-user-label">Secret answer</label> \
                    <input type="text" id="xbltestaccounts-createuser-securityanswer" value="secret123"> \
                </div> \
                <div class="xbltestaccounts-inline-select"> \
                    <label class="create-user-label">Country / Locale</label> \
                    <select class="create-user-select" id="xbltestaccounts-createuser-locale"> \
                        <option value="es-AR">Argentina (es-AR)</option> \
                        <option value="en-AU">Australia (en-AU)</option> \
                        <option value="de-AT">Austria (de-AT)</option> \
                        <option value="fr-BE">Belgium (fr-BE)</option> \
                        <option value="pt-BR">Brazil (pt-BR)</option> \
                        <option value="en-CA">Canada (en-CA)</option> \
                        <option value="es-CL">Chile (es-CL)</option> \
                        <option value="zh-CN">China (zh-CN)</option> \
                        <option value="es-CO">Colombia (es-CO)</option> \
                        <option value="en-CZ">Czech Republic (en-CZ)</option> \
                        <option value="da-DK">Denmark (da-DK)</option> \
                        <option value="fi-FI">Finland (fi-FI)</option> \
                        <option value="fr-FR">France (fr-FR)</option> \
                        <option value="de-DE">Germany (de-DE)</option> \
                        <option value="en-GR">Greece (en-GR)</option> \
                        <option value="en-HK">Hong Kong SAR (en-HK)</option> \
                        <option value="zh-HK">Hong Kong SAR (zh-HK)</option> \
                        <option value="en-HU">Hungary (en-HU)</option> \
                        <option value="en-IN">India (en-IN)</option> \
                        <option value="en-IL">Israel (en-IL)</option> \
                        <option value="it-IT">Italy (it-IT)</option> \
                        <option value="ja-JP">Japan (ja-JP)</option> \
                        <option value="es-MX">Mexico (es-MX)</option> \
                        <option value="nl-NL">Netherlands (nl-NL)</option> \
                        <option value="en-NZ">New Zealand (en-NZ)</option> \
                        <option value="nb-NO">Norway (nb-NO)</option> \
                        <option value="pl-PL">Poland (pl-PL)</option> \
                        <option value="pt-PT">Portugal (pt-PT)</option> \
                        <option value="en-IE">Republic of Ireland (en-IE)</option> \
                        <option value="ru-RU">Russia (ru-RU)</option> \
                        <option value="en-SA">Saudi Arabia (en-SA)</option> \
                        <option value="en-SG">Singapore (en-SG)</option> \
                        <option value="zh-SG">Singapore (zh-SG)</option> \
                        <option value="en-SK">Slovakia (en-SK)</option> \
                        <option value="en-ZA">South Africa (en-ZA)</option> \
                        <option value="ko-KR">South Korea (ko-KR)</option> \
                        <option value="es-ES">Spain (es-ES)</option> \
                        <option value="sv-SE">Sweden (sv-SE)</option> \
                        <option value="de-CH">Switzerland (de-CH)</option> \
                        <option value="fr-CH">Switzerland (fr-CH)</option> \
                        <option value="zh-TW">Taiwan (zh-TW)</option> \
                        <option value="tr-TR">Turkey (tr-TR)</option> \
                        <option value="en-AE">United Arab Emirates (en-AE)</option> \
                        <option value="en-GB">United Kingdom (en-GB)</option> \
                        <option selected value="en-US">United States (en-US)</option> \
                        <option value="es-US">United States (es-US)</option> \
                        <option value="es-AR">Argentina (es-AR)</option> \
                    </select> \
                </div> \
                <div class="xbltestaccounts-inline-select"> \
                    <label class="create-user-label">Account type</label> \
                    <select class="create-user-select" id="xbltestaccounts-createuser-subscription"> \
                        <option selected="" value="Gold">Gold</option> \
                        <option value="Silver">Silver</option> \
                    </select> \
                </div> \
                <div class="form-group"> \
                    <div class="xbltestaccounts-inline"> \
                        <label class="create-user-label">Keywords</label> \
                        <input type="text" id="xbltestaccounts-createuser-keywords" value=""\> \
                    </div> \
                    <label class="smaller-font">Note: separate multiple keywords with a semi-colon</label> \
                </div> \
                <button id="xbltestaccounts-createuser-savecommand" class="' + cssClassPrimaryCommand + '" disabled>Create and sign in</button> \
                <button id="xbltestaccounts-createuser-cancelcommand" class="' + cssClassPrimaryCommand + '">Cancel</button > \
            </form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var saveButton = overlayRoot.querySelector("#xbltestaccounts-createuser-savecommand");
        saveButton.addEventListener("click", createUserImpl, false);

        var emailInput = overlayRoot.querySelector("#xbltestaccounts-createuser-email");
        emailInput.focus();

        var passwordInput = overlayRoot.querySelector("#xbltestaccounts-createuser-password");

        var showPasswordButton = overlayRoot.querySelector("#xbltestaccounts-createuser-showpassword-button");
        showPasswordButton.addEventListener("click", function (e) {
            if (passwordInput.getAttribute("type") === "password") {
                passwordInput.setAttribute("type", "text");
                showPasswordButton.innerHTML = "hide";
            } else {
                passwordInput.setAttribute("type", "password");
                showPasswordButton.innerHTML = "show";
            }
        });

        // Close the overlay on cancel.
        $('#xbltestaccounts-createuser-cancelcommand').click(function () {
            var rootOverlay = document.querySelector(".xbltestaccounts-createuser");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        function checkRequiredDataFields() {
            if (!emailInput.value || !passwordInput.value) {
                saveButton.disabled = true;
            } else {
                saveButton.disabled = false;
            }
        };

        // Add event listeners for keyup as well as change (we don't get a keyup in some autocomplete
        // scenarios but we don't get a change until focus changes).
        emailInput.addEventListener("keyup",
            // Only enable the button if there is text in all the required textboxes.
            checkRequiredDataFields,
            false);
        emailInput.addEventListener("change",
            checkRequiredDataFields,
            false);
        passwordInput.addEventListener("keyup",
            checkRequiredDataFields,
            false);
        passwordInput.addEventListener("change",
            checkRequiredDataFields,
            false);
    };

    function addUserImpl(e) {
        var rootOverlay = document.querySelector(".xbltestaccounts-adduser");
        var overlay = rootOverlay.wdpControl;
        var emailInput = rootOverlay.querySelector("#xbltestaccounts-adduser-email");
        var passwordInput = rootOverlay.querySelector("#xbltestaccounts-adduser-password");
        var autoSignInCheckbox = rootOverlay.querySelector("#xbltestaccounts-adduser-autosignin");

        Wdp.Utils._showProgress(rootOverlay);

        var requestBody = { "Users": [{ "EmailAddress": emailInput.value, "Password": passwordInput.value, "SignedIn": true, "AutoSignIn": autoSignInCheckbox.checked }] };
        $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        })
        .always(function (data, textStatus, error) {
            refreshUsersList();
            Wdp.Utils._hideProgress(rootOverlay);
            overlay._hide();
        });
        e.preventDefault();
        e.stopPropagation();
    };

    function handleAddUser() {
        // Show the dialog to add a user
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xbltestaccounts-adduser";
        var innerHtml =
            '<h4>Sign in user</h4>' +
            '<form>' +
            '  <label>Email</label>' +
            '  <input id="xbltestaccounts-adduser-email" type="email" />' +
            '  <label>Password</label>' +
            '  <div>' +
            '    <input id="xbltestaccounts-adduser-password" type="password" />' +
            '    <a href="#" id="xbltestaccounts-adduser-showpassword-button">show</a>' +
            '  </div>' +
            '  <div class="form-group">' +
            '    <input id="xbltestaccounts-adduser-autosignin" type="checkbox" /><label>Auto sign in</label>' +
            '  </div>' +
            '  <button id="xbltestaccounts-adduser-savecommand" class="' + cssClassPrimaryCommand + '" disabled>Sign in</button>' +
            '  <button id="xbltestaccounts-adduser-cancelcommand" class="' + cssClassPrimaryCommand + '">Cancel</button>';
            '</form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var saveButton = overlayRoot.querySelector("#xbltestaccounts-adduser-savecommand");
        saveButton.addEventListener("click", addUserImpl, false);

        var emailInput = overlayRoot.querySelector("#xbltestaccounts-adduser-email");
        emailInput.focus();

        var passwordInput = overlayRoot.querySelector("#xbltestaccounts-adduser-password");

        var showPasswordButton = overlayRoot.querySelector("#xbltestaccounts-adduser-showpassword-button");
        showPasswordButton.addEventListener("click", function (e) {
            if (passwordInput.getAttribute("type") === "password") {
                passwordInput.setAttribute("type", "text");
                showPasswordButton.innerHTML = "hide";
            } else {
                passwordInput.setAttribute("type", "password");
                showPasswordButton.innerHTML = "show";
            }
        });

        // Close the overlay on cancel.
        $('#xbltestaccounts-adduser-cancelcommand').click(function () {
            var rootOverlay = document.querySelector(".xbltestaccounts-adduser");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });

        function checkRequiredDataFields() {
            if (!emailInput.value || !passwordInput.value) {
                saveButton.disabled = true;
            } else {
                saveButton.disabled = false;
            }
        };

        // Add event listeners for keyup as well as change (we don't get a keyup in some autocomplete
        // scenarios but we don't get a change until focus changes).
        emailInput.addEventListener("keyup",
            // Only enable the button if there is text in all the required textboxes.
            checkRequiredDataFields,
            false);
        emailInput.addEventListener("change",
            checkRequiredDataFields,
            false);
        passwordInput.addEventListener("keyup",
            checkRequiredDataFields,
            false);
        passwordInput.addEventListener("change",
            checkRequiredDataFields,
            false);
    };

    function handleAddGuest() {
        Wdp.Utils._showProgress(toolRootElement);
        var requestBody = { "Users": [{ "SponsoredUser": true }] };
        $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        })
        .always(function (data, textStatus, error) {
            refreshUsersList();
            Wdp.Utils._hideProgress(toolRootElement);
        });
    };

    function removeUser(userId) {
        var user = getUser(userId);
        Wdp.Utils._showProgress(toolRootElement);
        if (user.EmailAddress) { // Normal user
            var requestBody = { "Users": [{ "EmailAddress": user.EmailAddress, "Delete": true }] };
            $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
            .fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            })
            .always(function (data, textStatus, error) {
                refreshUsersList();
                Wdp.Utils._hideProgress(toolRootElement);
            });
        } else { // Guest
            var requestBody = { "Users": [{ "UserId": user.UserId, "SignedIn": false }] };
            $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
            .fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            })
            .always(function (data, textStatus, error) {
                refreshUsersList();
                Wdp.Utils._hideProgress(toolRootElement);
            });
        }
    };

    function getUsersAsync() {
        var defered = $.Deferred();
        $.ajax({ url: '/ext/user', cache: false, type: 'get', contentType: 'application/json' })
        .done(function (data, textStatus, error) {
            defered.resolve(data.Users);
        })
        .fail(function (data, textStatus, error) {
            defered.reject(data, error);
        });
        return defered;
    };

    function getCreateEnabledAsync() {
        var defered = $.Deferred();
        $.ajax({ url: '/ext/user/create', cache: false, type: 'get', contentType: 'application/json' })
            .done(function (data, textStatus, error) {
                defered.resolve(data.IsCreateEnabled);
            })
            .fail(function (data, textStatus, error) {
                if (data.status !== 403) {
                    defered.reject(data, error);
                }
            });
        return defered;
    };

    function toggleSignIn(userId, element) {
        var user = getUser(userId);
        var checked = element.checked;

        Wdp.Utils._showProgress(toolRootElement);

        var requestBody = { "Users": [{ "UserId": user.UserId, "SignedIn": checked }] };
        $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
        .fail(function (data, textStatus, error) {
            // Revert checked state
            element.checked = !checked;

            Xbox.Utils._showError(data);
        })
        .always(function (data, textStatus, error) {
            refreshUsersList();
            Wdp.Utils._hideProgress(toolRootElement);
        });
    };

    function handleSaveUserDetails() {
        var overlayRoot = document.querySelector(".xbltestaccounts-details");
        var overlay = overlayRoot.wdpControl;
        var userId = overlayRoot.getAttribute(userIdAttribute);
        var user = getUser(userId);
        // Check all the fields that have changed and update the user settings
        var autoSignInCheckbox = document.getElementById("xbltestaccounts-details-autosignin-value");
        if (user.AutoSignIn !== autoSignInCheckbox.checked) {
            Wdp.Utils._showProgress(overlayRoot);
            var requestBody = { "Users": [{ "EmailAddress": user.EmailAddress, "AutoSignIn": autoSignInCheckbox.checked }] };
            $.ajax({ url: '/ext/user', cache: false, type: 'put', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' })
            .fail(function (data, textStatus, error) {
                Xbox.Utils._showError(data);
            })
            .always(function (data, textStatus, error) {
                refreshUsersList();
                Wdp.Utils._hideProgress(overlayRoot);
                overlay._hide();
            });
        } else {
            Wdp.Utils._hideProgress(overlayRoot);
            overlay._hide();
        }
    };

    function viewDetails(userId) {
        var user = getUser(userId);
        var overlayRoot = document.createElement("div");
        overlayRoot.className = cssClassPopup + " xbltestaccounts-details";
        overlayRoot.setAttribute(userIdAttribute, user.UserId);
        var innerHtml =
            '<h3>' + user.EmailAddress + '</h3>';

        innerHtml +=
            '<form' +
            '   <div class="form-group">' +
            '     <label>Email</label>' +
            '     <label class="form-group-value">' + user.EmailAddress + '</label>' +
            '   </div>' +
            '   <div class="form-group">' +
            '     <label>Gamertag</label>' +
            '     <label class="form-group-value">' + user.Gamertag + '</label>' +
            '   </div>' +
            '   <div class="form-group">' +
            '     <label>XUID</label>' +
            '     <label class="form-group-value">' + user.XboxUserId + '</label>' +
            '   </div>' +
            '   <div class="form-group">';

        if (user.AutoSignIn) {
            innerHtml += '<input id="xbltestaccounts-details-autosignin-value" type="checkbox" checked /><label>Auto sign in</label>';
        } else {
            innerHtml += '<input id="xbltestaccounts-details-autosignin-value" type="checkbox" /><label>Auto sign in</label>';
        }

        innerHtml +=
            '    </div>' +
            '    <button id="xbltestaccounts-details-savecommand" class="' + cssClassPrimaryCommand + '">Save</button>' +
            '    <button id="xbltestaccounts-details-cancelcommand" class="' + cssClassPrimaryCommand + '">Cancel</button>' +
            '</form>';

        var overlay = new Wdp._Overlay(overlayRoot, { html: innerHtml });
        overlay._show();

        var saveButton = overlayRoot.querySelector("#xbltestaccounts-details-savecommand");
        saveButton.addEventListener("click", handleSaveUserDetails, false);
        saveButton.focus();

        // Close the overlay on cancel.
        $('#xbltestaccounts-details-cancelcommand').click(function () {
            var rootOverlay = document.querySelector(".xbltestaccounts-details");
            var overlay = rootOverlay.wdpControl;
            overlay._hide();
        });
    };

    function updateRunningAppsList(processesList) {
        // filter out processes to keep just apps
        var appsList = [];
        var appsSet = {};
        var processIndex;
        for (processIndex in processesList) {
            var currentProcess = processesList[processIndex];
            if (currentProcess.PackageFullName && !(currentProcess.AppName in appsSet)) {
                appsList.push(currentProcess);
                appsSet[currentProcess.AppName] = currentProcess;
            }
        }
        this.dataView.setItems(appsList, "ProcessId");
        this.dataView.reSort();
        // Becuase we're showing the CPU usage we need to constantly invalidate since that value by definition is always changing.
        this.appsGrid.invalidate();
        this.appsGrid.render();
    };

    function signInStatusFormatter(row, cell, value, columnDef, dataContext) {
        var signedInStatusHtml = "";
        if (dataContext.SignedIn) {
            signedInStatusHtml = '<input type="checkbox" class="xbltestaccounts-userlist-togglesignedin" ' + userIdAttribute + '="' + dataContext.UserId + '" checked />';
        } else {
            signedInStatusHtml = '<input type="checkbox" class="xbltestaccounts-userlist-togglesignedin" ' + userIdAttribute + '="' + dataContext.UserId + '" />';
        }
        return signedInStatusHtml;
    };

    function emailFormatter(row, cell, value, columnDef, dataContext) {
        if (value) {
            return '<a class="xbltestaccounts-userlist-details" href="#" ' + userIdAttribute + '="' + dataContext.UserId + '">' + value + '</a>';
        } else {
            return 'Guest';
        }
    };

    function ageGroupFormatter(row, cell, value, columnDef, dataContext) {
        if (dataContext.AgeGroup) {
            return dataContext.AgeGroup;
        } else {
            return 'none';
        }
    };

    function gamertagFormatter(row, cell, value, columnDef, dataContext) {
        if (dataContext.XboxUserId) {
            return dataContext.Gamertag;
        } else {
            return 'none';
        }
    };

    function xuidFormatter(row, cell, value, columnDef, dataContext) {
        if (dataContext.XboxUserId) {
            return dataContext.XboxUserId;
        } else {
            return 'none';
        }
    };

    function removeFormatter(row, cell, value, columnDef, dataContext) {
        return '<a class="xbltestaccounts-userlist-remove" href="#" ' + userIdAttribute + '="' + dataContext.UserId + '">remove</a>';
    };

    function handleUsersListClicked(e) {
        var target = e.target;
        var xuid = target.getAttribute(userIdAttribute);

        // Show details
        if (target.classList.contains("xbltestaccounts-userlist-togglesignedin")) {
            toggleSignIn(xuid, target);
        } else if (target.classList.contains("xbltestaccounts-userlist-details")) {
            viewDetails(xuid);
        } else if (target.classList.contains("xbltestaccounts-userlist-remove")) {
            removeUser(xuid);
        }
    };

    // TODO: Optimize this
    function compareArrays(array1, array2, ignorableFields) {
        // Strip the ignorable fields
        if (ignorableFields) {
            for (var i = 0, len = ignorableFields.length; i < len; i++) {
                for (var j = 0, len2 = array1.length; j < len2; j++) {
                    if (array1[j][ignorableFields[i]]) {
                        delete array1[j][ignorableFields[i]];
                    }
                }
                for (var j = 0, len2 = array2.length; j < len2; j++) {
                    if (array2[j][ignorableFields[i]]) {
                        delete array2[j][ignorableFields[i]];
                    }
                }
            }
        }
        return JSON.stringify(array1) === JSON.stringify(array2);
    };

    function refreshUsersList() {
        getUsersAsync()
        .done(function (newUsersList) {
            // The following checks if the users array has changed.
            // If not, we early exit.
            if (!firstTime &&
                compareArrays(users, newUsersList)) {
                return;
            }

            users = newUsersList;

            addGuestButton.disabled = true;
            // Enable the add guest button if at least one user is signed in.
            for (var i = 0, len = users.length; i < len; ++i) {
                if (users[i].SignedIn) {
                    addGuestButton.disabled = false;
                }
            }

            if (users.length) {
                if (!usersGrid) {
                    var usersTableColumns = [
                      { id: "SignedIn", name: "Signed in", field: "SignedIn", width: 72, cssClass: "tableCell tableCheckBox", headerCssClass: "tableHeader", formatter: signInStatusFormatter },
                      { id: "EmailAddress", name: "Email", field: "EmailAddress", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: emailFormatter },
                      { id: "AgeGroup", name: "Age Group", field: "AgeGroup", width: 96, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: ageGroupFormatter },
                      { id: "Gamertag", name: "Gamertag", field: "Gamertag", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: gamertagFormatter },
                      { id: "XboxUserId", name: "XUID", field: "XboxUserId", width: 242, cssClass: "tableCell tableTextColumn", headerCssClass: "tableHeader", formatter: xuidFormatter },
                      { id: "Remove", name: "Remove", field: "Remove", width: 96, cssClass: "tableCell", headerCssClass: "tableHeader tableTextColumn", formatter: removeFormatter }
                    ];

                    var usersTableOptions = {
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
                    dataView.setItems(users, "UserId");
                    usersGrid = new Slick.Grid(usersList, dataView, usersTableColumns, usersTableOptions);
                    usersGrid.onClick.subscribe(handleUsersListClicked);
                }

                dataView.setItems(users, "UserId");
                usersGrid.invalidate();
                usersGrid.render();
            } else {
                addGuestButton.disabled = true;
                usersGrid = false;
                usersList.innerHTML =
                    '<h3>There are no users registered on this console.</h3>' + 
                    '<p>To add a user, click the Add user button above.</p>';
            }

            firstTime = false;
        })
        .fail(function (data, textStatus, error) {
            Xbox.Utils._showError(data);
        });

        getCreateEnabledAsync()
            .done(function (isCreateEnabled) {
                createUserButton.disabled = !isCreateEnabled;
            })
            .fail(function (data, textStatus, error) {
                if (!Wdp.Utils.Xbox.Users.DisplayedIsCreateEnabledError) {
                    Wdp.Utils.Xbox.Users.DisplayedIsCreateEnabledError = true;
                    Xbox.Utils._showError(data);
                }
            });
    };

    function getUser(userId) {
        if (!users.length) {
            return;
        }
        userId = parseInt(userId);
        for (var i = 0, len = users.length; i < len; i++) {
            if (parseInt(users[i].UserId) === userId) {
                return users[i];
            }
        }
        return;
    };

    function handleToolUnloaded() {
        window.removeEventListener("beforeunload", handleToolUnloaded);
        clearInterval(checkUserStatusTimerCookie);
    };

    // Create the table
    var addUserButton = document.getElementById("xbltestaccounts-adduserbutton");
    var addGuestButton = document.getElementById("xbltestaccounts-addguestbutton");
    var createUserButton = document.getElementById("xbltestaccounts-createuserbutton");

    // Hook up button handlers
    addUserButton.addEventListener("click", handleAddUser, false);
    addGuestButton.addEventListener("click", handleAddGuest, false);
    createUserButton.addEventListener("click", handleCreateUser, false);
    createUserButton.disabled = true;

    var usersList = document.getElementById("xbltestaccounts-list");
    var toolRootElement = usersList.parentNode;

    refreshUsersList();

    var checkUserStatusTimerCookie = setInterval(refreshUsersList, CHECK_USER_STATUS_INTERVAL);
    window.addEventListener("beforeunload", handleToolUnloaded, false);
})();
//# sourceURL=tools/XboxLiveTestAccounts/XboxLiveTestAccounts.js
