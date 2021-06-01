const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	res.status(400).json({ error: "This route doesn't exist" });
});

router.get('/', async (req, res) => {
	res.status(400).json({ error: "It doesn't exist" });
});

module.exports = router;
