
const express = require('express');
const { userRegisterSchema, userLoginSchema } = require('../validation/authSchema.js');
const authController  = require('../controllers/authController.js');
const { expressValidateSchema } = require('../middleware/validators/expressValidateSchema.js')

const router = express.Router();

router.post('/register', expressValidateSchema(userRegisterSchema), authController.register);
router.post('/login', expressValidateSchema(userLoginSchema), authController.login);

module.exports = router;
