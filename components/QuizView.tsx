
import React, { useState } from 'react';
import { Quiz, ApiConfig, UserAnswer } from '../types';
import QuestionCard from './QuestionCard';
import ResultsScreen from './ResultsScreen';

interface QuizViewProps {
  quiz: Quiz;
  apiConfig: ApiConfig;
  onQuizComplete: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, apiConfig, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const handleAnswered = (answer: UserAnswer) => {
    setUserAnswers(prev => [...prev, answer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  if (isQuizFinished) {
    return <ResultsScreen quiz={quiz} userAnswers={userAnswers} onTryAgain={onQuizComplete} />;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = userAnswers.some(a => a.questionId === currentQuestion.id);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">{quiz.subject} Quiz</h1>
        <p className="text-slate-400 mt-2">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        apiConfig={apiConfig}
        onAnswered={handleAnswered}
      />
      
      {isCurrentQuestionAnswered && (
        <div className="mt-6 text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-700 transition-transform transform hover:scale-105"
          >
            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
