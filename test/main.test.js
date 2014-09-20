/* Copyright (c) 2014 Chico Charlesworth, MIT License */
'use strict';

// npm install -g mocha
// mocha main.test.js

var Kwikdesk = require('../lib/main.js');

describe('Kwikdesk', function() {

	it('api', function( done ){
		this.timeout(10000);

		console.log("\nGet token");
		Kwikdesk.token("my-app", function (err, token, participantToken) {
			if (err) {return done(err);}

			console.log("Posting message with token " + token + " and participant token " + participantToken);
			Kwikdesk.message(token, participantToken, "This is a private message on a secure channel #random" + Math.floor(Math.random()*100000001), 1440, true, function (err, response) {
			  if (err) {return done(err);}
			  console.log(response.message);

				console.log("Channel messages:");
				Kwikdesk.channel(token, participantToken, function (err, results) {
					if (err) {return done(err);}
					console.dir(results);
				  done();
				});
			});

    });
  });

});