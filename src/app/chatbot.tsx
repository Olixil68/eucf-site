// chatbot.tsx
"use client"; // <--- This line is correctly placed at the very top

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Main Chatbot component for your Next.js application
const Chatbot = () => {
  // State to control the visibility of the chat window
  const [showChat, setShowChat] = useState(false);
  // State to store the chat history (messages from user and AI)
  const [chatHistory, setChatHistory] = useState([{ role: 'model', text: 'Huzzah! My name is Knighto, the mascot of Esports at UCF! How can I help today.' }]);
  // State to store the current message being typed by the user
  const [currentMessage, setCurrentMessage] = useState('');
  // State to manage the loading status during API calls for regular chat
  const [isLoading, setIsLoading] = useState(false);
  // State to manage the loading status specifically for summarization
  const [isSummarizing, setIsSummarizing] = useState(false);
  // Ref to automatically scroll to the latest message
  const messagesEndRef = useRef(null);

  // Get the API key from environment variables.
  // In Next.js, public environment variables must be prefixed with NEXT_PUBLIC_
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // TEMPORARY: Log the API key to the console to verify it's loaded.
  // *** REMOVE THIS LINE BEFORE DEPLOYING TO PRODUCTION ***
  console.log('Loaded Gemini API Key:', GEMINI_API_KEY ? '******' + GEMINI_API_KEY.slice(-4) : 'NOT LOADED');

  const EUCF_INFO = `
    The Esports Club at UCF (EUCF) is a student organization found in May 2020 dedicated to fostering a vibrant and inclusive community for esports enthusiasts at the University of Central Florida.
    Key activities and offerings include:
    - Competitive gaming events for these games, Valorant, League of Legends, Rocket League, Call of Duty Apex Legends, Overwatch, Splatoon, Rainbow 6, Counter Strike, Super Smash Smash Bros Ultimate, Marvel Rivals with tryouts happening every semester!
    - Hosting events for more casual players and games.
    - Organizing tournaments like student series (tournaments for only UCF students held online) and watch parties for major tournaments like VCT.
    - Providing opportunities for students to connect with fellow gamers like the find your duo event held in the dungeon.
    - Supporting different gaming communities within the club.
    - Location: Primarily operates on campus, there is an esports area in the third floor of the student union called the dungeon where events are held. Specific locations for events are announced on their official discord.
    - How to Join: Students can typically join by attending meetings or events, and engaging with their online communities (like Discord or social media) and tryouts happen every semester.
    - Mission: To create a welcoming environment for all skill levels, from casual players to aspiring professionals, and to promote esports at UCF.
    - Contact: Check their official UCF student organization page, social media (@Esportsatucf on instagram and twitter/X), or Discord server for the most up-to-date contact information and event schedules.
    - Official UCF chant: "Go Knights! Charge On!" - A rallying cry for UCF students and alumni, often used to show support for the university's teams and events.

  `;


  // Effect to scroll to the bottom of the chat history whenever messages change
  // This effect only runs if the chat is shown
  useEffect(() => {
    if (showChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, showChat]); // Add showChat to dependencies

  /**
   * Sends the user's message to the Gemini API and updates the chat history.
   */
  const sendMessage = async () => {
    if (!currentMessage.trim()) return; // Prevent sending empty messages

    // Check if API key is available before making the call
    if (!GEMINI_API_KEY) {
      console.error('Gemini API Key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.');
      setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'Error: API Key is missing. Please configure it in your environment variables.' }]);
      return; // Stop execution if API key is missing
    }

    const userMessage = { role: 'user', text: currentMessage };
    // Add user's message to chat history immediately
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);
    setCurrentMessage(''); // Clear the input field

    setIsLoading(true); // Set loading state to true for regular chat

    try {
      const fullPrompt = `
  You are a helpful assistant providing information specifically about the Esports Club at UCF (EUCF).
  Use the following information about EUCF to answer questions. If the question is not directly related to EUCF, try to change the subject to EUCF in a funny way. 
  Be a friendly and engaging mascot for EUCF, Knighto, who is knowledgeable about the club's activities, events, and community.
  Be a EUCF superfan and try to answer questions in a way that promotes the club and its activities.

  EUCF Information:
  ${EUCF_INFO}

  User's question: ${currentMessage}
`;
      // Prepare the payload for the Gemini API call
      // The chat history is sent as 'contents' to maintain conversation context
      const payload = {
        // Here, we send only the current user's prompt enriched with EUCF info.
        // For conversational context with EUCF info on *every* turn, you'd need a more
        // sophisticated context management, possibly by including the fullPrompt
        // in a system message for each turn, or by summarizing past EUCF info.
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
            temperature: 0.7,
        }
      };


      // Use the API key from the environment variable
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      // Make the POST request to the Gemini API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
      }

      const result = await response.json();

      // Extract the AI's response text
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const aiResponseText = result.candidates[0].content.parts[0].text;
        // Add AI's response to chat history
        setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: aiResponseText }]);
      } else {
        console.error('Unexpected API response structure:', result);
        setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'Error: Could not get a valid response from the AI.' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Display an error message in the chat for the user
      setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: `Error: ${error.message || 'Something went wrong.'}` }]);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  /**
   * Summarizes the current chat history using the Gemini API.
   */
  const summarizeChat = async () => {
    if (chatHistory.length === 0) {
      setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'There is no conversation to summarize yet!' }]);
      return;
    }

    if (!GEMINI_API_KEY) {
      console.error('Gemini API Key is not set for summarization.');
      setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'Error: API Key is missing for summarization. Please configure it.' }]);
      return;
    }

    setIsSummarizing(true); // Set loading state for summarization

    try {
      // Construct a prompt to summarize the chat history
      const conversationText = chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n');
      const prompt = `Please provide a concise summary of the following conversation:\n\n${conversationText}\n\nSummary:`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.2, // Lower temperature for more factual summary
            maxOutputTokens: 200,
        }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error during summarization: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const summaryText = result.candidates[0].content.parts[0].text;
        setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: `✨ Here's a summary of our chat:\n\n${summaryText}` }]);
      } else {
        console.error('Unexpected API response structure for summarization:', result);
        setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: 'Error: Could not generate a summary.' }]);
      }
    } catch (error) {
      console.error('Error summarizing chat:', error);
      setChatHistory((prevHistory) => [...prevHistory, { role: 'model', text: `Error summarizing chat: ${error.message || 'Something went wrong.'}` }]);
    } finally {
      setIsSummarizing(false); // Reset loading state for summarization
    }
  };


  /**
   * Handles the key press event for the input field.
   * Sends the message if the 'Enter' key is pressed.
   * @param {Object} e - The keyboard event object.
   */
  const handleKeyPress = (e) => {
    // Disable sending message if either chat or summary is loading
    if (e.key === 'Enter' && !isLoading && !isSummarizing) {
      sendMessage();
    }
  };

  return (
    // The main container for both the FAB and the chat window
    <div className="relative w-full h-full">

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#B49758] text-white shadow-lg
                   hover:bg-[#B49758] focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out
                   transform hover:scale-110"
        aria-label={showChat ? "Close chatbot" : "Open chatbot"}
      >
        {showChat ? (
          // Close Icon (X)
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Chat Icon (Speech bubble)
          <Image
    src="/Knighto.png" 
    alt="Chat Icon"
    width={28}
    height={28}
    className="h-7 w-7"
    priority
    />
)}
      </button>

      {/* Chat Window - Conditionally rendered with animation */}
      {showChat && (
        <div
          className={`
            fixed bottom-24 right-6 z-40
            bg-[#FFFFFF] rounded-3xl shadow-2xl overflow-hidden
            w-full max-w-sm h-[calc(100vh-10rem)] sm:h-[40rem] flex flex-col
            transform transition-all duration-300 ease-in-out
            ${showChat ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
          `}
        >
          {/* Chat Header */}
          <div className="bg-[#000000] p-4 flex items-center justify-between rounded-t-3xl border-b border-gray-600">
            <h1 className="text-xl font-bold text-white tracking-wide">Knighto Chat!</h1>
            {/* New Summarize Button */}
            <button
              onClick={summarizeChat}
              disabled={isLoading || isSummarizing || chatHistory.length === 0}
              className="ml-4 px-3 py-1 bg-[#000000] text-white text-sm rounded-full
                         hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-purple-500
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
            >
              {isSummarizing ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Summarize
                </>
              )}
            </button>
            <div className="flex items-center space-x-2 ml-auto"> {/* Adjusted for button */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-gray-300">Online</span>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {chatHistory.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-lg">Start a conversation with the EUCF mascot Knighto!</p>
                <p className="text-sm mt-2">Type your message below and press Enter.</p>
              </div>
            )}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-md ${
                    message.role === 'user'
                      ? 'bg-[#000000] text-white rounded-br-none'
                      : 'bg-[#B49758] text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.text}</p>
                </div>
              </div>
            ))}
            {(isLoading || isSummarizing) && ( // Show loading for both operations
              <div className="flex justify-start mb-4">
                <div className="max-w-[75%] px-4 py-2 rounded-2xl shadow-md bg-gray-700 text-gray-100 rounded-bl-none">
                  <div className="dot-flashing"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          {/* Message Input Area */}
          <div className="p-4 bg-[#000000] border-t border-gray-600 flex items-center gap-3 rounded-b-3xl">
            <input
              type="text"
              // ADDED suppressHydrationWarning HERE to prevent errors from browser extensions
              suppressHydrationWarning={true}
              className="flex-1 p-3 rounded-full bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isSummarizing} // Disable if either operation is loading
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || isSummarizing || !currentMessage.trim()} // Disable if either operation is loading
              // Corrected multi-line string for className using template literals (backticks)
              className={`
                bg-[#B49758] hover:bg-[#B49758] text-white p-3 rounded-full shadow-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-700
              `}
            >
              {(isLoading || isSummarizing) ? ( // Show spinner for both operations
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-45 -translate-y-px translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
