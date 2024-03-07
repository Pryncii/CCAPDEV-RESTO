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
    revrating: { type: String},
    rev: { type: String },
    hascomments: { type: Boolean },
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
    rating: { type: Number },
    revdata: [reviewSchema]
},{ versionKey: false });

const friendSchema = new mongoose.Schema({
    friendname: { type: String },
    friendimage: { type: String },
});

const userSchema = new mongoose.Schema({
    name: { type: String },
    urlname: { type: String },
    image: { type: String },
    description: {type: String},
    friends: [friendSchema],
    revdata: [reviewSchema]
},{ versionKey: false });

const restoModel = mongoose.model('restaurants', restoSchema);
const userModel = mongoose.model('users', userSchema);

function errorFn(err){
    console.log('Error found. Please trace!');
    console.error(err);
}

const getRestoList = require('./initial').getRestoList;
const restodata = getRestoList();
console.log(restodata);

const getUserList = require('./usergetlist').getUserList;
const userdata = getUserList();
console.log(userdata);

server.get('/', function(req, resp){
    resp.render('main',{
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

server.post('/create-user', function(req, resp){

    let newModel;
    const selectedRadioValue = req.body.estbowner;

    if (selectedRadioValue) {
    console.log("Selected value:", selectedRadioValue);
    } else {
    console.log("No radio button selected");}

    if (selectedRadioValue == "yes")
    {
       
        newModel = new restoModel({
            name: req.body.fname,
            linkname: req.body.fname.replace(/ /g, "_"),
            image: "/common/Images/PFPs/profile.webp",
            imagesquare: "/common/Images/PFPs/profile.webp", 
            description: "",
            recommendations: [],
            landmark: req.body.elandm.replace(/ /g, "_"),
            rating: 0,
            revdata: [],

        });
    
    }

    else {
        newModel = new userModel({
            name: req.body.fname,
            urlname: req.body.fname.replace(/ /g, "_"),
            image: "/common/Images/PFPs/profile.webp",
            description: "",
            friends: [],
            reviews: [] });

    }
    
      newModel.save().then(function(user){
      console.log('User created');
      console.log(JSON.stringify(user));
        resp.render('result',{
            layout: 'index',
            title:  'Result page',
            status: 'good',
            msg:  'User created successfully'

    
          });
      
    }).catch(errorFn);
  });

server.get('/signup-page', function(req, resp){
    resp.render('signup',{
        layout      : 'index',
        title       : 'Signup',
    });
});

server.get('/profile-page/:urlname', function(req, resp){
    const searchQuery = { urlname: req.params.urlname};

    userModel.findOne(searchQuery).then(function(user){
        console.log(JSON.stringify(user));
        if(user != undefined && user._id != null){
          const userJson = user.toJSON();
          resp.render('profile',{
              layout      : 'index',
              title       : 'Profile',
              userdata   : userJson
            });
        }
      }).catch(errorFn);
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
            title       : 'Restaurant',
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