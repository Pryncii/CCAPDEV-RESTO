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
    linkname: { type: String},
    image: { type: String },
    imagesquare: {type: String},
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
    console.log('Error found. Please trace!');
    console.error(err);
}

const getRestoList = require('./initial').getRestoList;
const restodata = getRestoList();
console.log(restodata);

server.get('/', function(req, resp){
    resp.render('menu',{
        layout      : 'index',
        title       : 'Main Menu',
    });
});

server.get('/login-page', function(req, resp){
    resp.render('login',{
        layout      : 'index',
        title       : 'Login',
    });
});

server.get('/signup-page', function(req, resp){
    resp.render('signup',{
        layout      : 'index',
        title       : 'Signup',
    });
});

console.log(restodata[0]);

server.get('/restaurant/:landmark/:linkname', function(req, resp){
    const searchQuery = { landmark: req.params.landmark, 
                          linkname: req.params.linkname};
    restoModel.findOne(searchQuery).then(function(restos){
      console.log(JSON.stringify(restos));
      if(restos != undefined && restos._id != null){
        const restosJson = restos.toJSON();
        resp.render('restopage',{
            layout      : 'index',
            title       : 'Main Menu',
            restodata   : restosJson,
            otherresto  : restodata
        });
    }
    }).catch(errorFn);
  });

server.get('/restopage/:landmark/', function(req, resp){
    const searchQuery = { landmark: req.params.landmark };
    restoModel.find(searchQuery).then(function(restos){
      console.log('List successful');
      let vals = new Array();
      for(const item of restos){
          vals.push({
              name: item.name,
              linkname: item.linkname,
              image: item.imagesquare,
              landmark: item.landmark
          });
      }

      resp.render('restomenu',{
        layout: 'index',
        title:  req.params.landmark,
        restos:  vals
      });
    }).catch(errorFn);
  });


  

function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  
process.on('SIGINT',finalClose);  
process.on('SIGQUIT', finalClose);

const port = process.env.PORT | 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});