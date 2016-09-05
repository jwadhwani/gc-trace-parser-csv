"use strict";

const should = require('chai').should(),
    child = require('child_process'),
    fs = require('fs'),
    path = require('path');

describe('Test GC trace parser - cli', function () {
    var exec;
    before(function(){
        exec = path.join(__dirname, "..", "bin", "gc-trace-parser-csv.js");
    });

    it('Log file with one scavenge line', function (done) {
        var infile = path.join(__dirname, "..", "test", "test-1-line-scavenge.log"),
            outfile = path.join(__dirname, "..", "test", "test-1-line-scavenge-cli.csv"),
            csvData = '';

        var proc = child.spawn(exec, ['-i' + infile,  '-o' + outfile]);

        proc.stdout.on('data', (data) => {
            csvData += data.toString();
        });

        proc.on('close', (code) => {
            //console.log(csvData);
            (csvData).should.equal('Parsing successfully completed. File written: ' + outfile + '\n');
            (fs.readFileSync('./test/test-1-line-scavenge-ref.csv', 'utf8').should.equal(fs.readFileSync(outfile, 'utf8')));
            done();
        });
    });

    it('Log file not found', function (done) {
        var infile = path.join(__dirname, "..", "test", "test-1-no-file-file.log"),
            outfile = path.join(__dirname, "..", "test", "test-1-no-file-file-cli.csv"),
            csvData = '';

        var proc = child.spawn(exec, ['-i' + infile,  '-o' + outfile]);

        proc.stdout.on('data', (data) => {
            csvData += data.toString();
        });

        proc.on('close', (code) => {
            (csvData).should.equal("PARSER ERROR: File not found or read error: ENOENT: no such file or directory, open " + "'" + infile + "'" + '\n');
            done();
        });
    });

    it('Log file with a large mix of lines', function (done) {
        var infile = path.join(__dirname, "..", "test", "test-1-large-mix.log"),
            outfile = path.join(__dirname, "..", "test", "test-1-large-mix-cli.csv"),
            csvData = '';

        var proc = child.spawn(exec, ['-i' + infile,  '-o' + outfile]);

        proc.stdout.on('data', (data) => {
            csvData += data.toString();
        });

        proc.on('close', (code) => {
            (fs.readFileSync('./test/test-1-large-mix-ref.csv', 'utf8')).should.equal(fs.readFileSync(outfile, 'utf8'));
            done();
        });
    });
});


