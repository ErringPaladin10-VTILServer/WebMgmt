(function () {

    var xblGameSaveUrl = "/ext/xblgamesave";
    var scidTextbox;
    var msaTextbox;
    var pfnTextbox;
    var providers;
    var provider;
    
    var scidLocalStorageKey = "wdp-data-xblgamesave-scid";
    var msaLocalStorageKey = "wdp-data-xblgamesave-msa";
    var pfnLocalStorageKey = "wdp-data-xblgamesave-pfn";
    var providerLocalStorageKey = "wdp-data-xblgamesave-provider";
    
    var btnHandlers = [{
        name: "resetButton",
        handler: onResetClick
    }, {
        name: "importButton",
        handler: onImportClick
    }, {
        name: "exportButton",
        handler: onExportClick
    }, {
        name: "deleteButton",
        handler: onDeleteClick
    }, {
        name: "generateButton",
        handler: onGenerateClick
    }];


    function sendHttpRequest(opname) {
        if (!checkRequiredParam(scidTextbox, "SCID", opname)) { return; }
        if (!checkRequiredParam(msaTextbox, "MSA", opname)) { return; }

        var data = getRequestData(opname);
        saveLocalStorage();

        sendPost(xblGameSaveUrl, data).done(
            function (data, textStatus, response) {
                handleResponse(response, opname);
            }).fail(function (data, status, error) {
                showError(data);
            });
    }

    function onResetClick() {
        var opname = "Reset";
        sendHttpRequest(opname);
    };

    function onDeleteClick() {
        var opname = "Delete";
        sendHttpRequest(opname);
    };


    function doImportFile(importFile) {
        var deferred = $.Deferred();
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200 || this.status == 202 || this.status == 204) {
                    deferred.resolve(this.response, this.statusText, this.status);
                } else {
                    deferred.reject(this.response, this.statusText, this.status);
                }
            }
        };
        provider = getProvider();
        var params = { Type: "Import", MSA: msaTextbox.value, PFN: pfnTextbox.value, Provider: provider };
        var formData = new FormData();
        formData.append(importFile.name, importFile);
        saveLocalStorage();
        xhr.open('post', xblGameSaveUrl + "?" + $.param(params), true);
        xhr.send(formData);

        return deferred;
    }

    function onImportClick() {
        var importFile = $("#XblGameSave-file").prop("files")[0];
        if (!importFile) {
            var dialog = new Wdp.Utils._showPopUp(
                "Missing Required Data",
                "Importing data requires a source file",
                {
                    label: "Ok",
                    callback: setFocus(getTextBox("file"))
                }
            );
            return dialog;
        }

        if (!checkRequiredParam(msaTextbox, "MSA", "Import")) { return; }

        doImportFile(importFile).done(function (data, statusText, responseStatus) {
            var response = {
                data: data,
                statusText: statusText,
                status: responseStatus,
            };
            handleResponse(response, "Import");
        }).fail(function (data, textStatus, error) {
            showError(data);
        });
    };

    function onExportClick() {
        var opname = "Export";
        if (!checkRequiredParam(scidTextbox, "SCID", opname)) { return; }
        if (!checkRequiredParam(msaTextbox, "MSA", opname)) { return; }

        var data = getRequestData(opname);
        saveLocalStorage();
        
        var url = xblGameSaveUrl + "?" + $.param(data);
        var testUrl = url + "&testData=true";

        $.ajax({ url: testUrl, cache: false, type: 'get' }).done(
            function (data, textStatus, response) {
                if (response && response.status == 200) {
                    // now actually download the data via hidden iframe
                    downloadViaIframe(url);
                }
            }).fail(function (data, status, error) {
                showError(data);
            });
    };

    function onGenerateClick() {
        var containerTextBox = getTextBox("containerCount");
        var blobCountTextBox = getTextBox("blobCount");
        var blobSizeTextBox = getTextBox("blobSize");
        provider = getProvider();
        var data = {
            Type: "Generate",
            SCID: scidTextbox.value,
            PFN: pfnTextbox.value,
            MSA: msaTextbox.value,
            containerCount: containerTextBox.value,
            blobCount: blobCountTextBox.value,
            blobSize: blobSizeTextBox.value,
            Provider: provider,
            Format: getFormat()
        };
        saveLocalStorage();

        downloadViaIframe(xblGameSaveUrl + "?" + $.param(data));
    };
    
    function getSupportedProviders() {
        if (providers){ return; }
        
        data = {Type:"platform"};
        var url = xblGameSaveUrl + "?" + $.param(data);

        $.ajax({ url: url, cache: false, type: 'get' }).done(
            function (data, textStatus, response) {
                if (response && response.status == 200) {
                    var responseJSON = response.responseJSON;
                    if (!responseJSON) {
                        try {
                            responseJSON = JSON.parse(response.responseText);
                        } catch (ex) {
                            try {
                                responseJSON = JSON.parse(response);
                            } catch (ex) {
                                // Must not be valid JSON. Don't use responseText.
                                return;
                            }
                        }
                    }
                    if (responseJSON.provider.type === "Console" && responseJSON.provider.providers.length > 1){
                        providers = responseJSON.provider.providers;
                        var divGameSave = document.getElementById("XblGameSave-toggleerauwp-formgroup");
                        if (divGameSave) {
                            divGameSave.hidden = false;
                        }
                        if (provider && provider === "1"){
                            var eraOption = document.getElementById("XblGameSave-toggleerauwp-eraoption");
                            eraOption.checked = true;
                        }
                    }
                }
            }).fail(function (data, status, error) {
                showError(data);
            });
        
    }
    
    function getProvider() {
        var providerType = "0"; //Default to XblGameSave
        if (providers) {
            var inputRadio = document.getElementById("XblGameSave-toggleerauwp-eraoption");
            if (inputRadio.checked){
                for(var i = 0; i < providers.length; i++) {
                    if (providers[i].name == "ConnectedStorage") {
                        providerType = JSON.stringify(providers[i].type);
                        break;
                    }
                }
            } else {
                providerType = "0";
            }
        }
        return providerType;
    }

    function getFormat() {
        var fmtRadio = document.getElementById("XblGameSave-xmlOrJson-xmloption");
        if (fmtRadio.checked) {
            return "xml";
        } else{
            return "json";
        }
    }
    
    function getRequestData(requestType) {
        provider = getProvider();
        var data = {
            Type: requestType,
            SCID: scidTextbox.value,
            PFN: pfnTextbox.value,
            MSA: msaTextbox.value,
            Provider: provider,
            Format: getFormat()
        };

        return data;
    };

    function checkRequiredParam(textBox, friendlyName, opname) {
        if (!textBox.value || textBox.value.length == 0) {
            var dialog = new Wdp.Utils._showPopUp(
                "Missing Required Data",
                opname + " requires " + friendlyName,
                {
                    label: "Ok",
                    callback: setFocus(textBox)
                }
            );
            return false;
        }
        return true;
    };

    function handleResponse(response, friendlyName) {
        if (response && response.status == 200) {
            var dialog = new Wdp.Utils._showPopUp(
                "Completed",
                friendlyName + " completed",
                {
                    label: "Ok"
                });
            return true;
        } else {
            var dialog = new Wdp.Utils._showPopUp(
                "Error",
                friendlyName + " failed -" + response.status,
                {
                    label: "Ok"
                });
        }
        return false;
    };

    function downloadViaIframe(url) {
        var iframe = document.createElement('iframe');
        iframe.hidden = true;
        document.body.appendChild(iframe);
        iframe.src = url;
        setTimeout(function(){ document.body.removeChild(iframe);}, 60000);
    }

    function sendPost(url, requestBody) {
        return $.ajax({ url: url, cache: false, type: 'post', data: JSON.stringify(requestBody), datatype: 'json', contentType: 'application/json' });
    };

    function setFocus(target) {
        target.focus();
    };

    function loadLocalStorageItem(keyName, target) {
        var localData = localStorage.getItem(keyName);
        if (localData) {
            target.value = localData;
        }
    };

    function saveLocalStorageItem(keyName, source) {
        localStorage.setItem(keyName, source.value);
    };

    function loadLocalStorage() {
        if (localStorage) {
            loadLocalStorageItem(scidLocalStorageKey, scidTextbox);
            loadLocalStorageItem(msaLocalStorageKey, msaTextbox);
            loadLocalStorageItem(pfnLocalStorageKey, pfnTextbox);
            var localData = localStorage.getItem(providerLocalStorageKey);
            if (localData) {
                provider = localData;
                if (typeof provider == 'number'){
                    provider = JSON.stringify(data);
                }
            }
        }
    };

    function saveLocalStorage() {
        saveLocalStorageItem(scidLocalStorageKey, scidTextbox);
        saveLocalStorageItem(msaLocalStorageKey, msaTextbox);
        saveLocalStorageItem(pfnLocalStorageKey, pfnTextbox);
        if (provider) {
            localStorage.setItem(providerLocalStorageKey, provider);
        }
    };

    function init() {

        addHandlers(btnHandlers);
        scidTextbox = getTextBox("scid");
        msaTextbox = getTextBox("msa");
        pfnTextbox = getTextBox("pfn");

        loadLocalStorage();
        if (!providers)
        {
            getSupportedProviders();
        }
    };


    function addHandlers(handlers) {
        for (var i = 0; i < handlers.length; i++) {
            var item = handlers[i];
            addButtonHandler(item.name, item.handler);
        }
    };

    function addButtonHandler(buttonName, handler) {
        var btn = document.getElementById("XblGameSave-" + buttonName);
        if (btn) {
            btn.addEventListener("click", handler, false);
        } 
        
    };

    function getTextBox(textBoxName) {
        return document.getElementById("XblGameSave-" + textBoxName);
    };


    function showError(data) {
        var errorCode = "unknown";
        var errorMessage = "Unknown error.";

        var responseJSON = data.responseJSON;

        if (!responseJSON) {
            try {
                responseJSON = JSON.parse(data.responseText);
            } catch (ex) {
                try {
                    responseJSON = JSON.parse(data);
                } catch (ex) {
                    // Must not be valid JSON. Don't use responseText.
                }
            }
        }

        if (responseJSON &&
            responseJSON.ErrorCode) {
            errorCode = responseJSON.ErrorCode;
        }
        if (responseJSON &&
            responseJSON.ErrorMessage) {
            errorMessage = responseJSON.ErrorMessage;
        }
        var dialog = new Wdp.Utils._showPopUp(
            "Something went wrong",
            "Error code: " + errorCode +
            "<br/>Message: " + errorMessage +
            "<br/>Data: " + JSON.stringify(data)
        );
    };

    init();
})();
//@ sourceURL=tools/XblGameSave/XblGameSave.js