let button = document.querySelector(".like-button");


function fav_toggle(id){
    var element = document.getElementById(`fav-button${id}`);
    element.classList.toggle("active");
}