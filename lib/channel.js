/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var request = require("request");
var config = require("./config");
var KwikdeskError = require("./error");

var noop = function(){};

var authHeaderValue = "Bearer " + config.KwikdeskApiKey;

function Channel() {}

Channel.prototype.validateToken = function (token, cb) {
    if (token.length === 0) {
        cb(new Error("The token cannot be empty"));
        return false;
    }
    return true;
};

Channel.prototype.validateParticipantToken = function (participantToken, cb) {
    if (participantToken.length === 0) {
        cb(new Error("The participant token cannot be empty"));
        return false;
    }
    return true;
};

Channel.prototype.execute = function (token, participantToken, since, cb) {
    cb = cb || noop;

    if (!this.validateToken(token, cb)) {return;}
    if (!this.validateParticipantToken(participantToken, cb)) {return;}

    var url = config.KwikdeskApiURL + '/channel';
    if (since) {
        url += '?since=' + since;
    }

    var options = {
        url: url,
        headers: {"Authorization": authHeaderValue, "X-API-Token": token, "X-Participant-Token": participantToken},
        json: true
    };

    request.get(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj); return;}
        cb(null, obj.results);
    });
};

Channel.prototype.join = function (token, cb) {
    cb = cb || noop;

    if (!this.validateToken(token, cb)) {return;}

    var url = config.KwikdeskApiURL + '/channel/join';

    var options = {
        url: url,
        headers: {"Authorization": authHeaderValue, "X-API-Token": token},
        json: true
    };

    request.post(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj); return;}
        cb(null, obj.token, obj.participant_token);
    });
};

Channel.prototype.destroy = function (token, participantToken, cb) {
    cb = cb || noop;

    if (!this.validateToken(token, cb)) {return;}
    if (!this.validateParticipantToken(participantToken, cb)) {return;}

    var url = config.KwikdeskApiURL + '/channel/' + token;

    var options = {
        url: url,
        headers: {"Authorization": authHeaderValue, "X-API-Token": token, "X-Participant-Token": participantToken},
        json: true
    };

    request.del(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj); return;}
        cb(null, obj);
    });
};

Channel.prototype.abandon = function (token, participantToken, cb) {
    cb = cb || noop;

    if (!this.validateToken(token, cb)) {return;}
    if (!this.validateParticipantToken(participantToken, cb)) {return;}

    var url = config.KwikdeskApiURL + '/channel/abandon';

    var options = {
        url: url,
        headers: {"Authorization": authHeaderValue, "X-API-Token": token, "X-Participant-Token": participantToken},
        json: true
    };

    request.post(options, function(err, response, obj) {
        if(err) {return cb(err)};
        if(obj.error !== 0) {cb(new KwikdeskError(obj.message, obj.error), obj); return;}
        cb(null, obj);
    });
};

module.exports = Channel;
