const responder = require('../models/Responder');

function add(server){
  server.get('/', function(req, resp){
    resp.render('main',{
      layout: 'index',
      title: 'Chatbot Example!'
    });
  });
  
  server.get('/hello', function(req, resp){
    resp.redirect('/advertisement/');
  });
  
  server.post('/chatbot-answer', function(req, resp){
    resp.send({
      original: req.body.msg,
      response: responder.getResponse(req.body.msg),
      terminal: 0
    });
  });
}

module.exports.add = add;