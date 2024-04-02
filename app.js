

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
mongoose.connect('mongodb://localhost:27017/restodb') .catch (error => console.log(error));
const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

server.use(session({
  secret: 'a secret fruit',
  saveUninitialized: true, 
  resave: false,
  store: new mongoStore({ 
    uri: 'mongodb://localhost:27017/restodb',
    collection: 'mySession',
    expires: 1000*60*60 // 1 hour
  })
}));

const bcrypt = require('bcrypt');
const saltRounds = 10;
let encrypted_pass = "";

const commentSchema = new mongoose.Schema({
    comimg: { type: String },
    comname: { type: String },
    com: { type: String },
    likes: {type: [String]},
    dislikes: {type: [String]},
    urlname: { type: String},
    notdeleted: { type: Boolean },
});

const reviewSchema = new mongoose.Schema({
    revimg: { type: String },
    revname: { type: String },
    revrating: { type: String},
    rev: { type: String },
    hascomments: { type: Boolean },
    likes: {type: [String]},
    dislikes: {type: [String]},
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
    revdata: [reviewSchema],
    reportdata:  [{ type: String }]
},{ versionKey: false });

const userSchema = new mongoose.Schema({
    name: { type: String },
    urlname: { type: String },
    user: { type: String },
    pass: { type: String },
    image: { type: String },
    description: {type: String},
    revdata: [reviewSchema],
    reportdata:  [{ type: String }]
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
const alluserdata = getUserList();
console.log(alluserdata);

hbs.handlebars.registerHelper('isActive', function(likeThumb, reviewIndex) {
    console.log(likeThumb);
    console.log(reviewIndex);
    console.log(likeThumb[reviewIndex]);
    if (likeThumb[reviewIndex] != 0) {
        return 'active'; 
    } else {
        return ''; 
    }
});


var sresto = {
  U_Mall:[],
  Burgundy:[],
  DLSU: [],
  EGI:[],
  Archers:[],
  G_Residences:[],
  R_Square:[],
  Man_Res:[]
}
restoModel.find({}).then(function(aresto){
for(r of aresto){
  sresto[r.landmark].push({linkname: r.linkname, name: r.name});
  
}
});

server.get('/', function(req, resp){


  if (req.session.login_user && req.session.login_id) {
    req.session.destroy(function(err) {
      if (err) {
        console.error('Error destroying session:', err);
        resp.status(500).send('Internal Server Error');
      } else {
        resp.redirect('/');
      }
    });
  } else {
    // If no session to destroy, render the main menu
    resp.render('main', {
      layout: 'index',
      title: 'Main Menu',
      sresto: sresto
    });
  }
});

//Use this to determine the user who's logged in
let loggedInUser;
let isUser;

server.get('/login-page', function(req, resp){
 
    resp.render('login',{
        layout      : 'index',
        title       : 'Login',
        sresto      : sresto
    });
});

server.get('/signup-page', function(req, resp){
  
    resp.render('signup',{
        layout      : 'index',
        title       : 'Sign Up',
        sresto      : sresto
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
      //Enclose here to hash passwords
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        encrypted_pass = hash;
        console.log("Encrypted pass: "+encrypted_pass);
        newModel = new restoModel({
          name: req.body.fname,
          linkname: req.body.fname.replace(/ /g, "_"),
          user: req.body.username,
          pass: encrypted_pass,
          image: "/common/Images/PFPs/resto-default.jpg",
          imagesquare: "/common/Images/PFPs/resto-default.jpg", 
          description: "",
          landmark: req.body.elandm[0],
          rating: 0,
          category: req.body.category,
          price: req.body.price,
          maplink: req.body.map,
          revdata: [],

      });
      //save and display the newModel
      newModel.save().then(function(user){
          console.log('User created');
          console.log(JSON.stringify(user));
          const restosJson = user.toJSON();
          /*
          const landmarkresto = [];
          for(let i = 0; i < restodata.length; i++){
              if(restodata[i]["landmark"] == req.params.landmark && restodata[i]["linkname"] != req.params.linkname){
                  landmarkresto.push(restodata[i]);
              }
          }*/
          restoModel.find({landmark: user.landmark, user: { $ne: user.user }}).lean().then(function(otherrestos) {
            req.session.login_user = user._id;
            req.session.login_id = req.sessionID;
            restoModel.findOne({_id: req.session.login_user}).lean().then(function(logged) {
              loggedInUser = logged;
              isUser = loggedInUser['linkname'];
              resp.render('restopage',{
                  layout      : 'index',
                  title       : 'Restaurant',
                  restodata   : restosJson,
                  otherresto  : otherrestos,
                  user        : loggedInUser,
                  checkUser   : isUser,
                  sresto      : sresto
            });
          })
        })
    
      }).catch(errorFn);
      });
       
    }

    else {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        encrypted_pass = hash;
        console.log("Encrypted pass: "+encrypted_pass);
        newModel = new userModel({
          name: req.body.fname,
          urlname: req.body.fname.replace(/ /g, "_"),
          user: req.body.username,
          pass: encrypted_pass,
          image: "/common/Images/PFPs/profile.webp",
          description: "",
          friends: [],
          reviews: [] });
          newModel.save().then(function(user){
            console.log('User created');
      
            console.log(JSON.stringify(user));
              const userJson = user.toJSON();
              userModel.find({}).lean().then(function(alluser){
              req.session.login_user = user._id;
              req.session.login_id = req.sessionID;
              userModel.findOne({_id: req.session.login_user}).lean().then(function(logged) {
                loggedInUser = logged;
                isUser = loggedInUser['urlname'];
                resp.render('profile',{
                    layout      : 'index',
                    title       : 'Profile',
                    userdata    : userJson,
                    user        : loggedInUser,
                    otherusers  : alluserdata,
                    checkUser   : isUser,
                    otherusers  : alluser,
                    sresto      : sresto
                });
              })
            }).catch(errorFn);
          }).catch(errorFn);
    
      });
    }
    
  });


server.post('/read-user', function(req, resp){
  console.log('Finding user');
  
  const searchQuery = { user: req.body.user};
  //look for the user
  //compare if the password of the user matches the encrypted one 
  userModel.findOne(searchQuery).then(function(login) {
            console.log('Finding user');

            if (login && login._id) {
                bcrypt.compare(req.body.pass, login.pass, function(err, result) {
                  if(result){
                  const userJson = login.toJSON();
                  userModel.find({}).lean().then(function(alluser){
                  req.session.login_user = login._id;
                  req.session.login_id = req.sessionID;
                  userModel.findOne({_id: req.session.login_user}).lean().then(function(logged) {
                    loggedInUser = logged;
                    console.log(loggedInUser)
                    isUser = loggedInUser['urlname'];
                    resp.render('profile', {
                        layout: 'index',
                        title: 'Profile',
                        userdata: userJson,
                        user: loggedInUser,
                        otherusers  : alluserdata,
                        checkUser: isUser,
                        otherusers: alluser,
                        sresto      : sresto
                    });
                  })
                })
                 
                } else {
                    resp.render('login',{
                      layout      : 'index',
                      title       : 'Login',
                      errorMessage: 'Username and password not found!',
                      sresto      : sresto
                  });
                }
              });
            
                
            } else {
              //find the username
                restoModel.findOne(searchQuery).then(function(restos) {
                    if (restos && restos._id) {
                      console.log("restos pass = "+restos.pass);
                      //see if they match
                      bcrypt.compare(req.body.pass, restos.pass, function(err, result) {
                        if(result){
                          
                          const restosJson = restos.toJSON();
                          restoModel.find({landmark: restos.landmark, user: { $ne: restos.user }}).lean().then(function(otherrestos) {
                            req.session.login_user = restos._id;
                            req.session.login_id = req.sessionID;
                            restoModel.findOne({_id: req.session.login_user}).lean().then(function(logged) {
                              loggedInUser = logged;
                              isUser = loggedInUser['linkname'];
                              let getratesum = 0;
                                let likeThumb = "";
                                let dislikeThumb = "";
                                let clikeThumb = "";
                                let cdislikeThumb = "";
                                let undeleted = 0;

                                for(let j = 0; j < restos.revdata.length; j++){
                                if(restos.revdata[j]["notdeleted"]==true){
                                        for(let k = 0; k < restos.revdata[j].revrating.length; k++){
                                            if(restos.revdata[j].revrating[k] == "★" ){
                                                getratesum+= 1;
                                            }
                                        }
                                        undeleted+=1;
                                        
                                        if (restos.revdata[j].hascomments != false) {
                                            for(let x = 0; x < restos.revdata[j].comments.length; x++){
                                                if(restos.revdata[j].comments[x].likes.includes(loggedInUser.user)){
                                                    clikeThumb+= 1;
                                                }else {
                                                    clikeThumb+= 0;
                                                }
                                                if(restos.revdata[j].comments[x].dislikes.includes(loggedInUser.user)){
                                                    cdislikeThumb+= 1;
                                                }else {
                                                    cdislikeThumb+= 0;
                                                }
                                            }

                                        }
                                        if(restos.revdata[j].likes.includes(loggedInUser.user)){
                                            likeThumb+= 1;
                                        }else {
                                            likeThumb+= 0;
                                        }
                                        if(restos.revdata[j].dislikes.includes(loggedInUser.user)){
                                            dislikeThumb+= 1;
                                        }else {
                                            dislikeThumb+= 0;
                                        }
                                    }

                                }

                              resp.render('restopage', {
                                  layout: 'index',
                                  title: 'Restaurant',
                                  restodata: restosJson,
                                  otherresto: otherrestos,
                                  user: loggedInUser,
                                  lThumbs   : likeThumb,
                                    dThumbs: dislikeThumb,
                                    clThumbs   : clikeThumb,
                                    cdThumbs: cdislikeThumb,
                                    checkUser: isUser,
                                    vrating      : 100-(((getratesum/undeleted)/5)*100),
                                  checkUser: isUser,
                                  sresto      : sresto
                              });
                          })
                        })
                          
                        } else {
                          resp.render('login',{
                            layout      : 'index',
                            title       : 'Login',
                            errorMessage: 'Username and password not found!',
                            sresto      : sresto
                        });
                        }
                    });
                       
                    } else {
                        // If neither user nor restaurant found
                        resp.render('login',{
                            layout      : 'index',
                            title       : 'Login',
                            errorMessage: 'Username and password not found!',
                            sresto      : sresto
                        });
                   
                    }
                })
                .catch(function(error) {
                    console.error(error);
                    resp.render('login',{
                        layout      : 'index',
                        title       : 'Login',
                        errorMessage: 'Username and password not found!',
                        sresto      : sresto
                    });
                });
            }
        })
        
});


server.get('/restaurant/:landmark/:linkname', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
    
    const searchQuery = { landmark: req.params.landmark, 
                          linkname: req.params.linkname};

    //options.returnDocument='after'
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

        let getratesum = 0;
        let likeThumb = "";
        let dislikeThumb = "";
        let clikeThumb = "";
        let cdislikeThumb = "";
        let undeleted = 0;
        
        for(let j = 0; j < restos.revdata.length; j++){
          if(restos.revdata[j]["notdeleted"]==true){
                for(let k = 0; k < restos.revdata[j].revrating.length; k++){
                    if(restos.revdata[j].revrating[k] == "★" ){
                        getratesum+= 1;
                    }
                }
                undeleted+=1;
                
                if (restos.revdata[j].hascomments != false) {
                    for(let x = 0; x < restos.revdata[j].comments.length; x++){
                        if(restos.revdata[j].comments[x].likes.includes(loggedInUser.user)){
                            clikeThumb+= 1;
                        }else {
                            clikeThumb+= 0;
                        }
                        if(restos.revdata[j].comments[x].dislikes.includes(loggedInUser.user)){
                            cdislikeThumb+= 1;
                        }else {
                            cdislikeThumb+= 0;
                        }
                    }

                }
                if(restos.revdata[j].likes.includes(loggedInUser.user)){
                    likeThumb+= 1;
                }else {
                    likeThumb+= 0;
                }
                if(restos.revdata[j].dislikes.includes(loggedInUser.user)){
                    dislikeThumb+= 1;
                }else {
                    dislikeThumb+= 0;
                }
            }
    
        }
        
        
    
  

        console.log("likes:"+likeThumb);
        console.log("dislikes:"+dislikeThumb);
        console.log("clikes:"+clikeThumb);
        console.log("cdislikes:"+cdislikeThumb);
        restos.rating = getratesum/undeleted;



        console.log("rating:"+(getratesum/undeleted));
        
        resp.render('restopage',{
            layout      : 'index',
            title       : 'Restaurant',
            restodata   : restosJson,
            otherresto  : landmarkresto,
            user        : loggedInUser,
            lThumbs   : likeThumb,
            dThumbs: dislikeThumb,
            clThumbs   : clikeThumb,
            cdThumbs: cdislikeThumb,
            checkUser: isUser,
            vrating      : 100-(((getratesum/undeleted)/5)*100),
            sresto      : sresto
        });
    }
    }).catch(errorFn);
  });

server.get('/restopage/:landmark/', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
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
        checkUser: isUser,
        sresto      : sresto
      });
    }).catch(errorFn);
  });

  server.get('/menu-page', function(req, resp){
    resp.render('menu',{
        layout      : 'index',
        title       : 'Menu',
        user        : loggedInUser,
        checkUser: isUser,
        sresto      : sresto
    });
});

server.get('/profile-page/:urlname', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
  let searchQuery2;
  let regex;
    if(req.query.userfield === undefined){
        searchQuery2 = {};
    } else {
        const substring = req.query.userfield;
        regex = new RegExp(substring, 'i');
        searchQuery2 = {name: regex};
    }
  const searchQuery = { urlname: req.params.urlname};
  userModel.find(searchQuery2).lean().then(function(alluser){
    userModel.findOne(searchQuery).then(function(user){
        //console.log(JSON.stringify(user));
        if(user != undefined && user._id != null){
          const userJson = user.toJSON();
          resp.render('profile',{
              layout      : 'index',
              title       : 'Profile',
              userdata   : userJson,
              otherusers  : alluserdata,
              user        : loggedInUser,
              checkUser: isUser,
              otherusers: alluser,
              sresto      : sresto
            });
        }
      }).catch(errorFn);
    }).catch(errorFn);
});

  server.get('/restoquery/:name/', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
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
        checkUser: isUser,
        sresto      : sresto
      });
    }).catch(errorFn);
    resp.send({name: req.params.name});
  });

  server.get('/showall/', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
    let searchQuery;
    let regex;
    if(req.query.searchfield === undefined){
        searchQuery = {};
    } else {
        regex = new RegExp(req.query.searchfield, 'i');
        searchQuery = {name: regex};
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
        checkUser: isUser,
        sresto      : sresto
      });
    }).catch(errorFn);
  });

  server.get('/showalladvanced/', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
  // Initialize an empty search query object
    let searchQuery = {};

    // Check if lowerprice and/or upperprice are defined and non-empty
    if (req.query.lowerprice !== '' || req.query.upperprice !== '') {
        // Construct the price range query
        searchQuery.price = {};
        if (req.query.lowerprice !== '') {
            searchQuery.price.$gte = req.query.lowerprice;
        }
        if (req.query.upperprice !== '') {
            searchQuery.price.$lte = req.query.upperprice;
        }
    }

    // Check if rate is defined and non-empty
    if (req.query.rate >= 1) {
        // Add rating query to the search query
        searchQuery.rating = { $gte: req.query.rate };
        console.log(req.query.rate);
    } else {
      searchQuery.rating = { $gte: 0 };
      console.log(req.query.rate);
    }

    // Check if category is defined and non-empty
    if (req.query.category !== '') {
        // Add category query to the search query
        searchQuery.category = req.query.category;
        console.log(req.query.category);
    }
    console.log(searchQuery);
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
        checkUser: isUser,
        sresto      : sresto
      });
    }).catch(errorFn);
  });

  
server.post('/reaction', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
  //const updateQuery = { user: req.body.id };
  console.log("req.body.rev: " + req.body.rev);
  console.log("req.body.person: " + req.body.person);

  userModel.findOne({name: req.body.person}).then(function(users){
    console.log("username: " + users.user);
    let username = users.user;
    
    restoModel.find({}).then(function(restos){
      console.log('List successful');
    
      let found = 0; // all restaurants
      for(let i = 0; i < restos.length && found == 0; i++)
      { // all reviews in that restaurant
        for(let j = 0; j < restos[i].revdata.length && found == 0; j++)
        {
          if(restos[i].revdata[j]["rev"] == req.body.rev)
          {
            console.log("review found: " + restos[i].revdata[j]["rev"]);
            console.log(req.body.eclass);
        
            if (req.body.action == "like"){
                if (req.body.eclass == 1){
                    for (let x = 0; x < restos[i].revdata[j].likes.length; x++){
                        if (restos[i].revdata[j].likes[x] == username){
                            let spliced = restos[i].revdata[j].likes.splice(x, 1); 
                            console.log("Removed element: " + spliced); 
                            console.log("Remaining elements: " + restos[i].revdata[j].likes);
                        }
                    }
                } else {
                    for (let y = 0; y < restos[i].revdata[j].dislikes.length; y++){
                        if (restos[i].revdata[j].dislikes[y] == username){
                            let spliced = restos[i].revdata[j].dislikes.splice(y, 1); 
                            console.log("Removed element: " + spliced); 
                            console.log("Remaining elements: " + restos[i].revdata[j].dislikes);
                        }
                    }
        
                    restos[i].revdata[j].likes.push(username);
                    console.log("Likes: " + restos[i].revdata[j].likes); 
                }

                
            } else {
                if (req.body.eclass == 1){ 
                    for (let y = 0; y < restos[i].revdata[j].dislikes.length; y++){
                        if (restos[i].revdata[j].dislikes[y] == username){
                            let spliced = restos[i].revdata[j].dislikes.splice(y, 1); 
                            console.log("Removed element: " + spliced); 
                            console.log("Remaining elements: " + restos[i].revdata[j].dislikes);
                        }
                    }
                } else {
                    for (let x = 0; x < restos[i].revdata[j].likes.length; x++){
                        if (restos[i].revdata[j].likes[x] == username){
                            let spliced = restos[i].revdata[j].likes.splice(x, 1); 
                            console.log("Removed element: " + spliced); 
                            console.log("Remaining elements: " + restos[i].revdata[j].likes);
                        }
                    }
                    restos[i].revdata[j].dislikes.push(username);
                    console.log("dislikes: " + restos[i].revdata[j].dislikes);
                }
                
            }
            
            restos[i].save();
            resp.sendStatus(200);
          }
        }
      }
    }).catch(errorFn);
  }).catch(errorFn);
  });
 

  
  server.post('/change-profilepic', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
    var pic= req.body.userbio;
  var split = pic.split(".");
  var fileformat = split[split.length-1];
  var errormsg = "";
  console.log(split[split.length-1]);
    if(fileformat!="png" && fileformat!="jpg"){
      
      pic = "/common/Images/PFPs/profile.webp";
      errormsg = "?invalid-img-format";
    }
      userModel.findOneAndUpdate({user:loggedInUser.user}, {image: pic}).lean().then(function () {
     
        loggedInUser.image=pic;
        
        resp.redirect('/profile-page/'+loggedInUser.urlname+'/'+errormsg);
      
  });
    
  });
  server.post('/change-userbio', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
    const userbio= req.body.userbio;
  
    userModel.findOneAndUpdate({user:loggedInUser.user}, {description: userbio}).then(function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Updated Docs : ", docs);
      }
      resp.redirect('/profile-page/'+loggedInUser.urlname+'/');
  });
  });

  server.post('/change-restopic', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
    console.log("changerestoimg");
    var img= req.body.restodesc;
    var split = img.split(".");
    var fileformat = split[split.length-1];
    var errormsg ="";
    console.log(split[split.length-1]);
      if(fileformat!="png" && fileformat!="jpg"){
        
        img = "/common/Images/PFPs/resto-default.jpg";
        errormsg = "?invalid-img-format"
      }
    restoModel.findOneAndUpdate({user:loggedInUser.user}, {image:img}).then(function () {
      
        loggedInUser.imagesquare=img;

      resp.redirect('/restaurant/'+loggedInUser.landmark+'/'+loggedInUser.linkname+'/'+errormsg);
   
  });
      
  });
  
  server.post('/report-user', function(req, resp){

    const searchQuery = {user: req.body.username};
    const report = req.body.reportmsg;
    let reporteduser;
    var errormsg = "?invalid-report";
    console.log(req.body.username);
    console.log(req.body.reportmsg);
    
    userModel.findOne(searchQuery).then(function(user){
      user.reportdata.push(report);
      if(report!="" && report!="What's the issue?"){
        user.save();
        errormsg = "";
      }
      reporteduser = user.urlname;
      console.log(reporteduser);
      resp.redirect('/profile-page/'+reporteduser+'/'+errormsg);
    }).catch(errorFn);
  
  
  });

  server.post('/report-resto', function(req, resp){

    const searchQuery = {name: req.body.restoname, landmark: req.body.landmark};
    const report = req.body.reportmsg;
    let reporteduser;
    let repuserlandmark;
    var errormsg = "?invalid-report";
   
       restoModel.findOne(searchQuery).then(function(user){
      user.reportdata.push(report);
       if(report!="" && report!="What's the issue?"){user.save();  errormsg="" }
      reporteduser = user.linkname;
      repuserlandmark = user.landmark
      resp.redirect('/restaurant/'+repuserlandmark+'/'+reporteduser+'/'+errormsg);
    }).catch(errorFn);
 
   
       
  });
server.post('/change-restobio', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
  console.log("changerestobio");
  const userbio= req.body.restodesc;
  
  restoModel.findOneAndUpdate({user:loggedInUser.user}, {description: userbio}).then(function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Docs : ", docs);
    }
    resp.redirect('/restaurant/'+loggedInUser.landmark+'/'+loggedInUser.linkname+'/');
});
  
    
});

server.post('/updateLikes', function(req, resp){
    if(req.session.login_id == undefined){
      resp.redirect('/?login=unlogged');
      return;
    }
    console.log("changerestobio");
    const userbio= req.body.restodesc;
    
    restoModel.findOneAndUpdate({user:loggedInUser.user}, {description: userbio}).then(function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("Updated Docs : ", docs);
      }
      resp.redirect('/restaurant/'+loggedInUser.landmark+'/'+loggedInUser.linkname+'/');
  });
    
      
  });

server.post('/deletecomment', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
  console.log("req.body.revin: " + req.body.revin);
  console.log("req.body.comin: " + req.body.comin);
  console.log("req.body.restoname: " + req.body.restoname);
  console.log("req.body.username: " + req.body.username);
  //user -> revdata
  //resto -> revdata -> comment

  if(req.body.comin != -1){
    restoModel.find({ name: req.body.restoname }).then(function(restos){

    let found = 0;
    for(let i = 0; i < restos.length && found == 0; i++)
    {
      console.log("comment found: " + restos[i].revdata[req.body.revin].comments[req.body.comin]["com"]);
      restos[i].revdata[req.body.revin].comments[req.body.comin]["notdeleted"] = false;
      found = 1;  
      restos[i].save().then(function (result) {
        if(result){
          resp.sendStatus(200);
        }
      });
    }
  }).catch(errorFn);
  }
  else {
    // FOR DELETING COMMENTS THAT ARE IN REVIEW
    restoModel.find({ name: req.body.restoname }).then(function(restos){
      let found = 0;
      let found2 = 0;
      for(let i = 0; i < restos.length && found == 0; i++)
      {
        console.log("review found: " + restos[i].revdata[req.body.revin]["rev"]);
        restos[i].revdata[req.body.revin]["notdeleted"] = false;
        found = 1;
        let revcontent = restos[i].revdata[req.body.revin]["rev"];
        let revresto = restos[i]["name"];
        restos[i].save();
      
        userModel.find({ name: req.body.username }).then(function(users){
          for(let i = 0; i < users.length && found2 == 0; i++)
          {
            for(let j = 0; j < users[i].revdata.length && found2 == 0; j++)
            { // make sure resto and review is the same as the one found
              if(users[i].revdata[j]["rev"] == revcontent && users[i].revdata[j]["revname"] == revresto)
              {
                console.log("profile review found: " + users[i].revdata[j]["rev"]);
                users[i].revdata[j]["notdeleted"] = false;
                found2 = 1;
                users[i].save().then(function (result) {
                  if(result){
                    resp.sendStatus(200);
                  }
                });
              }
            }
          }
        }).catch(errorFn);
      }
    }).catch(errorFn);
  }
});


server.post('/replycomment', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
  //const updateQuery = { user: req.body.id };
  console.log("req.body.id: " + req.body.id);
  console.log("req.body.reply: " + req.body.reply);
  console.log("req.body.person: " + req.body.person);
  console.log("req.body.resto: " + req.body.resto);

  userModel.findOne({name: req.body.person}).then(function(user){
    console.log("user: " + user);
    let userimage = user.image;
    let userurl = user.urlname;
    
    restoModel.find({ name : req.body.resto} ).then(function(restos){
      console.log('List successful');
    
      let found = 0; // all restaurants
      for(let i = 0; i < restos.length && found == 0; i++)
      { // all reviews in that restaurant

        console.log("review found: " + restos[i].revdata[req.body.id]["rev"]);
        console.log("revdatalength found: " + restos[i].revdata[req.body.id].comments.length);

        let newComment = {
          comimg: userimage,
          comname: req.body.person,
          com: req.body.reply,
          likes: [],
          dislikes: [],
          urlname: userurl,
          notdeleted: true
        };

        restos[i].revdata[req.body.id].comments.push(newComment);
        restos[i].revdata[req.body.id]["hascomments"] = true;
        found = 1;
        restos[i].save();
        resp.sendStatus(200);

      }
    }).catch(errorFn);
  }).catch(errorFn);

  
});


server.post('/leavereview', function(req, resp){
  if(req.session.login_id == undefined){
    resp.redirect('/?login=unlogged');
    return;
  }
    //const updateQuery = { user: req.body.id };
    console.log("req.body.person: " + req.body.person);
    console.log("req.body.rating: " + req.body.rating);
  
    userModel.findOne({name: req.body.person}).then(function(user){
      console.log("user: " + user);
      console.log("user url: " + user.urlname);
      let userimage = user.image;
      let userurl = "/profile-page/"+user.urlname;
      
      //add to resto model
      restoModel.find({}).then(function(restos){
        console.log('List successful');
      
        let found = 0; // all restaurants
        for(let i = 0; i < restos.length && found == 0; i++)
        { // all reviews in that restaurant
            if(restos[i].name == req.body.resto)
          {
          let j = restos[i].revdata.length;

              let newReview = {
                revimg: userimage,
                revname: req.body.person,
                revrating: req.body.rating,
                rev: req.body.review,
                likes: [],
                dislikes: [],
                urlname: userurl,
                notdeleted: true
              };
      
              restos[i].revdata.push(newReview);

              
      let getratesum = 0;
      let undeleted = 0;
      for(let l = 0; l < restos[i].revdata.length; l++){
        if(restos[i].revdata[l]["notdeleted"]==true){
        for(let k = 0; k < restos[i].revdata[l].revrating.length; k++){
            if(restos[i].revdata[l].revrating[k] == "★" ){
                getratesum+= 1;
            }
        }
        undeleted+=1;
      }
      }
      
      restos[i].rating = getratesum/undeleted;


              console.log("review found: " + restos[i].revdata[j]["rev"]);
              console.log("review found: " + restos[i].revdata[j]["revrating"]);
              console.log("review found: " + restos[i].revdata[j]["urlname"]);

              restos[i].revdata[j]["hascomments"] = false;
              found = 1;
              restos[i].save();
              console.log("Saved in review");
          }
          
        }

        restoModel.findOne({name: req.body.resto}).then(function(resto2){
            console.log("resto: " + resto2);
            console.log("resto url: " + resto2.urlname);
            let restoimage = resto2.imagesquare;
            let restourl = "/restaurant/"+ resto2.landmark +"/"+ resto2.linkname;
            
            //add to resto model
            userModel.find({}).then(function(users2){
              console.log('List successful');
            
              let found = 0; // all users
              for(let i = 0; i < users2.length && found == 0; i++)
              { // all reviews by users
                  if(users2[i].name == req.body.person)
                {
                let j = users2[i].revdata.length;
      
                    let newReview2 = {
                      revimg: restoimage,
                      revname: req.body.resto,
                      revrating: req.body.rating,
                      rev: req.body.review,
                      urlname: restourl,
                      notdeleted: true
                    };
            
                    users2[i].revdata.push(newReview2);
      
                    console.log("review in users found: " + users2[i].revdata[j]["rev"]);
                    console.log("review in users found: " + users2[i].revdata[j]["revrating"]);
                    console.log("review in users found: " + users2[i].revdata[j]["urlname"]);
      
                    users2[i].revdata[j]["hascomments"] = false;
                    found = 1;
                    users2[i].save();
                    resp.sendStatus(200);
                }
                
              }
            }).catch(errorFn);
          }).catch(errorFn);
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