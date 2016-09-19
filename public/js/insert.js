$(document).ready(function(){

  // $("#job-form").validate();
  $("#job-form").validate_bootstrap();
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
    tinymce.init({
        selector: "textarea",
        theme: "modern",
        plugins: [
            "advlist autolink lists  charmap hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars",
            "insertdatetime nonbreaking save contextmenu directionality",
            "template paste textcolor colorpicker textpattern "
        ],
        toolbar1: "undo redo | bold italic forecolor backcolor outdent indent | alignleft aligncenter alignright alignjustify bullist numlist",
        image_advtab: true,
        templates: [
            {title: 'Test template 1', content: 'Test 1'},
            {title: 'Test template 2', content: 'Test 2'}
        ],
        setup: function(ed){
            var edt = ed;
            ed.on('blur', function(e) {
                $("#"+this.id).html( tinyMCE.activeEditor.getContent() );
            });
        }
    });
  else
    tinymce.init({
        selector: "textarea",
        theme: "modern",
        plugins: [
            "advlist autolink lists link image charmap preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars fullscreen",
            "insertdatetime media nonbreaking save table contextmenu directionality",
            "template paste textcolor colorpicker textpattern imagetools"
        ],
        toolbar1: "preview insertfile undo redo | styleselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media ",
        image_advtab: true,
        templates: [
            {title: 'Test template 1', content: 'Test 1'},
            {title: 'Test template 2', content: 'Test 2'}
        ],
        setup: function(ed){
            var edt = ed;
            ed.on('blur', function(e) {
                $("#"+this.id).html( tinyMCE.activeEditor.getContent() );
            });
        }
    });





  $(".submit-button").click(function(){
   if(!$("form").valid()){
     var targetList = $("form").find(".help-block");

      for(target in targetList){
        var target = $(targetList[target]);
        console.log(target);
        if($(target).css("display") !== "none"){
          $(target).siblings("input").focus();
          return;
        }
      }
   }
     if(!$('.tinyedotor1').html()){
      $('.tinyedotor1').focus();
      $('html, body').animate({
          scrollTop: $(".tinyedotor1").parent().offset().top
      }, 0);
      return;
    }

    if(!$('.tinyedotor2').html()){
      $('.tinyedotor2').focus();
      $('html, body').animate({
            scrollTop: $(".tinyedotor2").parent().offset().bottom
      }, 0);
      return;
    }

    var template = $("#job-detail-template").html();
    Mustache.parse(template);   // optional, speeds up future uses

    // console.log(Mustache.render(template, {job_title:"cccccccc",job:"asdfg"}));
    var form = $("form").serializeObject();
    form.remote = form.location_type === "Remote"?"Remote":undefined;
    form.onsite = form.location_type === "OnSite"?"OnSite":undefined;
    $(".mustache-template").html(Mustache.render(template, form));

    $('#modaldiv').modal("show");

  });

  $("#close-modal").click(function(){
    // console.log("modal");
    $('#modaldiv').modal("hide");

  });

  $(".submit-modal").click(function(){
    $('#modaldiv').hide();
    $('#loading-modal').modal("show");

    $.post("/jobs/new", $('form').serialize())
    .success(function(response){
        $('#loading-modal').modal("hide");
        console.log(response)
        if(response.success){
          setTimeout(function(){
            $('#loading-modal').html($("#thanks-modal").html());
            $(".submit-thanks-button").click(function(){
              window.location = "/";
            });
          },1200)

        }

      }).error(function(response){
        $("#thanks-modal").modal("show");
      });
  });
})
