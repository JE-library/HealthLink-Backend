const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ message: 'Server is live 🔥' });
});

module.exports = router;