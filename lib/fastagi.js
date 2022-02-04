const url = require('url');
const aio = require('asterisk.io');
const querystring = require('querystring');
const channel = require('./channel');

const createApplication = function() {
  const routes = {};

  const agi = function(path, callback) {
    routes[path] = callback;
  };

  const listen = function(port, callback) {
    const server = aio.agi(port);

    // Read path from channel data and run matching callback
    server.on('connection', (data) => {

      // pathname has root path without search params
      const agiUrl = url.parse(data.agi_request);
      const path = agiUrl.pathname;

      // Get url params
      const params = querystring.parse(agiUrl.query);

      const route = routes[path];
      if (route) {
        route(channel(data, params));
      }

    });

    server.on('listening', callback);
  };

  return { agi, listen };
};

module.exports = createApplication; 