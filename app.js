const express    = require('express');
const hbs        = require('express-handlebars');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const session    = require('express-session');
const flash      = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const passport   = require('passport');
const path       = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./realtime/io')(io);

const PORT = 3000;
const config = require('./config');
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/users');

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
  store: new MongoStore({ url: config.db, autoReconnect: true })
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

app.use(mainRoutes);
app.use('/users', userRoutes);

http.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
