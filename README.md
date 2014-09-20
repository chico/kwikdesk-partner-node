# KwikDesk Partner API Node Client

## Installation

The following will install [the npm package](https://www.npmjs.org/package/kwikdesk-partner-node) and add it as a dependency to your project:

    npm install kwikdesk-partner-node --save

## Usage

```javascript
var Kwikdesk = require('kwikdesk-partner-node');
```

### Tokens

```javascript
Kwikdesk.token("my-app", function (err, token) {
    console.log(token);
});
```

### Messages

```javascript
Kwikdesk.message(token, participantToken, "This is a private message on a secure channel", 1440, true, function (err, response) {
    console.log(response.message);
});
```

### Channels

```javascript
Kwikdesk.channel(token, participantToken, function (err, results) {
    console.dir(results);
});
```

### Search

```javascript
Kwikdesk.search(token, "kwikdesk", function (err, results) {
    console.dir(results);
});
```

### Server time

```javascript
Kwikdesk.time(function (err, result) {
    console.dir(result);
});
```

## Testing

    npm install -g mocha
    npm test

