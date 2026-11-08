const fs = require("fs");
const path = require("path");

// 1. Patch detect-port-alt for Node 18/20/22 dual-stack compatibility
const detectPortTarget = path.join(
  __dirname,
  "..",
  "node_modules",
  "detect-port-alt",
  "lib",
  "detect-port.js"
);

if (fs.existsSync(detectPortTarget)) {
  const patchedDetectPort = `'use strict';

const debug = require('debug')('detect-port');
const net = require('net');

module.exports = (port, host, callback) => {
  if (typeof port === 'function') {
    callback = port;
    port = null;
  } else if (typeof host === 'function') {
    callback = host;
    host = null;
  }
  port = parseInt(port, 10) || 0;
  let maxPort = port + 10;
  if (maxPort > 65535) {
    maxPort = 65535;
  }
  debug('detect free port between [%s, %s)', port, maxPort);
  if (typeof callback === 'function') {
    return tryCheck(port, maxPort, callback);
  }
  return new Promise((resolve, reject) => {
    tryCheck(port, maxPort, (error, realPort) => {
      if (error) {
        reject(error);
      } else {
        resolve(realPort);
      }
    });
  });
};

function checkHost(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (inUse) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(inUse);
    };
    socket.setTimeout(150);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

function tryCheck(port, maxPort, callback) {
  Promise.all([checkHost(port, '127.0.0.1'), checkHost(port, '::1')]).then(
    ([v4InUse, v6InUse]) => {
      if (!v4InUse && !v6InUse) {
        return callback(null, port);
      }
      const nextPort = port + 1;
      if (nextPort >= maxPort) {
        return callback(null, port);
      }
      tryCheck(nextPort, maxPort, callback);
    }
  );
}
`;
  fs.writeFileSync(detectPortTarget, patchedDetectPort, "utf8");
}

// 2. Patch memfs/lib/volume.js for Node 18/20/22 Readable.closed getter compatibility
const memfsTarget = path.join(
  __dirname,
  "..",
  "node_modules",
  "memfs",
  "lib",
  "volume.js"
);

if (fs.existsSync(memfsTarget)) {
  const content = fs.readFileSync(memfsTarget, "utf8");
  if (content.includes("this.closed = true;")) {
    const updated = content.replace(
      "if (this.closed || typeof this.fd !== 'number') {",
      "if (this.closed || this._closed || typeof this.fd !== 'number') {"
    ).replace(
      "this.closed = true;",
      "this._closed = true;\n    try { Object.defineProperty(this, 'closed', { value: true, writable: true, configurable: true }); } catch (e) {}"
    );
    fs.writeFileSync(memfsTarget, updated, "utf8");
  }
}
