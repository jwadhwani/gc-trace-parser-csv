"use strict";

/**
 * Parse and convert a captured -trace_gc file to csv
 * See more at https://phptouch.com/2016/06/07/does-my-nodejs-application-leak-memory-4/
 * Copyright(c) 2016 Jayesh Wadhwani
 * MIT Licensed
 */

var fs = require('fs'),
    _u = require('underscore'),
    stringify = require('csv-stringify');

/**
 *
 * @param {string} fName - nme of log file to read
 * @param callback - err, res where res - csv data
 * @returns {*}
 */
module.exports = function (fName, callback) {
    var
    //array of objects - { pid, isolateId, timeSinceInit, gcEventType, beforeTotalSizeObject,
    // afterTotalSizeObject, beforeTotalAllocatedSize,  afterTotalAllocatedSize,
    // gcTime, externalTime, markingInfo, gcReason, gcCollectorReason}
    data = [],
        extras = [],
        //lines that did not match added to the end of the file
    //regexes for various parts of the trace
    mainRe = /^(\[[\d:xa-f]+?\])\s+(\d.+?ms)\s+((\(|\[).+)\.$/,
        isolateRe = /^\[([\d]+):(0x[0-9a-f]+)\]$/,
        statsRe = /^(\d+)\sms:\s(Scavenge|Mark-sweep)\s([\d\.]+)\s\(([\d\.]+)\)\s->\s([\d\.]+)\s\(([\d\.]+)\)\sMB,\s([\d\.]+)\s\/\s([\d\.]+)\sms$/,
        infoRe = /^(\((.+)\)\s+)?(\[(.+?)\])(\s+\[(.+?)\])?$/,
        csvData = [],
        //array for use with stringify
    header = ['PID', 'Isolate Id', 'Time from initialization', 'GC Event', 'Total size of objects before GC', 'Total size of objects after GC', 'Total memory allocated before GC', 'Total memory allocated after GC', 'Time in GC', 'Time in external callbacks', 'Marking info', 'Reason for GC trigger', 'Reason for GC'];

    fs.readFile(fName, 'utf-8', function (err, fileData) {
        if (err) {
            return callback(new Error('File not found or read error: ' + err.message));
        }

        fileData = fileData.trim();

        if (!fileData) {
            return callback(new Error('File empty: ' + fName));
        }

        //split file into array of lines
        var lines = fileData.split('\n');

        lines.forEach(function (line, index) {

            line = line.trim(); //cleanup

            var mainSection = mainRe.exec(line);

            //trace - [38469:0x102004600]  1145185 ms: Mark-sweep 146.2 (187.0) -> 69.9 (121.0) MB, 0.6 / 0 ms (+ 40.0 ms in 31 steps since start of marking, biggest step 20.3 ms) [Incremental marking task: finalize incremental marking] [GC in old space requested].'

            //main section - isolate, gcStats and gcInfo
            //isolate - [38469:0x102004600]
            //gcStats - '1145185 ms: Mark-sweep 146.2 (187.0) -> 69.9 (121.0) MB, 0.6 / 0 ms'
            //gcInfo -  '(+ 40.0 ms in 31 steps since start of marking, biggest step 20.3 ms) [Incremental marking task: finalize incremental marking] [GC in old space requested]',

            if (mainSection && mainSection[1] && mainSection[2] && mainSection[3]) {

                var isolate = isolateRe.exec(mainSection[1]),
                    gcStats = statsRe.exec(mainSection[2]),
                    gcInfo = infoRe.exec(mainSection[3]);

                if (isolate && gcStats && gcInfo) {
                    var o = {
                        pid: isolate[1],
                        isolateId: isolate[2],
                        timeSinceInit: gcStats[1],
                        gcEventType: gcStats[2],
                        beforeTotalSizeObject: gcStats[3],
                        afterTotalSizeObject: gcStats[5],
                        beforeTotalAllocatedSize: gcStats[4],
                        afterTotalAllocatedSize: gcStats[6],
                        gcTime: gcStats[7],
                        externalTime: gcStats[8],
                        markingInfo: '',
                        gcReason: '',
                        gcCollectorReason: ''
                    };

                    //reason for event is mandatory
                    o.gcReason = gcInfo[4];

                    //marking info is optional
                    if (gcInfo[2]) {
                        o.markingInfo = gcInfo[2];
                    }

                    //collector reason is optional
                    if (gcInfo[6] != undefined) {
                        o.gcCollectorReason = gcInfo[6];
                    }

                    data.push(o);
                } else {
                    extras.push([index, line]);
                }
            } else {

                extras.push([index, line]);
            }
        });

        //create CSV data
        //add in the header
        csvData.push(header);

        //and the rows
        data.forEach(function (element) {
            csvData.push(_u.values(element));
        });

        //make space and header for non matched lines
        if (extras.length > 0) {
            extras.unshift(['Index', 'Non matched lines']);
            extras.unshift(['', '']);
            extras.unshift(['', '']);
            extras.unshift(['', '']);
        }

        //any lines that did not match
        extras.forEach(function (element) {
            csvData.push(element);
        });

        //create CSV file
        stringify(csvData, function (err1, output) {
            return callback(err1, output);
        });
        return null;
    });
};
//# sourceMappingURL=trace-parser-csv.js.map