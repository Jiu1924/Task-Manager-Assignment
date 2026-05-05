const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Project = require('../models/Project');
const router = express.Router();

// @route   POST api/projects
// @desc    Create project (Admin)
router.post('/', [auth, admin], async (req, res) => {
  const { name, members } = req.body;
  try {
    const project = new Project({
      name,
      admin: req.user.id,
      members: members || []
    });
    await project.save();
    await project.populate('admin members', 'email');
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/projects
// @desc    Get all projects (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().populate('admin members', 'email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
