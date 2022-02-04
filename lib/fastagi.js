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
      const searchParams = new URLSearchParams(agiUrl.query);
      const params = parseParams(searchParams);

      const route = routes[path];
      if (route) {
        route(channel(data, params));
      }

    });

    server.on('listening', callback);
  };

  return { agi, listen };
};

const parseParams = function(searchParams) {
  const entries = searchParams.entries();
  const params = {};
  for (entry of entries) {
    const key = entry[0];
    const val = entry[1];
    if (key in params) {
      params[key].push(...params[key], val);
      continue;
    }
    params[key] = val;
  }

  return paramsl;
};

module.exports = createApplication; 