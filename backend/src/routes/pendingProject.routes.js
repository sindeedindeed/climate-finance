const express = require('express');
const router = express.Router();
const pendingProjectController = require('../controllers/pendingProject.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Public route - anyone can submit a project
router.post('/submit', pendingProjectController.addPendingProject);

// Admin routes - require authentication
router.get('/all', authenticateToken, pendingProjectController.getAllPendingProjects);
router.get('/:id', authenticateToken, pendingProjectController.getPendingProjectById);
router.put('/approve/:id', authenticateToken, pendingProjectController.approveProject);
router.delete('/reject/:id', authenticateToken, pendingProjectController.rejectProject);

module.exports = router; 