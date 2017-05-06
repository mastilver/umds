const path = require('path');

const rimraf = require('rimraf');

const umds = require('../umds');
const buildModule = require('./build-module');

rimraf.sync(path.join(__dirname, '../tmp'));

Object.keys(umds).forEach(name => {
    buildModule(name, umds[name]);
});
