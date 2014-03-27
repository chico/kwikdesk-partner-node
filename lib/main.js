/* Copyright (c) 2014 Chico Charlesworth, MIT License */

var Token = require('./token');
var Message = require('./message');
var Channel = require('./channel');
var Search = require('./search');
var Time = require('./time');

function Kwikdesk() {
}

Kwikdesk.token = function (appName, cb) {
    var token = new Token();
    token.execute(appName, cb);
};

Kwikdesk.message = function (token, content, ttl, secure, cb) {
    var message = new Message({'content': content, 'delete': ttl, 'private': secure});
    message.save(token, cb);
};

Kwikdesk.channel = function (token, cb) {
    var channel = new Channel();
    channel.execute(token, cb);
};

Kwikdesk.search = function (token, q, cb) {
    var search = new Search(q);
    search.execute(token, q, cb);
};

Kwikdesk.time = function (cb) {
    var time = new Time();
    time.execute(cb);
};

module.exports = Kwikdesk;
