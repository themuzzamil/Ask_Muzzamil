'use client'; // Ensure this is at the top for client components
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Scroll to the latest message when a new one is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = input;
    setMessages([...messages, { user: userMessage, bot: '...' }]); // Add user message with bot placeholder
  
    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response:', response.status, errorMessage);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setMessages((prevMessages) =>
        prevMessages.map((msg, i) =>
          i === prevMessages.length - 1 ? { ...msg, bot: data.text } : msg
        )
      );
  
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages((prevMessages) => [...prevMessages, { user: userMessage, bot: 'Error fetching response' }]);
    }
  
    setInput('');
  };

   return (
    <div className="relative h-full w-full bg-slate-950">
      <div className="flex flex-col h-screen bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">Chat with the Bot</h1>

          {/* Chat messages */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                {/* User message */}
                <div className="self-end bg-[#292C39] text-[#FCD9B8] p-4 m-2 rounded-lg max-w-xl min-w-80">
                  <p className="text-sm">You:</p>
                  <p>{message.user}</p>
                </div>
                {/* Bot message */}
                <div className="self-start p-3 m-2 text-gray-300 rounded-lg max-w-full min-w-80 mt-2 flex items-top space-x-2">
                  <p className="text-sm">Bot:</p>
                  <ReactMarkdown className="prose">{message.bot}</ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[#FCD9B8] flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-4 w-full max-w-3xl"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-[#292C39] text-[#FCD9B8] p-4 rounded-md resize-none"
            rows={2}
          />
          <button
            type="submit"
            className="bg-[#FCD9B8] text-[#292C39] border border-[#FCD9B8] px-4 py-2 rounded-md hover:bg-transparent hover:text-[#FCD9B8] hover:border-[#FCD9B8]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
