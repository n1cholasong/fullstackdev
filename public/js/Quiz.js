function checkans(obj) {
    $('.ansBtn').each(function(){
        $(this).css("background-color","");
    })

    document.getElementById("cans").value = parseInt(obj.id.split("ansBtn")[1]);
    obj.style = "background-color: #7560FF;"
}