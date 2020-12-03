const { throwError, to, error, success } = require('../utils/requestHelpers');
const authService = require('../services/auth.service');
import { user as User } from '../models';
import { term as Term } from '../models';

const accept = async (req, res) => {
    let err, user, term;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    [err, user] = await to(User.findAll({where: { email: authService.verify(token)['user_email'] } }));
    user = user[0];
    if (err) return error(res, err.message, 400);
    if(!user) return error(res, "no user found!", 400);
    const { body } = req;
    if(!body.termsVersion || !body.accepted){
        return success(res, {message: 'No terms version specified or not you haven\'t accepted it.'});
    }
    else {
        [err, term] = await to(Term.findOne({where: {version: body.termsVersion} }));
        if(err) return error(res, err.message, 400);
        [err, user] = await to(user.update({termId: term.id}));
        if(err) return error(res, err.message, 400);
        [err, user] = await to(user.update({termsAcceptedVersion: body.termsVersion}));
        if(err) return error(res, err.message, 400);
        [err, user] = await to(user.update({termsAcceptedDate: new Date()}));
        if(err) return error(res, err.message, 400);
        return success(res, {message: 'Terms version #'+body.termsVersion+' accepted!'});
    }
}
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

exports.accept = accept;
exports.create = create;
