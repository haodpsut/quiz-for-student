
import React from 'react';
import { Quiz, UserAnswer } from '../types';
import Leaderboard from './Leaderboard';

interface ResultsScreenProps {
  quiz: Quiz;
  userAnswers: UserAnswer[];
  onTryAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ quiz, userAnswers, onTryAgain }) => {
  const correctAnswersCount = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = quiz.questions.length;
  const score = Math.round((correctAnswersCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
        <h1 className="text-4xl font-extrabold text-cyan-400">Quiz Complete!</h1>
        <p className="text-slate-300 text-lg mt-2">Here's how you did on the {quiz.subject} quiz.</p>
        
        <div className="my-8">
            <div className={`text-6xl font-bold ${score > 70 ? 'text-emerald-400' : score > 40 ? 'text-yellow-400' : 'text-rose-400'}`}>
                {score}%
            </div>
            <p className="text-xl text-slate-300 mt-2">You answered {correctAnswersCount} out of {totalQuestions} questions correctly.</p>
        </div>
        
        <button
          onClick={onTryAgain}
          className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-700 transition-transform transform hover:scale-105 mb-10"
        >
          Try Another Quiz
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Review Your Answers</h2>
        <div className="space-y-4">
          {quiz.questions.map(question => {
            const userAnswer = userAnswers.find(a => a.questionId === question.id);
            const isCorrect = userAnswer?.isCorrect;
            return (
              <div key={question.id} className={`p-4 rounded-lg border-2 ${isCorrect ? 'bg-emerald-900/30 border-emerald-700' : 'bg-rose-900/30 border-rose-700'}`}>
                <p className="font-semibold text-slate-300">{question.question}</p>
                <p className={`mt-2 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Your answer: <span className="font-mono">{userAnswer?.answer || 'Not answered'}</span> {isCorrect ? '✔' : '✖'}
                </p>
                {!isCorrect && <p className="text-slate-400 mt-1">Correct answer: <span className="font-mono">{question.answer}</span></p>}
                <p className="text-xs text-slate-400 mt-2 italic">{userAnswer?.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <Leaderboard />
    </div>
  );
};

export default ResultsScreen;
