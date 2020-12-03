import pe from 'parse-error';
import logger from './logger';
const { to } = require('await-to-js');

// helper for error handling
module.exports.to = async promise => {
  let err, res;
  [err, res] = await to(promise);
  if(err) return [pe(err)];
  return [null, res];
};

// configure format for error response
module.exports.error = function (res, err, code) {
  if(typeof err == 'object' && typeof err.message != 'undefined'){
    err = err.message;
  }
  if(typeof code !== 'undefined') res.statusCode = code;
  return res.json({success:false, error: err});
};

// configure format for success response
module.exports.success = function (res, data, code) {
  let send_data = {success:true};
  if(typeof data == 'object'){
    send_data = Object.assign(data, send_data);
  }
  if(typeof code !== 'undefined') res.statusCode = code;
  return res.json(send_data);
};

// throw error helper
module.exports.throwError = (err_message, log) => {
  if (log) logger.error(err_message);
  throw new Error(err_message);
};
