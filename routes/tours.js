const e = require('express');
const fs = require('fs');
// variables
const dataPath = './data/option1.json';

// helper methods
function isNumeric(num){
    return !isNaN(num)
  };

const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) data = "{}";
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};


module.exports = {
    //READ
    read_tours: function (req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else
                var parsed_data=JSON.parse(data);
                var array=[];
                var sorted_data={};
                var i=0;
                for(var tour of Object.keys(parsed_data)){
                    array[i]=tour;
                    i++;
                }
                array.sort( function(a, b){
                    if (a.toLowerCase() < b.toLowerCase()) return -1;
                    if (a.toLowerCase() > b.toLowerCase()) return 1;
                    return 0;
                });
                i=0;
                for(var index of array){
                    sorted_data[index]=parsed_data[index];
                }
                res.send(sorted_data);

        });
    }, 
    // CREATE
    //==========================
    create_tour: function (req, res) {
        readFile(data => {
            // add the new user
            if (req.body.id ) {
            var count_not_valid=0;
            if(!data[req.body.id]){ //if the id is not existing yet. create
                if(!(req.body.start_date))
                count_not_valid++;
              if(!req.body.duration || !isNumeric(req.body.duration) )
              count_not_valid++;
              if(!req.body.price || !isNumeric(req.body.price) )
              count_not_valid++;
              if(req.body.guide){
              if(!req.body.guide.name || !(req.body.guide.name.match("^[a-z A-Z]+$")))
              count_not_valid++;
              if(!req.body.guide.email )
              count_not_valid++;
              if(!req.body.guide.cellular || !isNumeric(req.body.guide.cellular) || (req.body.guide.cellular).length!=10 )
              count_not_valid++;
              }
              else
              count_not_valid++;
            }
            else
            count_not_valid++;

            if(count_not_valid==0){
            data[req.body.id] = req.body;
            
            }
        }
            else 
            return res.sendStatus(500).send("did not get id tour in body")

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new tour add');
            });
        },
            true);
    },

    // UPDATE
    //==========================
    update_tour: function (req, res) {
        readFile(data => {
            // add the new tour
            const userId = req.params["id"];
            // const date=req.params["start_date"]
            if (data[userId]) {
                //data[userId].id = req.body.id;
                if (req.body.start_date) {
                    if (data[userId].start_date != req.body.start_date)
                        data[userId].start_date = req.body.start_date;
                }
                if (req.body.duration) {
                    if ((data[userId].duration != req.body.duration) && (isNumeric(req.body.duration)))
                        data[userId].duration = req.body.duration;
                }
                if (req.body.price) {
                    if ((data[userId].price != req.body.price) && (isNumeric(req.body.price)))
                        data[userId].price = req.body.price;
                }
                if (req.body.guide) {
                    if (req.body.guide.name) {
                        if ((data[userId].guide.name != req.body.guide.name) && (req.body.guide.name.match("^[a-z A-Z]+$")))
                            data[userId].guide.name = req.body.guide.name;
                    }
                }
                if (req.body.guide) {
                    if (req.body.guide.email) {
                        if (data[userId].guide.email != req.body.guide.email)
                            data[userId].guide.email = req.body.guide.email;
                    }
                }
                if (req.body.guide) {
                    if (req.body.guide.cellular) {
                        if ((data[userId].guide.cellular != req.body.guide.cellular) && (isNumeric(req.body.guide.cellular)) && ((req.body.guide.cellular).length==10) )
                            data[userId].guide.cellular = req.body.guide.cellular;
                    }
                }
            }
            else {
                res.sendStatus(400).send("the tour_id:" + userId + " is not exist");
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`tour id:${userId} updated`);
            });
        },
            true);
    },
    // DELETE
    delete_tour: function (req, res) {
        readFile(data => {
            const userId = req.params["id"];
            if (data[userId])
                delete data[userId];
            else
                res.status(400).send("the tour_id:" + userId + " is not exist");
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`tour id:${userId} removed`);
            });
        },
            true);
    },

    delete_site: function (req, res) {

        readFile(data => {
            const userId = req.params["id"];
            var if_match = 0;
            var delete_name = "";
            if (data[userId]) {
                if (!req.body.path[0].name)
                    return res.status(500).send("name of site has not given");

                else {
                    if (req.body.path[0].name == "ALL") {
                        delete_name = req.body.path[0].name;
                        delete data[userId].path;
                    }
                    else {
                       
                        var sizeloop = data[userId].path.length;
                        for (var i = 0; i < sizeloop; i++) {
                            if (req.body.path[0].name == data[userId].path[i].name) {
                                if_match++;
                                delete_name = data[userId].path[i].name;
                                data[userId].path.splice(i, 1);
                                sizeloop-=1;
                                i--;
                                if (sizeloop == 0)
                                    delete data[userId].path;
                            }
                        }
                    }
                }

            }
            else
                res.status(400).send("the tour_id:" + userId + " is not exist");
            writeFile(JSON.stringify(data, null, 2), () => {
                    if(if_match == 0 && delete_name!="ALL")
                    res.status(200).send("site name that was given to delete is not exist in tour: " + data[userId].id);
                    else if(if_match == 0 && delete_name=="ALL")
                    res.status(200).send("ALL trips path was removed");
                    else
                res.status(200).send(`trip name:${delete_name} removed`);
            });
        },
            true);
    },

    create_site_in_path: function (req, res) {

        readFile(data => {
            const userId = req.params["id"]; //this is form the nituv id(router.post('/tours/:id', toursRoutes.create_site_in_path);)
            if (!data[userId]) return res.sendStatus(500).send('tour with id:' + userId + ' not exist');
            if (!data[userId].path) {
                var path = ' [' +
                    '{ "name":"{}" , "country":"{}" }]';
                var obj_path = JSON.parse(path);
                if (req.body.path[0].name && req.body.path[0].country) {
                    obj_path[0].name = req.body.path[0].name;
                    obj_path[0].country = req.body.path[0].country;
                    data[userId].path = obj_path;
                }
            }
            else {
                var length_path = (data[userId].path).length;
                if (req.body.path[0].name && req.body.path[0].country) {
                    for (let index = 0; index < length_path; index++) {
                        if (data[userId].path[index].name == req.body.path[0].name && data[userId].path[index].country == req.body.path[0].country)
                            break;

                        if (index == length_path - 1) {
                            var add_new_path = '{ "name":"{}" , "country":"{}" }';
                            var obj_path = JSON.parse(add_new_path);
                            obj_path.name = req.body.path[0].name;
                            obj_path.country = req.body.path[0].country;
                            data[userId].path[length_path] = obj_path;
                        }
                    }

                }
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('new path added');
            });
        },
            true);
    },
    get_tour: function (req, res) {
        readFile(data => {
            // add the new user
            var userId = req.params["id"];
            if (data[userId]) {
                res.send("test" + JSON.stringify(data[userId]));
            }
            else {
                res.status(400).send("there is no existing tour with id:" + userId);
            }
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200);
            });
        },
            true);
    }


};