
const router = require('express').Router();
const userController = require('../../controllers/userController/user.controller');
const authMiddleware=require('../../middlewares/authMiddleware')


router.post('/register', userController.userRegister);
router.post('/login',userController.userLogin);
router.get('/logout',userController.userLogout);
router.get('/current-user',authMiddleware,userController.currentUser);

module.exports = router;