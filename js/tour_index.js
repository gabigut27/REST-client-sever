
$(document).ready(function () {
    $(function () {
        $("form[name='update_tour_id']").validate({
            // Specify validation rules
            rules: {
                "price": {
                    digits: true
                },
                "duration": {
                    digits: true
                },
                "email": {
                    "email": true
                },
                "cellular": {
                    minlength: 10,
                    maxlength: 10,
                    digits: true
                }
            },
            // Specify validation error messages
            messages: {
                Price: "Your price must be at least 3 characters long",
                guide_name: {
                    minlength: "Your name must be at least 5 characters long"
                },
                email: "email structure is some@domain",
            }
        });
    });
    // displaying the tours we already have. 

    $.ajax({
        type: 'GET',
        url: "/tours/get_tours",
        success: function (result) {
            var temp = "<table> <thead> <th class= titls> ID </th> <th class= titls> Start date </th> <th class= titls> Duration </th> <th class= titls> Price </th> <th class= titls> Guide </th> <th class= titls> Path </th> <th class= titls> Add path </th> <th class= titls> Update tour </th> <th class= titls> Delete tour </th>  </thead>";
            var index = 0;
            for (var tour of Object.keys(result)) {
                temp += "<tr>";
                temp += "<td id=tour_id" + index + ">" + tour + "</td>"
                if (result[tour]["start_date"])
                    temp += "<td>" + result[tour]["start_date"] + "</td>"
                else
                    temp += "<td>" + " " + "</td>"
                if (result[tour]["duration"])
                    temp += "<td>" + result[tour]["duration"] + "</td>"
                else
                    temp += "<td>" + " " + "</td>"
                if (result[tour]["price"])
                    temp += "<td>" + result[tour]["price"] + "</td>"
                else
                    temp += "<td>" + " " + "</td>"
                var guide = result[tour]["guide"];
                if (guide) {
                    temp += "<td id=td" + index + "><button id =" + index + " class=table_btn> guide details </button></td>"
                }
                else
                    temp += "<td>" + " " + "</td>"
                if (result[tour]["path"])
                    temp += "<td id=td_path" + index + "><button id =path" + index + " class=table_btn> path details </button></td>"
                else
                    temp += "<td>" + " " + "</td>"

                temp += "<td id=td_add_path" + index + " ><button id=add_path" + index + " class=table_btn>Add path</button></td>"

                temp += "<td>" + get_modal(index) + "</td>"
                temp += "<td><button id =delete" + index + " class=table_btn> delete tour </button></td>"
                temp += "</tr>";
                index++;
            }
            temp += "</tr></table>";
            $("#container").append(temp);
            add_tour(); // click listner for adding new tours
            //displaying guide details if clicked
            var save_pressed_befor = "";
            for (var i = 0; i < index; i++) {
                var id_buttons = "#" + i;
                $(id_buttons).click(function () {
                    var pressedId = $(this).attr('id');
                    var array = [];
                    array = obj_key(result);
                    if (save_pressed_befor != ("#" + pressedId)) {
                        var x = "<table><th class= guide_container> Name </th> <th class= guide_container> Email </th> <th class= guide_container> Cellular </th>";
                        var guide_detail = result[array[pressedId]].guide;
                        x += "<tr> <td>" + guide_detail["name"] + "</td><td>" + guide_detail["email"] + "</td><td>" + guide_detail["cellular"] + "</td> </tr></table>"
                        $("#td" + pressedId).html(x);
                    }
                    save_pressed_befor = "#" + pressedId;
                });
            }
            //========================================================================================================
            //displaying path details if clicked
            var save_pressed_befor2 = "";
            for (var i = 0; i < index; i++) {
                var id_buttons2 = "#path" + i;
                $(id_buttons2).click(function () {
                    var pressedId2 = $(this).attr('id');
                    var array = [];
                    array = obj_key(result);
                    if (save_pressed_befor2 != ("#" + pressedId2)) {
                        var pressedId2_only_num = pressedId2.replace('path', '');
                        var x = "<table><th class= path_container> Name </th> <th class= path_container> Country </th> <th class= path_container> Remove </th>";
                        var path_detail = result[array[pressedId2_only_num]].path;
                        for (var i = 0; i < path_detail.length; i++) {
                            x += "<tr> <td>" + path_detail[i].name + "</td><td>" + path_detail[i].country + "</td><td><button id=delete_path" + i + " class=table_btn>remove path </button></td> </tr>";

                        }
                        x += "</table>";
                        $("#td_path" + pressedId2_only_num).html(x);
                        for (var i = 0; i < path_detail.length; i++) {
                            $('#delete_path' + i).click(function () {
                                var i_click = $(this).attr('id');
                                var i_click_idx = i_click.replace('delete_path', '');
                                delete_path_func(result[array[pressedId2_only_num]].id, path_detail[i_click_idx]);
                            });
                        }
                    }
                    save_pressed_befor2 = "#" + pressedId2;
                });
            }
            for (var j = 0; j < index; j++) {
                $('#add_path' + j).click(function () {
                    var i_click2 = $(this).attr('id');
                    var i_click2_idx = i_click2.replace('add_path', '');
                    var array = [];
                    array = obj_key(result);
                    create_add_path(result[array[i_click2_idx]].id);
                });
            }
            //===========================================================================================================
            //delete tour
            for (let index_delete = 0; index_delete < index; index_delete++) {
                var id_delete = "#delete" + index_delete;
                $(id_delete).click(function () {
                    var pressed_delete_id = $(this).attr('id');
                    var array = [];
                    array = obj_key(result);
                    var my_url3 = build_url_with_id('delete', '/tours/delete_tour/', result, array, pressed_delete_id);
                    $.ajax({
                        type: 'DELETE',
                        url: my_url3,
                        success: function (result3) {
                            location.href = "/list";

                        },
                        error: function (err) {
                            console.log("err", err);
                        },
                    });
                })
            }
            //update tour
            var save_pressed_update = "";
            for (var index_update = 0; index_update < index; index_update++) {
                var id_update = "#update" + index_update;
                $(id_update).click(function () {
                    var pressed_update_id = $(this).attr('id');
                    var array = Object.keys(result)
                    if (save_pressed_update != ("#" + pressed_update_id)) {
                        save_pressed_update = "#" + pressed_update_id;
                        $.ajax({
                            type: 'GET',
                            url: '/update_tour',
                            success: function (result2) {
                                $("#modal_body_" + pressed_update_id).html(result2);
                            },
                            error: function (err) {
                                console.log("err", err);
                            },
                        });
                    }
                })

            }
        },
        error: function (err) {
            alert("test");
            console.log("err", err);
        },
    });
});

function add_tour() { //add tour
    $(".return_create_tour").click(function () {
        $.ajax({
            success: function (result3) {
                location.href = '/create_tour';
            },
            error: function (err) {
                console.log("err", err);
            },
        });

    });
}
function delete_path_func(id_tour, path_location) { //delete path
    var url_send = '/tours/delete_site/' + id_tour;
    $.ajax({

        type: 'DELETE',
        url: url_send,
        data: { "path": [{ "name": path_location.name }] },
        success: function (result3) {
            location.reload();
        },
        error: function (err) {
            console.log("err", err);
        },
    });
}
//gives us the JSON file as an array and then its more comfortable to get things
function obj_key(tour_json) {
    var array = [];
    var j = 0;
    for (var tour of Object.keys(tour_json)) {
        array[j] = tour;
        j++;
    }
    return array;
}
//help us to build url with /:id 
function build_url_with_id(str, url_send, result, array, pressed_id) {
    var replace_to_num_id = pressed_id.replace(str, '');
    var tour_name_id = JSON.stringify(result[array[replace_to_num_id]].id);
    var my_url = url_send + tour_name_id;
    var my_url2 = my_url.replace('"', '');
    var my_url3 = my_url2.replace('"', '');
    return my_url3;
}

function on_submit(id) {//send the value
    // displaying the tours we already have. 
    var my_url = '/tours/update_tour/' + $("#tour_id" + id).html()
    $.ajax({
        type: 'PUT', // define the type of HTTP verb we want to use (POST for our form)
        url: my_url, // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "start_date": $("#start_date").val(),
            "duration": $("#duration").val(),
            "price": $("#price").val(),
            "guide": {
                "name": $("#guide_name").val(),
                "email": $("#email").val(),
                "cellular": $("#cellular").val()
            }
        }),
        processData: false,
        encode: true,
        success: function (data, textStatus, jQxhr) {
            location.reload();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })
}


function create_add_path(id) {
    var name = 5;
    var country = 8;
    var i = 0;
    while (!/^[a-z A-Z]+$/.test(name) || !/^[a-z A-Z]+$/.test(country)) {
        if (i != 0)
            alert("country and city names must be only letters!");
        var name = prompt("Please enter path name, must contain only letters", "");
        var country = prompt("Please enter path country,must contain only letters", "");
        i++;
    }

    var my_url = '/tours/create_site_in_path/' + id;
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url: my_url, // the url where we want to POST
        contentType: 'application/json',
        data: JSON.stringify({
            "path": [{ "name": name, "country": country }]
        }),
        processData: false,
        encode: true,
        success: function (data, textStatus, jQxhr) {
            location.reload();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    })


    // add the form inside the body
    //$('#td_add_path'+index).append(f);   //using jQuery or
    //document.getElementsByTagName('body')[0].appendChild(f); //pure javascript


}

function reset_modal() {//reset the prevus modal
    location.reload();
}

function get_modal(id) {
    var modalID = "modal_index_" + id;
    return `<button id=update` + id + ` type="button" class="btn btn-primary" data-toggle="modal" data-target="#` + modalID + `">
    Update tour
  </button>
  <!-- Modal -->
  <div class="modal fade" id="` + modalID + `"tabindex="-1" role="dialog" aria-labelledby="` + modalID + `" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="`+ modalID + ` ">Modal title</h5>
          <button type="button" onClick="reset_modal()" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form id="update_tour_id" name="update_tour_id">
        <div id=modal_body_update` + id + ` class="modal-body">
          </div>
          <div class="modal-footer">
          <button type="button" onClick="on_submit(`+ id + `)" class="btn btn-primary">Save changes</button>
          <button type="button" onClick="reset_modal()" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
          </form>
          </div>
        </div>
  </div>`
}

function check_date() {//validation for date
    var selectedText = document.getElementById('start_date').value;
    var selectedDate = new Date(selectedText);
    var now = new Date();
    if (selectedDate < now) {
        alert("Date must be in the future");
        $('#start_date').val('');
    }
}

function only_letters() {//validation for guide name
    var letters = /^[a-z]*$/i;
    if (!document.getElementById('guide_name').value.match(letters)) {
        alert('Please input letters only');
        $('#guide_name').val('');
    }
}

function ValidateEmail(mail) {//validation for email
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(document.getElementById('email').value)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    $('#email').val('');
    return (false)
}


