import React from 'react';
import '../styles/chatbot.css';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const messageText = typeof message.text === 'string' ? message.text : message.text;
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-content">
        {!isUser && (
          <div className="message-sender">
            <i className="fas fa-leaf"></i>
            <span>Carbon Coach</span>
          </div>
        )}
        <p>{messageText}</p>
        {message.actionButton && (
          <button 
            onClick={message.actionButton.onClick} 
            className="action-button"
          >
            <i className="fas fa-arrow-right"></i> {message.actionButton.text}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;