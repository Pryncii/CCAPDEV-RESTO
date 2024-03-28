const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
const hbs = handlebars.create({
    extname: 'hbs',
    helpers: {
        eq: function (val1, val2, options) {
            if (val1 === val2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
});

// Set handlebars engine
server.engine('hbs', hbs.engine);
server.set('view engine', 'hbs');

server.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restodb');

const commentSchema = new mongoose.Schema({
    comimg: { type: String },
    comname: { type: String },
    com: { type: String },
    urlname: { type: String},
    notdeleted: { type: Boolean },
});

const reviewSchema = new mongoose.Schema({
    revimg: { type: String },
    revname: { type: String },
    revrating: { type: String},
    rev: { type: String },
    hascomments: { type: Boolean },
    comments: [commentSchema],
    urlname: { type: String},
    notdeleted: { type: Boolean }
});

const restoSchema = new mongoose.Schema({
    name: { type: String },
    linkname: { type: String},
    user: { type: String },
    pass: { type: String },
    image: { type: String },
    imagesquare: {type: String},
    description: { type: String },
    landmark: { type: String },
    rating: { type: Number },
    category: { type: String },
    price: { type: Number },
    maplink: { type: String },
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
let loggedInUser;
let isUser;

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
            pass: req.body.password,
            image: "/common/Images/PFPs/resto-default.jpg",
            imagesquare: "/common/Images/PFPs/resto-default.jpg", 
            description: "",
            landmark: req.body.elandm.replace(/ /g, "_"),
            rating: 0,
            category: req.body.category,
            price: req.body.price,
            maplink: req.body.map,
            revdata: [],

        });
        model = 0;
    
    }

    else {
        newModel = new userModel({
            name: req.body.fname,
            urlname: req.body.fname.replace(/ /g, "_"),
            user: req.body.username,
            pass: req.body.password,
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
            user        : loggedInUser,
            checkUser: isUser
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
            user        : loggedInUser,
            checkUser: isUser
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
                isUser = loggedInUser['urlname'];
                resp.render('profile', {
                    layout: 'index',
                    title: 'Profile',
                    userdata: userJson,
                    user: loggedInUser,
                    checkUser: isUser
                });
            } else {
                restoModel.findOne(searchQuery).then(function(restos) {
                    if (restos && restos._id) {
                        const restosJson = restos.toJSON();
                        loggedInUser = restosJson;
                        isUser = loggedInUser['linkname'];
                        console.log(isUser);
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
                            user: loggedInUser,
                            checkUser: isUser
                        });
                    } else {
                        // If neither user nor restaurant found
                        resp.render('login',{
                            layout      : 'index',
                            title       : 'Login',
                            errorMessage: 'Username and password not found!'
                        });
                   
                    }
                })
                .catch(function(error) {
                    console.error(error);
                    resp.render('login',{
                        layout      : 'index',
                        title       : 'Login',
                        errorMessage: 'Username and password not found!'
                    });
                });
            }
        })
        
});

server.get('/restaurant/:landmark/:linkname', function(req, resp){
    const searchQuery = { landmark: req.params.landmark, 
                          linkname: req.params.linkname};
    restoModel.findOne(searchQuery).then(function(restos){
      //console.log(JSON.stringify(restos));
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
            user        : loggedInUser,
            checkUser: isUser,

            vrating      : 100-((restosJson.rating/5)*100)
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
        user: loggedInUser,
        checkUser: isUser
      });
    }).catch(errorFn);
  });

  server.get('/menu-page', function(req, resp){
    resp.render('menu',{
        layout      : 'index',
        title       : 'Menu',
        user        : loggedInUser,
        checkUser: isUser
    });
});

server.get('/profile-page/:urlname', function(req, resp){
    const searchQuery = { urlname: req.params.urlname};

    userModel.findOne(searchQuery).then(function(user){
        //console.log(JSON.stringify(user));
        if(user != undefined && user._id != null){
          const userJson = user.toJSON();
          resp.render('profile',{
              layout      : 'index',
              title       : 'Profile',
              userdata   : userJson,
              user        : loggedInUser,
              checkUser: isUser
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
        user        : loggedInUser,
        checkUser: isUser
      });
    }).catch(errorFn);
    resp.send({name: req.params.name});
  });

  server.get('/showall/', function(req, resp){
    
    let searchQuery;
    if(req.query.searchfield === undefined){
        searchQuery = {};
    } else {
        searchQuery = {name: req.query.searchfield};
    }
    //console.log(req.query.searchfield)
    restoModel.find(searchQuery).then(function(restos){
      console.log('List successful');
      let vals = [];
      let counts = 0;
      let subval = [];
      for(const item of restos){
        //console.log(item.name);
        
        subval.push({
              name: item.name,
              linkname: item.linkname,
              image: item.imagesquare,
              landmark: item.landmark
          });
          //console.log("subval");
          //console.log(subval);
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
        user        : loggedInUser,
        checkUser: isUser
      });
    }).catch(errorFn);
  });


server.post('/change-restobio', function(req, resp){
    
    
});

server.post('/deletecomment', function(req, resp){
    //const updateQuery = { user: req.body.id };
    console.log("req.body.id: " + req.body.id);
  //user -> revdata
  //resto -> revdata -> comment

// FOR DELETING COMMENTS THAT ARE IN REPLY OF REVIEWS
restoModel.find({}).then(function(restos){
  console.log('List successful');

  let found = 0;
  for(let i = 0; i < restos.length && found == 0; i++)
  {
    //console.log("revdatalength: " + restos[i].revdata.length);

    for(let j = 0; j < restos[i].revdata.length && found == 0; j++)
    {
      for(let k = 0; k < restos[i].revdata[j].comments.length && found == 0; k++)
      {
        if(restos[i].revdata[j].comments[k]["com"] == req.body.id)
        {
          console.log("comment found: " + restos[i].revdata[j].comments[k]["com"]);
          restos[i].revdata[j].comments[k]["notdeleted"] = false;
          found = 1;

          restos[i].save().then(function (result) {
            if(result){
              resp.sendStatus(200);
            }
          });
        }
      }
    }
  }
}).catch(errorFn);

// FOR DELETING COMMENTS THAT ARE IN REVIEW
restoModel.find({}).then(function(restos){
  console.log('List successful');

  let found = 0; // all restaurants
  for(let i = 0; i < restos.length && found == 0; i++)
  { // all reviews in that restaurant
    for(let j = 0; j < restos[i].revdata.length && found == 0; j++)
    {
      if(restos[i].revdata[j]["rev"] == req.body.id)
      {
        console.log("review found: " + restos[i].revdata[j]["rev"]);
        restos[i].revdata[j]["notdeleted"] = false;
        found = 1;
        restos[i].save();
      }
    }
  }
}).catch(errorFn);

// FOR DELETING COMMENTS THAT ARE IN PROFILE PAGE
userModel.find({}).then(function(users){
  console.log('List successful');

  let found = 0; // all users
  for(let i = 0; i < users.length && found == 0; i++)
  { // all reviews in user
    for(let j = 0; j < users[i].revdata.length && found == 0; j++)
    {
      if(users[i].revdata[j]["rev"] == req.body.id)
      {
        console.log("profile review found: " + users[i].revdata[j]["rev"]);
        users[i].revdata[j]["notdeleted"] = false;
        found = 1;
        users[i].save().then(function (result) {
          if(result){
            resp.sendStatus(200);
          }
        });
      }
    }
  }
}).catch(errorFn);
});

server.post('/replycomment', function(req, resp){
  //const updateQuery = { user: req.body.id };
  console.log("req.body.id: " + req.body.id);
  console.log("req.body.reply: " + req.body.reply);
  console.log("req.body.person: " + req.body.person);

  userModel.findOne({name: req.body.person}).then(function(user){
    console.log("user: " + user);
    let userimage = user.image;
    let userurl = user.urlname;
    
    restoModel.find({}).then(function(restos){
      console.log('List successful');
    
      let found = 0; // all restaurants
      for(let i = 0; i < restos.length && found == 0; i++)
      { // all reviews in that restaurant
        for(let j = 0; j < restos[i].revdata.length && found == 0; j++)
        {
          if(restos[i].revdata[j]["rev"] == req.body.id)
          {
            console.log("review found: " + restos[i].revdata[j]["rev"]);
            console.log("revdatalength found: " + restos[i].revdata[j].comments.length);

            let newComment = {
              comimg: userimage,
              comname: req.body.person,
              com: req.body.reply,
              likes: 0,
              dislikes: 0,
              urlname: userurl,
              notdeleted: true
            };
    
            restos[i].revdata[j].comments.push(newComment);
            restos[i].revdata[j]["hascomments"] = true;
            found = 1;
            restos[i].save();
            resp.sendStatus(200);
          }
        }
      }
    }).catch(errorFn);
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