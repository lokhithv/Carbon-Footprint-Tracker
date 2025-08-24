const asyncHandler = require('express-async-handler');
const Recommendation = require('../models/recommendationModel');
const Footprint = require('../models/footprintModel');
const axios = require('axios');


const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await Recommendation.find({ user: req.user.id });
  res.status(200).json(recommendations);
});


const createRecommendation = asyncHandler(async (req, res) => {
  if (!req.body.category || !req.body.title || !req.body.description) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const recommendation = await Recommendation.create({
    user: req.user.id,
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    potentialImpact: req.body.potentialImpact || 0,
    difficulty: req.body.difficulty || 'medium',
    source: req.body.source || 'system',
  });

  res.status(201).json(recommendation);
});


const updateRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await Recommendation.findById(req.params.id);

  if (!recommendation) {
    res.status(404);
    throw new Error('Recommendation not found');
  }

  if (recommendation.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedRecommendation = await Recommendation.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedRecommendation);
});


const deleteRecommendation = asyncHandler(async (req, res) => {
  const recommendation = await Recommendation.findById(req.params.id);

  if (!recommendation) {
    res.status(404);
    throw new Error('Recommendation not found');
  }


  if (recommendation.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await recommendation.deleteOne();

  res.status(200).json({ id: req.params.id });
});

const generateAIRecommendations = asyncHandler(async (req, res) => {

  const footprints = await Footprint.find({ user: req.user.id }).sort({
    createdAt: -1,
  }).limit(50);

  if (footprints.length === 0) {
    res.status(400);
    throw new Error('No footprint data available to generate recommendations');
  }


  const totalEmission = footprints.reduce(
    (sum, fp) => sum + fp.carbonEmission,
    0
  );

  const categoryEmissions = {};
  footprints.forEach((fp) => {
    if (!categoryEmissions[fp.category]) {
      categoryEmissions[fp.category] = 0;
    }
    categoryEmissions[fp.category] += fp.carbonEmission;
  });

 
  let highestCategory = '';
  let highestEmission = 0;

  for (const [category, emission] of Object.entries(categoryEmissions)) {
    if (emission > highestEmission) {
      highestEmission = emission;
      highestCategory = category;
    }
  }

  try {
    const recommendations = await generatePuterAIRecommendations(
      categoryEmissions,
      totalEmission,
      highestCategory,
      footprints
    );


    const savedRecommendations = [];

    for (const rec of recommendations) {
      const newRecommendation = await Recommendation.create({
        user: req.user.id,
        category: rec.category,
        title: rec.title,
        description: rec.description,
        potentialImpact: rec.potentialImpact || 0,
        difficulty: rec.difficulty || 'medium',
        source: 'ai',
      });
      savedRecommendations.push(newRecommendation);
    }

    res.status(201).json(savedRecommendations);
  } catch (error) {
    console.error('Puter.js AI API error:', error);
    console.log('Falling back to smart rules-based recommendations...');
    

    const recommendations = generateSmartRecommendations(
      categoryEmissions,
      totalEmission,
      highestCategory,
      footprints
    );


    const savedRecommendations = [];

    for (const rec of recommendations) {
      const newRecommendation = await Recommendation.create({
        user: req.user.id,
        category: rec.category,
        title: rec.title,
        description: rec.description,
        potentialImpact: rec.potentialImpact || 0,
        difficulty: rec.difficulty || 'medium',
        source: 'ai',
      });
      savedRecommendations.push(newRecommendation);
    }

    res.status(201).json(savedRecommendations);
  }
});

const generateSmartRecommendations = (categoryEmissions, totalEmission, highestCategory, footprints) => {
  const recommendations = [];
  

  const categoryRecommendations = {
    transportation: [
      {
        category: 'transportation',
        title: 'Switch to Public Transit',
        description: 'Replace 2 car trips per week with public transportation. This can reduce your carbon footprint by approximately 20-30% for transportation emissions.',
        potentialImpact: categoryEmissions.transportation * 0.25,
        difficulty: 'medium'
      },
      {
        category: 'transportation',
        title: 'Carpool to Work',
        description: 'Share rides with colleagues or use carpooling apps. Carpooling with just one other person can cut your transportation emissions in half.',
        potentialImpact: categoryEmissions.transportation * 0.3,
        difficulty: 'easy'
      }
    ],
    energy: [
      {
        category: 'energy',
        title: 'Switch to LED Bulbs',
        description: 'Replace all household bulbs with LED alternatives. LED bulbs use 75% less energy and last 25 times longer than incandescent lighting.',
        potentialImpact: categoryEmissions.energy * 0.15,
        difficulty: 'easy'
      },
      {
        category: 'energy',
        title: 'Adjust Thermostat Settings',
        description: 'Lower your thermostat by 2°C in winter and raise it by 2°C in summer. This simple change can reduce energy consumption by up to 10%.',
        potentialImpact: categoryEmissions.energy * 0.1,
        difficulty: 'easy'
      }
    ],
    food: [
      {
        category: 'food',
        title: 'Reduce Meat Consumption',
        description: 'Adopt "Meatless Mondays" or reduce meat consumption by 50%. Plant-based meals have significantly lower carbon footprints than meat-based meals.',
        potentialImpact: categoryEmissions.food * 0.3,
        difficulty: 'medium'
      },
      {
        category: 'food',
        title: 'Buy Local and Seasonal',
        description: 'Choose locally grown, seasonal produce to reduce transportation emissions from food imports.',
        potentialImpact: categoryEmissions.food * 0.15,
        difficulty: 'easy'
      }
    ],
    shopping: [
      {
        category: 'shopping',
        title: 'Buy Second-hand Items',
        description: 'Purchase used items instead of new ones. Second-hand shopping reduces demand for new production and associated emissions.',
        potentialImpact: categoryEmissions.shopping * 0.4,
        difficulty: 'easy'
      },
      {
        category: 'shopping',
        title: 'Choose Sustainable Brands',
        description: 'Support companies with strong environmental practices and sustainable manufacturing processes.',
        potentialImpact: categoryEmissions.shopping * 0.2,
        difficulty: 'medium'
      }
    ],
    waste: [
      {
        category: 'waste',
        title: 'Start Composting',
        description: 'Compost food scraps and yard waste to reduce methane emissions from landfills and create nutrient-rich soil.',
        potentialImpact: categoryEmissions.waste * 0.5,
        difficulty: 'medium'
      },
      {
        category: 'waste',
        title: 'Reduce Single-use Plastics',
        description: 'Use reusable bags, containers, and water bottles to minimize plastic waste and associated production emissions.',
        potentialImpact: categoryEmissions.waste * 0.25,
        difficulty: 'easy'
      }
    ]
  };

  if (categoryRecommendations[highestCategory]) {
    recommendations.push(...categoryRecommendations[highestCategory].slice(0, 2));
  }


  recommendations.push({
    category: 'general',
    title: 'Track Your Progress',
    description: 'Continue monitoring your carbon footprint regularly. Awareness is the first step toward meaningful reduction. Set monthly goals to reduce your total emissions by 10%.',
    potentialImpact: totalEmission * 0.1,
    difficulty: 'easy'
  });

  return recommendations.slice(0, 3);
};


const generatePuterAIRecommendations = async (categoryEmissions, totalEmission, highestCategory, footprints) => {
  try {

    console.log('Using rule-based fallback for recommendations (Puter.js should be used client-side)');
    throw new Error('Using fallback recommendations - Puter.js should be used from client-side');
  } catch (error) {
    console.error('Error generating recommendations:', error.message);
    

    const fallbackRecommendations = {
      transportation: [
        {
          category: 'transportation',
          title: 'Use Public Transport',
          description: 'Switch from private car to public transportation for your daily commute. This can significantly reduce your carbon emissions.',
          potentialImpact: totalEmission * 0.2,
          difficulty: 'medium'
        },
        {
          category: 'transportation',
          title: 'Carpool When Possible',
          description: 'Share rides with colleagues or friends going to the same destination to reduce per-person emissions.',
          potentialImpact: totalEmission * 0.15,
          difficulty: 'easy'
        }
      ],
      food: [
        {
          category: 'food',
          title: 'Reduce Meat Consumption',
          description: 'Try having 2-3 meat-free days per week. Plant-based meals generally have a much lower carbon footprint.',
          potentialImpact: totalEmission * 0.15,
          difficulty: 'medium'
        },
        {
          category: 'food',
          title: 'Buy Local Produce',
          description: 'Purchase locally grown food to reduce transportation emissions associated with your diet.',
          potentialImpact: totalEmission * 0.05,
          difficulty: 'easy'
        }
      ],
      home: [
        {
          category: 'home',
          title: 'Optimize Heating/Cooling',
          description: 'Adjust your thermostat by 1-2 degrees (lower in winter, higher in summer) to reduce energy consumption.',
          potentialImpact: totalEmission * 0.1,
          difficulty: 'easy'
        },
        {
          category: 'home',
          title: 'Switch to LED Lighting',
          description: 'Replace all conventional light bulbs with LED alternatives, which use up to 80% less electricity.',
          potentialImpact: totalEmission * 0.05,
          difficulty: 'easy'
        }
      ]
    };
  
    
    let recommendations = [];
    
    if (fallbackRecommendations[highestCategory]) {
      recommendations.push(...fallbackRecommendations[highestCategory]);
    } else {

      recommendations.push({
        category: 'general',
        title: 'Track More Activities',
        description: 'Add more detailed footprint entries to get more specific recommendations for your lifestyle.',
        potentialImpact: totalEmission * 0.1,
        difficulty: 'easy'
      });
    }
    

    recommendations.push({
      category: 'general',
      title: 'Track Your Progress',
      description: 'Continue monitoring your carbon footprint regularly. Awareness is the first step toward meaningful reduction.',
      potentialImpact: totalEmission * 0.05,
      difficulty: 'easy'
    });
    
    return recommendations.slice(0, 3);
  }
};






module.exports = {
  getRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  generateAIRecommendations,
};