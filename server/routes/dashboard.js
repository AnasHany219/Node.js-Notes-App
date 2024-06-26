const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const {
  isLoggedIn
} = require('../middleware/checkAuth');

/**
 * Dashboard Routes
 */
router.get('/dashboard', isLoggedIn, dashboardController.dashboard);

router.get('/dashboard/add', isLoggedIn, dashboardController.addNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.submitNote);

router.get('/dashboard/item/:id', isLoggedIn, dashboardController.viewNote);
router.put('/dashboard/item/:id', isLoggedIn, dashboardController.updateNote);

router.delete('/dashboard/item-delete/:id', isLoggedIn, dashboardController.deleteNote);

router.get('/dashboard/search', isLoggedIn, dashboardController.search);
router.post('/dashboard/search', isLoggedIn, dashboardController.searchSubmit);

router.get('/logout', dashboardController.logout);

module.exports = router;