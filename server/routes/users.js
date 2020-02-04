'use strict';

const UserController = require('./../controllers/UserController');

const express   = require('express')
const router    = express.Router()


router.post('/', UserController.create);
router.get('/', UserController.read);
router.get('/:id', UserController.findById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router