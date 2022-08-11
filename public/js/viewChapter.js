function hide(vNum,maxNum) {
    for(var i = 0;i<maxNum;i++)
    {
        var y = document.getElementById("quiz" + i)
        y.style.display = "none"
        try{
        var x = document.getElementById("videoPlayer" + i)
        x.style.display = "none"
        }catch{
          continue
        }
    }


    var y = document.getElementById("quiz" + vNum);
    if (y.style.display === "none") {
      y.style.display = "";
    } else {
      y.style.display = "none";
    }
    try{
    var x = document.getElementById("videoPlayer" + vNum);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
   }
   catch{
    console.log("I DON'tCARE")
   }
  } 