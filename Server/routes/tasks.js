const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Task = require('../models/Task');
const router = express.Router();

// @route   POST api/tasks
// @desc    Create task (Admin)
router.post('/', [auth, admin], async (req, res) => {
  const { title, description, assignedTo, project, dueDate } = req.body;
  try {
    const task = new Task({
      title,
      description,
      assignedTo,
      project,
      dueDate
    });
    await task.save();
    await task.populate('assignedTo project', 'name email');
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/tasks
// @desc    Get tasks by user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo project', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/tasks/:id
// @desc    Update task (assigned user or admin)
router.put('/:id', auth, async (req, res) => {
  const { status, description } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Check if user is assigned or admin
    if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    task.status = status || task.status;
    task.description = description || task.description;
    await task.save();
    await task.populate('assignedTo project', 'name email');
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
