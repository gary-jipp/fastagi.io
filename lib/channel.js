// https://wiki.asterisk.org/wiki/display/AST/AGI+Commands

const channelActions = {

  on(action, callback) {
    this.channelData.on(action, callback);
  },

  answer() {
    return this.exec('ANSWER');
  },

  hangup() {
    return this.exec('HANGUP');
  },

  close() {
    this.channelData.close();
  },

  status() {
    return this.exec(`CHANNEL STATUS`);
  },

  read(prompt, length, timeout) {
    return this.exec(`GET DATA "${prompt}" ${timeout * 1000} ${length}`);
  },

  playBack(prompt, escapeDigits) {
    return this.exec(`STREAM FILE "${prompt}" "${escapeDigits}"`);
  },

  set(name, value) {
    return this.exec(`SET VARIABLE "${name}" "${value}"`);
  },

  get(name) {
    return this.exec(`GET VARIABLE "${name}"`);
  },

  exec(command) {
    const promise = new Promise((resolve, reject) => {
      this.channelData.command(command, (code, result, data) => {
        if (code === 200) {
          return resolve({ code, result, data });
        }
        reject(code);
      });
    });
    return promise;
  }

};

const createChannel = function(channelData, params) {

  // Create new channel using channelActions as prototype (same functions)
  const channel = Object.create(channelActions);
  channel.channelData = channelData;
  channel.params = params;

  return channel;
};


module.exports = createChannel;