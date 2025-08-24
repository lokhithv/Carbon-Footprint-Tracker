const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  generateAIRecommendations,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getRecommendations)
  .post(protect, createRecommendation);

router.route('/generate').post(protect, generateAIRecommendations);

router
  .route('/:id')
  .put(protect, updateRecommendation)
  .delete(protect, deleteRecommendation);

module.exports = router;