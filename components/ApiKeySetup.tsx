
import React, { useState } from 'react';
import { ApiConfig, Provider } from '../types';
import { OPENROUTER_FREE_MODELS } from '../constants';

interface ApiKeySetupProps {
  onConfigSubmit: (config: ApiConfig) => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onConfigSubmit }) => {
  const [provider, setProvider] = useState<Provider>(Provider.Gemini);
  const [geminiKey, setGeminiKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [openRouterModel, setOpenRouterModel] = useState(OPENROUTER_FREE_MODELS[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (provider === Provider.Gemini && !geminiKey.trim()) {
      setError('Please enter a Gemini API Key.');
      return;
    }
    if (provider === Provider.OpenRouter && !openRouterKey.trim()) {
      setError('Please enter an OpenRouter API Key.');
      return;
    }
    setError('');
    onConfigSubmit({
      provider,
      geminiKey,
      openRouterKey,
      openRouterModel,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">IT Quiz Hub</h1>
        <p className="text-center text-slate-400 mb-6">Enter your API keys to begin.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-slate-300 mb-2 font-semibold">Select Provider</label>
            <div className="flex space-x-4 rounded-lg bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => setProvider(Provider.Gemini)}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${provider === Provider.Gemini ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
              >
                Gemini
              </button>
              <button
                type="button"
                onClick={() => setProvider(Provider.OpenRouter)}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${provider === Provider.OpenRouter ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
              >
                OpenRouter
              </button>
            </div>
          </div>

          {provider === Provider.Gemini && (
            <div className="mb-4">
              <label htmlFor="gemini-key" className="block text-slate-300 mb-2">Gemini API Key</label>
              <input
                id="gemini-key"
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your Gemini API Key"
              />
            </div>
          )}

          {provider === Provider.OpenRouter && (
            <>
              <div className="mb-4">
                <label htmlFor="openrouter-key" className="block text-slate-300 mb-2">OpenRouter API Key</label>
                <input
                  id="openrouter-key"
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your OpenRouter API Key"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="openrouter-model" className="block text-slate-300 mb-2">Select a Free Model</label>
                <select
                  id="openrouter-model"
                  value={openRouterModel}
                  onChange={(e) => setOpenRouterModel(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {OPENROUTER_FREE_MODELS.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && <p className="text-rose-400 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
          >
            Save and Start
          </button>
           <p className="text-xs text-slate-500 text-center mt-4">Note: This is a frontend-only demo. API calls are made directly from your browser. Keys are not stored.</p>
        </form>
      </div>
    </div>
  );
};

export default ApiKeySetup;
