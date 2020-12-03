const { throwError, to, error, success } = require('../utils/requestHelpers');
const authService = require('../services/auth.service');
import { user as User } from '../models';

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

const update = async (req, res) => {
  let err, user;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  [err, user] = await to(User.findOne({ email: authService.verify(token) }));
  if (err) return error(res, err.message, 400);
  if(!user) return error(res, "no user found!", 400);
  if (req.body.username){
    [err, user] = await to(user.update({username: req.body.username}));
    if(err) return error(res, err.message, 400);
  }
  if (req.body.firstName){
    [err, user] = await to(user.update({firstName: req.body.firstName}));
    if(err) return error(res, err.message, 400);
  }
  if (req.body.lastName){
    [err, user] = await to(user.update({lastName: req.body.lastName}));
    if(err) return error(res, err.message, 400);
  }
  if (req.body.country){
    [err, user] = await to(user.update({country: req.body.country}));
    if(err) return error(res, err.message, 400);
  }
  if (req.body.email){
    [err, user] = await to(user.update({email: req.body.email}));
    if(err) return error(res, err.message, 400);
  }
  if (req.body.new_password && !req.body.old_password) return error(res, "Enter old password to change it", 400);
  if (req.body.new_password && req.body.old_password) {
    [err, user] = await to(user.comparePassword(req.body.old_password));
    if (err) return error(res, err.message, 400);
    [err, user] = await to(user.update({password: req.body.new_password}));
    if (err) return error(res, err.message, 400);
  }
  return success(res, {user: user});
};

const logout = async (req, res) => {
  req.logout();
  return success(res, {message: 'Successfull logout.'}, 200);
};

exports.create = create;
exports.login = login;
exports.logout = logout;
exports.update = update;