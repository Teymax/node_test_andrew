const { throwError, to, error, success } = require('../utils/requestHelpers');
const authService = require('../services/auth.service');
// import { user as User } from '../models';

const create = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { body } = req;
  if (!body.username || !body.email) {
    return error(res, 'Please enter an email and username to register', 400);
  } else if (!body.password) {
    return error(res, 'Please enter an password to register', 400);
  } else {
    let err, user;
    // place for auth service request
    [err] = await to(authService.register(body));
    if (err) return error(res, err.message, 400);
    [err, user] = await to(authService.login(body));
    console.log(user);
    return success(res, {message:'Successfully created new user.', user: user}, 201);
  }
};

const login = async (req, res) => {
  const { body } = req;
  let err, user;
  [err, user] = await to(authService.login(body));
  if (err) return  error(res, err.message, 400);
  return success(res, user);
};


const logout = async (req, res) => {
  req.logout();
  return success(res, {message: 'Successfull logout.'}, 200);
};

exports.create = create;
exports.login = login;
exports.logout = logout;