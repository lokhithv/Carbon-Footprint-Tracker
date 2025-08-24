import axios from 'axios';

const API_URL = '/api/footprints/';


const getFootprints = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching footprints from API:', error);
    throw error;
  }
};

const addFootprint = async (footprintData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(API_URL, footprintData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding footprint to API:', error);
    throw error;
  }
};

const updateFootprint = async (id, footprintData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(API_URL + id, footprintData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating footprint in API:', error);
    throw error;
  }
};

const deleteFootprint = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(API_URL + id, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting footprint in API:', error);
    throw error;
  }
};

const getFootprintSummary = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(API_URL + 'summary', config);
    return response.data;
  } catch (error) {
    console.error('Error getting footprint summary from API:', error);
    throw error;
  }
};

const footprintService = {
  getFootprints,
  addFootprint,
  updateFootprint,
  deleteFootprint,
  getFootprintSummary,
};

export default footprintService;