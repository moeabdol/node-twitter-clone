const express          = require('express');
const hbs              = require('express-handlebars');
const morgan           = require('morgan');
const bodyParser       = require('body-parser');
const session          = require('express-session');
const flash            = require('connect-flash');
const MongoStore       = require('connect-mongo')(session);
const passport         = require('passport');
const passportSocketIo = require('passport.socketio');
const cookieParser     = require('cookie-parser');
const path             = require('path');

const app = express();

const PORT = 3000;
const config = require('./config');
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users');
const sessionStore = new MongoStore({ url: config.db, autoReconnect: true });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: sessionStore
}));

app.use(flash());

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./realtime/io')(io);
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: 'connect.sid',
  secret: config.secret,
  store: sessionStore,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if (error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}

app.use(mainRoutes);
app.use('/users', userRoutes);

http.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
