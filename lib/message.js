/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var config = require("./config");
var KwikdeskError = require("./error");

var noop = function(){};

var authHeaderValue = "Bearer " + config.KwikdeskApiKey;

// One day (24 hours) in minutes
var OneDay = 1440;

function Message(params) {

    this.content = "";

    this.delete = OneDay;

    this.private = true;

    params = params || {};

    if (typeof params === "object") {
        this.content = params.content || "";
        this.delete = params.hasOwnProperty("delete") ? params.delete : null;
        this.private = params.hasOwnProperty("private") ? params.private : null;
    } else {
        if (arguments.length > 0) {
            this.content = arguments[0];
        }
        if (arguments.length > 1) {
            this.delete = arguments[1];
        }
        if (arguments.length > 2) {
            this.private = arguments[2];
        }
    }
}

Message.prototype.validate = function (token, participantToken, cb) {
    if (token.length === 0) {
        cb(new Error("The token cannot be empty"));
        return false;
    }
    if (participantToken.length === 0) {
        cb(new Error("The participant token cannot be empty"));
        return false;
    }
    if (this.content.length === 0) {
        cb(new Error("The message content cannot be empty"));
        return false;
    }
    if ((this.delete === null) || this.delete < 1) {
        cb(new Error("The message delete parameter must be greater than zero"));
        return false;
    }
    return true;
};

function serialize(message) {
    return JSON.stringify(message);
}

Message.prototype.save = function (token, participantToken, cb) {
    cb = cb || noop;

    if (!this.validate(token, participantToken, cb)) {return;}

    var options = {
        url: config.KwikdeskApiURL + '/messages',
        headers: {"Authorization": authHeaderValue, "X-API-Token": token, "X-Participant-Token": participantToken},
        body: serialize(this),
        json: true
    };

    request.post(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj);}
        cb(null, obj);
    });

};

module.exports = Message;
