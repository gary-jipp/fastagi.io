const url = require('url');
const aio = require('asterisk.io');
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
      const entries = new URLSearchParams(agiUrl.query).entries();
      const params = {};
      for (entry of entries) {
        const key = entry[0];
        const val = entry[1];
        if (key in params) {
          params[key].push(val);
        } else {
          params[key] = [val];
        }
      }

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