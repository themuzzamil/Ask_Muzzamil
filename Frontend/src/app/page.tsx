'use client'; // Ensure this is at the top for client components
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);

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
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4">Chat with the Bot</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          className="textarea border p-2 mb-2 rounded"
          rows={3}
        />
        <button type="submit" className="btn bg-blue-500 text-white rounded py-2 hover:bg-blue-600">Send</button>
      </form>
      <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div key={index} className="chat-message">
              <p className="text-gray-600">
                <strong className="text-blue-500">You:</strong> {message.user}
              </p>
              <p className="text-gray-600">
                <strong className="text-green-500">Bot:</strong>
                <ReactMarkdown className="prose">{message.bot}</ReactMarkdown>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Chat;

