const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    cors = require('cors'),
    routers = require('./routes/routes.js');
const port = 3001;
const app=express();

app.use('/list', express.static(path.join(__dirname, 'html/tour_index.html')));
app.use('/create_tour',express.static(path.join(__dirname,'html/create_tour.html')));
app.use('/update_tour',express.static(path.join(__dirname,'html/update_tour.html')));
app.use('/js', express.static(path.join(__dirname, 'js')));


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});