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
    com: { type: String },
    urlname: { type: String}
});

const reviewSchema = new mongoose.Schema({
    revimg: { type: String },
    revname: { type: String },
    revrating: { type: String},
    rev: { type: String },
    hascomments: { type: Boolean },
    comments: [commentSchema],
    urlname: { type: String}
});

const restoSchema = new mongoose.Schema({
    name: { type: String },
    linkname: { type: String},
    user: { type: String },
    pass: { type: String },
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
    user: { type: String },
    pass: { type: String },
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

//Use this to determine the user who's logged in
let loggedInUser = userdata[0];
console.log(loggedInUser);

server.get('/login-page', function(req, resp){
    resp.render('login',{
        layout      : 'index',
        title       : 'Login',
    });
});

server.get('/signup-page', function(req, resp){
    resp.render('signup',{
        layout      : 'index',
        title       : 'Sign Up',
    });
});
server.post('/create-user', function(req, resp){

    let newModel, model;
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
            user: req.body.username,
            pass: req.body.passoword,
            image: "/common/Images/PFPs/resto-default.jpg",
            imagesquare: "/common/Images/PFPs/resto-default.jpg", 
            description: "",
            recommendations: [],
            landmark: req.body.elandm.replace(/ /g, "_"),
            rating: 0,
            revdata: [],

        });
        model = 0;
    
    }

    else {
        newModel = new userModel({
            name: req.body.fname,
            urlname: req.body.fname.replace(/ /g, "_"),
            user: req.body.username,
            pass: req.body.passoword,
            image: "/common/Images/PFPs/profile.webp",
            description: "",
            friends: [],
            reviews: [] });
        model = 1;

    }
    
      newModel.save().then(function(user){
      console.log('User created');

      console.log(JSON.stringify(user));

      if (model == 1) {
        const userJson = user.toJSON();
        loggedInUser = userJson;
        resp.render('profile',{
            layout      : 'index',
            title       : 'Profile',
            userdata   : userJson,
            user        : loggedInUser
        });
      } else {
        const restosJson = user.toJSON();
        const landmarkresto = [];
        for(let i = 0; i < restodata.length; i++){
            if(restodata[i]["landmark"] == req.params.landmark && restodata[i]["linkname"] != req.params.linkname){
                landmarkresto.push(restodata[i]);
            }
        }
        resp.render('restopage',{
            layout      : 'index',
            title       : 'Restaurant',
            restodata   : restosJson,
            otherresto  : landmarkresto,
            user        : loggedInUser
        });
      }
        
      
    }).catch(errorFn);
  });


server.post('/read-user', function(req, resp){
    console.log('Finding user');
  const searchQuery = { user: req.body.user, pass: req.body.pass };

  userModel.findOne(searchQuery).then(function(login) {
            console.log('Finding user');

            if (login && login._id) {
                const userJson = login.toJSON();
                loggedInUser = userJson;
                resp.render('profile', {
                    layout: 'index',
                    title: 'Profile',
                    userdata: userJson,
                    user: loggedInUser
                });
            } else {
                return restoModel.findOne(searchQuery);
            }
        })
        .then(function(restos) {
            if (restos && restos._id) {
                const restosJson = restos.toJSON();
                const landmarkresto = [];
                for (let i = 0; i < restodata.length; i++) {
                    if (restodata[i]["landmark"] == req.params.landmark && restodata[i]["linkname"] != req.params.linkname) {
                        landmarkresto.push(restodata[i]);
                    }
                }
                resp.render('restopage', {
                    layout: 'index',
                    title: 'Restaurant',
                    restodata: restosJson,
                    otherresto: landmarkresto,
                    user: loggedInUser
                });
            } else {
                // If neither user nor restaurant found
                resp.render('result', {
                    layout: 'index',
                    title: 'Result page',
                    status: 'bad',
                    msg: 'User-name and password do not match!'
                });
            }
        })
        .catch(function(error) {
            console.error(error);
            resp.render('result', {
                layout: 'index',
                title: 'Result page',
                status: 'bad',
                msg: 'An error occurred while processing your request.'
            });
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
        const landmarkresto = [];
        for(let i = 0; i < restodata.length; i++){
            if(restodata[i]["landmark"] == req.params.landmark && restodata[i]["linkname"] != req.params.linkname){
                landmarkresto.push(restodata[i]);
            }
        }
        resp.render('restopage',{
            layout      : 'index',
            title       : 'Restaurant',
            restodata   : restosJson,
            otherresto  : landmarkresto,
            user        : loggedInUser
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
        restos:  vals,
        user: loggedInUser
      });
    }).catch(errorFn);
  });

  server.get('/menu-page', function(req, resp){
    resp.render('menu',{
        layout      : 'index',
        title       : 'Signup',
        user        : loggedInUser
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

  server.get('/restoquery/:name/', function(req, resp){
    const searchQuery = { name: req.params.name };
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
        restos:  vals,
        user        : loggedInUser
      });
    }).catch(errorFn);
    resp.send({name: req.params.name});
  });

  server.get('/showall/', function(req, resp){
    
    restoModel.find({}).then(function(restos){
      console.log('List successful');
      let vals = [];
      let counts = 0;
      let subval = [];
      for(const item of restos){
        console.log(item.name);
        
        subval.push({
              name: item.name,
              linkname: item.linkname,
              image: item.imagesquare,
              landmark: item.landmark
          });
          console.log("subval");
          console.log(subval);
          counts+=1;
          if(counts == 4){
            counts=0;
            vals.push( subval);
            subval = new Array();
          }
      }
      vals.push( subval);
      resp.render('showall',{
        layout: 'index',
        title:  "Show All",
        restos:  vals,
        user        : loggedInUser
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