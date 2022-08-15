$('#pictureUploadCourse').on('change', function () {
    let formdata = new FormData();
    let image = $("#pictureUploadCourse")[0].files[0];
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