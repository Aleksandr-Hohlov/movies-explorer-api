const router = require('express').Router();
const { updateUserValidation } = require('../middlewares/validation');
const { updateUserInfo, getUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.patch('/users/me', updateUserValidation, updateUserInfo);

module.exports = router;
