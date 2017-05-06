const path = require('path');

const rimraf = require('rimraf');
const pMap = require('p-map');

const umds = require('../umds');
const buildModule = require('./build-module');

rimraf.sync(path.join(__dirname, '../tmp'));

pMap(Object.keys(umds), async name => {
    await buildModule(name, umds[name]);
}, {concurrency: 10})
.catch(err => {
    setImmediate(() => {
        throw err;
    });
});
