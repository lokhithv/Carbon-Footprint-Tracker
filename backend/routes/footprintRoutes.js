const express = require('express');
const router = express.Router();
const {
  getFootprints,
  addFootprint,
  updateFootprint,
  deleteFootprint,
  getFootprintSummary,
} = require('../controllers/footprintController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getFootprints).post(protect, addFootprint);
router.route('/summary').get(protect, getFootprintSummary);
router
  .route('/:id')
  .put(protect, updateFootprint)
  .delete(protect, deleteFootprint);

module.exports = router;