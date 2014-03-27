/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var KwikdeskError = require("./error");

var noop = function(){};

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

Message.prototype.validate = function (token, cb) {
    if (token.length === 0) {
        cb(new Error("The token cannot be empty"));
        return;
    }
    if (this.content.length === 0) {
        cb(new Error("The message content cannot be empty"));
        return;
    }
    if ((this.delete === null) || this.delete < 1) {
        cb(new Error("The message delete parameter must be greater than zero"));
        return;
    }
};

function serialize(message) {
    return JSON.stringify(message);
}

Message.prototype.save = function (token, cb) {
    cb = cb || noop;

    this.validate(token, cb);

    var options = {
        url: 'https://platform.kwikdesk.com/messages',
        headers: {"X-API-Token": token},
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
