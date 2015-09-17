/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var config = require("./config");
var KwikdeskError = require("./error");

var noop = function(){};

var authHeaderValue = "Bearer " + config.KwikdeskApiKey;

function Time(q) {
    this.q = q;
}

Time.prototype.execute = function (cb) {
    cb = cb || noop;

    var options = {
        url: config.KwikdeskApiURL + '/server-time',
        headers: {"Authorization": authHeaderValue},
        json: true
    };

    request.get(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj);}
        cb(null, obj);
    });

};

module.exports = Time;
