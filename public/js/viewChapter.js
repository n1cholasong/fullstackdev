function hide(vNum,maxNum) {
    for(var i = 0;i<maxNum;i++)
    {
        var x = document.getElementById("videoPlayer" + i)
        x.style.display = "none"
        x = document.getElementById("quiz" + i)
        x.style.display = "none"
    }


    var x = document.getElementById("videoPlayer" + vNum);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    x = document.getElementById("quiz" + vNum);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }