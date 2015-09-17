/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var config = require("./config");
var KwikdeskError = require("./error");

var noop = function(){};

function Search(q) {
    this.q = q;
}

Search.prototype.validate = function (token, cb) {
    if (token.length === 0) {
        cb(new Error("The token cannot be empty"));
        return false;
    }
    return true;
};

Search.prototype.execute = function (token, cb) {
    cb = cb || noop;

    if (!this.validate(token, cb)) {return;}

    var options = {
        url: config.KwikdeskApiURL + 'search?q=' + encodeURIComponent(this.q),
        headers: {"X-API-Token": token},
        json: true
    };

    request.get(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj);}
        cb(null, obj.results);
    });
};

module.exports = Search;
