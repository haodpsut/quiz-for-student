
import React, { useState, useEffect } from 'react';
import { Question, ApiConfig, UserAnswer } from '../types';
import { checkAnswer } from '../services/geminiService';
import ChatAssistant from './ChatAssistant';

interface QuestionCardProps {
  question: Question;
  apiConfig: ApiConfig;
  onAnswered: (answer: UserAnswer) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
    </div>
);

const QuestionCard: React.FC<QuestionCardProps> = ({ question, apiConfig, onAnswered }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedOption('');
    setFeedback(null);
    setIsLoading(false);
    setError('');
    setIsAnswered(false);
  }, [question]);

  const handleCheckAnswer = async () => {
    if (!selectedOption) {
      setError('Please select an answer.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const result = await checkAnswer(question, selectedOption, apiConfig);
      setFeedback(result);
      setIsAnswered(true);
      onAnswered({
        questionId: question.id,
        answer: selectedOption,
        isCorrect: result.isCorrect,
        explanation: result.explanation
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getOptionClasses = (option: string) => {
    let baseClasses = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed';
    if (!isAnswered) {
        return `${baseClasses} ${selectedOption === option ? 'bg-cyan-800/50 border-cyan-500' : 'bg-slate-800 border-slate-700 hover:border-cyan-600'}`;
    }
    // After answering
    if (option === question.answer) {
        return `${baseClasses} bg-emerald-800/50 border-emerald-500`;
    }
    if (option === selectedOption && option !== question.answer) {
        return `${baseClasses} bg-rose-800/50 border-rose-500`;
    }
    return `${baseClasses} bg-slate-800 border-slate-700 disabled:opacity-60`;
  };

  return (
    <div className="bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl w-full">
      <p className="text-lg font-semibold text-slate-300 mb-4">{question.question}</p>
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            disabled={isAnswered}
            className={getOptionClasses(option)}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>
      
      {error && <p className="text-rose-400 text-center mb-4">{error}</p>}

      {!isAnswered && (
        <button
          onClick={handleCheckAnswer}
          disabled={isLoading || !selectedOption}
          className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : 'Check Answer'}
        </button>
      )}

      {isAnswered && feedback && (
        <div className={`p-4 rounded-lg mt-4 border-2 ${feedback.isCorrect ? 'bg-emerald-900/50 border-emerald-500' : 'bg-rose-900/50 border-rose-500'}`}>
          <h3 className={`text-xl font-bold ${feedback.isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
            {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          <p className="text-slate-300 mt-2 whitespace-pre-wrap">{feedback.explanation}</p>
        </div>
      )}

      {isAnswered && (
         <ChatAssistant 
            apiConfig={apiConfig}
            context={{ question: question.question, answer: question.answer }} 
         />
      )}
    </div>
  );
};

export default QuestionCard;
