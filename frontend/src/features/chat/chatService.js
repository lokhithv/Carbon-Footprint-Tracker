
export const generateChatResponse = async (message, footprints, user) => {
  if (!window.puter || !window.puter.ai) {
    throw new Error('Puter.js AI not available');
  }

  let systemPrompt = `You are a helpful AI assistant that can answer any question the user asks. `;
  
  if (footprints && footprints.length > 0) {
    const categoryEmissions = {};
    let totalEmission = 0;
    
    footprints.forEach((fp) => {
      if (!categoryEmissions[fp.category]) {
        categoryEmissions[fp.category] = 0;
      }
      categoryEmissions[fp.category] += fp.carbonEmission;
      totalEmission += fp.carbonEmission;
    });

    let highestCategory = '';
    let highestEmission = 0;

    for (const [category, emission] of Object.entries(categoryEmissions)) {
      if (emission > highestEmission) {
        highestEmission = emission;
        highestCategory = category;
      }
    }

    const recentActivities = footprints
      .slice(0, 10)
      .map(
        (fp) =>
          `- ${fp.activity} (${fp.category}): ${fp.carbonEmission.toFixed(2)} kg CO2e`
      )
      .join('\n');

    systemPrompt += `You are also a Carbon Coach that helps users understand and reduce their carbon footprint. 
    
    User's carbon footprint data:
    - Total Carbon Footprint: ${totalEmission.toFixed(2)} kg CO2e
    - Highest emission category: ${highestCategory || 'No data'}
    ${Object.entries(categoryEmissions)
      .map(([category, emission]) => `- ${category}: ${emission.toFixed(2)} kg CO2e`)
      .join('\n')}
    
    Recent Activities:
    ${recentActivities || 'No recent activities'}
    
    User's name: ${user?.name || 'User'}
    User's carbon goal: ${user?.carbonGoal ? user.carbonGoal + ' kg CO2e' : 'Not set'}
    `;
  }
  
  systemPrompt += `\n\nRespond in a helpful, conversational way. If asked about carbon footprint, provide specific, actionable advice based on the user's data if available. Keep responses concise (2-3 sentences). If asked about categories with no data, suggest ways to start tracking them. For any other questions, provide accurate and helpful information.`;

  try {
    console.log('Sending message to Puter AI:', message);
    if (window.puter && window.puter.ai) {
      try {
        const aiResponse = await window.puter.ai.chat(message, { 
          model: "gpt-4.1-nano",
          systemPrompt: systemPrompt
        });
        
        console.log('Received response from Puter AI:', aiResponse);
        return aiResponse;
      } catch (puterError) {
        console.error('Puter AI error, will try direct response:', puterError);
        return {
          content: "I can answer any questions you have about reducing your carbon footprint or any other topic. What would you like to know?"
        };
      }
    } else {
      console.log('Puter AI not available, returning direct response');
      return {
        content: "I can answer any questions you have about reducing your carbon footprint or any other topic. What would you like to know?"
      };
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    return 'Sorry, I encountered an error while processing your question. Please try again later.';
  }
};

export const generateSuggestedQuestion = async (footprints) => {
  if (!window.puter || !window.puter.ai || footprints.length === 0) {
    return null;
  }

  try {
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

    const prompt = `Based on the user's carbon footprint data, their highest emission category is ${highestCategory} with ${highestEmission.toFixed(2)} kg CO2e. 
    Generate ONE short, specific question the user might want to ask about reducing their carbon footprint in this category. 
    The question should be phrased from the user's perspective (e.g., "How can I reduce my transportation emissions?"). 
    Keep it under 10 words and make it actionable.`;

    const suggestedQuestion = await window.puter.ai.chat(prompt, { model: "gpt-4.1-nano" });
    return typeof suggestedQuestion === 'string' ? suggestedQuestion.trim() : suggestedQuestion.message?.content.trim() || '';
  } catch (error) {
    console.error('Error generating suggested question:', error);
    return null;
  }
};