const router = require('express').Router();
const userController = require('../controllers/user');
const checkAuth = require('../middlewares/checkAuth');

router.post('/login', userController.login);
router.post('/register', userController.register);


module.exports = router;