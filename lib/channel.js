// https://wiki.asterisk.org/wiki/display/AST/Asterisk+16+AGI+Commands

const channelActions = {

  on(action, callback) {
    this.channelData.on(action, callback);
  },
  answer() {
    return this.command('ANSWER');
  },
  close() {
    this.channelData.close();
  },
  status() {
    return this.command(`CHANNEL STATUS`);
  },
  hangup() {
    return this.command('HANGUP');
  },
  sayAlpha(text, escapeDigits) {
    return this.command(`SAY ALPHA "${text} ${escapeDigits}"`);
  },
  sayDate(time, escapeDigits) {
    return this.command(`SAY DATE "${time} ${escapeDigits}"`);
  },
  sayDateTime(time, escapeDigits, format, timeZone) {
    return this.command(`SAY DATETIME "${time} ${escapeDigits} ${format} ${timeZone}"`);
  },
  sayDigits(number, escapeDigits) {
    return this.command(`SAY DIGITS "${number} ${escapeDigits}"`);
  },
  sayNumber(number, escapeDigits, gender) {
    return this.command(`SAY NUMBER "${number} ${escapeDigits} ${gender}"`);
  },
  sayTime(time, escapeDigits, gender) {
    return this.command(`SAY TIME "${time} ${escapeDigits}"`);
  },
  getData(prompt, length, timeout) {
    return this.command(`GET DATA "${prompt}" ${timeout * 1000} ${length}`);
  },
  playFile(prompt, escapeDigits) {
    return this.command(`STREAM FILE "${prompt}" "${escapeDigits}"`);
  },
  setVariable(name, value) {
    return this.command(`SET VARIABLE "${name}" "${value}"`);
  },
  getVariable(name) {
    return this.command(`GET VARIABLE "${name}"`);
  },
  exec(application, optione) {
    return this.command(`EXEC "${application} ${options}"`);
  },
  verbose(message, level = 3) {
    return this.command(`WAIT FOR DIGIT "${message} ${level}"`);
  },
  waitDigit(timeout) {
    return this.command(`WAIT FOR DIGIT "${timeout}"`);
  },

  command(command) {
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


module.exports = createChannel;;;;;