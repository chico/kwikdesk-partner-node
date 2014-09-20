/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var KwikdeskError = require("./error");

var noop = function(){};

function Token() {
}

Token.prototype.validate = function (appName, cb) {
    if (appName.length === 0) {
        cb(new Error("The appName cannot be empty"));
        return;
    }
};

Token.prototype.execute = function (appName, cb) {
    cb = cb || noop;

    this.validate(appName, cb);

    var options = {
        url: 'https://platform.kwikdesk.com/token',
        headers: {"X-AppName": appName},
        json: true
    };

    request.post(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj);}
        cb(null, obj.token, obj.participant_token);
    });

};

module.exports = Token;
