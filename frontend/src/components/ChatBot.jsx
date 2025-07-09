import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeadphones, FaRobot, FaUser, FaTimes } from 'react-icons/fa';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [waitingForLocation, setWaitingForLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [waitingForMortgageResponse, setWaitingForMortgageResponse] = useState(false);
  const [waitingForName, setWaitingForName] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const closeChat = () => {
    setIsChatOpen(false);
    setMessages([]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const commonQuestions = [
    "What are the property prices in my area?",
    "How can I schedule a property visit?",
    "What documents do I need to buy a house?", // Added question
    "Do you offer mortgage assistance?",
  ];

  const handleUserMessage = async (message) => {
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');

    setIsTyping(true);

    if (waitingForLocation) {
      setUserLocation(message);
      setWaitingForLocation(false);
      await fetchPropertiesByLocation(message);
      return;
    }

    if (waitingForMortgageResponse) {
      if (message.toLowerCase() === 'yes') {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "We have partnerships with several banks, including Bank of Ceylon and some private Banks. They offer competitive interest rates and flexible terms. Please provide your name and details for further assistance.", sender: 'bot' }
        ]);
        setWaitingForMortgageResponse(false);
        setWaitingForName(true);
        setIsTyping(false);
      } else if (message.toLowerCase() === 'no') {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: "Understood. If you have any other questions, feel free to ask.", sender: 'bot' }
        ]);
        setWaitingForMortgageResponse(false);
        setIsTyping(false);
      }
      return;
    }

    if (waitingForName) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: `Thank you, ${message}. Our agents are quite busy, but we will contact you soon.`, sender: 'bot' }
      ]);
      setWaitingForName(false);
      setIsTyping(false);
      return;
    }

    if (message.toLowerCase().includes("property prices")) {
      setTimeout(() => {
        setMessages([...newMessages, { text: "Property prices vary by location. Could you specify your city or neighborhood?", sender: 'bot' }]);
        setWaitingForLocation(true);
        setIsTyping(false);
      }, 1500);
      return;
    }

    if (message.toLowerCase().includes("mortgage assistance")) {
      setTimeout(() => {
        setMessages([...newMessages, { text: "Yes, we have tie-ups with multiple banks to help with mortgages. Would you like more details?", sender: 'bot' }]);
        setWaitingForMortgageResponse(true);
        setIsTyping(false);
      }, 1500);
      return;
    }

    // Step-by-step property visit scheduling response
    if (message.toLowerCase().includes("schedule a property visit")) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { text: "To schedule a property visit, please follow these steps:", sender: 'bot' },
          { text: "1. Contact us via phone or email to schedule an appointment.", sender: 'bot' },
          { text: "2. Choose a date and time that works for you.", sender: 'bot' },
          { text: "3. Select the property you're interested in visiting.", sender: 'bot' },
          { text: "4. Provide your personal details, including name and contact information.", sender: 'bot' },
          { text: "5. Receive a confirmation of your appointment and visit details.", sender: 'bot' },
          { text: "6. Show up on the scheduled date and enjoy your visit!", sender: 'bot' },
        ]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    // Added answer for "What documents do I need to buy a house?"
    if (message.toLowerCase().includes("documents")) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { text: "To buy a house, you typically need the following documents:", sender: 'bot' },
          { text: "1. Proof of identity (e.g., National ID or Passport)", sender: 'bot' },
          { text: "2. Proof of income (e.g., Salary slips or Bank statements)", sender: 'bot' },
          { text: "3. Tax returns for the last 2-3 years", sender: 'bot' },
          { text: "4. Property title deed", sender: 'bot' },
          { text: "5. Bank statements", sender: 'bot' },
          { text: "6. Pre-approval letter from a bank (if applying for a mortgage)", sender: 'bot' },
          { text: "7. Utility bills for the property", sender: 'bot' },
          { text: "8. Other legal documents as required by the local authorities", sender: 'bot' },
        ]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    setTimeout(() => {
      setMessages([...newMessages, { text: "I'm unable to respond to that. Could you please ask something else?", sender: 'bot' }]);
      setIsTyping(false);
    }, 1500);
  };

  const fetchPropertiesByLocation = async (location) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/properties`);
      const properties = response.data.properties.filter(property => property.location.toLowerCase().includes(location.toLowerCase()));

      setIsTyping(false);

      if (properties.length === 0) {
        setMessages(prevMessages => [
          ...prevMessages,
          { text: `Sorry, no properties found in ${location}.`, sender: 'bot' }
        ]);
      } else {
        const propertyMessages = properties.map(property => ({
          text: (
            <div>
              <img src={property.images[0]} alt="Property" className="w-32 h-32 rounded-md" />
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Price:</strong> LKR {property.price.toLocaleString()}</p>
            </div>
          ),
          sender: 'bot'
        }));

        setMessages(prevMessages => [...prevMessages, ...propertyMessages]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Error fetching properties. Try again!', sender: 'bot' }
      ]);
    }
  };

  return (
    <div className={`fixed bottom-5 right-5 ${isChatOpen ? 'w-96 h-96' : 'w-14 h-14'} transition-all`}>
      <div className="bg-purple-500 text-white p-4 rounded-full cursor-pointer shadow-lg hover:bg-purple-200 transition" onClick={toggleChat}>
        <FaHeadphones size={24} />
      </div>

      {isChatOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full absolute bottom-0 right-0 mb-16">
          {/* Close Chat Button */}
          <div className="absolute top-2 right-2 cursor-pointer" onClick={closeChat}>
            <FaTimes size={20} />
          </div>

          {/* Quick Questions */}
          <div className="mb-4 flex flex-wrap gap-2">
            {commonQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleUserMessage(question)}
                className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full cursor-pointer hover:bg-blue-200 transition"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Clear Chat Button */}
          <button
            onClick={clearChat}
            className="bg-green-500 text-white px-3 py-1 rounded-md mb-4 w-full hover:bg-red-600 transition"
          >
            Clear Chat
          </button>

          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto mb-4 flex flex-col">
            {messages.map((message, index) => (
              <div key={index} className={`my-2 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}>
                {message.sender === 'user' ? (
                  <div className="flex items-center justify-end">
                    <FaUser size={20} className="mr-2 text-blue-500" />
                    <p className={`px-4 py-2 rounded-lg max-w-xs inline-block transition-all ${message.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                      {message.text}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-start">
                    <FaRobot size={20} className="mr-2 text-gray-500" />
                    <p className={`px-4 py-2 rounded-lg max-w-xs inline-block transition-all ${message.sender === 'bot' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                      {message.text}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Animation */}
            {isTyping && (
              <div className="text-left my-2">
                <div className="px-4 py-2 bg-gray-200 rounded-lg max-w-xs inline-block animate-pulse">
                  <span className="text-gray-600">Typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => handleUserMessage(userInput)}
            className="mt-2 bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
