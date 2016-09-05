#!/usr/bin/env node
"use strict";

var argv = require('yargs').
    usage('Usage: $0 -i [string] -o [string]').
    demand(['i', 'o']).
    alias('i', 'infile').
    describe('i', 'Input log file name with path').
    alias('o', 'outfile').
    describe('o', 'Output csv file name with path').
    argv;

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


var traceParseCSV = require('../' + dir + '/trace-parser-csv'),
    infile = argv.i.trim(),
    outfile = argv.o.trim();

traceParseCSV(infile, function (err, csvData) {
    if (err) {
        console.log('PARSER ERROR: %s', err.message);
        process.exit(1);
    }

    fs.writeFile(outfile, csvData, function (err1) {
        if (err1) {
            console.log('WRITE ERROR: %s', err1.message);
            process.exit(1);
        }

        console.log('Parsing successfully completed. File written: %s', outfile);
    });
});

process.on('uncaughtException', (err) => {
    console.log('-------------PARSER EXECEPTION: Caught Uncaught Exception------------');
    console.log('Error message: %s', err.message);
    console.log(err.stack);
});

