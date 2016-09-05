"use strict";

var fs = require('fs');

var match = (process.version).match(/^v(\d)\./),
    v,
    dir;

if (match !== null) {
    v = parseInt(match[1]);
}

if (v >= 6) {
    dir = 'src';
} else {
    dir = 'lib';
}

module.export = require('./' + dir + '/trace-parser-csv');
