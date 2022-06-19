const menuIconButton = document.querySelector("[data-menu-icon-btn]")
const sidebar = document.querySelector("[data-sidebar]")

menuIconButton.addEventListener("click", () => {
   sidebar.classList.toggle("open")
})


// $(".sidebar .nav-item").on("click", function () {
//    $(".sidebar .nav-item").find(".active").removeClass("active");
//    $(this).addClass("active");
// });

$(function(){
   var current = location.pathname;
   console.log( $('#nav li') )
   // var nav = $('#nav li ')
   // for (i=0;i<=nav.length;i++){
   //    console.log(nav[i].attr('href') )
   // }
   $('#nav li ').each(function(){
       var $this = $(this);
       console.log($this.attr('id'))
       // if the current path is like this link, make it active
       if("/"+$this.attr('id') == current){
           $this.addClass('active');
       }
   })
})
