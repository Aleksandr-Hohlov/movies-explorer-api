const router = require('express').Router();
const auth = require('../middlewares/auth');
const { updateUserValidation } = require('../middlewares/validation');

const { updateUserInfo, getUserInfo } = require('../controllers/users');

router.use(auth);

router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUserValidation, updateUserInfo);

module.exports = router;
