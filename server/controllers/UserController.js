"use strict"

const User              = require('./../models').User;
const {isAuthorized}    = require('./../helpers/authentication');
const jwt               = require('jsonwebtoken');

class UserController {
    static register(req, res, next) {
        const {email, password} = req.body;
        User.create({
            email, 
            password
        })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            next(err);
        })
    }

    static read(req, res, next) {
        User
            .findAll()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(err => {
                next(err);
            });

    }

    static findById(req, res, next) {
        let idUser = Number(req.params.id);
        User
            .findByPk(idUser)
            .then(user => {
                if (user) {
                    res.status(200).json(user);
                }else{
                    throw {
                        statusCode: 404,
                        message: "No data found"
                    }
                }
            })
            .catch(err => {
                next(err);
            });
    }

    static update(req, res, next) {
        let idUser = Number(req.params.id);
        const {email, password} = req.body;
        User
            .update({
                email,
                password
            }, {
                where: {
                    id: idUser
                },
                returning: true
            })
            .then(result => {
                if (result[0]) {
                    res.status(200).json(result[1][0]);
                }else{
                    throw {
                        statusCode: 404,
                        message: "No data found"
                    }
                }
            })
            .catch(err => {
                next(err);
            })
    }

    static delete(req, res, next) {
        let idUser      = Number(req.params.id);
        let deletedUser = null;
        User
            .findByPk(idUser)
            .then(user => {
                deletedUser = user;
                return User
                    .destroy({
                        where: {
                            id: idUser
                        }
                    })
            })
            .then(() => {
                if (deletedUser) {                
                    res.status(200).json(deletedUser);
                }else{
                    throw {
                        statusCode: 404,
                        message: "No data found"
                    }
                }
            })
            .catch(err => {
                next(err);
            });            
    }

    static login(req, res, next) {
        const {email, password} = req.body;
        User
            .findOne({
                where: {
                    email
                }
            })
            .then(user => {
                if (user && isAuthorized(password, user.password)) {
                    const accessToken = jwt.sign({ 
                        id: user.id,
                        email: user.email
                    }, process.env.jwt_secret_key);

                    res.status(200).json({accessToken});
                }else{
                    throw {
                        statusCode: 400,
                        message: "Invalid email or password"
                    }
                }
            })
            .catch(err => {
                next(err);
            })
    }
}

module.exports = UserController;