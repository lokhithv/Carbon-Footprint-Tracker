import axios from 'axios';

const API_URL = '/api/recommendations/';

const RECOMMENDATIONS_STORAGE_KEY = 'carbon_recommendations';

const getLocalRecommendations = (userId) => {
  const storedData = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    const allRecommendations = JSON.parse(storedData);
    return allRecommendations.filter(rec => rec.user === userId) || [];
  } catch (error) {
    console.error('Error parsing local recommendations:', error);
    return [];
  }
};

const saveLocalRecommendations = (recommendations) => {
  localStorage.setItem(RECOMMENDATIONS_STORAGE_KEY, JSON.stringify(recommendations));
};

const getRecommendations = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.log('Using local storage fallback for recommendations');
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    return getLocalRecommendations(userId);
  }
};

const generateRecommendations = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post(API_URL + 'generate', {}, config);
    return response.data;
  } catch (error) {
    console.log('Using local storage fallback for generating recommendations');
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    
    const allRecommendations = localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY) 
      ? JSON.parse(localStorage.getItem(RECOMMENDATIONS_STORAGE_KEY)) 
      : [];
    
    const categories = ['transportation', 'energy', 'food', 'shopping', 'waste'];
    const newRecommendations = categories.map((category, index) => ({
      _id: `local-${Date.now()}-${index}`,
      user: userId,
      category,
      title: `Reduce ${category} emissions`,
      description: `Consider ways to reduce your ${category} carbon footprint through sustainable alternatives.`,
      potentialImpact: 5.0,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    const updatedRecommendations = [
      ...allRecommendations.filter(rec => rec.user !== userId),
      ...newRecommendations
    ];
    saveLocalRecommendations(updatedRecommendations);
    
    return newRecommendations;
  }
};

const updateRecommendation = async (recommendationId, recommendationData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + recommendationId,
    recommendationData,
    config
  );

  return response.data;
};

const deleteRecommendation = async (recommendationId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + recommendationId, config);

  return response.data;
};



const recommendationService = {
  getRecommendations,
  generateRecommendations,
  updateRecommendation,
  deleteRecommendation,
};

export default recommendationService;