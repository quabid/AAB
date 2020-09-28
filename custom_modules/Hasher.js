const bcrypt = require('bcryptjs');
const {
  methodUtils: { isMethod },
} = require('./utils');

module.exports = {
  createHash: (arg1, cb = null) => {
    if (isMethod(cb)) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(arg1, salt, (err, hash) => {
          if (err) {
            return cb({ status: 'failed', error: err.message });
          } else {
            cb({
              status: 'success',
              original: arg1,
              payload: hash,
            });
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(arg1, salt, (err, hash) => {
            if (err) {
              reject({ status: 'failed', error: err.message });
            } else {
              resolve({
                status: 'success',
                original: arg1,
                payload: hash,
              });
            }
          });
        });
      });
    }
  },
  compare: (arg1, hash, cb) => {
    if (isMethod(cb)) {
      // Match Arguments
      bcrypt.compare(arg1, hash, (err, isMatch) => {
        if (err) {
          cb({
            status: 'failure',
            error: err.message,
            stack: err.stack,
          });
        }

        if (isMatch) {
          return cb({ status: 'success' });
        } else {
          return cb({ status: 'failure' });
        }
      });
    } else {
      return new Promise((resolve, reject) => {
        // Match Arguments
        bcrypt.compare(arg1, hash, (err, isMatch) => {
          if (err) {
            reject({ status: 'failed', error: err.message, stack: err.stack });
          }

          if (isMatch) {
            resolve({ status: 'success' });
          } else {
            reject({ status: 'failure' });
          }
        });
      });
    }
  },
};