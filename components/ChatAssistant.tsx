
import React, { useState } from 'react';
import { ApiConfig } from '../types';
import { getExplanation } from '../services/geminiService';

interface ChatAssistantProps {
  context: { question: string; answer: string; };
  apiConfig: ApiConfig;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-1">
        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse"></div>
    </div>
);

const ChatAssistant: React.FC<ChatAssistantProps> = ({ context, apiConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: 'user' as const, text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setError('');

    try {
      const aiResponse = await getExplanation(context, query, apiConfig);
      const aiMessage = { sender: 'ai' as const, text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition"
      >
        <span className="font-semibold text-slate-300">Need help understanding this?</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-slate-900/70 rounded-lg border border-slate-700">
          <div className="h-48 overflow-y-auto pr-2 space-y-3 mb-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-800 text-white' : 'bg-slate-700 text-slate-200'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
             {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-slate-700 text-slate-200 p-3 rounded-lg">
                        <LoadingSpinner />
                    </div>
                 </div>
             )}
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="bg-cyan-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-700 transition disabled:bg-slate-600"
            >
              Send
            </button>
          </form>
           {error && <p className="text-rose-400 text-xs mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
