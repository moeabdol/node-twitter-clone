const express    = require('express');
const hbs        = require('express-handlebars');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const path       = require('path');

const app = express();

const PORT = 3000;
const mainRoutes = require('./routes/main');

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

app.use(mainRoutes);

app.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
