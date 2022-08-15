const menuIconButton = document.querySelector("[data-menu-icon-btn]")
const sidebar = document.querySelector("[data-sidebar]")

//Active link checking
$(function () {
   var current = location.pathname;
   //console.log( $('.nav-item') )
   // var nav = $('#nav li ')
   // for (i=0;i<=nav.length;i++){
   //    console.log(nav[i].attr('href') )
   // }
   $('.nav-item').each(function () {
      var $this = $(this);
      // console.log($this.attr('id'));

      // if the current path is like this link, make it active
      if ("/" + $this.attr('id') == current) {
         $this.addClass('active');
      }
   })
})


menuIconButton.addEventListener("click", () => {
   sidebar.classList.toggle("open")
})

function editProfile() {
   $("#editProfile").hide();
   $("#cancelProfile").show();
   $("#updateProfile").each(function () {
      $(this).find(':input').prop('disabled', false);
   });
}

function cancelProfile() {
   $("#editProfile").show();
   $("#cancelProfile").hide();
   $("#updateProfile").each(function () {
      $(this).find(':input').prop('disabled', true);
   });
   location.reload();

   //Idk what is this ?? 
   var value = $(".form-control").innerHTML;
   if (value) {

   }
}

function editStatus() {
   $("#editStatus").hide();
   $("#cancelStatus").show();
   $("#counter").show();
   $('#status').prop('disabled', false);
   // var current = $('#status').val().length
   // return current 
}

function cancelStatus() {
   $("#editStatus").show();
   $("#cancelStatus").hide();
   $("#counter").hide();
   $('#status').prop('disabled', true);
   // location.reload();
}

function checkRange() {
   let perc = parseInt($('#perc').val());
   let titleArr = [];
   var initPerc = 0;
   initPerc = perc >= 100 || perc < 0 ? perc >= 100 ? 100 : 0 : perc

   $('#perc').val(initPerc);
}

function stopLoading() {
   $('#loadingModal').modal('hide');
}

// Display selected file name
$(".custom-file-input").on("change", function () {
   var fileName = $(this).val().split("\\").pop();
   $('#updateProfilePicBtn').prop('disabled', false);
   $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// For forum images only
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


// Use fetch to call post route /video/upload
$('#videoUpload').on('change', async function () {
   $('#loadingModal').modal({ backdrop: 'static', keyboard: false })
   $('#loadingModal').modal('show');
   //stop loading after 2 seconds
   setTimeout(function () {
      $('#loadingModal').modal('hide');
   }, 2000);
   let formdata = new FormData();
   let video = await $("#videoUpload")[0].files[0];
   formdata.append('videoUpload', video);
   fetch('/Course/upload', {
      method: 'POST',
      body: formdata
   })
      .then(res => res.json())
      .then((data) => {
         $('#video').attr('src', data.file);
         $('#videoURL').attr('value', data.file); // sets posterURL hidden field
         $('#videoURL').trigger('change');
         if (data.err) {
            $('#videoErr').show();
            $('#videoErr').text(data.err.message);
         }
         else {
            $('#videoErr').hide();
            // $('#loadingModal').modal().hide() ;
         }
      })
});


$('#inputImage').on('change', function () {
   let formdata = new FormData();
   let image = $("#inputImage")[0].files[0];
   formdata.append('inputImage', image);
   fetch('/user/uploadProfilePic', {
      method: 'POST',
      body: formdata
   })
      .then(res => res.json())
      .then((data) => {
         $('#imagePreview').attr('src', data.file); //Image Preview
         $('#profilePicURL').attr('value', data.file); // sets profilePicURL hidden field
         if (data.err) {
            $('#profileErr').show();
            $('#profileErr').text(data.err.message);
         }
         else {
            $('#profileErr').hide();
         }
      })
});