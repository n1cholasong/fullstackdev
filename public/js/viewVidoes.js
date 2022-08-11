window.onload = async function () {
    var videos = $('.videoID');

    for (var i = 0; i < videos.length; i++) {
        var video = document.getElementById("video" + videos[i].value)
        video.src = '/Course/user/video/view/' + videos[i].value
        video.load();
    }

};

function reload() {
    if (document.URL.indexOf("#") == -1) {
        document.URL += '#';
    }
    location = '#';
    console.log("Se recarga");
    location.reload(true);
}

function deleteViedo(){
    var vURL = document.getElementById("videoURL");
    vURL.value="";
    var replaceBtn = document.getElementById("replaceBtn");
    replaceBtn.disabled = true;
    document.getElementById("form").submit();
}


