/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var KwikdeskError = require("./error");

var noop = function(){};

function Time(q) {
    this.q = q;
}

Time.prototype.execute = function (cb) {
    cb = cb || noop;

    var options = {
        url: 'https://platform.kwikdesk.com/server-time',
        json: true
    };

    request.get(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj);}
        cb(null, obj);
    });

};

module.exports = Time;
