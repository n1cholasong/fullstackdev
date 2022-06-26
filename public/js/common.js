const menuIconButton = document.querySelector("[data-menu-icon-btn]")
const sidebar = document.querySelector("[data-sidebar]")

menuIconButton.addEventListener("click", () => {
   sidebar.classList.toggle("open")
})

function editProfile() {
   $("#edit").hide();
   $("#cancel").show();
   $(':input').prop('readonly', false);
}

function cancelProfile() {
   $("#edit").show();
   $("#cancel").hide();
   $(':input').prop('readonly', true);

   var value = $(".form-control").innerHTML;
   if (value) {

   }
}

// function saveChanges() {
//    $("#saveChanges").prop('disabled', false);
//    $("#saveChanges").removeClass('btn-outline');
//    $("#saveChanges").addClass('btn-main');
// }

// function displayStar(rating) {
//    for (let i = 0; i < rating; i++) {
//       document.getElementById("star").innerHTML += '<i class="fa-solid fa-star"></i>'
//    }
// }


// $(".sidebar .nav-item").on("click", function () {
//    $(".sidebar .nav-item").find(".active").removeClass("active");
//    $(this).addClass("active");
// });
