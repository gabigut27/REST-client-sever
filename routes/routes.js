const express = require('express'),
toursRoutes = require('./tours');
var router = express.Router();

router.get('/tours/get_tours', toursRoutes.read_tours);  //read
router.post('/tours/create_tour', toursRoutes.create_tour); //create new tour 
router.post('/tours/create_site_in_path/:id', toursRoutes.create_site_in_path); //add path of city and country
router.put('/tours/update_tour/:id', toursRoutes.update_tour); //update some values in existing tour
router.delete('/tours/delete_tour/:id', toursRoutes.delete_tour);
router.delete('/tours/delete_site/:id', toursRoutes.delete_site);
router.get('/tours/get_tour/:id', toursRoutes.get_tour);  //read


module.exports = router;