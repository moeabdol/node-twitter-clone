const express    = require('express');
const hbs        = require('express-handlebars');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const path       = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, err => {
  if (err) return console.log(err);
  console.log('Server listening on port', PORT);
});
