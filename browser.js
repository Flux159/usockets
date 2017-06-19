
const Socket = require('socket.io-client/lib/socket');

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
  return new Promise(function (resolve, reject) {
    return this.emit(event, payload, function () {
      if (arguments[0]) return reject(new Error(arguments[0]));
      return resolve.apply(null, arguments);
    });
  }.bind(this));
};

Socket.prototype.request = function request(method, data, options) {
  if (!options) {
    options = {
      event: 'socket.io-req',
      timeout: 60000,
    };
  } else {
    options.event = options.event || 'socket.io-req';
    options.timeout = options.timeout || 60000;
  }

  if (typeof method !== 'string') throw new Error('Method must be a string');

  let timeout;

  const onDisconnect = function () {
    clearTimeout(timeout);
    reject(new Error('Socket disconnected'));
  };

  return new Promise(function (resolve, reject) {
    this.emit(options.event, { method, data }, function (res) {
      clearTimeout(timeout);
      this.removeListener('disconnect', onDisconnect);
      if (res.error) {
        return reject(new Error(`Error making request:\n ${res.error.toString()}`));
      }
      resolve(res.data);
    }.bind(this));
  }.bind(this));

  timeout = setTimeout(function () {
    this.removeListener('disconnect', onDisconnect);
    reject(new Error(`Socket request timeout: Exceeded ${options.timeout} msec`));
  }.bind(this), options.timeout);

  this.once("disconnect", onDisconnect);
};

Socket.prototype.response = function response(method, callback, options) {
  if (!options) {
    options = {
      event: 'socket.io-req',
    };
  } else {
    options.event = options.event || 'socket.io-req';
  }
  if (typeof method !== 'string') throw new Error('Method must be a string');
  if (typeof callback !== 'function') throw new Error('Callback must be a function');

  this.on(options.event, function (req, ack) {
    if (req.method !== method) return;
    const res = function (data) {
      ack({ data });
    };
    res.error = function (err) {
      ack({ error: JSON.stringify(err, replaceErrors) });
    };
    callback(req.data, res);
  }.bind(this));
};

const socketio = require('socket.io-client');

module.exports = socketio;
