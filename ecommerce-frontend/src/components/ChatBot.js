// import React, { useState } from 'react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([{ text: "Hi! How can I help you?", isUser: false }]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const toggleChatbot = () => {
//     setIsOpen(!isOpen);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     setMessages(prev => [...prev, { text: input, isUser: true }]);
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:8000/query', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ question: input })
//       });

//       const data = await response.json();
      
//       // Add bot response
//       setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, { 
//         text: "Sorry, I encountered an error. Please try again.", 
//         isUser: false 
//       }]);
//     } finally {
//       setIsLoading(false);
//       setInput('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };


//   return (
//     <div>
//       {/* Chatbot Toggle Button */}
//       <button
//         onClick={toggleChatbot}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           width: '50px',
//           height: '50px',
//           borderRadius: '50%',
//           backgroundColor: '#2563eb',
//           color: 'white',
//           border: 'none',
//           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//           cursor: 'pointer',
//         }}
//       >
//         💬
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             bottom: '80px',
//             right: '20px',
//             width: '300px',
//             height: '400px',
//             backgroundColor: 'white',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             overflow: 'hidden',
//             display: 'flex',
//             flexDirection: 'column',
//             zIndex: 1000,
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               backgroundColor: '#2563eb',
//               color: 'white',
//               padding: '10px',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               textAlign: 'center',
//             }}
//           >
//             Chat with us!
//           </div>

//           {/* Messages Area */}
//           <div
//             style={{
//               flex: 1,
//               padding: '10px',
//               overflowY: 'auto',
//               fontSize: '14px',
//               backgroundColor: '#f9f9f9',
//             }}
//           >
//             <p>Hi! How can we help you?</p>
//           </div>

//           {/* Input Area */}
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               borderTop: '1px solid #ddd',
//               padding: '10px',
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Type a message..."
//               style={{
//                 flex: 1,
//                 padding: '10px',
//                 border: '1px solid #ddd',
//                 borderRadius: '5px',
//                 marginRight: '10px',
//               }}
//             />
//             <button
//               style={{
//                 padding: '10px',
//                 backgroundColor: '#2563eb',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//               }}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;


// import React, { useState, useRef, useEffect } from 'react';

// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([{ text: "Hi! How can I help you?", isUser: false }]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const toggleChatbot = () => {
//     setIsOpen(!isOpen);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     setMessages(prev => [...prev, { text: input, isUser: true }]);
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://localhost:8004/query', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ question: input })
//       });

//       const data = await response.json();
      
//       // Add bot response
//       setMessages(prev => [...prev, { text: data.answer, isUser: false }]);
//     } catch (error) {
//       console.error('Error:', error);
//       setMessages(prev => [...prev, { 
//         text: "Sorry, I encountered an error. Please try again.", 
//         isUser: false 
//       }]);
//     } finally {
//       setIsLoading(false);
//       setInput('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <div>
//       {/* Chatbot Toggle Button */}
//       <button
//         onClick={toggleChatbot}
//         style={{
//           position: 'fixed',
//           bottom: '20px',
//           right: '20px',
//           width: '50px',
//           height: '50px',
//           borderRadius: '50%',
//           backgroundColor: '#2563eb',
//           color: 'white',
//           border: 'none',
//           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//           cursor: 'pointer',
//         }}
//       >
//         💬
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div
//           style={{
//             position: 'fixed',
//             bottom: '80px',
//             right: '20px',
//             width: '300px',
//             height: '400px',
//             backgroundColor: 'white',
//             borderRadius: '10px',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             overflow: 'hidden',
//             display: 'flex',
//             flexDirection: 'column',
//             zIndex: 1000,
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               backgroundColor: '#2563eb',
//               color: 'white',
//               padding: '10px',
//               fontSize: '16px',
//               fontWeight: 'bold',
//               textAlign: 'center',
//             }}
//           >
//             AutoParts Assistant
//           </div>

//           {/* Messages Area */}
//           <div
//             style={{
//               flex: 1,
//               padding: '10px',
//               overflowY: 'auto',
//               fontSize: '14px',
//               backgroundColor: '#f9f9f9',
//             }}
//           >
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 style={{
//                   marginBottom: '10px',
//                   display: 'flex',
//                   justifyContent: message.isUser ? 'flex-end' : 'flex-start',
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: '80%',
//                     padding: '8px 12px',
//                     borderRadius: '12px',
//                     backgroundColor: message.isUser ? '#2563eb' : '#e5e7eb',
//                     color: message.isUser ? 'white' : 'black',
//                   }}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div style={{ textAlign: 'center', padding: '10px' }}>
//                 Thinking...
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               borderTop: '1px solid #ddd',
//               padding: '10px',
//             }}
//           >
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Ask about our products..."
//               style={{
//                 flex: 1,
//                 padding: '10px',
//                 border: '1px solid #ddd',
//                 borderRadius: '5px',
//                 marginRight: '10px',
//               }}
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSend}
//               disabled={isLoading}
//               style={{
//                 padding: '10px',
//                 backgroundColor: '#2563eb',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//                 opacity: isLoading ? 0.7 : 1,
//               }}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Bot, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! How can I help you with auto parts?", type: 'incoming' }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, type) => {
    setMessages(prev => [...prev, { text, type }]);
  };

  const handleSendMessage = async () => {
    const message = inputMessage.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'outgoing');
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8004/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message
        })
      });

      const data = await response.json();
      addMessage(data.answer, 'incoming');
    } catch (error) {
      addMessage('Sorry, something went wrong. Please try again.', 'incoming');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <MessageCircle size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center">
            <Bot size={24} className="mr-2" />
            <span className="font-semibold">Auto Parts Assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'outgoing'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about auto parts..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;