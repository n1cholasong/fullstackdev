function hide(vNum,maxNum) {
    
        var y = document.getElementsByClassName("quiz")
        var x = document.getElementsByClassName("videoPlayer")
        for(var i = 0;i<maxNum;i++)
        {
          y[i].style.display = "none"
          try{
          x[i].style.display = "none"
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
    var div = document.getElementById("content");
    div.innerHTML += '<h1 style="display:block;" class="videoPlayer" id="videoPlayer' + vNum + '"> No Videos Here.. </h1>';
   }
  } 