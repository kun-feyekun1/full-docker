
'use strict';

const express = require('express');
const router = express.Router();

const { getUsers,  getUserById, getProfile, updateUser,  deleteUserById, deleteAllUsers } = require('../controllers/userController');
const { userUpdateSchema } = require('../validation/userUpdateSchema');
const { joiValidateSchema } = require('../middleware/validators/joiValidateSchema')
const { authMiddleware } = require('../middleware/authMiddleware');


// Define routes
router.get('/',authMiddleware, getUsers);  
router.get('/profile', authMiddleware, getProfile)
router.get('/:id', authMiddleware, getUserById);  
router.put('/:id', authMiddleware, joiValidateSchema(userUpdateSchema), updateUser);
router.delete('/deleteAllUsers', authMiddleware, deleteAllUsers); 
router.delete('/:id', authMiddleware, deleteUserById); 

module.exports = router;
