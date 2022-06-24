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



// $(".sidebar .nav-item").on("click", function () {
//    $(".sidebar .nav-item").find(".active").removeClass("active");
//    $(this).addClass("active");
// });
