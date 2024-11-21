function uploadFile(target) {
    document.getElementById("certificateFile-name").innerHTML = target.files[0].name;
};

function pickCertificate(target)
{
    document.getElementById("certificateFile").click();
}

//@ sourceURL=tools/Fiddler/Fiddler.js