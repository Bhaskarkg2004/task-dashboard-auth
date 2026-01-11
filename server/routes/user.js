const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middleware/auth');

// GET user profile
router.get('/profile', verify, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user profile (name only for simplicity, can extend)
router.put('/profile', verify, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: { name: req.body.name } },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
