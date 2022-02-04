# fastagi.io

## Asterisk fastAGI: An Express-like AGI interface

`fastagi.io` is build on top of the great `asterisk.io` library and provides an Express-like feel to writing AGI's for asterisk.  If you are used to using node Express then you'll find `fastagi.io` really familiar.  All AGI methods are promise-based so no callback hell.

Note:   All the common Asterisk AGI diaplan functions are implemented as methods and there is a generic `exec` method which can any AGI function.

https://wiki.asterisk.org/wiki/display/AST/Asterisk+16+AGI+Commands

Example:

### `server.js`
```
require('dotenv').config();
const fastagi = require("fastagi.io");
const demo1Agi = require('./demo1.js');

const PORT = process.env.PORT || 4573;

// Create the AGI server
const app = fastagi();

// Add as many endpoints as you need 
app.agi("/demo1", demo1Agi);


// Start the server
app.listen(PORT, () => {
  console.log(`FastAGI listening on port ${PORT}`);
});
```

### `demo1Agi.js`
```
const demoAgi = (channel) => {

  console.log("Demo Connection received");

  // These listeners are optional
  channel.on('hangup', function() {
    console.log('channel hangup');
  });

  channel.on('close', function() {
    console.log('channel closed');
  });

  channel.on('error', function(err) {
    console.log('error!', err);
  });

  // params are in the channel object
  console.log(channel.params);

  channel.getVariable("count")
    .then(res => {
      console.log("count =", res.data);
    })
    .then(res => {
      const time = Math.floor(Date.now() / 1000);
      return channel.sayTime(time, "1236");
    })
    .then(res => {
      return channel.verbose("TEST MESSAGE", "3");
    })
    .then(res => {
      return channel.getData("demo-congrats", 4, 6);
    })
    .then(res => {
      console.log(res);
      return channel.sayNumber(res.result, "*12");
    })
    .then(res => {
      console.log(res);
      channel.setVariable("STATUS", 100);
    })
    .then(() => {
      channel.setVariable("CODE", 200);
    })
    .then(() => {
      channel.close();    // return control back to dialplan
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = demoAgi;

module.exports = demoAgi;
```
### `extensions.conf`
```
[demo1] ; Demo
exten  = s,1, NoOp()
  same = n, Answer()
  same = n, Set(count=199)
  same = n, AGI(agi://localhost/demo1?param=123&param=456&param2=789)
  same = n, Verbose(2, STATUS=${STATUS}, CODE=${CODE}})
  same = n, hangup();
```