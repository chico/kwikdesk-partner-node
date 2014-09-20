/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var KwikdeskError = require("./error");

var noop = function(){};

function Channel() {}

Channel.prototype.validate = function (token, cb) {
    if (token.length === 0) {
        cb(new Error("The token cannot be empty"));
        return;
    }
};

Channel.prototype.execute = function (token, participantToken, cb) {
    cb = cb || noop;

    this.validate(token, cb);

    var options = {
        url: 'https://platform.kwikdesk.com/channel',
        headers: {"X-API-Token": token, "X-Participant-Token": participantToken},
        json: true
    };

    request.get(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj);}
        cb(null, obj.results);
    });
};

module.exports = Channel;
