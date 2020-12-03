const { to, error, success } = require('../utils/requestHelpers');
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


const latest = async (req, res) => {
    let err, user, term;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    [err, user] = await to(User.findAll({where: { email: authService.verify(token)['user_email'] } }));
    user = user[0];
    if (err) return error(res, err.message, 400);
    if(!user) return error(res, "no user found!", 400);
    [err, term] = await to(Term.findOne({where: {version: await Term.max('version')} }));
    if(err) return error(res, err.message, 400);
    if(user.termsAcceptedVersion === term.version) return success(res);
        else if (user.termsAcceptedVersion < term.version) return success(res, {content: term.content});

}

exports.accept = accept;
exports.latest = latest;
