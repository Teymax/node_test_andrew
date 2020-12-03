import logger from '../utils/logger';

export function asyncWrap (callback) {
  return function (req, res, next) {
    try {
      callback(req, res, next);
    } catch (e) {
      logger.error(e.message);
    }
  }
}
