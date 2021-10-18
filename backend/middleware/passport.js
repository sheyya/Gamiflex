import Admin from '../models/admin_model.js';
import Employee from '../models/employee_model.js';
import Manager from '../models/manager_model.js';
import { SECRET } from '../config/index.js'
import pspjwt from 'passport-jwt'
const { Strategy, ExtractJwt } = pspjwt
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
    failWithError: true
};


export default (passport) => {
    try {
        passport.use(
            new Strategy(opts, async (payload, done) => {

                // Validate user using database corresponding to the user role

                if (payload.role === "admin") {
                    await Admin.findById(payload.user_id).then(user => {
                        if (user) {
                            return done(null, user);
                        }
                        return done(null, false);
                    }).catch(err => {
                        return done(null, false);
                    });
                }
                if (payload.role === "employee") {
                    await Employee.findById(payload.user_id)
                        .then(user => {
                            if (user) {
                                return done(null, user);
                            }
                            return done(null, false);
                        })
                        .catch(err => {
                            return done(null, false);
                        });
                }

                if (payload.role === "manager") {
                    await Manager.findById(payload.user_id)
                        .then(user => {
                            if (user) {
                                return done(null, user);
                            }
                            return done(null, false);
                        })
                        .catch(err => {
                            return done(null, false);
                        });
                }

            })
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};