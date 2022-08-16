var lastAns = false;
var requiredCheck = true;

window.onload = (event)=>{
    var x = document.getElementById("quiz0");
    document.getElementById("quizDeleteForm").action = "/Course/Quiz/Delete/" + x.getAttribute('value');
}

window.onchange = function () { 
    requiredCheck = true
    $('.required').each(function () {
        if ($(this).val() == "") {
            requiredCheck = false
        }
    })

    if(lastAns && requiredCheck){
        document.getElementById('save').removeAttribute('disabled');
    }
};

function checkans(obj) {
    const id = obj.id.split("|")[2]
    $('.ansBtn' + id).each(function () {
        $(this).css("background-color", "");
    })

    document.getElementById("cans" + id).value = parseInt(id);
    obj.style = "background-color: #7560FF;";
    document.getElementById("cans" + id).onchange();

}

function lastcheck() {
    var remove = true;
    $('.cans').each(function () {
        if ($(this).val() == "") {
            remove = false
        }
    })

    if (remove) {
        //document.getElementById('save').removeAttribute('disabled');
        lastAns = true
    }

    if(lastAns && requiredCheck){
        document.getElementById('save').removeAttribute('disabled');
    }
}

function hide(qNum, maxNum) {
    for (var i = 0; i < maxNum; i++) {
        var x = document.getElementById("quiz" + i)
        x.style.display = "none"
    }


    var x = document.getElementById("quiz" + qNum);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    document.getElementById("quizDeleteForm").action = "/Course/Quiz/Delete/" + x.getAttribute('value');
}