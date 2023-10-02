const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./bin/config');
const morgan  = require('morgan');

global.__config = config;

//Import Routers
const accRouter = require('./api/routers/account.router');
const sesRouter = require('./api/routers/session.router');
const maiRouter = require('./api/routers/main.router');
const memRouter = require('./api/routers/member.router');
const booRouter = require('./api/routers/booking.router');
const cusRouter = require('./api/routers/customer.router');

const app = express();

Object.prototype.ObjectKeyMapper = function (oldKey, newKey) {
  let value = this[oldKey];

  delete this[oldKey];
  newKey != null ? this[newKey] = value : null;
}

Object.prototype.ObjectKeysMapper = function (keyMaps, filter = false) {
  const keys = filter ? Object.keys(this) : Object.keys(keyMaps);

  for(let i = 0; i < keys.length; i++){
    let key = keys[i];
    this.ObjectKeyMapper(key, keyMaps[key]);
  }
}

Object.prototype.ObjectMapper = function(keyMaps, sourceObj, options = {}) {
  const keys = Object.keys(keyMaps);

  for(let i = 0; i < keys.length; i++){
    let key = keys[i];
    let value = sourceObj[keyMaps[key]];

    if(typeof value == 'string' && !options[keyMaps[key]]) value = capitalizeFirstLetter(value);
    if(key == 'Birthday'){
      let dateOptions = {year: 'numeric', month: 'long', day: 'numeric'};
      value = (new Date(Date.parse(value)).toLocaleDateString('en-US', dateOptions));
    }
    this[key] = value;
  }
}

String.prototype.NameSerializer = function(prefix, suffix = '') {
  if (this !== '')
    return prefix + this + suffix
  return this
}

global.capitalizeFirstLetter = (string) => string.toLowerCase().replace(/[^\s]+/g, (match) =>
  match.replace(/^./, (m) => m.toUpperCase()));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(morgan('[:date[web]] :method :url :status :response-time ms - :res[content-length]'));

//Routers
app.use('/api', function (req, res, next) {
  // console.log('Body: ', req.body);
  next();
});

app.use('/api', accRouter);
app.use('/api', sesRouter);
app.use('/api', maiRouter);
app.use('/api', memRouter);
app.use('/api', booRouter);
app.use('/api', cusRouter);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

module.exports = app;
