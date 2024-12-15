const express = require('express');
const router = express.Router();

router.get('/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working',
    origin: req.get('origin'),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

