const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

server.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restodb');

const commentSchema = new mongoose.Schema({
    comimg: { type: String },
    comname: { type: String },
    com: { type: String }
});

const reviewSchema = new mongoose.Schema({
    revimg: { type: String },
    revname: { type: String },
    rev: { type: String },
    comments: [commentSchema]
});

const restoSchema = new mongoose.Schema({
    name: { type: String },
    image: { type: String },
    description: { type: String },
    recommendations: [{ recom: { type: String } }],
    landmark: { type: String },
    posts: { type: Number },
    reviews: { type: Number },
    rating: { type: Number },
    revdata: [reviewSchema]
},{ versionKey: false });

const restoModel = mongoose.model('restaurants', restoSchema);

function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

const restodata = require('./initialdata');
const initialresto = restodata.resto_data;
console.log(initialresto[0]);

server.get('/', function(req, resp){
    resp.render('main',{
        layout      : 'index',
        title       : 'Restaurant',
        restos   : initialresto[1],
        num: 0
    });
});

const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});