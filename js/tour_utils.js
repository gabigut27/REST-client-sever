

$(document).ready(function () {
    $("form[name='create_tour_id']").validate({
        // Specify validation rules
        rules: {
          "price":{
            digits: true
          },
           "duration":{
            digits: true
           },
          "email":{
            "email":true
          },
           "cellular":{
            minlength:10,
            maxlength:10,
            digits: true
           }
        },
        // Specify validation error messages
        messages: {       
            Price: "Your price must be at least 3 characters long",
            guide_name:{
            minlength: "Your name must be at least 5 characters long"
          },
          email: "email structure is some@domain",
        }
      });
    // process the form
    $('#create_tour_id').submit(function (event) {
        if(!$("#create_tour_id").valid()) return;        
        // process the form
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: '/tours/create_tour', // the url where we want to POST
            contentType: 'application/json',
            data: JSON.stringify({
              "id": $("#id_field").val(),
                 "start_date": $("#start_date").val(),
                 "duration": $("#duration").val(),
                 "price": $("#price").val(),

                 "guide": {
                  "name": $("#guide_name").val(),
                  "email": $("#email").val(),
                  "cellular": $("#cellular").val() 
            }
          //   "path":[
          //   {"name": $("#city_name").val(),
          //     "country":$("#country_name").val()
          // }


          //   ]
          
          }),
            processData: false,            
           // dataType: 'json', // what type of data do we expect back from the server
            encode: true,
            success: function( data, textStatus, jQxhr ){
                console.log(data);
                location.href = "/list";

            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        })
          
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
    });

});

function check_date() {
  var selectedText = document.getElementById('start_date').value;
  var selectedDate = new Date(selectedText);
  var now = new Date();
  if (selectedDate < now) {
   alert("Date must be in the future");
   $('#start_date').val('');
  }
}

function only_letters() {
    var letters = /^[a-z A-Z]*$/i;
    if (!document.getElementById('guide_name').value.match(letters) ) {
        alert('Please input letters only');
        $('#guide_name').val('');
    }
}
