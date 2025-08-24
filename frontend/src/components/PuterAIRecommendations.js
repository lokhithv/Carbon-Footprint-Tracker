import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const PuterAIRecommendations = ({ onRecommendationsGenerated, onError }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { footprints } = useSelector((state) => state.footprints);

  useEffect(() => {
    if (footprints && footprints.length > 0) {
      generateRecommendations();
    }
  }, [footprints]);

  const generateRecommendations = async (category = 'general') => {
    if (!window.puter || !window.puter.ai || footprints.length === 0) {
      onError('Puter.js AI not available or no footprint data');
      return;
    }

    setIsGenerating(true);

    try {
      const categoryFootprints = footprints.filter(fp => fp.category === category || category === 'general');
      const totalEmission = categoryFootprints.reduce((sum, fp) => sum + fp.carbonEmission, 0);
      
      const categoryEmissions = {};
      footprints.forEach((fp) => {
        if (!categoryEmissions[fp.category]) {
          categoryEmissions[fp.category] = 0;
        }
        categoryEmissions[fp.category] += fp.carbonEmission;
      });

      let highestCategory = '';
      let highestEmission = 0;

      for (const [cat, emission] of Object.entries(categoryEmissions)) {
        if (emission > highestEmission) {
          highestEmission = emission;
          highestCategory = cat;
        }
      }

      const prompt = `Based on the following carbon footprint data for a user, provide 3 specific, actionable recommendations to reduce their carbon footprint. Focus especially on the category with highest emissions: ${highestCategory}.

Total Carbon Footprint: ${totalEmission.toFixed(2)} kg CO2e

Emissions by Category:
${Object.entries(categoryEmissions)
  .map(([category, emission]) => `- ${category}: ${emission.toFixed(2)} kg CO2e`)
  .join('\n')}

Recent Activities:
${categoryFootprints
  .slice(0, 10)
  .map(
    (fp) =>
      `- ${fp.activity} (${fp.category}): ${fp.carbonEmission.toFixed(2)} kg CO2e`
  )
  .join('\n')}

Provide 3 recommendations in the following JSON format:
[{
  "category": "category name",
  "title": "short recommendation title",
  "description": "detailed explanation of the recommendation",
  "potentialImpact": numeric estimate of kg CO2e savings,
  "difficulty": "easy", "medium", or "hard"
}]
`;

      console.log('Using client-side Puter.js AI for recommendations generation');
      
      const aiResponse = await window.puter.ai.chat(prompt, { model: "gpt-4.1-nano" });
      
      const jsonMatch = aiResponse.match(/\[\s*\{.*\}\s*\]/s);
      let recommendations = [];
      
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(aiResponse);
      }
      
      recommendations = recommendations.filter(rec => 
        rec.category && rec.title && rec.description && 
        typeof rec.potentialImpact === 'number' &&
        ['easy', 'medium', 'hard'].includes(rec.difficulty)
      );
      
      if (recommendations.length > 0) {
        onRecommendationsGenerated(recommendations.slice(0, 3));
      } else {
        throw new Error('No valid recommendations returned');
      }
    } catch (error) {
      console.error('Error generating recommendations with Puter.js:', error);
      onError('Failed to generate recommendations with Puter.js AI');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-6">
      {isGenerating ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-2 text-green-600">Generating recommendations...</span>
        </div>
      ) : null}
    </div>
  );
};

export default PuterAIRecommendations;