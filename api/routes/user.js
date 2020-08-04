const router = require('express').Router();
const userController = require('../controllers/user');
const checkAuth = require('../middlewares/checkAuth');

router.post('/login', userController.login);
router.post('/register', userController.register);
//Only the authenticaed user can get his profile.
router.get('/:userId', checkAuth, userController.get_user);
//Only the authenticated user can modify his profile.
router.patch('/:userId', checkAuth, userController.update_user)

module.exports = router;