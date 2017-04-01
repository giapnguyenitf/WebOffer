const express = require('express');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 8080;
const engine = require('./engine');
const favicon = require('serve-favicon');
const utils = require('./utils');

//# express middleware
const session = require('cookie-session')({//express-session
  secret: 'nodejs faucet website',
  resave: true,
  saveUninitialized: true
});

const bodyParser = require('body-parser');
const sharedSession = require('express-socket.io-session');

//# use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session);

app.use('/assets', express.static( __dirname + '/assets')); //nginx
app.use(favicon(__dirname + '/assets/images/favicon.ico'));
app.engine(engine.ext, engine.__engine__);
app.set('views', __dirname + '/views');
app.set('view engine', engine.ext);

//#catch all
app.use(function(req, res, next) {
  //catch all
  next();
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error/500');
});

//RESTfull api
app.use('/', require('./router'));
app.use('/manager', require('./router/pages-manager'));
app.use('/admin', require('./router/admin'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('error/404');
});

server.listen(port, function(){
  console.log(`application run on port ${port}`);
});

//#socket-io
const io = require('socket.io')(server);
const DELAY = 200;

//#use middleware
io.use(sharedSession(session, {
    autoSave:true
}));

io.on('connection',function(socket) {
  let onevent = socket.onevent;
  socket.req = {last: 0, count: 1, reg: Date.now()};

  socket.onevent = function (packet) {
    let args = packet.data || [];
    //#check when receive
    if(Date.now() - socket.req.last > DELAY)
    {
      socket.req.last = Date.now();
      ++socket.req.count;
      return onevent.call(this, packet);
    }

    socket.emit('tomanyrequest');
  };
});
