"use strict";

const should = require('chai').should(),
    gcp = require('../src/trace-parser-csv'),
    fs = require('fs');

describe('Test GC trace parser - lib', function () {

    it('Log file with one scavenge line', function (done) {
        var f = './test/test-1-line-scavenge.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-line-scavenge-ref.csv', 'utf8').should.equal(res));
            done();
        });
    });
    it('Log file with one mark-sweep line', function (done) {
        var f = './test/test-1-mark-sweep.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-mark-sweep-ref.csv', 'utf8').should.equal(res));
            done();
        });
    });
    it('Log file with one scavenge line and one extra line', function (done) {
        var f = './test/test-1-scavenge-extra-lines.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-scavenge-extra-lines-ref.csv', 'utf8').should.equal(res));
            done();
        });
    });
    it('Log file with a small mix of lines', function (done) {
        var f = './test/test-1-mix.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-mix-ref.csv', 'utf8').should.equal(res));
            done();
        });
    });
    it('Log file with a large mix of lines', function (done) {
        var f = './test/test-1-large-mix.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-large-mix-ref.csv', 'utf8').should.equal(res));
            done();
        });
    });
    it('Log file with one scavenge line with a bad PID. Should add this line as extra line', function (done) {
        var f = './test/test-1-scavenge-bad-pid.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-scavenge-bad-pid-ref.csv', 'utf8').should.equal(res));
            done();
        });
    });
    it('Empty Log file', function (done) {
        var f = './test/test-1-empty-file.log';

        gcp(f, function (err, res) {
            (err.message).should.equal('File empty: ./test/test-1-empty-file.log');
            done();
        });
    });
    it('Log file not found', function (done) {
        var f = './test/test-1-no-file-file.log';
        gcp(f, function (err, res) {
            (err.message).should.equal('File not found or read error: ENOENT: no such file or directory, open \'./test/test-1-no-file-file.log\'');
            done();
        });
    });
    it('Scavenge line with missing reason', function (done) {
        var f = './test/test-1-line-scavenge-missing-reason.log';
        gcp(f, function (err, res) {
            (fs.readFileSync('./test/test-1-line-scavenge-missing-reason-ref.csv', 'utf8').should.equal(fs.readFileSync('./test/test-1-line-scavenge-missing-reason.csv', 'utf8')));
            done();
        });
    });
});
