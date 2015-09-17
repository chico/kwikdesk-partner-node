/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

// npm install -g mocha
// mocha main.test.js

var Kwikdesk = require('../lib/main.js');

// Remote
// var token = 'edc2eb6d98e448dd857d135250129a72';
// var participantToken = 'cd76547564b44ef98d4586245796d242';

// Local
var token = '6e31c3e3101d428a9669f5cee0c5e8e9';
var participantToken = '16cf676a6a7542118e88dd435704f2b1';
// var token = '33f01eab745b431896e05f987e14e2d3';
// var participantToken = '5cc08d0f250d4b829c101c1df21c12be';

var total = 0;
var avg = 0;
var min = 0;
var max = 0;

var skipPostMessage = true;
function postMessage(cb) {
	if (skipPostMessage) {
		return cb();
	}
	Kwikdesk.message(token, participantToken, "This is a private message on a secure channel #random" + Math.floor(Math.random()*100000001), 1440, true, function (err, response) {
	  if (err) {return cb(err);}
	  console.log(response.message);
	  cb();
	});
}

function messages(i, done) {
	if (i > 10) {
		done();
		return;
	}

	postMessage(function(err) {
	  if (err) {return done(err);}

	  var start = new Date();
		Kwikdesk.channel(token, participantToken, null, function (err, results) {
			if (err) {return done(err);}
			var timeTaken = new Date() - start;

			min = (min === 0) ? timeTaken : Math.min(min, timeTaken);
			max = Math.max(max, timeTaken);
			total += timeTaken;
			avg = total / (i+1);

			console.log("Got " + results.length + " messages in " + timeTaken + " millis");
			console.log("Max: " + max + ", Min: " + min + ", Average: " + avg);
			// console.dir(results);
			messages(++i, done);
		});

	});

}

describe('Kwikdesk', function() {

	it('api', function( done ){
		this.timeout(360000);
		messages(0, done);
  });

});