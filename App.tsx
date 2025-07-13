
import React, { useState, useCallback, useEffect } from 'react';
import { ApiConfig, Quiz } from './types';
import ApiKeySetup from './components/ApiKeySetup';
import SubjectSelector from './components/SubjectSelector';
import QuizView from './components/QuizView';
import { generateQuiz } from './services/geminiService';

type AppState = 'apiKeySetup' | 'subjectSelection' | 'loadingQuiz' | 'quizTaking' | 'error';

const LoadingScreen: React.FC<{ text: string }> = ({ text }) => (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-400 border-slate-600 rounded-full animate-spin"></div>
        <p className="text-xl text-slate-300 mt-6">{text}</p>
    </div>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('apiKeySetup');
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string>('');

  const handleConfigSubmit = (config: ApiConfig) => {
    setApiConfig(config);
    setAppState('subjectSelection');
  };

  const handleSelectSubject = useCallback(async (subject: string) => {
    if (!apiConfig) {
        setError("API configuration is missing.");
        setAppState('error');
        return;
    }
    setAppState('loadingQuiz');
    setError('');
    try {
        const quiz = await generateQuiz(subject, apiConfig);
        setCurrentQuiz(quiz);
        setAppState('quizTaking');
    } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred while generating the quiz.");
        setAppState('error');
    }
  }, [apiConfig]);

  const resetToSubjectSelection = () => {
    setCurrentQuiz(null);
    setAppState('subjectSelection');
  };
  
  const renderContent = () => {
    switch(appState) {
        case 'apiKeySetup':
            return <ApiKeySetup onConfigSubmit={handleConfigSubmit} />;
        case 'subjectSelection':
            return <SubjectSelector onSelectSubject={handleSelectSubject} />;
        case 'loadingQuiz':
            return <LoadingScreen text="Generating your quiz, please wait..." />;
        case 'quizTaking':
            if (currentQuiz && apiConfig) {
                return <QuizView quiz={currentQuiz} apiConfig={apiConfig} onQuizComplete={resetToSubjectSelection} />;
            }
            setError("Something went wrong, quiz data is missing.");
            setAppState('error');
            return null; // Fallthrough to error state
        case 'error':
            return (
                <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                    <h2 className="text-2xl font-bold text-rose-400">An Error Occurred</h2>
                    <p className="text-slate-300 mt-2 max-w-md">{error}</p>
                    <button
                        onClick={() => setAppState('subjectSelection')}
                        className="mt-6 bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-cyan-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        default:
            return <ApiKeySetup onConfigSubmit={handleConfigSubmit} />;
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 font-sans">
      <div className="container mx-auto py-8">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
