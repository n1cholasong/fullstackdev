const menuIconButton = document.querySelector("[data-menu-icon-btn]")
const sidebar = document.querySelector("[data-sidebar]")

//Active link checking
$(function(){
   var current = location.pathname;
   //console.log( $('.nav-item') )
   // var nav = $('#nav li ')
   // for (i=0;i<=nav.length;i++){
   //    console.log(nav[i].attr('href') )
   // }
   $('.nav-item').each(function(){
       var $this = $(this);
       console.log($this.attr('id'))
       // if the current path is like this link, make it active
       if("/"+$this.attr('id') == current){
           $this.addClass('active');
       }
   })
})


menuIconButton.addEventListener("click", () => {
   sidebar.classList.toggle("open")
})

function editProfile() {
   $("#edit").hide();
   $("#cancel").show();
   $(':input').prop('disabled', false);
}

function cancelProfile() {
   $("#edit").show();
   $("#cancel").hide();
   $(':input').prop('disabled', true);

   var value = $(".form-control").innerHTML;
   if (value) {

   }
}

function checkRange() {
   let perc = parseInt($('#perc').val());
   let titleArr = [];
   var initPerc = 0;
   initPerc = perc >= 100 || perc < 0 ? perc >= 100 ? 100 : 0 : perc

   $('#perc').val(initPerc);
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

// Display selected file name
$(".custom-file-input").on("change", function () {
   var fileName = $(this).val().split("\\").pop();
   $(this).siblings(".custom-file-label").addClass("se-lected").html(fileName);
});

// Use fetch to call post route /video/upload
$('#pictureUpload').on('change', function () {
   let formdata = new FormData();
   let image = $("#pictureUpload")[0].files[0];
   formdata.append('pictureUpload', image);
   fetch('/forum/upload', {
      method: 'POST',
      body: formdata
   })
      .then(res => res.json())
      .then((data) => {
         $('#picture').attr('src', data.file);
         $('#pictureURL').attr('value', data.file); // sets posterURL hidden field
         if (data.err) {
            $('#pictureErr').show();
            $('#pictureErr').text(data.err.message);
         }
         else {
            $('#pictureErr').hide();
         }
      })
});