
const Socket = require('socket.io/lib/socket');

function replaceErrors(key, value) {
  if (value instanceof Error) {
    var error = {};
    Object.getOwnPropertyNames(value).forEach(function (key) {
      error[key] = value[key];
    });
    return error;
  }
  return value;
}

// Technically modifying exported class prototypes like this is a bad idea...
Socket.prototype.emitAsync = function emitAsync(event, payload) {
  return new Promise((resolve, reject) => {
    return this.emit(event, payload, (...args) => {
      if (args[0]) return reject(new Error(args[0]));
      return resolve.apply(null, args);
    });
  });
};

Socket.prototype.request = function request(method, data, options = { event: 'socket.io-req', timeout: 60000 }) {
  if (typeof method !== 'string') throw new Error('Method must be a string');

  let timeout;

  const onDisconnect = () => {
    clearTimeout(timeout);
    reject(new Error('Socket disconnected'));
  };

  return new Promise((resolve, reject) => {
    this.emit(options.event, { method, data }, (res) => {
      clearTimeout(timeout);
      this.removeListener('disconnect', onDisconnect);
      if (res.error) {
        return reject(new Error(`Error making request:\n ${res.error.toString()}`));
      }
      resolve(res.data);
    });
  });

  timeout = setTimeout(() => {
    this.removeListener('disconnect', onDisconnect);
    reject(new Error(`Socket request timeout: Exceeded ${options.timeout} msec`));
  }, options.timeout);

  this.once("disconnect", onDisconnect);
};

Socket.prototype.response = function(method, callback, options = { event: 'socket.io-req' }) {
  if (typeof method !== 'string') throw new Error('Method must be a string');
  if (typeof callback !== 'function') throw new Error('Callback must be a function');

  this.on(options.event, (req, ack) => {
    if (req.method !== method) return;
    const res = (data) => {
      ack({ data });
    };
    res.error = (err) => {
      ack({ error: JSON.stringify(err, replaceErrors)});
    };
    callback(req.data, res);
  });
};

const socketio = require('socket.io');

module.exports = socketio;
