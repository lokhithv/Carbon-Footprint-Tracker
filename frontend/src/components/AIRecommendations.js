import React from 'react';
import ChatbotInterface from './ChatbotInterface';

const AIRecommendations = () => {
  const [showChatbot, setShowChatbot] = React.useState(false);

  return (
    <div className="ai-recommendations-container">
      <ChatbotInterface isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
      <button 
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="ml-2 font-medium">AI Carbon Coach</span>
      </button>
    </div>
  );
};

export default AIRecommendations;