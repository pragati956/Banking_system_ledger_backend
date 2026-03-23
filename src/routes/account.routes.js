const express = require('express');
const router = express.Router();

const { createAccountController } = require('../controllers/account.controller');
const authMiddleware = require('../middleware/auth.middleware'); // ✅ add this

router.post('/', authMiddleware, createAccountController); // ✅ middleware use
module.exports = router;