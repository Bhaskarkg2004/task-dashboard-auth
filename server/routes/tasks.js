const router = require('express').Router();
const Task = require('../models/Task');
const verify = require('../middleware/auth');
const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().min(1).required(),
    description: Joi.string().allow(''),
    status: Joi.string().valid('pending', 'in-progress', 'completed')
});

// GET all tasks for logged in user
router.get('/', verify, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new task
router.post('/', verify, async (req, res) => {
    // Validate
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const task = new Task({
        userId: req.user._id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
    });

    try {
        const savedTask = await task.save();
        res.json(savedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// PUT update a task
router.put('/:id', verify, async (req, res) => {
    // Validate
    const { error } = taskSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedTask) return res.status(404).send('Task not found');
        res.json(updatedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE a task
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!removedTask) return res.status(404).send('Task not found');
        res.json(removedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
