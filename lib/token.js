/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var config = require("./config");
var KwikdeskError = require("./error");

var noop = function(){};

var authHeaderValue = "Bearer " + config.KwikdeskApiKey;

function Token() {
}

Token.prototype.validate = function (appName, cb) {
    if (appName.length === 0) {
        cb(new Error("The appName cannot be empty"));
        return false;
    }
    return true;
};

Token.prototype.execute = function (appName, cb) {
    cb = cb || noop;

    if (!this.validate(appName, cb)) {return;}

    var options = {
        url: config.KwikdeskApiURL + '/token',
        headers: {"Authorization": authHeaderValue, "X-AppName": appName},
        json: true
    };

    request.post(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj); return;}
        cb(null, obj.token, obj.participant_token);
    });

};

module.exports = Token;
