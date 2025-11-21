const express = require('express');
const router = express.Router();

const { createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/createOrd', authMiddleware, createOrder);
router.get('/getOrds', authMiddleware, getOrders);
router.get('/getOrdById/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/delOrd/:id', authMiddleware, deleteOrder);

module.exports = router;
