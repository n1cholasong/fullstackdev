function checkans(obj) {
    $('.ansBtn').each(function(){
        $(this).css("background-color","");
    })

    document.getElementById("cans").value = parseInt(obj.id.split("ansBtn")[1]);
    obj.style = "background-color: #7560FF;"
}


function hide(qNum,maxNum) {
    for(var i = 0;i<maxNum;i++)
    {
        var x = document.getElementById("quiz" + i)
        x.style.display = "none"
    }


    var x = document.getElementById("quiz" + qNum);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }