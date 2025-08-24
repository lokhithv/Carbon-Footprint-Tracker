import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ChatMessage from './ChatMessage';
import { generateChatResponse } from '../features/chat/chatService';
import '../styles/chatbot.css';

const ChatbotInterface = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector(state => state.auth.user);
  const footprints = useSelector(state => state.footprints.footprints);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);
  
  console.log('ChatbotInterface rendering, isOpen:', isOpen);

  useEffect(() => {
    if (messages.length === 0) {
      const userName = user?.name || 'there';
      const welcomeMessage = {
        text: `Hi ${userName}! I'm your Carbon Coach. Ask me anything about your carbon footprint or how you can reduce your emissions.`,
        sender: 'ai'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, user?.name]);



  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      const response = await generateChatResponse(inputText, footprints, user);
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now(),
          text: typeof response === 'string' ? response : (response.message?.content || response.content || 'Sorry, I couldn\'t generate a response.'),
          sender: 'ai',
          timestamp: new Date()
        };
        console.log('AI Response received:', response);
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      
      if (!window.puter || !window.puter.ai) {
        console.log('Attempting to reload Puter.js...');
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.async = true;
        script.onload = () => {
          console.log('Puter.js reloaded successfully');
        };
        document.body.appendChild(script);
      }
      
      const errorMessage = {
        id: Date.now(),
        text: "I'm sorry, I couldn't generate a response. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };



  const toggleChat = () => {
    if (onClose) {
      onClose();
    }
  };

  console.log('ChatbotInterface rendering, isOpen:', isOpen);
  
  return (
    <div className="chatbot-container">
      {!isOpen ? null : (
        <div className="chat-interface">
          <div className="chat-header">
            <div className="header-content">
              <i className="fas fa-leaf header-icon"></i>
              <h3>Carbon Coach</h3>
            </div>
            <button onClick={toggleChat} className="close-button">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message} 
              />
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="chat-input-area">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about reducing your carbon footprint..."
              onKeyPress={handleKeyPress}
              className="chat-input"
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotInterface;